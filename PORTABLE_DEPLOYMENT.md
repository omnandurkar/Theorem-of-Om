# Theorem of Kemet — Portable Export and External Hosting Guide

This project is a **full-stack React, Express, tRPC, Drizzle, and MySQL application**. The downloadable export contains the source code, database migrations, maintained product documentation, and locally copied visual assets so it can be opened directly in VS Code and committed to GitHub.

> **Important:** The export is portable source code, not a one-click Vercel deployment. The current backend was built in the Manus runtime and must be adapted into Vercel serverless routes, or deployed as a normal Node server on a provider such as Railway or Render. Do not upload this project’s secrets to GitHub.

## What Is Already Included

| Included item | Location in the export | Purpose |
|---|---|---|
| Frontend and backend source | `client/`, `server/`, `shared/` | The complete journal, Om desk, puzzle gate, Field Folio, evidence inspector, source-order desk, and APIs. |
| Database schema and migrations | `drizzle/` | The current MySQL tables, including curator credentials and configurable puzzle presets. |
| Local visual assets | `client/public/assets/` | Downloaded hero, signal, sticker, and mark images formerly referenced through Manus storage URLs. |
| Asset rewrite manifest | `PORTABLE_ASSET_MAP.md` | Maps each former Manus storage URL to its local portable asset path. |
| Curator operating handbook | `OM_DESK_HANDBOOK.md` | Om’s living source-of-truth for the desk and all product changes. |
| UX audit | `UX_AUDIT_2026-08-26.md` | Completed role-based usability findings and remediation history. |
| Open-source reference shortlist | `OPEN_SOURCE_REFERENCE_SHORTLIST.md` | License-checked future interaction references and adoption notes. |

## Latest Export State

This refreshed export includes the compact Om’s Favourite collage, the original Field Folio page-turn reader, reader-side close inspection for case evidence prints, real source and related-case context on evidence boards, and Om’s drag-or-button source-ordering desk. No private curator password, session cookie, database credentials, or Manus runtime secret is included.

## Current Database and Supabase Status

**Supabase is not running the product today.** The live journal uses Drizzle with a **MySQL-compatible `DATABASE_URL`**. The installed Supabase package and Supabase connection test are leftover preparation for a possible future migration; no runtime journal, curator, puzzle, reader-letter, or source data is currently read from or written to Supabase.

| Area | Current implementation | Supabase work still required, if chosen |
|---|---|---|
| Case files, sources, categories, reader letters, puzzles | Drizzle + MySQL migrations | Convert MySQL schema/migrations to PostgreSQL and switch the Drizzle driver/connection layer. |
| Curator password and puzzle sessions | MySQL credential/puzzle rows + signed httpOnly cookie | Retain the cookie design; move the credential and puzzle tables to PostgreSQL. |
| Uploaded/static visual assets | Local portable copies plus Google Drive case images | Optionally move assets to Supabase Storage and replace URL handling. |
| Authentication | Custom server-backed curator puzzle/password flow | No Supabase Auth is needed unless Om specifically wants a multi-user account system. |
| Supabase test file | `server/supabase.connection.test.ts` | Remove it, or replace it with real Supabase tests after the migration. |

> **Recommendation:** do not migrate to Supabase before external deployment unless there is a specific reason to use PostgreSQL, Supabase Storage, or Supabase Auth. Deploy the current MySQL design first, then plan a database migration as a separate, tested project.

## Required Environment Variables

Create these values in the external host’s **environment-variable settings**, never in a committed `.env` file.

| Variable | Required now | Purpose |
|---|---:|---|
| `DATABASE_URL` | Yes | Production MySQL-compatible connection string. Use a provider and connection pool compatible with serverless workloads if deploying the API on Vercel. |
| `JWT_SECRET` | Yes | High-entropy secret used to sign curator sessions. Generate a new value for external hosting. |
| `CURATOR_GATE_PASSWORD` | First launch only | Seeds the initial curator password. Once Om changes the password in the desk, the salted database hash becomes the active credential. |
| `NODE_ENV` | Yes | Set to `production` on the host. |
| Manus OAuth / Forge variables | No | The public app and curator puzzle flow no longer need them. They remain in framework files that should be removed during the Vercel conversion. |

## GitHub and VS Code Workflow

Unzip the portable package, open its root in VS Code, and install dependencies with `pnpm install`. Run `pnpm check`, `pnpm test`, and `pnpm build` before committing. Create a private GitHub repository first, then commit the source **without** `.env` files, `node_modules`, or build output.

```bash
pnpm install
pnpm check
pnpm test
pnpm build
git init
git add .
git commit -m "Portable Theorem of Kemet export"
```

## Hosting Decision

| Hosting choice | Fit for the current code | What to do |
|---|---|---|
| **Railway / Render / a Node server** | Best immediate fit | Use the existing `pnpm build` and `pnpm start` scripts, supply the three required variables, and apply the Drizzle migrations to the MySQL database. |
| **Vercel** | Requires an adaptation step | Extract the tRPC/Express API into Vercel serverless functions, remove Manus-specific runtime/Vite plugins, configure pooled MySQL, and keep the frontend as the Vite build output. |
| **Vercel + Supabase** | Requires the largest change | Complete both the serverless API adaptation and the MySQL-to-PostgreSQL/Supabase migration. |

## Vercel Adaptation Checklist

1. Move the API construction out of `server/_core/index.ts` into Vercel-compatible serverless handlers under `api/`.
2. Keep all tRPC procedures server-side and ensure cookies are set with Vercel-compatible response objects.
3. Replace the Manus Vite runtime/debug plugins and unused OAuth bootstrap code.
4. Configure `DATABASE_URL`, `JWT_SECRET`, and `CURATOR_GATE_PASSWORD` in Vercel project settings.
5. Apply the reviewed migrations to the production database before the first public deployment.
6. Replace the portable local-image paths with a CDN or object-storage strategy if image updates will be frequent.

## First External Launch Checklist

Before making the external site public, test one public reader route, one curator-puzzle unlock, one password override, Om’s case-file save flow, reader-letter receipt, the active puzzle change, and a Google Drive case image. Change the seeded curator password immediately after the first successful external login.
