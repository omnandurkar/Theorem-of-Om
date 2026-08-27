/**
 * Style reminder — Field Notes of the Necropolis: local-only data should feel like a private field notebook,
 * not an invisible cloud service. Preserve the clean seam where Supabase can later replace this persistence layer.
 */
import type { Article } from "@/data/articles";

const STORAGE_KEY = "theorem-of-kemet-local-records";
const PREFS_KEY = "theorem-of-kemet-reader-prefs";

export type RecordPresentation = {
  fontId: string;
  fontFamily: string;
  palette: string;
  paletteHex: string;
  symbol: string;
  vector: string;
  motif: string;
  stickyTitle: string;
  stickyBody: string;
};

export const DEFAULT_PRESENTATION: RecordPresentation = {
  fontId: "cormorant",
  fontFamily: "Cormorant Garamond, serif",
  palette: "limestone",
  paletteHex: "#f1ead8",
  symbol: "𓂀",
  vector: "grid",
  motif: "scarab-eye",
  stickyTitle: "Margin note",
  stickyBody: "The detail is not the whole record.",
};

export type LocalRecord = Pick<Article, "slug" | "title" | "category" | "excerpt" | "keyQuestion"> & {
  eyebrow: string;
  body: string;
  date: string;
  readTime: string;
  image?: string;
  presentation: RecordPresentation;
};

export type ReaderPreferences = { size: "compact" | "standard" | "large"; surface: "limestone" | "night"; quietMotion: boolean };

export function getLocalRecords(): LocalRecord[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

export function getLocalRecord(slug: string): LocalRecord | undefined { return getLocalRecords().find((record) => record.slug === slug); }

export function saveLocalRecord(record: LocalRecord) {
  const current = getLocalRecords().filter((existing) => existing.slug !== record.slug);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...current]));
}

export function getReaderPreferences(): ReaderPreferences {
  try { return JSON.parse(localStorage.getItem(PREFS_KEY) || "null") || { size: "standard", surface: "limestone", quietMotion: false }; } catch { return { size: "standard", surface: "limestone", quietMotion: false }; }
}

export function saveReaderPreferences(preferences: ReaderPreferences) { localStorage.setItem(PREFS_KEY, JSON.stringify(preferences)); }
