import { CompetitorData } from "@/types/api";

export const sortMembersByResult = (
  members: CompetitorData[],
  event: string,
  round: string,
): CompetitorData[] => {
  const roundType = round === "average" ? "average" : "single";

  return [...members].sort((a, b) => {
    const aEvent = a.personal_records[event]?.[roundType];
    const bEvent = b.personal_records[event]?.[roundType];
    const aBest = aEvent?.best ?? Infinity;
    const bBest = bEvent?.best ?? Infinity;
    return aBest - bBest;
  });
};
