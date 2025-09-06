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

  // Comprehensive regex to match http and https URLs
  const urlRegex =
    /https?:\/\/(?:[-\w.])+(?::[0-9]+)?(?:\/(?:[\w/_.])*)?(?:\?(?:[\w&=%.])*)?(?:#(?:[\w.])*)?/gi;

  const matches = htmlContent.match(urlRegex);

  if (!matches) {
    return [];
  }

  // Remove duplicates and return unique URLs
  return [...new Set(matches)];
}
