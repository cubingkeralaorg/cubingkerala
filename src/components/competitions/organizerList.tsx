"use client";

import { openOrganizerProfile } from "@/utils/competitionNavigation";

interface Organizer {
  id: number;
  name: string;
  wca_id: string | null;
  url: string | null;
}

interface OrganizersListProps {
  organizers: Organizer[];
}

export function OrganizersList({ organizers }: OrganizersListProps) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold tracking-tight">Organizers</h2>
      <div className="flex flex-col gap-1">
        {organizers.map((organizer) =>
          organizer.wca_id ? (
            <button
              key={organizer.id}
              type="button"
              onClick={() => openOrganizerProfile(organizer.url)}
              className="w-fit text-left text-muted-foreground hover:text-primary md:text-base"
            >
              {organizer.name}
            </button>
          ) : (
            <p key={organizer.id} className="text-muted-foreground md:text-base">
              {organizer.name}
            </p>
          ),
        )}
      </div>
    </div>
  );
}
