import Link from "next/link";
import { Button } from "./ui/button";
import DotPattern from "./magicui/dot-pattern";
import { cn } from "@/lib/utils";

export function CubingKeralaCalendars() {
    return (
        <div className="relative flex py-12 md:py-24 lg:py-32 w-full flex-col items-center justify-center overflow-hidden rounded-none bg-black text-stone-200">
            {/* <Ripple /> */}
            <div className="container z-20 px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg px-3 py-1 text-sm text-green-500">Upcoming Competitions</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Mark Your Calendars</h2>
                        <p className="max-w-[900px] text-stone-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Stay tuned for our upcoming Rubik&apos;s Cube competitions in Kerala. Compete against the best cubers and
                            showcase your skills.
                        </p>
                    </div>
                    <Link prefetch={true} href="/competitions"><Button className="bg-green-400 text-black hover:bg-green-500 rounded-none">Competitions</Button></Link>
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
}
