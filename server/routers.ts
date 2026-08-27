import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { curatorProcedure, publicProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { activateCuratorPuzzle, createCategory, createCuratorPuzzle, createJournalEntry, createTheoryLetter, deleteCategory, deleteCuratorPuzzle, deleteJournalEntry, deleteTheoryLetter, getJournalAnalytics, getPublicJournalEntry, listAdminEntries, listCategories, listCuratorPuzzles, listPublicJournalEntries, listPublicJournalFilterValues, listPublicJournalPage, listPublicMapPins, listSources, listTheoryLetters, updateCategory, updateCuratorPuzzle, updateJournalEntry, updateTheoryLetterStatus } from "./db";
import { normalizeDriveImageUrl } from "./journalMedia";
import { createCuratorSession, CURATOR_SESSION_COOKIE, CURATOR_SESSION_MAX_AGE_MS, ensureActiveCuratorPuzzle, hasCuratorPassword, hasCuratorSession, setCuratorPassword, verifyCuratorLogin } from "./curatorAuth";
import { CURATOR_RELIC_IDS } from "../shared/curatorPuzzles";

const sourceSchema = z.object({ label: z.string().min(1).max(220), url: z.string().url(), note: z.string().max(1200).optional().nullable() });
const categorySchema = z.object({ name: z.string().min(2).max(96), slug: z.string().regex(/^[a-z0-9-]+$/).max(112), description: z.string().max(1200).optional().nullable(), color: z.string().regex(/^#[0-9a-fA-F]{3,8}$/) });
const entrySchema = z.object({ categoryId: z.number().int().positive().optional().nullable(), title: z.string().min(3).max(220), slug: z.string().regex(/^[a-z0-9-]+$/).max(240), caseNumber: z.string().max(32).optional().nullable(), caseStatus: z.enum(["documented", "disputed", "unverified", "ongoing", "unresolved"]).optional(), firstRecorded: z.string().max(96).optional().nullable(), location: z.string().max(180).optional().nullable(), era: z.string().max(96).optional().nullable(), mapLatitude: z.number().min(-90).max(90).optional().nullable(), mapLongitude: z.number().min(-180).max(180).optional().nullable(), timelineDate: z.string().max(96).optional().nullable(), evidenceLevel: z.number().int().min(0).max(100).optional(), evidenceMode: z.string().min(2).max(96), claim: z.string().max(12000).optional().nullable(), documentedEvidence: z.string().max(12000).optional().nullable(), counterargument: z.string().max(12000).optional().nullable(), anomaly: z.string().max(12000).optional().nullable(), theory: z.string().max(12000).optional().nullable(), authorTake: z.string().max(12000).optional().nullable(), relatedCaseSlugs: z.string().max(2400).optional().nullable(), relationNote: z.string().max(1200).optional().nullable(), summary: z.string().min(8), body: z.string().min(20), driveSourceUrl: z.string().url().optional().nullable(), imageCaption: z.string().max(1200).optional().nullable(), fontId: z.string().max(64), paletteId: z.string().max(64), symbol: z.string().max(32), vectorMark: z.string().max(64), stickerMotif: z.string().max(64), stickyTitle: z.string().max(140).optional().nullable(), stickyBody: z.string().max(1200).optional().nullable(), stickyTreatment: z.enum(["brass-pin", "top-tape", "crossed-tape", "thread-and-pin"]), stickyPlacement: z.enum(["margin", "left-lean", "right-lean"]), stampKind: z.enum(["auto", "top-secret", "unverified", "declassified", "case-closed", "none"]), status: z.enum(["draft", "published"]), featured: z.boolean(), sources: z.array(sourceSchema).max(20) });
const relicSequenceSchema = z.array(z.enum(CURATOR_RELIC_IDS)).length(4).refine((relics) => new Set(relics).size === 4, "Choose four different relics");
const curatorPuzzleSchema = z.object({ name: z.string().trim().min(3).max(96), title: z.string().trim().min(6).max(180), instruction: z.string().trim().min(12).max(1200), clue: z.string().trim().min(4).max(1200), relicIds: relicSequenceSchema, solutionOrder: relicSequenceSchema });

export const appRouter = router({
  system: systemRouter,
  auth: router({ me: publicProcedure.query((opts) => opts.ctx.user), logout: publicProcedure.mutation(({ ctx }) => { ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 }); return { success: true } as const; }) }),
  curator: router({
    status: publicProcedure.query(() => ({ configured: hasCuratorPassword() })),
    session: publicProcedure.query(async ({ ctx }) => ({ authenticated: await hasCuratorSession(ctx.req) })),
    puzzle: publicProcedure.query(async () => { const puzzle = await ensureActiveCuratorPuzzle(); const { solutionOrder: _solutionOrder, ...safePuzzle } = puzzle; return safePuzzle; }),
    unlock: publicProcedure.input(z.object({ password: z.string().min(1).max(256) })).mutation(async ({ ctx, input }) => {
      const accepted = await verifyCuratorLogin(input.password);
      if (!accepted) return { authenticated: false } as const;
      ctx.res.cookie(CURATOR_SESSION_COOKIE, await createCuratorSession(), { ...getSessionCookieOptions(ctx.req), maxAge: CURATOR_SESSION_MAX_AGE_MS });
      return { authenticated: true } as const;
    }),
    solve: publicProcedure.input(z.object({ puzzleId: z.number().int().positive(), sequence: relicSequenceSchema })).mutation(async ({ ctx, input }) => {
      const active = await ensureActiveCuratorPuzzle();
      if (input.puzzleId !== active.id || input.sequence.join(",") !== active.solutionOrder.join(",")) return { authenticated: false } as const;
      ctx.res.cookie(CURATOR_SESSION_COOKIE, await createCuratorSession(), { ...getSessionCookieOptions(ctx.req), maxAge: CURATOR_SESSION_MAX_AGE_MS });
      return { authenticated: true } as const;
    }),
    lock: publicProcedure.mutation(({ ctx }) => { ctx.res.clearCookie(CURATOR_SESSION_COOKIE, { ...getSessionCookieOptions(ctx.req), maxAge: -1 }); return { success: true } as const; }),
    changePassword: curatorProcedure.input(z.object({ currentPassword: z.string().min(1).max(256), nextPassword: z.string().min(8).max(256) })).mutation(async ({ input }) => {
      const accepted = await verifyCuratorLogin(input.currentPassword);
      if (!accepted) return { changed: false } as const;
      await setCuratorPassword(input.nextPassword);
      return { changed: true } as const;
    }),
    puzzles: curatorProcedure.query(() => listCuratorPuzzles()),
    createPuzzle: curatorProcedure.input(curatorPuzzleSchema).mutation(({ input }) => createCuratorPuzzle(input)),
    updatePuzzle: curatorProcedure.input(z.object({ id: z.number().int().positive(), data: curatorPuzzleSchema })).mutation(({ input }) => updateCuratorPuzzle(input.id, input.data)),
    activatePuzzle: curatorProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => activateCuratorPuzzle(input.id)),
    deletePuzzle: curatorProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteCuratorPuzzle(input.id)),
  }),
  journal: router({
    publicList: publicProcedure.query(() => listPublicJournalEntries()),
    publicPage: publicProcedure.input(z.object({ page: z.number().int().min(1), pageSize: z.number().int().min(4).max(24), categoryId: z.number().int().positive().optional(), caseStatus: z.enum(["documented", "disputed", "unverified", "ongoing", "unresolved"]).optional(), topic: z.string().trim().max(120).optional(), era: z.string().trim().max(96).optional(), location: z.string().trim().max(180).optional(), credibility: z.enum(["low", "cautious", "strong"]).optional() })).query(({ input }) => listPublicJournalPage(input)),
    publicFilters: publicProcedure.query(() => listPublicJournalFilterValues()),
    mapPins: publicProcedure.query(() => listPublicMapPins()),
    publicGet: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => getPublicJournalEntry(input.slug)),
    categories: publicProcedure.query(() => listCategories()),
  }),
  theoryLetters: router({
    submit: publicProcedure.input(z.object({ readerName: z.string().trim().min(2).max(120), theory: z.string().trim().min(20).max(3000) })).mutation(({ input }) => createTheoryLetter(input)),
  }),
  adminLetters: router({
    list: curatorProcedure.query(() => listTheoryLetters()),
    updateStatus: curatorProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["received", "read", "archived"]) })).mutation(({ input }) => updateTheoryLetterStatus(input.id, input.status)),
    delete: curatorProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteTheoryLetter(input.id)),
  }),
  adminJournal: router({
    entries: curatorProcedure.query(() => listAdminEntries()),
    categories: curatorProcedure.query(() => listCategories()),
    sources: curatorProcedure.input(z.object({ entryId: z.number().int().positive() })).query(({ input }) => listSources(input.entryId)),
    analytics: curatorProcedure.query(() => getJournalAnalytics()),
    createEntry: curatorProcedure.input(entrySchema).mutation(async ({ input }) => createJournalEntry(0, { ...input, categoryId: input.categoryId ?? null, driveSourceUrl: input.driveSourceUrl ?? null, imageCaption: input.imageCaption ?? null, stickyTitle: input.stickyTitle ?? null, stickyBody: input.stickyBody ?? null, driveRenderUrl: normalizeDriveImageUrl(input.driveSourceUrl) })),
    updateEntry: curatorProcedure.input(z.object({ id: z.number().int().positive(), data: entrySchema })).mutation(async ({ input }) => updateJournalEntry(input.id, { ...input.data, categoryId: input.data.categoryId ?? null, driveSourceUrl: input.data.driveSourceUrl ?? null, imageCaption: input.data.imageCaption ?? null, stickyTitle: input.data.stickyTitle ?? null, stickyBody: input.data.stickyBody ?? null, driveRenderUrl: normalizeDriveImageUrl(input.data.driveSourceUrl) })),
    deleteEntry: curatorProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteJournalEntry(input.id)),
    createCategory: curatorProcedure.input(categorySchema).mutation(({ input }) => createCategory({ ...input, description: input.description || null })),
    updateCategory: curatorProcedure.input(z.object({ id: z.number().int().positive(), data: categorySchema })).mutation(({ input }) => updateCategory(input.id, { ...input.data, description: input.data.description || null })),
    deleteCategory: curatorProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteCategory(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
