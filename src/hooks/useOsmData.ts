/** fetches nearby map data from the OSM API and caches it */
import { useEffect, useRef, useState } from "react";
import { BBox, getMapData } from "osm-api";
import { WayWithGeom } from "../types";
import { bboxToTiles, isWithinBBox } from "../util";
import { getConstructedRoads, storeNewFeatures } from "../context/cache";
import { TransportMode } from "../constants";

// We fetch data one tile at a time, which makes it easier
// to track which tiles we've fetched. To reduce API requests,
// the chunk zoom should be small, but not too small since the OSM API
// can only return 5,000 items per request.
const CHUNK_ZOOM = 16; // 16 is the same as what iD does

/** don't query data until the user is zoomed in further than this */
export const MIN_ZOOM = 17;

const alreadyQueried: Record<string, true> = {};

export const useOsmData = (
  mapExtent: BBox,
  zoom: number,
  transportMode: TransportMode,
) => {
  const mapExtentRef = useRef<BBox>(mapExtent);

  const [visibleFeatures, setVisibleFeatures] = useState<WayWithGeom[]>([]);
  const [onDataFetched, setOnDataFetched] = useState(0);

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
          .then((newData) => storeNewFeatures(newData, transportMode))
          // reactively inform anyone interested that new data has arrived
          .then(() => setOnDataFetched((c) => c + 1))

          .catch(console.error);
      }
    }
  }, [mapExtent, zoom, transportMode]);

  useEffect(() => {
    // when the transportMode changes, we need to recompute the graph.
    // so we pretend that new data was just fetched.
    storeNewFeatures([], transportMode);
    setOnDataFetched((c) => c + 1);
  }, [transportMode]);

  useEffect(() => {
    setVisibleFeatures(
      getConstructedRoads().filter((road) =>
        road.points.some((point) => isWithinBBox(point, mapExtent)),
      ),
    );
    // onDataFetched is deliberately a redundant dependency
  }, [mapExtent, onDataFetched]);

  return visibleFeatures;
};
