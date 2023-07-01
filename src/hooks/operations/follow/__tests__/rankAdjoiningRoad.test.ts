import { describe, expect, it } from "vitest";
import { rankAdjoiningRoad } from "../rankAdjoiningRoad";
import { WayWithGeom } from "../../../../types";

describe("rankAdjoiningRoad", () => {
  it.each`
    sourceTags                            | candidateTags                         | rank
    ${{}}                                 | ${{}}                                 | ${1115}
    ${{ name: "a" }}                      | ${{ name: "a" }}                      | ${1115}
    ${{ name: "a" }}                      | ${{ name: "b" }}                      | ${1015}
    ${{ name: "a", highway: "motorway" }} | ${{ name: "b", highway: "trunk" }}    | ${1005}
    ${{ name: "a", highway: "motorway" }} | ${{ name: "b", highway: "motorway" }} | ${1015}
  `(
    "can rank two adjoining roads based on tags %# --> $rank",
    ({ sourceTags, candidateTags, rank }) => {
      const source = { nodes: [1, 2], tags: sourceTags } as WayWithGeom;
      const candidate = { nodes: [2, 3], tags: candidateTags } as WayWithGeom;
      expect(rankAdjoiningRoad(source, candidate)).toBe(rank);
    }
  );

  // TODO: more tests
});
