"use client";

import { ROLES } from "@/config/roles.config";

interface RoleSelectorProps {
  id: string;
  defaultValue: string | null;
}

export function RoleSelector({ id, defaultValue }: RoleSelectorProps) {
  return (
    <select
      className="bg-background cursor-pointer text-foreground"
      id={id}
      name="role"
      defaultValue={defaultValue || "member"}
    >
      {ROLES.map((role) => (
        <option key={role.value} value={role.value}>
          {role.label}
        </option>
      ))}
    </select>
  );
}
