import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BLOG_BASE_URL = "https://blog.authoritytech.io";

/**
 * Normalizes JSON-LD from the sheet so required SEO fields are always correct:
 * mainEntityOfPage (blog.authoritytech.io), dateModified, author (Person).
 * Handles both flat schemas and @graph-based schemas.
 */
export function normalizeBlogPostJsonLd(
  jsonLdSchema: string,
  slug: string,
  publishDate: string
): string {
  try {
    const data = JSON.parse(jsonLdSchema) as Record<string, unknown>;
    const postUrl = `${BLOG_BASE_URL}/${slug}`;

    // Determine the target node: if @graph exists, find the Article/BlogPosting node
    let target: Record<string, unknown> = data;

    if (Array.isArray(data["@graph"])) {
      const graph = data["@graph"] as Record<string, unknown>[];
      const article = graph.find((node) => {
        const t = node["@type"];
        return (
          t === "Article" ||
          t === "BlogPosting" ||
          (Array.isArray(t) &&
            (t.includes("Article") || t.includes("BlogPosting")))
        );
      });
      if (article) {
        target = article;
      }
    }

    target.mainEntityOfPage = {
      "@type": "WebPage",
      "@id": postUrl,
    };

    if (!target.dateModified && target.datePublished) {
      target.dateModified = target.datePublished;
    } else if (!target.dateModified) {
      target.dateModified = publishDate;
    }

    target.author = {
      "@type": "Person",
      name: "Jaxon Parrott",
    };

    return JSON.stringify(data);
  } catch {
    return jsonLdSchema;
  }
}
