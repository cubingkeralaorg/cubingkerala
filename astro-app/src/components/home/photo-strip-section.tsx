import { NAVBAR_CONTAINER_CLASS } from "@/components/layout/navbar/layout";

interface Photo {
  src: string;
  alt: string;
}

const ROW_1: Photo[] = [
  { src: "/images/competition/amrita-cube-open-2025.jpg", alt: "Amrita Cube Open 2025" },
  { src: "/images/workshop/workshop-nit-2019.jpg", alt: "Cubing workshop at NIT, 2019" },
  { src: "/images/misc/children-group.jpg", alt: "Young cubers at a Cubing Kerala meetup" },
  { src: "/images/competition/mcubes-cubing-clash-2024.jpg", alt: "Mcubes Cubing Clash 2024" },
  { src: "/images/misc/ck-members.jpg", alt: "Cubing Kerala members group photo" },
  { src: "/images/competition/tathva-2018.jpg", alt: "Tathva 2018" },
];

const ROW_2: Photo[] = [
  { src: "/images/misc/after-comp.jpg", alt: "After a competition" },
  { src: "/images/misc/ck-lunch-at-house.jpg", alt: "Cubing Kerala community lunch" },
  { src: "/images/misc/competition-img.jpg", alt: "A Cubing Kerala competition" },
  { src: "/images/competition/amrita-newcomers-twistathon-2025.jpg", alt: "Amrita Newcomers Twistathon 2025" },
  { src: "/images/competition/solve-n-cruise-serene-alleppey-2026.jpg", alt: "Solve N Cruise at Serene Alleppey 2026" },
];

// Content is duplicated (photos, photos) so a translateX(-50%) loop (see
// .marquee-track in global.css) lands exactly where the second copy starts
// — a seamless loop with no jump, no scroll container, nothing for a
// pointer or touch gesture to ever capture.
function MarqueeRow({ photos, reverse, durationSeconds }: { photos: Photo[]; reverse?: boolean; durationSeconds: number }) {
  const track = [...photos, ...photos];

  return (
    <div
      className={reverse ? "marquee-track marquee-track-reverse flex w-max gap-3" : "marquee-track flex w-max gap-3"}
      style={{ animationDuration: `${durationSeconds}s` }}
    >
      {track.map((photo, index) => (
        <div
          key={`${photo.src}-${index}`}
          className="h-[160px] w-[220px] shrink-0 overflow-hidden rounded-2xl sm:h-[190px] sm:w-[260px]"
        >
          <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

// Zero JS — pure CSS animation, so there's never a scroll/hover interaction
// with this at all. Replaces the hero's old static photo row entirely.
// Capped at the site's usual max width (same container the navbar and
// footer use) rather than running edge-to-edge — that container is the
// site's actual width ceiling.
export function HeroPhotoMarquee() {
  return (
    <section className={`${NAVBAR_CONTAINER_CLASS} marquee-fade overflow-hidden`}>
      <div className="flex flex-col gap-3">
        <MarqueeRow photos={ROW_1} durationSeconds={38} />
        <MarqueeRow photos={ROW_2} durationSeconds={32} reverse />
      </div>
    </section>
  );
}
