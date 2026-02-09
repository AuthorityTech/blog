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
  title: "AuthorityTech Blog | Performance PR & AI Visibility",
  description: "Daily insights at the intersection of performance PR and AI visibility. Practical guidance for founders on earned media and how PR actually works.",
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
        "name": "AuthorityTech Blog",
        "url": "https://blog.authoritytech.io",
        "description": "Daily high-frequency insights on Performance PR, GEO, and AI Search visibility from Jaxon Parrott.",
        "keywords": "GEO, AI Visibility, Generative Engine Optimization, Performance PR, Earned Media",
        "publisher": {
          "@type": "Organization",
          "@id": "https://authoritytech.io/#organization",
          "name": "AuthorityTech",
          "url": "https://authoritytech.io"
        },
        "author": [
          {
            "@type": "Person",
            "@id": "https://jaxonparrott.com/#person",
            "name": "Jaxon Parrott",
            "url": "https://jaxonparrott.com",
            "jobTitle": "CEO",
            "worksFor": { "@id": "https://authoritytech.io/#organization" }
          },
          { 
            "@type": "Person",
            "@id": "https://authoritytech.io/#christian",
            "name": "Christian Lehman",
            "url": "https://authoritytech.io",
            "jobTitle": "CGO",
            "worksFor": { "@id": "https://authoritytech.io/#organization" }
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
      <body className="antialiased font-ui text-foreground bg-background">
        <ThemeProviders>
          <SiteHeader />
          <div className="relative z-10 pt-14">{children}</div>
        </ThemeProviders>
      </body>
    </html>
  );
}
