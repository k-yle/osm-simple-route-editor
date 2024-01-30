import type { OsmWay } from "osm-api";
import { describe, it, expect } from "vitest";
import type { RelationMember } from "../../../../types";
import { osmCache } from "../../../../context/cache";
import { trySortRelation } from "../trySortRelation";

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

createWay(321, [3, 2, 1]);
createWay(543, [5, 4, 3]);
createWay(987, [9, 8, 7]);

createWay(4563, [4, 5, 6, 3]);
createWay(4789, [4, 7, 8, 9]);

describe("trySortRelation", () => {
  it.each`
    input                        | output
    ${[12, 34, 23]}              | ${[12, 23, 34]}
    ${[123, 345, 567, 789]}      | ${[123, 345, 567, 789]}
    ${[123, 345, 789, 567]}      | ${[123, 345, 567, 789]}
    ${[123, 789, 345, 567]}      | ${[123, 345, 567, 789]}
    ${[789, 345, 123, 567]}      | ${[789, 567, 345, 123]}
    ${[123]}                     | ${[123]}
    ${[123, 345]}                | ${[123, 345]}
    ${[123, 345, 543, 321]}      | ${[123, 345, 543, 321] /* basic reversal - unchanged */}
    ${[123, 543, 321, 345]}      | ${[123, 543, 345, 321] /* basic reversal - sorted */}
    ${[123, 34, 4563, 34, 4789]} | ${[123, 34, 34, 4563, 4789] /* loop - it prefered reversing instead of looping */}
  `("sorts $input into $output", ({ input, output }) => {
    expect(
      trySortRelation(createMembers(input))?.map((m) => m.ref),
    ).toStrictEqual(output);
  });

  it.each`
    input
    ${[123, 345, 789]}
  `("returns undefined if it gets stuck $input", ({ input }) => {
    expect(trySortRelation(createMembers(input))).toBeUndefined();
  });
});
