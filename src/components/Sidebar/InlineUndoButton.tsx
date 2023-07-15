import { MouseEventHandler } from "react";
import { ActionIcon } from "@mantine/core";
import { IconArrowBackUp } from "@tabler/icons-react";
import { t } from "../../i18n";

export const InlineUndoButton: React.FC<{
  onClick: MouseEventHandler;
}> = ({ onClick }) => {
  return (
    <ActionIcon
      variant="hover"
      onClick={onClick}
      title={t("command.undo")}
      display="inline-block"
      color="blue"
    >
      <IconArrowBackUp size="1rem" />
    </ActionIcon>
  );
};
