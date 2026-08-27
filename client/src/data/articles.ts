/**
 * Style reminder — Field Notes of the Necropolis: these records read as elegant archaeological dossiers,
 * balancing documented fact with clearly marked speculation. Keep copy investigative, tactile, and unhurried.
 */
export type Article = {
  slug: string;
  title: string;
  eyebrow: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  tone: "night" | "paper" | "blue";
  keyQuestion: string;
  sections: Array<{
    label: string;
    heading: string;
    paragraphs: string[];
    pullQuote?: string;
  }>;
};

export const articles: Article[] = [
  {
    slug: "the-sphinx-and-the-forbidden-waterline",
    eyebrow: "CASE FILE 001 · GIZA PLATEAU",
    category: "Weathered Stone",
    date: "12 AUG 2026",
    readTime: "11 min read",
    title: "The Sphinx and the forbidden waterline",
    excerpt:
      "A weathered monument, a disputed chronology, and the grooves in stone that keep asking difficult questions.",
    image: "/assets/kemet-hero.jpg",
    tone: "night",
    keyQuestion: "What does erosion remember when chronology refuses to listen?",
    sections: [
      {
        label: "I. THE QUESTION",
        heading: "A monument built to keep a face",
        paragraphs: [
          "At first glance, the Great Sphinx offers the cleanest kind of mystery: a vast human face, a lion’s body, and a geological enclosure whose surfaces carry their own argument. The popular story fixes the monument to the Old Kingdom. The dissenting story looks at its weathering and asks whether water, rather than wind alone, once had a hand in the stone.",
          "This is not a verdict. It is a close reading of a question: how much can a weathered surface tell us, and what happens when a surface becomes more persuasive than the certainty arranged around it?",
        ],
        pullQuote: "Stone does not answer in sentences. It answers in durations.",
      },
      {
        label: "II. THE SURFACE",
        heading: "Grooves, fissures, and the temptation to date a scar",
        paragraphs: [
          "The enclosure walls show deep vertical undulations. Geologists disagree over the forces responsible, placing different weights on rainfall, runoff, salt, wind, and the variable quality of limestone layers. The visual resemblance between a scar and a story is powerful, but resemblance is not a method.",
          "Still, the grooves insist on being looked at. They turn a tourist photograph into an evidentiary object. The sensible response is neither dismissal nor conversion; it is patience with what remains unresolved.",
        ],
      },
      {
        label: "III. THE RECORD",
        heading: "Where a theory meets the archive",
        paragraphs: [
          "Any early-Sphinx claim must sit beside archaeology: the quarrying sequence, the surrounding temples, the construction logic of Khafre’s complex, and the long chain of restoration texts. The plateau is not empty enough for a single clue to rule it.",
          "The enduring value of the debate may be its discipline. It asks the reader to distinguish a striking observation from a complete explanation, and to let a mystery remain difficult without making it mute.",
        ],
      },
    ],
  },
  {
    slug: "orion-on-the-ground",
    eyebrow: "CASE FILE 002 · SAQQARA SKY MAP",
    category: "Celestial Geometry",
    date: "05 AUG 2026",
    readTime: "8 min read",
    title: "Orion on the ground",
    excerpt:
      "The pyramids, a hunter in the night sky, and the fine line between an evocative alignment and a deliberate plan.",
    image: "/assets/kemet-pyramid-cover.jpg",
    tone: "blue",
    keyQuestion: "When does a pattern in the sky become an intention in stone?",
    sections: [
      {
        label: "I. A CONSTELLATION ENTERS",
        heading: "The appeal of a celestial blueprint",
        paragraphs: [
          "The Orion correlation proposal is memorable because it makes a persuasive visual promise: three pyramids, three stars, one imagined blueprint crossing a desert plateau. It is exactly the sort of idea that changes how a reader looks up, then down.",
          "The challenge is proportion. Ancient Egyptians certainly watched the sky, named stars, and bound celestial renewal to royal afterlife. But a real cultural relationship with the heavens does not automatically prove a one-to-one architectural map.",
        ],
        pullQuote: "An alignment can be meaningful without being a blueprint.",
      },
      {
        label: "II. THE MEASUREMENT",
        heading: "Geometry deserves a hard question",
        paragraphs: [
          "Correlations become convincing when they survive accurate positions, historical visibility, construction dates, and alternative explanations. A small shift in a projected sky or a selective choice of points can change a wondrous diagram into a looser resemblance.",
          "That does not make the sky irrelevant. It makes method visible. The best investigations let the wonder of an idea coexist with the work needed to test it.",
        ],
      },
    ],
  },
  {
    slug: "the-djed-pillar-as-a-memory-device",
    eyebrow: "CASE FILE 003 · ABYDOS FRAGMENT",
    category: "Ritual Technology",
    date: "29 JUL 2026",
    readTime: "7 min read",
    title: "The Djed pillar as a memory device",
    excerpt:
      "An ancient symbol of stability may also have operated as a machine for remembering cycles, bodies, and renewal.",
    image: "/assets/kemet-scroll.jpg",
    tone: "paper",
    keyQuestion: "Could ritual objects organise memory as carefully as they organise belief?",
    sections: [
      {
        label: "I. A SYMBOL STANDS",
        heading: "Four bars against collapse",
        paragraphs: [
          "The djed is often explained as a sign of stability and associated with Osiris. Its stacked form appears across objects, inscriptions, and ritual scenes, at once familiar and resistant to a single fixed meaning.",
          "Rather than treating it as a code waiting to be cracked, it is useful to consider what repetition does. Repeated forms can train recognition, hold a story in the hand, and make a ritual sequence legible without a written manual.",
        ],
      },
      {
        label: "II. THE USEFUL SPECULATION",
        heading: "Objects that think with us",
        paragraphs: [
          "A ritual device need not be technological in the modern sense to be cognitively precise. Its ridges, orientation, and recurring placement can coordinate bodies, memories, and expectations. In this view, stability is not passive; it is rehearsed.",
          "The mystery is not whether the djed hid an impossible machine. It is how much sophisticated thought can live inside an object designed to be seen, carried, raised, and remembered.",
        ],
        pullQuote: "What survives in a symbol may be less a secret than a way of carrying time.",
      },
    ],
  },
];

export const categories = ["All records", "Weathered Stone", "Celestial Geometry", "Ritual Technology"];

