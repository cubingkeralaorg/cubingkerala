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
    <div className="space-y-2">
      <h2 className="text-xl md:text-2xl font-bold mt-4">Organizers</h2>
      <div className="grid">
        {organizers.map((organizer) => (
          <div
            key={organizer.id}
            className="flex items-center gap-2 text-[15px] md:text-[16px]"
          >
            <p
              onClick={() => openOrganizerProfile(organizer.url)}
              className={`font-medium text-normal text-muted-foreground ${
                organizer.wca_id
                  ? "hover:text-blue-500 cursor-pointer"
                  : "cursor-default"
              }`}
            >
              {organizer.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
