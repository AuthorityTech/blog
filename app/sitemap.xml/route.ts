import { getAllPosts } from '@/lib/sheets';

export const revalidate = 3600;

export async function GET() {
  const posts = await getAllPosts();
  const baseUrl = 'https://blog.authoritytech.io';

  const postEntries = posts
    .map((post) => {
      const imageTag = post.featuredImage
        ? `<image:image><image:loc>${escapeXml(post.featuredImage)}</image:loc>${post.featuredImageAlt ? `<image:caption>${escapeXml(post.featuredImageAlt)}</image:caption>` : ''}</image:image>`
        : '';
      return `<url><loc>${baseUrl}/${post.slug}</loc><lastmod>${new Date(post.publishDate).toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority>${imageTag}</url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
<url><loc>${baseUrl}</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>daily</changefreq><priority>1</priority></url>
${postEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
