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
});
