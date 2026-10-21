import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

// The WCA API's `information` field looks like it should be plain HTML, but
// it's actually organizer-authored Markdown (confirmed by inspecting real
// competition data — fields contain "**bold**", "#### heading", "![](url)"
// image syntax, bullet lists, etc., not HTML tags). Rendering it with
// dangerouslySetInnerHTML directly dumped the literal Markdown syntax as a
// wall of text with no paragraph breaks (newlines collapse under normal
// HTML whitespace rules), which is what actually caused the "messy"/
// non-responsive info section — not malformed HTML, text being misread as
// HTML. `breaks: true` treats a single newline as a line break too, since
// these fields are written casually (mixed single/double newlines), not as
// strict CommonMark.
marked.setOptions({ breaks: true, gfm: true });

// CommonMark allows raw HTML passthrough inside Markdown source, so an
// organizer-authored field could embed a <script>/<iframe>/event handler —
// sanitize the rendered output rather than trusting it just because it came
// from marked.
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li",
    "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "hr", "img",
    "table", "thead", "tbody", "tr", "td", "th", "code", "pre", "span",
  ],
  allowedAttributes: {
    a: ["href"],
    img: ["src", "alt"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  // Every external link on this site opens in a new tab with rel
  // protection (see ui-design-system skill) — enforce it here too, since
  // this HTML comes from organizer text, not a component author.
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }),
  },
};

/** Renders a competition's Markdown `information` field into sanitized, mobile-safe HTML. Returns "" for empty/whitespace-only input. */
export function renderCompetitionInformation(markdown: string): string {
  if (!markdown || !markdown.trim()) return "";
  const rawHtml = marked.parse(markdown, { async: false }) as string;
  return sanitizeHtml(rawHtml, SANITIZE_OPTIONS).trim();
}
