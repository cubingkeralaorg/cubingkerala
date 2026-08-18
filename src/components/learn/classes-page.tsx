import BeginnerVideosSection from "./beginner-videos";
import IntermediateVideosSection from "./intermediate-videos";
import AdvancedVideosSection from "./advanced-videos";
import { NAVBAR_CONTAINER_CLASS } from "@/components/layout/navbar/layout";

export default function Learn() {
  return (
    <div className={`ck-landing py-10 ${NAVBAR_CONTAINER_CLASS}`}>
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Learn
        </h1>
        <p className="w-full text-sm text-muted-foreground md:text-base lg:whitespace-nowrap">
          Beginner through advanced videos for solving and getting faster.
        </p>
      </div>
      <div className="flex flex-col gap-16">
        <BeginnerVideosSection />
        <IntermediateVideosSection />
        <AdvancedVideosSection />
      </div>
    </div>
  );
}
