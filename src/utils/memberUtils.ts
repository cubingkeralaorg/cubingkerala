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
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const sortMembersByName = <T extends { name: string }>(
  members: T[],
): T[] => {
  return [...members].sort((a, b) => a.name.localeCompare(b.name));
};

export const getRoleBadgeColor = (role: string): string => {
  const colors: Record<string, string> = {
    admin: "text-foreground",
    moderator: "text-purple-500",
    member: "text-blue-500",
    organiser: "text-green-500",
    "co-founder": "text-red-500",
  };
  return colors[role] || "text-foreground";
};
