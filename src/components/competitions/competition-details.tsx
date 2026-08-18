"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompetitionDetails } from "@/hooks/useCompetitionDetails";
import { EventDetails, CompetitionResultEntry } from "@/types/api";
import { CompetitionHeader } from "./competition-header";
import { LocationSection } from "./location-section";
import { EventsList } from "./event-list";
import { OrganizersList } from "./organizer-list";
import { RegistrationDetails } from "./registration-details";
import { CompetitionResults } from "./competition-results";
import { openCompetitionPage } from "@/utils/competition-navigation";
import { NAVBAR_CONTAINER_CLASS } from "@/components/layout/navbar/layout";

interface CompetitionDetailsComponentProps {
  compInfo: EventDetails;
  results?: CompetitionResultEntry[];
}

const informationClassName =
  "text-muted-foreground md:text-base [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_li]:mt-1 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-medium [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold [&_a]:text-primary [&_a]:hover:underline [&_img]:my-4 [&_img]:ml-0 [&_img]:mr-auto [&_img]:block [&_img]:h-auto [&_img]:max-w-full [&_img]:object-contain";

const CompetitionDetailsComponent = ({
  compInfo,
  results = [],
}: CompetitionDetailsComponentProps) => {
  const { showMap, setShowMap, formattedInformation, coordinates } =
    useCompetitionDetails(compInfo);

  return (
    <div className={`ck-landing py-10 ${NAVBAR_CONTAINER_CLASS}`}>
      <div className="flex flex-col gap-12">
        <CompetitionHeader
          name={compInfo.name}
          startDate={compInfo.start_date}
          endDate={compInfo.end_date}
          hasResults={results.length > 0}
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="flex flex-col gap-8">
            <h2 className="text-lg font-semibold tracking-tight">
              Event details
            </h2>
            <LocationSection
              venue={compInfo.venue}
              venueAddress={compInfo.venue_address}
              coordinates={coordinates}
              showMap={showMap}
              onToggleMap={() => setShowMap(!showMap)}
            />
            <EventsList eventIds={compInfo.event_ids} title="Events" />
            <EventsList
              eventIds={compInfo.event_ids}
              mainEventId={compInfo.main_event_id}
              showMainEvent
              title="Main event"
            />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">
                Competitor limit
              </p>
              <p className="text-muted-foreground md:text-base">
                {compInfo.competitor_limit}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold tracking-tight">
                Information
              </h2>
              <div
                dangerouslySetInnerHTML={{ __html: formattedInformation }}
                className={informationClassName}
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-10 lg:max-w-md lg:justify-self-end">
            <RegistrationDetails
              competitionId={compInfo.id}
              registrationOpen={compInfo.registration_open}
              registrationClose={compInfo.registration_close}
              startDate={compInfo.start_date}
              endDate={compInfo.end_date}
              cancelledAt={compInfo.cancelled_at}
              hasResults={results.length > 0}
            />
            <OrganizersList organizers={compInfo.organizers} />
          </div>
        </div>

        {results.length > 0 && <CompetitionResults results={results} />}

        <Button
          variant="link"
          className="h-auto w-fit px-0"
          onClick={() => openCompetitionPage(compInfo.id)}
        >
          More details on the World Cube Association
          <ArrowUpRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
};

export default CompetitionDetailsComponent;
