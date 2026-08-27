import { MapPinned, Search, SlidersHorizontal, X } from "lucide-react";
import { Link } from "wouter";

export type DiscoveryFilters = { topic: string; era: string; location: string; credibility: "" | "low" | "cautious" | "strong" };

export function hasDiscoveryFilters(filters: DiscoveryFilters) {
  return Boolean(filters.topic || filters.era || filters.location || filters.credibility);
}

export function ArchiveDiscoveryControls({ filters, eras, locations, onChange, onClear }: { filters: DiscoveryFilters; eras: string[]; locations: string[]; onChange: (patch: Partial<DiscoveryFilters>) => void; onClear: () => void }) {
  const active = hasDiscoveryFilters(filters);
  return <section className="archive-discovery-controls" aria-label="Search archive records"><div className="archive-search-field"><Search size={17} /><input value={filters.topic} onChange={(event) => onChange({ topic: event.target.value })} placeholder="Search a question, object, myth, or theory…" aria-label="Search by topic" /></div><div className="archive-filter-selects"><span><SlidersHorizontal size={15} /> FILTER FILES</span><label>Era<select value={filters.era} onChange={(event) => onChange({ era: event.target.value })}><option value="">All eras</option>{eras.map((era) => <option value={era} key={era}>{era}</option>)}</select></label><label>Location<select value={filters.location} onChange={(event) => onChange({ location: event.target.value })}><option value="">All locations</option>{locations.map((location) => <option value={location} key={location}>{location}</option>)}</select></label><label>Credibility<select value={filters.credibility} onChange={(event) => onChange({ credibility: event.target.value as DiscoveryFilters["credibility"] })}><option value="">All ratings</option><option value="strong">70–100 · Documented leaning</option><option value="cautious">35–69 · Cautious reading</option><option value="low">0–34 · Unverified</option></select></label>{active && <button type="button" onClick={onClear}><X size={14} /> Clear</button>}<Link href="/map" className="archive-map-link"><MapPinned size={15} /> Map pins</Link></div></section>;
}
