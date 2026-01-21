import { MemberPersonResult } from "@/types/api";

export const sortMembersByResult = (
  members: MemberPersonResult[],
  event: string,
  round: string,
): MemberPersonResult[] => {
  const roundType = round === "average" ? "averages" : "singles";

  return [...members].sort((a, b) => {
    const aEvent = a.rank[roundType]?.find((r) => r.eventId === event);
    const bEvent = b.rank[roundType]?.find((r) => r.eventId === event);
    const aBest = aEvent?.best ?? Infinity;
    const bBest = bEvent?.best ?? Infinity;
    return aBest - bBest;
  });
};
