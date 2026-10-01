import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { ContactSection } from "./contact-section";
import { SOCIAL_LINKS, UNRAVEL_BLOCK_GAP_CLASS } from "./constants";

const SOCIAL_ICONS = {
  whatsapp: FaWhatsapp,
  instagram: FaInstagram,
  facebook: FaFacebook,
} as const;

const UNRAVEL_SOCIAL_LINK_CLASS =
  "inline-flex h-8 items-center gap-2 rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground";

/**
 * Reserves one full screen (minus the sticky navbar) for this section, the
 * same way the hero does, minus a bit more to leave room for the footer
 * (measured ~168px/10.5rem on desktop, taller on narrower screens where it
 * wraps into more rows) — so scrolling one viewport past the hero lands
 * cleanly on this section with the footer already in view, no extra scroll
 * needed and no hero bleeding in above it.
 */
const UNRAVEL_VIEWPORT_SECTION_CLASS =
  "flex min-h-[calc(100dvh-22rem)] flex-col justify-center sm:min-h-[calc(100dvh-20rem)] lg:min-h-[calc(100dvh-16rem)]";

export function CubingKeralaUnravel() {
  return (
    <section className={UNRAVEL_VIEWPORT_SECTION_CLASS}>
      <div
        className={`container mx-auto flex w-full flex-col px-4 pt-8 pb-16 sm:px-6 sm:pt-0 sm:pb-14 lg:px-8 lg:pb-20 ${UNRAVEL_BLOCK_GAP_CLASS}`}
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="flex flex-col items-start gap-6">
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
              <span className="block">Unraveling the cube,</span>
              <span className="mt-1 block">connecting Kerala.</span>
            </h2>
            <p className="max-w-md text-muted-foreground md:text-lg">
              Founded in 2017, Cubing Kerala runs WCA competitions, workshops,
              and meetups across the state — a home for cubers from first
              scramble to first podium.
            </p>
          </div>
          <div className="flex max-w-md flex-col gap-8 lg:pt-1">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Mission</p>
              <p className="text-muted-foreground md:text-lg">
                Grow the sport in Kerala: more competitions, more cubers, and a
                community that helps people learn, compete, and stay connected.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">Follow us on socials</p>
              <div className="-ml-2.5 flex flex-wrap items-center gap-1">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = SOCIAL_ICONS[social.id];
                  return (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={UNRAVEL_SOCIAL_LINK_CLASS}
                    >
                      <Icon className="size-4" />
                      {social.name}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <ContactSection />
      </div>
    </section>
  );
}
