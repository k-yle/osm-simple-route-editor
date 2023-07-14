import { RelationMember } from "../types";

export const getWayIdsFromMembers = (members: RelationMember[]): number[] =>
  members.filter((member) => member.type === "way").map((member) => member.ref);
