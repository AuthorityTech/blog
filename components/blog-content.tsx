"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/sheets";

const POSTS_PER_PAGE = 9;

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function getUniqueTopics(posts: BlogPost[]): string[] {
  const topics = new Set<string>();
  posts.forEach((p) => {
    if (p.topic?.trim()) topics.add(p.topic.trim());
  });
  return Array.from(topics).sort();
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/${post.slug}`}
      className={cn(
        "group block overflow-hidden rounded-lg border border-border bg-card opacity-90",
        "transition-[opacity] duration-150 ease-out hover:opacity-90",
        "focus:outline-none focus:ring-1 focus:ring-border focus:ring-offset-0"
      )}
    >
      {post.featuredImage && (
        <div className="relative w-full h-44 overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            fill
            className="object-cover dark:contrast-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[#1f1a14]/25 dark:bg-black/30"
            aria-hidden
          />
        </div>
      )}
      <div className="p-5">
        {post.topic && (
          <span className="text-3xs font-medium tracking-wide uppercase font-ui text-muted-foreground">
            {post.topic}
          </span>
        )}
        <h2 className="mt-2 font-serif font-medium text-foreground text-balance text-lg line-clamp-3">
          {post.title}
        </h2>
        <p className="mt-2 text-sm font-ui text-muted-foreground text-pretty line-clamp-2">
          {post.description}
        </p>
        <time className="mt-4 block text-xs font-ui text-muted-foreground tabular-nums">
          {new Date(post.publishDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
    </Link>
  );
}

export function BlogContent({ posts }: { posts: BlogPost[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  const topics = useMemo(() => getUniqueTopics(posts), [posts]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const byTopic = topicFilter
      ? posts.filter((p) => (p.topic?.trim() ?? "") === topicFilter)
      : posts;
    if (!q) return byTopic;
    return byTopic.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.topic && p.topic.toLowerCase().includes(q))
    );
  }, [posts, searchQuery, topicFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedPosts = useMemo(
    () =>
      filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
      ),
    [filteredPosts, currentPage]
  );

  const goToPage = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
  };

  const handleTopicChange = (topic: string) => {
    setTopicFilter(topic);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const pageNumbers = useMemo(() => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | "ellipsis")[] = [];
    const left = currentPage - delta;
    const right = currentPage + delta;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        range.push(i);
      }
    }
    let prev = 0;
    for (const i of range) {
      if (prev !== 0 && i - prev > 1) rangeWithDots.push("ellipsis");
      rangeWithDots.push(i);
      prev = i;
    }
    return rangeWithDots;
  }, [currentPage, totalPages]);

  return (
    <>
      <section
        className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        aria-label="Search and filter"
      >
        <div className="relative flex-1 min-w-0">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none size-4" aria-hidden />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search"
            className={cn(
              "w-full min-h-10 rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm font-ui text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-1 focus:ring-border focus:ring-offset-0"
            )}
            aria-label="Search articles"
            enterKeyHint="search"
            autoComplete="off"
          />
        </div>
        <div className="relative flex items-center shrink-0 w-full sm:w-auto">
          <label htmlFor="topic-filter" className="sr-only">
            Filter by topic
          </label>
          <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
          <select
            id="topic-filter"
            value={topicFilter}
            onChange={(e) => handleTopicChange(e.target.value)}
            className={cn(
              "w-full sm:w-auto min-w-[140px] min-h-10 rounded-md border border-border bg-card py-2 pl-3 pr-9 text-sm font-ui text-foreground cursor-pointer appearance-none",
              "focus:outline-none focus:ring-1 focus:ring-border focus:ring-offset-0"
            )}
            aria-label="Filter by topic"
          >
            <option value="">All topics</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
      </section>

      <p className="text-xs font-ui text-muted-foreground mb-6 tabular-nums">
        {filteredPosts.length === 0
          ? "No articles"
          : `${filteredPosts.length} article${filteredPosts.length !== 1 ? "s" : ""}`}
        {totalPages > 1 && ` · ${currentPage} / ${totalPages}`}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm font-ui text-muted-foreground text-pretty">
            No posts match your filters.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <nav
          className="mt-12 flex items-center justify-center gap-4"
          aria-label="Pagination"
        >
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex items-center gap-1.5 rounded-md py-2 px-2.5 text-sm font-ui text-muted-foreground transition-opacity duration-150 ease-out hover:opacity-100 disabled:opacity-40 focus:outline-none focus:ring-1 focus:ring-border focus:ring-offset-0"
            aria-label="Previous page"
          >
            <ChevronLeftIcon />
            <span>Previous</span>
          </button>
          <span className="text-xs font-ui text-muted-foreground tabular-nums">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center gap-1.5 rounded-md py-2 px-2.5 text-sm font-ui text-muted-foreground transition-opacity duration-150 ease-out hover:opacity-100 disabled:opacity-40 focus:outline-none focus:ring-1 focus:ring-border focus:ring-offset-0"
            aria-label="Next page"
          >
            <span>Next</span>
            <ChevronRightIcon />
          </button>
        </nav>
      )}
    </>
  );
}
