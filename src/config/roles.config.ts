import { RoleType } from "@/types/request.types";

export const ROLES: { value: RoleType; label: string }[] = [
  { value: "member", label: "Member" },
  { value: "organiser", label: "Organiser" },
  { value: "co-founder", label: "Co-Founder" },
];
