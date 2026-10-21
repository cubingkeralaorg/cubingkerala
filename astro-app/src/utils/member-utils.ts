import type { MemberWcaSummary, Medals } from "@/types/member";

export const getTotalMedalsFromSummary = (
  summary?: MemberWcaSummary | { medals: Medals },
): number => {
  if (!summary) return 0;

  return (
    (summary.medals.gold || 0) +
    (summary.medals.silver || 0) +
    (summary.medals.bronze || 0)
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
