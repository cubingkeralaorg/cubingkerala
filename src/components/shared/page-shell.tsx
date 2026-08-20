import { type ReactNode } from "react";
import { NAVBAR_CONTAINER_CLASS } from "@/components/layout/navbar/layout";
import { cn } from "@/lib/utils";
import Loading from "@/components/shared/loading";

export function PageShell({
  title,
  description,
  actions,
  headerClassName,
  children,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  headerClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`ck-landing py-10 ${NAVBAR_CONTAINER_CLASS}`}>
      <div
        className={cn(
          "mb-6 flex items-start justify-between gap-4",
          headerClassName,
        )}
      >
        <div className="flex min-w-0 flex-col gap-2">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="w-full text-sm text-muted-foreground md:text-base lg:whitespace-nowrap">
              {description}
            </p>
          ) : null}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

export function PageContentLoading() {
  return (
    <div className="min-h-[calc(100dvh-16rem)]">
      <Loading className="pointer-events-none fixed inset-x-0 bottom-0 top-16 z-10 min-h-0 flex-none" />
    </div>
  );
}
