import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parses HTML content and extracts all HTTP and HTTPS URLs
 * @param htmlContent - The HTML content to parse
 * @returns Array of unique URLs found in the content
 */
export function parseUrlsFromHtml(htmlContent: string): string[] {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return [];
  }

  const urlRegex = /https?:\/\/(?:[-\w._~:/?#[\]@!$&'*+,;=%\u00a1-\uffff])+/gi;

  const matches = htmlContent.match(urlRegex);

  if (!matches) {
    return [];
  }

  return [...new Set(matches)];
}
