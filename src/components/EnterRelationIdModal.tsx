import { useState, ClipboardEventHandler, FormEventHandler } from "react";
import { Alert, Button, Modal, NumberInput } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { t } from "../i18n";

const OSM_RELATION_URL_PREFIXES = [
  "https://openstreetmap.org/relation/",
  "https://www.openstreetmap.org/relation/",
  "https://osm.org/relation/",
  "https://www.osm.org/relation/",
];

function parsePastedRelationId(pastedText: string) {
  // maybe they pasted something like "r123"
  if (/^r\d+$/.test(pastedText)) return pastedText.replace("r", "");

  // maybe they pasted the full URL
  for (const prefix of OSM_RELATION_URL_PREFIXES) {
    if (pastedText.startsWith(prefix)) {
      // also remove URL query paramters and hash if they exist
      return pastedText.replace(prefix, "").split("?")[0].split("#")[0];
    }
  }

  // else, just return what they pasted
  return pastedText;
}

/**
 * we interrupt the onPaste event so we can parse
 * what they pasted into the relation number.
 */
const onPaste: ClipboardEventHandler = (event) => {
  event.preventDefault();

  const originalText = event.clipboardData.getData("text");
  const finalText = parsePastedRelationId(originalText);

  document.execCommand("insertText", false, finalText);
};

enum State {
  Idle,
  Loading,
  Error,
}

export const EnterRelationIdModal: React.FC<{
  onSelect(relationId: number): Promise<void>;
  onClose(): void;
}> = ({ onClose, onSelect }) => {
  const [state, setState] = useState(State.Idle);
  const [id, setId] = useState<number | "">("");

  const onSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    if (id === "") return;

    try {
      setState(State.Loading);
      await onSelect(id);
      // if we get to here, this component will be
      // unmounted in a split second
    } catch {
      setState(State.Error);
    }
  };

  return (
    <Modal
      opened
      onClose={onClose}
      title={t("EnterRelationIdModal.modal-title")}
    >
      {t("EnterRelationIdModal.info")}

      {state === State.Error && (
        <Alert icon={<IconAlertCircle size="1rem" />} color="red" mt={16}>
          {t("EnterRelationIdModal.api-error")}
        </Alert>
      )}
      <form onSubmit={onSubmit}>
        <NumberInput
          value={id}
          onChange={setId}
          label={t("EnterRelationIdModal.input-label")}
          radius="md"
          data-autofocus
          mt={16}
          rightSectionWidth="auto"
          onPaste={onPaste}
          rightSection={
            <Button
              loading={state === State.Loading}
              radius="md"
              type="submit"
              disabled={!id}
            >
              {t("EnterRelationIdModal.submit-btn")}
            </Button>
          }
        />
      </form>
    </Modal>
  );
};
