import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Eye } from "lucide-react";
import { CasePaperPreview, ReaderPreviewEmpty } from "@/components/CasePaperPreview";
import { EDITOR_PREVIEW_KEY, readEditorPreview, type EditorPreviewDraft } from "@/lib/editorPreview";

export default function EditorReaderPreview() {
  const [draft, setDraft] = useState<EditorPreviewDraft | null>(null);
  useEffect(() => setDraft(readEditorPreview(window.localStorage.getItem(EDITOR_PREVIEW_KEY))), []);
  if (!draft) return <ReaderPreviewEmpty />;
  return <main className="editor-reader-preview"><header><div><span className="micro-label"><Eye size={13} /> OM’S LOCAL READER PREVIEW</span><strong>Not published · private to this browser</strong></div><Link href="/om-dashboard?desk=cases">Back to composition desk <ArrowUpRight size={15} /></Link></header><section><CasePaperPreview entry={draft} mode="reader" /></section></main>;
}
