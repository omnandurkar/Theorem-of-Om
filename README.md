# Theorem of Kemet

Theorem of Kemet is Om Nandurkar’s immersive Ancient Egypt field journal and article library. It is a **frontend-only React/Vite site** with cinematic motion, paper textures, page-turn reading, evidence boards, magnification, archive filtering, a geographic case map, and a local curator puzzle gate.

## Run locally

```bash
pnpm install
pnpm dev
```

The project does not require a database, server process, OAuth configuration, Supabase project, or runtime environment variables.

## Validate and build

```bash
pnpm check
pnpm build
pnpm preview
```

The production output is written to `dist/public`.

## Edit the journal

All public article content is in `client/src/data/articles.json`. Edit the article objects, sections, paragraphs, images, and sources there. The adapter in `client/src/lib/staticJournal.ts` feeds the Journal, Case Index, article reader, evidence boards, and map. Read [FRONTEND_ONLY_GUIDE.md](./FRONTEND_ONLY_GUIDE.md) for the field reference and deployment instructions.

## Deployment

Connect the repository to Vercel using the existing `vercel.json`. The build command is `pnpm build` and the output directory is `dist/public`. The site is static and needs no environment variables. GitHub Pages, Netlify, Cloudflare Pages, or any static host capable of serving Vite output can also host the generated files.

## Important limitations

The curator desk is a read-only preview in the static version because a browser cannot write changes into a deployed JSON bundle. Reader theory letters are stored only in the current browser’s local storage. To publish new material, edit `articles.json`, run the checks, and deploy a new build. The puzzle gate is a local editorial convenience, not server-grade security.
