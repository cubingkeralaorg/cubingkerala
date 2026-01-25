// Cache duration in milliseconds (10 minutes)
export const CACHE_DURATION = 600 * 1000;

// API timeout duration
export const API_TIMEOUT = 35000;

// Error messages
export const ERROR_MESSAGES = {
  TIMEOUT: "Request timeout - please try again",
  SERVER_ERROR: "Server error - please try again later",
  NO_CONNECTION: "No internet connection",
  GENERIC: "Failed to refresh competitions",
} as const;
