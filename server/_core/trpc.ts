import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import { hasCuratorSession } from "../curatorAuth";

const t = initTRPC.context<TrpcContext>().create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * The journal is single-curator. Protected author actions authenticate through
 * the signed antechamber session rather than a hosted OAuth user account.
 */
export const curatorProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    if (!(await hasCuratorSession(opts.ctx.req))) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Curator puzzle entry required" });
    }
    return opts.next();
  }),
);
