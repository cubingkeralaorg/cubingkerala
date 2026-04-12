"use client";

import dynamic from "next/dynamic";
import { LatLngTuple } from "leaflet";
import { CiLink } from "react-icons/ci";
import { getFullVenueAddress } from "@/utils/venuUtils";

const LeafletMap = dynamic(() => import("@/components/shared/map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

interface LocationSectionProps {
  venue: string;
  venueAddress: string;
  coordinates: LatLngTuple;
  showMap: boolean;
  onToggleMap: () => void;
}

export function LocationSection({
  venue,
  venueAddress,
  coordinates,
  showMap,
  onToggleMap,
}: LocationSectionProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="space-y-1 md:max-w-[50vw]">
        <p className="font-medium text-[17px] md:text-[18px]">Location</p>
        <p className="text-muted-foreground text-[15px] text-wrap md:text-[16px]">
          {getFullVenueAddress(venue, venueAddress)}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <div
            onClick={onToggleMap}
            className="text-green-500 hover:text-green-600 w-fit cursor-pointer flex gap-1 text-[15px] md:text-[16px]"
          >
            <p>Map</p>
            <CiLink />
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${coordinates[0]},${coordinates[1]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 w-fit cursor-pointer flex gap-1 text-[15px] md:text-[16px]"
          >
            <p>Google Maps</p>
            <CiLink />
          </a>
        </div>
        {showMap && (
          <div className="mt-2">
            <LeafletMap coordinates={coordinates} address={venueAddress} />
          </div>
        )}
      </div>
    </div>
  );
}
