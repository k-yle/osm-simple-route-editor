import { useContext } from "react";
import type { OsmChange, OsmRelation } from "osm-api";
import { EditorContext } from "../context";

export const useCreateOsmChange = () => {
  const { route, routeMembers, changesetTags } = useContext(EditorContext);

  return function createOsmChange() {
    const isCreatingNew = route.id < 0;

    const osmChange: OsmChange = { create: [], modify: [], delete: [] };

    const newRelation: OsmRelation = {
      ...route,
      members: [
        // unchanged non-way members
        ...route.members.filter((m) => m.type !== "way"),
        // final list of ways
        ...routeMembers.map((ref): OsmRelation["members"][number] => ({
          type: "way",
          ref,
          role: "",
        })),
      ],
    };
    if (isCreatingNew) {
      osmChange.create.push(newRelation);
    } else {
      osmChange.modify.push(newRelation);
    }

    const finalCSTags = {
      ...changesetTags,
      comment: isCreatingNew
        ? "Create route relation"
        : `Update route relation “${route.tags!.ref || ""} ${
            route.tags!.name || ""
          }”`,
    };

    return { osmChange, finalCSTags };
  };
};
