# Theorem of Kemet — Frontend-Only Guide

Theorem of Kemet now runs as a **static Vite + React site**. Articles, categories, sources, images, and the public archive are read from JSON bundled into the browser. There is no runtime server, database, Supabase connection, OAuth dependency, tRPC request, or Drizzle migration required for the public site.

## Where to edit content

The central content file is:

```text
client/src/data/articles.json
```

Each object in the `articles` array represents one public journal record. The current adapter in `client/src/lib/staticJournal.ts` maps this JSON into the richer case-file shape used by the existing pages, so the visual structure and routes remain unchanged.

| JSON field | What to change | Where it appears |
| --- | --- | --- |
| `slug` | Lowercase URL-safe identifier such as `the-dendera-light` | The route `/journal/:slug` and links |
| `title` | Main article title | Home cards, Journal, Case Index, reader |
| `category` | Shelf/category label | Filters, cards, breadcrumbs, archive metadata |
| `date` | Display date string | Article metadata and archive context |
| `excerpt` | Short editorial summary | Cards, empty previews, search text |
| `keyQuestion` | The central research question | Article opening and curator-style notes |
| `image` | Public image URL, including a Google Drive render URL if available | Polaroid evidence image and article hero |
| `tone` | Existing visual tone, currently `night`, `blue`, or another supported value | Palette selection in the reader adapter |
| `sections` | Ordered long-form sections | Article reader body |
| `sections[].heading` | Section heading | Article reader navigation and body |
| `sections[].paragraphs` | Array of paragraphs for that section | Article reader body |
| `sections[].pullQuote` | Pull quote shown as a visual interruption | Article reader layout |
| `sources` | Array of source cards | Evidence board and source trail |
| `sources[].label` | Human-readable source name | Source card label |
| `sources[].url` | Public URL readers can inspect | Source-card link |
| `sources[].note` | Why the source matters | Evidence/source detail |

After editing the JSON, run `pnpm dev` to preview the changes. The Vite watcher reloads the page when the file changes. Before publishing, run `pnpm check` and `pnpm build`.

## Adding a new article

Copy an existing article object in `articles.json`, assign a unique `slug`, replace the title, category, date, excerpt, image, question, sections, and sources, then save. Do not reuse a slug. A new entry automatically becomes available to the Journal shelf, Case Index, article route, source trail, evidence board, search text, and map adapter.

The current static adapter assigns a small amount of editorial metadata that used to be stored in the database: case number, evidence score, status, location, era, credibility, symbol, and map coordinates. These defaults are defined in `client/src/lib/staticJournal.ts` in the `entryMeta` array. To make these fields directly editable per article, add them to `articles.json` and extend the `Article` type plus the adapter mapping in that file.

## Images and Google Drive

Use a public image URL in `image`. For Google Drive, set sharing to “Anyone with the link” and use the existing Drive image helper format accepted by the project. The image is presented through the existing adaptive Polaroid treatment. A broken or private URL will show the browser’s image fallback rather than being repaired by a backend service.

## Reader letters

The “Submit a theory” page is now a local-only interaction. It stores letters in `localStorage` under `kemet-reader-letters` on the current browser. It does **not** email Om, write to JSON, or transmit data. The static curator desk can display those letters while that browser retains them. To make a letter part of the site, copy its useful prompt into `articles.json`, rewrite it as an evidenced article, and rebuild the site.

## Curator desk and puzzle gate

The curator desk is a read-only preview and content guide in this version because a deployed static website cannot write back into its bundled JSON files. The relic gate remains available for the private desk interaction. The default local override is `Pass@123`; it is stored only as an editable browser preference if changed in future work. The desk does not provide durable server security, so it should be treated as an editorial convenience rather than an access-control boundary.

## Deployment to GitHub and Vercel

The project is now a normal static Vite project. Upload the source repository to GitHub, connect it to Vercel, and use the following settings if Vercel does not detect them automatically:

| Setting | Value |
| --- | --- |
| Install command | `pnpm install` |
| Build command | `pnpm build` |
| Output directory | `dist/public` |
| Node version | 20 or newer |

No database environment variables are required for the public site. Do not commit `.env` files, passwords, private image URLs, or private source material. The build output is generated from the JSON and source files during deployment.

## What changed in the migration

The public Journal, Case Index, Journal Entry, Investigation Map, and Submit Theory routes now use local data. The former server, database, tRPC, Drizzle, Supabase, OAuth, and serverless runtime files were removed from the working project. Existing animation, page-turn, parallax, magnification, evidence-board, source-ordering, archive filtering, and route structure were intentionally retained.
