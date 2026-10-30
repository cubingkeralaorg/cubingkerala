import { NAVBAR_CONTAINER_CLASS } from "@/components/layout/navbar/layout";

// Capped at the site's usual max width (same container the navbar and
// footer use), not edge-to-edge — that container is the site's actual
// width ceiling, the narrow max-w-160 column is only for the hero and
// preview sections above it.
export function CommunityBannerSection() {
  return (
    <section className={`${NAVBAR_CONTAINER_CLASS}`}>
      <div className="rounded-xl border border-border">
        <img
          src="/community-banner.webp"
          alt="The Cubing Kerala community"
          width={1671}
          height={889}
          loading="lazy"
          decoding="async"
          className="h-auto w-full rounded-lg"
        />
      </div>
    </section>
  );
}
