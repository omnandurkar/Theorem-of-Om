import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DrivePolaroid, getPolaroidOrientation } from "./DrivePolaroid";

describe("getPolaroidOrientation", () => {
  it("selects a Polaroid frame from a loaded image’s natural dimensions", () => {
    expect(getPolaroidOrientation(1200, 800)).toBe("landscape");
    expect(getPolaroidOrientation(800, 1200)).toBe("portrait");
    expect(getPolaroidOrientation(900, 900)).toBe("square");
  });

  it("offers close inspection for evidence prints without putting the control on hero artwork", () => {
    const evidence = renderToStaticMarkup(createElement(DrivePolaroid, { src: "https://example.com/artifact.jpg", alt: "Artifact detail", variant: "inline" }));
    const hero = renderToStaticMarkup(createElement(DrivePolaroid, { src: "https://example.com/hero.jpg", alt: "Hero image", variant: "hero" }));
    expect(evidence).toContain("Inspect field print");
    expect(hero).not.toContain("Inspect field print");
  });
});
