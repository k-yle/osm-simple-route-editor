import { useMemo } from "react";
import { Kbd, Table } from "@mantine/core";
import { t } from "../i18n";

export const KeyboardShortcutsModal: React.FC = () => {
  const keyboardShortcuts = useMemo(
    () => [
      { name: t("command.undo"), keys: ["⌘", "Z"] },
      { name: t("command.redo"), keys: ["⌘", "Y"] },
      { name: t("command.follow"), keys: ["F"] },
      { name: t("command.toggle-imagery"), keys: ["B"] },
    ],
    []
  );

  return (
    <Table>
      <tbody>
        {keyboardShortcuts.map((shortcut) => (
          <tr key={shortcut.name}>
            <td style={{ textAlign: "right", width: "50%" }}>
              {shortcut.name}
            </td>
            <td>
              {shortcut.keys.flatMap((key, index) => [
                !!index && " + ", // add a plus sign between keys
                <Kbd key={key}>{key}</Kbd>,
              ])}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
