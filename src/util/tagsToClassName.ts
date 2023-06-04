import { Tags } from "../types";

const KEYS_USED_BY_STYLING = new Set([
  "highway",
  "railway",
  "route",
  "service",
]);

const stripChars = (str: string) => str.replace(/[^A-Z_-]/gi, "");

export const tagsToClassName = (tags: Tags) =>
  Object.entries(tags)
    .filter(([k]) => KEYS_USED_BY_STYLING.has(k))
    .map(([k, v]) => `${stripChars(k)} ${stripChars(k)}__${stripChars(v!)}`)
    .join(" ");
