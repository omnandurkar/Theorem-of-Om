import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, ChevronUp, Copy,
  Download, Eye, FileText, HelpCircle, Layers, Link2, LockKeyhole, MapPin,
  Move, PenLine, Plus, RefreshCw, Save, Search, ShieldCheck, Sparkles, Trash2, Upload
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import type { Article, ArticleSource } from "@/data/articles";
import { articles, categories } from "@/data/articles";
import {
  CASE_STATUSES, EVIDENCE_MODES, FONT_CATALOG, PALETTES, STAMP_KINDS,
  STICKER_MOTIFS, STICKY_PLACEMENTS, STICKY_TREATMENTS, SYMBOLS, VECTOR_MARKS
} from "@/data/editorCatalog";
import { LiveReaderPreviewPanel } from "./LiveReaderPreviewPanel";
import "./omEditor.css";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Section = {
  id: string;
  label: string;
  heading: string;
  paragraphs: string[];
  pullQuote: string;
  collapsed?: boolean;
};

export type SourceCard = ArticleSource & { id: string; collapsed?: boolean };

export type FullDraftState = {
  // Pass 01 — Identify
  title: string;
  slug: string;
  eyebrow: string;
  caseNumber: string;
  category: string;
  date: string;
  readTime: string;
  caseStatus: "documented" | "disputed" | "unverified" | "ongoing" | "unresolved";
  evidenceLevel: number; // 0-100
  evidenceMode: string;
  location: string;
  era: string;
  mapLatitude: string;
  mapLongitude: string;
  keyQuestion: string;
  excerpt: string;
  image: string;
  imageCaption: string;

  // Pass 02 — Write
  sections: Section[];
  authorTake: string;
  openingNote: string;

  // Pass 03 — Evidence
  claim: string;
  documentedEvidence: string;
  counterargument: string;
  anomaly: string;
  theory: string;
  sources: SourceCard[];
  driveSourceUrl: string;
  relatedCaseSlugs: string;
  relationNote: string;

  // Pass 04 — Shape & Release
  fontId: string;
  paletteId: string;
  symbol: string;
  vectorMark: string;
  stickerMotif: string;
  stickyTitle: string;
  stickyBody: string;
  stickyTreatment: "brass-pin" | "top-tape" | "crossed-tape" | "thread-and-pin";
  stickyPlacement: "margin" | "left-lean" | "right-lean";
  stampKind: "auto" | "top-secret" | "unverified" | "declassified" | "case-closed" | "none";
};

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
  return { id: uid(), label: "", heading: "", paragraphs: [""], pullQuote: "", collapsed: false };
}

function emptySource(): SourceCard {
  return { id: uid(), label: "", url: "", note: "", collapsed: false };
}

function defaultDraft(): FullDraftState {
  const today = new Date();
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return {
    title: "",
    slug: "",
    eyebrow: "CASE FILE 001 · FIELD DOSSIER",
    caseNumber: "CASE 001",
    category: categories.filter((c) => c !== "All records")[0] ?? "Weathered Stone",
    date: `${String(today.getDate()).padStart(2, "0")} ${months[today.getMonth()]} ${today.getFullYear()}`,
    readTime: "8 min read",
    caseStatus: "documented",
    evidenceLevel: 75,
    evidenceMode: "Material record",
    location: "Giza Plateau",
    era: "Old Kingdom",
    mapLatitude: "29.9792",
    mapLongitude: "31.1342",
    keyQuestion: "",
    excerpt: "",
    image: "/assets/kemet-hero.jpg",
    imageCaption: "Field image of monument record",

    sections: [emptySection()],
    authorTake: "",
    openingNote: "",

    claim: "",
    documentedEvidence: "",
    counterargument: "",
    anomaly: "",
    theory: "",
    sources: [],
    driveSourceUrl: "",
    relatedCaseSlugs: "",
    relationNote: "",

    fontId: "cormorant",
    paletteId: "papyrus",
    symbol: "eye-of-horus",
    vectorMark: "grid",
    stickerMotif: "scarab-eye",
    stickyTitle: "Curator Note",
    stickyBody: "Annotated field note for verification.",
    stickyTreatment: "brass-pin",
    stickyPlacement: "right-lean",
    stampKind: "auto",
  };
}

// Transform draft to public-compatible JSON
export function draftToPublicArticle(draft: FullDraftState): Article {
  const toneMap: Record<string, "night" | "paper" | "blue"> = {
    night: "night",
    ink: "night",
    oxblood: "night",
    lapis: "blue",
    papyrus: "paper",
    limestone: "paper",
    sand: "paper",
    sage: "paper",
  };

  return {
    slug: draft.slug || toSlug(draft.title),
    title: draft.title,
    eyebrow: draft.eyebrow,
    category: draft.category,
    date: draft.date,
    readTime: draft.readTime,
    excerpt: draft.excerpt,
    image: draft.image,
    tone: toneMap[draft.paletteId] || "paper",
    keyQuestion: draft.keyQuestion,
    sources: draft.sources.map(({ id: _id, collapsed: _c, ...src }) => src),
    sections: draft.sections.map(({ id: _id, collapsed: _c, pullQuote, ...sec }) => ({
      ...sec,
      paragraphs: sec.paragraphs.filter(Boolean),
      ...(pullQuote ? { pullQuote } : {}),
    })),
  };
}

// Transform draft to extended JSON object
export function draftToExtendedArticle(draft: FullDraftState) {
  const base = draftToPublicArticle(draft);
  return {
    ...base,
    caseNumber: draft.caseNumber,
    caseStatus: draft.caseStatus,
    stampKind: draft.stampKind,
    evidenceLevel: draft.evidenceLevel,
    evidenceMode: draft.evidenceMode,
    location: draft.location,
    era: draft.era,
    mapLatitude: draft.mapLatitude ? parseFloat(draft.mapLatitude) : undefined,
    mapLongitude: draft.mapLongitude ? parseFloat(draft.mapLongitude) : undefined,
    imageCaption: draft.imageCaption,
    fontId: draft.fontId,
    paletteId: draft.paletteId,
    symbol: draft.symbol,
    vectorMark: draft.vectorMark,
    stickerMotif: draft.stickerMotif,
    stickyTitle: draft.stickyTitle,
    stickyBody: draft.stickyBody,
    stickyTreatment: draft.stickyTreatment,
    stickyPlacement: draft.stickyPlacement,
    claim: draft.claim,
    documentedEvidence: draft.documentedEvidence,
    counterargument: draft.counterargument,
    anomaly: draft.anomaly,
    theory: draft.theory,
    authorTake: draft.authorTake,
    openingNote: draft.openingNote,
    relatedCaseSlugs: draft.relatedCaseSlugs,
    relationNote: draft.relationNote,
    featured: false,
    status: "draft",
  };
}

const PASS_NAMES = [
  "01 · Identify",
  "02 · Write",
  "03 · Evidence",
  "04 · Shape & Release",
] as const;

type Props = {
  onBack?: () => void;
  onLock?: () => void;
  initialDraft?: Partial<FullDraftState>;
};

export function OmEditorShell({ onBack, onLock, initialDraft }: Props) {
  const [pass, setPass] = useState(0); // 0..3
  const [draft, setDraft] = useState<FullDraftState>(() => {
    try {
      const saved = window.localStorage.getItem("kemet-editor-draft");
      if (saved) return { ...defaultDraft(), ...JSON.parse(saved), ...initialDraft };
    } catch {}
    return { ...defaultDraft(), ...initialDraft };
  });

  const [dirty, setDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [exportMode, setExportMode] = useState<"public" | "extended">("public");
  const [copyStatus, setCopyStatus] = useState<"idle" | "json" | "object">("idle");
  const [slugTouched, setSlugTouched] = useState(false);
  const [fontSearch, setFontSearch] = useState("");
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [focusSectionId, setFocusSectionId] = useState<string | null>(null);

  // Auto slug generation
  useEffect(() => {
    if (!slugTouched && draft.title) {
      setDraft((d) => ({ ...d, slug: toSlug(d.title) }));
    }
  }, [draft.title, slugTouched]);

  // Local Storage Autosave
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem("kemet-editor-draft", JSON.stringify(draft));
        const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        setLastSaved(now);
        setDirty(false);
      } catch {}
    }, 1200);
    return () => clearTimeout(timer);
  }, [draft]);

  const patch = useCallback(<K extends keyof FullDraftState>(key: K, value: FullDraftState[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  }, []);

  // Section handlers
  const updateSection = (id: string, p: Partial<Section>) => {
    setDraft((d) => ({ ...d, sections: d.sections.map((s) => (s.id === id ? { ...s, ...p } : s)) }));
    setDirty(true);
  };

  const addSection = () => {
    setDraft((d) => ({ ...d, sections: [...d.sections, emptySection()] }));
    setDirty(true);
  };

  const duplicateSection = (id: string) => {
    setDraft((d) => {
      const idx = d.sections.findIndex((s) => s.id === id);
      if (idx === -1) return d;
      const target = d.sections[idx];
      const dup: Section = { ...target, id: uid(), heading: `${target.heading} (Copy)` };
      const arr = [...d.sections];
      arr.splice(idx + 1, 0, dup);
      return { ...d, sections: arr };
    });
    setDirty(true);
  };

  const removeSection = (id: string) => {
    setDraft((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== id) }));
    setDirty(true);
  };

  const moveSection = (id: string, dir: -1 | 1) => {
    setDraft((d) => {
      const arr = [...d.sections];
      const idx = arr.findIndex((s) => s.id === id);
      const to = idx + dir;
      if (to < 0 || to >= arr.length) return d;
      [arr[idx], arr[to]] = [arr[to], arr[idx]];
      return { ...d, sections: arr };
    });
    setDirty(true);
  };

  const addParagraph = (sectionId: string) => {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === sectionId ? { ...s, paragraphs: [...s.paragraphs, ""] } : s)),
    }));
    setDirty(true);
  };

  const updateParagraph = (sectionId: string, pIdx: number, val: string) => {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => {
        if (s.id !== sectionId) return s;
        const p = [...s.paragraphs];
        p[pIdx] = val;
        return { ...s, paragraphs: p };
      }),
    }));
    setDirty(true);
  };

  const removeParagraph = (sectionId: string, pIdx: number) => {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) =>
        s.id === sectionId ? { ...s, paragraphs: s.paragraphs.filter((_, i) => i !== pIdx) } : s
      ),
    }));
    setDirty(true);
  };

  // Source handlers
  const addSource = () => {
    setDraft((d) => ({ ...d, sources: [...d.sources, emptySource()] }));
    setDirty(true);
  };

  const updateSource = (id: string, p: Partial<SourceCard>) => {
    setDraft((d) => ({
      ...d,
      sources: d.sources.map((src) => (src.id === id ? { ...src, ...p } : src)),
    }));
    setDirty(true);
  };

  const moveSource = (id: string, dir: -1 | 1) => {
    setDraft((d) => {
      const arr = [...d.sources];
      const idx = arr.findIndex((s) => s.id === id);
      const to = idx + dir;
      if (to < 0 || to >= arr.length) return d;
      [arr[idx], arr[to]] = [arr[to], arr[idx]];
      return { ...d, sources: arr };
    });
    setDirty(true);
  };

  const removeSource = (id: string) => {
    setDraft((d) => ({ ...d, sources: d.sources.filter((src) => src.id !== id) }));
    setDirty(true);
  };

  // Completion calculation for each pass
  const passCompletions = useMemo(() => {
    const p1 = Boolean(draft.title && draft.slug && draft.category && draft.excerpt && draft.keyQuestion);
    const p2 = Boolean(draft.sections.length > 0 && draft.sections.every((s) => s.heading && s.paragraphs.some(Boolean)));
    const p3 = Boolean(draft.claim || draft.documentedEvidence || draft.sources.length > 0);
    const p4 = Boolean(draft.fontId && draft.paletteId);
    return [p1 ? 100 : 50, p2 ? 100 : 40, p3 ? 100 : 60, p4 ? 100 : 80];
  }, [draft]);

  // Validation Check
  const existingSlugs = useMemo(() => articles.map((a) => a.slug), []);
  const validationErrors = useMemo(() => {
    const errs: string[] = [];
    if (!draft.title.trim()) errs.push("Title is required.");
    if (!draft.slug.trim()) errs.push("URL slug is required.");
    else if (!/^[a-z0-9-]+$/.test(draft.slug)) errs.push("Slug must be lowercase and URL-safe (a-z, 0-9, hyphens).");
    else if (existingSlugs.includes(draft.slug)) errs.push(`Slug "${draft.slug}" already exists in articles.json.`);
    if (!draft.excerpt.trim()) errs.push("Excerpt / Summary is required.");
    if (!draft.keyQuestion.trim()) errs.push("Central Key Question is required.");
    if (draft.sections.length === 0) errs.push("At least one article section is required.");
    else if (!draft.sections.some((s) => s.heading && s.paragraphs.some(Boolean))) errs.push("At least one section must have a heading and a non-empty paragraph.");
    if (draft.evidenceLevel < 0 || draft.evidenceLevel > 100) errs.push("Evidence level must be between 0 and 100.");
    if ((draft.mapLatitude && !draft.mapLongitude) || (!draft.mapLatitude && draft.mapLongitude)) {
      errs.push("Latitude and Longitude must be provided as a pair.");
    }
    return errs;
  }, [draft, existingSlugs]);

  // JSON Outputs
  const publicObject = draftToPublicArticle(draft);
  const extendedObject = draftToExtendedArticle(draft);
  const activeExportObject = exportMode === "public" ? publicObject : extendedObject;
  const jsonOutput = JSON.stringify(activeExportObject, null, 2);

  // Copy & Export Handlers
  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonOutput);
      setCopyStatus("json");
      setTimeout(() => setCopyStatus("idle"), 2500);
    } catch {
      const el = document.getElementById("om-json-textarea") as HTMLTextAreaElement | null;
      el?.select();
    }
  };

  const handleCopyObjectOnly = async () => {
    try {
      await navigator.clipboard.writeText(jsonOutput);
      setCopyStatus("object");
      setTimeout(() => setCopyStatus("idle"), 2500);
    } catch {}
  };

  const handleDownloadJson = () => {
    const filename = `case-${draft.slug || "draft"}.json`;
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetDraft = () => {
    if (window.confirm("Are you sure you want to reset this draft to default? All unsaved work will be lost.")) {
      setDraft(defaultDraft());
      setSlugTouched(false);
      setDirty(false);
      window.localStorage.removeItem("kemet-editor-draft");
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const obj = JSON.parse(evt.target?.result as string);
        setDraft((d) => ({ ...d, ...obj }));
        alert("Draft successfully imported!");
      } catch {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        window.localStorage.setItem("kemet-editor-draft", JSON.stringify(draft));
        setLastSaved(new Date().toLocaleTimeString());
        setDirty(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [draft]);

  // Word count & read time stats
  const wordCount = useMemo(() => {
    const secWords = draft.sections.reduce(
      (acc, sec) => acc + sec.heading.split(/\s+/).length + sec.paragraphs.join(" ").split(/\s+/).length,
      0
    );
    return secWords + draft.excerpt.split(/\s+/).length;
  }, [draft]);

  const estimatedReadTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  const filteredFonts = useMemo(() => {
    if (!fontSearch) return FONT_CATALOG;
    return FONT_CATALOG.filter(
      (f) => f.label.toLowerCase().includes(fontSearch.toLowerCase()) || f.id.toLowerCase().includes(fontSearch.toLowerCase())
    );
  }, [fontSearch]);

  return (
    <div className="om-desk-shell">
      {/* Persistent Left Desk Rail (Desktop) */}
      <aside className="om-desk-rail">
        <Link href="/" className="om-rail-brand">
          <span>OM</span>
          <strong>THEOREM<br />OF KEMET</strong>
        </Link>

        <div className="om-rail-case-indicator">
          <span className="micro-label">ACTIVE FIELD CASE</span>
          <strong>{draft.title || "Untitled Draft"}</strong>
          <small>{draft.category} &middot; {draft.slug || "no-slug"}</small>
        </div>

        <nav className="om-rail-passes">
          <span className="micro-label">FOUR-PASS WORKFLOW</span>
          {PASS_NAMES.map((name, i) => (
            <button
              key={name}
              type="button"
              className={`rail-pass-btn ${i === pass ? "active" : i < pass ? "completed" : ""}`}
              onClick={() => setPass(i)}
            >
              <span className="pass-num">{i + 1}</span>
              <span className="pass-name">{name.split(" · ")[1]}</span>
              <span className="pass-percent">{passCompletions[i]}%</span>
            </button>
          ))}
        </nav>

        <div className="om-rail-links">
          <span className="micro-label">FIELD ACTIONS</span>
          <Link href="/journal"><BookOpen size={13} /> Public journal</Link>
          <button type="button" onClick={() => setShowPreview((v) => !v)}>
            <Eye size={13} /> {showPreview ? "Hide preview" : "Open preview"}
          </button>
          <button type="button" onClick={() => setShowHelpGuide((v) => !v)}>
            <HelpCircle size={13} /> How to use desk
          </button>
          <button type="button" onClick={() => setPass(3)}>
            <Download size={13} /> Export JSON
          </button>

          {onLock && (
            <button type="button" className="rail-lock-btn" onClick={onLock} title="Lock Sanctum Gate">
              <LockKeyhole size={13} /> Lock Desk
            </button>
          )}

          {onBack && (
            <button type="button" className="rail-back-btn" onClick={onBack}>
              <ArrowLeft size={13} /> Back to dashboard
            </button>
          )}
        </div>
      </aside>

      {/* Main Workspace Stage */}
      <div className="om-desk-main">
        {/* Top Desk Bar */}
        <header className="om-top-bar">
          <div>
            <span className="micro-label">OM&rsquo;S PERMANENT FIELD DESK</span>
            <h1>Pass {PASS_NAMES[pass]}</h1>
          </div>

          <div className="top-bar-controls">
            <div className="draft-status-badge">
              <span className={`status-dot ${dirty ? "dirty" : "saved"}`} />
              <span>{dirty ? "Unsaved edits" : lastSaved ? `Saved at ${lastSaved}` : "Saved locally"}</span>
            </div>

            {onLock && (
              <button type="button" className="desk-btn lock-sanctum-btn" onClick={onLock} title="Lock Sanctum Gate immediately">
                <LockKeyhole size={14} /> Lock Desk
              </button>
            )}

            <button type="button" className="desk-btn secondary" onClick={() => patch("date", draft.date)} title="Save draft locally">
              <Save size={14} /> Save locally
            </button>

            <button type="button" className="desk-btn secondary" onClick={handleResetDraft} title="Reset draft">
              <RefreshCw size={14} /> Reset
            </button>

            <button
              type="button"
              className={`desk-btn ${showPreview ? "active" : "secondary"}`}
              onClick={() => setShowPreview((v) => !v)}
            >
              <Eye size={14} /> {showPreview ? "Close preview" : "Live preview"}
            </button>

            <label className="import-btn-label desk-btn secondary" title="Import draft JSON file">
              <Upload size={14} /> Import
              <input type="file" accept=".json" onChange={handleImportJson} hidden />
            </label>
          </div>
        </header>

        {/* Workspace layout grid */}
        <div className={`om-workspace-grid ${showPreview ? "split-preview" : ""}`}>
          <main className="om-editor-panel">
            {/* ── PASS 01: IDENTIFY ── */}
            {pass === 0 && (
              <section className="pass-panel">
                <div className="panel-intro">
                  <FileText size={20} />
                  <div>
                    <h2>Pass 01 &middot; Identify the Record</h2>
                    <p>Establish core metadata, classification, coordinates, central question, and orientation.</p>
                  </div>
                </div>

                {/* Ethics orientation card */}
                <div className="ethics-card">
                  <MapPin size={16} />
                  <p>
                    <strong>Responsible Coordinates & Location Ethics:</strong> Enter coordinates only when responsibly identifiable. Map pins represent contextual research locations, not proof of a claim.
                  </p>
                </div>

                <div className="form-grid">
                  <div className="form-group span-2">
                    <label>Public Title *</label>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={(e) => patch("title", e.target.value)}
                      placeholder="The Sphinx and the forbidden waterline"
                      className="desk-input title-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>URL Slug * <span className="hint">Auto-suggested from title</span></label>
                    <input
                      type="text"
                      value={draft.slug}
                      onChange={(e) => { patch("slug", e.target.value); setSlugTouched(true); }}
                      placeholder="the-sphinx-and-the-forbidden-waterline"
                      className="desk-input mono-font"
                    />
                    <small className="url-preview-tag">&rarr; /journal/{draft.slug || "your-slug"}</small>
                  </div>

                  <div className="form-group">
                    <label>Eyebrow Label</label>
                    <input
                      type="text"
                      value={draft.eyebrow}
                      onChange={(e) => patch("eyebrow", e.target.value)}
                      placeholder="CASE FILE 001 · GIZA PLATEAU"
                      className="desk-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Case Number</label>
                    <input
                      type="text"
                      value={draft.caseNumber}
                      onChange={(e) => patch("caseNumber", e.target.value)}
                      placeholder="CASE 001"
                      className="desk-input mono-font"
                    />
                  </div>

                  <div className="form-group">
                    <label>Shelf / Category *</label>
                    <select
                      value={draft.category}
                      onChange={(e) => patch("category", e.target.value)}
                      className="desk-select"
                    >
                      {categories.filter((c) => c !== "All records").map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Display Date *</label>
                    <input
                      type="text"
                      value={draft.date}
                      onChange={(e) => patch("date", e.target.value)}
                      placeholder="12 AUG 2026"
                      className="desk-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Read Time *</label>
                    <input
                      type="text"
                      value={draft.readTime}
                      onChange={(e) => patch("readTime", e.target.value)}
                      placeholder="11 min read"
                      className="desk-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Case Status</label>
                    <select
                      value={draft.caseStatus}
                      onChange={(e) => patch("caseStatus", e.target.value as FullDraftState["caseStatus"])}
                      className="desk-select"
                    >
                      {CASE_STATUSES.map((cs) => (
                        <option key={cs.id} value={cs.value}>{cs.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Evidence Mode</label>
                    <select
                      value={draft.evidenceMode}
                      onChange={(e) => patch("evidenceMode", e.target.value)}
                      className="desk-select"
                    >
                      {EVIDENCE_MODES.map((em) => (
                        <option key={em.id} value={em.value}>{em.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group span-2">
                    <label>Evidence Confidence Level (0 - 100%): <strong>{draft.evidenceLevel}%</strong></label>
                    <div className="slider-row">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={draft.evidenceLevel}
                        onChange={(e) => patch("evidenceLevel", parseInt(e.target.value, 10))}
                        className="desk-slider"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={draft.evidenceLevel}
                        onChange={(e) => patch("evidenceLevel", Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                        className="desk-input num-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Location Name</label>
                    <input
                      type="text"
                      value={draft.location}
                      onChange={(e) => patch("location", e.target.value)}
                      placeholder="Giza Plateau"
                      className="desk-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Era / Period</label>
                    <input
                      type="text"
                      value={draft.era}
                      onChange={(e) => patch("era", e.target.value)}
                      placeholder="Old Kingdom"
                      className="desk-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Latitude (Decimal)</label>
                    <input
                      type="text"
                      value={draft.mapLatitude}
                      onChange={(e) => patch("mapLatitude", e.target.value)}
                      placeholder="29.9792"
                      className="desk-input mono-font"
                    />
                  </div>

                  <div className="form-group">
                    <label>Longitude (Decimal)</label>
                    <input
                      type="text"
                      value={draft.mapLongitude}
                      onChange={(e) => patch("mapLongitude", e.target.value)}
                      placeholder="31.1342"
                      className="desk-input mono-font"
                    />
                  </div>

                  <div className="form-group span-2">
                    <label>Central Key Question * <span className="hint">Must be an open question, not a conclusion</span></label>
                    <textarea
                      value={draft.keyQuestion}
                      onChange={(e) => patch("keyQuestion", e.target.value)}
                      rows={2}
                      placeholder="What does erosion remember when chronology refuses to listen?"
                      className="desk-textarea"
                    />
                  </div>

                  <div className="form-group span-2">
                    <label>Excerpt / Public Summary * <span className="hint">2–4 sentence overview for article cards</span></label>
                    <textarea
                      value={draft.excerpt}
                      onChange={(e) => patch("excerpt", e.target.value)}
                      rows={3}
                      placeholder="A weathered monument, a disputed chronology, and the grooves in stone that keep asking difficult questions."
                      className="desk-textarea"
                    />
                  </div>

                  <div className="form-group span-2">
                    <label>Hero Image URL</label>
                    <input
                      type="text"
                      value={draft.image}
                      onChange={(e) => patch("image", e.target.value)}
                      placeholder="/assets/kemet-hero.jpg or https://..."
                      className="desk-input"
                    />
                    {draft.image && (
                      <div className="image-preview-thumb">
                        <img src={draft.image} alt="Hero preview" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    )}
                  </div>

                  <div className="form-group span-2">
                    <label>Hero Image Caption</label>
                    <input
                      type="text"
                      value={draft.imageCaption}
                      onChange={(e) => patch("imageCaption", e.target.value)}
                      placeholder="Field inspection photograph of weathering channels."
                      className="desk-input"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* ── PASS 02: WRITE ── */}
            {pass === 1 && (
              <section className="pass-panel">
                <div className="panel-intro">
                  <PenLine size={20} />
                  <div>
                    <h2>Pass 02 &middot; Write the Case File</h2>
                    <p>Build ordered sections with headings, paragraphs, pull quotes, and personal curator readings.</p>
                  </div>
                </div>

                {/* Writing helper stats bar */}
                <div className="writing-stats-bar">
                  <div>
                    <span>TOTAL WORDS</span>
                    <strong>{wordCount} words</strong>
                  </div>
                  <div>
                    <span>ESTIMATED READ</span>
                    <strong>{estimatedReadTime}</strong>
                  </div>
                  <div>
                    <span>SECTIONS</span>
                    <strong>{draft.sections.length} sections</strong>
                  </div>
                </div>

                {/* Section Cards */}
                <div className="sections-container">
                  {draft.sections.map((sec, secIdx) => (
                    <div key={sec.id} className={`section-card ${focusSectionId === sec.id ? "is-focused" : ""}`}>
                      <div className="section-card-topbar">
                        <div className="section-card-title">
                          <button
                            type="button"
                            className="collapse-toggle-btn"
                            onClick={() => updateSection(sec.id, { collapsed: !sec.collapsed })}
                          >
                            {sec.collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                          </button>
                          <span>&sect; {secIdx + 1} &middot; {sec.heading || "Untitled Section"}</span>
                        </div>

                        <div className="section-card-actions">
                          <button
                            type="button"
                            className={`focus-btn ${focusSectionId === sec.id ? "active" : ""}`}
                            onClick={() => setFocusSectionId(focusSectionId === sec.id ? null : sec.id)}
                            title="Focus mode for this section"
                          >
                            Focus
                          </button>
                          <button type="button" onClick={() => duplicateSection(sec.id)} title="Duplicate section">
                            Duplicate
                          </button>
                          <button type="button" onClick={() => moveSection(sec.id, -1)} disabled={secIdx === 0}>
                            <ChevronUp size={14} />
                          </button>
                          <button type="button" onClick={() => moveSection(sec.id, 1)} disabled={secIdx === draft.sections.length - 1}>
                            <ChevronDown size={14} />
                          </button>
                          <button type="button" className="danger-btn" onClick={() => removeSection(sec.id)} disabled={draft.sections.length === 1}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {!sec.collapsed && (
                        <div className="section-card-body">
                          <div className="form-grid">
                            <div className="form-group">
                              <label>Section Label <span className="hint">e.g. I. THE QUESTION</span></label>
                              <input
                                type="text"
                                value={sec.label}
                                onChange={(e) => updateSection(sec.id, { label: e.target.value })}
                                placeholder="I. THE QUESTION"
                                className="desk-input mono-font"
                              />
                            </div>

                            <div className="form-group span-2">
                              <label>Section Heading *</label>
                              <input
                                type="text"
                                value={sec.heading}
                                onChange={(e) => updateSection(sec.id, { heading: e.target.value })}
                                placeholder="A monument built to keep a face"
                                className="desk-input"
                              />
                            </div>
                          </div>

                          <div className="paragraphs-block">
                            <label>Paragraphs * <span className="hint">Preserved as distinct text blocks</span></label>
                            {sec.paragraphs.map((pText, pIdx) => (
                              <div key={pIdx} className="paragraph-row">
                                <textarea
                                  value={pText}
                                  onChange={(e) => updateParagraph(sec.id, pIdx, e.target.value)}
                                  rows={3}
                                  placeholder={`Paragraph ${pIdx + 1} content…`}
                                  className="desk-textarea"
                                />
                                <button
                                  type="button"
                                  className="para-del-btn"
                                  onClick={() => removeParagraph(sec.id, pIdx)}
                                  disabled={sec.paragraphs.length === 1}
                                  title="Delete paragraph"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                            <button type="button" className="add-para-btn" onClick={() => addParagraph(sec.id)}>
                              <Plus size={13} /> Add paragraph
                            </button>
                          </div>

                          <div className="form-group">
                            <label>Pull Quote <span className="hint">Optional visual quote</span></label>
                            <input
                              type="text"
                              value={sec.pullQuote}
                              onChange={(e) => updateSection(sec.id, { pullQuote: e.target.value })}
                              placeholder="Stone does not answer in sentences. It answers in durations."
                              className="desk-input"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <button type="button" className="add-section-large-btn" onClick={addSection}>
                    <Plus size={16} /> Add new section
                  </button>
                </div>

                {/* Om's Author Reading */}
                <div className="author-take-block">
                  <div className="form-group">
                    <label>Om&rsquo;s Personal Curator Take <span className="hint">Separated from documented evidence</span></label>
                    <textarea
                      value={draft.authorTake}
                      onChange={(e) => patch("authorTake", e.target.value)}
                      rows={3}
                      placeholder="My reading of the record suggests..."
                      className="desk-textarea"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* ── PASS 03: EVIDENCE ── */}
            {pass === 2 && (
              <section className="pass-panel">
                <div className="panel-intro">
                  <ShieldCheck size={20} />
                  <div>
                    <h2>Pass 03 &middot; Field Evidence Dossier</h2>
                    <p>Frame proposed claims, documented evidence, counterarguments, anomalies, theories, and sources.</p>
                  </div>
                </div>

                {/* Non-blocking evidence checklist */}
                <div className="evidence-checklist-card">
                  <span className="micro-label">CURATOR EVIDENCE CHECKLIST</span>
                  <ul>
                    <li className={draft.claim ? "done" : ""}>Proposed claim framed explicitly as claim</li>
                    <li className={draft.documentedEvidence ? "done" : ""}>Traceable historical record separated</li>
                    <li className={draft.counterargument ? "done" : ""}>Strongest counterargument acknowledged</li>
                    <li className={draft.anomaly ? "done" : ""}>Unresolved anomaly highlighted</li>
                    <li className={draft.theory ? "done" : ""}>Theory labelled clearly as interpretation</li>
                    <li className={draft.sources.length > 0 ? "done" : ""}>Sources real and inspectable</li>
                  </ul>
                </div>

                {/* 5 Evidence Fields Cards */}
                <div className="evidence-fields-stack">
                  <div className="evidence-input-card card-claim">
                    <label>01 / Proposed Claim</label>
                    <textarea
                      value={draft.claim}
                      onChange={(e) => patch("claim", e.target.value)}
                      rows={2}
                      placeholder="What is alleged or proposed..."
                      className="desk-textarea"
                    />
                  </div>

                  <div className="evidence-input-card card-record">
                    <label>02 / Documented Record Evidence</label>
                    <textarea
                      value={draft.documentedEvidence}
                      onChange={(e) => patch("documentedEvidence", e.target.value)}
                      rows={2}
                      placeholder="What can be traced in physical or text records..."
                      className="desk-textarea"
                    />
                  </div>

                  <div className="evidence-input-card card-counter">
                    <label>03 / Counterargument</label>
                    <textarea
                      value={draft.counterargument}
                      onChange={(e) => patch("counterargument", e.target.value)}
                      rows={2}
                      placeholder="The strongest credible alternative explanation..."
                      className="desk-textarea"
                    />
                  </div>

                  <div className="evidence-input-card card-anomaly">
                    <label>04 / Unresolved Anomaly</label>
                    <textarea
                      value={draft.anomaly}
                      onChange={(e) => patch("anomaly", e.target.value)}
                      rows={2}
                      placeholder="What remains incomplete, unusual, or unexplained..."
                      className="desk-textarea"
                    />
                  </div>

                  <div className="evidence-input-card card-theory">
                    <label>05 / Curator Theory &amp; Interpretation</label>
                    <textarea
                      value={draft.theory}
                      onChange={(e) => patch("theory", e.target.value)}
                      rows={2}
                      placeholder="Possible interpretation (explicitly marked as interpretation)..."
                      className="desk-textarea"
                    />
                  </div>
                </div>

                {/* Sources Cards Builder */}
                <div className="sources-section">
                  <div className="section-title-row">
                    <h3>Documented Source Cards</h3>
                    <button type="button" className="desk-btn primary-sm" onClick={addSource}>
                      <Plus size={13} /> Add source card
                    </button>
                  </div>

                  {draft.sources.length === 0 && (
                    <div className="empty-sources-notice">
                      No sources added yet. Click &ldquo;Add source card&rdquo; to include citations.
                    </div>
                  )}

                  {draft.sources.map((src, i) => (
                    <div key={src.id} className="source-card-item">
                      <div className="source-card-header">
                        <strong>Source {i + 1}: {src.label || "Untitled Reference"}</strong>
                        <div className="source-card-actions">
                          <button type="button" onClick={() => moveSource(src.id, -1)} disabled={i === 0}>
                            <ChevronUp size={13} />
                          </button>
                          <button type="button" onClick={() => moveSource(src.id, 1)} disabled={i === draft.sources.length - 1}>
                            <ChevronDown size={13} />
                          </button>
                          <button type="button" className="danger-btn" onClick={() => removeSource(src.id)}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="form-grid">
                        <div className="form-group span-2">
                          <label>Source Label / Title *</label>
                          <input
                            type="text"
                            value={src.label}
                            onChange={(e) => updateSource(src.id, { label: e.target.value })}
                            placeholder="John Anthony West — Serpent in the Sky"
                            className="desk-input"
                          />
                        </div>

                        <div className="form-group span-2">
                          <label>Public Source URL</label>
                          <input
                            type="url"
                            value={src.url}
                            onChange={(e) => updateSource(src.id, { url: e.target.value })}
                            placeholder="https://public-record.example/article"
                            className="desk-input mono-font"
                          />
                          {!src.url && <small className="warn-hint">No URL specified (local citation)</small>}
                        </div>

                        <div className="form-group span-2">
                          <label>Why it matters (Note)</label>
                          <textarea
                            value={src.note}
                            onChange={(e) => updateSource(src.id, { note: e.target.value })}
                            rows={2}
                            placeholder="Why this source matters to the case..."
                            className="desk-textarea"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Relationship & Drive Fields */}
                <div className="form-grid" style={{ marginTop: "24px" }}>
                  <div className="form-group span-2">
                    <label>Related Case Slugs <span className="hint">Comma-separated article slugs</span></label>
                    <input
                      type="text"
                      value={draft.relatedCaseSlugs}
                      onChange={(e) => patch("relatedCaseSlugs", e.target.value)}
                      placeholder="the-dendera-light, orion-on-the-ground"
                      className="desk-input mono-font"
                    />
                  </div>

                  <div className="form-group span-2">
                    <label>Relationship Note</label>
                    <input
                      type="text"
                      value={draft.relationNote}
                      onChange={(e) => patch("relationNote", e.target.value)}
                      placeholder="Explains what connecting these records teaches the reader..."
                      className="desk-input"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* ── PASS 04: SHAPE & RELEASE ── */}
            {pass === 3 && (
              <section className="pass-panel">
                <div className="panel-intro">
                  <Sparkles size={20} />
                  <div>
                    <h2>Pass 04 &middot; Shape &amp; Export JSON</h2>
                    <p>Customize visual styling, paper palettes, symbols, sticky notes, stamps, and generate your exportable JSON.</p>
                  </div>
                </div>

                {/* Typography Selector */}
                <div className="selector-block">
                  <div className="selector-header">
                    <label>Type Library (50 Curated Fonts)</label>
                    <div className="font-search-box">
                      <Search size={13} />
                      <input
                        type="text"
                        value={fontSearch}
                        onChange={(e) => setFontSearch(e.target.value)}
                        placeholder="Search fonts..."
                      />
                    </div>
                  </div>

                  <div className="font-grid-selector">
                    {filteredFonts.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        className={`font-choice-card ${draft.fontId === f.id ? "selected" : ""}`}
                        onClick={() => patch("fontId", f.id)}
                      >
                        <span className="font-name-sample" style={{ fontFamily: f.value }}>
                          {f.label.split(" · ")[0]}
                        </span>
                        <small>{f.label.split(" · ")[1] || "font"}</small>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Paper Palette Selector */}
                <div className="selector-block">
                  <label>Paper Palette &amp; Wash</label>
                  <div className="palette-grid-selector">
                    {PALETTES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className={`palette-choice-card ${draft.paletteId === p.id ? "selected" : ""}`}
                        style={{ backgroundColor: p.value }}
                        onClick={() => patch("paletteId", p.id)}
                      >
                        <span className="palette-swatch-dot" />
                        <strong>{p.label}</strong>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Symbols & Vector Marks */}
                <div className="selector-block">
                  <label>Symbol Mark &amp; Vector Trace</label>
                  <div className="symbol-grid-selector">
                    {SYMBOLS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`symbol-choice-card ${draft.symbol === s.id ? "selected" : ""}`}
                        onClick={() => patch("symbol", s.id)}
                      >
                        <span className="symbol-icon">{s.value}</span>
                        <small>{s.label.split(" · ")[1]}</small>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sticker Motif Selector */}
                <div className="selector-block">
                  <label>Sticker Motif</label>
                  <div className="sticker-grid-selector">
                    {STICKER_MOTIFS.map((sm) => (
                      <button
                        key={sm.id}
                        type="button"
                        className={`sticker-choice-card ${draft.stickerMotif === sm.id ? "selected" : ""}`}
                        onClick={() => patch("stickerMotif", sm.id)}
                      >
                        <strong>{sm.label}</strong>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sticky Note Controls */}
                <div className="selector-block">
                  <label>Curator Sticky Note Annotation</label>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Note Title</label>
                      <input
                        type="text"
                        value={draft.stickyTitle}
                        onChange={(e) => patch("stickyTitle", e.target.value)}
                        placeholder="Margin note"
                        className="desk-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Treatment</label>
                      <select
                        value={draft.stickyTreatment}
                        onChange={(e) => patch("stickyTreatment", e.target.value as FullDraftState["stickyTreatment"])}
                        className="desk-select"
                      >
                        {STICKY_TREATMENTS.map((st) => (
                          <option key={st.id} value={st.value}>{st.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Placement</label>
                      <select
                        value={draft.stickyPlacement}
                        onChange={(e) => patch("stickyPlacement", e.target.value as FullDraftState["stickyPlacement"])}
                        className="desk-select"
                      >
                        {STICKY_PLACEMENTS.map((sp) => (
                          <option key={sp.id} value={sp.value}>{sp.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group span-2">
                      <label>Note Body</label>
                      <textarea
                        value={draft.stickyBody}
                        onChange={(e) => patch("stickyBody", e.target.value)}
                        rows={2}
                        placeholder="Short curator annotation text..."
                        className="desk-textarea"
                      />
                    </div>
                  </div>
                </div>

                {/* Stamp Selector */}
                <div className="selector-block">
                  <label>Editorial Stamp Treatment</label>
                  <div className="stamp-grid-selector">
                    {STAMP_KINDS.map((sk) => (
                      <button
                        key={sk.id}
                        type="button"
                        className={`stamp-choice-card ${draft.stampKind === sk.value || (sk.id === "auto" && draft.stampKind === "auto") ? "selected" : ""}`}
                        onClick={() => patch("stampKind", sk.id as FullDraftState["stampKind"])}
                      >
                        <strong>{sk.label}</strong>
                      </button>
                    ))}
                  </div>
                </div>

                {/* EXPORT & JSON OUTPUT PANEL */}
                <div className="export-output-card" id="export-section">
                  <div className="export-header-row">
                    <div>
                      <span className="micro-label">GENERATED JSON OUTPUT</span>
                      <h3>Ready to Export &amp; Deploy</h3>
                    </div>

                    <div className="export-mode-toggle">
                      <button
                        type="button"
                        className={exportMode === "public" ? "active" : ""}
                        onClick={() => setExportMode("public")}
                      >
                        Public-compatible Schema
                      </button>
                      <button
                        type="button"
                        className={exportMode === "extended" ? "active" : ""}
                        onClick={() => setExportMode("extended")}
                      >
                        Extended Case-File Schema
                      </button>
                    </div>
                  </div>

                  {/* Validation errors banner */}
                  {validationErrors.length > 0 && (
                    <div className="validation-error-banner">
                      <strong>Validation Warnings ({validationErrors.length}):</strong>
                      <ul>
                        {validationErrors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* JSON syntax text block */}
                  <div className="json-textarea-wrap">
                    <textarea
                      id="om-json-textarea"
                      readOnly
                      value={jsonOutput}
                      rows={22}
                      className="json-code-textarea"
                      spellCheck={false}
                    />
                  </div>

                  {/* Copy & Download Actions */}
                  <div className="export-actions-row">
                    <button
                      type="button"
                      className={`desk-btn primary ${copyStatus === "json" ? "copied" : ""}`}
                      onClick={handleCopyJson}
                    >
                      {copyStatus === "json" ? <Check size={15} /> : <Copy size={15} />}
                      {copyStatus === "json" ? "JSON Copied!" : "Copy JSON"}
                    </button>

                    <button type="button" className="desk-btn secondary" onClick={handleDownloadJson}>
                      <Download size={15} /> Download JSON file
                    </button>

                    <button
                      type="button"
                      className={`desk-btn secondary ${copyStatus === "object" ? "copied" : ""}`}
                      onClick={handleCopyObjectOnly}
                    >
                      {copyStatus === "object" ? <Check size={15} /> : <Copy size={15} />}
                      {copyStatus === "object" ? "Object Copied!" : "Copy article object"}
                    </button>
                  </div>

                  <div className="paste-hint-box">
                    <p>
                      <strong>Where to paste:</strong> Paste this object inside the <code>&quot;articles&quot;: [...]</code> array in <code>client/src/data/articles.json</code>. Add a comma after the previous item if needed.
                    </p>
                  </div>
                </div>

                {/* 10-Step Guide Section */}
                <div className="vs-code-guide-card">
                  <h3>How to Export a Case into VS Code</h3>
                  <ol>
                    <li>Complete all four passes in the editor above.</li>
                    <li>Click <strong>Copy JSON</strong> or <strong>Copy article object</strong>.</li>
                    <li>Open <code>client/src/data/articles.json</code> in VS Code.</li>
                    <li>Find the <code>&quot;articles&quot;: [ ... ]</code> array.</li>
                    <li>Paste the copied JSON object as a new item inside the array.</li>
                    <li>Add a comma after the previous object if required by JSON syntax.</li>
                    <li>Run <code>pnpm check</code> in terminal to verify TypeScript correctness.</li>
                    <li>Run <code>pnpm dev</code> to preview the new case file in your browser.</li>
                    <li>Commit <code>articles.json</code> to your Git repository.</li>
                    <li>Push to GitHub for Vercel to rebuild and publish!</li>
                  </ol>
                </div>
              </section>
            )}
          </main>

          {/* Side-by-side Live Preview Panel (Desktop split-view) */}
          {showPreview && <LiveReaderPreviewPanel draft={draft} onClose={() => setShowPreview(false)} />}
        </div>

        {/* Persistent Release Bar (Bottom of Workspace) */}
        <footer className="om-release-bar">
          <div className="release-bar-info">
            <span>Pass {pass + 1} of 4 &middot; {PASS_NAMES[pass]}</span>
            <small>{draft.title ? `"${draft.title}"` : "Untitled Case File"}</small>
          </div>

          <div className="release-bar-actions">
            <button
              type="button"
              className="desk-btn secondary"
              onClick={() => setPass((p) => Math.max(0, p - 1))}
              disabled={pass === 0}
            >
              <ArrowLeft size={14} /> Back
            </button>

            <button type="button" className="desk-btn secondary" onClick={() => setShowPreview((v) => !v)}>
              <Eye size={14} /> {showPreview ? "Hide preview" : "Reader preview"}
            </button>

            {pass < 3 ? (
              <button type="button" className="desk-btn primary" onClick={() => setPass((p) => p + 1)}>
                Next pass <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                className={`desk-btn primary ${copyStatus === "json" ? "copied" : ""}`}
                onClick={handleCopyJson}
              >
                {copyStatus === "json" ? <Check size={14} /> : <Copy size={14} />}
                {copyStatus === "json" ? "JSON Copied!" : "Publish & Copy JSON"}
              </button>
            )}
          </div>
        </footer>
      </div>

      {/* Help Modal Guide */}
      {showHelpGuide && (
        <div className="help-modal-backdrop" onClick={() => setShowHelpGuide(false)}>
          <div className="help-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>How to Use Om&rsquo;s Curator Desk</h2>
            <p>
              This is an in-browser archaeological field desk for drafting ancient research cases without requiring a database or server.
            </p>
            <ul>
              <li><strong>Pass 01 &middot; Identify:</strong> Set title, slug, shelf, date, evidence level, and coordinates.</li>
              <li><strong>Pass 02 &middot; Write:</strong> Add ordered sections, headings, paragraphs, and Om&rsquo;s curator reading.</li>
              <li><strong>Pass 03 &middot; Evidence:</strong> Separate proposed claims, documented record, counterarguments, anomalies, and source cards.</li>
              <li><strong>Pass 04 &middot; Shape:</strong> Select from 50 fonts, paper washes, symbols, sticky notes, and export JSON.</li>
            </ul>
            <button type="button" className="desk-btn primary" onClick={() => setShowHelpGuide(false)}>
              Got it, close guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
