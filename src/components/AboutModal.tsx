import { Code } from "@mantine/core";
import { t } from "../i18n";
import { osmLink, routeLink } from "../pages/LoginPage";
import { version } from "../../package.json";
import { ExternalLink } from "./Link";

export const AboutModal: React.FC = () => (
  <>
    {t("LoginPage.hero-text", { routeLink, osmLink })}
    <br />
    <br />
    Version: <Code>{version}</Code>
    <br />
    <br />
    <ExternalLink href="https://github.com/k-yle/osm-simple-route-editor">
      View the source code on GitHub
    </ExternalLink>
  </>
);
