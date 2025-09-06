import { eq } from 'drizzle-orm';
import { serverEnv } from 'env.server';
import { db } from './db';
import { urls } from './db/schema';
import { toBase62 } from './utils';

export async function shortenUrl(longUrl: string) {
  try {
    return await db.transaction(async (tx) => {
      // First, insert the long URL and get the ID
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
