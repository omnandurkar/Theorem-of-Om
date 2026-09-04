import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, ChevronUp, Copy, FileText, Layers, Link2, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Article, ArticleSource } from "@/data/articles";
import { categories } from "@/data/articles";
import "./articleDraftEditor.css";

// ─── Types ───────────────────────────────────────────────────────────────────

type Section = {
  id: string;
  label: string;
  heading: string;
  paragraphs: string[];
  pullQuote: string;
};

type DraftState = {
  title: string;
  slug: string;
  eyebrow: string;
  category: string;
  date: string;
  readTime: string;
  tone: "night" | "paper" | "blue";
  excerpt: string;
  keyQuestion: string;
  image: string;
  sections: Section[];
  sources: (ArticleSource & { id: string })[];
};

const TONES: { value: DraftState["tone"]; label: string; desc: string }[] = [
  { value: "night", label: "Night", desc: "Dark ink & deep shadow" },
  { value: "blue", label: "Lapis", desc: "Celestial blue wash" },
  { value: "paper", label: "Paper", desc: "Warm parchment tone" },
];

const STEPS = ["Identity", "Story", "Sections", "Sources", "Export"] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function emptySection(): Section {
  return { id: uid(), label: "", heading: "", paragraphs: [""], pullQuote: "" };
}

function emptySource(): ArticleSource & { id: string } {
  return { id: uid(), label: "", url: "", note: "" };
}

function defaultDraft(): DraftState {
  const today = new Date();
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return {
    title: "",
    slug: "",
    eyebrow: "",
    category: categories.filter((c) => c !== "All records")[0] ?? "",
    date: `${String(today.getDate()).padStart(2, "0")} ${months[today.getMonth()]} ${today.getFullYear()}`,
    readTime: "8 min read",
    tone: "night",
    excerpt: "",
    keyQuestion: "",
    image: "/assets/kemet-hero.jpg",
    sections: [emptySection()],
    sources: [],
  };
}

function draftToArticle(draft: DraftState): Article {
  return {
    slug: draft.slug || toSlug(draft.title),
    title: draft.title,
    eyebrow: draft.eyebrow,
    category: draft.category,
    date: draft.date,
    readTime: draft.readTime,
    excerpt: draft.excerpt,
    image: draft.image,
    tone: draft.tone,
    keyQuestion: draft.keyQuestion,
    sources: draft.sources.map(({ id: _id, ...src }) => src),
    sections: draft.sections.map(({ id: _id, pullQuote, ...sec }) => ({
      ...sec,
      paragraphs: sec.paragraphs.filter(Boolean),
      ...(pullQuote ? { pullQuote } : {}),
    })),
  };
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = {
  onBack: () => void;
  initialDraft?: Partial<DraftState>;
};

export function ArticleDraftEditor({ onBack, initialDraft }: Props) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<DraftState>(() => ({ ...defaultDraft(), ...initialDraft }));
  const [copied, setCopied] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  // Auto-generate slug from title unless user has manually edited it
  useEffect(() => {
    if (!slugTouched && draft.title) {
      setDraft((d) => ({ ...d, slug: toSlug(d.title) }));
    }
  }, [draft.title, slugTouched]);

  const set = useCallback(<K extends keyof DraftState>(key: K, value: DraftState[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  }, []);

  // ── Section helpers ──────────────────────────────────────────────────────
  const updateSection = (id: string, patch: Partial<Section>) => {
    setDraft((d) => ({ ...d, sections: d.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
  };

  const addSection = () => setDraft((d) => ({ ...d, sections: [...d.sections, emptySection()] }));

  const removeSection = (id: string) =>
    setDraft((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== id) }));

  const moveSection = (id: string, dir: -1 | 1) => {
    setDraft((d) => {
      const arr = [...d.sections];
      const idx = arr.findIndex((s) => s.id === id);
      const to = idx + dir;
      if (to < 0 || to >= arr.length) return d;
      [arr[idx], arr[to]] = [arr[to], arr[idx]];
      return { ...d, sections: arr };
    });
  };

  const addParagraph = (sectionId: string) =>
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === sectionId ? { ...s, paragraphs: [...s.paragraphs, ""] } : s)),
    }));

  const updateParagraph = (sectionId: string, index: number, value: string) =>
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => {
        if (s.id !== sectionId) return s;
        const p = [...s.paragraphs];
        p[index] = value;
        return { ...s, paragraphs: p };
      }),
    }));

  const removeParagraph = (sectionId: string, index: number) =>
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) =>
        s.id === sectionId ? { ...s, paragraphs: s.paragraphs.filter((_, i) => i !== index) } : s
      ),
    }));

  // ── Source helpers ───────────────────────────────────────────────────────
  const addSource = () => setDraft((d) => ({ ...d, sources: [...d.sources, emptySource()] }));

  const updateSource = (id: string, patch: Partial<ArticleSource>) => {
    setDraft((d) => ({
      ...d,
      sources: d.sources.map((src) => (src.id === id ? { ...src, ...patch } : src)),
    }));
  };

  const removeSource = (id: string) =>
    setDraft((d) => ({ ...d, sources: d.sources.filter((src) => src.id !== id) }));

  // ── Export ───────────────────────────────────────────────────────────────
  const jsonOutput = JSON.stringify(draftToArticle(draft), null, 2);

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback: select textarea
      const el = document.getElementById("ade-json-textarea") as HTMLTextAreaElement | null;
      el?.select();
    }
  };

  const canProceed = [
    draft.title.length > 0 && draft.slug.length > 0,
    draft.excerpt.length > 0 && draft.keyQuestion.length > 0,
    draft.sections.length > 0 && draft.sections.every((s) => s.heading && s.paragraphs.some(Boolean)),
    true, // sources optional
    true,
  ][step];

  return (
    <div className="ade-shell">
      {/* Header */}
      <header className="ade-header">
        <button type="button" className="ade-back-btn" onClick={onBack}>
          <ArrowLeft size={15} /> Back to desk
        </button>
        <div className="ade-stepper">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              className={`ade-step${i === step ? " active" : i < step ? " done" : ""}`}
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              aria-current={i === step ? "step" : undefined}
            >
              {i < step ? <Check size={11} /> : <span>{i + 1}</span>}
              <span className="ade-step-label">{label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Step panels */}
      <div className="ade-body">
        {/* ── Step 0: Identity ── */}
        {step === 0 && (
          <StepPanel title="Case Identity" icon={<FileText size={18} />} desc="Set the article's core identification fields.">
            <Field label="Title *">
              <input
                id="ade-title"
                type="text"
                value={draft.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="The Sphinx and the forbidden waterline"
                className="ade-input"
              />
            </Field>

            <Field label="URL Slug *" hint="Auto-generated from title — edit freely">
              <input
                id="ade-slug"
                type="text"
                value={draft.slug}
                onChange={(e) => { set("slug", e.target.value); setSlugTouched(true); }}
                placeholder="the-sphinx-and-the-forbidden-waterline"
                className="ade-input ade-mono"
              />
              <span className="ade-url-preview">→ /journal/{draft.slug || "your-slug"}</span>
            </Field>

            <Field label="Eyebrow line" hint="Shown above the title on cards">
              <input
                id="ade-eyebrow"
                type="text"
                value={draft.eyebrow}
                onChange={(e) => set("eyebrow", e.target.value)}
                placeholder="CASE FILE 004 · GIZA PLATEAU"
                className="ade-input"
              />
            </Field>

            <div className="ade-row">
              <Field label="Category *">
                <select
                  id="ade-category"
                  value={draft.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="ade-select"
                >
                  {categories.filter((c) => c !== "All records").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Date">
                <input
                  id="ade-date"
                  type="text"
                  value={draft.date}
                  onChange={(e) => set("date", e.target.value)}
                  placeholder="05 SEP 2026"
                  className="ade-input"
                />
              </Field>

              <Field label="Read time">
                <input
                  id="ade-readtime"
                  type="text"
                  value={draft.readTime}
                  onChange={(e) => set("readTime", e.target.value)}
                  placeholder="8 min read"
                  className="ade-input"
                />
              </Field>
            </div>

            <Field label="Visual Tone">
              <div className="ade-tone-group">
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    className={`ade-tone-btn ade-tone-${t.value}${draft.tone === t.value ? " selected" : ""}`}
                    onClick={() => set("tone", t.value)}
                  >
                    <strong>{t.label}</strong>
                    <span>{t.desc}</span>
                  </button>
                ))}
              </div>
            </Field>
          </StepPanel>
        )}

        {/* ── Step 1: Story ── */}
        {step === 1 && (
          <StepPanel title="The Story" icon={<BookOpen size={18} />} desc="Write the article's editorial summary and opening question.">
            <Field label="Excerpt / Summary *" hint="Short teaser shown on cards and in the archive">
              <textarea
                id="ade-excerpt"
                value={draft.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                rows={3}
                placeholder="A weathered monument, a disputed chronology, and the grooves in stone that keep asking difficult questions."
                className="ade-textarea"
              />
            </Field>

            <Field label="Key Question *" hint="The central research question that opens the article">
              <textarea
                id="ade-keyquestion"
                value={draft.keyQuestion}
                onChange={(e) => set("keyQuestion", e.target.value)}
                rows={2}
                placeholder="What does erosion remember when chronology refuses to listen?"
                className="ade-textarea"
              />
            </Field>

            <Field label="Hero / Polaroid Image URL" hint="Use /assets/filename.jpg for local assets">
              <input
                id="ade-image"
                type="text"
                value={draft.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="/assets/kemet-hero.jpg"
                className="ade-input"
              />
              {draft.image && (
                <div className="ade-image-preview">
                  <img src={draft.image} alt="Preview" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
            </Field>
          </StepPanel>
        )}

        {/* ── Step 2: Sections ── */}
        {step === 2 && (
          <StepPanel title="Article Sections" icon={<Layers size={18} />} desc="Build the long-form body. Each section has a label, heading, paragraphs, and an optional pull quote.">
            {draft.sections.map((sec, secIdx) => (
              <div key={sec.id} className="ade-section-card">
                <div className="ade-section-card-header">
                  <span className="ade-section-num">§ {secIdx + 1}</span>
                  <div className="ade-section-actions">
                    <button type="button" aria-label="Move up" onClick={() => moveSection(sec.id, -1)} disabled={secIdx === 0}><ChevronUp size={14} /></button>
                    <button type="button" aria-label="Move down" onClick={() => moveSection(sec.id, 1)} disabled={secIdx === draft.sections.length - 1}><ChevronDown size={14} /></button>
                    <button type="button" aria-label="Remove section" className="ade-danger-btn" onClick={() => removeSection(sec.id)} disabled={draft.sections.length === 1}><Trash2 size={14} /></button>
                  </div>
                </div>

                <div className="ade-row">
                  <Field label="Section label" hint="e.g. I. THE QUESTION">
                    <input type="text" value={sec.label} onChange={(e) => updateSection(sec.id, { label: e.target.value })} placeholder="I. THE QUESTION" className="ade-input ade-mono" />
                  </Field>
                  <Field label="Heading *">
                    <input type="text" value={sec.heading} onChange={(e) => updateSection(sec.id, { heading: e.target.value })} placeholder="A monument built to keep a face" className="ade-input" />
                  </Field>
                </div>

                <div className="ade-para-group">
                  <label className="ade-label">Paragraphs *</label>
                  {sec.paragraphs.map((para, paraIdx) => (
                    <div key={paraIdx} className="ade-para-row">
                      <textarea
                        value={para}
                        onChange={(e) => updateParagraph(sec.id, paraIdx, e.target.value)}
                        rows={3}
                        placeholder={`Paragraph ${paraIdx + 1}…`}
                        className="ade-textarea"
                      />
                      <button type="button" aria-label="Remove paragraph" className="ade-danger-btn ade-para-del" onClick={() => removeParagraph(sec.id, paraIdx)} disabled={sec.paragraphs.length === 1}><Trash2 size={13} /></button>
                    </div>
                  ))}
                  <button type="button" className="ade-add-btn" onClick={() => addParagraph(sec.id)}><Plus size={13} /> Add paragraph</button>
                </div>

                <Field label="Pull quote" hint="Optional — shown as a visual interruption in the reader">
                  <input type="text" value={sec.pullQuote} onChange={(e) => updateSection(sec.id, { pullQuote: e.target.value })} placeholder="Stone does not answer in sentences. It answers in durations." className="ade-input" />
                </Field>
              </div>
            ))}

            <button type="button" className="ade-add-section-btn" onClick={addSection}><Plus size={15} /> Add section</button>
          </StepPanel>
        )}

        {/* ── Step 3: Sources ── */}
        {step === 3 && (
          <StepPanel title="Evidence & Sources" icon={<Link2 size={18} />} desc="Add real external references readers can follow. Sources are optional but strengthen the case.">
            {draft.sources.length === 0 && (
              <p className="ade-empty-note">No sources yet. Click "Add source" to add your first reference card.</p>
            )}
            {draft.sources.map((src, i) => (
              <div key={src.id} className="ade-source-card">
                <div className="ade-source-num">SOURCE {i + 1}</div>
                <Field label="Label *">
                  <input type="text" value={src.label} onChange={(e) => updateSource(src.id, { label: e.target.value })} placeholder="John Anthony West — Serpent in the Sky" className="ade-input" />
                </Field>
                <Field label="URL">
                  <input type="url" value={src.url} onChange={(e) => updateSource(src.id, { url: e.target.value })} placeholder="https://example.com/source" className="ade-input ade-mono" />
                </Field>
                <Field label="Why it matters (note)">
                  <textarea value={src.note} onChange={(e) => updateSource(src.id, { note: e.target.value })} rows={2} placeholder="Introduces the waterline argument and contextualises the erosion debate." className="ade-textarea" />
                </Field>
                <button type="button" className="ade-remove-source-btn" onClick={() => removeSource(src.id)}><Trash2 size={13} /> Remove source</button>
              </div>
            ))}
            <button type="button" className="ade-add-btn" onClick={addSource}><Plus size={13} /> Add source</button>
          </StepPanel>
        )}

        {/* ── Step 4: Export ── */}
        {step === 4 && (
          <StepPanel title="Export & Deploy" icon={<Copy size={18} />} desc="Your draft is ready. Copy the JSON and paste it into the articles file in VSCode.">
            <div className="ade-deploy-card">
              <div className="ade-deploy-icon">📁</div>
              <div className="ade-deploy-body">
                <span className="micro-label">FILE TO EDIT</span>
                <code className="ade-deploy-path">client/src/data/articles.json</code>
              </div>
            </div>

            <ol className="ade-instructions">
              <li>Open <code>client/src/data/articles.json</code> in VSCode.</li>
              <li>Find the <code>"articles": [</code> array.</li>
              <li>Paste the JSON below as a <strong>new object</strong> inside the array (before or after an existing entry, separated by a comma).</li>
              <li>Save the file, then run <code>pnpm dev</code> to preview in the browser.</li>
              <li>Run <code>pnpm build</code> and deploy to Vercel when satisfied.</li>
            </ol>

            <div className="ade-export-header">
              <span className="micro-label">GENERATED JSON — 1 ARTICLE OBJECT</span>
              <button type="button" className={`ade-copy-btn${copied ? " copied" : ""}`} onClick={copyJson}>
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy JSON</>}
              </button>
            </div>

            <div className="ade-json-wrap">
              <textarea
                id="ade-json-textarea"
                className="ade-json-output"
                readOnly
                value={jsonOutput}
                rows={30}
                spellCheck={false}
              />
            </div>

            <div className="ade-warn-note">
              <strong>Slug:</strong> <code>{draft.slug || toSlug(draft.title) || "no-slug-set"}</code> — make sure it is unique and does not already exist in <code>articles.json</code>.
            </div>
          </StepPanel>
        )}
      </div>

      {/* Footer navigation */}
      <footer className="ade-footer">
        <button type="button" className="ade-nav-btn secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ArrowLeft size={15} /> Previous
        </button>
        <span className="ade-step-counter">{step + 1} / {STEPS.length}</span>
        {step < STEPS.length - 1 ? (
          <button type="button" className="ade-nav-btn primary" onClick={() => setStep((s) => s + 1)} disabled={!canProceed}>
            Next <ArrowRight size={15} />
          </button>
        ) : (
          <button type="button" className={`ade-nav-btn primary${copied ? " copied" : ""}`} onClick={copyJson}>
            {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy JSON</>}
          </button>
        )}
      </footer>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function StepPanel({ title, icon, desc, children }: { title: string; icon: React.ReactNode; desc: string; children: React.ReactNode }) {
  return (
    <section className="ade-panel">
      <div className="ade-panel-header">
        {icon}
        <div>
          <h2>{title}</h2>
          <p>{desc}</p>
        </div>
      </div>
      <div className="ade-panel-fields">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="ade-field">
      <label className="ade-label">{label}{hint && <span className="ade-hint"> · {hint}</span>}</label>
      {children}
    </div>
  );
}
