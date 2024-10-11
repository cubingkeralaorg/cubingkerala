"use client";

import { cn } from "@/lib/utils";
import DotPattern from "@/components/magicui/dot-pattern";
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
      <div className="container px-6 flex justify-center items-center py-8 md:py-28">
        <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-1">
          <div className="space-y-2 text-start md:text-center w-full">
            <h1 className="text-4xl font-bold tracking-tighter md:text-7xl">
              Welcome to the
              Rubik&apos;s Cube Community in Kerala.
            </h1>
            <p className="text-stone-400 pb-5 mx-auto md:text-xl text-start md:text-center max-w-[850px] md:pt-5 block md:hidden">
              We organize events, competitions, and meetups to bring together cubers of all skill levels. <br /> Whether you&apos;re a seasoned speedsolver or just starting your journey, our community offers a space where you can learn, grow, and share your passion for cubing. <br /> Together, we can unlock not only the secrets of each puzzle but also the potential within ourselves.
            </p>
            <p className="text-stone-400 pb-5 mx-auto md:text-xl text-start md:text-center max-w-[950px] md:pt-5 hidden md:block">
              Join us for events, competitions, and meetups that connect cubers of all skill levels. Whether you&apos;re an experienced speedsolver or a beginner, our community is here to help you learn and grow. Together, we can explore the puzzles and unlock our potential.
            </p>
            <div className="flex items-center justify-start md:justify-center">
              {
                !user && <ShimmerButton className="py-2 px-4" onClick={handleRedirectToLogin}><span className="text-green-400">Get started</span></ShimmerButton>
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
