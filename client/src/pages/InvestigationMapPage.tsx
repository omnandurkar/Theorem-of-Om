import { Compass, MapPinned } from "lucide-react";
import { ArchiveBreadcrumb } from "@/components/ArchiveNavigation";
import { InvestigationMap } from "@/components/InvestigationMap";
import { PageFooter, ReadingRail } from "@/components/SiteChrome";
import { trpc } from "@/lib/trpc";

export default function InvestigationMapPage() {
  const { data: pins = [], isLoading } = trpc.journal.mapPins.useQuery();
  return <main className="investigation-map-page"><ReadingRail current="WORLD MAP / CASE PINS" /><ArchiveBreadcrumb items={[{ label: "World map" }]} /><section className="map-page-hero"><div><span className="micro-label">THEOREM OF KEMET · GEOGRAPHIC LEDGER</span><h1>Where the<br /><em>record</em> points.</h1><p>A clickable field map of published case locations. Pins are entered by Om when a location is relevant and responsibly identifiable; the map does not treat a mystery as a fact.</p></div><div><MapPinned size={25} /><strong>{pins.length}</strong><span>PUBLIC CASE PINS</span></div></section>{isLoading ? <div className="map-page-loading"><Compass size={25} /> Preparing the survey board…</div> : <InvestigationMap pins={pins} />}<section className="map-page-rule"><span>MAP PROTOCOL / OMN</span><p>Coordinates point to a contextual location, not necessarily the origin of a claim. Open the case file for sources, counterarguments, and Om’s evidence classification.</p></section><PageFooter /></main>;
}
