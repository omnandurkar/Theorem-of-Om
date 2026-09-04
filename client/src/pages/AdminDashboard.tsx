import { BarChart3, BookOpen, ChevronLeft, FileText, LockKeyhole, Mail, PenLine, Tags } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { CuratorPuzzleGate } from "@/components/CuratorPuzzleGate";
import { PageFooter } from "@/components/SiteChrome";
import { OmEditorShell } from "@/components/OmEditorShell";
import { staticCategories, staticJournalEntries } from "@/lib/staticJournal";
import "./adminDashboard.css";

type NavPanel = "overview" | "entries" | "shelves" | "letters";
type ReaderLetter = { readerName: string; theory: string; submittedAt: string };

export default function AdminDashboard() {
  const [unlocked, setUnlocked] = useState(false);
  const [active, setActive] = useState<NavPanel>("overview");
  const [drafting, setDrafting] = useState(false);
  const [draftSeed, setDraftSeed] = useState<{ excerpt?: string; keyQuestion?: string } | undefined>(undefined);

  const letters = useMemo(() => {
    try {
      return JSON.parse(window.localStorage.getItem("kemet-reader-letters") || "[]") as ReaderLetter[];
    } catch {
      return [] as ReaderLetter[];
    }
  }, []);

  if (!unlocked) return <CuratorPuzzleGate onUnlocked={() => setUnlocked(true)} />;

  // ── Draft editor mode ───────────────────────────────────────────────────
  if (drafting) {
    return (
      <OmEditorShell
        onBack={() => { setDrafting(false); setDraftSeed(undefined); }}
        initialDraft={draftSeed}
      />
    );
  }

  const published = staticJournalEntries.filter((e) => e.status === "published");

  const startDraft = (seed?: { excerpt?: string; keyQuestion?: string }) => {
    setDraftSeed(seed);
    setDrafting(true);
  };

  return (
    <main className="admin-page static-admin-page">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-brand">
          <span>OM</span>
          <strong>THEOREM<br />OF KEMET</strong>
        </Link>
        <div className="admin-nav">
          <button className={active === "overview" ? "active" : ""} onClick={() => setActive("overview")}><BarChart3 size={17} /> Overview</button>
          <button className={active === "entries" ? "active" : ""} onClick={() => setActive("entries")}><BookOpen size={17} /> Case files</button>
          <button className={active === "shelves" ? "active" : ""} onClick={() => setActive("shelves")}><Tags size={17} /> Shelves</button>
          <button className={active === "letters" ? "active" : ""} onClick={() => setActive("letters")}><Mail size={17} /> Reader letters</button>
        </div>
        <div className="admin-sidebar-footer">
          <span className="micro-label">STATIC CURATOR DESK</span>
          <strong>Om Nandurkar</strong>
          <small>DRAFT / EXPORT / PUBLISH</small>
          <button className="curator-lock" onClick={() => setUnlocked(false)}><LockKeyhole size={14} /> Lock desk</button>
          <Link href="/journal"><ChevronLeft size={14} /> Public journal</Link>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="micro-label">OM'S PERMANENT FIELD DESK</span>
            <h1>
              {active === "overview" ? "Journal signals"
                : active === "entries" ? "Published case files"
                : active === "shelves" ? "Shelf catalogue"
                : "Reader letters"}
            </h1>
          </div>
          <button type="button" className="ade-new-case-btn" onClick={() => startDraft()}>
            <PenLine size={15} /> New case file
          </button>
        </header>

        {/* Overview */}
        {active === "overview" && (
          <Overview
            published={published.length}
            shelves={staticCategories.length}
            letters={letters.length}
            sources={published.reduce((s, e) => s + e.sources.length, 0)}
            onNewCase={() => startDraft()}
          />
        )}

        {/* Case files */}
        {active === "entries" && (
          <section className="static-admin-panel">
            <div className="static-admin-notice">
              <FileText size={18} />
              <p>Browse your live case files. Click <strong>New case file</strong> above to open the article editor — it generates JSON for you to paste into <code>client/src/data/articles.json</code>.</p>
            </div>
            <div className="static-entry-list">
              {published.map((entry) => (
                <Link href={`/journal/${entry.slug}`} key={entry.id}>
                  <span>{entry.caseNumber}</span>
                  <strong>{entry.title}</strong>
                  <small>{entry.category.name} · {entry.caseStatus} · {entry.sources.length} sources</small>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Shelves */}
        {active === "shelves" && (
          <section className="static-admin-panel">
            <div className="static-entry-list">
              {staticCategories.map((cat) => (
                <div key={cat.id}>
                  <span>SHELF {String(cat.id).padStart(2, "0")}</span>
                  <strong>{cat.name}</strong>
                  <small>{published.filter((e) => e.category.name === cat.name).length} published record(s)</small>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reader letters */}
        {active === "letters" && (
          <section className="static-admin-panel">
            <div className="static-admin-notice">
              <Mail size={18} />
              <p>Reader letters are stored locally in this browser. Use <strong>Convert to draft</strong> to pre-fill the article editor with a reader's theory as a starting point.</p>
            </div>
            {letters.length ? (
              <div className="static-entry-list">
                {letters.map((letter, i) => (
                  <article key={`${letter.submittedAt}-${i}`} className="admin-letter-card">
                    <div className="admin-letter-meta">
                      <span>{new Date(letter.submittedAt).toLocaleDateString()}</span>
                      <strong>{letter.readerName}</strong>
                    </div>
                    <small className="admin-letter-body">{letter.theory}</small>
                    <button
                      type="button"
                      className="admin-letter-convert-btn"
                      onClick={() => startDraft({ excerpt: letter.theory.slice(0, 200), keyQuestion: letter.theory.slice(0, 140) })}
                    >
                      <PenLine size={13} /> Convert to draft
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="static-admin-empty">No local letters yet. Readers can use &ldquo;Submit a theory&rdquo; to create one on this device.</div>
            )}
          </section>
        )}

        <PageFooter />
      </section>
    </main>
  );
}

function Overview({ published, shelves, letters, sources, onNewCase }: { published: number; shelves: number; letters: number; sources: number; onNewCase: () => void }) {
  return (
    <section className="static-admin-overview">
      <div className="admin-stat-grid">
        <div><BookOpen size={18} /><strong>{published}</strong><span>PUBLISHED RECORDS</span></div>
        <div><Tags size={18} /><strong>{shelves}</strong><span>JSON SHELVES</span></div>
        <div><FileText size={18} /><strong>{sources}</strong><span>SOURCE CARDS</span></div>
        <div><Mail size={18} /><strong>{letters}</strong><span>LOCAL LETTERS</span></div>
      </div>
      <div className="static-admin-panel">
        <span className="micro-label">FRONTEND-ONLY WORKFLOW</span>
        <h2>Draft in the desk.<br /><em>Paste in the file.</em></h2>
        <p>Use <strong>New case file</strong> to open the article editor. Fill in your title, story, sections, and sources. The editor generates a valid JSON object you copy and paste directly into <code>client/src/data/articles.json</code>.</p>
        <ol>
          <li>Click <strong>New case file</strong> and fill in all five steps.</li>
          <li>On the Export step, click <strong>Copy JSON</strong>.</li>
          <li>Open <code>client/src/data/articles.json</code> in VSCode.</li>
          <li>Paste the new object inside the <code>&quot;articles&quot;: [...]</code> array.</li>
          <li>Run <code>pnpm dev</code> to preview, then <code>pnpm build</code> to deploy.</li>
        </ol>
        <button type="button" className="ade-new-case-btn" style={{ marginTop: "1rem" }} onClick={onNewCase}>
          <PenLine size={15} /> New case file
        </button>
      </div>
    </section>
  );
}
