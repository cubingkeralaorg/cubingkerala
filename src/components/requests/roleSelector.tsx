"use client";

import { useState } from "react";
import { ROLES } from "@/config/roles.config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoleSelectorProps {
  id: string;
  defaultValue: string | null;
}

export function RoleSelector({ id, defaultValue }: RoleSelectorProps) {
  const [value, setValue] = useState(defaultValue || "member");

  return (
    <>
      <input type="hidden" id={id} value={value} />
      <Select value={value} onValueChange={setValue} name="role">
        <SelectTrigger className="w-[140px] bg-background text-foreground">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
