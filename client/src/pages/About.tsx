/**
 * Style reminder — Field Notes of the Necropolis: the field guide is a folded museum handout.
 * Use warm paper, dotted mapping lines, structured rules, and occasional archival blue rather than decorative clutter.
 */
import { ArrowUpRight, Check, CircleHelp, LibraryBig } from "lucide-react";
import { Link } from "wouter";
import { PageFooter, ReadingRail } from "@/components/SiteChrome";

export default function About() {
  return (
    <main className="about-page">
      <ReadingRail current="FIELD GUIDE / METHOD" />
      <section className="about-hero">
        <div><span className="micro-label">A FIELD GUIDE FOR THE CURIOUS</span><h1>There is more<br />than one way to<br /><em>read a ruin.</em></h1></div>
        <div className="about-hero-paper"><p>THEOREM<br />OF KEMET</p><span>ARCHIVE CARD</span><strong>04</strong></div>
      </section>
      <section className="method-section">
        <div className="method-heading"><span className="micro-label">THE DESK STANDARD</span><h2>How this archive<br />holds an idea.</h2></div>
        <div className="method-list">
          <div><span>01</span><h3>Separate source from story.</h3><p>What is excavated, translated, dated, or documented is named distinctly from interpretation, inference, and imaginative theory.</p></div>
          <div><span>02</span><h3>Keep the counterweight visible.</h3><p>Intriguing theories are most useful when their limits stay in the room. A question gets stronger when it meets resistance.</p></div>
          <div><span>03</span><h3>Write for a slower kind of wonder.</h3><p>The goal is not a startling conclusion. It is a reader leaving with sharper attention and better vocabulary for uncertainty.</p></div>
        </div>
      </section>
      <section className="legend-section">
        <div className="legend-visual"><img src="/assets/kemet-evidence.jpg" alt="Archaeological objects and papers on an evidence table" /></div>
        <div className="legend-copy"><span className="micro-label">WHAT THE MARKINGS MEAN</span><h2>A small legend<br />for a large past.</h2><ul><li><Check /> <span><strong>Record</strong> — an article built around a source, object, place, or historical question.</span></li><li><CircleHelp /> <span><strong>Open inquiry</strong> — an interpretation considered with its open problems still intact.</span></li><li><LibraryBig /> <span><strong>Field note</strong> — an observation, fragment, or reading trail to return to later.</span></li></ul><Link href="/archive" className="ink-button">Read the records <ArrowUpRight size={17} /></Link></div>
      </section>
      <PageFooter />
    </main>
  );
}

