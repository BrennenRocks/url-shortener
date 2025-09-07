import { zValidator } from '@hono/zod-validator';
import 'dotenv/config';
import { serverEnv } from 'env.server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import z from 'zod';
import { getUrlByShortUrl, shortenUrl } from './url.service';

const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_MOVED_PERMANENTLY = 301;

const app = new Hono();

app.use(logger());
app.use(
  '/*',
  cors({
    origin: serverEnv.CORS_ORIGIN,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  })
);

app.get('/', (c) => {
  return c.text('OK');
});

app.post(
  '/url/shorten',
  zValidator(
    'json',
    z.object({
      urls: z.array(z.url('Invalid URL')),
    })
  ),
  async (c) => {
    try {
      const { urls } = c.req.valid('json');

      // Process each URL and create shortened versions
      const shortenedUrls = await Promise.all(
        urls.map(async (url) => {
          const shortUrl = await shortenUrl(url);
          return {
            longUrl: url,
            shortUrl,
          };
        })
      );

      return c.json({
        success: true,
        urls: shortenedUrls,
      });
    } catch {
      return c.json(
        {
          success: false,
          error: 'Failed to shorten URLs',
        },
        HTTP_STATUS_INTERNAL_SERVER_ERROR
      );
    }
  }
);

app.get(
  '/:shortUrl',
  zValidator(
    'param',
    z.object({
      shortUrl: z.string(),
    })
  ),
  async (c) => {
    try {
      const { shortUrl } = c.req.valid('param');
      const longUrl = await getUrlByShortUrl(shortUrl);

      if (!longUrl) {
        return c.json(
          {
            success: false,
            error: 'Short URL not found',
          },
          HTTP_STATUS_NOT_FOUND
        );
      }

      return c.redirect(longUrl, HTTP_STATUS_MOVED_PERMANENTLY);
    } catch {
      return c.json(
        {
          success: false,
          error: 'Failed to retrieve URL',
        },
        HTTP_STATUS_INTERNAL_SERVER_ERROR
      );
    }
  }
);

export default {
  port: serverEnv.PORT,
  fetch: app.fetch,
};
