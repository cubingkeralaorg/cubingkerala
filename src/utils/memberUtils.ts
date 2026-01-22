import { MemberPersonResult } from "@/types/api";

export const getTotalMedals = (memberDetails?: MemberPersonResult): number => {
  if (!memberDetails) return 0;

  return (
    (memberDetails.medals.gold || 0) +
    (memberDetails.medals.silver || 0) +
    (memberDetails.medals.bronze || 0)
  );
};

export const capitalizeRole = (role: string): string => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export const sortMembersByName = <T extends { name: string }>(
  members: T[],
): T[] => {
  return [...members].sort((a, b) => a.name.localeCompare(b.name));
};
