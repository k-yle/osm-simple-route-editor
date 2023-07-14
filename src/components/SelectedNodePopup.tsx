import { useContext } from "react";
import { Popup } from "react-leaflet";
import type { OsmNode } from "osm-api";
import type { RelationMember } from "../types";
import { EditorContext } from "../context";
import { t } from "../i18n";
import { osmGetName } from "../util";

// TODO: i18n

export const SelectedNodePopup: React.FC<{
  node: OsmNode;
  membership: RelationMember;
}> = ({ membership, node }) => {
  const { setRouteMembers } = useContext(EditorContext);

  const name = osmGetName(node.tags);

  function onClickChangeRole() {
    // eslint-disable-next-line no-alert -- TODO: remove
    const newRole = prompt(
      "Enter the new role (blank is allowed)",
      membership.role
    );

    // user cancelled
    if (newRole === null) return;

    // if the node appears multiple times, this will update all occurances
    setRouteMembers((c) => ({
      annotation: t("operation.change-node-role", { name, newRole }),
      value: c.map((thisMember) => {
        const isThisNode =
          thisMember.type === "node" && thisMember.ref === node.id;
        if (!isThisNode) return thisMember;

        return { ...thisMember, role: newRole };
      }),
    }));
  }

  function onClickRemove() {
    // if the node appears multiple times, this will remove all occurances
    setRouteMembers((c) => ({
      annotation: t("operation.deselect-node", { name }),
      value: c.filter(
        (thisMember) =>
          !(thisMember.type === "node" && thisMember.ref === node.id)
      ),
    }));
  }

  return (
    <Popup>
      “{name}” as “{membership.role}”
      <br />
      <button type="button" onClick={onClickChangeRole}>
        Change Role
      </button>
      <button type="button" onClick={onClickRemove}>
        Remove
      </button>
    </Popup>
  );
};
