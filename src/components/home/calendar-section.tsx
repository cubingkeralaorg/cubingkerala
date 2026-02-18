import { useRouter } from "next/navigation";
import { AnimatedContactLink } from "@/components/contact";

export function CubingKeralaCalendars() {
  const router = useRouter();

  const handleRedirectToCompetitions = () => {
    router.push("/competitions");
  };

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-none text-foreground">
      <div className="container z-20 bg-card px-4 border border-border rounded-lg py-10 md:py-24">
        <div className="flex flex-col items-center justify-center space-y-4 text-start md:text-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg text-sm text-green-500">
              Upcoming Competitions
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-7xl">
              Mark Your Calendars
            </h2>
            <p className="max-w-[900px] text-muted-foreground text-[15px] md:text-lg">
              Stay tuned for our upcoming Rubik&apos;s Cube competitions in
              Kerala.
            </p>
          </div>
          <div className="flex items-center justify-start sm:justify-center md:justify-center w-full">
            <div onClick={() => handleRedirectToCompetitions()}>
              <AnimatedContactLink userInfo={null} text="Competitions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
