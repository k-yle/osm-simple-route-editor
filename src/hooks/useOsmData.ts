/** fetches nearby map data from the OSM API and caches it */
import { useEffect, useRef, useState } from "react";
import { BBox, getMapData } from "osm-api";
import { OsmCache, WayWithGeom } from "../types";
import { createRoadsFromRawOsmData, bboxToTiles, isWithinBBox } from "../util";

// We fetch data one tile at a time, which makes it easier
// to track which tiles we've fetched. To reduce API requests,
// the chunk zoom should be small, but not too small since the OSM API
// can only return 5,000 items per request.
const CHUNK_ZOOM = 15;

/** don't query data until the user is zoomed in further than this */
export const MIN_ZOOM = 16;

const cache: OsmCache = { node: {}, way: {}, relation: {} };
// this is derived from the cache object
let constructedRoads: WayWithGeom[] = [];

const updateDerivedRoads = () => {
  constructedRoads = createRoadsFromRawOsmData("ROAD", cache);
};

const alreadyQueried: Record<string, true> = {};

export const useOsmData = (mapExtent: BBox, zoom: number) => {
  const mapExtentRef = useRef<BBox>(mapExtent);

  const [visibleFeatures, setVisibleFeatures] = useState<WayWithGeom[]>([]);

  useEffect(() => {
    mapExtentRef.current = mapExtent;

    // do nothing until the user zooms in
    if (zoom < MIN_ZOOM) return;

    const tiles = bboxToTiles(mapExtent, CHUNK_ZOOM);

    for (const tile of tiles) {
      if (!alreadyQueried[tile.id]) {
        // immediately mark as complete, so that we don't start
        // two inflight requests
        alreadyQueried[tile.id] = true;

        // fetch async map data from OSM
        getMapData(tile.bbox)
          .then((features) => {
            const filteredFeatures = features;
            for (const f of filteredFeatures) {
              cache[f.type][f.id] = f;
            }

            updateDerivedRoads();
          })
          .catch(console.error);
      }
    }
  }, [mapExtent, zoom]);

  useEffect(() => {
    setVisibleFeatures(
      constructedRoads.filter((road) =>
        road.points.some((point) => isWithinBBox(point, mapExtent))
      )
    );
  }, [mapExtent]);

  return visibleFeatures;
};
