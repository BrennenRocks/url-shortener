import { eq } from 'drizzle-orm';
import { serverEnv } from 'env.server';
import { db } from './db';
import { urls } from './db/schema';
import { toBase62 } from './utils';

export async function shortenUrl(longUrl: string) {
  try {
    return await db.transaction(async (tx) => {
      // First, check if the long URL already exists
      const [existingUrl] = await tx
        .select({
          shortUrl: urls.shortUrl,
        })
        .from(urls)
        .where(eq(urls.longUrl, longUrl))
        .limit(1);

      // If URL already exists, return the existing short URL
      if (existingUrl) {
        return existingUrl.shortUrl;
      }

      // If not found, insert the long URL and get the ID
      const [insertedUrl] = await tx
        .insert(urls)
        .values({
          longUrl,
          shortUrl: '', // Temporary empty value
        })
        .returning({ id: urls.id });

      if (!insertedUrl) {
        throw new Error('Failed to create URL record');
      }

      // Generate the short URL using base62 encoding of the ID
      const shortCode = toBase62(insertedUrl.id);
      const shortUrl = `${serverEnv.CORS_ORIGIN}/${shortCode}`;

      // Update the record with the generated short URL
      await tx
        .update(urls)
        .set({ shortUrl })
        .where(eq(urls.id, insertedUrl.id));

      return shortUrl;
    });
  } catch {
    throw new Error('Failed to shorten URL');
  }
}

export async function getUrlByShortUrl(shortUrl: string) {
  try {
    const [urlRecord] = await db
      .select({
        longUrl: urls.longUrl,
      })
      .from(urls)
      .where(eq(urls.shortUrl, shortUrl))
      .limit(1);

    if (!urlRecord) {
      return null;
    }

    return urlRecord.longUrl;
  } catch {
    throw new Error('Failed to retrieve URL');
  }
}
