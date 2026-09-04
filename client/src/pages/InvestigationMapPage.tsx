import { Compass, MapPinned } from "lucide-react";
import { ArchiveBreadcrumb } from "@/components/ArchiveNavigation";
import { InvestigationMap } from "@/components/InvestigationMap";
import { PageFooter, ReadingRail } from "@/components/SiteChrome";
import { staticJournalEntries } from "@/lib/staticJournal";

export default function InvestigationMapPage() {
  const pins = staticJournalEntries.map((entry) => ({ id: entry.id, title: entry.title, slug: entry.slug, caseNumber: entry.caseNumber, caseStatus: entry.caseStatus, evidenceLevel: entry.evidenceLevel, location: entry.location, era: entry.era, symbol: entry.symbol, mapLatitude: entry.mapLatitude, mapLongitude: entry.mapLongitude }));
  return <main className="investigation-map-page"><ReadingRail current="WORLD MAP / CASE PINS" /><ArchiveBreadcrumb items={[{ label: "World map" }]} /><section className="map-page-hero"><div><span className="micro-label">THEOREM OF KEMET · GEOGRAPHIC LEDGER</span><h1>Where the<br /><em>record</em> points.</h1><p>A clickable field map of published case locations. Pins are entered by Om when a location is relevant and responsibly identifiable; the map does not treat a mystery as a fact.</p></div><div><MapPinned size={25} /><strong>{pins.length}</strong><span>PUBLIC CASE PINS</span></div></section>{pins.length ? <InvestigationMap pins={pins} /> : <div className="map-page-loading"><Compass size={25} /> No locations filed yet.</div>}<section className="map-page-rule"><span>MAP PROTOCOL / OMN</span><p>Coordinates point to a contextual location, not necessarily the origin of a claim. Open the case file for sources, counterarguments, and Om’s evidence classification.</p></section><PageFooter /></main>;
}
