import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { hashCuratorPassword, verifyCuratorPassword } from "./curatorAuth";

describe("curator password configuration", () => {
  it("exposes only configuration state, never the supplied password", async () => {
    const caller = appRouter.createCaller({ req: {} as TrpcContext["req"], res: {} as TrpcContext["res"], user: null });
    const result = await caller.curator.status();
    expect(result).toEqual({ configured: true });
    expect(JSON.stringify(result)).not.toContain("Pass@123");
  });

  it("hashes and verifies the curator password without retaining plaintext", () => {
    const hash = hashCuratorPassword("Pass@123", "test-salt");
    expect(hash).not.toContain("Pass@123");
    expect(verifyCuratorPassword("Pass@123", hash)).toBe(true);
    expect(verifyCuratorPassword("not-the-password", hash)).toBe(false);
  });

  it("keeps the active puzzle answer private and rejects an incorrect sequence", async () => {
    const cookies: Array<{ name: string; value: string }> = [];
    const ctx = { req: { protocol: "https", headers: {} } as TrpcContext["req"], res: { cookie: (name: string, value: string) => cookies.push({ name, value }) } as unknown as TrpcContext["res"], user: null };
    const caller = appRouter.createCaller(ctx);
    const puzzle = await caller.curator.puzzle();
    expect(JSON.stringify(puzzle)).not.toContain("solutionOrder");
    const wrongSequence = [...puzzle.relicIds].reverse();
    expect(await caller.curator.solve({ puzzleId: puzzle.id, sequence: wrongSequence })).toEqual({ authenticated: false });
    expect(cookies).toEqual([]);
  });
});
