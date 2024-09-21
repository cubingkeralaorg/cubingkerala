"use client";

import { cn } from "@/lib/utils";
import DotPattern from "@/components/magicui/dot-pattern";
import LottieComponent from "./lottie";
import { CubingKeralaTyping } from "./ck-typing";
import { UserInfo } from "@/types/types";
import ShimmerButton from "./magicui/shimmer-button";
import { useRouter } from "next/navigation";

const CubingKeralaGetStarted = ({ user }: { user: UserInfo | null }) => {

  const router = useRouter();

  const handleRedirectToLogin = () => {
    router.push('/login')
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black text-stone-200">
      <div className="container px-6 flex justify-center items-center py-5 md:py-20">
        <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-1">
          <div className="space-y-2 text-start md:text-center w-full">
            <CubingKeralaTyping />
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-7xl">
              a community dedicated to Rubik&apos;s Cube enthusiasts in Kerala.
            </h1>
            <p className="text-stone-400 pb-5 mx-auto md:text-xl text-start md:text-center max-w-[850px] md:pt-5">
              We organize events, competitions, and meetups to bring together cubers of all skill levels. <br /> Whether you&apos;re a seasoned speedsolver or just starting your journey, our community offers a space where you can learn, grow, and share your passion for cubing. <br /> Together, we can unlock not only the secrets of each puzzle but also the potential within ourselves.
            </p>
            <div className="flex items-center justify-start md:justify-center">
              {
                !user && <ShimmerButton onClick={handleRedirectToLogin}><span className="text-green-400">Get started</span></ShimmerButton>
              }
            </div>
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
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
        )}
      />
    </div>
  );
};

export default CubingKeralaGetStarted;
