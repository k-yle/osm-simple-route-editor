import { MapContainer, ScaleControl } from "react-leaflet";
import { useHomeLocation } from "../hooks";
import { HooksLayer, ImageryLayer, OsmDataLayer } from "./mapLayers";
import classes from "./Map.module.css";

export const Map: React.FC = () => {
  const home = useHomeLocation();

  if (!home) return <>Loading…</>;

  return (
    <MapContainer
      center={[home.lat, home.lng]}
      zoom={home.z}
      scrollWheelZoom
      zoomSnap={0}
      className={classes.map}
      zoomDelta={0.2}
    >
      <ScaleControl position="bottomleft" />
      <ImageryLayer />
      <OsmDataLayer />
      <HooksLayer />
    </MapContainer>
  );
};
