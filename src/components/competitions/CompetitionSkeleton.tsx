import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const cellClass = "border border-border px-4 py-2.5";

export function CompetitionSkeleton() {
  return (
    <Table className="w-full border-collapse text-sm [&_tr]:border-0">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className={cn(cellClass, "h-10 font-medium text-muted-foreground w-[180px] md:w-[220px] whitespace-nowrap")}>
            Date
          </TableHead>
          <TableHead className={cn(cellClass, "h-10 font-medium text-muted-foreground whitespace-nowrap")}>
            Name
          </TableHead>
          <TableHead className={cn(cellClass, "h-10 font-medium text-muted-foreground whitespace-nowrap")}>
            Status
          </TableHead>
          <TableHead className={cn(cellClass, "h-10 font-medium text-muted-foreground whitespace-nowrap")}>
            Location
          </TableHead>
          <TableHead className={cn(cellClass, "h-10 text-right font-medium text-muted-foreground whitespace-nowrap")}>
            Events
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 12 }).map((_, index) => (
          <TableRow key={index} className="hover:bg-transparent">
            <TableCell className={cellClass}>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell className={cellClass}>
              <Skeleton className="h-4 w-48" />
            </TableCell>
            <TableCell className={cellClass}>
              <Skeleton className="h-5 w-20" />
            </TableCell>
            <TableCell className={cellClass}>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className={cellClass}>
              <div className="flex items-center justify-end gap-1.5">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
