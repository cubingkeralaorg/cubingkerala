/**
 * Format venue name by removing brackets
 */
export const formatVenueName = (venue: string): string => {
  if (venue.includes("[")) {
    return venue.split("(")[0].slice(1, -1);
  }
  return venue;
};

/**
 * Get full venue address
 */
export const getFullVenueAddress = (venue: string, address: string): string => {
  const formattedVenue = formatVenueName(venue);
  return `${formattedVenue}, ${address}`;
};
