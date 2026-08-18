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
import {
  DATA_GRID_CELL,
  DATA_GRID_HEAD,
  DATA_GRID_ROW,
  DATA_GRID_TABLE,
} from "@/components/ui/data-grid";

export function MembersSkeleton() {
  return (
    <Table className={DATA_GRID_TABLE}>
      <TableHeader className="[&_tr]:border-0">
        <TableRow className={DATA_GRID_ROW}>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[50px]")}>
            #
          </TableHead>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>
            Name
          </TableHead>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[150px]")}>
            WCA ID
          </TableHead>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[120px]")}>
            Role
          </TableHead>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[120px]")}>
            Competitions
          </TableHead>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[100px]")}>
            Medals
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 12 }).map((_, index) => (
          <TableRow key={index} className={DATA_GRID_ROW}>
            <TableCell className={DATA_GRID_CELL}>
              <Skeleton className="h-4 w-4" />
            </TableCell>
            <TableCell className={DATA_GRID_CELL}>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell className={DATA_GRID_CELL}>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className={DATA_GRID_CELL}>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell className={DATA_GRID_CELL}>
              <Skeleton className="h-4 w-8" />
            </TableCell>
            <TableCell className={DATA_GRID_CELL}>
              <Skeleton className="h-4 w-8" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
