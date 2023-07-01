import { assertIsNever, isOneway } from "../../../../util";
import type { CriteriaFunction } from "../rankAdjoiningRoad";

type Direction = "forwards" | "backwards" | "both";

const invertDirection: Record<Direction, Direction> = {
  forwards: "backwards",
  backwards: "forwards",
  both: "both",
};

export const sameDirection: CriteriaFunction = (sourceRoad, candidateRoad) => {
  /** if true, then we're following this road forwards */
  const sharedNodeIsLastNodeOfSource = candidateRoad.nodes.includes(
    sourceRoad.nodes.at(-1)!
  );
  const sharedNode = sharedNodeIsLastNodeOfSource
    ? sourceRoad.nodes.at(-1)!
    : sourceRoad.nodes[0];

  let sourceRoadDirection: Direction = isOneway(sourceRoad.tags)
    ? sharedNodeIsLastNodeOfSource
      ? "forwards"
      : "backwards"
    : "both"; // source road is not oneway

  if (sourceRoad.tags?.oneway === "-1") {
    sourceRoadDirection = invertDirection[sourceRoadDirection];
  }

  let targetRoadDirection: Direction = isOneway(candidateRoad.tags)
    ? candidateRoad.nodes[0] === sharedNode
      ? "forwards"
      : "backwards"
    : "both";

  if (candidateRoad.tags?.oneway === "-1") {
    targetRoadDirection = invertDirection[targetRoadDirection];
  }

  const pattern = `${sourceRoadDirection} --> ${targetRoadDirection}` as const;

  switch (pattern) {
    // the next road is not oneway. This gets a very high rank, for cases
    // where a dual carriageway road ends, we should follow the single
    // carriageway road instead of continuing backwards down the opposite
    // side of the road.
    case "forwards --> both":
    case "backwards --> both": {
      return 7;
    }

    case "both --> both":
    case "forwards --> forwards":
    case "backwards --> backwards": {
      return 5;
    }

    // possibly the start of the dual carriageway section
    case "both --> forwards": {
      return 3;
    }

    // this road is going towards us. Very unlikely.
    case "forwards --> backwards":
    case "backwards --> forwards":
    case "both --> backwards": {
      return 0;
    }

    default: {
      assertIsNever(pattern);
    }
  }
};
