import { useMap, useMapEvents } from "react-leaflet";

export const HooksLayer: React.FC = () => {
  const map = useMap();

  useMapEvents({
    dragend: () => {
      const { lat, lng } = map.getCenter();
      const zoom = Math.round(map.getZoom());
      localStorage.mapExtent = `${zoom}/${lat.toFixed(4)}/${lng.toFixed(4)}`;
    },
  });

  return null;
};
