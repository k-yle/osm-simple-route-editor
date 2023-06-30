import { useContext, useMemo } from "react";
import { createOsmChangeXml, uploadChangeset } from "osm-api";
import { AuthContext, EditorContext } from "../context";
import { useCreateOsmChange } from "../hooks";
import { osmCache } from "../context/cache";
import { downloadFile } from "../util";

export const Sidebar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const { route, routeMembers } = useContext(EditorContext);
  const createOsmChange = useCreateOsmChange();

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
      const { osmChange, finalCSTags } = createOsmChange();

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

  function onClickDownloadOsmChange() {
    const { osmChange, finalCSTags } = createOsmChange();

    const xmlString = createOsmChangeXml(-1, osmChange, finalCSTags);

    const xmlBlob = new Blob([xmlString], { type: "application/xml" });

    const fileName = `r${route.id}.osmChange`;
    downloadFile(fileName, xmlBlob);
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
      <button type="button" onClick={onClickDownloadOsmChange}>
        Download osmChange file
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
