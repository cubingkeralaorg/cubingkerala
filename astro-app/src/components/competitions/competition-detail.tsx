import { ArrowUpRight } from "lucide-react";
import "@cubing/icons";
import { Button } from "@/components/ui/button";
import { CompetitionResults } from "./competition-results";
import { DetailRow } from "@/components/shared/detail-row";
import {
  formatCompetitionDateRange,
  formatRegistrationDate,
  getDetailedCompetitionStatus,
  isRegistrationClosed,
} from "@/utils/date-utils";
import { getEventName } from "@/utils/event-names";
import { NAVBAR_CONTAINER_CLASS } from "@/components/layout/navbar/layout";
import type { Competition, CompetitionDetail as CompetitionDetailData, CompetitionResultEntry } from "@/types/competition";

const INFORMATION_CLASS =
  "text-muted-foreground md:text-base [&_p]:mb-3 [&_p:last-child]:mb-0 [&_a]:text-primary [&_a]:hover:underline";

interface CompetitionDetailProps {
  competition: Competition;
  detail: CompetitionDetailData;
  results: CompetitionResultEntry[];
}

export function CompetitionDetail({ competition, detail, results }: CompetitionDetailProps) {
  const isClosed = isRegistrationClosed(detail.registrationClose);
  const status = getDetailedCompetitionStatus(
    competition.start_date,
    competition.end_date,
    competition.has_results,
    competition.cancelled_at ?? null,
  );

  return (
    <div className={`py-6 sm:py-10 ${NAVBAR_CONTAINER_CLASS}`}>
      <div className="flex flex-col gap-10 sm:gap-14">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{competition.name}</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            {formatCompetitionDateRange(competition.start_date, competition.end_date)} · {competition.city}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold tracking-tight">Event details</h2>

              <div className="flex flex-col">
                <DetailRow label="Location" divider={false}>
                  <p className="md:text-base">
                    {competition.venue}, {detail.venueAddress}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${detail.coordinates[0]},${detail.coordinates[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Google Maps
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </DetailRow>

                <DetailRow label="Events" divider={false}>
                  <div className="flex flex-wrap gap-x-3 gap-y-2">
                    {competition.event_ids.map((event) => (
                      <span
                        key={event}
                        title={getEventName(event)}
                        className={`cubing-icon event-${event} text-lg`}
                      />
                    ))}
                  </div>
                </DetailRow>

                <DetailRow label="Competitor limit" divider={false}>
                  <p className="md:text-base">{detail.competitorLimit}</p>
                </DetailRow>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold tracking-tight">Registration</h2>

              <div className="flex flex-col">
                <DetailRow label="Opens" divider={false}>
                  <p className="md:text-base">{formatRegistrationDate(detail.registrationOpen)}</p>
                </DetailRow>

                <DetailRow label="Closes" divider={false}>
                  <p className="md:text-base">
                    {isClosed ? "Closed" : ""} {formatRegistrationDate(detail.registrationClose)}
                  </p>
                </DetailRow>

                <DetailRow label="Organizers" divider={false}>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {detail.organizers.map((organizer) =>
                      organizer.wcaId ? (
                        <a
                          key={organizer.id}
                          href={`/members/${organizer.wcaId}`}
                          className="w-fit hover:text-primary md:text-base"
                        >
                          {organizer.name}
                        </a>
                      ) : (
                        <p key={organizer.id} className="md:text-base">
                          {organizer.name}
                        </p>
                      ),
                    )}
                  </div>
                </DetailRow>
              </div>

              {status === "Upcoming" && (
                <Button asChild className="w-fit">
                  <a
                    href={`https://www.worldcubeassociation.org/competitions/${competition.id}/register`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Register for this competition
                    <ArrowUpRight />
                  </a>
                </Button>
              )}
              {status === "Ongoing" && (
                <p className="text-sm font-medium text-muted-foreground md:text-base">Competition is ongoing.</p>
              )}
              {status === "Completed" && (
                <p className="text-sm font-medium text-muted-foreground md:text-base">
                  Competition is over.{competition.has_results ? " Results are available." : ""}
                </p>
              )}
              {status === "Cancelled" && (
                <p className="text-sm font-medium text-muted-foreground md:text-base">Competition was cancelled.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold tracking-tight">Information</h2>
            <div dangerouslySetInnerHTML={{ __html: detail.informationHtml }} className={INFORMATION_CLASS} />
          </div>
        </div>

        <CompetitionResults results={results} />

        <Button variant="link" className="h-auto w-fit px-0" asChild>
          <a
            href={`https://www.worldcubeassociation.org/competitions/${competition.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            More details on the World Cube Association
            <ArrowUpRight />
          </a>
        </Button>
      </div>
    </div>
  );
}
