import { describe, expect, it } from "vitest";
import { FONT_CATALOG, PALETTES, STICKER_MOTIFS, SYMBOLS, VECTOR_MARKS } from "./editorCatalog";
import { DEFAULT_PRESENTATION } from "@/lib/localArchive";

describe("Om editorial studio catalog", () => {
  it("offers at least fifty curated type choices with usable font stacks", () => {
    expect(FONT_CATALOG.length).toBeGreaterThanOrEqual(50);
    expect(FONT_CATALOG.every((font) => font.value.includes(","))).toBe(true);
  });

  it("keeps the field-station presentation palette and motif controls populated", () => {
    expect(PALETTES.length).toBeGreaterThanOrEqual(8);
    expect(SYMBOLS.length).toBeGreaterThanOrEqual(20);
    expect(SYMBOLS.some((symbol) => symbol.id === "djed")).toBe(true);
    expect(SYMBOLS.some((symbol) => symbol.id === "sun-disc")).toBe(true);
    expect(new Set(SYMBOLS.map((symbol) => symbol.value)).size).toBe(SYMBOLS.length);
    expect(VECTOR_MARKS.length).toBeGreaterThanOrEqual(6);
    expect(STICKER_MOTIFS.length).toBe(6);
    expect(DEFAULT_PRESENTATION.stickyBody.length).toBeGreaterThan(0);
  });
});
