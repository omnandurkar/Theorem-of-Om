import { Circle, Highlighter, Strikethrough, Underline } from "lucide-react";
import type { TextareaHTMLAttributes } from "react";
import { useRef, useState } from "react";

export type AnnotationKind = "h-butter" | "h-rose" | "h-sage" | "h-sky" | "h-lilac" | "h-apricot" | "underline" | "circle" | "scratch";
const MARK_PATTERN = /\[\[mk:(h-(?:butter|rose|sage|sky|lilac|apricot)|underline|circle|scratch)\|([\s\S]*?)\]\]/g;

export const HIGHLIGHTERS: Array<{ id: AnnotationKind; label: string }> = [
  { id: "h-butter", label: "Butter" }, { id: "h-rose", label: "Rose" }, { id: "h-sage", label: "Sage" }, { id: "h-sky", label: "Sky" }, { id: "h-lilac", label: "Lilac" }, { id: "h-apricot", label: "Apricot" },
];

export function applyNotebookMark(value: string, start: number, end: number, kind: AnnotationKind) {
  if (start === end) return value;
  return `${value.slice(0, start)}[[mk:${kind}|${value.slice(start, end)}]]${value.slice(end)}`;
}

export function AnnotatedText({ value }: { value: string }) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const match of Array.from(value.matchAll(MARK_PATTERN))) {
    const index = match.index ?? 0;
    if (index > cursor) parts.push(value.slice(cursor, index));
    parts.push(<span className={`notebook-mark notebook-${match[1]}`} key={`${index}-${match[1]}`}>{match[2]}</span>);
    cursor = index + match[0].length;
  }
  if (cursor < value.length) parts.push(value.slice(cursor));
  return <>{parts}</>;
}

type NotebookTextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> & { value: string; onValueChange: (value: string) => void };

export function NotebookTextarea({ value, onValueChange, className = "", ...props }: NotebookTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("Select words, then choose a notebook mark.");
  const markSelection = (kind: AnnotationKind) => {
    const textarea = textareaRef.current;
    if (!textarea || textarea.selectionStart === textarea.selectionEnd) { setMessage("Select some wording first."); return; }
    const next = applyNotebookMark(value, textarea.selectionStart, textarea.selectionEnd, kind);
    onValueChange(next);
    setMessage(`${kind.startsWith("h-") ? "Pastel highlight" : kind} added to the selected words.`);
    requestAnimationFrame(() => textarea.focus());
  };
  return <div className="notebook-textarea"><div className="notebook-toolbar" aria-label="Notebook annotation controls"><span>MARK SELECTED TEXT</span>{HIGHLIGHTERS.map((highlighter) => <button type="button" className={`notebook-swatch ${highlighter.id}`} onClick={() => markSelection(highlighter.id)} title={`${highlighter.label} highlighter`} aria-label={`${highlighter.label} highlighter`} key={highlighter.id}><Highlighter size={12} /></button>)}<button type="button" className="notebook-tool" onClick={() => markSelection("underline")} title="Pencil underline" aria-label="Pencil underline"><Underline size={13} /></button><button type="button" className="notebook-tool" onClick={() => markSelection("circle")} title="Hand-drawn circle" aria-label="Hand-drawn circle"><Circle size={13} /></button><button type="button" className="notebook-tool" onClick={() => markSelection("scratch")} title="Pencil scratch" aria-label="Pencil scratch"><Strikethrough size={13} /></button></div><textarea ref={textareaRef} className={className} value={value} onChange={(event) => onValueChange(event.target.value)} {...props} /><small className="notebook-message">{message}</small></div>;
}
