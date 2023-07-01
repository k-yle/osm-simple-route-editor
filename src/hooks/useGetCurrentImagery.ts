import { useContext, useCallback } from "react";
import { MapContext } from "../context";

export const useGetCurrentImagery = () => {
  const { map } = useContext(MapContext);

  const getCurrentImagery = useCallback(() => {
    let match: L.TileLayerOptions | undefined;

    // map hasn't initialised yet
    if (!map) return undefined;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        match = layer.options;
      }
    });

    return match;
  }, [map]);

  return getCurrentImagery;
};
