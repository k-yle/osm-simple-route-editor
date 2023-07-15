import { useContext } from "react";
import { Card, Text } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { EditorContext } from "../../context";
import { osmGetName } from "../../util";
import { EditorControlButtons } from "./EditorControlButtons";
import { t } from "../../i18n";
import { RelationMemberList } from "./RelationMemberList";

export const Sidebar: React.FC = () => {
  const { route } = useContext(EditorContext);

  const isCreatingNew = route.id < 0;

  return (
    <>
      <EditorControlButtons />

      <Card shadow="sm" padding="sm" m={16}>
        {isCreatingNew ? (
          t("Sidebar.new-relation")
        ) : (
          <Text
            variant="link"
            component="a"
            color="blue"
            href={`https://osm.org/relation/${route.id}`}
            target="_blank"
            rel="noreferrer"
          >
            {osmGetName(route.tags)} <IconExternalLink size="1rem" />
          </Text>
        )}
      </Card>

      <RelationMemberList />
    </>
  );
};
