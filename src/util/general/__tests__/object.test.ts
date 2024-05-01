import { describe, expect, it } from "vitest";
import { swapArrayItem } from "../object";

describe("swapArrayItem", () => {
  it("works without mutating the original", () => {
    const original = [0, 1, 2, 3, 4, 5];
    expect(swapArrayItem(original, 1, 3)).toStrictEqual([0, 3, 2, 1, 4, 5]);
    expect(original).toStrictEqual([0, 1, 2, 3, 4, 5]); // unchanged
  });
});
