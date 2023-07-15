import { Text } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

export type LinkProps = React.ComponentPropsWithoutRef<"a">;

export const Link: React.FC<LinkProps> = (props) => (
  <Text variant="link" component="a" color="blue" {...props} />
);

export const ExternalLink: React.FC<LinkProps & { hideIcon?: boolean }> = ({
  children,
  hideIcon,
  ...props
}) => (
  <Link {...props} target="_blank" rel="noopener noreferrer">
    {children} {!hideIcon && <IconExternalLink size="1rem" />}
  </Link>
);
