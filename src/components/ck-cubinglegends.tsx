"use client";

import { cn } from "@/lib/utils";
import DotPattern from "./magicui/dot-pattern";
import ShimmerButton from "./magicui/shimmer-button";
import { useRouter } from "next/navigation";

const CubingKeralaCubingLengends = () => {

    const router = useRouter();

    const handleRedirectToRankings = () => {
        router.push('/rankings')
    }

    return (
        <div className="relative flex h-full w-full py-12 md:py-24 lg:py-32 items-center justify-center overflow-hidden bg-black text-stone-200">
            <div className="container px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-start md:text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg px-3 py-1 text-sm text-green-400">Top Ranked Cubers</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-7xl">
                            Cubing Legends of Kerala
                        </h2>
                        <p className="max-w-[900px] text-stone-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Meet the top-ranked Rubik&apos;s Cube solvers in Kerala, who have dedicated their time and effort to
                            mastering the art of cubing.
                        </p>
                    </div>
                    <div className="flex items-center justify-start md:justify-center w-full"><ShimmerButton className="py-2 px-4" onClick={handleRedirectToRankings}><span className="text-green-400 w-full">Rankings</span></ShimmerButton></div>
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
