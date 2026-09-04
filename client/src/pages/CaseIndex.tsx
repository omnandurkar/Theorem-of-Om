import { ArrowUpRight, FileQuestion, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArchiveBreadcrumb, ArchivePagination } from "@/components/ArchiveNavigation";
import { ArchiveDiscoveryControls, type DiscoveryFilters } from "@/components/ArchiveDiscoveryControls";
import { InvestigationIndex } from "@/components/InvestigationIndex";
import { CaseStamp } from "@/components/CaseStamp";
import { PageFooter, ReadingRail } from "@/components/SiteChrome";
import { staticFilterValues, filterStaticEntries } from "@/lib/staticJournal";

const STATUSES = ["All files", "documented", "disputed", "unverified", "ongoing", "unresolved"] as const;
const PAGE_SIZE = 8;
const EMPTY_FILTERS: DiscoveryFilters = { topic: "", era: "", location: "", credibility: "" };

export default function CaseIndex() {
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All files");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<DiscoveryFilters>(EMPTY_FILTERS);
  const entries = useMemo(() => filterStaticEntries({ status, topic: filters.topic, era: filters.era, location: filters.location, credibility: filters.credibility }), [status, filters]);
  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
  const pageEntries = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const patchFilters = (patch: Partial<DiscoveryFilters>) => { setFilters((current) => ({ ...current, ...patch })); setPage(1); };
  return <main className="case-index-page"><ReadingRail current="INVESTIGATION INDEX / OMN" /><ArchiveBreadcrumb items={[{ label: "Case index" }]} /><section className="case-index-hero"><span className="micro-label">THEOREM OF KEMET · INVESTIGATION INDEX</span><h1>Every question<br />deserves a <em>file.</em></h1><p>An evolving directory of Om’s case records. The index separates documented material, disputed readings, open investigations, and unverified claims without flattening them into one story.</p><div className="case-index-counts"><span>{entries.length}<small>PUBLISHED CASES</small></span><span>{staticFilterValues.eras.length}<small>INVESTIGATION SHELVES</small></span><span>{pageEntries.length}<small>FILES IN VIEW</small></span></div></section><section className="case-index-controls"><Filter size={17} /><div>{STATUSES.map((item) => <button className={status === item ? "active" : ""} onClick={() => { setStatus(item); setPage(1); }} key={item}>{item}</button>)}</div></section><ArchiveDiscoveryControls filters={filters} eras={staticFilterValues.eras} locations={staticFilterValues.locations} onChange={patchFilters} onClear={() => { setFilters(EMPTY_FILTERS); setPage(1); }} /><section className="case-index-list">{pageEntries.length ? pageEntries.map((entry, index) => <Link href={`/journal/${entry.slug}`} className={`case-index-row case-index-row-${index % 4}`} key={entry.id}><span className={`case-index-dot ${entry.caseStatus}`} /><p>{entry.caseNumber}</p><strong>{entry.title}</strong><small>{entry.category.name} · {entry.location}{entry.era ? ` · ${entry.era}` : ""}</small><CaseStamp stampKind={entry.stampKind} caseStatus={entry.caseStatus} evidenceLevel={entry.evidenceLevel} compact /><i>{entry.caseStatus}</i><ArrowUpRight size={17} /></Link>) : <div className="case-index-empty"><div><span>INDEX DRAWER / 00</span><strong>AWAITING<br />OM’S FIRST CASE</strong></div><FileQuestion size={26} /><h2>No public case files<br /><em>match this search.</em></h2><p>Try another topic, era, location, credibility reading, or case status.</p><div className="empty-next-actions"><Link className="case-template-link" href="/case-file-template">Preview the case-file layout <ArrowUpRight size={15} /></Link><Link className="case-template-link" href="/archive">Read a field record <ArrowUpRight size={15} /></Link></div></div>}</section><ArchivePagination page={page} totalPages={totalPages} total={entries.length} onPageChange={setPage} /><InvestigationIndex /><PageFooter /></main>;
}
