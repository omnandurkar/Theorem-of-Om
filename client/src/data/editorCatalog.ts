export type StudioOption = { id: string; label: string; value: string };

export const FONT_CATALOG: StudioOption[] = [
  ["cormorant", "Cormorant Garamond · archive display", "Cormorant Garamond, serif"], ["cinzel", "Cinzel · temple inscription", "Cinzel, serif"], ["uncial", "Uncial Antiqua · manuscript", "Uncial Antiqua, serif"], ["fell", "IM Fell English · old print", "IM Fell English, serif"], ["eb-garamond", "EB Garamond · classical folio", "EB Garamond, serif"], ["cardo", "Cardo · text edition", "Cardo, serif"], ["marcellus", "Marcellus · carved title", "Marcellus, serif"], ["spectral", "Spectral · scholarly text", "Spectral, serif"], ["lora", "Lora · field essay", "Lora, serif"], ["playfair", "Playfair Display · elegant dossier", "Playfair Display, serif"],
  ["crimson", "Crimson Text · marginalia", "Crimson Text, serif"], ["libre", "Libre Baskerville · rare book", "Libre Baskerville, serif"], ["fraunces", "Fraunces · strange heading", "Fraunces, serif"], ["bodoni", "Bodoni Moda · specimen plate", "Bodoni Moda, serif"], ["yeseva", "Yeseva One · dramatic relic", "Yeseva One, serif"], ["newsreader", "Newsreader · archive journal", "Newsreader, serif"], ["instrument", "Instrument Serif · sacred caption", "Instrument Serif, serif"], ["forum", "Forum · museum label", "Forum, serif"],
  ["nothing", "Nothing You Could Do · Om’s hand", "Nothing You Could Do, cursive"], ["caveat", "Caveat · quick annotation", "Caveat, cursive"], ["kalam", "Kalam · field handwriting", "Kalam, cursive"], ["patrick", "Patrick Hand · notebook", "Patrick Hand, cursive"], ["architect", "Architects Daughter · plan note", "Architects Daughter, cursive"], ["homemade", "Homemade Apple · personal slip", "Homemade Apple, cursive"], ["rock-salt", "Rock Salt · rough mark", "Rock Salt, cursive"], ["reenie", "Reenie Beanie · faded note", "Reenie Beanie, cursive"], ["gloria", "Gloria Hallelujah · found note", "Gloria Hallelujah, cursive"], ["special", "Special Elite · typewriter", "Special Elite, monospace"],
  ["dm-mono", "DM Mono · dossier metadata", "DM Mono, monospace"], ["space-mono", "Space Mono · signal log", "Space Mono, monospace"], ["ibm-plex", "IBM Plex Mono · lab record", "IBM Plex Mono, monospace"], ["jetbrains", "JetBrains Mono · code fragment", "JetBrains Mono, monospace"], ["courier-prime", "Courier Prime · correspondence", "Courier Prime, monospace"], ["inconsolata", "Inconsolata · index card", "Inconsolata, monospace"], ["fira-mono", "Fira Mono · survey data", "Fira Mono, monospace"], ["cutive", "Cutive Mono · catalogue", "Cutive Mono, monospace"],
  ["manrope", "Manrope · clear modern", "Manrope, sans-serif"], ["dm-sans", "DM Sans · neutral caption", "DM Sans, sans-serif"], ["work-sans", "Work Sans · research note", "Work Sans, sans-serif"], ["outfit", "Outfit · signal label", "Outfit, sans-serif"], ["raleway", "Raleway · airy legend", "Raleway, sans-serif"], ["josefin", "Josefin Sans · celestial", "Josefin Sans, sans-serif"], ["jost", "Jost · archive label", "Jost, sans-serif"], ["barlow", "Barlow · technical card", "Barlow, sans-serif"], ["rubik", "Rubik · object file", "Rubik, sans-serif"], ["sora", "Sora · future relic", "Sora, sans-serif"], ["space-grotesk", "Space Grotesk · anomaly index", "Space Grotesk, sans-serif"], ["syne", "Syne · wild heading", "Syne, sans-serif"], ["archivo", "Archivo · open case", "Archivo, sans-serif"], ["bricolage", "Bricolage Grotesque · collected evidence", "Bricolage Grotesque, sans-serif"], ["manjari", "Manjari · soft system", "Manjari, sans-serif"]
].map(([id, label, value]) => ({ id, label, value }));

export const PALETTES: StudioOption[] = [
  { id: "limestone", label: "Limestone paper", value: "#f1ead8" },
  { id: "papyrus", label: "Ancient papyrus", value: "#e8dec2" },
  { id: "lapis", label: "Lapis wash", value: "#d4e0df" },
  { id: "ink", label: "Astronomical ink", value: "#1d3434" },
  { id: "oxblood", label: "Faded oxblood", value: "#3d1f1c" },
  { id: "sage", label: "Watercolour sage", value: "#d4ddd1" },
  { id: "sand", label: "Desert sand", value: "#e6d5b8" },
  { id: "night", label: "Deep night", value: "#152625" }
];

export const SYMBOLS: StudioOption[] = [
  { id: "eye-of-horus", label: "𓂀 · Kemet eye", value: "𓂀" },
  { id: "ankh", label: "𓋹 · ankh form", value: "𓋹" },
  { id: "scarab", label: "𓆣 · scarab form", value: "𓆣" },
  { id: "serpent", label: "𓆓 · serpent form", value: "𓆓" },
  { id: "djed", label: "𓊽 · djed pillar", value: "𓊽" },
  { id: "was", label: "𓍿 · staff form", value: "𓍿" },
  { id: "sun-disc", label: "𓇳 · sun-disc form", value: "𓇳" },
  { id: "lotus", label: "𓆭 · lotus form", value: "𓆭" },
  { id: "falcon", label: "𓅃 · falcon form", value: "𓅃" },
  { id: "jackal", label: "𓃭 · jackal form", value: "𓃭" },
  { id: "cat", label: "𓃠 · cat form", value: "𓃠" },
  { id: "star", label: "✦ · archive star", value: "✦" },
  { id: "moon", label: "☾ · lunar mark", value: "☾" },
  { id: "sun", label: "☉ · solar mark", value: "☉" },
  { id: "greek", label: "Ω · Greek threshold", value: "Ω" },
  { id: "coptic", label: "Ⲧ · Coptic form", value: "Ⲧ" },
  { id: "arabic", label: "۞ · Arabic rosette", value: "۞" },
  { id: "runic", label: "ᛟ · runic echo", value: "ᛟ" },
  { id: "alchemical", label: "☿ · alchemical sign", value: "☿" },
  { id: "astral", label: "⟡ · astral mark", value: "⟡" }
];

export const VECTOR_MARKS: StudioOption[] = [
  { id: "grid", label: "Survey grid", value: "grid" },
  { id: "orbit", label: "Orbital geometry", value: "orbit" },
  { id: "web", label: "Spider web", value: "web" },
  { id: "pyramid", label: "Pyramid line", value: "pyramid" },
  { id: "constellation", label: "Constellation trace", value: "constellation" },
  { id: "sigil", label: "Field sigil", value: "sigil" }
];

export const STICKER_MOTIFS: StudioOption[] = [
  { id: "scarab-eye", label: "Scarab & eye", value: "scarab-eye" },
  { id: "torn-label", label: "Torn paper label", value: "torn-label" },
  { id: "red-thread", label: "Red binding thread", value: "red-thread" },
  { id: "celestial-grid", label: "Celestial grid", value: "celestial-grid" },
  { id: "specimen-tag", label: "Field specimen tag", value: "specimen-tag" },
  { id: "warning-triangle", label: "Anomaly warning", value: "warning-triangle" },
  { id: "moth", label: "Pinned moth", value: "moth" },
  { id: "spider", label: "Arachnid study", value: "spider" },
  { id: "pyramid", label: "Pyramid outline", value: "pyramid" },
  { id: "moon", label: "Phase of moon", value: "moon" },
  { id: "evidence-pin", label: "Brass pin", value: "evidence-pin" }
];

export const STAMP_KINDS: StudioOption[] = [
  { id: "auto", label: "Auto (Status based)", value: "AUTO" },
  { id: "top-secret", label: "CLASSIFIED", value: "CLASSIFIED" },
  { id: "unverified", label: "UNVERIFIED", value: "UNVERIFIED" },
  { id: "declassified", label: "DECLASSIFIED", value: "DECLASSIFIED" },
  { id: "case-closed", label: "CASE CLOSED", value: "CASE CLOSED" },
  { id: "none", label: "No Stamp", value: "NONE" }
];

export const STICKY_TREATMENTS: StudioOption[] = [
  { id: "brass-pin", label: "Brass pin", value: "brass-pin" },
  { id: "top-tape", label: "Top tape", value: "top-tape" },
  { id: "crossed-tape", label: "Crossed tape", value: "crossed-tape" },
  { id: "thread-and-pin", label: "Thread & pin", value: "thread-and-pin" }
];

export const STICKY_PLACEMENTS: StudioOption[] = [
  { id: "margin", label: "Right margin", value: "margin" },
  { id: "left-lean", label: "Left tilt", value: "left-lean" },
  { id: "right-lean", label: "Right tilt", value: "right-lean" }
];

export const CASE_STATUSES: StudioOption[] = [
  { id: "documented", label: "Documented", value: "documented" },
  { id: "disputed", label: "Disputed", value: "disputed" },
  { id: "unverified", label: "Unverified", value: "unverified" },
  { id: "ongoing", label: "Ongoing", value: "ongoing" },
  { id: "unresolved", label: "Unresolved", value: "unresolved" }
];

export const EVIDENCE_MODES: StudioOption[] = [
  { id: "material", label: "Material record", value: "Material record" },
  { id: "myth", label: "Cultural myth", value: "Cultural myth" },
  { id: "celestial", label: "Celestial reading", value: "Celestial reading" },
  { id: "fragment", label: "Archive fragment", value: "Archive fragment" }
];

