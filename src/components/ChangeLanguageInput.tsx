import { Select } from "@mantine/core";
import { locale, t } from "../i18n";
import { translations } from "../translations";

const DEFAULT = "DEFAULT";

const supportedLanguages = [DEFAULT, ...Object.keys(translations)];

const currentValue = localStorage.lang || "DEFAULT";

const languageNames = new Intl.DisplayNames([locale], { type: "language" });

export const ChangeLanguageInput: React.FC = () => {
  return (
    <Select
      variant="unstyled"
      value={currentValue}
      onChange={(newValue) => {
        if (!newValue) return;

        localStorage.lang = newValue === DEFAULT ? "" : newValue;
        window.location.reload();
      }}
      dropdownPosition="bottom"
      data={supportedLanguages.map((code) => ({
        value: code,
        label:
          code === DEFAULT
            ? t("Navbar.change-language")
            : languageNames.of(code),
      }))}
    />
  );
};
