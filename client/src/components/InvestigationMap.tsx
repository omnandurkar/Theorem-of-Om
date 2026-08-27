/// <reference types="@types/google.maps" />

import { MapPinned } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { MapView } from "@/components/Map";

export type InvestigationPin = { id: number; title: string; slug: string; caseNumber: string | null; caseStatus: string; evidenceLevel: number; location: string | null; era: string | null; symbol: string; mapLatitude: number | null; mapLongitude: number | null };

export function InvestigationMap({ pins }: { pins: InvestigationPin[] }) {
  const [selected, setSelected] = useState<InvestigationPin | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRefs = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const renderPins = useCallback((map: google.maps.Map) => {
    markerRefs.current.forEach((marker) => { marker.map = null; });
    markerRefs.current = pins.filter((pin): pin is InvestigationPin & { mapLatitude: number; mapLongitude: number } => pin.mapLatitude !== null && pin.mapLongitude !== null).map((pin) => {
      const element = document.createElement("button");
      element.type = "button";
      element.className = "investigation-map-pin";
      element.textContent = pin.symbol || "●";
      element.setAttribute("aria-label", `Open ${pin.title}`);
      const marker = new window.google.maps.marker.AdvancedMarkerElement({ map, position: { lat: pin.mapLatitude, lng: pin.mapLongitude }, title: pin.title, content: element });
      marker.addListener("click", () => setSelected(pin));
      return marker;
    });
  }, [pins]);
  useEffect(() => { if (mapRef.current && window.google) renderPins(mapRef.current); }, [renderPins]);
  return <section className="investigation-map-wrap"><div className={`investigation-map-canvas ${pins.length ? "" : "is-empty"}`}>{pins.length ? <MapView className="investigation-google-map" initialCenter={{ lat: 24, lng: 14 }} initialZoom={2} onMapReady={(map) => { mapRef.current = map; map.setOptions({ mapTypeControl: false, streetViewControl: false, styles: [{ featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#28443e" }] }, { featureType: "water", elementType: "geometry", stylers: [{ color: "#8ab5b2" }] }, { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#e4ddc7" }] }] }); renderPins(map); }} /> : <div className="investigation-map-empty"><MapPinned size={22} /><strong>NO PINS FILED YET</strong><p>Published cases gain a map pin only when Om adds a responsibly identified latitude and longitude. No locations are invented for the map.</p><Link href="/journal">Read the current records</Link></div>}</div><aside className="investigation-map-dossier">{selected ? <><span className="micro-label">SELECTED PIN / {selected.caseNumber || "UNFILED"}</span><h2>{selected.title}</h2><p>{selected.location || "Location label unfiled"}{selected.era ? ` · ${selected.era}` : ""}</p><div><span>{selected.caseStatus}</span><span>EDITORIAL EVIDENCE {selected.evidenceLevel}/100</span></div><Link href={`/journal/${selected.slug}`}>Open case file</Link></> : <><span className="micro-label">MAP LEDGER</span><h2>{pins.length ? <>Follow the<br /><em>pinned record.</em></> : <>Begin with<br /><em>the record.</em></>}</h2><p>{pins.length ? "Every marker represents an Om-entered location for a published case—not an implied event or a verified conclusion." : "The map will wake only when an eligible published case has a responsible location note."}</p><strong>{pins.length} FILED PIN{pins.length === 1 ? "" : "S"}</strong></>}</aside></section>;
}
