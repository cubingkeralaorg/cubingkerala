import { formatCompetitionDateRange } from "@/utils/dateUtils";

interface CompetitionHeaderProps {
  name: string;
  startDate: string;
  endDate: string;
  hasResults: boolean;
}

export function CompetitionHeader({
  name,
  startDate,
  endDate,
}: CompetitionHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
        {name}
      </h1>
      <p className="w-full text-sm text-muted-foreground md:text-base lg:whitespace-nowrap">
        {formatCompetitionDateRange(startDate, endDate)}
      </p>
    </div>
  );
}
