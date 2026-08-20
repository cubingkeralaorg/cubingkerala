import {
  PageContentLoading,
  PageShell,
} from "@/components/shared/page-shell";
import { getEventName } from "@/utils/event-names";

export function RankingsFallback() {
  return (
    <PageShell
      title="Rankings"
      description={`Showing results for ${getEventName("333")} single`}
    >
      <PageContentLoading />
    </PageShell>
  );
}
