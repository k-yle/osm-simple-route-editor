import { useState } from "react";
import { Button, Card, Center, Group, Text } from "@mantine/core";
import { Navbar } from "../components/Navbar";
import { t } from "../i18n";
import { EnterRelationIdModal } from "../components/EnterRelationIdModal";

export const SelectRelationPage: React.FC<{
  onSelect(relationId: number): Promise<void>;
}> = ({ onSelect }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      {showEditModal && (
        <EnterRelationIdModal
          onClose={() => setShowEditModal(false)}
          onSelect={onSelect}
        />
      )}
      <Navbar />
      <Center>
        <Card mt={64} shadow="sm" padding="lg" radius="md" w={500} withBorder>
          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>{t("SelectRelationPage.card-title")}</Text>
          </Group>

          <Button
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            onClick={() => onSelect(-1)}
          >
            {t("SelectRelationPage.new")}
          </Button>
          <Button
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            onClick={() => setShowEditModal(true)}
          >
            {t("SelectRelationPage.existing")}
          </Button>
        </Card>
      </Center>
    </>
  );
};
