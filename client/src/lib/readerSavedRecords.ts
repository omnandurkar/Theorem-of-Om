export const SAVED_RECORDS_KEY = "theorem-of-kemet.saved-records";

export function parseSavedRecords(raw: string | null) {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function toggleSavedRecord(records: string[], slug: string) {
  return records.includes(slug) ? records.filter((record) => record !== slug) : [...records, slug];
}
