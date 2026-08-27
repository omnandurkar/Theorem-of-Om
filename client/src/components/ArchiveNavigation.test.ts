import { describe, expect, it } from "vitest";
import { buildPageWindow } from "./ArchiveNavigation";

describe("buildPageWindow", () => {
  it("shows compact sequential pages for small archives", () => {
    expect(buildPageWindow(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("keeps the current page visible while collapsing distant archive pages", () => {
    expect(buildPageWindow(5, 12)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 12]);
  });
});
