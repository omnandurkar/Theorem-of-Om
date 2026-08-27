# Manual Usability Audit — Working Notes

## First-Time Reader: Home and Archive

| Journey step | Observed result | Friction or validation |
|---|---|---|
| Load the home page | The opening sequence resolves to a clear visual hero with two primary actions: **Enter the archive** and **Pull to desk**. | The first-time opening sequence adds a short wait before content becomes usable. It is atmospheric, but it temporarily hides the purpose and actions. |
| Understand the site’s purpose | The hero and the archive copy explain that the journal treats contested history as inquiry rather than verdict. | The navigation offers several overlapping labels—**Journal**, **Case Index**, and **The Archive**—before a new reader knows the difference between them. |
| Search the archive | Searching “Orion” immediately returns one matching case and updates the count. | The search works responsively and the empty-state behavior still needs a separate test. |

## Reader and Returning Reader: Case File

| Journey step | Observed result | Friction or validation |
|---|---|---|
| Open a result | The case-file hero establishes title, location, reading time, and the guiding question before the article begins. | The evidence-first premise is legible; however, source/evidence actions are not immediately visible from the initial article viewport. |
| Open Reader mode | A local reading desk exposes text-size controls, page-surface choice, and a quiet-motion setting. | The compact popover overlaps the article heading in the desktop viewport, which is usable but temporarily obscures the text it is meant to improve. |
| Select Night ink | The page surface changes visibly while the reading desk remains open. | The preference affordance is clear and responds immediately. |
| Save record | The save control accepts the action without a visible confirmation in the captured interface. | A small explicit “Saved to this device” confirmation or an active state would reduce ambiguity for a returning reader. |

## First-Time Reader: Theory Letter

| Journey step | Observed result | Friction or validation |
|---|---|---|
| Find the contribution route | The global **Submit theory** navigation is visible on public pages and leads to a focused, two-field letter form. | The entry is easy to find and correctly preserves Om as the only publisher. |
| Understand privacy and scope | The page plainly states that the form takes only a name and theory, with no account, mailing list, or public comments. | The boundaries are unusually clear and support reader trust. |
| Understand completion requirements | The form communicates a 3,000-character limit and a 20-character minimum. | The screen keeps the submit action visible, but a disabled-state explanation before the fields are valid was not tested because no letter was submitted. |

## First-Time Reader: Signal Board

| Journey step | Observed result | Friction or validation |
|---|---|---|
| Enter the anomaly index | The hero explicitly pairs imagination with a counterweight and explains the five evidence modes before readers meet the cards. | This is a strong safety and trust pattern for speculative material. |
| Filter the field board | Twelve named filters and search sit ahead of thirteen cards. | The breadth is exciting but creates a dense first decision; a short “start here” prompt could help readers who do not know which thread applies. |
| Open a card | Selecting a card brings its compact evidence summary into focus lower on the board. | The action works, but the “Pull to desk” label is poetic rather than explicit about opening an on-page evidence note; first-time readers may not predict the result. |

## Returning Reader: Case Index and Map

| Journey step | Observed result | Friction or validation |
|---|---|---|
| Open Case Index | Status filters, free-text search, era, location, credibility, map, and future-room controls are all present. | With no published database cases currently returned, the index shows a clear no-results state, but the number of controls is high relative to the empty result. |
| Follow Map Pins | The map explicitly reports zero public pins and explains that no locations are invented. | The honesty is excellent; the interactive map canvas still loads behind the empty state, adding visual weight without immediate reader value when zero pins exist. |

## Om Author: Access Boundary

| Journey step | Observed result | Friction or validation |
|---|---|---|
| Open Om’s Desk while signed out | The desk correctly protects publishing controls behind an Om-only gate and clearly offers a return to the public journal. | The secure boundary is correct. The external Manus OAuth page requires an Om account and cannot be completed during this self-contained audit without credentials. The sign-in flow itself is therefore intentionally excluded from usability scoring; the authoring experience will be assessed from the already-implemented UI structure, existing visual checks, and protected workflow code paths without writing or publishing data. |

## Om Author: Guided Case-File Workflow (Non-Destructive Review)

| Journey step | Observed result | Friction or validation |
|---|---|---|
| Orient at the case desk | The desk leads with a four-step quick guide, then a four-pass flow: Identify, Write, Evidence, Shape & release. | The mental model is coherent and matches the form order. The handbook is named as a local project file rather than exposed as a direct in-app reader route, so its usefulness depends on Om knowing where project documentation is stored. |
| Check readiness | Each pass reports **Ready** or **In progress** from concrete signals; draft/publish require title, slug, summary, and body. | The release gate protects against accidental empty publishing, but it does not require a documented record or source. This matches an open-question journal, though a soft pre-publish evidence reminder would improve editorial confidence. |
| Add evidence | Claim, documented record, counterargument, anomaly, and interpretation are separated; Drive image, source cards, and optional coordinates are grouped after the framing fields. | Strong progressive disclosure and safety framing. A first-time author may still need a clearer distinction between optional evidence cards and release requirements. |
| Shape and preview | Visual choices, annotation controls, stamp, related files, and release intent appear last. The separate preview remains private to the browser and explicitly says it never publishes. | The safe no-draft preview gives a direct return path. The local-preview behavior is clearly framed, but authors must remember to open it from the desk first. |
| Manage records, shelves, and letters | The protected desk offers overview, case files, shelves, reader-letter status changes, and confirmation dialogs before deletion. | Grouping is sensible. As an author’s archive grows, the case list would benefit from search, status filtering, or a direct “turn this reader letter into a draft” action. |

## Public Journal and Field Guide

| Journey step | Observed result | Friction or validation |
|---|---|---|
| Review the Journal | The journal explains its scope, shows clear empty-state copy, and retains filters, map access, and a link to the field guide. | With zero published records and zero shelves, readers land on an empty state after passing several controls. The empty state is honest, but a stronger single action such as **Read a sample record** would better sustain momentum. |
| Read the Field Guide | The guide clearly distinguishes source, counterweight, and slower inquiry, with a small legend for record types. | This is the best orientation page for a new reader. Consider linking it more prominently from the first home viewport, not only from the navigation and lower-page content. |
| Use header search | The header’s search button was triggered from the Field Guide, but it gave no visible immediate destination or focused field on a page without an archive search input. | This appears non-functional from a reader’s perspective outside archive pages. Route it to `/archive` and focus its search field, or hide the control where that action cannot work. |

## Evidence Collected

The public home and archive surfaces were reviewed in a desktop browser. This is a working audit log; the complete, prioritized findings will be consolidated into `OM_DESK_HANDBOOK.md` after all reader and author journeys have been tested.
