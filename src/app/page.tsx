"use client";

import { useOnScreen } from "@/util/animation";
import { useEffect, useState } from "react";
import cookie from "cookie";
import { UserInfo } from "@/types/types";
import { motion } from "framer-motion";
import CubingKeralaGetStarted from "@/components/ck-getstarted";
import { CubingKeralaCalendars } from "@/components/ck-calendar";
import CubingKeralaCubingLengends from "@/components/ck-cubinglegends";
import { CubingKeralaUnravel } from "@/components/ck-unravel";

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const [ref1, isVisible1] = useOnScreen({ threshold: 0.1 });
  const [ref2, isVisible2] = useOnScreen({ threshold: 0.1 });
  const [ref3, isVisible3] = useOnScreen({ threshold: 0.1 });
  const [ref4, isVisible4] = useOnScreen({ threshold: 0.1 });

  // Track which sections have been animated (once animated, stay animated)
  const [hasAnimated1, setHasAnimated1] = useState(false);
  const [hasAnimated2, setHasAnimated2] = useState(false);
  const [hasAnimated3, setHasAnimated3] = useState(false);
  const [hasAnimated4, setHasAnimated4] = useState(false);

  useEffect(() => {
    if (isVisible1 && !hasAnimated1) setHasAnimated1(true);
    if (isVisible2 && !hasAnimated2) setHasAnimated2(true);
    if (isVisible3 && !hasAnimated3) setHasAnimated3(true);
    if (isVisible4 && !hasAnimated4) setHasAnimated4(true);
  }, [
    isVisible1,
    isVisible2,
    isVisible3,
    isVisible4,
    hasAnimated1,
    hasAnimated2,
    hasAnimated3,
    hasAnimated4,
  ]);

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
            <CubingKeralaGetStarted />
          </motion.div>
        </section>
        <section ref={ref2} className="mx-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: hasAnimated2 ? 1 : 0,
              y: hasAnimated2 ? 0 : 20,
            }}
            transition={{ duration: 1 }}
          >
            <CubingKeralaCalendars />
          </motion.div>
        </section>
        <section ref={ref3} className="mx-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: hasAnimated3 ? 1 : 0,
              y: hasAnimated3 ? 0 : 20,
            }}
            transition={{ duration: 1 }}
          >
            <CubingKeralaCubingLengends />
          </motion.div>
        </section>
        <section ref={ref4} className="mx-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: hasAnimated4 ? 1 : 0,
              y: hasAnimated4 ? 0 : 20,
            }}
            transition={{ duration: 1 }}
          >
            <CubingKeralaUnravel />
          </motion.div>
        </section>
      </main>
    </div>
  );
}
