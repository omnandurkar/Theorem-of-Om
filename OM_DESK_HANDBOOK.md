# How to Use Om’s Desk

**Theorem of Kemet** is Om Nandurkar’s private field desk for building evidence-aware case files. This handbook is the canonical operating guide for the desk. It must be updated whenever a feature changes how Om writes, previews, saves, publishes, or manages a case.

> **Working rule:** create a useful record first. Decoration, stamps, map pins, and linked cases should clarify the record, never replace it.

## Quick Start: A Case in Four Passes

| Pass | What Om does | Minimum useful result |
|---|---|---|
| **1. Identify** | Gives the question a title, case number, shelf, status, place, and era. | A reader can tell what the file is about and where it belongs. |
| **2. Write** | Adds the short case summary, long-form reading, and Om’s personal take. | The question is understandable without the design layer. |
| **3. Evidence** | Separates claim, documented record, counterargument, anomaly, and theory; then adds real sources or a Drive image if relevant. | The reader can see what is known, contested, and still uncertain. |
| **4. Shape & release** | Selects the paper treatment, margin note, stamp, and optional related cases. | The finished reader experience supports the evidence instead of distracting from it. |

## Curator Entry: The Antechamber Puzzle

The public journal no longer relies on a Manus sign-in for Om’s desk. Open **Om’s Desk** to enter the antechamber, then select the four relics in the intended order. A correct sequence is verified by the server and opens a seven-day, httpOnly curator session. The relics are an atmospheric entry ritual, not a replacement for server-side access control.

| Need | What to do |
|---|---|
| **Open the desk by puzzle** | Select the Djed pillar, Eye of Horus, Ankh, then Scarab. An incorrect order resets the tablet without exposing a password. |
| **Use the password instead** | Press **⌘ K** on macOS or **Ctrl K** elsewhere. Type the curator password into the private override panel. The password is checked only on the server. |
| **Change the password** | After entry, use **Change password** in the lower part of Om’s desk sidebar. Enter the current password and a new password of at least eight characters. Store the new key safely: the desk cannot display it again. |
| **Lock the desk** | Use **Lock desk** in the same panel when stepping away. This ends the current curator session and returns to the puzzle. |

> **Security note:** The initial password is a server secret. It is never placed in the frontend source, local storage, or the puzzle markup. The first successful password entry stores a salted server-side hash; later password changes update that hash. The legacy local Archive Room is not an access-control surface.

### Managing Multiple Puzzles

Open **Om’s Desk → Antechamber** to reach the protected **Antechamber Workshop**. It holds saved puzzle presets; exactly **one active preset** controls the public curator entry at a time. A preset uses four different relics so the tablet stays legible on desktop and mobile.

| Control | What Om can change | What the public sees | Important rule |
|---|---|---|---|
| **Internal name** | A private shelf label such as “Horizon riddle.” | Nothing. | Use a name that makes the puzzle easy to find later. |
| **Public title** | The large antechamber heading. | Yes. | Keep it short and atmospheric. |
| **Public instruction** | The line below the title. | Yes. | Explain the task, not the answer. |
| **Field clue** | An optional poetic hint. | Yes. | Make it solvable but never reveal the sequence verbatim. |
| **Relics on the public tablet** | The four buttons shown to visitors. | Yes. | Every relic must appear once. |
| **Private answer order** | The required click order. | **No.** | Use the same four relics, each once. It is verified only on the server. |

To make a new challenge, select **New puzzle**, write the public copy, compose the two relic boards, and press **Save puzzle**. Saved puzzles remain inactive until Om presses **Activate**. Activation changes the antechamber immediately for signed-out visitors but does not interrupt Om’s existing desk session. Use **Edit** to revise a saved preset; edits to the active preset also take effect immediately. An active preset cannot be retired—activate another saved puzzle first.

#### Using the Visual Relic Board

The workshop now has a **Relic Catalogue**, a **Public Relic Tablet**, a **Private Answer Path**, and a **Live Public Preview**. Drag a catalogue relic onto any board slot to place it. Drag a tile within either board to swap positions. For keyboard, touch, or precision-device use, select a catalogue relic and then click or tap the target slot; the board makes the same move without drag and drop. The private path is deliberately absent from the preview.

When the two boards contain the same four unique relics, the workshop displays **Both tablets agree**. If Om introduces a relic that does not appear on the public tablet, the save control stops and states what needs correcting. The live preview updates with the public title, instruction, clue, and tablet immediately, so Om can assess clarity before saving or activating.

> **Safe testing ritual:** save the draft, activate it, then open Om’s Desk in a private/incognito window and solve it as a visitor. If it is too difficult, press **⌘ K** or **Ctrl K** and use the curator password override to regain the desk. Do not depend on the puzzle alone as an emergency recovery method.

## The Release Bar

The **release bar stays available on every pass**. Om does not need to finish all four passes before preserving work.

| Control | Use it when | Result |
|---|---|---|
| **Save draft** | The record has reached a useful stopping point but needs more work. | Saves privately; public readers cannot see it. |
| **Publish now** | The title, URL, summary, and body are ready for public reading. | Makes the case public immediately. |
| **Open reader preview** | Om wants to assess the current draft before saving or publishing. | Opens a separate private preview tab; it never publishes the draft. |
| **Plan release** | Shown in the presentation panel as a future control. | Scheduled publishing is not active yet; save a draft or publish immediately for now. |

## What Is Required Before Publishing

The desk enables saving when the **record title**, **reader URL**, **summary**, and **long-form body** are present. Om should also confirm that public claims are framed as claims, that the record distinguishes fact from interpretation, and that citations are real paths a reader can follow.

## Evidence and Sources

The **Evidence** pass has five separate fields. Do not merge them. The claim describes what is alleged; the documented record states what can be traced; the counterargument gives the strongest credible alternative; the anomaly identifies what remains incomplete; and theory labels possible readings as interpretations.

Add a source card only when there is a real external reference. Use **Why it matters** to write Om’s curator context. Public readers can expand that note before leaving the journal.

### Close Inspection and Evidence Relationships

When a published record includes an inline Drive evidence print, readers can use **Inspect field print** to open a close-inspection table. The image stays an image, not proof: the control helps readers examine visual details while the evidence board and source trail preserve the distinction between observation, claim, counterargument, and interpretation. The inspection table supports zoom in, zoom out, reset, close, pointer-based detail positioning, touch-safe controls, and Escape to close.

The public evidence board now shows a compact live context strip when Om has filed sources or related cases. It exposes the number of source threads, links to up to two real external references, and notes the number of connected cases. These are navigation and context cues; they must never imply that proximity establishes causation.

### Ordering the Source Trail

After adding valid reference cards in **Pass 03**, open **Pass 04 → Material & Mark Previews** to find the **Source order** desk. The first source card becomes the reader’s first path through the reference trail. Drag a card to another slot or use its up/down controls; use the latter whenever keyboard or precise touch control is more comfortable. The selected order is stored with the case when Om chooses **Save draft** or **Publish now**.

> **Source-order rule:** put the clearest primary record or orientation source first, then supporting, counter, and contextual material. A visually impressive source should not outrank a more useful or verifiable one merely because it looks better.

## Visual Composition

The **Shape & release** pass contains the reader-facing treatment. Om can select fonts, paper wash, symbol, vector mark, sticker motif, margin-note hardware, and an editorial stamp. Use the live reader paper and separate preview tab before release.

Notebook marks use the toolbar to apply a pastel highlighter, pencil underline, hand-drawn circle, or scratch. Keep the marks sparse enough that a reader can still select and read the text underneath.

## Optional Discovery Details

Add an **era**, **latitude**, and **longitude** only when they can be responsibly identified. Published cases with both coordinates become pins on the public investigation map. Related-case slugs and the relationship note are optional; use them only when the connection teaches the reader something.

## Reader Letters, Shelves, and the Public Archive

Reader suggestions arrive privately in **Overview → Reader Letters**. Om may mark them received, read, or archived, then turn a promising idea into a new case manually. **Shelves** organize public browsing; add a clear shelf name and a short description. The Journal and Case Index automatically paginate as the archive grows.

## Interface Preferences

The normal **system cursor is the default**. On a desktop or laptop with a fine pointer, use the pointer control in the site header to enable or disable Om’s animated field cursor. The choice is remembered in that browser. The setting is intentionally absent on touch-first screens, where it has no practical effect.

The editor’s **Symbol & circle marks** selector contains Kemet motifs alongside related historic and celestial signs. Add a mark only when it supports the case’s visual language; symbols are atmospheric treatments, not evidence.

## Field Folio Reader

The public **Field Folio** is a short comparison instrument for readers who want to orient themselves before committing to a complete case file. It is available from **Om’s Favourites** on the home page. Each leaf pairs the case’s core question and opening evidence with its record image, then links directly to the complete article.

Readers can use the leaf index, **Previous leaf**, **Next leaf**, or their left and right arrow keys to compare the curated records. **Inspect evidence** activates a movable inspection lens on desktop; on touch-first screens it opens a focused zoomed detail view instead. The normal reader preference control remains available, including the local quiet-motion setting.

> **Editorial use:** treat the folio as an invitation to the full record, not as a summary that replaces context, sources, or counterarguments. Keep its curated selection small and link every leaf to a complete published article.

## Usability Audit Record

The detailed role-based review is maintained in [UX_AUDIT_2026-08-26.md](./UX_AUDIT_2026-08-26.md). The substantive record is also summarized here so the handbook remains Om’s complete operational reference.

> **Audit boundary, 26 August 2026:** public and returning-reader journeys were manually exercised without submitting a theory letter, publishing content, opening external sources, or changing saved state. Om’s protected desk was reviewed non-destructively from its implemented workflow and safe preview fallback. The former external authentication flow was not scored and has since been replaced by the curator antechamber puzzle.

### What Worked in the Reader Journey

The home page, archive, Field Guide, Signal Board, and theory-letter route consistently frame uncertainty as inquiry rather than proof. Archive search returned the expected Orion record immediately. The Field Guide is the clearest expression of the journal’s editorial standard. The reader desk makes text scale, ink surface, and quiet-motion preferences local and reversible. The theory-letter route is concise, private, and correctly keeps Om as the only publisher.

### Usability and Accessibility Findings

| Priority | Role | Friction or challenge observed | Recommended correction |
|---:|---|---|---|
| **1** | Returning reader | The persistent header search did not visibly route or focus a search field from the Field Guide. | Route it to `/archive` and focus the archive search input, or hide it where it cannot act. |
| **2** | Om author | Publishing is gated by title, URL, summary, and body, but not accompanied by a final evidence and uncertainty reminder. | Add a non-blocking release checklist for source path, counterargument, and claim framing. |
| **3** | First-time reader | The home’s atmospheric opening sequence delays the first usable action. | Keep the mood but offer a visible skip or shorten repeat visits. |
| **4** | First-time reader | Journal, Case Index, and Archive have overlapping labels before their differences are taught. | Add short explanatory labels: essays, research files, and all records. |
| **5** | Returning reader | The save-record action did not visibly confirm success. | Toggle to a saved state and announce “Saved on this device.” |
| **6** | Returning reader | Reader preferences overlap the article heading in the tested desktop viewport. | Re-anchor the panel below the heading or add a compact close control. |
| **7** | First-time reader | Signal Board offers many filters before guiding readers toward a first choice. | Add a quiet “Start with evidence mode” or “Browse by question type” cue. |
| **8** | First-time reader | “Pull to desk” does not reveal that it opens an on-page evidence note. | Retain the tone, but pair it with “Open evidence note.” |
| **9** | Returning reader | Empty Journal, Index, and Map states show several controls but no high-momentum next action. | Link to a real featured sample, a field-guide example, or the archive. Do not fabricate a case. |
| **10** | Om author | Returning to a particular case or converting a reader letter will become slower as content grows. | Add case search/status filters and a confirmation-based “Start a draft from this letter” action. |

### Accessibility Notes

The reviewed pages provide clear textual framing for evidence modes, no-account letter submission, and the distinction between public and Om-only controls. Reader preferences are labelled, and the experience includes a quiet-motion control. The main accessibility considerations are **motion interruption** on the opening sequence, **focus destination** when global search is activated, clear confirmation for local save state, and avoiding overlay panels that obscure the reading context. These should be rechecked on keyboard-only and mobile touch journeys after any affected change.

### Improvement Order

Start by repairing the global search behavior, then add an evidence-aware pre-publish checklist. Next, strengthen empty states with a real route forward and improve the home-page and navigation orientation. Finally, add author tools for case retrieval and reader-letter conversion. These changes support clarity without changing Theorem of Kemet’s editorial character.

### Audit Improvements Delivered — 26 August 2026

Every issue identified in the audit’s immediate implementation scope has now been addressed. The header search routes to the archive and focuses the search field; repeat readers see a shortened opening ritual; the home and Signal Board provide clearer starting cues; empty Journal, Case Index, and map states now offer real next actions without inventing content; and the map avoids loading a live canvas until Om has filed a valid pin.

Reader controls now include an explicit close action and float away from the article text. Saving a record produces a durable local saved state and an accessible confirmation. Om’s desk now includes a visible evidence review, a searchable draft/published case finder, a safe **Start a draft** action for reader letters, and a protected in-app desk guide at `/om-guide`. None of these improvements automatically publish content or alter a reader letter.

## Maintenance Log

| Date | Update |
|---|---|
| **2026-08-25** | Created this canonical handbook and added in-product quick guidance for the four-pass case-file workflow. |
| **2026-08-25** | Added persistent draft/publish controls, live reader preview, notebook marks, evidence/source inspection, Drive Polaroids, stamps, map pins, filters, reader letters, and archive pagination to the documented workflow. |
| **2026-08-25** | Refined home-page motion so only major image surfaces and image collages use scroll parallax; decorative layers and readable copy remain anchored and text-safe. |
| **2026-08-25** | Made the normal cursor the default, added a remembered desktop custom-cursor control, and expanded the editor’s ancient-symbol library with Kemet, solar, animal, and celestial motifs. |
| **2026-08-26** | Completed a role-based usability audit of public reader routes, returning-reader controls, and the protected Om workflow structure. Added `UX_AUDIT_2026-08-26.md` with documented friction, limitations, and a prioritized improvement order. |
| **2026-08-26** | Implemented the full audit remediation set: reliable archive search/focus, repeat-visit opening reduction, clearer reader entry cues, stronger empty states, lighter zero-pin map behavior, durable reader saves, text-safe reader controls, an evidence-review release checklist, case retrieval, reader-letter drafting, and an in-app Om desk guide. |
| **2026-08-26** | Replaced curator-facing Manus OAuth access with a server-backed antechamber puzzle, a ⌘/Ctrl + K password override, signed httpOnly curator sessions, a desk lock, and authenticated password changes. The static puzzle is atmospheric; all privileged data procedures require the verified curator session. |
| **2026-08-26** | Added a persistent Antechamber Workshop for Om to save, edit, activate, and retire multiple four-relic puzzle presets. The active preset’s public title, instruction, clue, and relic tablet now render from Om’s configuration; answer orders remain curator-only and server-verified. |
| **2026-08-26** | Rebuilt the Antechamber Workshop as a visual relic board with drag-and-drop placement/reordering, a click-to-place fallback for keyboard and touch, selected-relic feedback, board-validity feedback, and a live public antechamber preview. |
| **2026-08-27** | Added an original public Field Folio reader: readers can compare Om’s curated core records with a leaf index, keyboard and button navigation, evidence inspection, full-record links, mobile detail zoom, and reduced-motion safeguards. |
| **2026-08-27** | Added a three-part evidence-workflow upgrade: close inspection for inline Drive prints, real source and related-case context on public evidence boards, and an accessible drag-or-button source-order desk that persists order through the normal case save workflow. |
| **2026-08-28** | Moved the journal to an independent Drizzle + Supabase PostgreSQL foundation, removed managed runtime/OAuth/storage dependencies, localized the core visual asset set, and prepared the Express/tRPC application for Vercel without changing Om’s curator workflow. |

## Update Protocol

When the desk changes, update this handbook in the same project change set. Add a dated entry to the **Maintenance Log**, revise the affected section, and change the in-product quick guide if the authoring sequence changes. This keeps Om’s desk understandable even as its capabilities grow.
