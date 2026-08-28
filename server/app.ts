import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
app.get("/api/health", (_req, res) => res.status(200).json({ ok: true, service: "theorem-of-kemet" }));

export default app;
