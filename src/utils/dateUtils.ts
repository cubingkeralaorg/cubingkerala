/**
 * Format date range for competition display
 */
export const formatCompetitionDateRange = (
  startDate: string,
  endDate: string,
): string => {
  if (startDate === endDate) {
    return new Date(endDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return `${new Date(startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${new Date(endDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}`;
};

/**
 * Format registration date
 */
export const formatRegistrationDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Check if competition is ongoing
 */
export const isCompetitionOngoing = (
  startDate: string,
  endDate: string,
): boolean => {
  const today = new Date().toDateString();
  return (
    new Date(startDate).toDateString() === today ||
    new Date(endDate).toDateString() === today
  );
};

/**
 * Check if competition is in the future
 */
export const isCompetitionUpcoming = (endDate: string): boolean => {
  return new Date(endDate) > new Date();
};

/**
 * Check if registration is closed
 */
export const isRegistrationClosed = (closeDate: string): boolean => {
  return new Date(closeDate) < new Date();
};
