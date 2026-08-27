import { ArrowDown, ArrowUp, GripVertical, ListOrdered } from "lucide-react";
import { useState, type DragEvent } from "react";
import { moveSourceDraft, reorderSourceDrafts } from "@/lib/sourceOrdering";
import "./sourceOrderingDesk.css";

export type SourceOrderItem = { label: string; url: string; note: string };

export function SourceOrderingDesk({ sources, onChange }: { sources: SourceOrderItem[]; onChange: (sources: SourceOrderItem[]) => void }) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const move = (from: number, direction: -1 | 1) => onChange(moveSourceDraft(sources, from, direction));
  const drop = (event: DragEvent<HTMLLIElement>, targetIndex: number) => {
    event.preventDefault();
    if (draggedIndex === null) return;
    onChange(reorderSourceDrafts(sources, draggedIndex, targetIndex));
    setDraggedIndex(null);
  };

  if (!sources.length) return null;

  return <section className="source-ordering-desk" aria-label="Source order desk">
    <header><div><span className="micro-label">SOURCE ORDER / READER PATH</span><h4>Arrange the<br /><em>trail.</em></h4></div><ListOrdered size={20} aria-hidden="true" /></header>
    <p>The first card leads the reader’s source trail. Drag a card or use its arrows; the order persists when this case is saved.</p>
    <ol>{sources.map((source, index) => <li key={`${source.url}-${index}`} draggable onDragStart={() => setDraggedIndex(index)} onDragEnd={() => setDraggedIndex(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => drop(event, index)} className={draggedIndex === index ? "is-dragging" : ""}><span className="source-order-grip" aria-hidden="true"><GripVertical size={16} /></span><b>{String(index + 1).padStart(2, "0")}</b><div><strong>{source.label || "Untitled reference"}</strong><small>{source.note || "No curator note yet."}</small></div><nav aria-label={`Move ${source.label || "source"}`}><button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move source earlier"><ArrowUp size={14} /></button><button type="button" onClick={() => move(index, 1)} disabled={index === sources.length - 1} aria-label="Move source later"><ArrowDown size={14} /></button></nav></li>)}</ol>
  </section>;
}
