"use client";

import React, { Suspense } from "react";
import BeginnerVideosSection from "./beginner-videos";
import IntermediateVideosSection from "./intermediate-videos";
import AdvancedVideosSection from "./advanced-videos";
import LoadingComponent from "@/components/shared/loading";
import { FadeUp, PageReveal } from "../ui/fade-up";

const Learn = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <PageReveal className="py-2 md:py-1">
        <FadeUp>
          <BeginnerVideosSection />
        </FadeUp>
        <FadeUp>
          <IntermediateVideosSection />
        </FadeUp>
        <FadeUp>
          <AdvancedVideosSection />
        </FadeUp>
      </PageReveal>
    </Suspense>
  );
};

export default Learn;
