import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export function MembersSkeleton() {
  return (
    <Table className="w-full">
      <TableHeader className="border-y hover:bg-transparent border-y-border">
        <TableRow className="text-sm md:text-[15px] hover:bg-transparent border-none">
          <TableHead className="text-muted-foreground w-[50px]">#</TableHead>
          <TableHead className="text-muted-foreground">Name</TableHead>
          <TableHead className="text-muted-foreground w-[150px]">WCA ID</TableHead>
          <TableHead className="text-muted-foreground w-[120px]">Role</TableHead>
          <TableHead className="text-muted-foreground w-[120px]">Competitions</TableHead>
          <TableHead className="text-muted-foreground w-[100px]">Medals</TableHead>
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
              <Skeleton className="h-6 w-20 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
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
  );
}
