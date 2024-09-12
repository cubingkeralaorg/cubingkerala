"use client";

import { cn } from "@/lib/utils";
import DotPattern from "@/components/magicui/dot-pattern";
import LottieComponent from "./lottie";
import Link from "next/link";
import { Button } from "./ui/button";
import { CubingKeralaTyping } from "./ck-typing";
import { UserInfo } from "@/types/types";

const CubingKeralaGetStarted = ({ user }: { user: UserInfo | null }) => {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black text-stone-200">
      <div className="container px-6 flex justify-center items-center py-5 md:py-20">
        <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-1">
          <div className="space-y-2 text-start w-full">
            <div className="w-[300px] md:w-[500px] absolute hidden lg:block lg:top-32 lg:-right-10">
              <LottieComponent path="/rubiks-cube.json" />
            </div>
            <CubingKeralaTyping />
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-7xl">
              a community dedicated to Rubik&apos;s Cube enthusiasts in Kerala.
            </h1>
            <p className="text-stone-400 pb-5 md:text-xl max-w-[850px] md:pt-5">
              We organize events, competitions, and meetups to bring together cubers of all skill levels. <br /> Whether you&apos;re a seasoned speedsolver or just starting your journey, our community offers a space where you can learn, grow, and share your passion for cubing. <br /> Together, we can unlock not only the secrets of each puzzle but also the potential within ourselves.
            </p>
            {
              !user && <Link prefetch={true} href="/login"><Button className="bg-green-400 text-black hover:bg-green-500 rounded-none">Get started</Button></Link>
            }
          </div>
          {/* for smaller screens */}
          <div className=" flex items-center justify-center w-full md:hidden z-50">
            <LottieComponent path="/rubiks-cube.json" />
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
