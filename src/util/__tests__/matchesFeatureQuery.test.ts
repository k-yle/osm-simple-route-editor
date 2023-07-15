import { describe, expect, it } from "vitest";
import { matchesFeatureQuery } from "..";
import { FeatureQuery } from "../../constants";

describe("matchesFeatureQuery", () => {
  it("works for single wildcard queries", () => {
    const roadsQuery: FeatureQuery = { matchTags: [{ highway: "*" }] };
    expect(matchesFeatureQuery(roadsQuery, { highway: "service" })).toBe(true);
    expect(matchesFeatureQuery(roadsQuery, { highway: "no" })).toBe(true);
    expect(matchesFeatureQuery(roadsQuery, { otherTag: "abc" })).toBe(false);
    expect(matchesFeatureQuery(roadsQuery, {})).toBe(false);
  });

  it("works for double wildcard queries", () => {
    const roadsQuery: FeatureQuery = {
      matchTags: [{ highway: "*", maxspeed: "*" }],
    };
    expect(matchesFeatureQuery(roadsQuery, { highway: "service" })).toBe(false);
    expect(matchesFeatureQuery(roadsQuery, { maxspeed: "10" })).toBe(false);
    expect(
      matchesFeatureQuery(roadsQuery, { highway: "service", maxspeed: "10" }),
    ).toBe(true);
    expect(matchesFeatureQuery(roadsQuery, { otherTag: "abc" })).toBe(false);
    expect(matchesFeatureQuery(roadsQuery, {})).toBe(false);
  });

  it("works with a mix of wildcards", () => {
    const serviceRoads: FeatureQuery = {
      matchTags: [
        { highway: "service", service: ["driveway", "alley"], maxspeed: "*" },
      ],
    };
    expect(matchesFeatureQuery(serviceRoads, {})).toBe(false);
    expect(matchesFeatureQuery(serviceRoads, { highway: "service" })).toBe(
      false,
    );
    expect(matchesFeatureQuery(serviceRoads, { service: "driveway" })).toBe(
      false,
    );
    expect(matchesFeatureQuery(serviceRoads, { maxspeed: "110" })).toBe(false);
    expect(
      matchesFeatureQuery(serviceRoads, {
        highway: "service",
        service: "driveway",
      }),
    ).toBe(false);
    expect(
      matchesFeatureQuery(serviceRoads, {
        highway: "service",
        service: "driveway",
        maxspeed: "110",
      }),
    ).toBe(true);
    expect(
      matchesFeatureQuery(serviceRoads, {
        highway: "service",
        service: "parking_iel",
        maxspeed: "110",
      }),
    ).toBe(false);
    expect(matchesFeatureQuery(serviceRoads, {})).toBe(false);
  });

  it("works for single K=V queries", () => {
    const mwayOnly: FeatureQuery = { matchTags: [{ highway: "motorway" }] };
    expect(matchesFeatureQuery(mwayOnly, { highway: "motorway" })).toBe(true);
    expect(matchesFeatureQuery(mwayOnly, { highway: "other" })).toBe(false);
    expect(matchesFeatureQuery(mwayOnly, { otherTag: "abc" })).toBe(false);
    expect(matchesFeatureQuery(mwayOnly, {})).toBe(false);
  });

  it("works for K=V1|V2 queries", () => {
    const mwayAndOffRamps: FeatureQuery = {
      matchTags: [{ highway: ["motorway", "motorway_link"] }],
    };
    expect(matchesFeatureQuery(mwayAndOffRamps, { highway: "motorway" })).toBe(
      true,
    );
    expect(
      matchesFeatureQuery(mwayAndOffRamps, { highway: "motorway_link" }),
    ).toBe(true);
    expect(matchesFeatureQuery(mwayAndOffRamps, { highway: "other" })).toBe(
      false,
    );
    expect(matchesFeatureQuery(mwayAndOffRamps, {})).toBe(false);
  });

  it("works with exclude", () => {
    const allRoadsExceptMWay: FeatureQuery = {
      matchTags: [{ highway: "*" }],
      exclude: [{ highway: "motorway" }],
    };
    expect(
      matchesFeatureQuery(allRoadsExceptMWay, { highway: "whatever" }),
    ).toBe(true);
    expect(
      matchesFeatureQuery(allRoadsExceptMWay, { highway: "motorway_link" }),
    ).toBe(true);
    expect(
      matchesFeatureQuery(allRoadsExceptMWay, { highway: "motorway" }),
    ).toBe(false);
  });

  it("works with complex excludes", () => {
    const allRoadsExceptMWay: FeatureQuery = {
      matchTags: [{ highway: "*" }],
      exclude: [
        { highway: ["motorway", "motorway_link"] },
        { expressway: "yes" },
      ],
    };
    expect(
      matchesFeatureQuery(allRoadsExceptMWay, { highway: "whatever" }),
    ).toBe(true);
    expect(
      matchesFeatureQuery(allRoadsExceptMWay, {
        highway: "whatever",
        expresesway: "no",
      }),
    ).toBe(true);

    expect(
      matchesFeatureQuery(allRoadsExceptMWay, { highway: "motorway_link" }),
    ).toBe(false);
    expect(
      matchesFeatureQuery(allRoadsExceptMWay, { highway: "motorway" }),
    ).toBe(false);
    expect(matchesFeatureQuery(allRoadsExceptMWay, { expressway: "yes" })).toBe(
      false,
    );
    expect(
      matchesFeatureQuery(allRoadsExceptMWay, {
        highway: "service",
        expressway: "yes",
      }),
    ).toBe(false);
  });

  it("works with wildcard excludes", () => {
    // everythimg except road and rail
    const noRoadNorRail: FeatureQuery = {
      matchTags: [{}],
      exclude: [{ highway: "*" }, { railway: "*" }],
    };
    expect(matchesFeatureQuery(noRoadNorRail, {})).toBe(true);
    expect(matchesFeatureQuery(noRoadNorRail, { building: "yes" })).toBe(true);
    expect(matchesFeatureQuery(noRoadNorRail, { highway: "bob" })).toBe(false);
    expect(matchesFeatureQuery(noRoadNorRail, { railway: "track" })).toBe(
      false,
    );
    expect(
      matchesFeatureQuery(noRoadNorRail, { highway: "bob", railway: "track" }),
    ).toBe(false);
  });

  describe("empty queries", () => {
    it("selects nothing if matchTags is an empty array", () => {
      const noQuery: FeatureQuery = { matchTags: [] };
      expect(matchesFeatureQuery(noQuery, { highway: "whatever" })).toBe(false);
      expect(matchesFeatureQuery(noQuery, {})).toBe(false);
    });

    it("selects everything if matchTags is an empty object", () => {
      const noQuery: FeatureQuery = { matchTags: [{}] };
      expect(matchesFeatureQuery(noQuery, { highway: "whatever" })).toBe(true);
      expect(matchesFeatureQuery(noQuery, {})).toBe(true);
    });

    it("makes no difference if exclude is an empty array", () => {
      const emptyExclude: FeatureQuery = {
        matchTags: [{ highway: "service" }],
        exclude: [],
      };
      expect(matchesFeatureQuery(emptyExclude, { highway: "service" })).toBe(
        true,
      );
      expect(matchesFeatureQuery(emptyExclude, { highway: "whatever" })).toBe(
        false,
      );
      expect(matchesFeatureQuery(emptyExclude, {})).toBe(false);
    });

    it("selects nothing if exclude is an empty object", () => {
      const emptyExclude: FeatureQuery = {
        matchTags: [{ highway: "service" }],
        exclude: [{}],
      };
      expect(matchesFeatureQuery(emptyExclude, { highway: "service" })).toBe(
        false,
      );
      expect(matchesFeatureQuery(emptyExclude, { highway: "whatever" })).toBe(
        false,
      );
      expect(matchesFeatureQuery(emptyExclude, {})).toBe(false);
    });

    it("selects nothing if matchTags and exclude are both an empty object", () => {
      const bothEmpty: FeatureQuery = { matchTags: [{}], exclude: [{}] };
      expect(matchesFeatureQuery(bothEmpty, { highway: "whatever" })).toBe(
        false,
      );
      expect(matchesFeatureQuery(bothEmpty, {})).toBe(false);
    });

    it("selects nothing if matchTags and exclude are both a empty arrays", () => {
      const bothEmpty: FeatureQuery = { matchTags: [], exclude: [] };
      expect(matchesFeatureQuery(bothEmpty, { highway: "whatever" })).toBe(
        false,
      );
      expect(matchesFeatureQuery(bothEmpty, {})).toBe(false);
    });
  });
});
