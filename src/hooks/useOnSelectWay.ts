import { useCallback, useContext } from "react";
import type { OsmWay } from "osm-api";
import { EditorContext } from "../context";
import { useGetCurrentImagery } from "./useGetCurrentImagery";

export const useOnSelectWay = () => {
  const { changesetTags, setChangesetTags, setRouteMembers } =
    useContext(EditorContext);
  const getCurrentImagery = useGetCurrentImagery();

  const onSelectWay = useCallback(
    (way: OsmWay) => {
      // first update the actual route data
      setRouteMembers((c) => {
        const selected = c.includes(way.id);

        // unselect this segment
        if (selected) return c.filter((id) => id !== way.id);

        // select this segment
        return [...c, way.id];
      });

      // then store the imagery used for this operation
      const imagery = getCurrentImagery();
      if (imagery) {
        const imageryUsed = new Set(changesetTags.imagery_used?.split(";"));
        if (!imageryUsed.has(imagery.name)) {
          imageryUsed.add(imagery.name);
          setChangesetTags((tags) => ({
            ...tags,
            imagery_used: [...imageryUsed].join(";"),
          }));
        }
      }
    },
    [setRouteMembers, getCurrentImagery, changesetTags, setChangesetTags]
  );

  return onSelectWay;
};
