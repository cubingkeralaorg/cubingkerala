import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export function RankingsSkeleton() {
  return (
    <div className="rounded-md border border-border">
      <Table className="w-full rounded-md text-sm md:text-[15px]">
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground w-[50px]">#</TableHead>
            <TableHead className="text-muted-foreground">Name</TableHead>
            <TableHead className="text-muted-foreground w-[100px]">Best</TableHead>
            <TableHead className="text-muted-foreground w-[60px]">NR</TableHead>
            <TableHead className="text-muted-foreground w-[60px]">CR</TableHead>
            <TableHead className="text-muted-foreground w-[60px]">WR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 15 }).map((_, index) => (
            <TableRow key={index} className="border-border hover:bg-transparent">
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-8" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-8" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
