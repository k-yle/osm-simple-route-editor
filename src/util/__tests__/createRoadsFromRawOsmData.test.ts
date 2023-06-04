import { describe, expect, it } from "vitest";
import { OsmNode, OsmRelation, OsmWay } from "osm-api";
import { createRoadsFromRawOsmData } from "..";
import { OsmCache, Tags } from "../../types";

const rawOsmData: OsmCache = {
  node: {
    1: <OsmNode>{ lat: 0.1, lon: 1.1 },
    2: <OsmNode>{ lat: 0.2, lon: 1.2 },
    3: <OsmNode>{ lat: 0.3, lon: 1.3 },
    4: <OsmNode>{ lat: 0.4, lon: 1.4 },
    5: <OsmNode>{ lat: 0.5, lon: 1.5 },
    6: <OsmNode>{ lat: 0.6, lon: 1.6 },
    7: <OsmNode>{ lat: 0.7, lon: 1.7 },
    8: <OsmNode>{ lat: 0.8, lon: 1.8 },
    9: <OsmNode>{ lat: 0.9, lon: 1.9 },
  },
  way: {
    // these ones are ignored (because the tag doesn't match)
    2001: <OsmWay>{ tags: {}, nodes: [1, 2] },
    2002: <OsmWay>{ tags: <Tags>{ otherTag: "yes" }, nodes: [1, 2] },
    2003: <OsmWay>{ tags: <Tags>{ railway: "rail" }, nodes: [1, 2] },
    // these ones are ignored (because some of the nodes are missing)
    2004: <OsmWay>{ tags: <Tags>{ railway: "rail" }, nodes: [1, 2, 123, 3, 4] },
    // these ones are included
    2005: <OsmWay>{ tags: <Tags>{ highway: "whatever" }, nodes: [1, 2, 3] },
    2006: <OsmWay>{ tags: <Tags>{ expressway: "yes" }, nodes: [4, 5, 6] },
  },
  relation: {
    2001: <OsmRelation>{},
    2002: <OsmRelation>{},
  },
};

describe("createRoadsFromRawOsmData", () => {
  it("extracts the right ways and injects the geocoords", () => {
    expect(createRoadsFromRawOsmData("ROAD", rawOsmData)).toStrictEqual([
      {
        nodes: [1, 2, 3],
        points: [
          [0.1, 1.1],
          [0.2, 1.2],
          [0.3, 1.3],
        ],
        tags: { highway: "whatever" },
      },
      {
        nodes: [4, 5, 6],
        points: [
          [0.4, 1.4],
          [0.5, 1.5],
          [0.6, 1.6],
        ],
        tags: { expressway: "yes" },
      },
    ]);
  });
});
