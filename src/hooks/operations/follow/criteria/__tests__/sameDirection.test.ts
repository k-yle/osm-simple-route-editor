import { describe, expect, it } from "vitest";
import type { WayWithGeom } from "../../../../../types";
import { partial } from "../../../../../testHelpers";
import { sameDirection } from "../sameDirection";

const twowayFwd1 = partial<WayWithGeom>({ nodes: [1, 2] });
const twowayFwd2 = partial<WayWithGeom>({ nodes: [2, 3] });

const twowayBwd1 = partial<WayWithGeom>({ nodes: [8, 7] });
const twowayBwd2 = partial<WayWithGeom>({ nodes: [9, 8] });

const fwd1 = partial<WayWithGeom>({ nodes: [1, 2], tags: { oneway: "yes" } });
const fwd2 = partial<WayWithGeom>({ nodes: [2, 3], tags: { oneway: "yes" } });

const bwd1 = partial<WayWithGeom>({ nodes: [8, 7], tags: { oneway: "yes" } });
const bwd2 = partial<WayWithGeom>({ nodes: [9, 8], tags: { oneway: "yes" } });

const onewayNegative1 = partial<WayWithGeom>({
  nodes: [2, 3],
  tags: { oneway: "-1" },
});
const onewayNegative2 = partial<WayWithGeom>({
  nodes: [1, 2],
  tags: { oneway: "-1" },
});

describe("sameDirection", () => {
  it("eturns a score of 5 when going from a 1way -> 2way", () => {
    expect(sameDirection(twowayFwd1, twowayFwd2)).toBe(5);
    expect(sameDirection(twowayBwd1, twowayBwd2)).toBe(5);
    expect(sameDirection(twowayFwd2, twowayFwd1)).toBe(5);
    expect(sameDirection(twowayBwd2, twowayBwd1)).toBe(5);
  });

  it("returns a score of 5 when going from a 1way -> 1way", () => {
    expect(sameDirection(fwd1, fwd2)).toBe(5);
    expect(sameDirection(bwd1, bwd2)).toBe(5);
    expect(sameDirection(fwd2, fwd1)).toBe(5);
    expect(sameDirection(bwd2, bwd1)).toBe(5);
  });

  it("returns a score of 7 when going from a 1way -> 2way", () => {
    expect(sameDirection(fwd1, twowayFwd2)).toBe(7);
    expect(sameDirection(fwd2, twowayFwd1)).toBe(7);
    expect(sameDirection(bwd1, twowayBwd2)).toBe(7);
    expect(sameDirection(bwd2, twowayBwd1)).toBe(7);
  });

  it("returns a score of 3 when going from a 2way -> 1way", () => {
    expect(sameDirection(twowayFwd1, fwd2)).toBe(3);
    expect(sameDirection(twowayBwd2, bwd1)).toBe(3);
  });

  it("returns a score of 3 when going backwards down a 1way -> 2way", () => {
    expect(sameDirection(twowayFwd2, fwd1)).toBe(0);
    expect(sameDirection(twowayBwd1, bwd2)).toBe(0);
  });

  describe("oneway=-1", () => {
    it("returns a score of 5 for oneway=-1 to another oneway=-1", () => {
      expect(sameDirection(onewayNegative1, onewayNegative2)).toBe(5);
    });

    it("returns a score of 7 for oneway=-1 to oneway=no", () => {
      expect(sameDirection(onewayNegative2, twowayFwd2)).toBe(7);
    });

    it("returns a score of 0 for oneway=-1 to oneway=yes", () => {
      expect(sameDirection(onewayNegative2, fwd2)).toBe(0);
    });

    it("returns a score of 0 for oneway=no to oneway=-1", () => {
      expect(sameDirection(twowayFwd1, onewayNegative1)).toBe(0);
    });

    it("returns a score of 0 for oneway=yes to oneway=-1", () => {
      expect(sameDirection(fwd1, onewayNegative1)).toBe(0);
    });
  });
});
