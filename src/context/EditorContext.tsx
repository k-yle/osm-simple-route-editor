import { useState, createContext, useMemo, PropsWithChildren } from "react";
import type { OsmRelation } from "osm-api";
import { Tags } from "../types";

type IEditorContext = {
  currentRoute: OsmRelation | undefined;
  setCurrentRoute: SetState<OsmRelation | undefined>;
  changesetTags: Tags;
  setChangesetTags: SetState<Tags>;
};
export const EditorContext = createContext({} as IEditorContext);

export const EditorWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<OsmRelation>();
  const [changesetTags, setChangesetTags] = useState<Tags>({});

  const ctx = useMemo(
    () => ({ currentRoute, setCurrentRoute, changesetTags, setChangesetTags }),
    [currentRoute, setCurrentRoute, changesetTags, setChangesetTags]
  );

  return (
    <EditorContext.Provider value={ctx}>{children}</EditorContext.Provider>
  );
};
