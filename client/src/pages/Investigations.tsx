/**
 * Style reminder — Field Notes of the Necropolis: the switchboard is a weathered evidence wall, not a sci-fi dashboard.
 * Treat every theme as a documented question, use Excavation Blue for active inquiry, and retain tactility through pins, slips, and low-contrast paper.
 */
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MapPinned, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { PageFooter, ReadingRail } from "@/components/SiteChrome";

type Investigation = {
  id: string;
  thread: string;
  title: string;
  question: string;
  status: string;
  confidence: string;
  catalogue: string;
  image?: string;
  glyph?: string;
  mode: string;
  note: string;
};

const THREADS = ["All anomalies", "Celestial", "Anomalies", "Folklore", "Metamorphs", "Vigilants", "Theophanies", "Visitors", "Border creatures", "Redacted methods", "Speculative lens", "Ritual technology"] as const;
const INVESTIGATIONS: Investigation[] = [
  { id: "orion", thread: "Celestial", title: "The Orion Ground Plan", question: "Was a constellation used as inspiration, ritual reference, or precise construction map?", status: "OBSERVATION / ALIGNMENT", confidence: "MEDIUM", catalogue: "KMT-CEL-01", mode: "MATERIAL RECORD", image: "/assets/kemet-celestial-pyramid.jpg", note: "Pair sky-pattern claims with measured dates, visibility, and alternatives." },
  { id: "survey", thread: "Anomalies", title: "The Desert Geometry Survey", question: "What does an unusual landscape pattern mean before a story is attached to it?", status: "UNVERIFIED / LANDSCAPE", confidence: "LOW", catalogue: "KMT-ANM-02", mode: "MODERN SPECULATION", image: "/assets/kemet-crop-survey.jpg", note: "Aerial resemblance is a beginning for observation, never a conclusion." },
  { id: "astronaut", thread: "Speculative lens", title: "The Ancient Astronaut Lens", question: "Why does a modern extraterrestrial lens recur when we meet monumental ancient skill?", status: "INTERPRETATION / CULTURE", confidence: "CONTESTED", catalogue: "KMT-SPC-03", mode: "CULTURAL MYTH", image: "/assets/kemet-signal-object.jpg", note: "This thread studies the theory’s rhetoric and assumptions, not a settled claim." },
  { id: "signal", thread: "Ritual technology", title: "Signal Objects & Ritual Machines", question: "Can a ritual object carry precise social or cognitive technology without being modern machinery?", status: "OBJECT STUDY / OPEN", confidence: "MEDIUM", catalogue: "KMT-RIT-04", mode: "RITUAL CONTEXT", image: "/assets/kemet-evidence.jpg", note: "Look for use, context, recurrence, and material evidence together." },
  { id: "resonance", thread: "Anomalies", title: "Resonant Stone Stories", question: "What happens when material acoustics meet the human urge to find hidden frequencies?", status: "FIELD NOTE / LISTENING", confidence: "LOW", catalogue: "KMT-ANM-05", mode: "MODERN SPECULATION", image: "/assets/kemet-scroll.jpg", note: "Sensation deserves recording; evidence still needs a method." },
  { id: "nile", thread: "Celestial", title: "Nile, Stars & Seasonal Time", question: "How did water, sky, and ritual calendar make a shared language of return?", status: "CONTEXT / CYCLE", confidence: "HIGH", catalogue: "KMT-CEL-06", mode: "RITUAL CONTEXT", image: "/assets/kemet-pyramid-cover.jpg", note: "Astronomical context is real even when a dramatic correlation does not hold." },
  { id: "curse", thread: "Folklore", title: "The Curse Cabinet", question: "How did protective ritual, death, archaeology, and newspaper drama become one popular supernatural story?", status: "FOLKLORE / AFTERLIFE", confidence: "CONTEXTUAL", catalogue: "KMT-FLK-07", mode: "CULTURAL MYTH", image: "/assets/kemet-scroll.jpg", note: "Study the distance between ancient protective practice and the later myth of a cursed discovery." },
  { id: "metamorph", thread: "Metamorphs", title: "The God-Born Body", question: "Why do cultures imagine altered, giant, hybrid, or divine-born bodies when describing power?", status: "METAMORPH / ARCHETYPE", confidence: "MYTHIC", catalogue: "KMT-MET-08", mode: "CULTURAL MYTH", glyph: "✣", note: "This file studies transformation as an image of fear, survival, inheritance, and divine favour — not a biological claim." },
  { id: "vigilant", thread: "Vigilants", title: "The Vigilant Archetype", question: "How does the dream of an impossible protector turn ordinary courage into a superhuman story?", status: "HEROIC ECHO / PROTECTOR", confidence: "FICTIONAL", catalogue: "KMT-VIG-09", mode: "FICTIONAL ECHO", glyph: "△", note: "The archive follows the lineage of guardian myths and public protectors without borrowing any existing fictional character or franchise." },
  { id: "theophany", thread: "Theophanies", title: "Threshold Guardians", question: "What do gods, messengers, and gate-keepers reveal about the boundaries a culture fears to cross?", status: "THEOPHANY / THRESHOLD", confidence: "RITUAL", catalogue: "KMT-THP-10", mode: "RITUAL CONTEXT", glyph: "⊙", note: "Guardian figures are approached through ritual imagery and historical context, not as proof of a literal supernatural encounter." },
  { id: "visitor", thread: "Visitors", title: "Sky Descent & Visitor Figures", question: "When a story imagines someone arriving from above, what earthly anxiety or hope is being given a celestial form?", status: "VISITOR / SKY MYTH", confidence: "CONTESTED", catalogue: "KMT-VIS-11", mode: "MODERN SPECULATION", glyph: "⌁", note: "This record keeps the ancient sky image and the later extraterrestrial reading in separate, visible layers." },
  { id: "border", thread: "Border creatures", title: "The Border Creature Cabinet", question: "Why do desert edges, caves, and night roads so often produce hybrid beasts and cryptid reports?", status: "CREATURE / LIMINAL", confidence: "FOLKLORE", catalogue: "KMT-BDR-12", mode: "CULTURAL MYTH", glyph: "⟡", note: "Creature files trace liminal animals, traveller tales, and the ecology of fear; they are not a cryptid census." },
  { id: "redacted", thread: "Redacted methods", title: "The Redacted Method", question: "When does an unknown device become a myth of forbidden science, lost frequency, or hidden technology?", status: "METHOD / REDACTED", confidence: "OPEN", catalogue: "KMT-RDM-13", mode: "MODERN SPECULATION", glyph: "⊞", note: "The question is less whether a secret machine existed than why technology becomes the language we use for mystery." },
];

function ArachnidSpecimen() {
  return <div className="arachnid-specimen" aria-label="Natural-history spider specimen illustration"><div className="arachnid-body" /><div className="arachnid-head" />{Array.from({ length: 8 }).map((_, index) => <i key={index} className={`arachnid-leg leg-${index + 1}`} />)}</div>;
}

export default function Investigations() {
  const [thread, setThread] = useState<(typeof THREADS)[number]>("All anomalies");
  const [selectedId, setSelectedId] = useState("orion");
  const [query, setQuery] = useState("");
  const visibleRecords = useMemo(() => INVESTIGATIONS.filter((record) => {
    const threadMatch = thread === "All anomalies" || record.thread === thread;
    const queryMatch = `${record.title} ${record.question} ${record.thread}`.toLowerCase().includes(query.toLowerCase());
    return threadMatch && queryMatch;
  }), [thread, query]);
  const selected = INVESTIGATIONS.find((record) => record.id === selectedId) || visibleRecords[0] || INVESTIGATIONS[0];

  return (
    <main className="investigations-page">
      <ReadingRail current="SIGNAL BOARD / 06 THREADS" />
      <section className="switchboard-hero">
        <div className="switchboard-dots" />
        <div className="switchboard-copy"><span className="micro-label">THEOREM OF KEMET · MYTHIC ANOMALY INDEX</span><h1>Follow the<br /><em>signal.</em><br />Question the noise.</h1><p>A field board for themes that deserve both imagination and a counterweight: pyramids, sky maps, mutation myths, guardian figures, cosmic visitors, border creatures, ritual technology, and the cultural afterlife of ancient Egypt.</p></div>
        <div className="switchboard-annotation annotation-one">NOISE<br />IS NOT A<br />NEGATIVE.</div>
        <div className="switchboard-annotation annotation-two">KEEP A<br />SECOND<br />EXPLANATION.</div>
        <img className="switchboard-stickers" src="/assets/kemet-sticker-motifs.webp" alt="Hand-illustrated field-note stickers" />
        <div className="switchboard-red-thread"><i /><i /><i /></div>
      </section>

      <section className="switchboard-controls">
        <div className="switchboard-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a signal, object, or theory..." /></div>
        <div className="signal-start-here"><span className="micro-label">START HERE</span><p>Choose <strong>Celestial</strong> for material questions, or <strong>Folklore</strong> for cultural afterlives.</p></div><div className="thread-filters">{THREADS.map((item) => <button key={item} className={thread === item ? "active" : ""} onClick={() => setThread(item)}>{item}</button>)}</div>
      </section>

      <section className="signal-board-content">
        <div className="signal-board-intro"><div><span className="micro-label">THE FIELD BOARD</span><h2>Thirteen doors.<br /><em>Zero</em> final answers.</h2></div><p>Choose a thread to draw it to the desk. Each card carries an evidence mode: material record, ritual context, cultural myth, modern speculation, or fictional echo.</p></div>
        <section className="field-station-cabinet">
          <div className="cabinet-mast"><span className="micro-label">CABINET 03 / NATURAL HISTORY OF A QUESTION</span><h3>Specimens, symbols,<br />and the <em>stories</em> they attract.</h3><p>Every lore file gets a field tag: where did it originate, what is actually observed, and what later narratives gathered around it?</p></div>
          <div className="cabinet-specimen-card"><ArachnidSpecimen /><div><span className="micro-label">ARANEAE / DESERT OBSERVATION</span><strong>Thread maker</strong><p>Used here as a diagrammatic motif: connection, pattern, and the danger of mistaking either for certainty.</p></div><span className="cabinet-scale">10mm<br />NOT TO SCALE</span></div>
          <div className="cabinet-tabs"><span>OBJECT</span><span>RITUAL</span><span>FOLKLORE</span><span>POPULAR MYTH</span><span>ARCHIVE TRACE</span></div>
        </section>
        <div className="signal-grid">
          <AnimatePresence mode="popLayout">
            {visibleRecords.map((record, index) => <motion.button key={record.id} layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.32 }} onClick={() => setSelectedId(record.id)} className={`signal-card signal-card-${index % 3} signal-card-index-${index + 1} ${selectedId === record.id ? "is-selected" : ""}`}>
              <div className={`signal-card-image ${record.glyph ? "signal-card-glyph" : ""}`}>{record.image ? <img src={record.image} alt="" /> : <><b>{record.glyph}</b><i>{record.mode}</i><span className="glyph-orbit glyph-orbit-one" /><span className="glyph-orbit glyph-orbit-two" /></>}<span>{record.thread}</span></div><div className="signal-card-body"><div className="signal-card-catalogue"><span>{record.catalogue}</span><i>CONF. / {record.confidence}</i></div><p className="evidence-mode">EVIDENCE MODE / {record.mode}</p><p className="micro-label">{record.status}</p><h3>{record.title}</h3><p>{record.question}</p><span className="signal-card-open">Open evidence note <ArrowUpRight size={15} /></span></div>
            </motion.button>)}
          </AnimatePresence>
        </div>
        {!visibleRecords.length && <div className="signal-empty"><span className="micro-label">NO SIGNAL MATCHED</span><p>Adjust the thread or let the board breathe.</p></div>}
      </section>

      <section className="desk-dossier" aria-live="polite"><motion.div key={selected.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="dossier-paper"><div className="dossier-pin" /><span className="micro-label">PULLED FROM THE BOARD · {selected.status}</span><h2>{selected.title}</h2><p>{selected.note}</p><div className="dossier-footer"><MapPinned size={17} /><span>{selected.catalogue} · {selected.mode} · CONFIDENCE {selected.confidence}</span></div></motion.div><div className="dossier-side-note">THE PATH<br />BETWEEN IDEAS<br />IS NOT PROOF.<br /><strong>IT IS A PLACE<br />TO LOOK.</strong></div></section>
      <section className="switchboard-closing"><span className="micro-label">RETURN TO THE MAIN SHELVES</span><Link href="/archive">Read the evidence records <ArrowUpRight size={19} /></Link></section>
      <PageFooter />
    </main>
  );
}
