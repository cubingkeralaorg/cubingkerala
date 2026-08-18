import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Competition } from "@/types/competition.types";
import { formatCompetitionDateRange } from "@/utils/date-utils";
import { BrowserWindow } from "./browser-window";

type FeaturedCompetitionCardProps = {
  competition: Competition | null;
  kind: "upcoming" | "past" | null;
};

export function FeaturedCompetitionCard({
  competition,
  kind,
}: FeaturedCompetitionCardProps) {
  const path = competition
    ? `/competitions/${competition.id}`
    : "/competitions";
  const dateLabel = competition
    ? formatCompetitionDateRange(competition.start_date, competition.end_date)
    : null;
  const eventCount = competition?.event_ids?.length ?? 0;
  const featuredLabel =
    kind === "past" ? "Latest competition" : "Upcoming competition";
  const cta = kind === "past" ? "View results" : "View competition";

  return (
    <BrowserWindow path={path}>
      {competition && kind ? (
        <>
          <CardHeader className="flex flex-col items-start gap-3 space-y-0">
            <Badge variant="secondary">{featuredLabel}</Badge>
            <CardTitle className="text-xl tracking-tight md:text-2xl">
              {competition.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
            <p>
              <span className="tabular-nums">{dateLabel}</span>
              <span className="mx-1.5 text-border">·</span>
              <span>{competition.city}</span>
            </p>
            {competition.venue ? <p>{competition.venue}</p> : null}
            {eventCount > 0 ? (
              <p>
                {eventCount} {eventCount === 1 ? "event" : "events"}
              </p>
            ) : null}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href={path}>
                {cta}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader className="flex flex-col items-start gap-3 space-y-0">
            <CardTitle>No competitions listed yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              WCA competitions, Kerala rankings, and cubers at every skill
              level — from first scramble to first podium.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/competitions">
                Browse competitions
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </CardFooter>
        </>
      )}
    </BrowserWindow>
  );
}
