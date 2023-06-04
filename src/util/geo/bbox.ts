import type { LatLngBounds } from "leaflet";
import type { BBox } from "osm-api";
import { Vec2 } from "../../types";

export const toBBox = (bounds: LatLngBounds): BBox => {
  // leaflet works based on the North West of the world, whereas
  // the OSM bbox works off Null Island.
  const [lng1, lng2] = [bounds.getWest(), bounds.getEast()];
  const [lat1, lat2] = [bounds.getNorth(), bounds.getSouth()];

  return [
    /* minLng */ Math.min(lng1, lng2),
    /* minLat */ Math.min(lat1, lat2),
    /* maxLng */ Math.max(lng1, lng2),
    /* maxLat */ Math.max(lat1, lat2),
  ];
};

export function isWithinBBox(point: Vec2, bbox: BBox) {
  const [lat, lng] = point;
  const [minLng, minLat, maxLng, maxLat] = bbox;

  return lat > minLat && lat < maxLat && lng > minLng && lng < maxLng;
}
