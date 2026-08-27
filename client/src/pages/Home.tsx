/**
 * Style reminder — Om’s Field Station: the landing page is an active investigator’s desk, not a quiet brochure.
 * Preserve the cinematic Kemet hero, then increase texture through counters, personal field notes, folios, specimen labels, and deliberate access points.
 */
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, BookHeart, BookOpen, BrainCircuit, Compass, Dna, Feather, Ghost, KeyRound, MapPinned, Orbit, ScrollText, Sparkles } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import { Link } from "wouter";
import { articles } from "@/data/articles";
import { PageFooter, ReadingRail } from "@/components/SiteChrome";
import "./homeFavouritesCompact.css";

function FeatureCard({ index }: { index: number }) {
  const article = articles[index];
  return <Link href={`/article/${article.slug}`} className={`feature-card feature-${index}`}><img src={article.image} alt="" /><div className="feature-shade" /><div className="feature-content"><span className="micro-label">{article.eyebrow}</span><h3>{article.title}</h3><span className="feature-read">Open dossier <ArrowUpRight size={16} /></span></div></Link>;
}

function RouteTile({ icon: Icon, code, title, body, href, tone }: { icon: typeof Compass; code: string; title: string; body: string; href: string; tone: string }) {
  return <Link href={href} className={`route-tile route-${tone}`}><Icon size={21} /><span className="micro-label">{code}</span><h3>{title}</h3><p>{body}</p><span className="route-tile-arrow"><ArrowUpRight size={17} /></span></Link>;
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], [-26, 108]);
  const reduceMotion = useReducedMotion();
  const favouritesRef = useRef<HTMLElement>(null);
  const signalsRef = useRef<HTMLElement>(null);
  const { scrollYProgress: favouritesScroll } = useScroll({ target: favouritesRef, offset: ["start end", "end start"] });
  const { scrollYProgress: signalsScroll } = useScroll({ target: signalsRef, offset: ["start end", "end start"] });
  const specimenY = useTransform(favouritesScroll, [0, 1], [-44, 58]);
  const stickerY = useTransform(favouritesScroll, [0, 1], [54, -46]);
  const signalPlateY = useTransform(signalsScroll, [0, 1], [66, -58]);
  const pullToDesk = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const desk = document.getElementById("om-favourites");
    if (!desk) return;
    desk.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", "#om-favourites");
  };
  const keeperLabel = "Curator entry";

  return (
    <main>
      <section className="hero-section om-hero">
        <motion.div className="hero-image" style={reduceMotion ? {} : { y: heroY }} />
        <div className="hero-starfield" />
        <div className="hero-terrain-line" />
        <div className="hero-drape" />
        <div className="hero-field-note"><span>FIELD NOTE / 𓂀</span><strong>Begin with the mark.<br />Not the myth.</strong><i>OMN · 2026</i></div>
        <div className="om-hero-seal"><span>OM</span><i>FIELD<br />STATION</i></div>
        <ReadingRail current="OPENING RECORD" />
        <div className="hero-topline"><span>PRIVATE READING ROOM</span><span>EST. 2026 · INDIA</span></div>
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <p className="eyebrow-light">THEOREM OF KEMET · OM NANDURKAR’S FIELD STATION</p>
          <h1><span>Where the</span><em>stone</em> keeps<span>its own record.</span></h1>
          <p className="hero-summary">A living reading room for ancient Egypt’s contested clues, sacred objects, mythic anomalies, and archaeological afterlives.</p>
          <div className="hero-actions"><Link href="/archive" className="ink-button">Browse all records <ArrowUpRight size={18} /></Link><a href="#om-favourites" onClick={pullToDesk} className="text-button"><ArrowDown size={17} /> See Om’s starting shelf</a><Link href="/about" className="hero-method-link">New here? Read the field guide</Link></div>
        </motion.div>
        <div className="hero-attribution">CREATED &amp; CURATED BY<br /><strong>OM NANDURKAR</strong></div>
        <div className="keeper-access"><Link href="/om-dashboard?desk=cases"><KeyRound size={14} /> {keeperLabel}</Link></div>
      </section>

      <section className="om-station-strip">
        <div className="station-strip-label"><span className="micro-label">OM’S DESK / LIVE INDEX</span><strong>The archive is building a memory.</strong></div>
        <div className="station-metric"><b>13</b><span>ANOMALY<br />FILES</span></div><div className="station-metric"><b>03</b><span>LONG-READ<br />RECORDS</span></div><div className="station-metric"><b>05</b><span>EVIDENCE<br />MODES</span></div><div className="station-metric station-status"><span className="status-dot" /> <small>OM’S DESK<br />OPEN</small></div>
      </section>

      <section id="om-favourites" ref={favouritesRef} className="om-favourites-section">
        <div className="favourites-heading"><span className="micro-label">CURATOR’S DRAWER / OMN</span><h2>Om’s <em>favourites.</em></h2><p>The strange records that keep returning to the top of the desk — selected by Om Nandurkar for readers who like their history with a little static in the signal.</p><Link href="/field-folio" className="favourites-folio-link">Turn Om’s field folio <ArrowUpRight size={14} /></Link></div>
        <div className="favourites-board"><div aria-hidden="true" className="favourites-parallax-trace" />
          <div className="favourites-specimen"><motion.img className="home-parallax-image" style={reduceMotion ? {} : { y: specimenY }} src="/assets/om-specimen-field-station.png" alt="Om’s archaeological and natural-history specimen board" /><div className="favourites-specimen-copy"><span className="micro-label">SPECIMEN BOARD / OM-01</span><h3>Things Om keeps close.</h3><p>Patterns, protective eyes, desert life, and small fragments that make an archive feel awake.</p></div><span className="favourites-pin" /></div>
          <div className="favourites-sticker-sheet"><motion.img className="home-parallax-image" style={reduceMotion ? {} : { y: stickerY }} src="/assets/om-field-station-stickers.png" alt="Om’s six field-station research motifs" /><span>OM’S FIELD TOOLS<br />06 MOTIFS / ACTIVE</span></div>
          <div className="favourite-folio favourite-folio-one"><span className="folio-tab">01 / STONE</span><h3>The Sphinx waterline</h3><p>Weathering, chronology, and a question carved into limestone.</p><Link href={`/article/${articles[0].slug}`}>Read the record <ArrowUpRight size={15} /></Link></div>
          <div className="favourite-folio favourite-folio-two"><span className="folio-tab">02 / SIGNAL</span><h3>God-born bodies</h3><p>Mutation myths and superhuman archetypes inside the Anomaly Index.</p><Link href="/investigations">Open the file <ArrowUpRight size={15} /></Link></div>
          <div className="favourites-hand">“My favourite question is always<br />the one that still has teeth.”<small>— OMN</small></div>
        </div>
      </section>

      <section id="field-notes" className="field-notes-section">
        <div className="section-kicker"><span>01</span><span>THE ARCHIVE IS A QUESTION, NOT A CLAIM.</span></div><div className="field-slip"><span>FIELD SLIP / 01</span><strong>Evidence receives the first word.</strong><i>Filed by OMN</i></div>
        <div className="manifesto-layout"><div className="manifesto-title"><span className="scribble-mark">✦</span><h2>Unseal the<br /><em>evidence.</em></h2></div><div className="manifesto-body"><p className="lead-copy">Every record begins with a fragment: a ridge in limestone, a star above a pyramid, a symbol that refuses a simple translation.</p><p>Theorem of Kemet makes room for the thrill of an unanswered question — while keeping archaeology, source trails, and counterarguments in view. Consider this a desk for slow curiosity.</p><Link href="/about" className="underlined-link">Read the field guide <ArrowUpRight size={15} /></Link></div></div>
        <div className="principles-strip"><div><Compass /><span>FOLLOW THE CLUE</span></div><div><ScrollText /><span>READ THE CONTEXT</span></div><div><Feather /><span>HOLD THE UNCERTAINTY</span></div></div>
      </section>

      <section className="entry-routes-section"><div className="entry-routes-heading"><span className="micro-label">CHOOSE YOUR ENTRY POINT</span><h2>Three ways into<br />the <em>unknown.</em></h2></div><div className="entry-routes-grid"><RouteTile icon={BookHeart} code="ROUTE / 01" title="The evidence shelf" body="For source-minded readers who want the artifact before the theory." href="/archive" tone="paper" /><RouteTile icon={Orbit} code="ROUTE / 02" title="The anomaly index" body="For mythic archetypes, visitors, guardians, creatures, and odd signals." href="/investigations" tone="blue" /><RouteTile icon={Ghost} code="ROUTE / 03" title="The folklore room" body="For curses, afterlives, protected thresholds, and the stories that followed." href="/investigations" tone="umber" /></div></section>

      <section className="featured-section"><div className="section-heading-row"><div><span className="micro-label">FROM THE EVIDENCE TABLE</span><h2>Recently<br /><em>unsealed.</em></h2></div><Link href="/archive" className="circle-arrow" aria-label="Browse all records"><ArrowUpRight size={23} /></Link></div><div className="feature-stage"><div className="feature-stamp"><span>EXAMINED</span><strong>OMN</strong><small>2026</small></div><div className="feature-tape" /><FeatureCard index={0} /><FeatureCard index={1} /><FeatureCard index={2} /><div className="feature-stage-note">04 / MORE RECORDS<br />WAITING BELOW</div></div></section>

      <section className="om-inbox-section"><div className="inbox-heading"><span className="micro-label">OM’S SCRIBAL INBOX</span><h2>Questions still<br />on the <em>table.</em></h2><p>New prompts, fragments, and routes for future records. They are not answers — they are a reason to keep the lamp on.</p></div><div className="inbox-notes"><article><Dna size={17} /><span className="micro-label">METAMORPH / PENDING</span><h3>Can a divine birth story be read as a map of social change?</h3><i>Filed 08 / OMN</i></article><article><BrainCircuit size={17} /><span className="micro-label">REDACTED METHOD / PENDING</span><h3>Why does an unknown object so quickly become “lost technology”?</h3><i>Filed 11 / OMN</i></article><article><Sparkles size={17} /><span className="micro-label">CELESTIAL / PENDING</span><h3>What did a star mean before we turned it into a map?</h3><i>Filed 12 / OMN</i></article></div><div className="inbox-route"><MapPinned size={18} /> <Link href="/submit-theory">Send Om a theory letter <ArrowUpRight size={16} /></Link></div></section>

      <section ref={signalsRef} className="signal-preview-section"><div aria-hidden="true" className="signal-parallax-glyph"><span>✦</span><span>✦</span><span>✦</span></div><div className="signal-preview-rule"><span>02</span><span>THE QUESTIONS THAT GATHER A CROWD</span></div><div className="signal-preview-layout"><div className="signal-preview-copy"><span className="micro-label">THE MYTHIC ANOMALY INDEX</span><h2>Not every<br />pattern is a <em>path.</em></h2><p>Some theories arrive with the force of a revelation: alien visitors, crop-circle maps, lost technologies, guardians, mutations, and star-built pyramids. The Anomaly Index keeps the imaginative leap and the evidentiary counterweight in the same room.</p><Link href="/investigations" className="ink-button">Open the signal board <ArrowUpRight size={17} /></Link></div><div className="signal-preview-plate"><motion.img className="home-parallax-image" style={reduceMotion ? {} : { y: signalPlateY }} src="/assets/kemet-crop-survey.jpg" alt="Abstract geometry in a desert survey" /><span className="plate-label">UNVERIFIED<br />LANDSCAPE SIGNAL</span><span className="plate-pin" /></div><div className="signal-preview-calligraphy">“The shape<br />of a question<br />matters.”</div></div></section>

      <section className="om-note-section"><div className="tape tape-one" /><div className="om-note-title"><span className="micro-label">A NOTE FROM THE DESK</span><h2>Not answers.<br />Better <em>questions.</em></h2></div><blockquote>“I made this room for the moment a piece of history feels larger than its label.”<cite>— Om Nandurkar, keeper of the archive</cite></blockquote><Link href="/archive-room" className="om-room-link"><BookOpen size={18} /> Enter Om’s archive room</Link></section>
      <PageFooter />
    </main>
  );
}
