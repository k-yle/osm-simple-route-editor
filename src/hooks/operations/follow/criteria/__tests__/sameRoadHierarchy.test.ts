import { describe, expect, it } from "vitest";
import { sameRoadHierarchy } from "../sameRoadHierarchy";
import type { WayWithGeom } from "../../../../../types";
import { partial } from "../../../../../testHelpers";

describe("sameRoadHierarchy", () => {
  it.each`
    from         | to                | rank
    ${undefined} | ${undefined}      | ${1}
    ${""}        | ${""}             | ${1}
    ${"primary"} | ${"primary"}      | ${1}
    ${"trunk"}   | ${"primary"}      | ${0}
    ${"primary"} | ${"primary_link"} | ${0}
  `("returns $rank for $from to $to", ({ from, to, rank }) => {
    expect(
      sameRoadHierarchy(
        partial<WayWithGeom>({ tags: { highway: from } }),
        partial<WayWithGeom>({ tags: { highway: to } }),
      ),
    ).toBe(rank);
  });
});
