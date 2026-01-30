import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/sheets';
import type { Metadata } from 'next';

export const revalidate = 300; // Revalidate every 5 minutes

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: 'article',
      publishedTime: post.publishDate,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-dvh bg-background">
      {post.jsonLdSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: post.jsonLdSchema }}
        />
      )}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm font-ui text-muted-foreground transition-opacity duration-150 ease-out hover:opacity-80 focus:outline-none focus:ring-1 focus:ring-border focus:ring-offset-0 rounded-md"
          >
            ← Back
          </Link>
        </div>
        {post.featuredImage && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden mb-8 border border-border">
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 896px"
            />
          </div>
        )}

        {post.topic && (
          <span className="text-3xs font-medium tracking-wide uppercase font-ui text-muted-foreground">
            {post.topic}
          </span>
        )}

        <h1 className="mt-2 text-2xl font-medium tracking-tight font-serif text-foreground text-balance">
          {post.title}
        </h1>

        <p className="mt-3 text-sm font-ui text-muted-foreground text-pretty">
          {post.description}
        </p>

        <time className="mt-6 block text-xs font-ui text-muted-foreground tabular-nums border-b border-border pb-6">
          {new Date(post.publishDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>

        <div
          className="prose prose-sm max-w-none font-ui mt-8"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </article>

      <footer className="border-t border-border mt-24 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center text-muted-foreground font-ui text-xs">
          <p>© {new Date().getFullYear()} AuthorityTech</p>
        </div>
      </footer>
    </div>
  );
}
