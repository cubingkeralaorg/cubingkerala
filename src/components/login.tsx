'use client'

import { Card, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import LoadingComponent from "./loading"
import Image from "next/image"
import LoginLotttieComponent from "./login-lottie"
import ShimmerButton from "./magicui/shimmer-button"
import LoginLoadingComponent from "./login-loading"


export default function LoginComponent() {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleLogin = () => {
    setLoading(true);
    router.push('/api/auth/login');
  };

  useEffect(() => {
    return () => setLoading(false);
  }, []);


  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  },[]);

  return (
    <div className="bg-black text-stone-200 relative">
      {
        isLoading ? (<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <LoadingComponent />
        </div>) : (
          <div className="flex flex-col mx-auto max-w-lg w-full py-8 md:py-10 px-4 md:px-5 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-center text-green-500">Cubing Kerala Login</h1>
              <p className="text-neutral-500 text-sm text-center">Login with World Cube Association</p>
            </div>
            <div>
              <div className="flex items-center justify-center w-full"><LoginLotttieComponent path="/login.json" /></div>
              <Card className="border-none rounded-none bg-black text-stone-200">
                <CardFooter className="flex items-center justify-center">
                  <ShimmerButton
                    onClick={handleLogin}
                    className="text-green-400 font-semibold w-full md:w-2/3"
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
                  </ShimmerButton>
                </CardFooter>
              </Card>
            </div>
          </div>
        )
      }
    </div>
  )
}
