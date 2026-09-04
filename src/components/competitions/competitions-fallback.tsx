import {
  PageContentLoading,
  PageShell,
} from "@/components/shared/page-shell";

export function CompetitionsFallback() {
  return (
    <PageShell title="Competitions" description="Fetching competitions...">
      <PageContentLoading />
    </PageShell>
  );
}
