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
    <div className={`ck-landing py-6 sm:py-10 ${NAVBAR_CONTAINER_CLASS}`}>
      <div
        className={cn(
          "mb-4 flex flex-col items-start gap-4 sm:mb-6 sm:flex-row sm:justify-between",
          headerClassName,
        )}
      >
        <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-1">
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
  return <Loading className="min-h-[calc(100dvh-16rem)]" />;
}
