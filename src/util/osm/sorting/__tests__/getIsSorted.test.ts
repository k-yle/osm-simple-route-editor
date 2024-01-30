import { describe, expect, it } from "vitest";
import type { OsmWay } from "osm-api";
import type { RelationMember } from "../../../../types";
import { getIsSorted, getSharedNode } from "../getIsSorted";
import { osmCache } from "../../../../context/cache";

const createWay = (wayId: number, nodeIds: number[]) => {
  osmCache.way[wayId] = <OsmWay>{ id: wayId, nodes: nodeIds };
};
const createMembers = (wayIds: number[]): RelationMember[] =>
  wayIds.map((id) => ({ type: "way", ref: id, role: "" }));

createWay(12, [1, 2]);
createWay(23, [2, 3]);
createWay(34, [3, 4]);

createWay(123, [1, 2, 3]);
createWay(345, [3, 4, 5]);
createWay(567, [5, 6, 7]);
createWay(789, [7, 8, 9]);

createWay(543, [5, 4, 3]);
createWay(987, [9, 8, 7]);

createWay(4563, [4, 5, 6, 3]);
createWay(4789, [4, 7, 8, 9]);

createWay(21, [2, 1]);
createWay(32, [3, 2]);

describe("getIsSorted", () => {
  it.each`
    members                 | result
    ${[12, 23, 34]}         | ${true}
    ${[123, 345, 567, 789]} | ${true}
    ${[123, 567]}           | ${567}
    ${[123, 567, 789]}      | ${567}
    ${[123, 567, 345]}      | ${567}
    ${[123]}                | ${true}
    ${[]}                   | ${true}
    ${[-1]}                 | ${true /** bc there's only 1 member, doesn't matter if it hasn't downloaded */}
    ${[-1, -2]}             | ${undefined}
    ${[-1, 123, 345]}       | ${undefined}
    ${[789, 567, 345, 123]} | ${true}
    ${[789, 567]}           | ${true}
    ${[789, 345]}           | ${345}
    ${[123, 543, 567, 987]} | ${true}
  `("returns $result for $members", ({ members, result }) => {
    expect(getIsSorted(createMembers(members))).toStrictEqual(result);
  });

  it("handles loops", () => {
    expect(getIsSorted(createMembers([123, 34, 4563, 34, 4789]))).toBe(true);
  });
});

describe("getSharedNode", () => {
  it.each`
    a      | b       | shared
    ${12}  | ${23}   | ${2}
    ${23}  | ${12}   | ${2}
    ${32}  | ${12}   | ${2}
    ${32}  | ${21}   | ${2}
    ${12}  | ${34}   | ${undefined}
    ${12}  | ${12}   | ${1 /* loop, so either one is valid */}
    ${123} | ${345}  | ${3}
    ${123} | ${4563} | ${3}
  `("returns $shared for $a and $b", ({ shared, a, b }) => {
    expect(getSharedNode(osmCache.way[a], osmCache.way[b])).toBe(shared);
  });
});
