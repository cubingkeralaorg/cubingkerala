import { marked } from "marked";

/**
 * Convert markdown-style text to HTML
 */
export const convertMarkdownToHTML = (text: string): string => {
  if (!text) return "";
  
  return marked.parse(text, { async: false }) as string;
};
