import { useContext } from "react";
import { Alert, Button, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconExternalLink } from "@tabler/icons-react";
import { EditorContext } from "../../context";
import { getIsSorted } from "../../util/osm/sorting/getIsSorted";
import { trySortRelation } from "../../util/osm/sorting/trySortRelation";
import { osmGetName } from "../../util";
import { osmCache } from "../../context/cache";
import { t } from "../../i18n";

export const RelationSortStatus: React.FC = () => {
  const { routeMembers, setRouteMembers } = useContext(EditorContext);

  const isSorted = getIsSorted(routeMembers);

  // not fully downloaded yet
  if (isSorted === undefined) return null;

  // no validation issues
  if (isSorted === true) return null;

  const onClickSort = () => {
    const sorted = trySortRelation(routeMembers);
    if (!sorted) {
      notifications.show({
        color: "red",
        title: t("RelationSortStatus.sort-error.title"),
        message: t("RelationSortStatus.sort-error.subtitle"),
      });
      return;
    }
    setRouteMembers({ annotation: t("operation.sort"), value: sorted });
  };

  const firstProblematicWay = osmCache.way[isSorted];

  return (
    <Alert variant="light" color="yellow" title="Route is not sorted.">
      {t("RelationSortStatus.validator-warning.subtitle")}{" "}
      <Text
        variant="link"
        component="a"
        color="blue"
        href={`https://osm.org/way/${isSorted}`}
        target="_blank"
        rel="noreferrer"
      >
        {firstProblematicWay
          ? osmGetName(firstProblematicWay.tags)
          : `w${isSorted}`}{" "}
        <IconExternalLink size="1rem" />
      </Text>
      <Button size="xs" onClick={onClickSort}>
        {t("RelationSortStatus.button-fix")}
      </Button>
    </Alert>
  );
};
