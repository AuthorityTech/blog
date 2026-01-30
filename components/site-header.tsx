"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const MAIN_SITE = "https://authoritytech.io";
const APP_VISIBILITY_AUDIT = "https://app.authoritytech.io/visibility-audit";
const BOOK_CALL = "https://cal.com/christian-lehman-at/30min?overlayCalendar=true";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 border-b border-border bg-background pt-[env(safe-area-inset-top)]">
      <div className="h-14 w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center flex-shrink-0">
            <Link
              href={MAIN_SITE}
              className="flex items-center p-0 transition-opacity duration-150 ease-out hover:opacity-80 focus:outline-none focus:ring-1 focus:ring-border focus:ring-offset-0 rounded"
              aria-label="AuthorityTech home"
            >
              <Image
                src="/logo.png"
                alt=""
                width={100}
                height={20}
                className="block h-5 w-auto object-contain object-left leading-none invert dark:invert-0"
                priority
              />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={APP_VISIBILITY_AUDIT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-medium font-ui border border-border bg-background text-foreground transition-opacity duration-150 ease-out hover:opacity-80 focus:outline-none focus:ring-1 focus:ring-border focus:ring-offset-0"
            >
              <span className="hidden sm:inline">AI visibility</span>
              <span className="sm:hidden">App</span>
            </a>
            <a
              href={BOOK_CALL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-medium font-ui border border-border bg-background text-foreground transition-opacity duration-150 ease-out hover:opacity-80 focus:outline-none focus:ring-1 focus:ring-border focus:ring-offset-0"
            >
              Book call
            </a>
            <ThemeToggle variant="inline" />
          </div>
        </div>
      </div>
    </header>
  );
}
