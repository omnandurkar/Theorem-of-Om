import { ArrowLeft, ArrowUpRight, ExternalLink, FileWarning, Link2, Quote } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import { Link, useParams } from "wouter";
import { FONT_CATALOG, PALETTES } from "@/data/editorCatalog";
import { AnnotatedText } from "@/components/NotebookAnnotations";
import { CaseEvidenceBoard } from "@/components/CaseEvidenceBoard";
import { InvestigationIndex } from "@/components/InvestigationIndex";
import { PageFooter, ReadingRail } from "@/components/SiteChrome";
import { trpc } from "@/lib/trpc";
import { stickyNoteClassName } from "@/lib/stickyNote";
import { DrivePolaroid } from "@/components/DrivePolaroid";
import { CaseStamp } from "@/components/CaseStamp";
import { ArchiveBreadcrumb } from "@/components/ArchiveNavigation";

const statusLabel = (value: string) => value.replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function JournalEntry() {
  const { slug } = useParams<{ slug: string }>();
  const { data: entry, isLoading } = trpc.journal.publicGet.useQuery({ slug });
  const { data: allEntries = [] } = trpc.journal.publicList.useQuery();
  const [lens, setLens] = useState<"myth" | "archive">("archive");
  const [openSource, setOpenSource] = useState<number | null>(null);
  const related = useMemo(() => {
    const slugs = (entry?.relatedCaseSlugs || "").split(",").map((item) => item.trim()).filter(Boolean);
    return allEntries.filter((item) => slugs.includes(item.slug));
  }, [allEntries, entry?.relatedCaseSlugs]);

  if (isLoading) return <main className="journal-entry-loading">Opening record…</main>;
  if (!entry) return <main className="journal-entry-loading"><FileWarning size={24} /><h1>This record is not on the public shelf.</h1><Link href="/journal">Return to the journal</Link></main>;

  const font = FONT_CATALOG.find((item) => item.id === entry.fontId)?.value || "Cormorant Garamond, serif";
  const wash = PALETTES.find((item) => item.id === entry.paletteId)?.value || "#f1ead8";
  const style = { "--journal-entry-font": font, "--journal-entry-wash": wash } as CSSProperties;
  const evidenceWidth = `${Math.min(100, Math.max(0, entry.evidenceLevel ?? 50))}%`;
  const caseNumber = entry.caseNumber || `CASE ${String(entry.id).padStart(3, "0")}`;
  const noteClassName = stickyNoteClassName(entry.stickyTreatment, entry.stickyPlacement);

  return <main className="journal-entry-page" style={style}>
    <ReadingRail current={`${caseNumber} / ${entry.caseStatus.toUpperCase()}`} />
    <ArchiveBreadcrumb items={[{ label: "Journal", href: "/journal" }, { label: entry.category?.name || "Case files", href: "/index" }, { label: caseNumber }]} />
    <section className="journal-entry-hero">
      {entry.driveRenderUrl && <DrivePolaroid src={entry.driveRenderUrl} alt={entry.imageCaption || entry.title} caption={entry.imageCaption} variant="hero" />}
      <div className="journal-entry-hero-overlay" />
      <Link href="/journal" className="article-back"><ArrowLeft size={16} /> Journal shelves</Link>
      <div className="journal-entry-hero-copy"><span className="micro-label">{caseNumber} · {entry.category?.name || "UNSHELVED"}</span><h1>{entry.title}</h1><p><AnnotatedText value={entry.summary} /></p><div><span>{statusLabel(entry.caseStatus)} / {entry.evidenceMode}</span><span>{entry.publishedAt ? new Date(entry.publishedAt).toLocaleDateString() : "RECENTLY FILED"}</span></div></div><CaseStamp stampKind={entry.stampKind} caseStatus={entry.caseStatus} evidenceLevel={entry.evidenceLevel} />
      <span className="journal-entry-symbol">{entry.symbol}</span>
    </section>
    <section className="case-file-strip"><div><span>STATUS</span><strong className={`case-status-${entry.caseStatus}`}>{statusLabel(entry.caseStatus)}</strong></div><div><span>FIRST RECORDED</span><strong>{entry.firstRecorded || "NOT YET FILED"}</strong></div><div><span>LOCATION</span><strong>{entry.location || "UNSPECIFIED"}</strong></div><div><span>EVIDENCE LEVEL</span><strong>{entry.evidenceLevel}/100</strong><i><b style={{ width: evidenceWidth }} /></i></div></section>
    <section className="journal-entry-layout"><aside className={`journal-entry-note ${noteClassName}`}><span className="note-attachment" aria-hidden="true" /><span className="micro-label">OM’S MARGIN</span><h2><AnnotatedText value={entry.stickyTitle || "Read beside the record"} /></h2><p><AnnotatedText value={entry.stickyBody || "Every public journal entry keeps its sources and its uncertainty in view."} /></p></aside><article className="journal-entry-reading"><span className="journal-entry-chapter">I. CASE SUMMARY</span>{entry.body.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => <p key={index}><AnnotatedText value={paragraph} /></p>)}{entry.driveRenderUrl && <DrivePolaroid src={entry.driveRenderUrl} alt={entry.imageCaption || entry.title} caption={entry.imageCaption} />}</article></section>
    <CaseEvidenceBoard claim={entry.claim} documentedEvidence={entry.documentedEvidence} counterargument={entry.counterargument} anomaly={entry.anomaly} theory={entry.theory} sources={entry.sources} relatedCases={related} />
    <section className="myth-archive-mode"><div className="myth-archive-heading"><span className="micro-label">TWO READING LENSES</span><h2>Myth <em>vs</em> record.</h2><p>Changing the lens does not decide the case; it clarifies which layer of the story is being read.</p></div><div className="myth-archive-toggle" role="tablist"><button className={lens === "myth" ? "active" : ""} onClick={() => setLens("myth")} role="tab" aria-selected={lens === "myth"}>Myth & interpretation</button><button className={lens === "archive" ? "active" : ""} onClick={() => setLens("archive")} role="tab" aria-selected={lens === "archive"}>Archive & counterrecord</button></div>{lens === "myth" ? <div className="myth-archive-sheet myth-sheet"><span className="micro-label">THE CLAIM / THE THEORY</span><h3><AnnotatedText value={entry.claim || "No claim has been recorded yet."} /></h3><p><AnnotatedText value={entry.theory || "Om has not added an interpretation yet."} /></p></div> : <div className="myth-archive-sheet archive-sheet"><span className="micro-label">DOCUMENTED RECORD / COUNTERARGUMENT</span><h3><AnnotatedText value={entry.documentedEvidence || "No documented record has been added yet."} /></h3><p><AnnotatedText value={entry.counterargument || "No counterargument has been recorded yet."} /></p></div>}</section>
    {entry.authorTake && <section className="author-take"><span className="micro-label">OM’S TAKE</span><p><AnnotatedText value={entry.authorTake} /></p></section>}
    <section className="journal-source-section"><div><Link2 size={18} /><span className="micro-label">SOURCE TRAIL / {entry.sources.length}</span></div>{entry.sources.length ? entry.sources.map((source) => <article className={`journal-source-card ${openSource === source.id ? "is-open" : ""}`} key={source.id}><a href={source.url} target="_blank" rel="noreferrer"><Quote size={15} /><span><strong>{source.label}</strong><small>Open external reference</small></span><ExternalLink size={15} /></a><button type="button" aria-expanded={openSource === source.id} onClick={() => setOpenSource(openSource === source.id ? null : source.id)}>{openSource === source.id ? "Hide curator note −" : "Inspect curator note +"}</button>{openSource === source.id && <p><span className="micro-label">OM’S SOURCE CONTEXT</span>{source.note || "Om has linked this source as part of the record; a separate curator note has not yet been filed."}</p>}</article>) : <p>No source cards were added to this record.</p>}</section>
    <section className="case-rabbit-hole"><div><span className="micro-label">CONNECT THE CASES</span><h2>Go a little<br /><em>deeper.</em></h2><p><AnnotatedText value={entry.relationNote || "Om has not connected this case to another record yet."} /></p></div>{related.length ? <div className="case-rabbit-links">{related.map((item) => <Link href={`/journal/${item.slug}`} key={item.id}><span>{item.caseNumber || `CASE ${String(item.id).padStart(3, "0")}`}</span><strong>{item.title}</strong><ArrowUpRight size={17} /></Link>)}</div> : <div className="case-rabbit-empty">RELATED CASES WILL APPEAR HERE WHEN OM FILES A CURATED CONNECTION.</div>}</section>
    <InvestigationIndex />
    <section className="journal-entry-next"><Link href="/journal">Back to the shelves <ArrowUpRight size={21} /></Link></section>
    <PageFooter />
  </main>;
}
