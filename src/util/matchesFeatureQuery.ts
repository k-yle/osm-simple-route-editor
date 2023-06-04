import { FeatureQuery, TagQuery } from "../constants";
import { Tags } from "../types";

function matchesTagQuery(tagQuery: TagQuery, tags: Tags) {
  return tagQuery.some((requiredTags) => {
    // because of how Array.every works, if requiredTags is empty, then
    // Array.every will return true. This is usually unexpected, but in
    // this case it's how we expect the function to behave (see tests).
    return Object.entries(requiredTags).every(([k, valueOrStar]) => {
      if (valueOrStar === "*" && k in tags) return true;

      const values =
        typeof valueOrStar === "string" ? [valueOrStar] : valueOrStar;

      return values.some((v) => tags[k] === v);
    });
  });
}

export function matchesFeatureQuery(query: FeatureQuery, tags: Tags): boolean {
  const passedInclude = matchesTagQuery(query.matchTags, tags);

  const passedExclude = query.exclude
    ? !matchesTagQuery(query.exclude, tags)
    : true;

  return passedInclude && passedExclude;
}
