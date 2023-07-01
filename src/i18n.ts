import { IntlShape, createIntl, createIntlCache } from "@formatjs/intl";
import { translations } from "./translations";

export type SupportedLanguage = keyof typeof translations;
export function getDefaultLanguage(): SupportedLanguage {
  // if the user chose a language last time, use it
  if (localStorage.lang) return localStorage.lang;

  // otheriwse, find the first supported language
  return (
    navigator.languages
      // strip out the country code to get just the language
      .map((fullLocale) => fullLocale.split("-")[0])
      // if the user has multiple system languages, find the first one we support
      .find((lang): lang is SupportedLanguage => lang in translations) || "en"
  );
}

export const locale = getDefaultLanguage();

const cache = createIntlCache();
let intl: IntlShape;

export const i18nReady = (async () => {
  const { default: messages } = await translations[locale]();

  intl = createIntl({ locale, messages }, cache);
})();

export const t = (id: string, values?: Record<string, any>) =>
  intl.formatMessage({ id }, values);
