import { drizzle } from 'drizzle-orm/node-postgres';
import { serverEnv } from 'env.server';
// biome-ignore lint/performance/noNamespaceImport: This is how it is in the Drizzle docs
import * as schema from './schema';

export const db = drizzle(serverEnv.DATABASE_URL, { schema });
