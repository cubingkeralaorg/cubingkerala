import { RoleType } from "@/types/request";

export const ROLES: { value: RoleType; label: string }[] = [
  { value: "member", label: "Member" },
  { value: "organiser", label: "Organiser" },
  { value: "co-founder", label: "Co-Founder" },
];
