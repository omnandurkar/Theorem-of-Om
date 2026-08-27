export const EDITOR_PREVIEW_KEY = "kemet-editor-preview-draft";

export type EditorPreviewDraft = { title?: string; caseNumber?: string; summary?: string; body?: string; driveSourceUrl?: string; imageCaption?: string; fontId?: string; paletteId?: string; symbol?: string; vectorMark?: string; stickerMotif?: string; stickyTitle?: string; stickyBody?: string; stickyTreatment?: string; stickyPlacement?: string; stampKind?: string; caseStatus?: string; evidenceLevel?: number; evidenceMode?: string; location?: string; era?: string; sources?: Array<{ label: string; url: string; note: string }> };

export function readEditorPreview(serialized: string | null): EditorPreviewDraft | null {
  if (!serialized) return null;
  try {
    const draft = JSON.parse(serialized) as unknown;
    if (!draft || typeof draft !== "object" || Array.isArray(draft)) return null;
    return draft as EditorPreviewDraft;
  } catch { return null; }
}

export function previewTitle(draft: EditorPreviewDraft) {
  return draft.title?.trim() || "Your unpublished case file";
}
