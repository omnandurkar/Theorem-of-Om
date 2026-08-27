export function reorderSourceDrafts<T>(items: T[], from: number, to: number): T[] {
  if (from < 0 || to < 0 || from >= items.length || to >= items.length || from === to) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function moveSourceDraft<T>(items: T[], from: number, direction: -1 | 1): T[] {
  return reorderSourceDrafts(items, from, from + direction);
}
