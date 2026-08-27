import { describe, expect, it } from "vitest";
import { previewTitle, readEditorPreview } from "./editorPreview";

describe("editor reader preview", () => {
  it("reads a locally stored visual draft without requiring publication", () => {
    expect(readEditorPreview('{"title":"Giza survey note","paletteId":"rose"}')).toEqual(expect.objectContaining({ title: "Giza survey note", paletteId: "rose" }));
  });

  it("rejects malformed local preview data and supplies a useful title fallback", () => {
    expect(readEditorPreview("not-json")).toBeNull();
    expect(previewTitle({ title: "   " })).toBe("Your unpublished case file");
  });
});
