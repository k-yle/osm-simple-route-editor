import type { CriteriaFunction } from "../rankAdjoiningRoad";

// TODO: support `usage=*` and `service=*` for railways
// TODO: be more inteligent about this, consider `service=*`, `highway=*_link` etc.
export const sameRoadHierarchy: CriteriaFunction = (
  sourceRoad,
  candidateRoad,
) => (sourceRoad.tags?.highway === candidateRoad.tags?.highway ? 1 : 0);
