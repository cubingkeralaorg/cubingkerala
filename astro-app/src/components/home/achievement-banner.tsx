import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mediaUrl } from "@/config/media";

const COMPETITION_DETAILS = [
  { label: "Competition", value: "Sanskara Cube Open 2025" },
  { label: "Date", value: "June 28–29, 2025" },
  { label: "Location", value: "Sanskara School, Kochi, Kerala, India" },
];

export function AchievementBanner() {
  return (
    <section className="relative flex flex-col items-center gap-8 overflow-hidden lg:flex-row lg:items-center lg:justify-center lg:gap-16">
      <div className="relative shrink-0">
        <img
          src={mediaUrl("images/achievements/hari-nr.jpg")}
          alt="Hari Anjana Deepak celebrating the 3x3x3 Indian National Record"
          className="h-auto w-full max-w-xs rounded-2xl object-cover sm:max-w-sm"
        />
      </div>

      <div className="flex max-w-md w-full flex-col gap-4 self-start text-left lg:self-auto">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Former National Record · 2025
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">4.77 second solve in 3x3</h2>
          <p className="text-muted-foreground">
            <a
              href="/members/2022DEEP01"
              className="font-medium text-foreground hover:text-primary"
            >
              Hari A. Deepak
            </a>{" "}
            set the Indian National Record of 4.77 seconds at the Sanskara Cube Open
            2025, in the 3x3x3 Cube First Round on Saturday, June 28.
          </p>
        </div>

        <dl className="flex flex-col gap-1.5 text-sm">
          {COMPETITION_DETAILS.map((detail) => (
            <div key={detail.label}>
              <dt className="inline font-medium text-foreground">{detail.label}: </dt>
              <dd className="inline text-muted-foreground">{detail.value}</dd>
            </div>
          ))}
        </dl>

        <Button variant="link" className="h-auto w-fit px-0" asChild>
          <a
            href="https://www.worldcubeassociation.org/persons/2022DEEP01"
            target="_blank"
            rel="noopener noreferrer"
          >
            2022DEEP01
            <ArrowUpRight />
          </a>
        </Button>
      </div>
    </section>
  );
}
