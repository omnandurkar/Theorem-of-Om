import { and, count, desc, eq, gte, like, lte, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { curatorCredentials, curatorPuzzles, JournalCategory, journalCategories, JournalEntry, journalEntries, journalSources, JournalSource, InsertUser, TheoryLetter, theoryLetters, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

async function requireDb() { const db = await getDb(); if (!db) throw new Error("Database is unavailable"); return db; }

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  (["name", "email", "loginMethod"] as const).forEach((field) => { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } });
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  updateSet.role = values.role;
  values.lastSignedIn = user.lastSignedIn ?? new Date(); updateSet.lastSignedIn = values.lastSignedIn;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0]; }

export async function getCuratorCredential() { const db = await requireDb(); const rows = await db.select().from(curatorCredentials).where(eq(curatorCredentials.id, 1)).limit(1); return rows[0]; }
export async function setCuratorPasswordHash(passwordHash: string) { const db = await requireDb(); await db.insert(curatorCredentials).values({ id: 1, passwordHash }).onDuplicateKeyUpdate({ set: { passwordHash } }); }

export type CuratorPuzzleInput = { name: string; title: string; instruction: string; clue: string; relicIds: string[]; solutionOrder: string[] };
const serializePuzzleRelics = (relics: string[]) => relics.join(",");
const parsePuzzleRelics = (relics: string) => relics.split(",").filter(Boolean);
const hydratePuzzle = (puzzle: typeof curatorPuzzles.$inferSelect) => ({ ...puzzle, relicIds: parsePuzzleRelics(puzzle.relicIds), solutionOrder: parsePuzzleRelics(puzzle.solutionOrder) });
export async function listCuratorPuzzles() { const db = await requireDb(); return (await db.select().from(curatorPuzzles).orderBy(desc(curatorPuzzles.updatedAt))).map(hydratePuzzle); }
export async function getActiveCuratorPuzzle() { const db = await requireDb(); const rows = await db.select().from(curatorPuzzles).where(eq(curatorPuzzles.isActive, true)).limit(1); return rows[0] ? hydratePuzzle(rows[0]) : null; }
export async function createCuratorPuzzle(input: CuratorPuzzleInput, isActive = false) { const db = await requireDb(); if (isActive) await db.update(curatorPuzzles).set({ isActive: false }); const result = await db.insert(curatorPuzzles).values({ ...input, relicIds: serializePuzzleRelics(input.relicIds), solutionOrder: serializePuzzleRelics(input.solutionOrder), isActive }); return Number(result[0].insertId); }
export async function updateCuratorPuzzle(id: number, input: CuratorPuzzleInput) { const db = await requireDb(); await db.update(curatorPuzzles).set({ ...input, relicIds: serializePuzzleRelics(input.relicIds), solutionOrder: serializePuzzleRelics(input.solutionOrder) }).where(eq(curatorPuzzles.id, id)); }
export async function activateCuratorPuzzle(id: number) { const db = await requireDb(); await db.update(curatorPuzzles).set({ isActive: false }); await db.update(curatorPuzzles).set({ isActive: true }).where(eq(curatorPuzzles.id, id)); }
export async function deleteCuratorPuzzle(id: number) { const db = await requireDb(); const active = await getActiveCuratorPuzzle(); if (active?.id === id) throw new Error("Activate another puzzle before retiring this one"); await db.delete(curatorPuzzles).where(eq(curatorPuzzles.id, id)); }

export type JournalEntryInput = Omit<JournalEntry, "id" | "authorId" | "driveRenderUrl" | "createdAt" | "updatedAt" | "publishedAt" | "caseNumber" | "caseStatus" | "firstRecorded" | "location" | "era" | "mapLatitude" | "mapLongitude" | "timelineDate" | "evidenceLevel" | "claim" | "documentedEvidence" | "counterargument" | "anomaly" | "theory" | "authorTake" | "relatedCaseSlugs" | "relationNote" | "stickyTreatment" | "stickyPlacement" | "stampKind"> & { categoryId?: number | null; driveSourceUrl?: string | null; driveRenderUrl?: string | null; imageCaption?: string | null; stickyTitle?: string | null; stickyBody?: string | null; stickyTreatment?: JournalEntry["stickyTreatment"]; stickyPlacement?: JournalEntry["stickyPlacement"]; stampKind?: JournalEntry["stampKind"]; caseNumber?: string | null; caseStatus?: JournalEntry["caseStatus"]; firstRecorded?: string | null; location?: string | null; era?: string | null; mapLatitude?: number | null; mapLongitude?: number | null; timelineDate?: string | null; evidenceLevel?: number; claim?: string | null; documentedEvidence?: string | null; counterargument?: string | null; anomaly?: string | null; theory?: string | null; authorTake?: string | null; relatedCaseSlugs?: string | null; relationNote?: string | null; sources: Array<{ label: string; url: string; note?: string | null }> };

export async function listPublicJournalEntries() {
  const db = await requireDb();
  const entries = await db.select().from(journalEntries).where(eq(journalEntries.status, "published")).orderBy(desc(journalEntries.publishedAt));
  const categories = await db.select().from(journalCategories);
  return entries.map((entry) => ({ ...entry, category: categories.find((category) => category.id === entry.categoryId) || null }));
}

export async function listPublicJournalPage(input: { page: number; pageSize: number; categoryId?: number | null; caseStatus?: JournalEntry["caseStatus"] | null; topic?: string | null; era?: string | null; location?: string | null; credibility?: "low" | "cautious" | "strong" | null }) {
  const db = await requireDb();
  const topic = input.topic?.trim();
  const where = and(eq(journalEntries.status, "published"), ...(input.categoryId ? [eq(journalEntries.categoryId, input.categoryId)] : []), ...(input.caseStatus ? [eq(journalEntries.caseStatus, input.caseStatus)] : []), ...(input.era ? [eq(journalEntries.era, input.era)] : []), ...(input.location ? [eq(journalEntries.location, input.location)] : []), ...(topic ? [or(like(journalEntries.title, `%${topic}%`), like(journalEntries.summary, `%${topic}%`), like(journalEntries.body, `%${topic}%`), like(journalEntries.evidenceMode, `%${topic}%`))] : []), ...(input.credibility === "strong" ? [gte(journalEntries.evidenceLevel, 70)] : []), ...(input.credibility === "cautious" ? [gte(journalEntries.evidenceLevel, 35), lte(journalEntries.evidenceLevel, 69)] : []), ...(input.credibility === "low" ? [lte(journalEntries.evidenceLevel, 34)] : []));
  const offset = (input.page - 1) * input.pageSize;
  const [entries, totalRows, categories] = await Promise.all([
    db.select().from(journalEntries).where(where).orderBy(desc(journalEntries.publishedAt)).limit(input.pageSize).offset(offset),
    db.select({ value: count() }).from(journalEntries).where(where),
    db.select().from(journalCategories),
  ]);
  const total = Number(totalRows[0]?.value || 0);
  return { items: entries.map((entry) => ({ ...entry, category: categories.find((category) => category.id === entry.categoryId) || null })), total, page: input.page, pageSize: input.pageSize, totalPages: Math.max(1, Math.ceil(total / input.pageSize)) };
}

export async function listPublicJournalFilterValues() {
  const db = await requireDb();
  const rows = await db.select({ era: journalEntries.era, location: journalEntries.location }).from(journalEntries).where(eq(journalEntries.status, "published"));
  return { eras: Array.from(new Set(rows.map((row) => row.era).filter((value): value is string => Boolean(value)))).sort(), locations: Array.from(new Set(rows.map((row) => row.location).filter((value): value is string => Boolean(value)))).sort() };
}

export async function listPublicMapPins() {
  const db = await requireDb();
  return db.select({ id: journalEntries.id, title: journalEntries.title, slug: journalEntries.slug, caseNumber: journalEntries.caseNumber, caseStatus: journalEntries.caseStatus, evidenceLevel: journalEntries.evidenceLevel, location: journalEntries.location, era: journalEntries.era, symbol: journalEntries.symbol, mapLatitude: journalEntries.mapLatitude, mapLongitude: journalEntries.mapLongitude }).from(journalEntries).where(and(eq(journalEntries.status, "published"), gte(journalEntries.mapLatitude, -90), lte(journalEntries.mapLatitude, 90), gte(journalEntries.mapLongitude, -180), lte(journalEntries.mapLongitude, 180))).orderBy(desc(journalEntries.publishedAt));
}

export async function getPublicJournalEntry(slug: string) {
  const db = await requireDb();
  const rows = await db.select().from(journalEntries).where(eq(journalEntries.slug, slug)).limit(1);
  const entry = rows[0];
  if (!entry || entry.status !== "published") return null;
  const [sources, categories] = await Promise.all([db.select().from(journalSources).where(eq(journalSources.entryId, entry.id)).orderBy(journalSources.position), db.select().from(journalCategories).where(eq(journalCategories.id, entry.categoryId ?? -1)).limit(1)]);
  return { ...entry, category: categories[0] || null, sources };
}

export async function listAdminEntries() { const db = await requireDb(); return db.select().from(journalEntries).orderBy(desc(journalEntries.updatedAt)); }
export async function listCategories() { const db = await requireDb(); return db.select().from(journalCategories).orderBy(journalCategories.name); }
export async function listSources(entryId: number) { const db = await requireDb(); return db.select().from(journalSources).where(eq(journalSources.entryId, entryId)).orderBy(journalSources.position); }

export async function createTheoryLetter(input: Pick<TheoryLetter, "readerName" | "theory">) { const db = await requireDb(); const result = await db.insert(theoryLetters).values(input); return Number(result[0].insertId); }
export async function listTheoryLetters() { const db = await requireDb(); return db.select().from(theoryLetters).orderBy(desc(theoryLetters.createdAt)); }
export async function updateTheoryLetterStatus(id: number, status: TheoryLetter["status"]) { const db = await requireDb(); await db.update(theoryLetters).set({ status }).where(eq(theoryLetters.id, id)); }
export async function deleteTheoryLetter(id: number) { const db = await requireDb(); await db.delete(theoryLetters).where(eq(theoryLetters.id, id)); }

async function replaceSources(entryId: number, sources: JournalEntryInput["sources"]) {
  const db = await requireDb();
  await db.delete(journalSources).where(eq(journalSources.entryId, entryId));
  if (sources.length) await db.insert(journalSources).values(sources.map((source, position) => ({ entryId, label: source.label, url: source.url, note: source.note || null, position })));
}

export async function createJournalEntry(authorId: number, input: JournalEntryInput) {
  const db = await requireDb();
  const result = await db.insert(journalEntries).values({ ...input, authorId, caseStatus: input.caseStatus ?? "disputed", evidenceLevel: input.evidenceLevel ?? 50, publishedAt: input.status === "published" ? new Date() : null });
  const entryId = Number(result[0].insertId);
  await replaceSources(entryId, input.sources);
  return entryId;
}

export async function updateJournalEntry(id: number, input: JournalEntryInput) {
  const db = await requireDb();
  await db.update(journalEntries).set({ ...input, caseStatus: input.caseStatus ?? "disputed", evidenceLevel: input.evidenceLevel ?? 50, publishedAt: input.status === "published" ? new Date() : null }).where(eq(journalEntries.id, id));
  await replaceSources(id, input.sources);
}

export async function deleteJournalEntry(id: number) { const db = await requireDb(); await db.delete(journalSources).where(eq(journalSources.entryId, id)); await db.delete(journalEntries).where(eq(journalEntries.id, id)); }
export async function createCategory(input: Pick<JournalCategory, "name" | "slug" | "description" | "color">) { const db = await requireDb(); const result = await db.insert(journalCategories).values(input); return Number(result[0].insertId); }
export async function updateCategory(id: number, input: Pick<JournalCategory, "name" | "slug" | "description" | "color">) { const db = await requireDb(); await db.update(journalCategories).set(input).where(eq(journalCategories.id, id)); }
export async function deleteCategory(id: number) { const db = await requireDb(); await db.update(journalEntries).set({ categoryId: null }).where(eq(journalEntries.categoryId, id)); await db.delete(journalCategories).where(eq(journalCategories.id, id)); }

export async function getJournalAnalytics() {
  const db = await requireDb();
  const [entries, categories, sources] = await Promise.all([db.select().from(journalEntries), db.select().from(journalCategories), db.select().from(journalSources)]);
  const published = entries.filter((entry) => entry.status === "published");
  return { totalEntries: entries.length, publishedEntries: published.length, draftEntries: entries.length - published.length, sourceCount: sources.length, featuredCount: entries.filter((entry) => entry.featured).length, shelfDistribution: categories.map((category) => ({ label: category.name, value: entries.filter((entry) => entry.categoryId === category.id).length, color: category.color })) };
}
