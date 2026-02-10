import { google } from 'googleapis';
import { cache } from 'react';

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

// BEAST MODE: Cache the entire sheet fetch for the duration of the build
export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    console.log('Fetching fresh posts from Google Sheets...');
    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:K`,
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
          topic: post.topic || '',
        };
      })
      .filter((post) => post.slug && post.title)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
});

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  // This now uses the cached result from getAllPosts()
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

