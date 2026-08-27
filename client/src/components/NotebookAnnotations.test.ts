import { describe, expect, it } from "vitest";
import { applyNotebookMark } from "./NotebookAnnotations";

describe("applyNotebookMark", () => {
  it("wraps a selected phrase in a persistent pastel-highlight notation", () => {
    expect(applyNotebookMark("follow the record", 7, 10, "h-sage")).toBe("follow [[mk:h-sage|the]] record");
  });

  it("leaves content unchanged when no text is selected", () => {
    expect(applyNotebookMark("keep the text", 4, 4, "circle")).toBe("keep the text");
  });
});
