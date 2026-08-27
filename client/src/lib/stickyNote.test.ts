import { describe, expect, it } from "vitest";
import { stickyNoteClassName } from "./stickyNote";

describe("stickyNoteClassName", () => {
  it("maps persisted tape and placement values to the public reader classes", () => {
    expect(stickyNoteClassName("crossed-tape", "right-lean")).toBe("note-crossed-tape note-place-right-lean");
  });

  it("keeps older or malformed records readable with a brass-pin margin fallback", () => {
    expect(stickyNoteClassName("unexpected-hardware", "floating")).toBe("note-brass-pin note-place-margin");
  });
});
