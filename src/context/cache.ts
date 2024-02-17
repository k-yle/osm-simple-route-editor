import { OsmFeature } from "osm-api";
import type { OsmCache, WayWithGeom } from "../types";
import { createRoadsFromRawOsmData } from "../util";
import { TransportMode } from "../constants";

export const osmCache: OsmCache = { node: {}, way: {}, relation: {} };
// this is derived from the cache object
let constructedRoads: WayWithGeom[] = [];

export const getConstructedRoads = () => constructedRoads;

export const storeNewFeatures = (
  newFeatures: OsmFeature[],
  transportMode: TransportMode,
) => {
  for (const f of newFeatures) {
    osmCache[f.type][f.id] = f;
  }
  constructedRoads = createRoadsFromRawOsmData(transportMode, osmCache);
};
