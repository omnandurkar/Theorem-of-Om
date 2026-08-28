import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

/**
 * Public readers have no account state. Curator-only procedures verify the
 * signed antechamber session directly from the request cookie.
 */
export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: null;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  return { req: opts.req, res: opts.res, user: null };
}
