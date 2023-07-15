import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import type { OpenConfirmModal } from "@mantine/modals/lib/context";

export function openConfirmModal(options: OpenConfirmModal) {
  return new Promise<boolean>((resolve) => {
    modals.openConfirmModal({
      onCancel: () => resolve(false),
      onConfirm: () => resolve(true),
      zIndex: 1001,
      ...options,
      children: <Text size="sm">{options.children}</Text>,
    });
  });
}
