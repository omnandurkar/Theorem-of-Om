export const STICKY_TREATMENTS = ["brass-pin", "top-tape", "crossed-tape", "thread-and-pin"] as const;
export const STICKY_PLACEMENTS = ["margin", "left-lean", "right-lean"] as const;

export function stickyNoteClassName(treatment?: string | null, placement?: string | null) {
  const safeTreatment = STICKY_TREATMENTS.includes(treatment as typeof STICKY_TREATMENTS[number]) ? treatment : "brass-pin";
  const safePlacement = STICKY_PLACEMENTS.includes(placement as typeof STICKY_PLACEMENTS[number]) ? placement : "margin";
  return `note-${safeTreatment} note-place-${safePlacement}`;
}
