import React, { Suspense } from "react";
import BeginnerVideosSection from "./beginner-videos";
import IntermediateVideosSection from "./intermediate-videos";
import AdvancedVideosSection from "./advanced-videos";
import LearnLoading from "../../app/learn/loading";

const Learn = () => {
  return (
    <Suspense fallback={<LearnLoading />}>
      <div className="py-2 md:py-1">
        <BeginnerVideosSection />
        <IntermediateVideosSection />
        <AdvancedVideosSection />

        <section className="container mx-auto px-4 md:px-5 mt-8 md:mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <article className="rounded-xl border border-border bg-gradient-to-br from-background to-muted/30 p-5">
              <h3 className="text-lg font-semibold text-foreground">Learning Roadmap</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Start with notation and finger tricks, move to F2L and look-ahead, then polish execution with timed solves.
              </p>
            </article>
            <article className="rounded-xl border border-border bg-gradient-to-br from-background to-muted/30 p-5">
              <h3 className="text-lg font-semibold text-foreground">Practice Toolkit</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Use focused drills, session notes, and weekly progression targets to improve consistency and turning control.
              </p>
            </article>
            <article className="rounded-xl border border-border bg-gradient-to-br from-background to-muted/30 p-5">
              <h3 className="text-lg font-semibold text-foreground">Coach Guidance</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Learn with feedback from experienced cubers to fix inefficiencies early and build strong long-term habits.
              </p>
            </article>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-foreground text-background p-6 md:p-7">
            <h4 className="text-xl md:text-2xl font-semibold">Ready to level up for competition?</h4>
            <p className="text-sm md:text-base text-background/80 mt-2 max-w-2xl leading-relaxed">
              Combine class sessions with official competitions to benchmark your progress and gain confidence under pressure.
            </p>
          </div>
        </section>
      </div>
    </Suspense>
  );
};

export default Learn;
