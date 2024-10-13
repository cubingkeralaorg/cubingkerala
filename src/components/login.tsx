'use client'

import { Card, CardFooter } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import LoginLotttieComponent from "./login-lottie"
import ShimmerButton from "./magicui/shimmer-button"
import LoginLoadingComponent from "./login-loading"
import { AnimatedGradientTextComponent } from "./gradient-text"
import { RainbowButton } from "./ui/rainbow-button"


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
    <div className="bg-black text-stone-200 relative flex items-center justify-center">
      <div className="flex flex-col mx-auto max-w-lg w-full py-6 md:py-10 px-4 md:px-5 animate-fade-in">
        <div className="space-y-1">
          <AnimatedGradientTextComponent />
          <p className="text-neutral-500 text-sm text-center">Authenticate with World Cube Association</p>
        </div>
        <div>
          <div className="flex items-center justify-center h-[230px] w-full"><LoginLotttieComponent path="/login2.json" /></div>
          <Card className="border-none rounded-none bg-black text-stone-200">
            <CardFooter className="flex items-center justify-center">
              <RainbowButton
                onClick={handleLogin}
                className="text-green-400 hover:text-green-500 font-semibold w-full md:w-2/3 h-10"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center h-6">
                    <LoginLoadingComponent />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Image width={50} height={50} src="/WCALogo.svg" className="h-5 w-5" alt="wca-logo" />
                    <span className="font-semibold">Login</span>
                  </div>
                )}
              </RainbowButton>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
