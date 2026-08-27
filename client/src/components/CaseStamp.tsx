export const STAMP_KINDS = ["auto", "top-secret", "unverified", "declassified", "case-closed", "none"] as const;
export type StampKind = typeof STAMP_KINDS[number];
export type PublicStampKind = Exclude<StampKind, "auto" | "none">;

type StampContext = { stampKind?: string | null; caseStatus?: string | null; evidenceLevel?: number | null };

export function resolveCaseStamp({ stampKind, caseStatus, evidenceLevel }: StampContext): PublicStampKind | null {
  if (stampKind && stampKind !== "auto") return stampKind === "none" ? null : stampKind as PublicStampKind;
  const level = evidenceLevel ?? 50;
  if (caseStatus === "documented" && level >= 85) return "case-closed";
  if (caseStatus === "documented" || level >= 70) return "declassified";
  if (caseStatus === "unverified" || level <= 30) return "unverified";
  return "top-secret";
}

const STAMP_COPY: Record<PublicStampKind, { title: string; line: string; glyph: string }> = {
  "top-secret": { title: "TOP SECRET", line: "EYES ONLY · OMN", glyph: "◒" },
  unverified: { title: "UNVERIFIED", line: "HOLD FOR REVIEW", glyph: "?" },
  declassified: { title: "DECLASSIFIED", line: "RELEASED · OMN", glyph: "⌁" },
  "case-closed": { title: "CASE CLOSED", line: "FILED · NOT FINAL", glyph: "×" },
};

export function CaseStamp({ stampKind, caseStatus, evidenceLevel, compact = false }: StampContext & { compact?: boolean }) {
  const stamp = resolveCaseStamp({ stampKind, caseStatus, evidenceLevel });
  if (!stamp) return null;
  const copy = STAMP_COPY[stamp];
  return <span className={`case-stamp stamp-${stamp}${compact ? " is-compact" : ""}`} aria-label={`Editorial status: ${copy.title}`}><svg viewBox="0 0 180 84" aria-hidden="true"><rect x="5" y="5" width="170" height="74" rx="4" /><rect x="10" y="10" width="160" height="64" rx="2" /><path d="M18 22H162M18 62H162" /><circle cx="31" cy="42" r="11" /><path d="M149 31l8 11-8 11M142 31l8 11-8 11" /></svg><b>{copy.title}</b><i>{copy.glyph} {copy.line}</i></span>;
}
