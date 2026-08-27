import { describe, expect, it } from "vitest";
import { evidenceText } from "./CaseEvidenceBoard";

describe("evidenceText", () => {
  it("preserves meaningful notes and provides an honest empty-state fallback", () => {
    expect(evidenceText("  A dated excavation register exists. ")).toBe("A dated excavation register exists.");
    expect(evidenceText("   ")).toBe("Awaiting Om’s field note.");
  });
});
