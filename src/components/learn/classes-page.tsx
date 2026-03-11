import React, { Suspense } from "react";
import BeginnerVideosSection from "./beginner-videos";
import IntermediateVideosSection from "./intermediate-videos";
import AdvancedVideosSection from "./advanced-videos";
import LoadingComponent from "@/components/shared/loading";

const Learn = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <div className="py-2 md:py-1">
        <BeginnerVideosSection />
        <IntermediateVideosSection />
        <AdvancedVideosSection />
      </div>
    </Suspense>
  );
};

export default Learn;
