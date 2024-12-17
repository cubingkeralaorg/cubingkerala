"use client";

import BlurIn from "@/components/ui/blur-in";
import { RainbowButton } from "@/components/ui/rainbow-button";


export default function ClassesComponent() {
    return (
        <div className="flex flex-col items-center w-full px-6 py-8 space-y-6">
            <div className="flex flex-col items-center justify-center w-full space-y-4 h-[60vh] px-6 py-8 bg-neutral-900 rounded-lg shadow-lg">
            <BlurIn
                    word="Classes"
                    className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-4xl md:text-6xl font-bold leading-none tracking-tighter text-transparent"
                />
                <BlurIn
                    word="Coming Soon!"
                    className="text-4xl text-stone-200 font-bold tracking-tighter md:text-6xl"
                />
            </div>
        </div>
    );
}
