import type { Tags } from "../../types";

/** treats `alternating`/`reversible` as `false` */
// TODO: somehow import https://github.com/openstreetmap/iD/blob/b397767b/modules/osm/tags.js#L126-L171
export const isOneway = (tags: Tags | undefined) =>
  tags?.oneway === "yes" ||
  tags?.oneway === "-1" ||
  tags?.["railway:preferred_direction"] === "forward" ||
  tags?.junction === "roundabout" ||
  tags?.junction === "circular";
