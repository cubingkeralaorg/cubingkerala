import DotPattern from "./magicui/dot-pattern";
import { cn } from "@/lib/utils";
import ShimmerButton from "./magicui/shimmer-button";
import { useRouter } from "next/navigation";

export function CubingKeralaCalendars() {


    const router = useRouter();

    const handleRedirectToCompetitions = () => {
        router.push('/competitions')
    }

    return (
        <div className="relative flex py-12 md:py-24 lg:py-32 w-full flex-col items-center justify-center overflow-hidden rounded-none bg-black text-stone-200">
            <div className="container z-20 px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-start md:text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg text-sm text-green-500">Upcoming Competitions</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Mark Your Calendars</h2>
                        <p className="max-w-[900px] text-stone-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Stay tuned for our upcoming Rubik&apos;s Cube competitions in Kerala. Compete against the best cubers and
                            showcase your skills.
                        </p>
                    </div>
                    <div className="flex items-center justify-start md:justify-center w-full"><ShimmerButton onClick={handleRedirectToCompetitions}><span className="text-green-400 w-full">Competitions</span></ShimmerButton></div>
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
