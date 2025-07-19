import { defineConfig } from 'drizzle-kit';
import 'dotenv/config'
import { envConfig } from './src/config/env';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schemas/**.ts',
  dbCredentials: {
    url: envConfig.DATABASE_URL
  }
})
