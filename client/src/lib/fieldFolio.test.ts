import { describe, expect, it } from "vitest";
import { cycleFolioIndex, folioNumber } from "./fieldFolio";

describe("field folio navigation", () => {
  it("wraps in both directions through a finite set of records", () => {
    expect(cycleFolioIndex(2, 1, 3)).toBe(0);
    expect(cycleFolioIndex(0, -1, 3)).toBe(2);
  });

  it("uses readable two-digit leaf labels and safely handles no records", () => {
    expect(folioNumber(0)).toBe("01");
    expect(folioNumber(11)).toBe("12");
    expect(cycleFolioIndex(3, 1, 0)).toBe(0);
  });
});
