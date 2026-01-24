"use client";

import React, { Suspense } from "react";
import Loading from "@/app/competitions/loading";
import { useCompetitionDetails } from "@/hooks/useCompetitionDetails";
import { EventDetails } from "@/types/api";
import { CompetitionHeader } from "./competitions/competitionHeader";
import { LocationSection } from "./competitions/localSection";
import { EventsList } from "./competitions/eventList";
import { OrganizersList } from "./competitions/organizerList";
import { RegistrationDetails } from "./competitions/registrationDetails";

interface CompetitionDetailsComponentProps {
  compInfo: EventDetails;
}

const CompetitionDetailsComponent = ({
  compInfo,
}: CompetitionDetailsComponentProps) => {
  const { showMap, setShowMap, formattedInformation, coordinates } =
    useCompetitionDetails(compInfo);

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full mx-auto text-stone-200 py-6 md:py-8 px-4 md:px-5">
        <div className="grid animate-fade-in gap-6">
          <CompetitionHeader
            name={compInfo.name}
            startDate={compInfo.start_date}
            endDate={compInfo.end_date}
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
                      <p className="text-stone-400 text-[15px] md:text-[16px]">
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
                      className="text-stone-400 text-wrap text-[15px] md:text-[16px]"
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
                />

                <div className="block md:hidden space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold mt-6">
                    Information
                  </h2>
                  <div className="w-[90vw] text-wrap">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formattedInformation.includes("]")
                          ? formattedInformation.split("]")[0] + "]"
                          : formattedInformation,
                      }}
                      className="text-stone-400 text-[15px] md:text-[16px]"
                    />
                  </div>
                </div>

                <OrganizersList organizers={compInfo.organizers} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default CompetitionDetailsComponent;
