"use client"

import { motion } from "framer-motion"
import { useOnScreen } from "@/util/animation"
import CubingKeralaGetStarted from "./ck-getstarted"
import CubingKeralaCubingLengends from "./ck-cubinglegends"
import { CubingKeralaCalendars } from "./ck-calendar"
import { CubingKeralaUnravel } from "./ck-unravel"
import { useEffect, useState } from "react"
import cookie from "cookie"
import { UserInfo } from "@/types/types"
import { AlertComponent } from "./alert"

export default function HomeComponent() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isAlertShow, setIsAlertShow] = useState<boolean | null>(null);

  const [ref1, isVisible1] = useOnScreen({ threshold: 0.1 });
  const [ref2, isVisible2] = useOnScreen({ threshold: 0.1 });
  const [ref3, isVisible3] = useOnScreen({ threshold: 0.1 });
  const [ref4, isVisible4] = useOnScreen({ threshold: 0.1 });

  useEffect(() => {
    if (typeof window !== 'undefined') {

      const cookies = cookie.parse(document.cookie);
      const userInfo = cookies.userInfo;

      if (userInfo) {
        setUserInfo(JSON.parse(userInfo));
        setIsAlertShow(true);
      }
    }
  }, []);


  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        {isAlertShow && (
          <div className="absolute w-fit"><AlertComponent userInfo={userInfo} /></div>
        )}
        <section ref={ref1} className="w-full bg-black relative">
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: isVisible1 ? 1 : 0, y: isVisible1 ? 0 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <CubingKeralaGetStarted user = {userInfo} />
          </motion.div>
        </section>
        <section ref={ref2} className="w-full bg-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible2 ? 1 : 0, y: isVisible2 ? 0 : 20 }}
            transition={{ duration: 0.5 }}
          >
            <CubingKeralaCalendars />
          </motion.div>
        </section>
        <section ref={ref3} className="bg-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible3 ? 1 : 0, y: isVisible3 ? 0 : 20 }}
            transition={{ duration: 0.5 }}>
            <CubingKeralaCubingLengends />
          </motion.div>
        </section>
        <section ref={ref4} className="w-full bg-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible4 ? 1 : 0, y: isVisible4 ? 0 : 20 }}
            transition={{ duration: 0.5 }}
          >
            <CubingKeralaUnravel />
          </motion.div>
        </section>
      </main>
    </div>
  )
}

