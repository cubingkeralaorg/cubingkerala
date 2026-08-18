import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

type BrowserWindowProps = {
  path: string;
  children: ReactNode;
};

export function BrowserWindow({ path, children }: BrowserWindowProps) {
  return (
    <Card className="w-full overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 border-b border-border bg-muted/60 px-3 py-2">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <p className="min-w-0 flex-1 truncate rounded-md bg-background px-3 py-1 text-center text-xs text-muted-foreground">
          cubingkerala.org{path}
        </p>
        <span className="w-10 shrink-0" aria-hidden />
      </div>
      {children}
    </Card>
  );
}
