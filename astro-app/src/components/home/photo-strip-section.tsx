import { NAVBAR_CONTAINER_CLASS } from "@/components/layout/navbar/layout";

interface Photo {
  src: string;
  alt: string;
}

// Tiles per row that are visible on first paint.
const EAGER_COUNT = 4;

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
          className="h-[160px] w-[220px] relative shrink-0 overflow-hidden rounded-2xl sm:h-[190px] sm:w-[260px]"
        >
          {/* Pulsing placeholder behind the photo (separate element so the
              pulse never fades the photo itself): the <img> is transparent
              until its bytes arrive, so slow photos show a soft tile instead
              of a hole. */}
          <span aria-hidden className="absolute inset-0 animate-pulse bg-muted" />
          <img
            src={photo.src}
            alt={photo.alt}
            // The first few tiles of each row are on screen at load — fetch
            // them right away at high priority; the rest (and the duplicate
            // copy, same URLs) can wait until they near the viewport.
            loading={index < EAGER_COUNT ? "eager" : "lazy"}
            fetchPriority={index < EAGER_COUNT ? "high" : "auto"}
            decoding="async"
            className="relative h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:hover:scale-105"
          />
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
//
// Photos now come from the Photos table (admin-managed via /requests, see
// photo-gallery-admin.tsx) instead of a hardcoded list — row1/row2 are
// split server-side in index.astro by alternating insertion order, so
// newly added photos land in whichever row keeps the two balanced.
export function HeroPhotoMarquee({ row1, row2 }: { row1: Photo[]; row2: Photo[] }) {
  if (row1.length === 0 && row2.length === 0) return null;

  return (
    <section className={`${NAVBAR_CONTAINER_CLASS} marquee-fade overflow-hidden`}>
      <div className="flex flex-col gap-3">
        {row1.length > 0 && <MarqueeRow photos={row1} durationSeconds={38} />}
        {row2.length > 0 && <MarqueeRow photos={row2} durationSeconds={32} reverse />}
      </div>
    </section>
  );
}
