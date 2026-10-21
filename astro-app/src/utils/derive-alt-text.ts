// Common camera/export filename noise that doesn't describe the photo's
// actual content — e.g. "IMG_20260214_091533.jpg", "DSC00123.jpg", or
// "WhatsApp Image 2026-02-14 at 9.15.33.jpeg" should fall back to a generic
// caption rather than surfacing literal junk like "Img 20260214 091533".
const GENERIC_WORDS = new Set([
  "image", "photo", "picture", "screenshot", "whatsapp", "untitled", "file", "copy", "at",
]);
// Camera-generated prefixes immediately followed by digits, with no
// separator (e.g. "DSC00123", "IMG1234", "PXL20260214") — checked against
// a whole token, not just an exact match, since these never get split out
// by the delimiter-based tokenizing below.
const CAMERA_PREFIX_PATTERN = /^(img|image|dsc|dscn|photo|pic|picture|screenshot|pxl)\d*$/i;

function isYearLike(token: string): boolean {
  return /^(19|20)\d{2}$/.test(token);
}

function titleCaseWord(word: string): string {
  if (/^\d+$/.test(word)) return word; // leave numbers (e.g. a year) as-is
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Turns a filename like "amrita-cube-open-2026.jpg" into "Amrita Cube Open
 * 2026". Returns null when nothing meaningful survives filtering — either
 * a recognized camera/export naming pattern, or a name that's just date/time
 * digits once split apart (a lone 4-digit year is kept *alongside* real
 * words, like above, but isn't on its own enough to call the result
 * meaningful) — so the caller can fall back to a generic caption instead.
 */
export function deriveAltTextFromFilename(filename: string): string | null {
  const base = filename.replace(/\.[^./]+$/, "");
  const tokens = base
    .split(/[-_\s.]+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => {
      if (GENERIC_WORDS.has(token.toLowerCase())) return false;
      if (CAMERA_PREFIX_PATTERN.test(token)) return false;
      // A bare number is only kept when it reads as a year (e.g. a
      // competition's "...-2026") — every other bare number is a day,
      // month, or time fragment from a date/timestamp, not content.
      if (/^\d+$/.test(token) && !isYearLike(token)) return false;
      return true;
    });

  const hasRealWord = tokens.some((token) => /[a-zA-Z]{2,}/.test(token));
  if (!hasRealWord) return null;

  return tokens.map(titleCaseWord).join(" ");
}
