/**
 * Convert markdown-style text to HTML
 */
export const convertMarkdownToHTML = (text: string): string => {
  // Convert bullet points to <li> items
  const bulletPointReplaced = text
    .replace(/^\* (.*)$/gm, "<li>$1</li>") // Match bullet points
    .replace(/### (.*?)\n/g, "<strong>$1</strong><br/>") // Match headings
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Match bold text

  // Wrap the list items in a <ul> tag
  const listWrapped = bulletPointReplaced.replace(
    /(<li>.*?<\/li>)/g,
    "<ul>$1</ul>",
  );

  // Split paragraphs and wrap in <p> tags
  const paragraphs = listWrapped
    .split("\n\n")
    .map((paragraph) => `<p>${paragraph.trim()}</p>`)
    .join("\n");

  return paragraphs;
};
