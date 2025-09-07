import { eq } from 'drizzle-orm';
import { db } from './db';
import { urls } from './db/schema';
import { toBase62 } from './utils';

export async function shortenUrl(longUrl: string) {
  try {
    return await db.transaction(async (tx) => {
      const [existingUrl] = await tx
        .select({
          shortUrl: urls.shortUrl,
        })
        .from(urls)
        .where(eq(urls.longUrl, longUrl))
        .limit(1);

      if (existingUrl) {
        return existingUrl.shortUrl;
      }

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

      const shortUrl = toBase62(insertedUrl.id);

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
