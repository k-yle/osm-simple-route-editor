import { useEffect, useState, useMemo } from "react";
import whichPolygon from "which-polygon";
import type { BBox } from "osm-api";
import type { ELI, ELIGeoJson } from "../../types";

const isValid = (layer: ELI) =>
  (layer.type === "tms" ||
    (layer.type === "wms" &&
      layer.available_projections?.includes("EPSG:3857"))) &&
  !layer.name.includes(" Style)") &&
  !layer.url.includes("{apikey}");

/** @param mapExtent `GLOBAL_ONLY` means we only return worldwide layers */
export const useAvailableImagery = (mapExtent: BBox | "GLOBAL_ONLY") => {
  const [geojson, setGeoJson] = useState<ELIGeoJson>();

  useEffect(() => {
    fetch("https://osmlab.github.io/editor-layer-index/imagery.geojson")
      .then((r) => r.json())
      .then(setGeoJson)
      .catch(console.error);
  }, []);

  const availableLayers = useMemo(() => {
    if (!geojson) return [];

    const world = geojson.features
      .filter((x) => !x.geometry)
      .map((x) => x.properties)
      .filter(isValid);

    if (mapExtent === "GLOBAL_ONLY") return world;

    const nonWorld: ELIGeoJson = {
      features: geojson.features.filter((x) => x.geometry),
      type: "FeatureCollection",
    };

    const query = whichPolygon<ELI>(nonWorld);

    const local = query.bbox(mapExtent as never); // TODO: fix types
    return [
      ...local.filter(isValid).sort((a, b) => +!a.best - +!b.best),
      ...world,
    ];
  }, [geojson, mapExtent]);

  return availableLayers;
};
