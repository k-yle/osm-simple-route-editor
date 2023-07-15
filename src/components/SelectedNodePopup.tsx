import { useContext } from "react";
import { Popup } from "react-leaflet";
import type { OsmNode } from "osm-api";
import { Button, Code } from "@mantine/core";
import type { RelationMember } from "../types";
import { EditorContext } from "../context";
import { t } from "../i18n";
import { osmGetName } from "../util";

export const SelectedNodePopup: React.FC<{
  node: OsmNode;
  membership: RelationMember;
}> = ({ membership, node }) => {
  const { setRouteMembers } = useContext(EditorContext);

  const name = osmGetName(node.tags);

  const onClickChangeRole = () => {
    // eslint-disable-next-line no-alert -- TODO: create mantine prompt function
    const newRole = prompt(
      t("SelectedNodePopup.temp-prompt-text"),
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
  };

  const onClickRemove = () => {
    // if the node appears multiple times, this will remove all occurances
    setRouteMembers((c) => ({
      annotation: t("operation.deselect-node", { name }),
      value: c.filter(
        (thisMember) =>
          !(thisMember.type === "node" && thisMember.ref === node.id)
      ),
    }));
  };

  return (
    <Popup>
      {t("SelectedNodePopup.label", {
        name: <Code key="name">{name}</Code>,
        role: <Code key="role">{membership.role}</Code>,
      })}
      <br />
      <Button size="xs" m={2} onClick={onClickChangeRole}>
        {t("SelectedNodePopup.btn-change-role")}
      </Button>
      <Button size="xs" color="red" m={2} onClick={onClickRemove}>
        {t("SelectedNodePopup.btn-remove-node")}
      </Button>
    </Popup>
  );
};
