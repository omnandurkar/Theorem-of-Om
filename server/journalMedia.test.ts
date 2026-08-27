import { describe, expect, it } from "vitest";
import { normalizeDriveImageUrl } from "./journalMedia";

describe("Google Drive journal media", () => {
  it("normalizes a public Drive file link for direct rendering", () => {
    expect(normalizeDriveImageUrl("https://drive.google.com/file/d/1sg4ZqsS12eB05qRvFQAk_zhvWZahTT6n/view?usp=sharing")).toBe("https://lh3.googleusercontent.com/d/1sg4ZqsS12eB05qRvFQAk_zhvWZahTT6n=w2000");
  });

  it("retains an ordinary remote image link without inventing a Drive URL", () => {
    expect(normalizeDriveImageUrl("https://example.org/image.jpg")).toBe("https://example.org/image.jpg");
  });
});
