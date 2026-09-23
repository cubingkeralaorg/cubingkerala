import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { ContactSection } from "./contact-section";
import { SOCIAL_LINKS, UNRAVEL_BLOCK_GAP_CLASS } from "./constants";

const SOCIAL_ICONS = {
  whatsapp: FaWhatsapp,
  instagram: FaInstagram,
  facebook: FaFacebook,
} as const;

/** Fixed dark-on-green palette — this card keeps its own look across themes. */
const UNRAVEL_SOCIAL_LINK_CLASS =
  "inline-flex h-8 items-center gap-2 rounded-md px-2.5 text-sm text-zinc-800 transition-colors hover:bg-black/5";

/** Flat green fill — no top gradient/blend. */
const UNRAVEL_GRADIENT_CLASS = "bg-[#4fae79]";

export function CubingKeralaUnravel() {
  return (
    <section className="flex flex-col pt-6 sm:pt-0">
      <div className={`flex flex-col rounded-t-3xl ${UNRAVEL_GRADIENT_CLASS}`}>
        <div
          className={`container mx-auto flex w-full flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20 ${UNRAVEL_BLOCK_GAP_CLASS}`}
        >
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div className="flex flex-col items-start gap-6">
              <h2 className="text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
                <span className="block">Unraveling the cube,</span>
                <span className="mt-1 block">connecting Kerala.</span>
              </h2>
              <p className="max-w-md text-zinc-700 md:text-lg">
                Founded in 2017, Cubing Kerala runs WCA competitions, workshops,
                and meetups across the state — a home for cubers from first
                scramble to first podium.
              </p>
            </div>
            <div className="flex max-w-md flex-col gap-8 lg:pt-1">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-zinc-800">Mission</p>
                <p className="text-zinc-700 md:text-lg">
                  Grow the sport in Kerala: more competitions, more cubers, and a
                  community that helps people learn, compete, and stay connected.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-zinc-800">
                  Follow us on socials
                </p>
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
      </div>
    </section>
  );
}
