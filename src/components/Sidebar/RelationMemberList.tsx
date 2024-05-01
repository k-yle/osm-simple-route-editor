import { useContext, useMemo } from "react";
import { Container, List, ThemeIcon, Title } from "@mantine/core";
import {
  IconCircleDot,
  IconCircleMinus,
  IconCirclePlus,
} from "@tabler/icons-react";
import { OnDragEndResponder } from "@hello-pangea/dnd";
import { notifications } from "@mantine/notifications";
import { EditorContext } from "../../context";
import { useOnSelectWay } from "../../hooks";
import { osmCache } from "../../context/cache";
import { osmGetName, getWayIdsFromMembers } from "../../util";
import { InlineUndoButton } from "./InlineUndoButton";
import { t } from "../../i18n";
import { RelationSortStatus } from "./RelationSortStatus";
import { swapArrayItem } from "../../util/general/object";
import { DragAndDrop } from "../DragAndDrop";

export const RelationMemberList: React.FC = () => {
  const { route, routeMembers, setRouteMembers } = useContext(EditorContext);
  const onSelectWay = useOnSelectWay();

  const originalMembers = useMemo(
    () => new Set(getWayIdsFromMembers(route.members)),
    [route],
  );

  // this only considers way members
  const { removed, uniqMembers } = useMemo(() => {
    const allWayIDs = getWayIdsFromMembers(routeMembers);
    const allWayIDsSet = new Set(allWayIDs);

    return {
      removed: [...originalMembers].filter((id) => !allWayIDsSet.has(id)),
      uniqMembers: allWayIDs,
    };
  }, [routeMembers, originalMembers]);

  const onDragEnd: OnDragEndResponder = ({ destination, source }) => {
    // indexes in the filtered array (which contains only roads/rails)
    const _fromIndex = source.index;
    const _toIndex = destination?.index || 0;

    // way IDs
    const fromWayId = uniqMembers[_fromIndex];
    const toWayId = uniqMembers[_toIndex];

    const isDuplicate =
      uniqMembers.indexOf(fromWayId) !== uniqMembers.lastIndexOf(fromWayId) ||
      uniqMembers.indexOf(toWayId) !== uniqMembers.lastIndexOf(toWayId);

    if (isDuplicate) {
      notifications.show({
        color: "red",
        title: t("RelationMemberList.error-reorder-duplicate.title"),
        message: t("RelationMemberList.error-reorder-duplicate.subtitle"),
      });
      return;
    }

    // indexes in the original array of every relation member
    const fromIndex = routeMembers.findIndex(
      (m) => m.type === "way" && !m.role && m.ref === fromWayId,
    );
    const toIndex = routeMembers.findIndex(
      (m) => m.type === "way" && !m.role && m.ref === toWayId,
    );

    const updatedArray = swapArrayItem(routeMembers, fromIndex, toIndex);
    setRouteMembers({
      annotation: t("operation.reorder-ways"),
      value: updatedArray,
    });
  };

  return (
    <Container m={2}>
      <Title order={3}>
        {t("RelationMemberList.member-list-header", { n: uniqMembers.length })}
      </Title>
      <RelationSortStatus />
      <List
        mt={8}
        spacing="xs"
        size="sm"
        center
        icon={
          <ThemeIcon color="grey" size={24} radius="xl">
            <IconCircleDot size="1rem" />
          </ThemeIcon>
        }
        withPadding
      >
        <DragAndDrop
          onDragEnd={onDragEnd}
          data={uniqMembers.map((id, index) => {
            const key = `${id}-${index}`;
            const way = osmCache.way[id];
            const isNew = !originalMembers.has(id);

            const label = way
              ? osmGetName(way.tags)
              : t("Sidebar.unknown-relation-member");

            const jsx = (
              <List.Item
                icon={
                  isNew && (
                    <ThemeIcon color="green" size={24} radius="xl">
                      <IconCirclePlus size="1rem" />
                    </ThemeIcon>
                  )
                }
              >
                {label}
                &nbsp;
                <InlineUndoButton
                  icon={isNew ? "undo" : "delete"}
                  onClick={() => onSelectWay(way)}
                />
              </List.Item>
            );
            return { jsx, key };
          })}
        />
        {removed.map((id, index) => {
          const key = `${id}-${index}`;
          const way = osmCache.way[id];
          return (
            <List.Item
              key={key}
              icon={
                <ThemeIcon color="red" size={24} radius="xl">
                  <IconCircleMinus size="1rem" />
                </ThemeIcon>
              }
            >
              {osmGetName(way?.tags)}
              &nbsp;
              <InlineUndoButton icon="undo" onClick={() => onSelectWay(way)} />
            </List.Item>
          );
        })}
      </List>
    </Container>
  );
};
