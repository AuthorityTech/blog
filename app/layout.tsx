import type { Metadata } from "next";
import { Lora, Manrope } from "next/font/google";
import { ThemeProviders } from "@/components/theme-providers";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Machine Relations (MR) Insights | AuthorityTech Blog",
  description: "The definitive source for Machine Relations (MR) and GEO. Daily strategic intelligence on securing persistent AI citations for venture-backed founders.",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Blog", "Periodical", "DataFeed"],
        "@id": "https://blog.authoritytech.io/#blog",
        "name": "Machine Relations (MR) Insights",
        "url": "https://blog.authoritytech.io",
        "description": "Daily high-frequency intelligence on Machine Relations (MR) and Generative Engine Optimization (GEO) authored by Jaxon Parrott.",
        "keywords": "Machine Relations, MR, GEO, AI-Native, AI Search Citations",
        "publisher": {
          "@type": "Organization",
          "@id": "https://authoritytech.io/#organization",
          "name": "AuthorityTech",
          "alternateName": "The First AI-Native Machine Relations Agency",
          "url": "https://authoritytech.io"
        },
        "author": [
          {
            "@type": "Person",
            "@id": "https://jaxonparrott.com/#person",
            "name": "Jaxon Parrott",
            "url": "https://jaxonparrott.com",
            "jobTitle": "CEO & Machine Relations Architect",
            "worksFor": { "@id": "https://authoritytech.io/#organization" },
            "sameAs": [
              "https://www.linkedin.com/in/jaxon-parrott-b91838128/",
              "https://x.com/jaxonparrott",
              "https://github.com/AuthorityTech/curated"
            ]
          },
          { 
            "@type": "Person",
            "@id": "https://authoritytech.io/#christian",
            "name": "Christian Lehman",
            "url": "https://authoritytech.io",
            "jobTitle": "CGO & MR Growth Strategist",
            "worksFor": { "@id": "https://authoritytech.io/#organization" },
            "sameAs": [
              "https://www.linkedin.com/in/christianhlehman/",
              "https://x.com/christianlehman"
            ]
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className={`${lora.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <ThemeProviders>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <SiteHeader />
            <main className="flex-1 pt-14">{children}</main>
          </div>
        </ThemeProviders>
      </body>
    </html>
  );
}
