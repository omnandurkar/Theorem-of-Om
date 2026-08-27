export type JournalSourceDraft = { label: string; url: string; note: string };

export function hydrateSourceDrafts(sources: Array<{ label: string; url: string; note: string | null }>): JournalSourceDraft[] {
  return sources.map((source) => ({ label: source.label, url: source.url, note: source.note || "" }));
}

export function validSourceDrafts(sources: JournalSourceDraft[]) { return sources.filter((source) => source.label.trim() && source.url.trim()); }
