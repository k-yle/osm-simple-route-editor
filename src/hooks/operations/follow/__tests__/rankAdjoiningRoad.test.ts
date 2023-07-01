import { describe, expect, it } from "vitest";
import { rankAdjoiningRoad } from "../rankAdjoiningRoad";
import { WayWithGeom } from "../../../../types";

describe("rankAdjoiningRoad", () => {
  it.each`
    sourceTags                               | candidateTags                            | rank
    ${{}}                                    | ${{}}                                    | ${11150}
    ${{ name: "a" }}                         | ${{ name: "a" }}                         | ${11150}
    ${{ name: "a" }}                         | ${{ name: "b" }}                         | ${10150}
    ${{ name: "a", highway: "motorway" }}    | ${{ name: "b", highway: "trunk" }}       | ${10050}
    ${{ name: "a", highway: "motorway" }}    | ${{ name: "b", highway: "motorway" }}    | ${10150}
    ${{ name: "a", junction: "roundabout" }} | ${{ name: "b", junction: "roundabout" }} | ${10151}
    ${{ name: "a" }}                         | ${{ name: "b", junction: "roundabout" }} | ${10130}
    ${{ name: "a", junction: "roundabout" }} | ${{ name: "b" }}                         | ${10172}
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
