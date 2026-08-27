import { ArrowUpRight, CircleDot, Eye, Image, Palette, Sparkles, Type } from "lucide-react";
import { Link } from "wouter";
import { FONT_CATALOG, PALETTES, STICKER_MOTIFS, SYMBOLS, VECTOR_MARKS } from "@/data/editorCatalog";
import { normalizeDriveImageUrl } from "@/lib/driveMedia";
import type { EditorPreviewDraft } from "@/lib/editorPreview";
import { SourceOrderingDesk } from "@/components/SourceOrderingDesk";

type Patch = (patch: Partial<EditorPreviewDraft>) => void;

export function CasePaperPreview({ entry, mode = "desk" }: { entry: EditorPreviewDraft; mode?: "desk" | "reader" }) {
  const font = FONT_CATALOG.find((item) => item.id === entry.fontId) || FONT_CATALOG[0];
  const palette = PALETTES.find((item) => item.id === entry.paletteId) || PALETTES[0];
  const image = entry.driveSourceUrl ? normalizeDriveImageUrl(entry.driveSourceUrl) : "";
  const body = entry.body?.trim() || "The long-form record will appear here as Om composes it. Every paper choice remains local until the case is saved and published.";

  return <article className={`case-paper-preview case-paper-${mode} vector-${entry.vectorMark || "grid"}`} style={{ "--case-paper": palette.value, "--case-font": font.value } as React.CSSProperties}>
    <div className="case-paper-vector" aria-hidden="true" />
    <span className="case-paper-symbol">{entry.symbol || "𓂀"}</span>
    <span className={`case-paper-sticker sticker-${entry.stickerMotif || "scarab-eye"}`}>{entry.stickerMotif === "spider" ? "⌁" : entry.stickerMotif === "butterfly" ? "♢" : entry.stickerMotif === "astrolabe" ? "☾" : entry.stickerMotif === "sealed-book" ? "▣" : entry.stickerMotif === "arrowhead" ? "➤" : "𓆣"}</span>
    <div className="case-paper-head"><span>{entry.caseNumber || "UNFILED CASE"}</span><i>{entry.caseStatus || "disputed"} · {entry.evidenceLevel ?? 50}/100</i></div>
    <h2>{entry.title?.trim() || "Your record title"}</h2>
    <p className="case-paper-summary">{entry.summary?.trim() || "A summary appears here as the case begins to take its final reader shape."}</p>
    {image ? <figure className="case-paper-image"><img src={image} alt={entry.imageCaption || "Draft Drive image"} /><figcaption>{entry.imageCaption || "Draft evidence print"}</figcaption></figure> : <div className="case-paper-image empty"><Image size={21} /><span>DRIVE IMAGE PRINT / OPTIONAL</span></div>}
    <p className="case-paper-body">{body.split(/\n{2,}/)[0]}</p>
    <aside className={`case-paper-note note-${entry.stickyTreatment || "brass-pin"} note-place-${entry.stickyPlacement || "margin"}`}><span className="note-attachment" /><strong>{entry.stickyTitle || "Margin note"}</strong><p>{entry.stickyBody || "A visual note will sit beside this reader paper."}</p></aside>
    <footer><span>{entry.evidenceMode || "Cultural myth"}</span><span>{entry.location || "Location unfiled"}{entry.era ? ` · ${entry.era}` : ""}</span></footer>
  </article>;
}

function VisualGroup({ title, icon: Icon, children }: { title: string; icon: typeof Type; children: React.ReactNode }) {
  return <section className="visual-choice-group"><h4><Icon size={14} /> {title}</h4><div>{children}</div></section>;
}

export function VisualChoiceCatalogue({ entry, onPatch }: { entry: EditorPreviewDraft; onPatch: Patch }) {
  return <section className="visual-choice-catalogue">
    <div className="visual-catalogue-head"><div><span className="micro-label">MATERIAL & MARK PREVIEWS</span><h3>See the paper<br /><em>before the record.</em></h3></div><p>Every chip is a usable choice. Select a sample to update the live reader paper beside it.</p></div>
    <VisualGroup title="Type sample" icon={Type}>{FONT_CATALOG.map((item) => <button type="button" title={item.label} className={entry.fontId === item.id ? "active font-swatch" : "font-swatch"} style={{ fontFamily: item.value }} onClick={() => onPatch({ fontId: item.id })} key={item.id}>Ag<span>{item.label.split(" · ")[0]}</span></button>)}</VisualGroup>
    <VisualGroup title="Paper wash" icon={Palette}>{PALETTES.map((item) => <button type="button" title={item.label} className={entry.paletteId === item.id ? "active palette-swatch" : "palette-swatch"} style={{ "--swatch-color": item.value } as React.CSSProperties} onClick={() => onPatch({ paletteId: item.id })} key={item.id}><i /><span>{item.label}</span></button>)}</VisualGroup>
    <VisualGroup title="Symbol & circle marks" icon={CircleDot}>{SYMBOLS.map((item) => <button type="button" title={item.label} className={entry.symbol === item.value ? "active symbol-swatch" : "symbol-swatch"} onClick={() => onPatch({ symbol: item.value })} key={item.id}>{item.value}</button>)}{VECTOR_MARKS.map((item) => <button type="button" title={item.label} className={entry.vectorMark === item.value ? `active vector-swatch vector-${item.value}` : `vector-swatch vector-${item.value}`} onClick={() => onPatch({ vectorMark: item.value })} key={item.id}><i /><span>{item.label}</span></button>)}</VisualGroup>
    <VisualGroup title="Field sticker" icon={Sparkles}>{STICKER_MOTIFS.map((item) => <button type="button" title={item.label} className={entry.stickerMotif === item.value ? "active sticker-swatch" : "sticker-swatch"} onClick={() => onPatch({ stickerMotif: item.value })} key={item.id}><span>{item.value === "spider" ? "⌁" : item.value === "butterfly" ? "♢" : item.value === "astrolabe" ? "☾" : item.value === "sealed-book" ? "▣" : item.value === "arrowhead" ? "➤" : "𓆣"}</span>{item.label}</button>)}</VisualGroup>
    <SourceOrderingDesk sources={entry.sources || []} onChange={(sources) => onPatch({ sources })} />
  </section>;
}

export function ReaderPreviewEmpty() {
  return <main className="reader-preview-empty"><Eye size={26} /><span className="micro-label">NO LOCAL COMPOSITION OPEN</span><h1>Open the reader<br /><em>preview</em> from Om’s desk.</h1><p>The separate preview is private to this browser and never publishes a case file.</p><Link href="/om-dashboard?desk=cases">Return to the composition desk <ArrowUpRight size={16} /></Link></main>;
}

