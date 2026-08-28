import path from "node:path";
import express from "express";
import app from "./app";

const publicDirectory = path.resolve(import.meta.dirname, "public");
app.use(express.static(publicDirectory));
app.use("*", (_req, res) => res.sendFile(path.join(publicDirectory, "index.html")));

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Theorem of Kemet running at http://localhost:${port}`));
