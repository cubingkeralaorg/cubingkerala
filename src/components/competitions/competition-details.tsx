"use client";

import React, { Suspense } from "react";
import LoadingComponent from "@/components/shared/loading";
import { useCompetitionDetails } from "@/hooks/useCompetitionDetails";
import { EventDetails, CompetitionResultEntry } from "@/types/api";
import { CompetitionHeader } from "./competitionHeader";
import { LocationSection } from "./localSection";
import { EventsList } from "./eventList";
import { OrganizersList } from "./organizerList";
import { RegistrationDetails } from "./registrationDetails";
import { CompetitionResults } from "./competitionResults";
import { CiLink } from "react-icons/ci";
import { openCompetitionPage } from "@/utils/competitionNavigation";

interface CompetitionDetailsComponentProps {
  compInfo: EventDetails;
  results?: CompetitionResultEntry[];
}

const CompetitionDetailsComponent = ({
  compInfo,
  results = [],
}: CompetitionDetailsComponentProps) => {
  const { showMap, setShowMap, formattedInformation, coordinates } =
    useCompetitionDetails(compInfo);

  return (
    <Suspense fallback={<LoadingComponent />}>
      <div className="container mx-auto text-foreground py-8 md:py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid animate-fade-in gap-6">
          <CompetitionHeader
            name={compInfo.name}
            startDate={compInfo.start_date}
            endDate={compInfo.end_date}
            hasResults={results.length > 0}
          />

          <div className="flex flex-wrap">
            {/* Left Column - Event Details */}
            <div className="w-full md:w-1/2">
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold">Event Details</h2>
                <div className="grid gap-2">
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
                    title="Main Event"
                  />

                  <div className="flex items-center gap-2 mt-2">
                    <div className="space-y-1">
                      <p className="font-medium text-[17px] md:text-[18px]">
                        Competitor Limit
                      </p>
                      <p className="text-muted-foreground text-[15px] md:text-[16px]">
                        {compInfo.competitor_limit}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:block space-y-2 mt-4">
                    <h2 className="text-xl md:text-2xl font-bold">
                      Information
                    </h2>
                    <div
                      dangerouslySetInnerHTML={{ __html: formattedInformation }}
                      className="text-muted-foreground text-wrap text-[15px] md:text-[16px] pr-4 sm:pr-6 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:mt-1 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_h1]:font-bold [&_h1]:text-lg [&_h2]:font-bold [&_h2]:text-base [&_h3]:font-bold [&_h3]:text-base [&_a]:text-blue-500 [&_a]:underline [&_p:has(img)]:text-center [&_img]:inline-block [&_img]:max-w-full [&_img]:h-auto [&_img]:object-contain [&_img]:m-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Registration & Organizers */}
            <div className="w-full md:w-1/2 flex justify-start md:justify-end mt-6 md:mt-0">
              <div className="space-y-2">
                <RegistrationDetails
                  competitionId={compInfo.id}
                  registrationOpen={compInfo.registration_open}
                  registrationClose={compInfo.registration_close}
                  startDate={compInfo.start_date}
                  endDate={compInfo.end_date}
                  cancelledAt={compInfo.cancelled_at}
                  hasResults={results.length > 0}
                />

                <div className="block md:hidden space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold mt-6">
                    Information
                  </h2>
                  <div className="w-full text-wrap pr-2">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formattedInformation,
                      }}
                      className="text-muted-foreground text-[15px] md:text-[16px] pr-4 sm:pr-6 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:mt-1 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_h1]:font-bold [&_h1]:text-lg [&_h2]:font-bold [&_h2]:text-base [&_h3]:font-bold [&_h3]:text-base [&_a]:text-blue-500 [&_a]:underline [&_p:has(img)]:text-center [&_img]:inline-block [&_img]:max-w-full [&_img]:h-auto [&_img]:object-contain [&_img]:m-2"
                    />
                  </div>
                </div>

                <OrganizersList organizers={compInfo.organizers} />
              </div>
            </div>
          </div>

          {results.length > 0 && <CompetitionResults results={results} />}

          <div
            onClick={() => openCompetitionPage(compInfo.id)}
            className="flex mt-10 justify-center gap-1 text-[15px] md:text-[16px] text-green-500 hover:text-green-600 cursor-pointer"
          >
            <p>More details on World Cube Association</p>
            <CiLink />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default CompetitionDetailsComponent;
