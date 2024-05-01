import { MouseEventHandler } from "react";
import { ActionIcon } from "@mantine/core";
import { IconArrowBackUp, IconTrash } from "@tabler/icons-react";
import { t } from "../../i18n";

export const InlineUndoButton: React.FC<{
  onClick: MouseEventHandler;
  icon: "undo" | "delete";
}> = ({ onClick, icon }) => {
  const Icon = icon === "undo" ? IconArrowBackUp : IconTrash;
  const title = icon === "undo" ? t("command.undo") : t("command.remove");

  return (
    <ActionIcon
      variant="hover"
      onClick={onClick}
      title={title}
      display="inline-block"
      color="blue"
    >
      <Icon size="1rem" />
    </ActionIcon>
  );
};
