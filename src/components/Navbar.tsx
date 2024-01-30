import { useState, useContext } from "react";
import {
  createStyles,
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Burger,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconLogout,
  IconChevronDown,
  IconSun,
  IconMoonStars,
  IconLanguage,
  IconExternalLink,
  IconKeyboard,
  IconInfoCircle,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { AuthContext } from "../context/AuthGateway";
import { t } from "../i18n";
import { ChangeLanguageInput } from "./ChangeLanguageInput";
import { AboutModal } from "./AboutModal";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";

const useStyles = createStyles((theme) => ({
  header: {
    height: 65,
    paddingTop: theme.spacing.sm,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[2]
    }`,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },
}));

export const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  const { classes, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          <span>Simple Route Editor</span>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
            zIndex={1001}
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group spacing={7}>
                  <Avatar
                    src={user.img?.href}
                    alt={user.display_name}
                    radius="xl"
                    size={20}
                  />
                  <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                    {user.display_name}
                  </Text>
                  <IconChevronDown size={rem(12)} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{t("Navbar.section-settings")}</Menu.Label>

              <Menu.Item
                icon={
                  isDark ? (
                    <IconSun size="0.9rem" stroke={1.5} />
                  ) : (
                    <IconMoonStars size="0.9rem" stroke={1.5} />
                  )
                }
                onClick={() => toggleColorScheme()}
                closeMenuOnClick={false}
              >
                {isDark ? t("Navbar.to-light-mode") : t("Navbar.to-dark-mode")}
              </Menu.Item>

              <Menu.Item
                icon={<IconLanguage size="0.9rem" stroke={1.5} />}
                closeMenuOnClick={false}
                py={0}
              >
                <ChangeLanguageInput />
              </Menu.Item>

              <Menu.Divider />
              <Menu.Label>{t("Navbar.section-about")}</Menu.Label>

              <Menu.Item
                onClick={() => {
                  modals.open({
                    title: t("Navbar.section-about"),
                    children: <AboutModal />,
                  });
                }}
                icon={<IconInfoCircle size="0.9rem" stroke={1.5} />}
              >
                {t("Navbar.about")}
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  modals.open({
                    title: t("Navbar.keyboard-shortcuts"),
                    children: <KeyboardShortcutsModal />,
                  });
                }}
                icon={<IconKeyboard size="0.9rem" stroke={1.5} />}
              >
                {t("Navbar.keyboard-shortcuts")}
              </Menu.Item>

              <Menu.Divider />
              <Menu.Label>{t("Navbar.section-account")}</Menu.Label>

              <Menu.Item
                icon={<IconExternalLink size="0.9rem" stroke={1.5} />}
                component="a"
                href={`https://osm.org/user/${user.display_name}/history`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {t("Navbar.link.my-edits")}
              </Menu.Item>
              <Menu.Item
                icon={<IconExternalLink size="0.9rem" stroke={1.5} />}
                component="a"
                href={`https://osm.org/user/${user.display_name}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {t("Navbar.link.my-profile")}
              </Menu.Item>

              <Menu.Item
                color="red"
                icon={<IconLogout size="0.9rem" stroke={1.5} />}
                onClick={logout}
              >
                {t("generic.logout")}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
    </div>
  );
};
