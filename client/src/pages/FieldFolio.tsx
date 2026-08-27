/**
 * An original evidence-led reader surface for short, deliberate comparison between archive records.
 * It does not copy third-party Sketchbook source, images, or page-turn geometry.
 */
import { ArrowLeft, ArrowRight, ArrowUpRight, Eye, Maximize2, ScanSearch } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { Link } from "wouter";
import { PageFooter, ReadingRail } from "@/components/SiteChrome";
import { ReaderControls } from "@/components/ReaderControls";
import { articles } from "@/data/articles";
import { cycleFolioIndex, folioNumber } from "@/lib/fieldFolio";
import "./fieldFolio.css";
import "./fieldFolioMobileInspection.css";
import "./fieldFolioTurn.css";
import "./fieldFolioMobileTurn.css";

type LensPoint = { x: number; y: number };
type TurnDirection = "forward" | "back";

export default function FieldFolio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInspecting, setIsInspecting] = useState(false);
  const [lensPoint, setLensPoint] = useState<LensPoint>({ x: 52, y: 49 });
  const [previousIndex, setPreviousIndex] = useState(0);
  const [turnDirection, setTurnDirection] = useState<TurnDirection>("forward");
  const [turnSequence, setTurnSequence] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const imageDeskRef = useRef<HTMLDivElement>(null);
  const active = articles[activeIndex];
  const previous = articles[previousIndex];
  const opening = active.sections[0];

  const showRecord = (nextIndex: number, direction: TurnDirection) => {
    const normalizedIndex = cycleFolioIndex(0, nextIndex, articles.length);
    if (isTurning || normalizedIndex === activeIndex) return;
    setPreviousIndex(activeIndex);
    setTurnDirection(direction);
    setTurnSequence((sequence) => sequence + 1);
    setIsTurning(true);
    setActiveIndex(normalizedIndex);
    setIsInspecting(false);
  };

  const chooseRecord = (nextIndex: number) => showRecord(nextIndex, nextIndex > activeIndex ? "forward" : "back");

  const moveRecord = (change: number) => {
    showRecord(cycleFolioIndex(activeIndex, change, articles.length), change > 0 ? "forward" : "back");
  };

  const handleKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveRecord(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveRecord(1);
    }
  };

  useEffect(() => {
    const handleDocumentKeyboard = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, button, a")) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveRecord(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveRecord(1);
      }
    };
    window.addEventListener("keydown", handleDocumentKeyboard);
    return () => window.removeEventListener("keydown", handleDocumentKeyboard);
  }, [activeIndex, isTurning]);

  const positionLens = (event: PointerEvent<HTMLDivElement>) => {
    if (!isInspecting || !imageDeskRef.current) return;
    const bounds = imageDeskRef.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setLensPoint({ x: Math.max(12, Math.min(88, x)), y: Math.max(15, Math.min(85, y)) });
  };

  const imageStyle = { "--folio-image": `url("${active.image}")` } as CSSProperties;
  const previousImageStyle = { "--turn-image": `url("${previous.image}")` } as CSSProperties;

  return (
    <main className="field-folio-page" onKeyDown={handleKeyboard}>
      <ReadingRail current="FIELD FOLIO / OMN" />
      <section className="field-folio-intro">
        <Link href="/archive" className="folio-back"><ArrowLeft size={16} /> Archive shelf</Link>
        <div>
          <span className="micro-label">CURATOR’S READING INSTRUMENT / 01</span>
          <h1>Turn the <em>field folio.</em></h1>
          <p>A compact way to compare Om’s core records before opening the full investigation. Use the index, previous/next controls, or your left and right arrow keys.</p>
        </div>
        <ReaderControls />
      </section>

      <section className="field-folio-shell" aria-label="Om’s curated archive folio">
        <aside className="field-folio-index" aria-label="Field folio record index">
          <span className="micro-label">LEAVES / {String(articles.length).padStart(2, "0")}</span>
          {articles.map((article, index) => (
            <button type="button" key={article.slug} className={index === activeIndex ? "is-active" : ""} aria-current={index === activeIndex ? "page" : undefined} onClick={() => chooseRecord(index)} disabled={isTurning}>
              <b>{folioNumber(index)}</b><span>{article.category}</span><i>{article.title}</i>
            </button>
          ))}
        </aside>

        <div className="field-folio-book" aria-busy={isTurning}>
          <div className="field-folio-spine" aria-hidden="true"><i /><i /><i /><i /><i /></div>
          <article className="field-folio-leaf field-folio-cover" style={imageStyle}>
            <span className="folio-running-head">CASE RECORD / {folioNumber(activeIndex)}</span>
            <div className="folio-cover-copy">
              <span>{active.eyebrow}</span>
              <h2>{active.title}</h2>
              <p>{active.excerpt}</p>
              <dl><div><dt>Filed</dt><dd>{active.date}</dd></div><div><dt>Reading time</dt><dd>{active.readTime}</dd></div></dl>
            </div>
            <span className="folio-seal" aria-hidden="true">OM<br />N</span>
          </article>

          <article className="field-folio-leaf field-folio-evidence">
            <span className="folio-running-head">EVIDENCE / FIRST PASS</span>
            <div className="folio-question"><span className="micro-label">THE QUESTION</span><h2>{active.keyQuestion}</h2></div>
            <blockquote>{opening.pullQuote || "A field note is not a verdict; it is a better place to begin."}</blockquote>
            <p className="folio-extract">{opening.paragraphs[0]}</p>
            <div className={`folio-evidence-desk${isInspecting ? " is-inspecting" : ""}`} ref={imageDeskRef} onPointerMove={positionLens} style={imageStyle}>
              <img src={active.image} alt={`Evidence image for ${active.title}`} />
              {isInspecting && <div aria-hidden="true" className="field-folio-lens" style={{ left: `${lensPoint.x}%`, top: `${lensPoint.y}%` }} />}
              <div className="folio-image-caption"><span>FIG. {folioNumber(activeIndex)}</span><em>Move across the print to inspect</em></div>
            </div>
            <div className="folio-actions">
              <button type="button" className={isInspecting ? "is-active" : ""} aria-pressed={isInspecting} onClick={() => setIsInspecting((value) => !value)}><ScanSearch size={16} /> {isInspecting ? "Close inspection" : "Inspect evidence"}</button>
              <Link href={`/article/${active.slug}`}>Read full record <ArrowUpRight size={16} /></Link>
            </div>
          </article>
          {isTurning && <div key={turnSequence} className={`field-folio-turning-sheet is-${turnDirection}`} style={previousImageStyle} aria-hidden="true" onAnimationEnd={() => setIsTurning(false)}><span>OMN / FIELD LEAF {folioNumber(previousIndex)}</span><strong>{previous.title}</strong><i>Turning the evidence</i></div>}
        </div>

        <div className="field-folio-controls" aria-label="Turn field folio pages">
          <button type="button" onClick={() => moveRecord(-1)} disabled={isTurning}><ArrowLeft size={18} /> Previous leaf</button>
          <span aria-live="polite">{folioNumber(activeIndex)} / {String(articles.length).padStart(2, "0")}<small>{active.category}</small></span>
          <button type="button" onClick={() => moveRecord(1)} disabled={isTurning}>Next leaf <ArrowRight size={18} /></button>
        </div>
      </section>

      <section className="field-folio-method">
        <Eye size={19} /><div><span className="micro-label">WHY THIS IS HERE</span><h2>Look closely, then read <em>slowly.</em></h2></div><p>The folio is an orientation tool, not a replacement for the complete record. Its short index, central question, and zoomable image help readers choose an investigation with intention.</p><Maximize2 size={20} aria-hidden="true" />
      </section>
      <PageFooter />
    </main>
  );
}
