import { useCallback, useContext } from "react";
import { EditorContext } from "../../../context";
import { getConstructedRoads } from "../../../context/cache";
import { rankAdjoiningRoad } from "./rankAdjoiningRoad";
import { useOnSelectWay } from "../../useOnSelectWay";
import { getWayIdsFromMembers } from "../../../util/members";

export const useFollowOperation = () => {
  const { routeMembers } = useContext(EditorContext);

  const onSelectWay = useOnSelectWay();

  const followOperation = useCallback(() => {
    const roads = getConstructedRoads();

    const alreadySelected = getWayIdsFromMembers(routeMembers);
    const alreadySelectedSet = new Set(alreadySelected);

    // most recently selected roads
    const [mostRecentId, secondMostRecentId] = alreadySelected
      .slice(-2)
      .reverse();

    const mostRecent = roads.find((w) => w.id === mostRecentId);
    const secondMostRecent = roads.find((w) => w.id === secondMostRecentId);

    // less than 2 ways selected - operation not available
    if (!mostRecent || !secondMostRecent) return;

    /**
     * Gets the first & last nodes of the most recent lines, and deletes duplicates.
     * The number of unique nodes in this set tells us a lot:
     * - 1 unique node: impossible
     * - 2 unique nodes: the two lines form a circle (e.g. a roundabout split into two segments)
     * - 3 unique nodes: the two lines are connected at one end
     * - 4 unique nodes: not connected
     * - 5+ unique nodes: impossible
     */
    const uniqueSharedNodes = new Set([
      mostRecent.nodes[0],
      mostRecent.nodes.at(-1),
      secondMostRecent.nodes[0],
      secondMostRecent.nodes.at(-1),
    ]);

    // we abort if uniqueSharedNodes is 2 - because that would be a loop
    const mostRecentAreConnected = uniqueSharedNodes.size === 3;
    if (!mostRecentAreConnected) return;

    /**
     * We now know that one of {@link mostRecent}'s nodes is shared with
     * {@link secondMostRecent}. So we get the other node which is not shared.
     * That becomes the "leading node" where this operation starts.
     */
    const leadingNodeId = secondMostRecent.nodes.includes(mostRecent.nodes[0])
      ? mostRecent.nodes.at(-1)
      : mostRecent.nodes[0];

    /**
     * List of lines (other than {@link mostRecent}) that start/end at {@link leadingNodeId}
     */
    const adjoiningRoads = roads.filter(
      (w) =>
        w.id !== mostRecentId && // ignore the current road
        !alreadySelectedSet.has(w.id) && // ignore roads that are already selected
        (w.nodes[0] === leadingNodeId || w.nodes.at(-1) === leadingNodeId),
    );

    // now we need to figure out which of the adjoiningRoads we should continue to.
    // So find the rank for each adjoinging road
    const adjoiningRoadsWithRank = adjoiningRoads
      .map((road) => ({
        road,
        rank: rankAdjoiningRoad(mostRecent, road),
      }))
      .sort((a, b) => b.rank - a.rank);

    // there are no suitable roads to continue to
    if (!adjoiningRoadsWithRank.length) return;

    // pick the adjoining road with the best rank
    const roadToContinueTo = adjoiningRoadsWithRank[0].road;

    // finally, select the road
    onSelectWay(roadToContinueTo);
  }, [routeMembers, onSelectWay]);
  return followOperation;
};
