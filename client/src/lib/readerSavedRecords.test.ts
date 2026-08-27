import { describe, expect, it } from "vitest";
import { parseSavedRecords, toggleSavedRecord } from "./readerSavedRecords";

describe("reader saved records", () => {
  it("keeps only valid saved-record slugs from local storage", () => {
    expect(parseSavedRecords('["orion-ground-plan", 4, null]')).toEqual(["orion-ground-plan"]);
    expect(parseSavedRecords("not-json")).toEqual([]);
  });

  it("adds and removes a saved record without duplicates", () => {
    expect(toggleSavedRecord([], "orion-ground-plan")).toEqual(["orion-ground-plan"]);
    expect(toggleSavedRecord(["orion-ground-plan"], "orion-ground-plan")).toEqual([]);
  });
});
