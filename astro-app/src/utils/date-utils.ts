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
 * Compact uppercase date for mono-styled labels, e.g. "14 SEP 2026".
 */
export const formatDateMono = (dateStr: string): string => {
  return parseLocalDate(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Format a registration open/close ISO datetime for display, e.g. "Oct 5, 2026, 6:00 PM".
 */
export const formatRegistrationDate = (isoDateTime: string): string => {
  return new Date(isoDateTime).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const isRegistrationClosed = (registrationClose: string): boolean => {
  return new Date(registrationClose).getTime() < Date.now();
};

/**
 * Get detailed competition status with IST (UTC+5:30) awareness.
 */
export const getDetailedCompetitionStatus = (
  startDate: string,
  endDate: string,
  hasResults: boolean = false,
  cancelledAt: string | null = null,
): "Upcoming" | "Ongoing" | "Completed" | "Cancelled" => {
  if (cancelledAt) return "Cancelled";
  if (hasResults) return "Completed";

  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const nowIST = new Date(now.getTime() + istOffset);

  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const todayIST = new Date(nowIST.getUTCFullYear(), nowIST.getUTCMonth(), nowIST.getUTCDate());

  if (todayIST < start) {
    return "Upcoming";
  }

  if (todayIST > end) {
    return "Completed";
  }

  return "Ongoing";
};
