import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  createJournalEntry: vi.fn(async () => 41),
  updateJournalEntry: vi.fn(async () => undefined),
  deleteJournalEntry: vi.fn(async () => undefined),
  createCategory: vi.fn(async () => 1),
  updateCategory: vi.fn(async () => undefined),
  deleteCategory: vi.fn(async () => undefined),
  getJournalAnalytics: vi.fn(async () => ({})),
  getPublicJournalEntry: vi.fn(async () => null),
  listAdminEntries: vi.fn(async () => []),
  listCategories: vi.fn(async () => []),
  listPublicJournalEntries: vi.fn(async () => []),
  listPublicJournalPage: vi.fn(async () => ({ items: [], total: 0, page: 1, pageSize: 6, totalPages: 1 })),
  listPublicJournalFilterValues: vi.fn(async () => ({ eras: [], locations: [] })),
  listPublicMapPins: vi.fn(async () => []),
  listSources: vi.fn(async () => []),
  createTheoryLetter: vi.fn(async () => 9),
  listTheoryLetters: vi.fn(async () => []),
  updateTheoryLetterStatus: vi.fn(async () => undefined),
  deleteTheoryLetter: vi.fn(async () => undefined),
}));

vi.mock("./db", () => dbMocks);

const { appRouter } = await import("./routers");
const { createCuratorSession, CURATOR_SESSION_COOKIE } = await import("./curatorAuth");

const context: TrpcContext = {
  user: { id: 7, openId: "om-owner", name: "Om Nandurkar", email: null, loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: { protocol: "https", headers: { cookie: `${CURATOR_SESSION_COOKIE}=${await createCuratorSession()}` } } as TrpcContext["req"],
  res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
};

const entryPayload = {
  title: "A preserved source trail",
  slug: "a-preserved-source-trail",
  caseNumber: "CASE 017",
  caseStatus: "disputed" as const,
  firstRecorded: "1950",
  location: "North Atlantic",
  era: "1950s",
  mapLatitude: 25.7617,
  mapLongitude: -80.1918,
  timelineDate: "1950 CE",
  evidenceLevel: 60,
  evidenceMode: "Cultural myth",
  claim: "A claim suitable for a clearly labelled case file.",
  documentedEvidence: "A documented record that can be separated from the claim.",
  counterargument: "A counterargument that remains visible to a reader.",
  anomaly: "An unresolved detail that does not become a conclusion.",
  theory: "A speculative interpretation held apart from the record.",
  authorTake: "Om’s personal reading of the open question.",
  relatedCaseSlugs: "orion-ground-plan,curse-cabinet",
  relationNote: "These cases share an editorial question, not a proven connection.",
  summary: "A properly long summary for a persistent source-preservation test.",
  body: "A properly long journal body that lets the protected mutation reach the database contract safely.",
  driveSourceUrl: "https://drive.google.com/file/d/1sg4ZqsS12eB05qRvFQAk_zhvWZahTT6n/view?usp=sharing",
  imageCaption: "A public Drive image",
  fontId: "cormorant",
  paletteId: "limestone",
  symbol: "𓂀",
  vectorMark: "grid",
  stickerMotif: "scarab-eye",
  stickyTitle: "Reference note",
  stickyBody: "Sources remain visible after an update.",
  stickyTreatment: "crossed-tape" as const,
  stickyPlacement: "right-lean" as const,
  stampKind: "auto" as const,
  status: "draft" as const,
  featured: false,
  sources: [{ label: "Museum catalogue", url: "https://example.org/catalogue", note: "Object context" }],
};

describe("adminJournal mutations", () => {
  beforeEach(() => vi.clearAllMocks());

  it("normalizes a public Drive file link and retains sources during creation", async () => {
    const result = await appRouter.createCaller(context).adminJournal.createEntry(entryPayload);
    expect(result).toBe(41);
    expect(dbMocks.createJournalEntry).toHaveBeenCalledWith(0, expect.objectContaining({
      driveRenderUrl: "https://lh3.googleusercontent.com/d/1sg4ZqsS12eB05qRvFQAk_zhvWZahTT6n=w2000",
      sources: entryPayload.sources,
      caseNumber: "CASE 017",
      caseStatus: "disputed",
      evidenceLevel: 60,
      era: "1950s",
      mapLatitude: 25.7617,
      mapLongitude: -80.1918,
      relatedCaseSlugs: "orion-ground-plan,curse-cabinet",
      stickyTreatment: "crossed-tape",
      stickyPlacement: "right-lean",
      stampKind: "auto",
    }));
  });

  it("passes the complete existing source trail through an entry update", async () => {
    await appRouter.createCaller(context).adminJournal.updateEntry({ id: 41, data: entryPayload });
    expect(dbMocks.updateJournalEntry).toHaveBeenCalledWith(41, expect.objectContaining({
      driveRenderUrl: "https://lh3.googleusercontent.com/d/1sg4ZqsS12eB05qRvFQAk_zhvWZahTT6n=w2000",
      sources: entryPayload.sources,
      authorTake: "Om’s personal reading of the open question.",
      relationNote: "These cases share an editorial question, not a proven connection.",
      era: "1950s",
      mapLatitude: 25.7617,
      mapLongitude: -80.1918,
      stickyTreatment: "crossed-tape",
      stickyPlacement: "right-lean",
      stampKind: "auto",
    }));
  });
});

describe("reader theory letters", () => {
  beforeEach(() => vi.clearAllMocks());

  it("accepts a public letter containing only a reader name and a substantive theory", async () => {
    const result = await appRouter.createCaller(context).theoryLetters.submit({ readerName: "Nefru", theory: "Could the recurring use of threshold myths map how ancient communities understood guarded ceremonial transitions?" });
    expect(result).toBe(9);
    expect(dbMocks.createTheoryLetter).toHaveBeenCalledWith(expect.objectContaining({ readerName: "Nefru", theory: expect.stringContaining("threshold myths") }));
  });

  it("lets Om move a filed letter through the private inbox and remove it", async () => {
    await appRouter.createCaller(context).adminLetters.updateStatus({ id: 9, status: "read" });
    await appRouter.createCaller(context).adminLetters.delete({ id: 9 });
    expect(dbMocks.updateTheoryLetterStatus).toHaveBeenCalledWith(9, "read");
    expect(dbMocks.deleteTheoryLetter).toHaveBeenCalledWith(9);
  });
});

describe("public archive discovery", () => {
  beforeEach(() => vi.clearAllMocks());

  it("passes topic, era, location, and credibility filters to the paginated public archive", async () => {
    await appRouter.createCaller(context).journal.publicPage({ page: 1, pageSize: 6, topic: "pyramid", era: "Old Kingdom", location: "Giza", credibility: "strong" });
    expect(dbMocks.listPublicJournalPage).toHaveBeenCalledWith(expect.objectContaining({ topic: "pyramid", era: "Old Kingdom", location: "Giza", credibility: "strong" }));
    await appRouter.createCaller(context).journal.mapPins();
    expect(dbMocks.listPublicMapPins).toHaveBeenCalledOnce();
  });
});
