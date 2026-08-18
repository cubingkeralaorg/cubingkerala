import type { ReactNode } from "react";

export function LandingShell({ children }: { children: ReactNode }) {
  return (
    <div className="ck-landing flex flex-col">
      <main className="flex flex-col">{children}</main>
    </div>
  );
}
