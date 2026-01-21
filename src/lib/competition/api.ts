import axios, { AxiosError } from "axios";
import { API_TIMEOUT, ERROR_MESSAGES } from "@/constants/competitions";
import { setCompetitionsCache } from "./cache";
import { CompetitionsData } from "@/types/competition";

interface FetchCompetitionsResult {
  success: boolean;
  data?: CompetitionsData;
  error?: string;
  timestamp: string;
}

/**
 * Fetch competitions from the API
 * @param bustCache - Whether to bypass server cache
 */
export const fetchCompetitions = async (
  bustCache = false
): Promise<FetchCompetitionsResult> => {
  try {
    const timestamp = Date.now();
    const res = await axios.get(`/api/get-competitions?_t=${timestamp}`, {
      headers: bustCache
        ? {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          }
        : {},
      timeout: API_TIMEOUT,
    });

    if (res.data && !res.data.error) {
      const competitionsData: CompetitionsData = {
        upcomingCompetitions: res.data.upcomingCompetitions,
        pastCompetitions: res.data.pastCompetitions,
        lastFetch: Date.now(),
      };

      // Cache the successful response
      setCompetitionsCache(competitionsData);

      return {
        success: true,
        data: competitionsData,
        timestamp: new Date().toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } else {
      throw new Error(res.data.error || "No data received");
    }
  } catch (error) {
    console.error("Error fetching competitions:", error);
    
    const errorMsg = getErrorMessage(error);

    return {
      success: false,
      error: errorMsg,
      timestamp: `Refresh failed: ${errorMsg}`,
    };
  }
};

/**
 * Get user-friendly error message based on error type
 */
const getErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError;
  
  if (
    axiosError.code === "ECONNABORTED" ||
    axiosError.message?.includes("timeout")
  ) {
    return ERROR_MESSAGES.TIMEOUT;
  }
  
  if (axiosError.response?.status && axiosError.response.status >= 500) {
    return ERROR_MESSAGES.SERVER_ERROR;
  }
  
  if (!navigator.onLine) {
    return ERROR_MESSAGES.NO_CONNECTION;
  }
  
  return ERROR_MESSAGES.GENERIC;
};
