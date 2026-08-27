import { boolean, double, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const journalCategories = mysqlTable("journal_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 96 }).notNull(),
  slug: varchar("slug", { length: 112 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 24 }).notNull().default("#1d5671"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("journal_categories_name_unique").on(table.name), uniqueIndex("journal_categories_slug_unique").on(table.slug)]);

export const journalEntries = mysqlTable("journal_entries", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  categoryId: int("categoryId"),
  title: varchar("title", { length: 220 }).notNull(),
  slug: varchar("slug", { length: 240 }).notNull(),
  caseNumber: varchar("caseNumber", { length: 32 }),
  caseStatus: mysqlEnum("caseStatus", ["documented", "disputed", "unverified", "ongoing", "unresolved"]).notNull().default("disputed"),
  firstRecorded: varchar("firstRecorded", { length: 96 }),
  location: varchar("location", { length: 180 }),
  era: varchar("era", { length: 96 }),
  mapLatitude: double("mapLatitude"),
  mapLongitude: double("mapLongitude"),
  timelineDate: varchar("timelineDate", { length: 96 }),
  evidenceLevel: int("evidenceLevel").notNull().default(50),
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
  status: mysqlEnum("status", ["draft", "published"]).notNull().default("draft"),
  featured: boolean("featured").notNull().default(false),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("journal_entries_slug_unique").on(table.slug), uniqueIndex("journal_entries_case_number_unique").on(table.caseNumber), index("journal_entries_status_index").on(table.status), index("journal_entries_category_index").on(table.categoryId), index("journal_entries_case_status_index").on(table.caseStatus)]);

export const journalSources = mysqlTable("journal_sources", {
  id: int("id").autoincrement().primaryKey(),
  entryId: int("entryId").notNull(),
  label: varchar("label", { length: 220 }).notNull(),
  url: text("url").notNull(),
  note: text("note"),
  position: int("position").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("journal_sources_entry_index").on(table.entryId)]);

export const theoryLetters = mysqlTable("theory_letters", {
  id: int("id").autoincrement().primaryKey(),
  readerName: varchar("readerName", { length: 120 }).notNull(),
  theory: text("theory").notNull(),
  status: mysqlEnum("status", ["received", "read", "archived"]).notNull().default("received"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("theory_letters_status_index").on(table.status), index("theory_letters_created_at_index").on(table.createdAt)]);

export const curatorCredentials = mysqlTable("curator_credentials", {
  id: int("id").primaryKey(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const curatorPuzzles = mysqlTable("curator_puzzles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 96 }).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  instruction: text("instruction").notNull(),
  clue: text("clue").notNull(),
  relicIds: varchar("relicIds", { length: 255 }).notNull(),
  solutionOrder: varchar("solutionOrder", { length: 255 }).notNull(),
  isActive: boolean("isActive").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("curator_puzzles_active_index").on(table.isActive)]);

export type JournalCategory = typeof journalCategories.$inferSelect;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type JournalSource = typeof journalSources.$inferSelect;
export type TheoryLetter = typeof theoryLetters.$inferSelect;
export type CuratorCredential = typeof curatorCredentials.$inferSelect;
export type CuratorPuzzle = typeof curatorPuzzles.$inferSelect;
