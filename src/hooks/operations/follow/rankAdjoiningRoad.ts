import { WayWithGeom } from "../../../types";
import {
  exitRoundaboutEarly,
  sameDirection,
  sameRoadHierarchy,
  sameRoadName,
} from "./criteria";

/**
 * @param sourceRoad - the road that we're continuing **from**
 * @param candidateRoad - the road that we're considering continuing **to**
 */
export type CriteriaFunction = (
  sourceRoad: WayWithGeom,
  candidateRoad: WayWithGeom,
) => number;

export const rankAdjoiningRoad: CriteriaFunction = (
  sourceRoad,
  candidateRoad,
) => {
  const criteria: CriteriaFunction[] = [
    // the order determines their importance. The first criteria is
    // the most important. Lower criteria are only considered if all
    // the previous criteria are still causing a tie.
    sameRoadName,
    sameRoadHierarchy,
    sameDirection,
    exitRoundaboutEarly,
  ];

  // because we can't have a number is JS with more than 15 digits
  if (criteria.length > 15) throw new Error("too many criteria");

  // make the first digit 1, so that all scores have the same number
  // of digits, which is useful for readablility in unit tests.
  let score = 10 ** criteria.length;

  for (const [index, criteriaFunction] of criteria.entries()) {
    const criteriaResult = criteriaFunction(sourceRoad, candidateRoad);

    // the first rule has the highest amount of decimal places.
    // so the output will be a 5 digit number: 1ABCD where A is the
    // result from rule A, B is the result of rule 2, etc.
    score += criteriaResult * 10 ** (criteria.length - 1 - index);
  }

  return score;
};
