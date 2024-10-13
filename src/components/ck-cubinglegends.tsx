"use client";

import { cn } from "@/lib/utils";
import DotPattern from "./magicui/dot-pattern";
import { useRouter } from "next/navigation";
import { RainbowButton } from "./ui/rainbow-button";
import { IoIosArrowForward } from "react-icons/io";


const CubingKeralaCubingLengends = () => {

    const router = useRouter();

    const handleRedirectToRankings = () => {
        router.push('/rankings')
    }

    return (
        <div className="relative flex h-full w-full py-12 md:py-24 lg:py-32 items-center justify-center overflow-hidden bg-black text-stone-200">
            <div className="container px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-start md:text-center">
                    <div className="space-y-4">
                        <div className="inline-block rounded-lg text-sm text-green-400">Top Ranked Cubers</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-7xl">
                            Cubing Legends of Kerala
                        </h2>
                        <p className="max-w-[900px] text-stone-400 text-[15px] md:text-xl">
                            Meet the top-ranked Rubik&apos;s Cube solvers in Kerala.
                        </p>
                    </div>
                    <div className="flex items-center justify-start md:justify-center w-full"><RainbowButton className="text-green-400 hover:text-green-500 gap-1" onClick={handleRedirectToRankings}><span>Rankings</span><IoIosArrowForward/></RainbowButton></div>
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

export default CubingKeralaCubingLengends;
