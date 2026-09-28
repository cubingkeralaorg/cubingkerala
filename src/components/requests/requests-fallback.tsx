import {
  PageContentLoading,
  PageShell,
} from "@/components/shared/page-shell";

export function RequestsFallback() {
  return (
    <PageShell
      title="Requests"
      description="Review pending membership requests and manage existing members."
    >
      <PageContentLoading />
    </PageShell>
  );
}
