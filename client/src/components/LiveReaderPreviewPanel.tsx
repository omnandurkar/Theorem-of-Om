import { ExternalLink, Layers, MapPin, Minimize2, Move, Pin, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { FONT_CATALOG, PALETTES, SYMBOLS } from "@/data/editorCatalog";
import type { FullDraftState } from "./OmEditorShell";

type Props = {
  draft: FullDraftState;
  onClose?: () => void;
  isDrawer?: boolean;
};

export function LiveReaderPreviewPanel({ draft, onClose, isDrawer }: Props) {
  const [quietMotion, setQuietMotion] = useState(false);
  const [activeSourceIdx, setActiveSourceIdx] = useState<number | null>(null);

  const selectedFont = FONT_CATALOG.find((f) => f.id === draft.fontId) || FONT_CATALOG[0];
  const selectedPalette = PALETTES.find((p) => p.id === draft.paletteId) || PALETTES[0];
  const selectedSymbol = SYMBOLS.find((s) => s.id === draft.symbol)?.value || "𓂀";

  // Derive stamp text
  let stampText = "";
  if (draft.stampKind === "top-secret") stampText = "CLASSIFIED";
  else if (draft.stampKind === "unverified") stampText = "UNVERIFIED";
  else if (draft.stampKind === "declassified") stampText = "DECLASSIFIED";
  else if (draft.stampKind === "case-closed") stampText = "CASE CLOSED";
  else if (draft.stampKind === "auto") {
    if (draft.caseStatus === "disputed") stampText = "DISPUTED RECORD";
    else if (draft.caseStatus === "unverified") stampText = "UNVERIFIED";
    else if (draft.caseStatus === "documented") stampText = "DOCUMENTED";
    else stampText = "FIELD CASE";
  }

  const openNewTab = () => {
    try {
      window.localStorage.setItem("kemet-preview-draft", JSON.stringify(draft));
      window.open("/om-preview", "_blank");
    } catch {
      alert("Could not serialize draft for new tab preview.");
    }
  };

  return (
    <aside className={`live-preview-panel ${isDrawer ? "is-drawer" : ""} ${quietMotion ? "quiet-motion" : ""}`}>
      {/* Header toolbar */}
      <div className="preview-topbar">
        <div className="preview-topbar-info">
          <span className="micro-label">LIVE READER PREVIEW</span>
          <strong>{draft.title || "Untitled Case Record"}</strong>
        </div>
        <div className="preview-topbar-actions">
          <button
            type="button"
            className={`quiet-toggle-btn ${quietMotion ? "active" : ""}`}
            onClick={() => setQuietMotion((v) => !v)}
            title="Toggle quiet motion"
          >
            <Move size={13} /> {quietMotion ? "Quiet" : "Motion"}
          </button>
          <button type="button" className="new-tab-btn" onClick={openNewTab} title="Open preview in new tab">
            <ExternalLink size={13} /> New tab
          </button>
          {onClose && (
            <button type="button" className="close-preview-btn" onClick={onClose} aria-label="Close preview">
              <Minimize2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Reader Stage */}
      <div
        className="preview-stage-container"
        style={{
          backgroundColor: selectedPalette.value,
          fontFamily: selectedFont.value,
          color: draft.paletteId === "ink" || draft.paletteId === "night" || draft.paletteId === "oxblood" ? "#e8edd9" : "#192c2a",
        }}
      >
        {/* Editorial Stamp Overlay */}
        {stampText && draft.stampKind !== "none" && (
          <div className="preview-stamp-overlay">
            <span>{stampText}</span>
          </div>
        )}

        {/* Hero Section */}
        <header className="preview-hero">
          <div className="preview-eyebrow">
            <span>{draft.eyebrow || "CASE FILE 000 · FIELD STATION"}</span>
            {draft.caseNumber && <strong className="preview-case-num">{draft.caseNumber}</strong>}
          </div>

          <h1 className="preview-title">{draft.title || "Untitled Article Title"}</h1>

          <div className="preview-meta-strip">
            <span>{draft.category}</span> · <span>{draft.date}</span> · <span>{draft.readTime}</span>
            {draft.caseStatus && <span className={`preview-status-pill status-${draft.caseStatus}`}>{draft.caseStatus}</span>}
          </div>

          {/* Evidence Meter */}
          <div className="preview-evidence-meter">
            <div className="meter-header">
              <span className="micro-label">EVIDENCE METRIC · {draft.evidenceMode}</span>
              <strong>{draft.evidenceLevel}% CONFIDENCE</strong>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${draft.evidenceLevel}%` }} />
            </div>
          </div>
        </header>

        {/* Hero Image / Polaroid */}
        {draft.image && (
          <figure className="preview-polaroid">
            <div className="polaroid-frame">
              <img src={draft.image} alt={draft.title} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div className="polaroid-seal">{selectedSymbol}</div>
            </div>
            {draft.imageCaption && <figcaption className="polaroid-caption">{draft.imageCaption}</figcaption>}
          </figure>
        )}

        {/* Key Question & Excerpt */}
        <section className="preview-intro-box">
          <blockquote className="preview-key-question">
            <span className="micro-label">CENTRAL QUESTION</span>
            <p>&ldquo;{draft.keyQuestion || "What question is stone preserving here?"}&rdquo;</p>
          </blockquote>
          <p className="preview-excerpt">{draft.excerpt}</p>
        </section>

        {/* Sticky Note Annotation */}
        {draft.stickyTitle && (
          <div className={`preview-sticky-note treatment-${draft.stickyTreatment} placement-${draft.stickyPlacement}`}>
            {draft.stickyTreatment === "brass-pin" && <Pin size={14} className="sticky-pin" />}
            <strong>{draft.stickyTitle}</strong>
            <p>{draft.stickyBody}</p>
          </div>
        )}

        {/* 5 Evidence Cards */}
        <section className="preview-evidence-cards">
          <div className="section-header">
            <ShieldCheck size={16} />
            <h3>FIELD EVIDENCE DOSSIER</h3>
          </div>
          <div className="evidence-cards-grid">
            {draft.claim && (
              <div className="evidence-card card-claim">
                <span className="card-kicker">01 / PROPOSED CLAIM</span>
                <p>{draft.claim}</p>
              </div>
            )}
            {draft.documentedEvidence && (
              <div className="evidence-card card-record">
                <span className="card-kicker">02 / TRACEABLE RECORD</span>
                <p>{draft.documentedEvidence}</p>
              </div>
            )}
            {draft.counterargument && (
              <div className="evidence-card card-counter">
                <span className="card-kicker">03 / COUNTERARGUMENT</span>
                <p>{draft.counterargument}</p>
              </div>
            )}
            {draft.anomaly && (
              <div className="evidence-card card-anomaly">
                <span className="card-kicker">04 / UNRESOLVED ANOMALY</span>
                <p>{draft.anomaly}</p>
              </div>
            )}
            {draft.theory && (
              <div className="evidence-card card-theory">
                <span className="card-kicker">05 / CURATOR INTERPRETATION</span>
                <p>{draft.theory}</p>
              </div>
            )}
          </div>
        </section>

        {/* Article Sections */}
        <section className="preview-sections">
          {draft.sections.map((sec, i) => (
            <article key={sec.id || i} className="preview-section">
              {sec.label && <span className="preview-sec-label">{sec.label}</span>}
              {sec.heading && <h2 className="preview-sec-heading">{sec.heading}</h2>}
              {sec.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="preview-sec-para">{p}</p>
              ))}
              {sec.pullQuote && (
                <blockquote className="preview-pull-quote">
                  <p>&ldquo;{sec.pullQuote}&rdquo;</p>
                </blockquote>
              )}
            </article>
          ))}
        </section>

        {/* Om's Personal Take */}
        {draft.authorTake && (
          <section className="preview-author-take">
            <div className="author-take-header">
              <Sparkles size={16} />
              <span>OM NANDURKAR &middot; CURATOR READING</span>
            </div>
            <p>{draft.authorTake}</p>
          </section>
        )}

        {/* Sources Bibliography */}
        {draft.sources.length > 0 && (
          <section className="preview-sources">
            <div className="section-header">
              <Layers size={16} />
              <h3>DOCUMENTED SOURCES ({draft.sources.length})</h3>
            </div>
            <div className="sources-list">
              {draft.sources.map((src, i) => (
                <div key={src.id || i} className="preview-source-item">
                  <div className="source-item-header" onClick={() => setActiveSourceIdx(activeSourceIdx === i ? null : i)}>
                    <strong>{i + 1}. {src.label || "Untitled Source"}</strong>
                    {src.url ? <a href={src.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Open link ↗</a> : <em className="no-url">No URL</em>}
                  </div>
                  {src.note && (activeSourceIdx === i || !isDrawer) && (
                    <p className="source-note">{src.note}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Location & Map Metadata */}
        {(draft.location || draft.era || (draft.mapLatitude && draft.mapLongitude)) && (
          <footer className="preview-location-footer">
            <MapPin size={16} />
            <div>
              <strong>{draft.location || "Contextual Site"} {draft.era ? `· ${draft.era}` : ""}</strong>
              {draft.mapLatitude && draft.mapLongitude && (
                <small>Coordinates: {draft.mapLatitude}, {draft.mapLongitude}</small>
              )}
            </div>
          </footer>
        )}
      </div>
    </aside>
  );
}
