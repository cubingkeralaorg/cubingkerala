// Shared styling for server-rendered, sanitized Markdown HTML (currently
// just the competition detail page's "Information" section — see
// src/lib/wca/render-information.ts). Forces every descendant to stay
// within its container's width regardless of what an organizer wrote
// (long unbroken URLs, embedded images, GFM tables), which is what the
// un-styled raw HTML previously broke on mobile.
export const MARKDOWN_CONTENT_CLASS =
  "max-w-full break-words text-muted-foreground md:text-base " +
  "[&_p]:mb-3 [&_p:last-child]:mb-0 " +
  "[&_a]:text-primary [&_a]:hover:underline [&_a]:break-all " +
  "[&_strong]:font-semibold [&_strong]:text-foreground " +
  "[&_h1]:mb-2 [&_h1]:mt-4 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-foreground [&_h1]:first:mt-0 " +
  "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:first:mt-0 " +
  "[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:first:mt-0 " +
  "[&_h4]:mb-2 [&_h4]:mt-3 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:first:mt-0 " +
  "[&_h5]:mb-1 [&_h5]:mt-2 [&_h5]:text-sm [&_h5]:font-semibold [&_h5]:text-foreground " +
  "[&_h6]:mb-1 [&_h6]:mt-2 [&_h6]:text-sm [&_h6]:font-semibold [&_h6]:text-foreground " +
  "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 " +
  "[&_blockquote]:mb-3 [&_blockquote]:border-l-2 [&_blockquote]:border-input [&_blockquote]:pl-4 [&_blockquote]:italic " +
  "[&_hr]:my-4 [&_hr]:border-input " +
  "[&_img]:my-3 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-md " +
  "[&_table]:my-3 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:whitespace-nowrap [&_table]:text-sm " +
  "[&_th]:border [&_th]:border-input [&_th]:px-2 [&_th]:py-1 [&_th]:text-left " +
  "[&_td]:border [&_td]:border-input [&_td]:px-2 [&_td]:py-1 " +
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm " +
  "[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:text-sm";
