import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/sheets';

export const revalidate = 300; // Revalidate every 5 minutes

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900">AuthorityTech Blog</h1>
          <p className="mt-2 text-lg text-gray-600">
            Performance PR & Earned Media ROI
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${post.slug}`}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {post.featuredImage && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.featuredImageAlt || post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-6">
                {post.topic && (
                  <span className="inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full mb-3">
                    {post.topic}
                  </span>
                )}
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="mt-2 text-gray-600 line-clamp-3">{post.description}</p>
                <time className="mt-4 block text-sm text-gray-500">
                  {new Date(post.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet.</p>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 mt-24">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>© {new Date().getFullYear()} AuthorityTech. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
