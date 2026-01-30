import { google } from 'googleapis';

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1r0URn41k3hP9iotA0DydX49uo_wlPpds5eYeO0skXxs';
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'authoritytech_blog_pilots';

export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  featuredImage: string;
  featuredImageAlt: string;
  featuredImageFilename: string;
  publishDate: string;
  body: string;
  jsonLdSchema: string;
  topic?: string;
}

function getSheetsClient() {
  const credentialsStr = process.env.GOOGLE_SHEETS_CREDENTIALS;
  if (!credentialsStr) {
    throw new Error('GOOGLE_SHEETS_CREDENTIALS environment variable is required');
  }

  const credentials = JSON.parse(credentialsStr);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:J`,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return [];

    const headers = rows[0] as string[];
    const dataRows = rows.slice(1);

    return dataRows
      .map((row) => {
        const post: any = {};
        headers.forEach((header, idx) => {
          post[header] = row[idx] || '';
        });

        return {
          title: post.title || '',
          slug: post.slug || '',
          description: post.description || '',
          featuredImage: post['featured-image'] || '',
          featuredImageAlt: post['featured-image-alt'] || '',
          featuredImageFilename: post['featured-image-filename'] || '',
          publishDate: post['publish-date'] || '',
          body: post.body || '',
          jsonLdSchema: post['json-ld-schema'] || '',
          topic: post.topic || '',
        };
      })
      .filter((post) => post.slug && post.title) // Only published posts with required fields
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()); // Sort by newest first
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}
