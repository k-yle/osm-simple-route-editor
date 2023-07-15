import {
  createStyles,
  Overlay,
  Container,
  Title,
  Button,
  Text,
  rem,
  Alert,
  LoadingOverlay,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { t } from "../i18n";
import { ExternalLink } from "../components/Link";

const useStyles = createStyles((theme) => ({
  hero: {
    position: "relative",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingBottom: `calc(${theme.spacing.xl} * 6)`,
    zIndex: 1,
    position: "relative",

    [theme.fn.smallerThan("sm")]: {
      height: rem(500),
      paddingBottom: `calc(${theme.spacing.xl} * 3)`,
    },
  },

  title: {
    color: theme.white,
    fontSize: rem(60),
    fontWeight: 900,
    lineHeight: 1.1,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(40),
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
      lineHeight: 1.3,
    },
  },

  description: {
    color: theme.white,
    maxWidth: 600,

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
      fontSize: theme.fontSizes.sm,
    },
  },

  control: {
    marginTop: `calc(${theme.spacing.xl} * 1.5)`,

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },
}));

export const routeLink = (text: React.ReactNode) => (
  <ExternalLink
    key="routeLink" // key required for i18n
    href="https://osm.wiki/Relation:route"
    hideIcon
  >
    {text}
  </ExternalLink>
);
export const osmLink = (text: React.ReactNode) => (
  <ExternalLink
    key="osmLink" // key required for i18n
    href="https://osm.org"
    hideIcon
  >
    {text}
  </ExternalLink>
);

export const LoginPage: React.FC<{
  loading: boolean;
  error?: Error;
  onClickLogin(): void;
}> = ({ loading, error, onClickLogin }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.hero}>
      <LoadingOverlay visible={loading} overlayBlur={2} />

      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container}>
        <Title className={classes.title}>OpenStreetMap Route Editor</Title>
        <Text className={classes.description} size="xl" mt="xl">
          {t("LoginPage.hero-text", { routeLink, osmLink })}
        </Text>

        {error && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title={t("LoginErrorPage.msg")}
            color="red"
            mt={16}
            miw={400}
          >
            {error.message || `${error}`}
          </Alert>
        )}

        <Button
          variant="gradient"
          size="xl"
          radius="xl"
          className={classes.control}
          onClick={onClickLogin}
        >
          {t("generic.login")}
        </Button>
      </Container>
    </div>
  );
};
