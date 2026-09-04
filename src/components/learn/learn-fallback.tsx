import { PageContentLoading, PageShell } from "@/components/shared/page-shell";

export function LearnFallback() {
  return (
    <PageShell
      title="Learn"
      description="Beginner through advanced videos for solving and getting faster."
      headerClassName="mb-10"
    >
      <PageContentLoading />
    </PageShell>
  );
}
