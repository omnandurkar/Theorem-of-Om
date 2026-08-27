import { Maximize2, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import React, { useEffect, useRef, useState, type ImgHTMLAttributes, type PointerEvent } from "react";
import "./artifactMagnifier.css";

export type PolaroidOrientation = "loading" | "portrait" | "landscape" | "square";

export function getPolaroidOrientation(width: number, height: number): Exclude<PolaroidOrientation, "loading"> {
  if (width === height) return "square";
  return width > height ? "landscape" : "portrait";
}

type DrivePolaroidProps = Pick<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  caption?: string | null;
  variant?: "hero" | "inline" | "template";
};

export function DrivePolaroid({ src, alt, caption, variant = "inline" }: DrivePolaroidProps) {
  const [orientation, setOrientation] = useState<PolaroidOrientation>("loading");
  const [failed, setFailed] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const stageRef = useRef<HTMLDivElement>(null);
  const canInspect = variant !== "hero" && !failed;

  const closeInspection = () => {
    setIsInspecting(false);
    setZoom(1);
  };

  useEffect(() => {
    if (!isInspecting) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeInspection();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isInspecting]);

  const positionZoom = (event: PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current || zoom === 1) return;
    const bounds = stageRef.current.getBoundingClientRect();
    setOrigin({ x: Math.max(10, Math.min(90, ((event.clientX - bounds.left) / bounds.width) * 100)), y: Math.max(10, Math.min(90, ((event.clientY - bounds.top) / bounds.height) * 100)) });
  };

  return <figure className={`drive-polaroid polaroid-${variant} orientation-${orientation}${failed ? " is-unavailable" : ""}`}>
    <div className="drive-polaroid-photo"><img src={src} alt={alt || "Case-file source image"} referrerPolicy="no-referrer" onLoad={(event) => setOrientation(getPolaroidOrientation(event.currentTarget.naturalWidth, event.currentTarget.naturalHeight))} onError={() => setFailed(true)} /></div>
    <figcaption><span>{caption || "PUBLIC DRIVE IMAGE"}</span><i>{orientation === "loading" ? "MEASURING FRAME" : `${orientation.toUpperCase()} PRINT`}</i></figcaption>
    {canInspect && <button type="button" className="artifact-inspect-trigger" onClick={() => setIsInspecting(true)}><Maximize2 size={14} /> Inspect field print</button>}
    {isInspecting && <div className="artifact-inspection-dialog" role="dialog" aria-modal="true" aria-label={`Inspect ${alt || "field print"}`}><div className="artifact-inspection-toolbar"><div><span className="micro-label">FIELD PRINT / CLOSE INSPECTION</span><strong>{caption || alt || "Case-file source image"}</strong></div><div><button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.5))} disabled={zoom === 1} aria-label="Zoom out"><ZoomOut size={16} /></button><span aria-live="polite">{zoom.toFixed(1)}×</span><button type="button" onClick={() => setZoom((value) => Math.min(3, value + 0.5))} disabled={zoom === 3} aria-label="Zoom in"><ZoomIn size={16} /></button><button type="button" onClick={() => { setZoom(1); setOrigin({ x: 50, y: 50 }); }} aria-label="Reset inspection"><RotateCcw size={15} /></button><button type="button" onClick={closeInspection} aria-label="Close inspection"><X size={17} /></button></div></div><div className="artifact-inspection-stage" ref={stageRef} onPointerMove={positionZoom}><img src={src} alt={alt || "Case-file source image"} referrerPolicy="no-referrer" style={{ transform: `scale(${zoom})`, transformOrigin: `${origin.x}% ${origin.y}%` }} /></div><p>{zoom > 1 ? "Move across the print to reposition the close view. Touch readers can use the zoom controls." : "Use the zoom controls for a closer look; no evidence claim is implied by the image alone."}</p></div>}
  </figure>;
}
