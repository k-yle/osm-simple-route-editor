import { useContext } from "react";
import type { OsmChange, OsmRelation } from "osm-api";
import { EditorContext } from "../context";
import { osmGetName } from "../util";
import { t } from "../i18n";

export const useCreateOsmChange = () => {
  const { route, routeMembers, changesetTags } = useContext(EditorContext);

  return function createOsmChange() {
    const isCreatingNew = route.id < 0;

    const osmChange: OsmChange = { create: [], modify: [], delete: [] };

    const newRelation: OsmRelation = {
      ...route,
      members: routeMembers,
    };
    if (isCreatingNew) {
      osmChange.create.push(newRelation);
    } else {
      osmChange.modify.push(newRelation);
    }

    const finalCSTags = {
      ...changesetTags,
      comment: isCreatingNew
        ? t("useCreateOsmChange.changeset-comment.create")
        : t("useCreateOsmChange.changeset-comment.edit", {
            name: osmGetName(route.tags),
          }),
    };

    return { osmChange, finalCSTags };
  };
};
