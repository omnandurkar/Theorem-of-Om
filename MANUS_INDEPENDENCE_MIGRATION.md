# Frontend-only architecture note

Theorem of Kemet originally included a full-stack database and API architecture. The current project intentionally supersedes that design with a static Vite build. Public records are maintained in `client/src/data/articles.json` and adapted by `client/src/lib/staticJournal.ts`.

The former server, database, tRPC, Drizzle, Supabase, OAuth, and serverless files are no longer part of the runtime. If persistence is needed later, it can be added as a separate future migration without changing the current visual routes.
