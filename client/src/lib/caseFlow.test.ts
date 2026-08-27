import { describe, expect, it } from "vitest";
import { caseFlowReadiness } from "./caseFlow";

describe("caseFlowReadiness", () => {
  it("keeps a new draft focused on the first unresolved authoring pass", () => {
    expect(caseFlowReadiness({ title: "", caseNumber: "", summary: "", body: "", documentedEvidence: "", sources: [], driveSourceUrl: "", stickyTitle: "", fontId: "" })).toEqual([false, false, false, false]);
  });

  it("recognizes independently completed identity, writing, evidence, and presentation passes", () => {
    expect(caseFlowReadiness({ title: "Giza record", caseNumber: "CASE 017", summary: "A concise summary", body: "A fuller body", documentedEvidence: "A dated register", sources: [], driveSourceUrl: "", stickyTitle: "Margin note", fontId: "cormorant" })).toEqual([true, true, true, true]);
  });
});
