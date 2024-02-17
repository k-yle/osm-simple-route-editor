import { t } from "../i18n";

/** the outer array is OR, within each object is AND, within each tag value is OR */
export type TagQuery = {
  [key: string]: string | string[] | "*";
}[];

export type FeatureQuery = {
  matchTags: TagQuery;
  exclude?: TagQuery;
};

export type TransportMode = "ROAD" | "TRAIN" | "FERRY";

export type Heirarchy = {
  [T in TransportMode]: {
    getName(): string;
    features: (FeatureQuery & { minZoom: number })[];
  };
};

export const NETWORK_HEIRARCHY: Heirarchy = {
  ROAD: {
    getName: () => t("transportMode.road"),
    features: [
      // motorways, state highways, and schnellstraßen are visible from afar
      {
        minZoom: 12,
        matchTags: [{ highway: ["motorway", "trunk"] }, { expressway: "yes" }],
      },
      // non-service roads are next
      {
        minZoom: 15,
        matchTags: [{ highway: "*" }],
        exclude: [{ highway: "service" }],
      },
      // service roads only visible when zoomed in all the day
      { minZoom: 18, matchTags: [{ highway: "service" }] },
    ],
  },
  TRAIN: {
    getName: () => t("transportMode.train"),
    features: [
      // mainline tracks are visible from afar
      {
        minZoom: 12,
        matchTags: [{ railway: "rail" }],
        exclude: [{ service: "*" }],
      },
      // crossovers/sidings etc. are only visible when zoomed in
      {
        minZoom: 16,
        matchTags: [{ railway: "rail" }],
      },
    ],
  },
  FERRY: {
    getName: () => t("transportMode.ferry"),
    features: [{ minZoom: 12, matchTags: [{ route: "ferry" }] }],
  },
};
