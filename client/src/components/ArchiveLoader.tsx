import { useEffect, useState } from "react";

export function ArchiveLoader() {
  const [visible, setVisible] = useState(true);
  const [releasing, setReleasing] = useState(false);
  const [stage, setStage] = useState("DUSTING TABLE");

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const returningReader = window.localStorage.getItem("theorem-of-kemet.opening-seen") === "true";
    window.localStorage.setItem("theorem-of-kemet.opening-seen", "true");
    const total = reduceMotion ? 250 : returningReader ? 420 : 2000;
    const transitions = reduceMotion || returningReader ? [] : [window.setTimeout(() => setStage("ALIGNING EVIDENCE"), 650), window.setTimeout(() => setStage("OPENING RECORD"), 1320)];
    if (returningReader) setStage("RETURNING TO THE RECORD");
    const release = window.setTimeout(() => setReleasing(true), Math.max(0, total - 300));
    const hide = window.setTimeout(() => setVisible(false), total);
    return () => { transitions.forEach(window.clearTimeout); window.clearTimeout(release); window.clearTimeout(hide); };
  }, []);

  if (!visible) return null;
  return <div className={`archive-loader ${releasing ? "is-releasing" : ""}`} role="status" aria-live="polite" aria-label="Opening Theorem of Kemet"><div className="archive-loader-grid" /><div className="archive-loader-seal" aria-hidden="true"><span className="archive-loader-sun" /><span className="archive-loader-scarab">𓆣</span><i /></div><div className="archive-loader-line"><i /><i /><i /></div><div className="archive-loader-copy"><span>THEOREM OF KEMET</span><strong>{stage}</strong><small>OMN / FIELD STATION · 2026</small></div><div className="archive-loader-stamps" aria-hidden="true"><span>CASE</span><span>RECORD</span><span>OPEN</span></div></div>;
}
