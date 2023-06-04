import type { BBox } from "osm-api";
import { Vec2, Vec3 } from "../../types";
import { MAX_LAT, MAX_LNG, MIN_LAT, MIN_LNG } from "../../constants";

const { cos, tan, atan, exp, log, floor, PI: π } = Math;

// based on https://wiki.osm.org/Slippy_map_tilenames
export function coordToTile([lat, lng]: Vec2, z: number): Vec3 {
  const x = floor(((lng + 180) / 360) * 2 ** z);
  const y = floor(
    ((1 - log(tan((lat * π) / 180) + 1 / cos((lat * π) / 180)) / π) / 2) *
      2 ** z
  );
  return [x, y, z];
}

/** gets the min coord of the tile (i.e. the top left) */
// based on https://wiki.osm.org/Slippy_map_tilenames
export function tileToCoord([x, y, z]: Vec3): Vec2 {
  const lng = (x / 2 ** z) * 360 - 180;

  const n = π - (2 * π * y) / 2 ** z;
  const lat = (180 / π) * atan(0.5 * (exp(n) - exp(-n)));

  return [lat, lng];
}

export type TileId = `${/* z */ number}/${/* x */ number}/${/* y */ number}`;
export type Tile = {
  id: TileId;
  bbox: BBox;
};

export function bboxToTiles(bbox: BBox, z: number): Tile[] {
  const [x1, y1] = coordToTile([bbox[MIN_LAT], bbox[MIN_LNG]], z);
  const [x2, y2] = coordToTile([bbox[MAX_LAT], bbox[MAX_LNG]], z);

  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  const tiles: Tile[] = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const id: TileId = `${z}/${x}/${y}`;

      const [lat1, lng1] = tileToCoord([x, y, z]);
      const [lat2, lng2] = tileToCoord([x + 1, y + 1, z]);

      const minLng = Math.min(lng1, lng2);
      const minLat = Math.min(lat1, lat2);
      const maxLng = Math.max(lng1, lng2);
      const maxLat = Math.max(lat1, lat2);

      tiles.push({
        id,
        bbox: [minLng, minLat, maxLng, maxLat],
      });
    }
  }
  return tiles;
}
