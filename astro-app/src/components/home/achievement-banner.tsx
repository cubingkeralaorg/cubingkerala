import { useEffect, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mediaUrl } from "@/config/media";

const CONFETTI_COLORS = ["#2f9e62", "#f2c94c", "#eb5757", "#2f80ed", "#bb6bd9", "#f2994a"];
const CONFETTI_COUNT = 48;

const COMPETITION_DETAILS = [
  { label: "Competition", value: "Sanskara Cube Open 2025" },
  { label: "Date", value: "June 28–29, 2025" },
  { label: "Location", value: "Sanskara School, Kochi, Kerala, India" },
];

interface ConfettiPiece {
  id: number;
  dx: number;
  dy: number;
  delay: number;
  duration: number;
  color: string;
  rotate: number;
  isCircle: boolean;
}

/**
 * Random confetti config is generated client-side only (useEffect, not at
 * render time) so the server-rendered markup has none — Math.random() at
 * render would differ between server and client and break hydration.
 */
function useConfettiBurst() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: CONFETTI_COUNT }, (_, id) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 90 + Math.random() * 180;
        return {
          id,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          delay: Math.random() * 0.3,
          duration: 1 + Math.random() * 0.8,
          color: CONFETTI_COLORS[id % CONFETTI_COLORS.length],
          rotate: Math.random() * 360,
          isCircle: id % 3 === 0,
        };
      }),
    );
  }, []);

  return pieces;
}

export function AchievementBanner() {
  const confetti = useConfettiBurst();

  return (
    <section className="relative flex flex-col items-center gap-8 overflow-hidden lg:flex-row lg:items-center lg:justify-center lg:gap-16">
      <div className="relative shrink-0">
        {confetti.length > 0 && (
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 size-0">
            {confetti.map((piece) => (
              <span
                key={piece.id}
                className={`absolute left-0 top-0 size-2 opacity-0 ${piece.isCircle ? "rounded-full" : "rounded-sm"}`}
                style={
                  {
                    backgroundColor: piece.color,
                    animation: `confetti-burst ${piece.duration}s ease-out ${piece.delay}s forwards`,
                    "--confetti-dx": `${piece.dx}px`,
                    "--confetti-dy": `${piece.dy}px`,
                    "--confetti-spin": `${piece.rotate + 360}deg`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        )}

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
