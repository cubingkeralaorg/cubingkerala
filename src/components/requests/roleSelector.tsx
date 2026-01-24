"use client";

import { ROLES } from "@/constants/roles";

interface RoleSelectorProps {
  id: string;
  defaultValue: string | null;
}

export function RoleSelector({ id, defaultValue }: RoleSelectorProps) {
  return (
    <select
      className="bg-neutral-950 cursor-pointer text-stone-200"
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
