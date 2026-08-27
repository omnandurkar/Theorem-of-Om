export const CURATOR_RELICS = [
  { id: "djed", glyph: "𓊽", label: "Djed pillar" },
  { id: "eye", glyph: "𓂀", label: "Eye of Horus" },
  { id: "ankh", glyph: "𓋹", label: "Ankh" },
  { id: "scarab", glyph: "𓆣", label: "Scarab" },
  { id: "was", glyph: "𓌀", label: "Was sceptre" },
  { id: "ibis", glyph: "𓅃", label: "Ibis" },
  { id: "sun", glyph: "𓇳", label: "Sun disk" },
  { id: "lotus", glyph: "𓆼", label: "Lotus" },
  { id: "cobra", glyph: "𓆗", label: "Uraeus cobra" },
  { id: "falcon", glyph: "𓅃", label: "Falcon" },
  { id: "crook", glyph: "𓋾", label: "Crook" },
  { id: "flail", glyph: "𓌳", label: "Flail" },
] as const;

export type CuratorRelicId = (typeof CURATOR_RELICS)[number]["id"];
export const CURATOR_RELIC_IDS = CURATOR_RELICS.map((relic) => relic.id) as [CuratorRelicId, ...CuratorRelicId[]];
export const DEFAULT_CURATOR_PUZZLE = { name: "Keeper’s first seal", title: "Align the four relics.", instruction: "Reconstruct the keeper’s sequence to unseal Om’s field desk.", clue: "A pillar steadies the watcher; life follows the rising beetle.", relicIds: ["djed", "eye", "ankh", "scarab"] as CuratorRelicId[], solutionOrder: ["djed", "eye", "ankh", "scarab"] as CuratorRelicId[] };
