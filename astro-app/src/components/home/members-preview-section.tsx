import { MembersTable } from "@/components/members/members-table";
import type { MemberWcaSummary, RequestInfo } from "@/types/member";
import { DATA_GRID_WRAP } from "@/components/ui/data-grid";

const TEAM_ROLES = new Set(["co-founder", "organiser"]);
const PREVIEW_ROW_COUNT = 5;

export function MembersPreviewSection({
  members,
  wcaSummaries,
}: {
  members: RequestInfo[];
  wcaSummaries: Record<string, MemberWcaSummary>;
}) {
  const team = members
    .filter((member) => TEAM_ROLES.has(member.role))
    .slice(0, PREVIEW_ROW_COUNT);

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
