import BeginnerVideosSection from "./beginner-videos";
import IntermediateVideosSection from "./intermediate-videos";
import AdvancedVideosSection from "./advanced-videos";
import { PageShell } from "@/components/shared/page-shell";

export default function Learn() {
  return (
    <PageShell
      title="Learn"
      description="Beginner through advanced videos for solving and getting faster."
      headerClassName="mb-10"
    >
      <div className="flex flex-col gap-16">
        <BeginnerVideosSection />
        <IntermediateVideosSection />
        <AdvancedVideosSection />
      </div>
    </PageShell>
  );
}
