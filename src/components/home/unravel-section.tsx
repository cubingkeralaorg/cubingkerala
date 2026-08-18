import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { ContactSection } from "./contact-section";
import {
  LANDING_SECTION_INNER_PY_CLASS,
  LANDING_VIEWPORT_SECTION_CLASS,
  SOCIAL_LINKS,
  UNRAVEL_BLOCK_GAP_CLASS,
} from "./constants";
import { NAVBAR_LINK_CLASS } from "@/components/layout/navbar/layout";

const SOCIAL_ICONS = {
  whatsapp: FaWhatsapp,
  instagram: FaInstagram,
  facebook: FaFacebook,
} as const;

export function CubingKeralaUnravel() {
  return (
    <section className={LANDING_VIEWPORT_SECTION_CLASS}>
      <div
        className={`container mx-auto flex w-full flex-col px-4 sm:px-6 lg:px-8 ${UNRAVEL_BLOCK_GAP_CLASS} ${LANDING_SECTION_INNER_PY_CLASS}`}
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
              <p className="text-sm font-medium text-muted-foreground">
                Mission
              </p>
              <p className="text-muted-foreground md:text-lg">
                Grow the sport in Kerala: more competitions, more cubers, and a
                community that helps people learn, compete, and stay connected.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-muted-foreground">
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
                      className={`${NAVBAR_LINK_CLASS} gap-2`}
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
