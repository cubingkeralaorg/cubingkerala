"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LatLngTuple } from "leaflet";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFullVenueAddress } from "@/utils/venuUtils";
import { cn } from "@/lib/utils";

const LeafletMap = dynamic(() => import("@/components/shared/map"), {
  ssr: false,
  loading: () => (
    <p className="px-4 py-8 text-sm text-muted-foreground">Loading map...</p>
  ),
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
  const [mapMounted, setMapMounted] = useState(false);

  const handleToggleMap = () => {
    if (!showMap) {
      setMapMounted(true);
    }
    onToggleMap();
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-muted-foreground">Location</p>
      <p className="text-muted-foreground md:text-base">
        {getFullVenueAddress(venue, venueAddress)}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="link"
          className="h-auto w-fit px-0"
          onClick={handleToggleMap}
        >
          {showMap ? "Hide map" : "Show map"}
        </Button>
        <Button variant="link" className="h-auto w-fit px-0" asChild>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${coordinates[0]},${coordinates[1]}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Maps
            <ArrowUpRight data-icon="inline-end" />
          </a>
        </Button>
      </div>
      {mapMounted && (
        <div
          className={cn(
            "overflow-hidden rounded-md border border-border",
            !showMap && "hidden",
          )}
        >
          <LeafletMap
            coordinates={coordinates}
            address={venueAddress}
            visible={showMap}
          />
        </div>
      )}
    </div>
  );
}
