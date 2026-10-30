import { NAVBAR_CONTAINER_CLASS } from "@/components/layout/navbar/layout";

// Dotted rule between homepage sections. Carries its own container so it
// spans the same width as the sections around it (the site's usual max
// width), not edge-to-edge. Purely decorative — sections already have their
// own headings — so it's hidden from assistive tech.
export function SectionDivider() {
  return (
    <div className={NAVBAR_CONTAINER_CLASS} aria-hidden>
      <hr className="border-0 border-t-2 border-dotted border-border" />
    </div>
  );
}
