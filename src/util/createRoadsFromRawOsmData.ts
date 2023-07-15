import { Vec2, OsmCache, WayWithGeom } from "../types";
import { NETWORK_HEIRARCHY, TransportMode } from "../constants";
import { matchesFeatureQuery } from "./matchesFeatureQuery";

/**
 * NOTE: The term "road" means any linear function that is navigable
 * by the chosen mode of transport. So for trains/ferries, "roads" refers
 * to railways tracks etc.
 */
export function createRoadsFromRawOsmData(
  transportMode: TransportMode,
  rawOsmData: OsmCache,
): WayWithGeom[] {
  const featureQueries = NETWORK_HEIRARCHY[transportMode].features;
  const roads = Object.values(rawOsmData.way).filter((f) =>
    featureQueries.some(
      (query) => f.tags && matchesFeatureQuery(query, f.tags),
    ),
  );

  const withGeom = roads
    .map((road): WayWithGeom | undefined => {
      const points: Vec2[] = [];
      for (const nId of road.nodes) {
        const feature = rawOsmData.node[nId];

        // it's possible that the API didn't return all the nodes that we need,
        // if that happens we can't use this feature.
        if (!feature) return undefined;

        points.push([feature.lat, feature.lon]);
      }
      return { ...road, points };
    })
    .filter((fOrNill): fOrNill is WayWithGeom => !!fOrNill);

  return withGeom;
}
