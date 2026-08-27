export type CaseFlowSignals = { title: string; caseNumber: string; summary: string; body: string; documentedEvidence: string; sources: unknown[]; driveSourceUrl: string; stickyTitle: string; fontId: string };

export const CASE_FLOW_LABELS = ["Identify", "Write", "Evidence", "Shape & release"] as const;

export function caseFlowReadiness(entry: CaseFlowSignals) {
  return [Boolean(entry.title && entry.caseNumber), Boolean(entry.summary && entry.body), Boolean(entry.documentedEvidence || entry.sources.length || entry.driveSourceUrl), Boolean(entry.stickyTitle || entry.fontId)];
}
