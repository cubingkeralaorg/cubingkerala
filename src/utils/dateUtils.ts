/**
 * Parse a "YYYY-MM-DD" date string as a local date (not UTC).
 * new Date("2026-03-14") is parsed as UTC midnight, which shifts
 * to the previous day in negative-offset timezones. This helper
 * avoids that by constructing the date with local year/month/day.
 */
export const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Format date range for competition display
 */
export const formatCompetitionDateRange = (
  startDate: string,
  endDate: string,
): string => {
  if (startDate === endDate) {
    return parseLocalDate(endDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return `${parseLocalDate(startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${parseLocalDate(endDate).toLocaleDateString("en-US", {
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
    parseLocalDate(startDate).toDateString() === today ||
    parseLocalDate(endDate).toDateString() === today
  );
};

/**
 * Check if competition is in the future
 */
export const isCompetitionUpcoming = (endDate: string): boolean => {
  return parseLocalDate(endDate) > new Date();
};

/**
 * Check if registration is closed
 */
export const isRegistrationClosed = (closeDate: string): boolean => {
  return new Date(closeDate) < new Date();
};
