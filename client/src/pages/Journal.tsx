import { ArrowUpRight, BookOpenText, FileSearch, Image, Link2, ScrollText } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArchiveBreadcrumb, ArchivePagination } from "@/components/ArchiveNavigation";
import { ArchiveDiscoveryControls, type DiscoveryFilters } from "@/components/ArchiveDiscoveryControls";
import { PageFooter, ReadingRail } from "@/components/SiteChrome";
import { trpc } from "@/lib/trpc";
import { JournalEvidenceMotion } from "@/components/JournalEvidenceMotion";
import { CaseStamp } from "@/components/CaseStamp";

const PAGE_SIZE = 6;
const EMPTY_FILTERS: DiscoveryFilters = { topic: "", era: "", location: "", credibility: "" };

export default function Journal() {
  const [activeShelf, setActiveShelf] = useState("All shelves");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<DiscoveryFilters>(EMPTY_FILTERS);
  const { data: shelves = [] } = trpc.journal.categories.useQuery();
  const { data: filterValues } = trpc.journal.publicFilters.useQuery();
  const categoryId = useMemo(() => activeShelf === "All shelves" ? undefined : shelves.find((shelf) => shelf.name === activeShelf)?.id, [activeShelf, shelves]);
  const pageInput = useMemo(() => ({ page, pageSize: PAGE_SIZE, categoryId, topic: filters.topic || undefined, era: filters.era || undefined, location: filters.location || undefined, credibility: filters.credibility || undefined }), [page, categoryId, filters]);
  const { data: archive, isLoading } = trpc.journal.publicPage.useQuery(pageInput);
  const entries = archive?.items || [];
  const patchFilters = (patch: Partial<DiscoveryFilters>) => { setFilters((current) => ({ ...current, ...patch })); setPage(1); };
  return <main className="journal-page"><ReadingRail current="JOURNAL / PUBLIC SHELVES" /><ArchiveBreadcrumb items={[{ label: "Journal" }]} /><section className="journal-head"><span className="micro-label">OM NANDURKAR’S CURIOSITY JOURNAL</span><h1>A nerd’s shelf<br />of <em>unresolved things.</em></h1><p>Long-form readings of objects, folklore, celestial patterns, strange bodies, and the stories people build around them. Every entry is filed with evidence mode, references, and source context.</p><div className="journal-head-facts"><span><ScrollText size={15} /> Published records / {archive?.total || 0}</span><span><BookOpenText size={15} /> Research shelves / {shelves.length}</span><span><Link2 size={15} /> Source cards / visible in each record</span></div></section><section className="journal-shelf-nav"><button className={activeShelf === "All shelves" ? "active" : ""} onClick={() => { setActiveShelf("All shelves"); setPage(1); }}>All shelves</button>{shelves.map((shelf) => <button key={shelf.id} className={activeShelf === shelf.name ? "active" : ""} onClick={() => { setActiveShelf(shelf.name); setPage(1); }}>{shelf.name}</button>)}</section><ArchiveDiscoveryControls filters={filters} eras={filterValues?.eras || []} locations={filterValues?.locations || []} onChange={patchFilters} onClear={() => { setFilters(EMPTY_FILTERS); setPage(1); }} /><section className="journal-grid-section">{isLoading ? <div className="journal-empty"><FileSearch size={28} /><h2>Opening the shelves…</h2></div> : entries.length ? <div className="journal-grid">{entries.map((entry, index) => <Link href={`/journal/${entry.slug}`} className={`journal-card journal-card-${index % 5}`} key={entry.id}><div className="journal-card-image">{entry.driveRenderUrl ? <img src={entry.driveRenderUrl} alt={entry.imageCaption || ""} /> : <div className="journal-card-no-image"><span>{entry.symbol}</span><i>{entry.evidenceMode}</i><b>IMAGE SLOT / DRIVE READY</b></div>}<CaseStamp stampKind={entry.stampKind} caseStatus={entry.caseStatus} evidenceLevel={entry.evidenceLevel} /><span>{entry.category?.name || "UNSHELVED"}</span></div><div className="journal-card-body"><p className="micro-label">{entry.evidenceMode} · {entry.status.toUpperCase()}</p><h2>{entry.title}</h2><p>{entry.summary}</p><span>Read record <ArrowUpRight size={15} /></span></div></Link>)}</div> : <div className="journal-empty"><div className="journal-empty-slip"><span>DRAWER 00</span><strong>FIRST RECORD<br />AWAITING INK</strong><i>OMN / PUBLIC SHELF</i></div><FileSearch size={28} /><h2>No published records<br /><em>match this search.</em></h2><p>Try another topic, era, location, credibility reading, or shelf.</p><div className="empty-next-actions"><Link href="/archive">Read a field record <ArrowUpRight size={15} /></Link><Link href="/about">Learn Om’s method <ArrowUpRight size={15} /></Link></div></div>}</section><ArchivePagination page={archive?.page || page} totalPages={archive?.totalPages || 1} total={archive?.total || 0} onPageChange={setPage} /><JournalEvidenceMotion /><section className="journal-invitation"><Image size={19} /><div><span className="micro-label">OM’S READING METHOD</span><strong>Look at the image, read the note, then follow the references.</strong></div><Link href="/about">Read the field guide <ArrowUpRight size={17} /></Link></section><PageFooter /></main>;
}
