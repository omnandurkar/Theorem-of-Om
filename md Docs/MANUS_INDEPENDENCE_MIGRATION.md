# Theorem of Kemet — Manus-Independent Migration Plan

## Completion Status

The migration work described here is complete in the current codebase. Drizzle now targets Supabase PostgreSQL, the reviewed PostgreSQL schema is applied and connection-tested, local client assets replace managed storage URLs, legacy OAuth/runtime code is removed, and a root Vercel-compatible Express export is present. The independent local reading room was visually verified after the conversion: its home page, public navigation, and localized hero/Favourite images rendered correctly. The remaining external action is to commit the independent package to GitHub, configure Vercel secrets, and perform the first deployment checks.

## Decision

Theorem of Kemet can become **Manus-independent without removing Drizzle**. The recommended target is **React + Vite + tRPC + Drizzle + Supabase PostgreSQL + Vercel**.

> **Drizzle is not the blocker.** It is the database abstraction layer and supports both the current MySQL-compatible database and Supabase PostgreSQL. The required work is a controlled database-dialect migration plus removal of the remaining Manus-specific runtime, storage, and legacy OAuth plumbing.

## What Stays and What Changes

| Area | Keep | Replace or adapt |
|---|---|---|
| Frontend | React 19, TypeScript, Vite, Wouter, Tailwind, Framer Motion, GSAP, all visual components | Remove Manus Vite runtime/debug integration and Manus-only public debug files. |
| Application API | tRPC router shapes, Zod input validation, React Query client patterns | Run API from a Vercel serverless handler instead of a long-running Express server. |
| Database layer | Drizzle schema-first workflow and query helpers | Move from `drizzle-orm/mysql2` to PostgreSQL via `drizzle-orm/node-postgres` or the Supabase-compatible PostgreSQL driver. |
| Database | Tables and product data model | Move from MySQL-compatible storage to a Supabase PostgreSQL project. |
| Curator security | Server-side puzzle validation, password hashing, signed httpOnly curator session, Cmd/Ctrl + K recovery path | Use Vercel/Supabase environment variables instead of current managed-runtime variables. |
| Static assets | Local `/assets/...` images in the portable package and external Google Drive image support | Remove the Manus storage proxy. Optionally add Supabase Storage later for curator-uploaded images. |
| Legacy Manus OAuth | Nothing required by the present single-curator product | Remove the old OAuth bootstrap, SDK calls, Manus user synchronization, and unused user route hooks. |

## Original Runtime Constraint

The prior portable export was source-complete but not fully independent at runtime because it still started an Express server from `server/_core/index.ts`, contained managed Vite/debug configuration, and retained storage/OAuth framework files. Those constraints have been removed from the current source tree.

The **public journal and the custom curator puzzle do not require Manus OAuth**. The app already uses the curator puzzle and server-verified password session for actual Om-only actions. The remaining OAuth files are scaffolding to remove during the independent deployment conversion.

## Target Architecture

```text
Browser
  ├── Vercel static Vite build
  └── /api/trpc/* → Vercel serverless function
                         ├── tRPC router and curator cookie/session logic
                         └── Drizzle → Supabase PostgreSQL Pooler

Optional later addition
  └── Supabase Storage → curator-uploaded evidence images
```

The public site, article reader, Field Folio, evidence board, source trail, reader letters, private curator desk, puzzle presets, and curator session remain application features. Only their infrastructure boundary changes.

## Drizzle and Supabase PostgreSQL Work

### 1. Change packages and database configuration

Remove `mysql2` and add the PostgreSQL driver used by Drizzle. Update `drizzle.config.ts` from `dialect: "mysql"` to `dialect: "postgresql"`. The production `DATABASE_URL` should be the Supabase **pooler** connection string configured for TLS; this is preferable to a direct connection for Vercel’s serverless concurrency.

The database helper will replace the MySQL Drizzle import with the PostgreSQL equivalent and create one reusable pool/client per warm serverless instance. It must not open an unbounded new connection per request.

### 2. Convert the schema, not the product model

The product tables stay conceptually the same:

| Current table | Supabase PostgreSQL equivalent | Migration note |
|---|---|---|
| `journal_categories` | `journal_categories` | Convert auto-increment ID to PostgreSQL identity/serial; retain unique name and slug constraints. |
| `journal_entries` | `journal_entries` | Preserve all editorial, map, evidence, presentation, and status fields. Convert MySQL enums to `pgEnum` values or validated text columns. |
| `journal_sources` | `journal_sources` | Preserve `position`; it continues to power Om’s persisted source-ordering desk. |
| `theory_letters` | `theory_letters` | Preserve submission status and timestamps. |
| `curator_credentials` | `curator_credentials` | Preserve the salted password hash only; never migrate or create a plaintext password column. |
| `curator_puzzles` | `curator_puzzles` | Preserve public puzzle content, private answer order, active status, and timestamps. |
| Legacy `users` table | Usually remove | It was introduced for legacy Manus OAuth. The current single-curator puzzle flow does not use it for author access. Retain it only if future multi-user accounts are explicitly required. |

PostgreSQL equivalents use `pgTable`, `integer(...).generatedAlwaysAsIdentity()`, `boolean`, `doublePrecision`, `timestamp`, `text`, `varchar`, `pgEnum`, `index`, and `uniqueIndex`. MySQL’s `.onUpdateNow()` needs a PostgreSQL-compatible replacement: either Drizzle’s update hook convention or explicit `updatedAt: new Date()` in each update helper.

The MySQL-specific `onDuplicateKeyUpdate` call in the old OAuth user helper becomes PostgreSQL `onConflictDoUpdate` if that legacy user table is retained. If legacy OAuth is removed, delete the unused helper instead.

### 3. Generate new PostgreSQL migrations

Do not apply existing MySQL SQL files to Supabase. Create a dedicated PostgreSQL Drizzle migration history from the converted schema, review its SQL, then apply it to the new Supabase project. The existing MySQL migrations remain useful historical documentation inside the archive but are not executable on PostgreSQL.

## Data Migration Decision

Before migration, establish whether there is production data worth retaining.

| Situation | Safe route |
|---|---|
| No meaningful live case data yet | Create the new PostgreSQL schema, seed only the required curator-puzzle preset through the product’s safe setup path, and begin publishing in Supabase. |
| Curator password/puzzle presets or journal records exist | Export tables from the current database, transform values to PostgreSQL-compatible inserts, import into a private Supabase project, and verify counts, source positions, active puzzle status, and login recovery before switching traffic. |

No database data should be copied casually through a public repository or pasted into client-side code. The curator password hash, signed-session secret, and any reader submissions must be handled as private infrastructure data.

## Vercel Serverless Conversion

The independent deployment should separate server construction from server listening.

1. Extract the Express/tRPC setup in `server/_core/index.ts` into a reusable application factory or a Vercel API handler. Do **not** call `server.listen()` on Vercel.
2. Route `/api/trpc/*` to a Vercel serverless function under `api/`. The handler should create the current tRPC context and keep all privileged router procedures server-side.
3. Preserve signed curator cookies. Adapt cookie writes/clears to Vercel’s request/response objects and retain secure, httpOnly, same-site defaults.
4. Keep `JWT_SECRET` and the first-launch `CURATOR_GATE_PASSWORD` exclusively in Vercel environment variables. Generate a new high-entropy `JWT_SECRET`; do not reuse a managed-runtime secret.
5. Remove `registerOAuthRoutes`, `server/_core/oauth.ts`, Manus SDK calls, and legacy OAuth client hooks after confirming no active product route uses them.
6. Remove `registerStorageProxy` and `server/_core/storageProxy.ts`. Portable frontend assets already use `/assets/...`; the exported asset map verifies that client code no longer needs `/manus-storage/...` paths.
7. Remove `vitePluginManusRuntime`, the Manus debug collector, and host restrictions tailored to the managed preview domain. Keep ordinary Vite React/Tailwind configuration.
8. Add a Vercel configuration only after the API handler shape is finalized, so SPA fallback routing and `/api/*` routes do not conflict.

## Supabase Configuration Needed at Implementation Time

The actual migration requires a new or existing Supabase project. The application does **not** need Supabase Auth for the current single-curator model.

| Variable | Required | Use |
|---|---:|---|
| `DATABASE_URL` | Yes | Supabase PostgreSQL pooler URL for Drizzle. Keep it server-only. |
| `JWT_SECRET` | Yes | New high-entropy server-side signer for curator sessions. |
| `CURATOR_GATE_PASSWORD` | First deployment only | Seeds the initial curator password before Om changes it in the desk. Keep it server-only. |
| `SUPABASE_URL` | Later / optional | Needed only if we add Supabase Storage or other Supabase API calls. |
| `SUPABASE_SERVICE_ROLE_KEY` | Later / optional | Needed only for server-side Supabase services such as protected storage management; never expose it to the browser. |

During implementation, credentials must be added through the project’s secure secret settings rather than committed, pasted into source, or uploaded to GitHub.

## Recommended Implementation Order

1. Create the Supabase project and prepare private server credentials.
2. Convert `drizzle/schema.ts`, `drizzle.config.ts`, and `server/db.ts` to PostgreSQL while preserving existing type contracts.
3. Generate and apply reviewed PostgreSQL migrations to the new database.
4. Remove unused legacy OAuth and Manus storage/runtime code, keeping the custom curator gate intact.
5. Adapt tRPC to a Vercel serverless handler and configure SPA/API routing.
6. Run type checks, router/security tests, full UI tests, and a local Vercel-style preview.
7. Deploy a Vercel preview, verify a public reader route, a curator-puzzle unlock, Cmd/Ctrl + K recovery, case save, source ordering, reader letter submission, and asset rendering.
8. Point the production domain only after the preview passes. Change the initial curator password immediately after first entry.

## Non-Negotiable Safety Checks

- Do not commit `.env` files, database URLs, `JWT_SECRET`, curator passwords, service-role keys, or production data.
- Keep the curator puzzle atmospheric but server-verified; never move its answer order or password into the client bundle.
- Verify that the database uses Supabase’s pooled production URL before exposing Vercel traffic.
- Treat Drive image URLs as external content; keep referrer/error handling and do not claim an image proves a case.
- Preserve source order during import because it affects the public reader’s evidence path.

## Outcome

Theorem of Kemet remains a full-stack app and is now **independent of Manus infrastructure**. Drizzle remains the query layer; Supabase supplies PostgreSQL; Vercel hosts the client and Express/tRPC API; Om’s curator workflow and evidence-aware reader experience remain intact.
