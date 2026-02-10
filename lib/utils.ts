import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BLOG_BASE_URL = "https://blog.authoritytech.io";

/**
 * Returns true if a node is a valid FAQPage with at least one well-formed Question.
 */
function isValidFaqPage(node: Record<string, unknown>): boolean {
  const t = node["@type"];
  const isFaq =
    t === "FAQPage" ||
    (Array.isArray(t) && t.includes("FAQPage"));
  if (!isFaq) return true; // not an FAQ node — keep it

  const mainEntity = node.mainEntity;
  if (!Array.isArray(mainEntity) || mainEntity.length === 0) return false;

  // Keep only questions that have both a non-empty name and answer text
  const validQuestions = (mainEntity as Record<string, unknown>[]).filter(
    (q) =>
      q["@type"] === "Question" &&
      typeof q.name === "string" &&
      q.name.trim().length > 0 &&
      q.acceptedAnswer &&
      typeof (q.acceptedAnswer as Record<string, unknown>).text === "string" &&
      ((q.acceptedAnswer as Record<string, unknown>).text as string).trim()
        .length > 0
  );

  if (validQuestions.length === 0) return false;

  // Mutate in place to keep only valid questions
  node.mainEntity = validQuestions;
  return true;
}

/**
 * Normalizes JSON-LD from the sheet so required SEO fields are always correct:
 * mainEntityOfPage (blog.authoritytech.io), dateModified, author (Person).
 * Handles both flat schemas and @graph-based schemas.
 * Strips invalid/empty FAQPage nodes to prevent GSC errors.
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
      // Filter out invalid FAQ nodes from the graph
      data["@graph"] = (data["@graph"] as Record<string, unknown>[]).filter(
        isValidFaqPage
      );

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
    } else {
      // Flat schema — if it's an FAQPage itself, validate it
      if (!isValidFaqPage(data)) {
        // Invalid FAQ-only schema — return empty
        return "";
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
