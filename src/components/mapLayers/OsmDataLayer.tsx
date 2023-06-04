import { useContext, useState, useCallback } from "react";
import { Polyline, useMap, useMapEvents } from "react-leaflet";
import { BBox, OsmWay } from "osm-api";
import clsx from "clsx";
import { useOsmData } from "../../hooks";
import { tagsToClassName, toBBox } from "../../util";
import { EditorContext } from "../../context";

export const OsmDataLayer: React.FC = () => {
  const map = useMap();
  const { routeMembers, setRouteMembers } = useContext(EditorContext);

  const [extent, setExtent] = useState<BBox>(toBBox(map.getBounds()));
  const zoom = Math.round(map.getZoom());

  const visibleData = useOsmData(extent, zoom);

  const onClick = useCallback(
    (way: OsmWay) => {
      setRouteMembers((c) => {
        const selected = c.includes(way.id);

        // unselect this segment
        if (selected) return c.filter((id) => id !== way.id);

        // select this segment
        return [...c, way.id];
      });
    },
    [setRouteMembers]
  );

  useMapEvents({
    // at some point we might need to debounce this...
    moveend: () => setExtent(toBBox(map.getBounds())),
  });

  return (
    <>
      {visibleData.map((way) => {
        const selected = routeMembers.includes(way.id);

        if (zoom < 15 && !selected) return null;

        return (
          <Polyline
            key={`${way.id}${selected}`}
            className={clsx(tagsToClassName(way.tags!), selected && "selected")}
            positions={way.points}
            eventHandlers={{ click: () => onClick(way) }}
          />
        );
      })}
    </>
  );
};
