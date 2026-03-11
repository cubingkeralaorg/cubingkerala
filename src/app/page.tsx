"use client";

import { useOnScreen } from "@/utils/animation";
import { useEffect, useState } from "react";
import cookie from "cookie";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AnimatedContactLink } from "@/components/contact";
import { HeroSection, CalendarSection, LegendsSection, UnravelSection } from "@/components/home";
import { UserInfo } from "@/types/api";

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();

  const [ref1, isVisible1] = useOnScreen({ threshold: 0.1 });
  const [hasAnimated1, setHasAnimated1] = useState(false);

  useEffect(() => {
    if (isVisible1 && !hasAnimated1) setHasAnimated1(true);
  }, [isVisible1, hasAnimated1]);

  useEffect(() => {
    scrollTo(0, 0);

    if (typeof window !== "undefined") {
      const cookies = cookie.parse(document.cookie);
      const userInfo = cookies.userInfo;

      if (userInfo) {
        setUserInfo(JSON.parse(userInfo));
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1 space-y-5 relative">
        <section ref={ref1} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: hasAnimated1 ? 1 : 0,
              y: hasAnimated1 ? 0 : 20,
            }}
            transition={{ duration: 1 }}
          >
            <HeroSection />
          </motion.div>
        </section>
        <section className="px-4 sm:px-6 lg:px-8">
          <CalendarSection />
        </section>
        <section className="px-4 sm:px-6 lg:px-8">
          <LegendsSection />
        </section>
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto bg-neutral-500/[0.04] px-4 md:px-8 border border-border rounded-lg py-10 md:py-24">
            <div className="space-y-4 sm:px-10 text-start md:text-center flex flex-col items-start md:items-center">
              <div className="inline-block rounded-lg text-sm text-green-500">
                Community Directory
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-7xl">
                Meet Kerala Members
              </h2>
              <p className="max-w-[900px] text-muted-foreground text-[15px] md:text-lg lg:whitespace-nowrap">
                Discover Kerala cubers, track progress, and stay connected with the community.
              </p>
              <div onClick={() => router.push("/members")} className="w-fit">
                <AnimatedContactLink userInfo={null} text="Members" />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 pb-8 md:pb-10">
          <UnravelSection />
        </section>
      </main>
    </div>
  );
}

