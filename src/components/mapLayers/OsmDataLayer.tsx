import { useState } from "react";
import { Polyline, useMap, useMapEvents } from "react-leaflet";
import { BBox } from "osm-api";
import { useOsmData } from "../../hooks";
import { tagsToClassName, toBBox } from "../../util";

export const OsmDataLayer: React.FC = () => {
  const map = useMap();

  const [extent, setExtent] = useState<BBox>(toBBox(map.getBounds()));

  const visibleData = useOsmData(extent, Math.round(map.getZoom()));

  useMapEvents({
    // at some point we might need to debounce this...
    moveend: () => setExtent(toBBox(map.getBounds())),

    click: (e) => console.log("click", e),
  });

  return (
    <>
      {visibleData.map((way) => (
        <Polyline
          key={way.id}
          className={tagsToClassName(way.tags!)}
          positions={way.points}
        />
      ))}
    </>
  );
};
