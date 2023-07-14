import { useContext } from "react";
import { Marker } from "react-leaflet";
import { EditorContext } from "../../context";
import { osmCache } from "../../context/cache";
import { osmGetName } from "../../util";
import { SelectedNodePopup } from "../SelectedNodePopup";

export const SelectedNodesLayer: React.FC = () => {
  const { routeMembers } = useContext(EditorContext);

  const nodes = routeMembers.filter((member) => member.type === "node");
  return (
    <>
      {nodes.map((member) => {
        // TODO: this is not reactive
        const node = osmCache.node[member.ref];

        // hasn't been downloaded yet.
        if (!node) return null;

        const name = osmGetName(node.tags);
        const title = name.isNoName
          ? member.role
          : `“${member.role}”: “${name}”`;

        return (
          <Marker
            key={`n${node.id}`}
            position={{ lat: node.lat, lng: node.lon }}
            title={title}
          >
            <SelectedNodePopup node={node} membership={member} />
          </Marker>
        );
      })}
    </>
  );
};
