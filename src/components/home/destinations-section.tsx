import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const destinations = [
  {
    href: "/competitions",
    title: "Competitions",
    description:
      "Upcoming WCA dates, venues, and past results across Kerala.",
  },
  {
    href: "/rankings",
    title: "Rankings",
    description:
      "Kerala singles and averages by event, from 2x2 to multi-blind.",
  },
  {
    href: "/members",
    title: "Members",
    description:
      "Find cubers by name or WCA ID, and see who competes from Kerala.",
  },
  {
    href: "/learn",
    title: "Learn",
    description:
      "Beginner through advanced videos for solving and getting faster.",
  },
] as const;

export function DestinationsSection() {
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <h2 className="text-lg font-semibold tracking-tight">
        Everything for cubing in Kerala
      </h2>
      <div className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {destinations.map((item) => (
          <Card key={item.href} className="shadow-none">
            <CardHeader className="flex flex-col items-start gap-2 space-y-0 p-5">
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
              <Button variant="link" className="h-auto w-fit px-0" asChild>
                <Link href={item.href}>Learn more</Link>
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
