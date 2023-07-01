import { useContext } from "react";
import { MapContainer, ScaleControl } from "react-leaflet";
import { useHomeLocation } from "../hooks";
import { HooksLayer, ImageryLayer, MAX_ZOOM, OsmDataLayer } from "./mapLayers";
import classes from "./Map.module.scss";
import { MapContext } from "../context";

export const Map: React.FC = () => {
  const { setMap } = useContext(MapContext);
  const home = useHomeLocation();

  // TODO: i18n or better UX
  if (!home) return <>Loading…</>;

  return (
    <MapContainer
      center={[home.lat, home.lng]}
      zoom={home.z}
      scrollWheelZoom
      zoomSnap={0}
      className={classes.map}
      zoomDelta={0.2}
      maxZoom={MAX_ZOOM}
      ref={setMap}
    >
      <ScaleControl position="bottomleft" />
      <ImageryLayer />
      <OsmDataLayer />
      <HooksLayer />
    </MapContainer>
  );
};
