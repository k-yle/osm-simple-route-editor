import { assertIsNever } from "../../../../util";
import type { CriteriaFunction } from "../rankAdjoiningRoad";

/**
 * this criteria prefers non-roundabout roads, so
 * that the first exit at roundabouts is taken
 */
export const exitRoundaboutEarly: CriteriaFunction = (
  sourceRoad,
  candidateRoad,
) => {
  const sourceIsRoundabout = sourceRoad.tags?.junction === "roundabout";
  const candidateIsRoundabout = candidateRoad.tags?.junction === "roundabout";

  const pattern = `${sourceIsRoundabout} --> ${candidateIsRoundabout}` as const;

  switch (pattern) {
    // neutral rank for irrelevant situations
    case "false --> false":
    case "false --> true": {
      return 0;
    }

    // this is the bad case; we're going from one roundabout
    // section to the next
    case "true --> true": {
      return 1;
    }

    // this is the exit from the roundabout
    case "true --> false": {
      return 2;
    }

    default: {
      assertIsNever(pattern);
    }
  }
};
