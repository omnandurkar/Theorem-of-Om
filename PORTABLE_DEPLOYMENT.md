# Portable static deployment

Install dependencies with `pnpm install`, validate with `pnpm check`, build with `pnpm build`, and deploy the `dist/public` output to Vercel or another static host. Vercel uses the repository `vercel.json` configuration.

Edit `client/src/data/articles.json` to add or revise articles. No `.env` values are required. See `FRONTEND_ONLY_GUIDE.md` for field definitions, image URL guidance, local reader letters, curator limitations, and the rebuild workflow.
