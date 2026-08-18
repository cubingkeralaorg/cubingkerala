import { describe, expect, it } from "vitest";
import type { Competition } from "@/types/competition.types";
import {
  selectFeaturedCompetition,
  selectUpcomingPreview,
} from "@/utils/featured-competition";

function makeCompetition(
  overrides: Partial<Competition> & Pick<Competition, "id" | "name">,
): Competition {
  return {
    city: "Kochi",
    start_date: "2026-09-12",
    end_date: "2026-09-13",
    event_ids: ["333"],
    venue: "Town Hall",
    country_iso2: "IN",
    cancelled_at: null,
    has_results: false,
    ...overrides,
  };
}

describe("selectFeaturedCompetition", () => {
  it("prefers the next non-cancelled upcoming competition", () => {
    const upcoming = [
      makeCompetition({
        id: "cancelled-open",
        name: "Cancelled Open 2026",
        cancelled_at: "2026-01-01",
      }),
      makeCompetition({ id: "kerala-open", name: "Kerala Open 2026" }),
    ];
    const past = [
      makeCompetition({
        id: "old-open",
        name: "Kerala Open 2025",
        has_results: true,
      }),
    ];

    expect(selectFeaturedCompetition(upcoming, past)).toEqual({
      competition: upcoming[1],
      kind: "upcoming",
    });
  });

  it("falls back to the latest non-cancelled past competition", () => {
    const past = [
      makeCompetition({
        id: "cancelled-past",
        name: "Cancelled 2025",
        cancelled_at: "2025-12-01",
        has_results: true,
      }),
      makeCompetition({
        id: "latest-past",
        name: "Thrissur Open 2025",
        has_results: true,
      }),
    ];

    expect(selectFeaturedCompetition([], past)).toEqual({
      competition: past[1],
      kind: "past",
    });
  });

  it("returns null when every competition is cancelled or missing", () => {
    expect(selectFeaturedCompetition([], [])).toBeNull();
    expect(
      selectFeaturedCompetition(
        [
          makeCompetition({
            id: "cancelled",
            name: "Cancelled",
            cancelled_at: "2026-01-01",
          }),
        ],
        [],
      ),
    ).toBeNull();
  });
});

describe("selectUpcomingPreview", () => {
  it("returns the first non-cancelled competitions up to the limit", () => {
    const upcoming = [
      makeCompetition({
        id: "cancelled",
        name: "Cancelled",
        cancelled_at: "2026-01-01",
      }),
      makeCompetition({ id: "one", name: "One" }),
      makeCompetition({ id: "two", name: "Two" }),
      makeCompetition({ id: "three", name: "Three" }),
      makeCompetition({ id: "four", name: "Four" }),
    ];

    expect(selectUpcomingPreview(upcoming, 3).map((comp) => comp.id)).toEqual([
      "one",
      "two",
      "three",
    ]);
  });
});
