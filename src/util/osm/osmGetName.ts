import { t } from "../../i18n";
import { Tags } from "../../types";

/**
 * the equivilant of iD's `utilDisplayName`: given a set of tags,
 * finds the best name for an object.
 */
export function osmGetName(
  tags: Tags | undefined,
): string & { isNoName?: boolean } {
  if (!tags) return t("osmGetName.no-name");

  const straightforwardName =
    tags.name ||
    tags.alt_name ||
    tags.official_name ||
    tags.loc_name ||
    tags["seamark:name"] ||
    tags["addr:housename"];

  if (straightforwardName) return straightforwardName;

  // street address
  if (tags["addr:housenumber"] && tags["addr:street"]) {
    return t("osmGetName.housenumber-street", {
      housenumber: tags["addr:housenumber"],
      street: tags["addr:street"],
    });
  }
  if (tags["addr:housenumber"]) return tags["addr:housenumber"];

  // ref/local_ref/network/to/from
  if (tags.network && tags.ref && tags.from && tags.to) {
    return t("osmGetName.network-ref-from-to", tags);
  }
  if (tags.network && tags.ref && tags.to) {
    return t("osmGetName.network-ref-to", tags);
  }
  if (tags.network && tags.ref) return t("osmGetName.network-ref", tags);
  if (tags.local_ref) return tags.local_ref;
  if (tags.from && tags.to) return t("osmGetName.from-to", tags);

  return Object.assign(t("osmGetName.no-name"), { isNoName: true });
}
