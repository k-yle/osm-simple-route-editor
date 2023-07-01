import type { CriteriaFunction } from "../rankAdjoiningRoad";

export const sameRoadName: CriteriaFunction = (sourceRoad, candidateRoad) =>
  sourceRoad.tags?.name === candidateRoad.tags?.name ? 1 : 0;
