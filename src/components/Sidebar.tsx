import { useContext, useMemo } from "react";
import { createOsmChangeXml, uploadChangeset } from "osm-api";
import { AuthContext, EditorContext } from "../context";
import { useCreateOsmChange, useOnSelectWay } from "../hooks";
import { osmCache } from "../context/cache";
import { downloadFile, osmGetName } from "../util";

export const Sidebar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const { route, routeMembers, routeMemberHistory } = useContext(EditorContext);
  const createOsmChange = useCreateOsmChange();
  const onSelectWay = useOnSelectWay();

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
      Hi {user.display_name}.
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
      <button
        type="button"
        onClick={() => routeMemberHistory.undo()}
        disabled={!routeMemberHistory.canUndo}
      >
        Undo
      </button>
      <button
        type="button"
        onClick={routeMemberHistory.redo}
        disabled={!routeMemberHistory.canRedo}
      >
        Redo
      </button>
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
          const way = osmCache.way[id];
          const isNew = !originalMembers.has(id);
          return (
            <li key={id} style={{ color: isNew ? "green" : "inherit" }}>
              {way ? osmGetName(way.tags) : "Unknown"}
              &nbsp;
              {isNew && (
                <button type="button" onClick={() => onSelectWay(way)}>
                  Undo
                </button>
              )}
            </li>
          );
        })}
        {removed.map((id) => {
          const way = osmCache.way[id];
          return (
            <li key={id} style={{ color: "red" }}>
              {osmGetName(way?.tags)}
              &nbsp;
              <button type="button" onClick={() => onSelectWay(way)}>
                Undo
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
};
