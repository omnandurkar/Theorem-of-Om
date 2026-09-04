# Antigravity Build Prompt — Theorem of Kemet JSON Case-File Editor

Copy everything inside the block below into Antigravity as the implementation brief. The goal is to rebuild the missing curator editor as a standalone browser tool that visually matches the existing Theorem of Kemet site and exports valid JSON instead of saving to a database.

---

## MASTER PROMPT

You are rebuilding the **private curator editor for Theorem of Kemet**, an immersive Ancient Egypt field journal created and curated by **Om Nandurkar**. The public site already exists as a React 19 + Vite + TypeScript + Tailwind 4 application. Do not redesign the public website. Build a new editor route that preserves its existing visual language and produces a JSON article object that can be copied into:

```text
client/src/data/articles.json
```

The editor must work entirely in the browser. It must not require a database, API, authentication service, server, Supabase, Express, tRPC, Drizzle, OAuth, or environment variables. Its main output is a valid article JSON object shown below the editor with a **Copy JSON** button, a **Download JSON** button, and a **Copy article object** button. The user will paste the object into the `articles` array in VS Code and rebuild the static site.

### Non-negotiable product principles

The editor is a serious field desk, not a generic CMS. It should feel like a beautifully organised archaeological worktable: papyrus, graphite, faded ink, brass pins, index labels, paper slips, source cards, imperfect annotations, and restrained motion. Maintain excellent readability. Decorative overlap is allowed only when it never obscures form labels, input content, buttons, or explanatory text.

Preserve the existing Theorem of Kemet visual system: deep papyrus green and midnight ink surfaces, limestone and warm paper panels, muted lapis blue, oxidised teal, brass, faded coral, editorial serif display typography, compact monospaced micro-labels, archival borders, torn-paper edges, small shadows, hand-drawn marks, and subtle field-station details. Use Framer Motion for restrained transitions and CSS for simple interactions. Respect `prefers-reduced-motion`.

The editor must be responsive at desktop, tablet, and mobile widths. At desktop it uses a persistent left desk rail and a central composition workspace. On mobile the rail becomes a compact progress header, the form becomes a single column, and the live reader preview becomes a full-screen or bottom-sheet panel.

### Route and layout

Create a route such as `/om-editor` or `/om-dashboard/editor`. The route should open with the same curator puzzle gate used by Theorem of Kemet if the existing application already provides one. In a static build, the gate is only an editorial convenience and must not be described as server-grade security.

The editor shell must contain:

1. A narrow Om desk rail with the OM mark, “THEOREM OF KEMET”, the current case title, four numbered passes, completion indicators, and links to `Public journal`, `Open reader preview`, `How to use the desk`, and `Export JSON`.
2. A top desk bar showing `OM’S PERMANENT FIELD DESK`, the current draft status, a dirty/unsaved indicator, and buttons for `Save locally`, `Reset draft`, `Preview`, and `Export JSON`.
3. A central staged editor with four clearly labelled passes.
4. A persistent release bar at the bottom of the workspace. It must remain visible on every pass and contain `Save local draft`, `Open reader preview`, `Plan release — coming soon`, `Publish JSON`, and `Copy JSON`.
5. A live preview panel that can be opened beside the editor on desktop and as a drawer or modal on mobile.
6. A JSON output panel below or beside the editor. It should update live, be syntax-highlighted, show validation errors, and offer copy/download controls.

### Four-pass workflow

Use the following exact workflow. Each pass must have a short explanation, a completion percentage or checklist, a clear “Next pass” button, and a “Back” button. Never hide the release bar.

#### Pass 01 — Identify

Purpose: make the record understandable before decoration.

Fields:

- `title`: required, 4–140 characters. Main public title.
- `slug`: required, lowercase URL-safe identifier. Auto-suggest from title but allow manual editing. Validate uniqueness against imported existing article slugs if available.
- `eyebrow`: optional compact label such as `CASE FILE 004 · GIZA PLATEAU`.
- `caseNumber`: optional label such as `CASE 004`.
- `category`: required shelf name. Select from existing categories or create a new local category.
- `date`: required display date, for example `12 AUG 2026`.
- `readTime`: required display value, for example `11 min read`.
- `caseStatus`: one of `documented`, `disputed`, `unverified`, `ongoing`, `unresolved`.
- `evidenceLevel`: integer from 0 to 100 with a visual slider and numeric input.
- `evidenceMode`: short label such as `Material record`, `Cultural myth`, `Celestial reading`, or `Archive fragment`.
- `location`: optional place label such as `Giza Plateau`.
- `era`: optional period label such as `Old Kingdom`.
- `mapLatitude`: optional decimal latitude.
- `mapLongitude`: optional decimal longitude.
- `keyQuestion`: required editorial question. This should be a question, not a conclusion.
- `summary` or `excerpt`: required two-to-four sentence public summary.
- `image`: optional public image URL. Support local public paths such as `/assets/kemet-hero.jpg`, ordinary image URLs, and Google Drive links that can be transformed by the existing Drive image helper.
- `imageCaption`: optional caption.

Include an “orientation card” explaining that coordinates should only be entered when responsibly identifiable and that a map pin represents a contextual location, not proof of a claim.

#### Pass 02 — Write

Purpose: create the long-form record.

Provide an ordered section builder. The curator can add, delete, duplicate, reorder, and collapse sections. Each section has:

- `label`: compact section marker such as `I. THE QUESTION`.
- `heading`: section heading.
- `paragraphs`: ordered paragraph list, with add/remove/reorder controls.
- `pullQuote`: optional pull quote.

Provide writing controls that are useful but do not change the exported content unexpectedly:

- word count and reading-time estimate;
- clear paragraph button;
- duplicate section;
- move section up/down;
- focus mode for the active section;
- preview section;
- keyboard shortcuts for adding a paragraph and moving between sections.

The editor must preserve paragraph breaks exactly in the JSON array. Do not export a single HTML blob. Export plain text arrays so the public reader can style the content safely.

Also include:

- `authorTake`: Om’s personal reading, clearly separated from documented evidence;
- optional `openingNote` or `fieldNote` if the existing public adapter supports it.

#### Pass 03 — Evidence

Purpose: prevent a visually persuasive article from confusing allegation with record.

Display five separate evidence cards. Do not merge them into one rich-text field:

- `claim`: what is alleged or proposed;
- `documentedEvidence`: what can be traced in the record;
- `counterargument`: the strongest credible alternative explanation;
- `anomaly`: what remains incomplete, unusual, or unresolved;
- `theory`: possible interpretation, explicitly labelled as interpretation.

Add a source-card builder with add, edit, delete, reorder, and collapse controls. Every source card must contain:

```json
{
  "label": "Human-readable source name",
  "url": "https://public-source.example/record",
  "note": "Why this source matters to the case"
}
```

Validate that source URLs are either public `http`/`https` URLs or intentionally documented local paths. Make it visually obvious when a source has no URL. Do not fabricate citations, reviews, testimonials, ratings, or sources.

Add an optional `driveSourceUrl` field and an `imageCaption` field. When a Google Drive URL is pasted, show a preview if possible and explain that the file must be publicly viewable. Do not upload files automatically.

Add optional relationship fields:

- `relatedCaseSlugs`: comma-separated or tag-based list of existing article slugs;
- `relationNote`: explain what the relationship teaches the reader and avoid implying causation merely because two records are connected.

Add optional map fields:

- `mapLatitude`;
- `mapLongitude`;
- `location`;
- `era`.

The pass should include a non-blocking evidence checklist: claim framed as claim, documented record separated, counterargument considered, anomaly acknowledged, theory labelled, sources real and inspectable, and coordinates responsibly identified.

#### Pass 04 — Shape & Release

Purpose: make the reading experience support the record.

Build live visual selectors with previews. The selector must change the live reader preview immediately and export the selected values as JSON.

##### Font selector

Create a searchable font catalogue with at least 50 named choices grouped by role. Include editorial serif, classical display, archival serif, handwritten annotation, monospaced label, and restrained sans-serif groups. The font list can use system-safe fallbacks or imported web fonts, but the preview must show the font name rendered in its own font. Each choice needs:

```json
{ "id": "cormorant", "label": "Cormorant Garamond", "role": "editorial serif", "cssValue": "Cormorant Garamond, serif" }
```

The exported article should use a stable `fontId`, not a huge CSS string. Include a fallback mapping in the public renderer.

##### Paper palette selector

Provide visible paper/wash previews. Export one of these stable palette IDs or an extensible equivalent:

- `limestone`;
- `papyrus`;
- `lapis`;
- `ink`;
- `oxblood`;
- `sage`;
- `sand`;
- `night`.

Each preview must actually use the selected background, text, line, and accent colors.

##### Symbol and circle marks

Provide a catalogue of Ancient Egyptian, celestial, archaeological, and field-note marks. Examples include Eye of Horus, Ankh, Djed, scarab, lotus, sun disk, falcon, ibis, uraeus cobra, pyramid, star cluster, orbit, hand-drawn circle, crosshair, grid, and question mark. Export a stable `symbol` and `vectorMark` ID. Symbols are decorative editorial treatment, never evidence.

##### Sticker motif selector

Provide small previews for scarab-eye, torn-label, red-thread, celestial-grid, specimen-tag, warning-triangle, moth, spider, pyramid, moon, and evidence-pin motifs. Export `stickerMotif`.

##### Sticky note controls

Add a sticky-note editor with:

- `stickyTitle`;
- `stickyBody`;
- `stickyTreatment`: `brass-pin`, `top-tape`, `crossed-tape`, or `thread-and-pin`;
- `stickyPlacement`: `margin`, `left-lean`, `right-lean`.

The preview must show the selected tape, pin, paper, rotation, and position. Keep text readable.

##### Editorial stamp selector

Provide `stampKind` options:

- `auto`;
- `top-secret`;
- `unverified`;
- `declassified`;
- `case-closed`;
- `none`.

Show the actual stamp graphic over the thumbnail and reader preview. Explain that stamps communicate editorial status, not truth or legal classification.

##### Source-ordering desk

Show the current source cards as draggable paper slips. Support drag-and-drop as well as keyboard/touch up and down controls. Save the order in the exported `sources` array. The first source should usually be the clearest orientation or primary record, not the most visually impressive link.

### Live reader preview

The preview must look like the real public reader, not a generic form preview. It should include:

- article eyebrow, case number, title, excerpt, date, category, evidence mode, and evidence meter;
- selected hero image in the adaptive Polaroid treatment;
- selected typography and palette;
- article sections and pull quotes;
- sticky note, symbol, vector mark, sticker, and stamp;
- five evidence fields with clear labels;
- sources with expandable notes;
- related cases;
- map/location metadata;
- a responsive mobile representation;
- a `Open preview in new tab` button using a serialised local draft.

Include a reduced-motion preview toggle. Do not let decorative elements overlap important text.

### JSON output contract

The primary exported object must be compatible with this current public schema:

```json
{
  "slug": "the-sphinx-and-the-forbidden-waterline",
  "eyebrow": "CASE FILE 001 · GIZA PLATEAU",
  "category": "Weathered Stone",
  "date": "12 AUG 2026",
  "readTime": "11 min read",
  "title": "The Sphinx and the forbidden waterline",
  "excerpt": "A weathered monument, a disputed chronology, and the grooves in stone that keep asking difficult questions.",
  "image": "/assets/kemet-hero.jpg",
  "tone": "night",
  "keyQuestion": "What does erosion remember when chronology refuses to listen?",
  "sources": [
    {
      "label": "Source name",
      "url": "https://example.org/public-record",
      "note": "Why this source matters"
    }
  ],
  "sections": [
    {
      "label": "I. THE QUESTION",
      "heading": "A monument built to keep a face",
      "paragraphs": [
        "First paragraph.",
        "Second paragraph."
      ],
      "pullQuote": "Stone does not answer in sentences. It answers in durations."
    }
  ]
}
```

The editor should also be able to export an **extended object** for richer public rendering. Put optional fields after the base schema, and do not remove the base fields:

```json
{
  "caseNumber": "CASE 001",
  "caseStatus": "disputed",
  "stampKind": "top-secret",
  "evidenceLevel": 58,
  "evidenceMode": "Material record",
  "location": "Giza Plateau",
  "era": "Old Kingdom",
  "mapLatitude": 29.9792,
  "mapLongitude": 31.1342,
  "imageCaption": "Field image caption",
  "fontId": "cormorant",
  "paletteId": "night",
  "symbol": "eye-of-horus",
  "vectorMark": "circle",
  "stickerMotif": "scarab-eye",
  "stickyTitle": "Margin note",
  "stickyBody": "A short curator note.",
  "stickyTreatment": "brass-pin",
  "stickyPlacement": "right-lean",
  "claim": "The allegation being examined.",
  "documentedEvidence": "The traceable record.",
  "counterargument": "The strongest credible alternative.",
  "anomaly": "What remains incomplete.",
  "theory": "A clearly labelled interpretation.",
  "authorTake": "Om’s separate reading.",
  "relatedCaseSlugs": "orion-on-the-ground",
  "relationNote": "Why the connection helps the reader.",
  "featured": false,
  "status": "draft"
}
```

The editor must provide two export modes:

1. **Public-compatible JSON:** only fields currently consumed by `client/src/data/articles.ts` and `articles.json`.
2. **Extended case-file JSON:** includes all editorial fields above for a richer adapter.

The UI must show which mode is selected. The public-compatible object must always be valid for direct insertion into the current `articles` array.

### Validation and safety

Implement validation before enabling copy/export:

- title, slug, category, date, read time, excerpt, key question, and at least one section with one paragraph are required;
- slug must be URL-safe and must not contain spaces or uppercase letters;
- evidence level must be 0–100;
- case status and stamp kind must use allowed values;
- source URLs must be valid when present;
- if only one map coordinate is entered, show an error;
- if a related slug is entered, trim whitespace and remove empty values;
- source cards must never be silently fabricated;
- no fake reviews, ratings, testimonials, or social proof may be generated;
- do not include passwords, secrets, or private tokens in exported JSON;
- clearly distinguish `draft`, `published`, and `planned` as editor metadata. Static deployment can only publish after the JSON file is updated and rebuilt.

### Local draft persistence

Use `localStorage` only for the editor workspace. Store:

```text
kemet-editor-draft
kemet-editor-draft-updated-at
kemet-editor-preferences
```

Autosave with a visible “Saved locally” indicator. Add `Reset draft` with a confirmation dialog. Never store passwords or sensitive credentials. Provide import/export of a draft JSON file so Om can move drafts between browsers.

### JSON copy workflow

When the user presses `Copy JSON`:

1. Validate the draft.
2. Format JSON with two-space indentation.
3. Copy it to the clipboard.
4. Show an accessible confirmation: `JSON copied — paste it into articles.json`.
5. Keep the output visible below the editor.

When the user presses `Download JSON`, download a file named from the slug, such as:

```text
case-the-sphinx-and-the-forbidden-waterline.json
```

When the user presses `Copy article object`, copy only the object and not the surrounding array. Also display a short insertion hint:

```text
Paste this object inside the "articles" array in client/src/data/articles.json. Add a comma after the previous object if needed.
```

### Design details to preserve

Use the existing local assets where available. The static project already contains:

- `client/public/assets/kemet-hero.jpg` — primary Egyptian temple/pyramid hero;
- `client/public/assets/kemet-pyramid-cover.jpg` — pyramid/celestial cover;
- `client/public/assets/kemet-celestial-pyramid.jpg` — celestial geometry visual;
- `client/public/assets/kemet-scroll.jpg` — papyrus/scroll visual;
- `client/public/assets/kemet-signal-object.jpg` — evidence object;
- `client/public/assets/kemet-evidence.jpg` — evidence texture/object;
- `client/public/assets/kemet-crop-survey.jpg` — survey/crop-circle visual;
- `client/public/assets/om-specimen-field-station.webp` — Om field-station specimen;
- `client/public/assets/om-field-station-stickers.webp` — sticker collection;
- `client/public/assets/kemet-sticker-motifs.webp` — motif sheet;
- `client/public/assets/kemet-mark.webp` — site/Om mark.

Reference them through `/assets/...` when running inside the Vite project. The editor should show image previews and permit external image URLs without trying to download or bundle them.

### Technical acceptance criteria

The finished editor is accepted only when all of these are true:

- it launches with `pnpm dev` inside the existing project;
- it uses TypeScript and has no type errors;
- it does not add a backend or environment-variable requirement;
- it preserves the public site’s visual language;
- every four-pass field is editable;
- the live preview changes immediately when fields change;
- the editor can create, duplicate, reorder, reset, and locally save drafts;
- the source-ordering desk works with drag-and-drop and buttons;
- the font, palette, symbol, vector, sticker, sticky-note, and stamp previews are real visual previews;
- validation blocks invalid JSON export without destroying the draft;
- `Copy JSON` produces a valid object;
- the current public-compatible JSON can be pasted into `client/src/data/articles.json` and rendered by the existing site;
- the generated JSON contains no React markup, no server calls, no secrets, no fake social proof, and no fabricated citations;
- reduced-motion users receive a calm version of the experience;
- the editor is usable by keyboard and touch.

At the end of implementation, provide a short README section called **How to export a case into VS Code** with these exact steps:

1. Open the editor.
2. Complete the four passes.
3. Click `Validate & copy JSON`.
4. Open `client/src/data/articles.json`.
5. Paste the object inside the `articles` array.
6. Add a comma where JSON requires it.
7. Run `pnpm check` and `pnpm build`.
8. Open the article route using the exported slug.
9. Commit the JSON and any referenced local assets to GitHub.
10. Let Vercel rebuild from the repository.

---

## END MASTER PROMPT

## How the exported JSON fits the current project

The current public adapter reads these base fields from `client/src/data/articles.ts`:

| Field | Required by current public schema | Meaning |
| --- | --- | --- |
| `slug` | Yes | Public route identifier |
| `eyebrow` | Yes | Compact case label |
| `category` | Yes | Journal shelf |
| `date` | Yes | Display date |
| `readTime` | Yes | Reading-time label |
| `title` | Yes | Public title |
| `excerpt` | Yes | Public summary |
| `image` | Yes | Hero/evidence image URL |
| `tone` | Yes | `night`, `paper`, or `blue` |
| `keyQuestion` | Yes | Central question |
| `sources` | Yes | Source-card array |
| `sections` | Yes | Ordered article body |

The original editor supported a richer case-file model. Antigravity should export the richer fields too, but the current adapter may need one small follow-up change to read them directly from JSON rather than applying fallback metadata in `client/src/lib/staticJournal.ts`.

## Existing asset inventory

The following assets are already in the project and should not be regenerated unless a visual refresh is desired:

| Asset | Suggested editor use |
| --- | --- |
| `/assets/kemet-hero.jpg` | Hero and Sphinx/temple record preview |
| `/assets/kemet-pyramid-cover.jpg` | Celestial/pyramid article preview |
| `/assets/kemet-celestial-pyramid.jpg` | Celestial geometry evidence |
| `/assets/kemet-scroll.jpg` | Djed/ritual technology preview |
| `/assets/kemet-signal-object.jpg` | Signal-board and anomaly card |
| `/assets/kemet-evidence.jpg` | Evidence print / inspection panel |
| `/assets/kemet-crop-survey.jpg` | Survey and anomaly material |
| `/assets/om-specimen-field-station.webp` | Om’s field-station visual |
| `/assets/om-field-station-stickers.webp` | Sticker catalogue |
| `/assets/kemet-sticker-motifs.webp` | Motif selector |
| `/assets/kemet-mark.webp` | Header mark and export branding |

## Important limitation

A browser editor can generate JSON, copy it, download it, and preserve drafts locally. It cannot directly modify `articles.json` inside a deployed Vercel site. The reliable workflow is therefore **editor → Copy JSON → paste into VS Code → run checks → commit to GitHub → Vercel rebuild**.
