import { useContext } from "react";
import { Alert, Group } from "@mantine/core";
import { modals } from "@mantine/modals";
import { createOsmChangeXml, uploadChangeset } from "osm-api";
import {
  IconAlertCircle,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconDeviceFloppy,
  IconDownload,
  IconTrash,
} from "@tabler/icons-react";
import { useCreateOsmChange } from "../../hooks";
import { EditorContext } from "../../context";
import { downloadFile } from "../../util";
import { LabelledIconButton } from "./LabelledIconButton";
import { openConfirmModal } from "../Modal";
import { t } from "../../i18n";

export const EditorControlButtons: React.FC = () => {
  const { route, routeMemberHistory, resetEditor } = useContext(EditorContext);
  const createOsmChange = useCreateOsmChange();

  const onClickCancel = async () => {
    const shouldContinue = await openConfirmModal({
      title: t("command.quit"),
      children: t("command.quit.confirm.description"),
      confirmProps: { color: "red" },
      labels: {
        cancel: t("generic.cancel"),
        confirm: t("command.quit"),
      },
    });

    if (!shouldContinue) return;

    resetEditor();
  };

  const onClickSave = async () => {
    try {
      const shouldContinue = await openConfirmModal({
        title: t("command.save.confirm.title"),
        children: t("command.save.confirm.description"),
      });

      if (!shouldContinue) return;

      const { osmChange, finalCSTags } = createOsmChange();

      const csId = await uploadChangeset(finalCSTags, osmChange);
      window.open(`https://osm.org/changeset/${csId}`, "_blank");

      resetEditor();
    } catch (ex) {
      console.error(ex);
      modals.open({
        title: t("command.save.error.title"),
        children: (
          <Alert icon={<IconAlertCircle size="1rem" />} color="red">
            {t("command.save.error.description")}
          </Alert>
        ),
        zIndex: 1001,
      });
    }
  };

  const onClickDownloadOsmChange = () => {
    const { osmChange, finalCSTags } = createOsmChange();

    const xmlString = createOsmChangeXml(-1, osmChange, finalCSTags);

    const xmlBlob = new Blob([xmlString], { type: "application/xml" });

    const fileName = `r${route.id}.osmChange`;
    downloadFile(fileName, xmlBlob);
  };

  return (
    <Group display="flex" position="center" m={8}>
      <LabelledIconButton
        Icon={IconArrowBackUp}
        label={t("command.undo")}
        onClick={() => routeMemberHistory.undo()}
        disabled={!routeMemberHistory.canUndo}
        title={routeMemberHistory.canUndo || undefined}
      />

      <LabelledIconButton
        Icon={IconArrowForwardUp}
        label={t("command.redo")}
        onClick={routeMemberHistory.redo}
        disabled={!routeMemberHistory.canRedo}
        title={routeMemberHistory.canRedo || undefined}
      />

      <LabelledIconButton
        label={t("command.save")}
        Icon={IconDeviceFloppy}
        onClick={onClickSave}
        disabled={!routeMemberHistory.anyChanges}
      />
      <LabelledIconButton
        label={t("command.export")}
        title={t("command.export.help")}
        Icon={IconDownload}
        onClick={onClickDownloadOsmChange}
        disabled={!routeMemberHistory.anyChanges}
      />
      <LabelledIconButton
        label={t("command.quit")}
        color="red"
        Icon={IconTrash}
        onClick={onClickCancel}
      />
    </Group>
  );
};
