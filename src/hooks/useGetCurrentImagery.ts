import { useCallback } from "react";
import { useMap } from "react-leaflet";

export const useGetCurrentImagery = () => {
  const map = useMap();

  const getCurrentImagery = useCallback(() => {
    let match: L.TileLayerOptions | undefined;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        match = layer.options;
      }
    });

    return match;
  }, [map]);

  return getCurrentImagery;
};
