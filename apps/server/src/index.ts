import { zValidator } from '@hono/zod-validator';
import 'dotenv/config';
import { serverEnv } from 'env.server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import z from 'zod';

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
  (c) => {
    const { urls } = c.req.valid('json');
    return c.json({ urls });
  }
);

export default {
  port: serverEnv.PORT,
  fetch: app.fetch,
};
