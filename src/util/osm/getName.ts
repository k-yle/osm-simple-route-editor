import { Tags } from "../../types";

/**
 * the equivilant of iD's `utilDisplayName`: given a set of tags,
 * finds the best name for an object.
 */
export function osmGetName(tags: Tags | undefined): string {
  if (!tags) return "No Name";

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
    return `${tags["addr:housenumber"]} ${tags["addr:street"]}`;
  }
  if (tags["addr:housenumber"]) return tags["addr:housenumber"];

  // ref/local_ref/network/to/from
  const { ref, local_ref: localRef, network, to, from } = tags;
  if (network && ref) return `${network} ${ref}`;
  if (ref && localRef) return `${ref} (${localRef})`;
  if (localRef) return localRef;
  if (from && to) return `${from} --> ${to}`;

  return "No Name";
}
