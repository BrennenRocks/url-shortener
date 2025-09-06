/** biome-ignore-all lint/style/noMagicNumbers: Magic numbers ok in tests */
import { describe, expect, it } from 'bun:test';
import { parseUrlsFromHtml } from '../utils';

describe('parseUrlsFromHtml', () => {
  it('should return empty array for null or undefined input', () => {
    expect(parseUrlsFromHtml('')).toEqual([]);
    expect(parseUrlsFromHtml(null as any)).toEqual([]);
    expect(parseUrlsFromHtml(undefined as any)).toEqual([]);
  });

  it('should return empty array for non-string input', () => {
    const testNumber = 123;
    expect(parseUrlsFromHtml(testNumber as any)).toEqual([]);
    expect(parseUrlsFromHtml({} as any)).toEqual([]);
    expect(parseUrlsFromHtml([] as any)).toEqual([]);
  });

  it('should extract basic HTTP and HTTPS URLs', () => {
    const html = `
      <p>Visit our website at http://example.com</p>
      <a href="https://secure.example.com">Secure link</a>
    `;
    const result = parseUrlsFromHtml(html);
    expect(result).toContain('http://example.com');
    expect(result).toContain('https://secure.example.com');
    expect(result).toHaveLength(2);
  });

  it('should extract URLs with ports', () => {
    const html =
      'Server running at http://localhost:3000 and https://api.example.com:8443';
    const result = parseUrlsFromHtml(html);
    expect(result).toContain('http://localhost:3000');
    expect(result).toContain('https://api.example.com:8443');
  });

  it('should extract URLs with paths and query parameters', () => {
    const html = `
      <a href="https://example.com/path/to/resource?param1=value1&param2=value2">Link</a>
      <img src="http://cdn.example.com/images/photo.jpg?v=1.2.3" />
    `;
    const result = parseUrlsFromHtml(html);
    expect(result).toContain(
      'https://example.com/path/to/resource?param1=value1&param2=value2'
    );
    expect(result).toContain('http://cdn.example.com/images/photo.jpg?v=1.2.3');
  });

  it('should extract URLs with fragments/anchors', () => {
    const html = 'Navigate to https://example.com/docs#section1 for more info';
    const result = parseUrlsFromHtml(html);
    expect(result).toContain('https://example.com/docs#section1');
  });

  it('should extract CloudFront URLs with hyphens and complex paths', () => {
    const html = `
      <img src="https://d3k81ch9hvuctc.cloudfront.net/company/TPjHTH/images/f548bd9b-9a53-4ee5-b8ef-7092a444a60e.jpeg" alt="Image" />
    `;
    const result = parseUrlsFromHtml(html);
    expect(result).toContain(
      'https://d3k81ch9hvuctc.cloudfront.net/company/TPjHTH/images/f548bd9b-9a53-4ee5-b8ef-7092a444a60e.jpeg'
    );
  });

  it('should extract URLs with underscores and special characters', () => {
    const html = `
      <a href="https://api.example.com/v1/users_data?user_id=123&format=json">API</a>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" />
    `;
    const result = parseUrlsFromHtml(html);
    expect(result).toContain(
      'https://api.example.com/v1/users_data?user_id=123&format=json'
    );
    expect(result).toContain(
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
    );
  });

  it('should extract URLs with encoded characters', () => {
    const html =
      'Check out https://example.com/search?q=hello%20world&category=tech%2Fnews';
    const result = parseUrlsFromHtml(html);
    expect(result).toContain(
      'https://example.com/search?q=hello%20world&category=tech%2Fnews'
    );
  });

  it('should extract URLs from various HTML contexts', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet" href="https://cdn.example.com/styles.css">
          <script src="https://cdn.example.com/app.js"></script>
        </head>
        <body>
          <img src="https://images.example.com/logo.png" alt="Logo">
          <a href="https://www.example.com/about">About Us</a>
          <iframe src="https://embed.example.com/video/123"></iframe>
          <!-- Comment with URL: https://hidden.example.com -->
          <p>Visit us at https://contact.example.com/form</p>
        </body>
      </html>
    `;
    const result = parseUrlsFromHtml(html);
    expect(result).toContain('https://cdn.example.com/styles.css');
    expect(result).toContain('https://cdn.example.com/app.js');
    expect(result).toContain('https://images.example.com/logo.png');
    expect(result).toContain('https://www.example.com/about');
    expect(result).toContain('https://embed.example.com/video/123');
    expect(result).toContain('https://hidden.example.com');
    expect(result).toContain('https://contact.example.com/form');
  });

  it('should remove duplicate URLs', () => {
    const html = `
      <a href="https://example.com">Link 1</a>
      <a href="https://example.com">Link 2</a>
      <img src="https://example.com/image.jpg" />
      <img src="https://example.com/image.jpg" />
    `;
    const result = parseUrlsFromHtml(html);
    expect(result).toContain('https://example.com');
    expect(result).toContain('https://example.com/image.jpg');
    expect(result).toHaveLength(2);
  });

  it('should handle URLs with international domain names', () => {
    const html =
      'Visit https://münchen.example.com and https://测试.example.com';
    const result = parseUrlsFromHtml(html);
    expect(result).toContain('https://münchen.example.com');
    expect(result).toContain('https://测试.example.com');
  });

  it('should extract URLs with complex query strings', () => {
    const html = `
      <a href="https://analytics.example.com/track?utm_source=email&utm_medium=newsletter&utm_campaign=spring_2024&user_id=abc-123&timestamp=2024-01-15T10:30:00Z">Track</a>
    `;
    const result = parseUrlsFromHtml(html);
    expect(result).toContain(
      'https://analytics.example.com/track?utm_source=email&utm_medium=newsletter&utm_campaign=spring_2024&user_id=abc-123&timestamp=2024-01-15T10:30:00Z'
    );
  });

  // it('should extract URLs with brackets and parentheses in paths', () => {
  //   const html = `
  //     <a href="https://api.example.com/v1/users(123)/profile[detailed]">API</a>
  //     <img src="https://cdn.example.com/images/thumbnail(200x200).jpg" />
  //   `;
  //   const result = parseUrlsFromHtml(html);
  //   expect(result).toContain(
  //     'https://api.example.com/v1/users(123)/profile[detailed]'
  //   );
  //   expect(result).toContain(
  //     'https://cdn.example.com/images/thumbnail(200x200).jpg'
  //   );
  // });

  it('should handle mixed case protocols', () => {
    const html = 'Links: HTTP://EXAMPLE.COM and Https://Example.Com/Path';
    const result = parseUrlsFromHtml(html);
    expect(result).toContain('HTTP://EXAMPLE.COM');
    expect(result).toContain('Https://Example.Com/Path');
  });

  it('should extract URLs from JSON-like content', () => {
    const html = `
      <script>
        const config = {
          "apiUrl": "https://api.example.com/v1",
          "cdnUrl": "https://cdn-assets.example.com/static"
        };
      </script>
    `;
    const result = parseUrlsFromHtml(html);
    expect(result).toContain('https://api.example.com/v1');
    expect(result).toContain('https://cdn-assets.example.com/static');
  });

  it('should handle URLs at the end of strings without trailing characters', () => {
    const html = 'Check out our site: https://example.com';
    const result = parseUrlsFromHtml(html);
    expect(result).toContain('https://example.com');
  });

  it('should extract URLs with tilde characters', () => {
    const html = 'Personal page: https://example.com/~username/projects';
    const result = parseUrlsFromHtml(html);
    expect(result).toContain('https://example.com/~username/projects');
  });

  it('should return empty array when no URLs are present', () => {
    const html = `
      <div>
        <p>This is just regular text content.</p>
        <span>No URLs here, just plain HTML.</span>
      </div>
    `;
    const result = parseUrlsFromHtml(html);
    expect(result).toEqual([]);
  });

  // it('should handle URLs wrapped in parentheses correctly (CSS @import case)', () => {
  //   const html = `
  //     <style>
  //       @import url(https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap);
  //       @import url(https://cdn.example.com/styles.css);
  //     </style>
  //   `;
  //   const result = parseUrlsFromHtml(html);
  //   expect(result).toContain(
  //     'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
  //   );
  //   expect(result).toContain('https://cdn.example.com/styles.css');
  //   expect(result).toHaveLength(2);
  // });

  // it('should handle URLs in various parentheses contexts', () => {
  //   const html = `
  //     <p>Check out (https://example.com) for more info.</p>
  //     <p>Visit [https://docs.example.com] or (https://support.example.com).</p>
  //     <style>@import url(https://fonts.example.com/font.css);</style>
  //   `;
  //   const result = parseUrlsFromHtml(html);
  //   expect(result).toContain('https://example.com');
  //   expect(result).toContain('https://docs.example.com');
  //   expect(result).toContain('https://support.example.com');
  //   expect(result).toContain('https://fonts.example.com/font.css');
  //   expect(result).toHaveLength(4);
  // });
});
