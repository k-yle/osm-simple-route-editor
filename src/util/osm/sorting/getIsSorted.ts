import { OsmWay } from "osm-api";
import { osmCache } from "../../../context/cache";
import { RelationMember } from "../../../types";

/**
 * Given 2 ways, returned the node that is shared by
 * both ways. If they are disconnected, returns undefined
 */
export function getSharedNode(firstWay: OsmWay, secondWay: OsmWay) {
  const firstStart = firstWay.nodes[0];
  const firstEnd = firstWay.nodes.at(-1);
  const secondStart = secondWay.nodes[0];
  const secondEnd = secondWay.nodes.at(-1);

  if (firstEnd === secondStart || firstStart === secondStart) {
    // second way is connected head-to-head or tail-to-head, so the start node is the shared one
    return secondStart;
  }

  if (firstStart === secondEnd || firstEnd === secondEnd) {
    // second way is connected head-to-tail or tail-to-tail, so the end node is the shared one
    return secondEnd;
  }

  return undefined;
}

/**
 * If not sorted, it returns the first
 * way ID where there was an error.
 */
export function getIsSorted(
  members: RelationMember[],
): true | number | undefined {
  const wayMembers = members.filter((m) => m.type === "way");

  if (wayMembers.length < 2) return true;

  const firstWay = osmCache.way[wayMembers[0].ref];
  const secondWay = osmCache.way[wayMembers[1].ref];

  // data missing, so we don't know if it's sorted
  if (!firstWay || !secondWay) return undefined;

  let pointer = getSharedNode(firstWay, secondWay);

  if (pointer === undefined) {
    // first two ways are not connected.
    // might be more errors, but we'll abort early
    return secondWay.id;
  }

  for (const wayMember of wayMembers.slice(1)) {
    const way = osmCache.way[wayMember.ref];

    // data missing, so we don't know if it's sorted
    if (!way) return undefined;

    const firstNode = way.nodes[0];
    const lastNode = way.nodes.at(-1);

    const nextPointer: number | undefined =
      firstNode === pointer
        ? lastNode
        : lastNode === pointer
        ? firstNode
        : undefined;

    if (!nextPointer) return way.id;

    pointer = nextPointer;
  }

  // if we've looped through every member, and they're all connected
  // to the adjacent one, then everything is good.
  return true;
}
