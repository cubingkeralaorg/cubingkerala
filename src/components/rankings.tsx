import { FilterComponent } from "@/components/filter"
import SearchComponent from "@/components/search"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default async function RankingsComponent() {

  return (
    <div className="w-full mx-auto py-6 md:py-8 px-4 md:px-6 text-stone-200">
      <h1 className="text-3xl font-bold text-center mb-5">Rankings</h1>
      {/* <div className="flex items-center justify-center gap-3 md:justify-between mb-6">
        <SearchComponent />
        <div>
          <FilterComponent/>
        </div>
      </div>
      <div className="overflow-auto rounded-none border h-[400px]">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">John Doe</TableCell>
              <TableCell>john.doe@example.com</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>2023-04-15</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Jane Smith</TableCell>
              <TableCell>jane.smith@example.com</TableCell>
              <TableCell>Member</TableCell>
              <TableCell>2023-03-01</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Bob Johnson</TableCell>
              <TableCell>bob.johnson@example.com</TableCell>
              <TableCell>Member</TableCell>
              <TableCell>2022-11-20</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Alice Williams</TableCell>
              <TableCell>alice.williams@example.com</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>2022-08-01</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Tom Davis</TableCell>
              <TableCell>tom.davis@example.com</TableCell>
              <TableCell>Member</TableCell>
              <TableCell>2021-12-10</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Sarah Lee</TableCell>
              <TableCell>sarah.lee@example.com</TableCell>
              <TableCell>Member</TableCell>
              <TableCell>2021-09-05</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Michael Brown</TableCell>
              <TableCell>michael.brown@example.com</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>2020-06-30</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Emily Wilson</TableCell>
              <TableCell>emily.wilson@example.com</TableCell>
              <TableCell>Member</TableCell>
              <TableCell>2019-11-15</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">David Taylor</TableCell>
              <TableCell>david.taylor@example.com</TableCell>
              <TableCell>Member</TableCell>
              <TableCell>2018-04-20</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Olivia Anderson</TableCell>
              <TableCell>olivia.anderson@example.com</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>2017-09-01</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div> */}
    </div>
  )
}