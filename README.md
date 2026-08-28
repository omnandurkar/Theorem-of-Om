# Theorem of Kemet

Theorem of Kemet is Om Nandurkar’s evidence-aware digital field journal for ancient Egypt, mythology, archaeology, anomalies, and unresolved historical questions. It is an independent React, Express, tRPC, Drizzle, and Supabase PostgreSQL application prepared for Vercel.

## Run Locally

Create a local `.env` from [ENVIRONMENT_TEMPLATE.md](./ENVIRONMENT_TEMPLATE.md), add your private Supabase values, then run:

```bash
pnpm install
pnpm drizzle-kit migrate
pnpm dev
```

The local app runs at `http://localhost:3000`. The first curator puzzle/password interaction seeds the server-side curator credential. After entering Om’s desk, immediately change the initial password.

## Validate and Build

```bash
pnpm check
pnpm test
pnpm build
pnpm start
```

`pnpm build:client` produces the Vercel static client output at `dist/public`. The root `app.ts` exports the Express/tRPC API application for Vercel. For an external production launch, add `SUPABASE_DATABASE_URL`, `SUPABASE_DIRECT_URL`, `JWT_SECRET`, and `CURATOR_GATE_PASSWORD` to Vercel’s encrypted environment variables; never commit a populated `.env` file.

## Database and Hosting

Drizzle uses Supabase PostgreSQL through a transaction-mode pooler at runtime and a session-mode pooler for migrations. The project no longer relies on Manus OAuth or Manus storage at runtime. Static visual assets are committed under `client/public/assets`, and existing Google Drive image support remains an optional editor feature.

See [MANUS_INDEPENDENCE_MIGRATION.md](./MANUS_INDEPENDENCE_MIGRATION.md) for the completed migration strategy and [PORTABLE_DEPLOYMENT.md](./PORTABLE_DEPLOYMENT.md) for the external handoff checklist.
