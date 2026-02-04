import axios from "axios";
import { MemberPersonResult } from "@/types/api";

export const fetchPersonData = async (
  wcaId: string,
): Promise<MemberPersonResult | null> => {
  try {
    const response = await axios.get(
      `https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/${wcaId}.json`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for WCA ID ${wcaId}:`, error);
    return null;
  }
};

export const fetchMultiplePersonsData = async (
  wcaIds: string[],
): Promise<MemberPersonResult[]> => {
  try {
    const responses = await Promise.all(
      wcaIds.map((wcaId) => fetchPersonData(wcaId)),
    );
    return responses.filter((r): r is MemberPersonResult => r !== null);
  } catch (error) {
    console.error("Error fetching members details:", error);
    throw error;
  }
};

export const fetchPersonFromWCA = async (wcaId: string) => {
  const response = await axios.get(
    `https://www.worldcubeassociation.org/api/v0/persons/${wcaId}`,
  );
  return response.data;
};
