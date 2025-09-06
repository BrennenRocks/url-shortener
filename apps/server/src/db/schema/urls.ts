import { index, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const urls = pgTable(
  'urls',
  {
    id: serial('id').primaryKey(),
    longUrl: text('long_url').notNull(),
    shortUrl: text('short_url').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => index('idx_short_url').on(t.shortUrl)
);
