import { describe, expect, it } from "vitest";
import { bboxToTiles, coordToTile } from "../tiles";
import { BBox } from "osm-api";

describe("coordToTile", () => {
  it("coordToTile", () => {
    expect(coordToTile([0, 0], 0)).toStrictEqual([0, 0, 0]);
    expect(coordToTile([0, 0], 1)).toStrictEqual([1, 1, 1]);
    expect(coordToTile([-37.6554, 176.02721], 19)).toStrictEqual([
      518502, 321419, 19,
    ]);
    expect(coordToTile([-37.6554, 176.02721], 16)).toStrictEqual([
      64812, 40177, 16,
    ]);
    expect(coordToTile([-37.6554, 176.02721], 11)).toStrictEqual([
      2025, 1255, 11,
    ]);
  });
});

describe("bboxToTiles", () => {
  it("works", () => {
    const bbox: BBox = [174.768937, -36.820481, 174.779237, -36.809345];

    const f = (z: number) => bboxToTiles(bbox, z).map((tile) => tile.id);

    expect(f(12)).toStrictEqual(["12/4036/2499"]);
    expect(f(13)).toStrictEqual(["13/8072/4998", "13/8073/4998"]);
    expect(f(14)).toStrictEqual(["14/16145/9996", "14/16146/9996"]);
    expect(f(15)).toStrictEqual([
      "15/32291/19992",
      "15/32291/19993",
      "15/32292/19992",
      "15/32292/19993",
    ]);
    expect(f(16)).toStrictEqual([
      "16/64583/39984",
      "16/64583/39985",
      "16/64583/39986",
      "16/64584/39984",
      "16/64584/39985",
      "16/64584/39986",
      "16/64585/39984",
      "16/64585/39985",
      "16/64585/39986",
    ]);
    expect(f(16)).toHaveLength(9);
    expect(f(17)).toHaveLength(30);
    expect(f(18)).toHaveLength(99);
  });
});
