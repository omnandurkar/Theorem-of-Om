import { Archive, BookOpenCheck, Clock3, MapPinned, ScanSearch } from "lucide-react";
import { useState } from "react";

const FUTURE_MODULES = [
  { title: "World map", copy: "Map case locations only after Om adds verified coordinates and location notes.", icon: MapPinned, code: "GEO / READY" },
  { title: "Chronology rail", copy: "A horizontal investigation timeline for ancient and modern events with sourced dates.", icon: Clock3, code: "TIME / READY" },
  { title: "Symbol library", copy: "Searchable object and symbol entries with origin, use, and later interpretation.", icon: ScanSearch, code: "SIGN / READY" },
  { title: "Document vault", copy: "Zoomable primary-source documents with Om’s annotations and visible source context.", icon: Archive, code: "VAULT / READY" },
  { title: "Specimen viewer", copy: "Object examination cards for material, period, location, symbol, and open questions.", icon: BookOpenCheck, code: "SPECIMEN / READY" },
];

export function InvestigationIndex() {
  const [openRoom, setOpenRoom] = useState<number | null>(null);
  return <section className="investigation-index"><div className="investigation-index-title"><span className="micro-label">NEXT INDEX ROOMS</span><h2>The archive has<br /><em>more drawers.</em></h2><p>These rooms are prepared for Om’s real locations, symbols, dates, documents, and objects. Nothing is invented to fill them.</p></div><div className="investigation-index-grid">{FUTURE_MODULES.map(({ title, copy, icon: Icon, code }, index) => <article key={title} className={`index-room index-room-${index} ${openRoom === index ? "is-open" : ""}`}><button type="button" aria-expanded={openRoom === index} onClick={() => setOpenRoom(openRoom === index ? null : index)}><Icon size={22} /><span className="micro-label">{code}</span><h3>{title}</h3><p>{copy}</p><i>{openRoom === index ? "CLOSE DRAWER ×" : "INSPECT REQUIREMENTS ↗"}</i></button>{openRoom === index && <div className="index-room-drawer"><span className="micro-label">MATERIAL REQUIRED</span><p>Om’s verified material is needed before this room becomes public. This interface intentionally does not invent records to fill the drawer.</p></div>}</article>)}</div></section>;
}
