import { describe, expect, it } from "vitest";
import { hydrateSourceDrafts, validSourceDrafts } from "./journalDraft";

describe("journal source editor", () => {
  it("hydrates persisted source cards for an existing entry without losing their note", () => {
    expect(hydrateSourceDrafts([{ label: "Museum catalogue", url: "https://example.org/catalogue", note: "Object context" }])).toEqual([{ label: "Museum catalogue", url: "https://example.org/catalogue", note: "Object context" }]);
  });

  it("keeps only complete source cards when a record is saved", () => {
    expect(validSourceDrafts([{ label: "", url: "https://example.org", note: "" }, { label: "Field report", url: "https://example.org/report", note: "Useful context" }])).toEqual([{ label: "Field report", url: "https://example.org/report", note: "Useful context" }]);
  });
});
