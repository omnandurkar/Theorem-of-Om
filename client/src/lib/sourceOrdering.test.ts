import { describe, expect, it } from "vitest";
import { moveSourceDraft, reorderSourceDrafts } from "./sourceOrdering";

describe("source ordering", () => {
  it("moves a source to a requested valid position without mutating the original list", () => {
    const sources = ["Museum register", "Excavation report", "Counter-reading"];
    expect(reorderSourceDrafts(sources, 2, 0)).toEqual(["Counter-reading", "Museum register", "Excavation report"]);
    expect(sources).toEqual(["Museum register", "Excavation report", "Counter-reading"]);
  });

  it("keeps the list unchanged when a source cannot move beyond the first or last slot", () => {
    const sources = ["A", "B"];
    expect(moveSourceDraft(sources, 0, -1)).toBe(sources);
    expect(moveSourceDraft(sources, 1, 1)).toBe(sources);
  });
});
