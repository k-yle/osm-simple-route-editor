import { describe, expect, it } from "vitest";
import { sameRoadName } from "../sameRoadName";
import type { WayWithGeom } from "../../../../../types";
import { partial } from "../../../../../testHelpers";

describe("sameRoadName", () => {
  it.each`
    from              | to                | rank
    ${undefined}      | ${undefined}      | ${1}
    ${""}             | ${""}             | ${1}
    ${"Alpha Street"} | ${"Alpha Street"} | ${1}
    ${"Alpha Street"} | ${"Bravo Street"} | ${0}
    ${"Alpha Street"} | ${"alpha street"} | ${0}
  `("returns $rank for $from to $to", ({ from, to, rank }) => {
    expect(
      sameRoadName(
        partial<WayWithGeom>({ tags: { name: from } }),
        partial<WayWithGeom>({ tags: { name: to } }),
      ),
    ).toBe(rank);
  });
});
