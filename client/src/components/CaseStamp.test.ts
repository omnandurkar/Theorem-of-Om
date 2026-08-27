import { describe, expect, it } from "vitest";
import { resolveCaseStamp } from "./CaseStamp";

describe("resolveCaseStamp", () => {
  it("derives field-station labels from Om’s editorial evidence classification", () => {
    expect(resolveCaseStamp({ stampKind: "auto", caseStatus: "documented", evidenceLevel: 92 })).toBe("case-closed");
    expect(resolveCaseStamp({ stampKind: "auto", caseStatus: "documented", evidenceLevel: 70 })).toBe("declassified");
    expect(resolveCaseStamp({ stampKind: "auto", caseStatus: "unverified", evidenceLevel: 20 })).toBe("unverified");
    expect(resolveCaseStamp({ stampKind: "auto", caseStatus: "disputed", evidenceLevel: 50 })).toBe("top-secret");
  });

  it("honours Om’s explicit stamp selection or a deliberate no-stamp choice", () => {
    expect(resolveCaseStamp({ stampKind: "top-secret", caseStatus: "documented", evidenceLevel: 99 })).toBe("top-secret");
    expect(resolveCaseStamp({ stampKind: "none", caseStatus: "disputed", evidenceLevel: 50 })).toBeNull();
  });
});
