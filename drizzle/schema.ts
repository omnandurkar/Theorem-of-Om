import { boolean, doublePrecision, index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

const updatedAt = () => timestamp("updatedAt", { withTimezone: true }).defaultNow().$onUpdateFn(() => new Date()).notNull();

export const userRole = pgEnum("user_role", ["user", "admin"]);
export const caseStatus = pgEnum("case_status", ["documented", "disputed", "unverified", "ongoing", "unresolved"]);
export const entryStatus = pgEnum("entry_status", ["draft", "published"]);
export const letterStatus = pgEnum("letter_status", ["received", "read", "archived"]);

/**
 * Retained only for backward-compatible data imports. The single-curator app
 * does not use Manus OAuth or public accounts for access control.
 */
export const users = pgTable("users", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: updatedAt(),
  lastSignedIn: timestamp("lastSignedIn", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const journalCategories = pgTable("journal_categories", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  name: varchar("name", { length: 96 }).notNull(),
  slug: varchar("slug", { length: 112 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 24 }).notNull().default("#1d5671"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: updatedAt(),
}, (table) => [uniqueIndex("journal_categories_name_unique").on(table.name), uniqueIndex("journal_categories_slug_unique").on(table.slug)]);

export const journalEntries = pgTable("journal_entries", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  authorId: integer("authorId").notNull(),
  categoryId: integer("categoryId"),
  title: varchar("title", { length: 220 }).notNull(),
  slug: varchar("slug", { length: 240 }).notNull(),
  caseNumber: varchar("caseNumber", { length: 32 }),
  caseStatus: caseStatus("caseStatus").notNull().default("disputed"),
  firstRecorded: varchar("firstRecorded", { length: 96 }),
  location: varchar("location", { length: 180 }),
  era: varchar("era", { length: 96 }),
  mapLatitude: doublePrecision("mapLatitude"),
  mapLongitude: doublePrecision("mapLongitude"),
  timelineDate: varchar("timelineDate", { length: 96 }),
  evidenceLevel: integer("evidenceLevel").notNull().default(50),
  evidenceMode: varchar("evidenceMode", { length: 96 }).notNull().default("Cultural myth"),
  claim: text("claim"),
  documentedEvidence: text("documentedEvidence"),
  counterargument: text("counterargument"),
  anomaly: text("anomaly"),
  theory: text("theory"),
  authorTake: text("authorTake"),
  relatedCaseSlugs: text("relatedCaseSlugs"),
  relationNote: text("relationNote"),
  summary: text("summary").notNull(),
  body: text("body").notNull(),
  driveSourceUrl: text("driveSourceUrl"),
  driveRenderUrl: text("driveRenderUrl"),
  imageCaption: text("imageCaption"),
  fontId: varchar("fontId", { length: 64 }).notNull().default("cormorant"),
  paletteId: varchar("paletteId", { length: 64 }).notNull().default("limestone"),
  symbol: varchar("symbol", { length: 32 }).notNull().default("𓂀"),
  vectorMark: varchar("vectorMark", { length: 64 }).notNull().default("grid"),
  stickerMotif: varchar("stickerMotif", { length: 64 }).notNull().default("scarab-eye"),
  stickyTitle: varchar("stickyTitle", { length: 140 }),
  stickyBody: text("stickyBody"),
  stickyTreatment: varchar("stickyTreatment", { length: 32 }).notNull().default("brass-pin"),
  stickyPlacement: varchar("stickyPlacement", { length: 32 }).notNull().default("margin"),
  stampKind: varchar("stampKind", { length: 32 }).notNull().default("auto"),
  status: entryStatus("status").notNull().default("draft"),
  featured: boolean("featured").notNull().default(false),
  publishedAt: timestamp("publishedAt", { withTimezone: true }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: updatedAt(),
}, (table) => [uniqueIndex("journal_entries_slug_unique").on(table.slug), uniqueIndex("journal_entries_case_number_unique").on(table.caseNumber), index("journal_entries_status_index").on(table.status), index("journal_entries_category_index").on(table.categoryId), index("journal_entries_case_status_index").on(table.caseStatus)]);

export const journalSources = pgTable("journal_sources", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  entryId: integer("entryId").notNull(),
  label: varchar("label", { length: 220 }).notNull(),
  url: text("url").notNull(),
  note: text("note"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("journal_sources_entry_index").on(table.entryId)]);

export const theoryLetters = pgTable("theory_letters", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  readerName: varchar("readerName", { length: 120 }).notNull(),
  theory: text("theory").notNull(),
  status: letterStatus("status").notNull().default("received"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: updatedAt(),
}, (table) => [index("theory_letters_status_index").on(table.status), index("theory_letters_created_at_index").on(table.createdAt)]);

export const curatorCredentials = pgTable("curator_credentials", {
  id: integer("id").primaryKey(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  updatedAt: updatedAt(),
});

export const curatorPuzzles = pgTable("curator_puzzles", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  name: varchar("name", { length: 96 }).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  instruction: text("instruction").notNull(),
  clue: text("clue").notNull(),
  relicIds: varchar("relicIds", { length: 255 }).notNull(),
  solutionOrder: varchar("solutionOrder", { length: 255 }).notNull(),
  isActive: boolean("isActive").notNull().default(false),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: updatedAt(),
}, (table) => [index("curator_puzzles_active_index").on(table.isActive)]);

export type JournalCategory = typeof journalCategories.$inferSelect;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type JournalSource = typeof journalSources.$inferSelect;
export type TheoryLetter = typeof theoryLetters.$inferSelect;
export type CuratorCredential = typeof curatorCredentials.$inferSelect;
export type CuratorPuzzle = typeof curatorPuzzles.$inferSelect;
