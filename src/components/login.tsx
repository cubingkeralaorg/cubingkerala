'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import LoadingComponent from "./loading"


export default function LoginComponent() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setLoading(true);
    router.push('/api/auth/login');
  };

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-black text-stone-200 relative">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-8 py-[100px] md:py-[150px] md:px-8">
        <Card className="border-none rounded-none bg-black text-stone-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">Cubing Kerala Login</CardTitle>
            <CardDescription className="text-neutral-500">Login with World Cube Association.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={handleLogin}
              className="bg-green-400 hover:bg-green-500 rounded-none text-black w-full md:my-5"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <LoadingComponent width={10}/>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <img src="/WCALogo.svg" className="h-5 w-5" alt="wca-logo" />
                  <span>Login</span>
                </div>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function CuboidIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.82a2 2 0 0 0 .88 1.66l6.05 4.07a2 2 0 0 0 2.17.05l9.95-6.12a2 2 0 0 0 .95-1.7V8.06a2 2 0 0 0-.88-1.66Z" />
      <path d="M10 22v-8L2.25 9.15" />
      <path d="m10 14 11.77-6.87" />
    </svg>
  )
}
