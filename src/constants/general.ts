import { OsmRelation } from "osm-api";

export const [MIN_LNG, MIN_LAT, MAX_LNG, MAX_LAT] = <const>[0, 1, 2, 3];

export const NEW_ROUTE: OsmRelation = {
  type: "relation",
  id: -1,
  changeset: -1,
  members: [],
  timestamp: new Date().toISOString(),
  uid: -1,
  user: "",
  version: 0,
  tags: {},
};
