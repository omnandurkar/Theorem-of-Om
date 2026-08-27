import { trpc } from "@/lib/trpc";

export function useCuratorAuth() {
  const utils = trpc.useUtils();
  const session = trpc.curator.session.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const lockMutation = trpc.curator.lock.useMutation({ onSuccess: () => utils.curator.session.invalidate() });
  return { isAuthenticated: Boolean(session.data?.authenticated), loading: session.isLoading || lockMutation.isPending, refresh: () => utils.curator.session.invalidate(), lock: () => lockMutation.mutate(), error: session.error ?? lockMutation.error ?? null };
}
