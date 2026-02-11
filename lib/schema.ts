import type { BlogPost } from "./sheets";

const BLOG_BASE_URL = "https://blog.authoritytech.io";

// ── Author & Publisher (hardcoded entity signals) ───────────────

const AUTHOR = {
  "@type": "Person" as const,
  name: "Jaxon Parrott",
  url: "https://jaxonparrott.com",
  jobTitle: "Founder & CEO",
  worksFor: {
    "@id": "https://authoritytech.io/#organization",
  },
  sameAs: [
    "https://x.com/jaxonparrott",
    "https://linkedin.com/in/jaxonparrott",
    "https://github.com/jaxonparrott",
    "https://www.entrepreneur.com/author/jaxon-parrott",
    "https://www.crunchbase.com/person/jaxon-parrott",
  ],
};

const PUBLISHER = {
  "@type": "Organization" as const,
  "@id": "https://authoritytech.io/#organization",
  name: "AuthorityTech",
  description: "The First AI-Native Machine Relations Agency",
  url: "https://authoritytech.io",
  logo: {
    "@type": "ImageObject" as const,
    url: "https://authoritytech.io/logo.png",
  },
  sameAs: [
    "https://machinerelations.ai",
    "https://x.com/authoritytechio",
    "https://linkedin.com/company/authoritytech",
    "https://github.com/AuthorityTech",
    "https://www.inc.com/profile/authoritytech",
    "https://www.crunchbase.com/organization/authoritytech",
  ],
};

// ── FAQ extraction from HTML body ───────────────────────────────

interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Parses FAQ items from the post HTML body.
 *
 * Detection: looks for an <h2> containing "FAQ" (case-insensitive),
 * then extracts subsequent <h3> (question) + following <p> (answer) pairs
 * until the next <h2> or end of content.
 *
 * Only generates FAQPage schema when real Q&A pairs are found.
 */
function extractFaqFromHtml(html: string): FaqItem[] {
  // Find the FAQ section start (h2 containing "FAQ")
  const faqHeaderRegex =
    /<h2[^>]*>([^<]*(?:FAQ|Frequently Asked)[^<]*)<\/h2>/i;
  const faqMatch = faqHeaderRegex.exec(html);
  if (!faqMatch) return [];

  // Get content after the FAQ h2 until next h2 or end
  const startIdx = faqMatch.index + faqMatch[0].length;
  const nextH2 = html.indexOf("<h2", startIdx);
  const faqSection =
    nextH2 === -1 ? html.slice(startIdx) : html.slice(startIdx, nextH2);

  // Extract h3 + p pairs as Q&A
  const items: FaqItem[] = [];
  const qaPairRegex =
    /<h3[^>]*>\s*(.*?)\s*<\/h3>\s*([\s\S]*?)(?=<h3|$)/gi;

  let match: RegExpExecArray | null;
  while ((match = qaPairRegex.exec(faqSection)) !== null) {
    const question = stripHtml(match[1]).trim();
    // Collect all <p> content as the answer
    const answerBlock = match[2];
    const paragraphs: string[] = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pMatch: RegExpExecArray | null;
    while ((pMatch = pRegex.exec(answerBlock)) !== null) {
      const text = stripHtml(pMatch[1]).trim();
      if (text) paragraphs.push(text);
    }
    const answer = paragraphs.join(" ");

    if (question && answer) {
      items.push({ question, answer });
    }
  }

  return items;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
}

// ── Main schema generator ───────────────────────────────────────

/**
 * Generates deterministic JSON-LD from post fields.
 * No Sheets JSON-LD column needed — everything derived from structured data.
 *
 * Always generates: BlogPosting
 * Conditionally generates: FAQPage (only if real FAQ Q&A pairs detected in body)
 */
export function generateJsonLd(post: BlogPost): string {
  const postUrl = `${BLOG_BASE_URL}/${post.slug}`;

  const blogPosting = {
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.publishDate + "T12:00:00Z").toISOString(),
    dateModified: new Date(post.publishDate + "T12:00:00Z").toISOString(),
    author: AUTHOR,
    publisher: PUBLISHER,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    ...(post.featuredImage
      ? {
          image: {
            "@type": "ImageObject",
            url: post.featuredImage,
            ...(post.featuredImageAlt ? { caption: post.featuredImageAlt } : {}),
          },
        }
      : {}),
    isPartOf: {
      "@type": "Blog",
      "@id": `${BLOG_BASE_URL}/#blog`,
      name: "MR Insights",
      publisher: { "@id": "https://authoritytech.io/#organization" },
    },
  };

  const graph: Record<string, unknown>[] = [blogPosting];

  // Conditionally add FAQPage — body-parsed only
  const faqItems = extractFaqFromHtml(post.body);
  if (faqItems.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${postUrl}#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  });
}
