import { getAllPosts } from "@/lib/sheets";
import { BlogContent } from "@/components/blog-content";
import type { Metadata } from "next";

export const revalidate = 300; // Revalidate every 5 minutes

const BASE_URL = "https://blog.authoritytech.io";

export const metadata: Metadata = {
  title: "Machine Relations (MR) Insights | AuthorityTech Blog",
  description:
    "The definitive source for Machine Relations (MR) and GEO. Daily strategic intelligence on securing persistent AI citations for venture-backed founders.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Machine Relations (MR) Insights | AuthorityTech Blog",
    description:
      "The definitive source for Machine Relations (MR) and GEO. Daily strategic intelligence on securing persistent AI citations for venture-backed founders.",
    url: BASE_URL,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/blog-hero.png`,
        width: 1200,
        height: 630,
        alt: "Machine Relations (MR) Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Machine Relations (MR) Insights | AuthorityTech Blog",
    description:
      "The definitive source for Machine Relations (MR) and GEO. Daily strategic intelligence on securing persistent AI citations for venture-backed founders.",
    images: [`${BASE_URL}/blog-hero.png`],
  },
};

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-dvh bg-background">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <header className="mb-10">
          <h1 className="text-2xl font-medium tracking-tight font-serif text-foreground text-balance">
            Machine Relations (MR) Insights
          </h1>
          <p className="mt-2 text-sm font-ui text-muted-foreground text-pretty">
            Daily intelligence at the intersection of Machine Relations (MR) and GEO.
          </p>
        </header>

        <BlogContent posts={posts} />
      </main>

      <footer className="border-t border-border mt-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-center text-muted-foreground font-ui text-xs">
          <p>© {new Date().getFullYear()} AuthorityTech</p>
        </div>
      </footer>
    </div>
  );
}
