import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const directUrl = process.env.SUPABASE_DIRECT_URL;
const client = new Client({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });

beforeAll(async () => {
  expect(directUrl).toMatch(/^postgres(?:ql)?:\/\//);
  await client.connect();
  await client.query("begin");
}, 15_000);

afterAll(async () => {
  await client.query("rollback").catch(() => undefined);
  await client.end().catch(() => undefined);
});

describe("Supabase independent journal workflow", () => {
  it("persists a draft, publication state, and source order within one reversible transaction", async () => {
    const categoryResult = await client.query<{ id: number }>(`
      insert into journal_categories ("name", "slug", "color")
      values ('Temporary verification shelf', 'temporary-verification-shelf', '#1d5671')
      returning id
    `);
    const categoryId = categoryResult.rows[0]?.id;
    expect(categoryId).toBeTypeOf("number");

    const entryResult = await client.query<{ id: number; status: string }>(`
      insert into journal_entries ("authorId", "categoryId", "title", "slug", "summary", "body", "status")
      values (0, $1, 'Temporary migration verification', 'temporary-migration-verification', 'A rollback-only database verification record.', 'This record exists only inside the test transaction and is rolled back.', 'draft')
      returning id, status
    `, [categoryId]);
    const entryId = entryResult.rows[0]?.id;
    expect(entryResult.rows[0]?.status).toBe("draft");
    expect(entryId).toBeTypeOf("number");

    await client.query(`
      insert into journal_sources ("entryId", "label", "url", "note", "position")
      values
        ($1, 'Second in public trail', 'https://example.com/second', 'Rollback-only source ordering check.', 1),
        ($1, 'First in public trail', 'https://example.com/first', 'Rollback-only source ordering check.', 0)
    `, [entryId]);

    await client.query(`update journal_entries set "status" = 'published', "publishedAt" = now() where id = $1`, [entryId]);
    const sourceResult = await client.query<{ label: string; position: number }>(`
      select "label", "position" from journal_sources where "entryId" = $1 order by "position"
    `, [entryId]);
    expect(sourceResult.rows).toEqual([
      { label: "First in public trail", position: 0 },
      { label: "Second in public trail", position: 1 },
    ]);

    const publishedResult = await client.query<{ status: string }>(`select "status" from journal_entries where id = $1`, [entryId]);
    expect(publishedResult.rows[0]?.status).toBe("published");
  });

  it("stores reader-letter status and curator puzzle records without retaining verification content", async () => {
    const letterResult = await client.query<{ id: number }>(`
      insert into theory_letters ("readerName", "theory", "status")
      values ('Temporary verifier', 'This rollback-only record verifies that reader letters can be stored and managed.', 'received')
      returning id
    `);
    const letterId = letterResult.rows[0]?.id;
    await client.query(`update theory_letters set "status" = 'read' where id = $1`, [letterId]);
    const letterStatusResult = await client.query<{ status: string }>(`select "status" from theory_letters where id = $1`, [letterId]);
    expect(letterStatusResult.rows[0]?.status).toBe("read");

    const puzzleResult = await client.query<{ id: number }>(`
      insert into curator_puzzles ("name", "title", "instruction", "clue", "relicIds", "solutionOrder", "isActive")
      values ('Temporary verification puzzle', 'Temporary verification tablet', 'Select the four temporary verification relics in their intended order.', 'This data rolls back.', 'djed,eye,ankh,scarab', 'djed,eye,ankh,scarab', false)
      returning id
    `);
    const puzzleId = puzzleResult.rows[0]?.id;
    await client.query(`update curator_puzzles set "isActive" = true where id = $1`, [puzzleId]);
    const activePuzzleResult = await client.query<{ isActive: boolean }>(`select "isActive" from curator_puzzles where id = $1`, [puzzleId]);
    expect(activePuzzleResult.rows[0]?.isActive).toBe(true);

    await client.query(`
      insert into curator_credentials (id, "passwordHash")
      values (1, 'rollback-only-placeholder-hash')
      on conflict (id) do update set "passwordHash" = excluded."passwordHash"
    `);
    const credentialResult = await client.query<{ passwordHash: string }>(`select "passwordHash" from curator_credentials where id = 1`);
    expect(credentialResult.rows[0]?.passwordHash).toBe("rollback-only-placeholder-hash");
  });
});
