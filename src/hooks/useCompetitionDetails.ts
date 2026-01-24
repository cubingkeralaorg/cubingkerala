import { useState, useEffect, useMemo } from "react";
import { EventDetails } from "@/types/api";
import { convertMarkdownToHTML } from "@/utils/markdownUtils";
import { LatLngTuple } from "leaflet";

export function useCompetitionDetails(compInfo: EventDetails) {
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formattedInformation = useMemo(() => {
    return compInfo.information
      ? convertMarkdownToHTML(compInfo.information)
      : "";
  }, [compInfo.information]);

  const coordinates: LatLngTuple = useMemo(() => {
    return [compInfo.latitude_degrees, compInfo.longitude_degrees];
  }, [compInfo.latitude_degrees, compInfo.longitude_degrees]);

  return {
    showMap,
    setShowMap,
    formattedInformation,
    coordinates,
  };
}
