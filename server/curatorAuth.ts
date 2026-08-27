import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Request } from "express";
import { jwtVerify, SignJWT } from "jose";
import { createCuratorPuzzle, getActiveCuratorPuzzle, getCuratorCredential, setCuratorPasswordHash } from "./db";
import { DEFAULT_CURATOR_PUZZLE } from "../shared/curatorPuzzles";

export const CURATOR_SESSION_COOKIE = "kemet-curator-session";
export const CURATOR_SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

export function hasCuratorPassword() {
  return Boolean(process.env.CURATOR_GATE_PASSWORD?.trim());
}

export function configuredCuratorPassword() {
  const password = process.env.CURATOR_GATE_PASSWORD?.trim();
  if (!password) throw new Error("CURATOR_GATE_PASSWORD is not configured");
  return password;
}

const sessionKey = () => new TextEncoder().encode(process.env.JWT_SECRET || "curator-session-development-key");

export function hashCuratorPassword(password: string, salt = randomBytes(16).toString("hex")) {
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyCuratorPassword(password: string, storedHash: string) {
  const [salt, expected] = storedHash.split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64).toString("hex");
  return actual.length === expected.length && timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}

export async function ensureCuratorCredential() {
  const existing = await getCuratorCredential();
  if (existing) return existing;
  const initialHash = hashCuratorPassword(configuredCuratorPassword());
  await setCuratorPasswordHash(initialHash);
  return { id: 1, passwordHash: initialHash, updatedAt: new Date() };
}

export async function verifyCuratorLogin(password: string) {
  const credential = await ensureCuratorCredential();
  return verifyCuratorPassword(password, credential.passwordHash);
}

export async function setCuratorPassword(password: string) {
  await setCuratorPasswordHash(hashCuratorPassword(password));
}

export async function ensureActiveCuratorPuzzle() {
  const active = await getActiveCuratorPuzzle();
  if (active) return active;
  await createCuratorPuzzle(DEFAULT_CURATOR_PUZZLE, true);
  const seeded = await getActiveCuratorPuzzle();
  if (!seeded) throw new Error("Could not initialize curator puzzle");
  return seeded;
}

export async function createCuratorSession() {
  return new SignJWT({ scope: "curator" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(sessionKey());
}

function cookieValue(req: Request, name: string) {
  const cookie = req.headers.cookie || "";
  return cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

export async function hasCuratorSession(req: Request) {
  const token = cookieValue(req, CURATOR_SESSION_COOKIE);
  if (!token) return false;
  try {
    const verified = await jwtVerify(token, sessionKey());
    return verified.payload.scope === "curator";
  } catch {
    return false;
  }
}
