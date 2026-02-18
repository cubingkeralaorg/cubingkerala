'use client'

import { useRouter } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import LoginLotttieComponent from "./login-lottie"
import LoginLoadingComponent from "./login-loading"
import { GradientText } from "@/components/shared"
import { RainbowButton } from "../ui/rainbow-button"
import DotPattern from "../magicui/dot-pattern"
import { cn } from "@/lib/utils"
import LoginLoadingForPage from '../../app/login/loading'


export default function LoginComponent() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setLoading(true);
    router.push('/api/auth/login');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => setLoading(false);
  }, []);

  return (
    <Suspense fallback={<LoginLoadingForPage />}>
      <div className=" text-foreground h-[75vh] md:h-[78vh] relative flex items-center justify-center">
        <div className="flex flex-col mx-auto max-w-lg w-full animate-fade-in">
          <div className="space-y-1">
            <GradientText width={2} name="Cubing Kerala" />
            <p className="text-muted-foreground text-sm md:text-medium text-center">Authenticate with World Cube Association</p>
          </div>
          <div>
            <div className="flex items-center justify-center h-[230px] w-full"><LoginLotttieComponent path="/login2.json" /></div>
            <div className="flex items-center justify-center py-4">
                <RainbowButton
                  onClick={handleLogin}
                  className="font-semibold w-[80vw] md:w-2/3 h-11 gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center h-6">
                      <LoginLoadingComponent />
                    </div>
                  ) : (
                    <>
                      <Image width={50} height={50} src="/WCALogo.svg" className="h-5 w-5" alt="wca-logo" />
                      Login
                    </>
                  )}
                </RainbowButton>
            </div>
          </div>
        </div>
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "opacity-50 [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
          )}
        />
      </div>
    </Suspense>
  )
}
