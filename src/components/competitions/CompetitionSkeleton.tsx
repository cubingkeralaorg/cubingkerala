import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export function CompetitionSkeleton() {
  return (
    <div className="overflow-x-auto">
      <Table className="w-full text-sm md:text-[15px]">
        <TableHeader className="border-y border-y-border border-border">
          <TableRow className="border-border">
            <TableHead className="text-muted-foreground w-[180px] md:w-[220px] whitespace-nowrap transition-none">Date</TableHead>
            <TableHead className="text-muted-foreground whitespace-nowrap transition-none">Name</TableHead>
            <TableHead className="text-muted-foreground whitespace-nowrap transition-none">Status</TableHead>
            <TableHead className="text-muted-foreground whitespace-nowrap transition-none">Location</TableHead>
            <TableHead className="text-muted-foreground whitespace-nowrap transition-none text-right">Events</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 15 }).map((_, index) => (
            <TableRow key={index} className="border-border">
              <TableCell className="whitespace-nowrap transition-none">
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="whitespace-nowrap transition-none">
                <Skeleton className="h-4 w-48" />
              </TableCell>
              <TableCell className="whitespace-nowrap transition-none">
                <Skeleton className="h-5 w-20 rounded-full" />
              </TableCell>
              <TableCell className="whitespace-nowrap transition-none">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="whitespace-nowrap transition-none">
                <div className="flex items-center justify-end gap-1.5">
                  <Skeleton className="h-5 w-5 rounded-sm" />
                  <Skeleton className="h-5 w-5 rounded-sm" />
                  <Skeleton className="h-5 w-5 rounded-sm" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
