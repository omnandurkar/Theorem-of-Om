import { Client } from "pg";
import { describe, expect, it } from "vitest";

/**
 * Validates that Supabase credentials were supplied and accepted by the project REST gateway.
 * Secrets are read only from the server environment and are never logged or returned to the client.
 */
const projectUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function validateKey(key: string | undefined) {
  expect(projectUrl).toMatch(/^https:\/\/.+\.supabase\.co$/);
  expect(key).toBeTruthy();
  const response = await fetch(`${projectUrl}/rest/v1/`, {
    headers: {
      apikey: key!,
      Authorization: `Bearer ${key!}`,
    },
  });
  expect(response.status).not.toBe(401);
  expect(response.status).not.toBe(403);
}

describe("Supabase project credentials", () => {
  it.skip("accepts the supplied publishable key (pending a valid key from Om)", async () => {
    await validateKey(publishableKey);
  });

  it("accepts the supplied server-only service-role key", async () => {
    await validateKey(serviceRoleKey);
  });

  it("accepts the supplied server-only direct PostgreSQL migration URL", async () => {
    const directUrl = process.env.SUPABASE_DIRECT_URL;
    expect(directUrl).toMatch(/^postgres(?:ql)?:\/\//);

    const client = new Client({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });
    try {
      await client.connect();
      const result = await client.query<{ ready: number }>("select 1 as ready");
      expect(result.rows[0]?.ready).toBe(1);
    } finally {
      await client.end().catch(() => undefined);
    }
  }, 15_000);

  it("accepts the supplied server-only transaction PostgreSQL pooler URL", async () => {
    const transactionUrl = process.env.SUPABASE_DATABASE_URL;
    expect(transactionUrl).toMatch(/^postgres(?:ql)?:\/\//);

    const client = new Client({ connectionString: transactionUrl, ssl: { rejectUnauthorized: false } });
    try {
      await client.connect();
      const result = await client.query<{ ready: number }>("select 1 as ready");
      expect(result.rows[0]?.ready).toBe(1);
    } finally {
      await client.end().catch(() => undefined);
    }
  }, 15_000);

  it("contains the required independent journal schema", async () => {
    const directUrl = process.env.SUPABASE_DIRECT_URL;
    const client = new Client({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });
    try {
      await client.connect();
      const result = await client.query<{ table_name: string }>(`
        select table_name
        from information_schema.tables
        where table_schema = 'public'
          and table_name in (
            'curator_credentials',
            'curator_puzzles',
            'journal_categories',
            'journal_entries',
            'journal_sources',
            'theory_letters',
            'users'
          )
        order by table_name
      `);
      expect(result.rows.map((row) => row.table_name)).toEqual([
        "curator_credentials",
        "curator_puzzles",
        "journal_categories",
        "journal_entries",
        "journal_sources",
        "theory_letters",
        "users",
      ]);
    } finally {
      await client.end().catch(() => undefined);
    }
  }, 15_000);
});
