import {
  useState,
  createContext,
  useMemo,
  useCallback,
  PropsWithChildren,
} from "react";
import { OsmRelation, getFeature } from "osm-api";
import { Tags } from "../types";
import { SelectRelationPage } from "../pages";
import { version } from "../../package.json";
import { storeNewFeatures } from "./cache";
import {
  EditorHistory,
  SetEditorState,
  useEditorHistory,
} from "../hooks/useEditorHistory";

export const NEW_ROUTE: OsmRelation = {
  type: "relation",
  id: -1,
  changeset: -1,
  members: [],
  timestamp: new Date().toISOString(),
  uid: -1,
  user: "",
  version: 0,
  tags: {},
};

const DEFAULT_CHANGESET_TAGS = {
  created_by: `Simple Route Editor ${version}`,
  host: window.location.origin,
  locale: navigator.languages[0],
};

type IEditorContext = {
  route: OsmRelation;
  routeMembers: number[];
  setRouteMembers: SetEditorState<number[]>;
  routeMemberHistory: EditorHistory;
  changesetTags: Tags;
  setChangesetTags: SetState<Tags>;
};
export const EditorContext = createContext({} as IEditorContext);
EditorContext.displayName = "EditorContext";

export const EditorWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [route, setRoute] = useState<OsmRelation>();
  const [routeMembers, setRouteMembers, routeMemberHistory] = useEditorHistory<
    number[]
  >([]);
  const [changesetTags, setChangesetTags] = useState<Tags>(
    DEFAULT_CHANGESET_TAGS
  );

  const onSelectRouteId = useCallback(
    async (newRouteId: number) => {
      // user is creating a new relation
      if (newRouteId < 0) {
        setRoute({ ...NEW_ROUTE, id: newRouteId });
        return;
      }

      const features = await getFeature("relation", newRouteId, true);
      const newRoute = features.find(
        (r): r is OsmRelation => r.type === "relation" && r.id === newRouteId
      )!;

      // non-reactive updates first
      storeNewFeatures(features);

      setRoute(newRoute);
      setRouteMembers({
        annotation: "",
        value: newRoute.members
          .filter((f) => f.type === "way")
          .map((f) => f.ref),
      });
    },
    [setRouteMembers]
  );

  const context = useMemo<IEditorContext>(
    () => ({
      route: route!, // the non-null assertion is a lie between this line and the if statement below
      routeMembers,
      setRouteMembers,
      routeMemberHistory,
      changesetTags,
      setChangesetTags,
    }),
    [
      route,
      routeMembers,
      setRouteMembers,
      routeMemberHistory,
      changesetTags,
      setChangesetTags,
    ]
  );

  if (!route) {
    return <SelectRelationPage onSelect={onSelectRouteId} />;
  }

  return (
    <EditorContext.Provider value={context}>{children}</EditorContext.Provider>
  );
};
