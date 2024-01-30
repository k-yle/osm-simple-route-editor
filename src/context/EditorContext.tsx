import {
  useState,
  createContext,
  useMemo,
  useCallback,
  PropsWithChildren,
} from "react";
import { OsmRelation, getFeature } from "osm-api";
import { unstable_batchedUpdates as batch } from "react-dom";
import { RelationMember, Tags } from "../types";
import { SelectRelationPage } from "../pages";
import { version } from "../../package.json";
import { storeNewFeatures } from "./cache";
import { locale } from "../i18n";
import {
  EditorHistory,
  SetEditorState,
  useEditorHistory,
  usePreventTabClosure,
} from "../hooks/generic";

export const NEW_ROUTE: OsmRelation = {
  type: "relation",
  id: -1,
  changeset: -1,
  members: [],
  timestamp: new Date().toISOString(),
  uid: -1,
  user: "",
  version: 0,
  tags: { type: "route" },
};

const DEFAULT_CHANGESET_TAGS = {
  created_by: `Simple Route Editor ${version}`,
  host: window.location.origin,
  locale,
};

type IEditorContext = {
  route: OsmRelation;
  routeMembers: RelationMember[];
  setRouteMembers: SetEditorState<RelationMember[]>;
  routeMemberHistory: EditorHistory;
  changesetTags: Tags;
  setChangesetTags: SetState<Tags>;

  resetEditor(): void;
};
export const EditorContext = createContext({} as IEditorContext);
EditorContext.displayName = "EditorContext";

export const EditorWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [route, setRoute] = useState<OsmRelation>();
  const [routeMembers, setRouteMembers, routeMemberHistory] = useEditorHistory<
    RelationMember[]
  >([]);
  const [changesetTags, setChangesetTags] = useState<Tags>(
    DEFAULT_CHANGESET_TAGS,
  );

  usePreventTabClosure(routeMemberHistory.anyChanges);

  const resetEditor = useCallback(() => {
    setRouteMembers({ annotation: "", value: [] });
    routeMemberHistory.clearHistory();
    setChangesetTags(DEFAULT_CHANGESET_TAGS);
    setRoute(undefined);
  }, [setRouteMembers, routeMemberHistory]);

  const onSelectRouteId = useCallback(
    async (newRouteId: number) => {
      // user is creating a new relation
      if (newRouteId < 0) {
        setRoute({ ...NEW_ROUTE, id: newRouteId });
        return;
      }

      const features = await getFeature("relation", newRouteId, true);
      const newRoute = features.find(
        (r): r is OsmRelation => r.type === "relation" && r.id === newRouteId,
      )!;

      // non-reactive updates first
      storeNewFeatures(features);

      batch(() => {
        setRoute(newRoute);
        setRouteMembers({
          annotation: "",
          value: newRoute.members,
        });
      });
    },
    [setRouteMembers],
  );

  const context = useMemo<IEditorContext>(
    () => ({
      route: route!, // the non-null assertion is a lie between this line and the if statement below
      routeMembers,
      setRouteMembers,
      routeMemberHistory,
      changesetTags,
      setChangesetTags,
      resetEditor,
    }),
    [
      route,
      routeMembers,
      setRouteMembers,
      routeMemberHistory,
      changesetTags,
      setChangesetTags,
      resetEditor,
    ],
  );

  if (!route) {
    return <SelectRelationPage onSelect={onSelectRouteId} />;
  }

  return (
    <EditorContext.Provider value={context}>{children}</EditorContext.Provider>
  );
};
