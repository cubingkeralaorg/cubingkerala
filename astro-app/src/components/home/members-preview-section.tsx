import { MembersTable } from "@/components/members/members-table";
import type { MemberWcaSummary, RequestInfo } from "@/types/member";
import { DATA_GRID_WRAP } from "@/components/ui/data-grid";

// Curated preview, not the full team list (see /members for that): every
// co-founder, then these specific organisers, in this order.
const FEATURED_ORGANISER_WCAIDS = ["2012CHAK01", "2015KHAN18"];

// Local names are parenthesized, e.g. "Name (പേര്)" — sort on the display
// name only, same as how it's shown elsewhere (e.g. member-detail.tsx).
function displayName(member: RequestInfo): string {
  return member.name.split("(")[0].trim();
}

export function MembersPreviewSection({
  members,
  wcaSummaries,
}: {
  members: RequestInfo[];
  wcaSummaries: Record<string, MemberWcaSummary>;
}) {
  const coFounders = members
    .filter((member) => member.role === "co-founder")
    .sort((a, b) => displayName(a).localeCompare(displayName(b)));
  const featuredOrganisers = FEATURED_ORGANISER_WCAIDS.map((wcaid) =>
    members.find((member) => member.wcaid === wcaid),
  ).filter((member): member is RequestInfo => member !== undefined);
  const team = [...coFounders, ...featuredOrganisers];

  return (
    <section>
      <h2 className="mb-1.5 text-sm font-medium">The people</h2>
      <p className="mb-4 text-muted-foreground">Organisers and co-founders who keep it running.</p>

      <div className="relative">
        <div className={DATA_GRID_WRAP}>
          <MembersTable members={team} wcaSummaries={wcaSummaries} />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-md bg-gradient-to-b from-transparent to-background"
        />
      </div>

      <p className="mt-3 text-sm">
        <a href="/members" className="text-primary hover:underline">
          View all {members.length} members →
        </a>
      </p>
    </section>
  );
}
