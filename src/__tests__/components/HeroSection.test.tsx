import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroSection from "@/components/home/hero-section";
import type { Competition } from "@/types/competition.types";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const competition: Competition = {
  id: "kerala-open-2026",
  name: "Kerala Open 2026",
  city: "Kochi",
  start_date: "2026-09-12",
  end_date: "2026-09-13",
  event_ids: ["333", "222"],
  venue: "Town Hall",
  country_iso2: "IN",
  cancelled_at: null,
  has_results: false,
};

describe("HeroSection", () => {
  it("keeps the community headline and shows an upcoming meet on the right", () => {
    render(<HeroSection competition={competition} kind="upcoming" />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /rubik's cube community/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/connect with fellow cubers for discussions/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Upcoming competition")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /kerala open 2026/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view competition/i }),
    ).toHaveAttribute("href", "/competitions/kerala-open-2026");
    expect(
      screen.getByRole("link", { name: /join whatsapp/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /everything for cubing in kerala/i,
      }),
    ).toBeInTheDocument();
  });

  it("labels a past featured meet and points to results", () => {
    render(
      <HeroSection
        competition={{ ...competition, has_results: true }}
        kind="past"
      />,
    );

    expect(screen.getByText("Latest competition")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view results/i }),
    ).toBeInTheDocument();
  });

  it("falls back when no meet is featured", () => {
    render(<HeroSection competition={null} kind={null} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /rubik's cube community/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /browse competitions/i }),
    ).toHaveAttribute("href", "/competitions");
    expect(
      screen.queryByRole("link", { name: /view competition/i }),
    ).not.toBeInTheDocument();
  });
});
