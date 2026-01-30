# AuthorityTech Blog

Self-hosted blog for authoritytech.io, powered by Next.js 15 and Google Sheets.

## Features

- ✅ Server-side rendered blog posts
- ✅ Pulls content directly from Google Sheets
- ✅ Automatic SEO (meta tags, JSON-LD schema)
- ✅ Automatic sitemap generation
- ✅ Fast, clean design
- ✅ Image optimization with Next.js Image
- ✅ Incremental Static Regeneration (ISR) - revalidates every 5 minutes

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add environment variables (`.env.local`):
   ```
   GOOGLE_SHEETS_CREDENTIALS=<service account JSON>
   GOOGLE_SHEET_ID=<sheet ID>
   GOOGLE_SHEET_NAME=<sheet name>
   ```

3. Run locally:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables
4. Deploy

## Routing Setup

To serve this at `authoritytech.io/blog`:

### Option 1: Cloudflare Workers (Recommended)
Route `/blog/*` to the Vercel deployment URL.

### Option 2: Vercel Rewrites
Set `basePath: '/blog'` in `next.config.ts`.

### Option 3: Framer Reverse Proxy
Keep Framer at `/`, proxy `/blog/*` to this app.

## Content Source

All content comes from the Google Sheet specified in `GOOGLE_SHEET_ID`.

Sheet columns:
- title
- slug
- description
- featured-image (full GCS URL)
- featured-image-alt
- featured-image-filename
- publish-date (YYYY-MM-DD)
- body (HTML)
- json-ld-schema (JSON string)
- topic (optional)

## Performance

- Static generation with ISR (300s revalidation)
- Image optimization via Next.js
- Minimal JavaScript bundle
- Fast initial load
