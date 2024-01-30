import { useContext, useMemo } from "react";
import { Container, List, ThemeIcon, Title } from "@mantine/core";
import {
  IconCircleDot,
  IconCircleMinus,
  IconCirclePlus,
} from "@tabler/icons-react";
import { EditorContext } from "../../context";
import { useOnSelectWay } from "../../hooks";
import { osmCache } from "../../context/cache";
import { osmGetName, getWayIdsFromMembers } from "../../util";
import { InlineUndoButton } from "./InlineUndoButton";
import { t } from "../../i18n";
import { RelationSortStatus } from "./RelationSortStatus";

export const RelationMemberList: React.FC = () => {
  const { route, routeMembers } = useContext(EditorContext);
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
        {uniqMembers.map((id) => {
          const way = osmCache.way[id];
          const isNew = !originalMembers.has(id);

          const label = way
            ? osmGetName(way.tags)
            : t("Sidebar.unknown-relation-member");

          if (isNew) {
            return (
              <List.Item
                key={id}
                icon={
                  <ThemeIcon color="green" size={24} radius="xl">
                    <IconCirclePlus size="1rem" />
                  </ThemeIcon>
                }
              >
                {label}
                &nbsp;
                <InlineUndoButton onClick={() => onSelectWay(way)} />
              </List.Item>
            );
          }

          return <List.Item key={id}>{label}</List.Item>;
        })}
        {removed.map((id) => {
          const way = osmCache.way[id];
          return (
            <List.Item
              key={id}
              icon={
                <ThemeIcon color="red" size={24} radius="xl">
                  <IconCircleMinus size="1rem" />
                </ThemeIcon>
              }
            >
              {osmGetName(way?.tags)}
              &nbsp;
              <InlineUndoButton onClick={() => onSelectWay(way)} />
            </List.Item>
          );
        })}
      </List>
    </Container>
  );
};
