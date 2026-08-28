# Theorem of Kemet — Independent Vercel Deployment Guide

This repository is a **Manus-independent full-stack application**. It uses React, Express, tRPC, Drizzle, and Supabase PostgreSQL. The portable package includes the source code, PostgreSQL migration, local visual assets, and operating documentation so it can be opened in VS Code, committed to GitHub, and deployed to Vercel.

> **Before deploying:** add the four required secrets in Vercel’s encrypted environment-variable settings. Never commit a populated `.env` file, database connection URL, or curator password to GitHub.

## Current Independent Architecture

| Layer | Current implementation |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, GSAP, Wouter. |
| API | Express and tRPC, exported from root `app.ts` for Vercel’s Express runtime. |
| Database | Drizzle with Supabase PostgreSQL. The supplied transaction pooler is used at runtime; the direct pooler is used for migrations. |
| Curator access | Server-verified antechamber puzzle, server-only password seed/hash, signed httpOnly curator cookie, and Cmd/Ctrl + K override. |
| Static images | Eleven visual assets are committed in `client/public/assets/`; client code no longer uses a Manus asset URL or storage proxy. |
| Legacy OAuth | Removed. Readers do not require an account, and Om uses the private curator gateway. |

## What Is Included

| Included item | Location | Purpose |
|---|---|---|
| Frontend and API source | `client/`, `server/`, `shared/`, `app.ts` | Complete journal, curator desk, antechamber, Field Folio, and evidence tools. |
| Vercel configuration | `vercel.json` | Builds Vite output at `dist/public` while Vercel discovers the root Express export. |
| PostgreSQL schema and migration | `drizzle/schema.ts`, `drizzle/pg/` | Current Supabase-compatible Drizzle model and reviewed additive migration. |
| Local image assets | `client/public/assets/` | Hero, cover, evidence, sticker, mark, and Om’s Favourite images. |
| Environment template | `ENVIRONMENT_TEMPLATE.md` | Safe names and formats for local/Vercel configuration. |
| Maintained handbook | `OM_DESK_HANDBOOK.md` | Om’s authoring, curation, and access workflow. |
| Independence record | `MANUS_INDEPENDENCE_MIGRATION.md` | The completed migration decision record and safeguards. |

## Required Vercel Environment Variables

Set these in **Vercel → Project Settings → Environment Variables** for Production, Preview, and Development as appropriate.

| Variable | Required | Purpose |
|---|---:|---|
| `SUPABASE_DATABASE_URL` | Yes | Supabase PostgreSQL transaction-mode pooler, port `6543`, for the deployed API. |
| `SUPABASE_DIRECT_URL` | Yes for migrations | Supabase PostgreSQL session-mode pooler, port `5432`, for `pnpm drizzle-kit migrate`. |
| `JWT_SECRET` | Yes | New high-entropy server-only value that signs Om’s curator session. |
| `CURATOR_GATE_PASSWORD` | First deployment only | Seeds Om’s initial curator password hash. Change it from Om’s Desk after first entry. |

Both Supabase URLs must contain a URL-encoded password. For example, a password `Pass@123` becomes `Pass%40123` inside the URI. Do not include quote characters around a saved value.

## GitHub and Vercel Workflow

Open the project root in VS Code. Create a private GitHub repository, commit all source files **except** a completed `.env` file, then import that repository into Vercel.

```bash
pnpm install
pnpm check
pnpm test
pnpm build
git init
git add .
git commit -m "Deploy Theorem of Kemet independently"
```

In Vercel, select the repository and allow it to use `vercel.json`. Add the environment variables above before creating the first production deployment. Vercel builds the client with `pnpm build:client`; the root `app.ts` exports the Express/tRPC API application.

## Database Workflow

The project’s Supabase PostgreSQL schema was created from `drizzle/pg/0000_rapid_otto_octavius.sql`. For a fresh project, add the two Supabase URLs locally or in Vercel and run:

```bash
pnpm drizzle-kit migrate
```

Do not apply the older MySQL migration files to Supabase. The current PostgreSQL migration is additive: it creates the journal, source, theory-letter, curator-credential, and curator-puzzle tables and enum types. It does not invent or seed public case content.

## First External Launch Checklist

1. Open `/api/health` and confirm it returns `{ "ok": true }`.
2. Open the public home page and verify local hero and Om’s Favourite images load.
3. Open Om’s Desk, solve the antechamber, then change the initial curator password.
4. Save a draft, check its private preview, publish only when its evidence fields are ready, and confirm source ordering persists.
5. Submit one reader letter and confirm it appears privately in Om’s desk.
6. Test a Google Drive evidence image, Field Folio, artifact inspection, and public source trail.

## Current Validation

The independent conversion has passed TypeScript checks, a production build, and 40 passing Vitest tests with one intentional skip. Secure tests confirmed both Supabase connection URLs and verified the migrated PostgreSQL schema contains all required journal and curator tables.
