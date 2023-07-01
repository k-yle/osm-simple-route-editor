import { describe, expect, it } from "vitest";
import { exitRoundaboutEarly } from "../exitRoundaboutEarly";
import type { WayWithGeom } from "../../../../../types";
import { partial } from "../../../../../testHelpers";

const roundabout = partial<WayWithGeom>({ tags: { junction: "roundabout" } });
const nonRoundabout = partial<WayWithGeom>({ tags: {} });

describe("exitRoundaboutEarly", () => {
  it.each`
    from             | to               | rank
    ${roundabout}    | ${roundabout}    | ${1}
    ${roundabout}    | ${nonRoundabout} | ${2}
    ${nonRoundabout} | ${nonRoundabout} | ${0}
    ${nonRoundabout} | ${roundabout}    | ${0}
  `("returns $rank for %#", ({ from, to, rank }) => {
    expect(exitRoundaboutEarly(from, to)).toBe(rank);
  });
});
