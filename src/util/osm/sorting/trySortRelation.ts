import { OsmWay } from "osm-api";
import { osmCache } from "../../../context/cache";
import { RelationMember } from "../../../types";
import { getSharedNode } from "./getIsSorted";

/**
 * returns undefined if the relation could not be sorted
 */
export function trySortRelation(
  members: RelationMember[],
): RelationMember[] | undefined {
  const nonWayMembers = members.filter(
    (m) => m.type !== "way" || m.role !== "",
  );
  const wayMemberIds = members
    .filter((m) => m.type === "way" && m.role === "")
    .map((m) => m.ref);

  const originalWays = wayMemberIds.map((id) => osmCache.way[id]);

  // return the original array, unchanged
  if (originalWays.length < 2) return members;

  /** map of nodeId to wayIds */
  const edgeNodes: Record<number, Set<OsmWay>> = {};
  for (const way of originalWays) {
    const first = way.nodes[0];
    const last = way.nodes.at(-1)!;
    edgeNodes[first] ||= new Set();
    edgeNodes[first].add(way);
    edgeNodes[last] ||= new Set();
    edgeNodes[last].add(way);
  }

  const first = originalWays[0];
  const second = originalWays[1];

  const firstStart = first.nodes[0];
  const firstEnd = first.nodes.at(-1)!;

  // if the first two ways are connected, we can start with those two
  // if not, we start with one end of the first way. Which ends depends
  // on which one is connected to more ways.
  const shared =
    getSharedNode(first, second) ||
    (edgeNodes[firstStart].size > edgeNodes[firstEnd].size
      ? firstStart
      : firstEnd);
  if (!shared) return undefined;

  const updatedWays: OsmWay[] = [first];
  let pointer = shared;
  originalWays.splice(0, 1); // remove the first way

  while (originalWays.length) {
    // find the next way which is connected to the pointer,
    // and still exists in the unsorted array.
    const nextWay = [...edgeNodes[pointer]].find((way) =>
      originalWays.includes(way),
    );

    if (!nextWay) {
      // we're stuck
      if (originalWays.length) {
        // :( stuck, but there are still ways left
        return undefined;
      } else {
        // :) stuck, but we are finished
        break;
      }
    }

    updatedWays.push(nextWay);
    originalWays.splice(originalWays.indexOf(nextWay), 1);
    pointer =
      nextWay.nodes[0] === pointer ? nextWay.nodes.at(-1)! : nextWay.nodes[0];
  }

  return [
    ...nonWayMembers,
    ...updatedWays.map(
      (way): RelationMember => ({ type: "way", ref: way.id, role: "" }),
    ),
  ];
}
