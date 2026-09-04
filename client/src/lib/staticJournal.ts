import { articles, type Article, type ArticleSource } from "@/data/articles";

export type StaticJournalSource = ArticleSource & { id: number };

export type StaticJournalEntry = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: { id: number; name: string };
  caseNumber: string;
  caseStatus: "documented" | "disputed" | "unverified" | "ongoing" | "unresolved";
  stampKind: "top-secret" | "unverified" | "declassified" | "case-closed" | "none";
  evidenceLevel: number;
  evidenceMode: string;
  location: string;
  era: string;
  credibility: string;
  status: "published";
  publishedAt: string;
  firstRecorded: string;
  driveRenderUrl: string;
  imageCaption: string;
  symbol: string;
  mapLatitude: number;
  mapLongitude: number;
  fontId: string;
  paletteId: string;
  stickyTreatment: string;
  stickyPlacement: string;
  stickyTitle: string;
  stickyBody: string;
  claim: string;
  documentedEvidence: string;
  counterargument: string;
  anomaly: string;
  theory: string;
  authorTake: string;
  relationNote: string;
  relatedCaseSlugs: string;
  sources: StaticJournalSource[];
};

const entryMeta = [
  { location: "Giza Plateau", era: "Old Kingdom", status: "disputed" as const, evidence: 58, symbol: "𓂀", latitude: 29.9792, longitude: 31.1342 },
  { location: "Saqqara", era: "Old Kingdom", status: "unresolved" as const, evidence: 46, symbol: "✦", latitude: 29.8711, longitude: 31.2165 },
  { location: "Abydos", era: "New Kingdom", status: "documented" as const, evidence: 72, symbol: "𓂀", latitude: 26.1859, longitude: 31.919 },
];

const toSource = (source: ArticleSource, index: number): StaticJournalSource => ({ ...source, id: index + 1 });

export const staticJournalEntries: StaticJournalEntry[] = articles.map((article, index) => {
  const meta = entryMeta[index] || entryMeta[0];
  const body = article.sections.flatMap((section) => section.paragraphs).join("\n\n");
  const firstParagraph = article.sections[0]?.paragraphs[0] || article.excerpt;
  const secondParagraph = article.sections[1]?.paragraphs[0] || "The record remains open to careful comparison.";
  return {
    id: index + 1,
    slug: article.slug,
    title: article.title,
    summary: article.excerpt,
    body,
    category: { id: index + 1, name: article.category },
    caseNumber: `CASE ${String(index + 1).padStart(3, "0")}`,
    caseStatus: meta.status,
    stampKind: meta.status === "documented" ? "declassified" : meta.status === "unresolved" ? "unverified" : "top-secret",
    evidenceLevel: meta.evidence,
    evidenceMode: "Material record",
    location: meta.location,
    era: meta.era,
    credibility: meta.status === "documented" ? "High" : meta.status === "disputed" ? "Mixed" : "Open question",
    status: "published",
    publishedAt: "2026-08-12T00:00:00.000Z",
    firstRecorded: article.date,
    driveRenderUrl: article.image,
    imageCaption: `${article.title} · field image`,
    symbol: meta.symbol,
    mapLatitude: meta.latitude,
    mapLongitude: meta.longitude,
    fontId: "cormorant",
    paletteId: article.tone === "night" ? "ink" : article.tone === "blue" ? "lapis" : "papyrus",
    stickyTreatment: "paper",
    stickyPlacement: "right",
    stickyTitle: article.keyQuestion,
    stickyBody: article.excerpt,
    claim: article.keyQuestion,
    documentedEvidence: firstParagraph,
    counterargument: secondParagraph,
    anomaly: article.sections.map((section) => section.heading).join(" · "),
    theory: article.sections.at(-1)?.pullQuote || article.excerpt,
    authorTake: "Keep the wonder, but keep the method visible.",
    relationNote: "Read this record beside its material context, then follow the source trail.",
    relatedCaseSlugs: articles.filter((candidate) => candidate.slug !== article.slug).slice(0, 1).map((candidate) => candidate.slug).join(","),
    sources: article.sources.map(toSource),
  };
});

export const staticCategories = articles.map((article, index) => ({ id: index + 1, name: article.category }));
export const staticFilterValues = {
  eras: Array.from(new Set(staticJournalEntries.map((entry) => entry.era))),
  locations: Array.from(new Set(staticJournalEntries.map((entry) => entry.location))),
};

export function getStaticEntry(slug?: string) {
  return staticJournalEntries.find((entry) => entry.slug === slug);
}

export function getStaticRelatedEntries(entry: StaticJournalEntry) {
  const slugs = entry.relatedCaseSlugs.split(",").map((item) => item.trim()).filter(Boolean);
  return staticJournalEntries.filter((candidate) => slugs.includes(candidate.slug));
}

export function filterStaticEntries(input: { status?: string; category?: string; topic?: string; era?: string; location?: string; credibility?: string }) {
  const query = input.topic?.trim().toLowerCase() || "";
  return staticJournalEntries.filter((entry) => {
    const searchable = `${entry.title} ${entry.summary} ${entry.category.name} ${entry.location} ${entry.era}`.toLowerCase();
    return (!input.status || input.status === "All files" || entry.caseStatus === input.status) && (!input.category || input.category === "All shelves" || entry.category.name === input.category) && (!query || searchable.includes(query)) && (!input.era || entry.era === input.era) && (!input.location || entry.location === input.location) && (!input.credibility || entry.credibility === input.credibility);
  });
}
