import { OsmFeatureType, OsmWay, UtilFeatureForType } from "osm-api";

export type Vec2 = [lat: number, lng: number];
export type Vec3 = [x: number, y: number, z: number];

export type Tags = {
  [key: string]: string | undefined;
};

export type OsmCache = {
  [T in OsmFeatureType]: Record<number, UtilFeatureForType<T>>;
};

// export type OsmCache = Record<`${OsmFeatureType}/${number}`, OsmFeature>;

export type WayWithGeom = OsmWay & { points: Vec2[] };
