import { useRef, useCallback } from "react";
import L from "leaflet";
import { LayersControl, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useAvailableImagery, useKeyboardShortcut } from "../../hooks";
import { attributionToHtml, convertTileUrl, toBBox } from "../../util";

export const MAX_ZOOM = 23;

export const ImageryLayer: React.FC = () => {
  const map = useMap();
  const allLayers = useRef<L.TileLayer[]>([]);
  const mostRecentLayers = useRef<string[]>([]);

  useMapEvents({
    baselayerchange: (event) => {
      if (mostRecentLayers.current.length > 3) {
        mostRecentLayers.current.length = 3;
      }
      if (event.layer instanceof L.TileLayer) {
        mostRecentLayers.current.unshift(event.layer.options.id!);
      }
    },
  });

  const imageryList = useAvailableImagery(toBBox(map.getBounds())).filter(
    // this causes a crash in leaflet, unclear why
    (c) => !c.url.includes("bbox"),
  );

  const toggleImagery = useCallback(() => {
    const mostRecent = allLayers.current.find(
      (l) => l.options.id === mostRecentLayers.current[1],
    );
    if (!mostRecent) return;

    const activeLayers: L.TileLayer[] = [];
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) activeLayers.push(layer);
    });

    map.addLayer(mostRecent);
    for (const layer of activeLayers) {
      map.removeLayer(layer);
    }
  }, [map]);

  useKeyboardShortcut("b", toggleImagery);

  return (
    <LayersControl position="topright">
      {imageryList.map((imagery, index) => (
        <LayersControl.BaseLayer
          checked={index === 0}
          name={
            (imagery.best || imagery.id === "MAPNIK" ? "⭐ " : "") +
            imagery.name
          }
          key={imagery.name}
        >
          <TileLayer
            id={imagery.id}
            name={imagery.name}
            attribution={attributionToHtml(imagery.attribution)}
            url={convertTileUrl(imagery.url)}
            ref={(l) => {
              if (l) allLayers.current[index] = l;
            }}
            maxNativeZoom={imagery.max_zoom}
            minNativeZoom={imagery.min_zoom}
            maxZoom={MAX_ZOOM}
          />
        </LayersControl.BaseLayer>
      ))}
    </LayersControl>
  );
};
