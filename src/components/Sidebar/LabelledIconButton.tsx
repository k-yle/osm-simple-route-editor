import type { PolymorphicComponentProps } from "@mantine/utils";
import { ActionIcon, ActionIconProps, Group, Text } from "@mantine/core";
import classes from "./LabelledIconButton.module.scss";

export const LabelledIconButton: React.FC<
  {
    label: React.ReactNode;
    Icon: React.FC;
  } & PolymorphicComponentProps<"button", ActionIconProps>
> = ({ label, Icon, ...props }) => {
  return (
    <Group className={classes.group}>
      <ActionIcon color="blue" variant="light" size="xl" {...props}>
        <Icon />
      </ActionIcon>
      <Text size="xs">{label}</Text>
    </Group>
  );
};
