import { useContext, useState } from "react";
import { Polyline, useMap, useMapEvents } from "react-leaflet";
import { BBox } from "osm-api";
import clsx from "clsx";
import {
  useOsmData,
  useOnSelectWay,
  useKeyboardShortcut,
  useFollowOperation,
} from "../../hooks";
import { tagsToClassName, toBBox } from "../../util";
import { EditorContext } from "../../context";
import { SettingsContext } from "../../context/SettingsContext";

export const OsmDataLayer: React.FC = () => {
  const map = useMap();
  const { routeMembers } = useContext(EditorContext);
  const { transportMode } = useContext(SettingsContext);

  const onSelectWay = useOnSelectWay();

  const [extent, setExtent] = useState<BBox>(toBBox(map.getBounds()));
  const zoom = Math.round(map.getZoom());

  const visibleData = useOsmData(extent, zoom, transportMode);

  useMapEvents({
    // at some point we might need to debounce this...
    moveend: () => setExtent(toBBox(map.getBounds())),
  });

  const followOperation = useFollowOperation();
  useKeyboardShortcut("f", followOperation);

  return (
    <>
      {visibleData.map((way) => {
        const selected = routeMembers.some((member) => member.ref === way.id);

        if (zoom < 15 && !selected) return null;

        return (
          <Polyline
            // `selected` is part of the key because we need to force
            // react-leaflet to apply the new classname, which it only
            // does when the component is created
            key={`${way.id}${selected}`}
            className={clsx(tagsToClassName(way.tags!), selected && "selected")}
            positions={way.points}
            eventHandlers={{ click: () => onSelectWay(way) }}
          />
        );
      })}
    </>
  );
};
