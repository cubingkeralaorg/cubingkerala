"use client";

import { useOnScreen } from "@/utils/animation";
import { useEffect, useState } from "react";
import cookie from "cookie";
import { motion } from "framer-motion";
import { HeroSection, CalendarSection, LegendsSection, UnravelSection } from "@/components/home";
import { UserInfo } from "@/types/api";

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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
        <section className="mx-5">
          <CalendarSection />
        </section>
        <section className="mx-5">
          <LegendsSection />
        </section>
        <section className="mx-5 pb-5">
          <UnravelSection />
        </section>
      </main>
    </div>
  );
}

