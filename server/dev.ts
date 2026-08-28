import fs from "node:fs";
import { createServer } from "http";
import path from "node:path";
import { createServer as createViteServer } from "vite";
import app from "./app";

async function startDevelopmentServer() {
  const httpServer = createServer(app);
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    try {
      const template = fs.readFileSync(path.resolve(import.meta.dirname, "../client/index.html"), "utf-8");
      const html = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).setHeader("Content-Type", "text/html").end(html);
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      next(error);
    }
  });

  const port = Number(process.env.PORT || 3000);
  httpServer.listen(port, () => console.log(`Theorem of Kemet running at http://localhost:${port}`));
}

startDevelopmentServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
