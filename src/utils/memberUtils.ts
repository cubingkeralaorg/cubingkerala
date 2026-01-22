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

export const getRoleBadgeColor = (role: string): string => {
  const colors: Record<string, string> = {
    member: "text-blue-300",
    organiser: "text-green-400",
    "co-founder": "text-red-500",
  };
  return colors[role] || "text-white";
};
