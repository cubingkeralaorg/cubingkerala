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
  DATA_GRID_WRAP,
} from "@/components/ui/data-grid";

export function RankingsSkeleton() {
  return (
    <div className={DATA_GRID_WRAP}>
      <Table className={DATA_GRID_TABLE}>
        <TableHeader className="[&_tr]:border-0">
          <TableRow className={DATA_GRID_ROW}>
            <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[50px]")}>
              #
            </TableHead>
            <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>
              Name
            </TableHead>
            <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[100px]")}>
              Best
            </TableHead>
            <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[60px]")}>
              NR
            </TableHead>
            <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[60px]")}>
              CR
            </TableHead>
            <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[60px]")}>
              WR
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
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell className={DATA_GRID_CELL}>
                <Skeleton className="h-4 w-8" />
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
    </div>
  );
}
