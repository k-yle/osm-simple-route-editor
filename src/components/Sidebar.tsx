import { useContext, useMemo } from "react";
import { OsmChange, OsmRelation, uploadChangeset } from "osm-api";
import { AuthContext, EditorContext } from "../context";
import { osmCache } from "../hooks";

export const Sidebar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const { route, routeMembers, changesetTags } = useContext(EditorContext);

  const originalMembers = useMemo(
    () =>
      new Set(route.members.filter((f) => f.type === "way").map((f) => f.ref)),
    [route]
  );

  const { removed, uniqMembers } = useMemo(
    () => ({
      removed: [...originalMembers].filter((id) => !routeMembers.includes(id)),
      uniqMembers: [...new Set(routeMembers)],
    }),
    [routeMembers, originalMembers]
  );

  const isCreatingNew = route.id < 0;

  async function onClickSave() {
    try {
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
        created_by: "Simple Route Editor 1.0.0",
        comment: isCreatingNew
          ? "Create route relation"
          : `Update route relation “${route.tags!.ref || ""} ${
              route.tags!.name || ""
            }”`,
      };
      console.log({ osmChange, finalCSTags });

      // eslint-disable-next-line no-alert, no-restricted-globals
      if (!confirm("u sure u want to save?")) return;

      const csId = await uploadChangeset(finalCSTags, osmChange);
      window.open(`https://osm.org/changeset/${csId}`, "_blank");
      window.location.reload();
    } catch (ex) {
      console.error(ex);
      // eslint-disable-next-line no-alert
      alert("failed to save soz");
    }
  }

  return (
    <>
      Hi {user.display_name}. Version {VERSION}{" "}
      <button type="button" onClick={logout}>
        Logout
      </button>
      <hr />
      You are editting:{" "}
      {isCreatingNew ? (
        "New Relation"
      ) : (
        <a
          href={`https://osm.org/relation/${route.id}`}
          target="_blank"
          rel="noreferrer"
        >
          {route.tags!.ref} {route.tags!.name} from {route.tags!.from} to{" "}
          {route.tags!.to}
        </a>
      )}
      <hr />
      <button type="button" onClick={onClickSave}>
        Save
      </button>
      <hr />
      {uniqMembers.length} members:
      <ul>
        {uniqMembers.map((id) => {
          const isNew = !originalMembers.has(id);
          return (
            <li key={id} style={{ color: isNew ? "green" : "inherit" }}>
              {osmCache.way[id]?.tags?.name || id}
              {/* TODO: undo button */}
            </li>
          );
        })}
        {removed.map((id) => (
          <li key={id} style={{ color: "red" }}>
            {osmCache.way[id]?.tags?.name || id}
            {/* TODO: undo button */}
          </li>
        ))}
      </ul>
    </>
  );
};
