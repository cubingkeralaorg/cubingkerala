import { FaGithub, FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { SOCIAL_LINKS, GITHUB_URL } from "@/config/social";
import { LogoLink } from "./logo-link";
import { EmailControl } from "./email-control";
import { NAVBAR_CONTAINER_CLASS } from "./navbar/layout";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types/member";

const SOCIAL_ICONS = {
  whatsapp: FaWhatsapp,
  instagram: FaInstagram,
  facebook: FaFacebook,
} as const;

/** Icon-only link button — muted, green on hover, same treatment as a text nav link. */
const ICON_BUTTON_CLASS =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-primary";

export function FooterSocialLinks() {
  return (
    <div className="flex items-center gap-1">
      {SOCIAL_LINKS.map((social) => {
        const Icon = SOCIAL_ICONS[social.id];
        return (
          <a
            key={social.id}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={ICON_BUTTON_CLASS}
            aria-label={social.name}
          >
            <Icon className="size-4" />
          </a>
        );
      })}
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={ICON_BUTTON_CLASS}
        aria-label="GitHub repository"
      >
        <FaGithub className="size-4" />
      </a>
    </div>
  );
}

export function BuiltByLink({ className }: { className?: string }) {
  return (
    // "Built by" is plain text — only the logo+name pair links out, so
    // the link's clickable area actually matches what it looks like it's
    // naming. Every segment (Built, by, the link as a whole) sits under one
    // gap value for even spacing; the logo and name inside the link get
    // their own, tighter gap since they're meant to read as one unit.
    <span className={cn("flex items-center gap-0.5 text-xs text-muted-foreground", className)}>
      <span>Built</span>
      <span>by</span>
      <a
        href="https://allenjohn.me"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-px transition-colors hover:text-foreground"
      >
        <img
          src="/allen-logo-transparent.png"
          alt="Allen John"
          width={22}
          height={22}
          className="size-5.5 dark:invert"
        />
        {/* Name only shows where there's room to spare — the footer's wide
            desktop row, not the narrower mobile menu bar. */}
        <span className="hidden sm:inline">Allen John</span>
      </a>
    </span>
  );
}

export const Footer = ({
  topPaddingClassName = "pt-10 sm:pt-24",
  isLoggedIn = false,
  initialProfile = null,
}: {
  /** Pages that end right at the footer with their own clear bottom edge (e.g. the home page's bordered banner) need less buffer above it than a page ending in a plain table. */
  topPaddingClassName?: string;
  isLoggedIn?: boolean;
  initialProfile?: UserProfile | null;
}) => {
  return (
    <footer className="bg-background">
      <div className={NAVBAR_CONTAINER_CLASS}>
        <div className={cn("flex flex-col gap-6 pb-8", topPaddingClassName)}>
          <div className="flex items-center justify-between gap-3">
            <LogoLink titleClassName="hidden sm:inline" />

            {/* Email collapses to an icon below sm (see EmailControl) so
                this fits in one row even on narrow screens. */}
            <div className="flex items-center gap-x-1">
              <EmailControl isLoggedIn={isLoggedIn} initialProfile={initialProfile} />
              <FooterSocialLinks />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              &copy; {new Date().getFullYear()} Cubing Kerala. All rights reserved.
            </p>
            <BuiltByLink />
          </div>
        </div>
      </div>
    </footer>
  );
};
