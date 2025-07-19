import { drizzle } from "drizzle-orm/neon-http";
import { envConfig } from "../config/env";

export const db = drizzle(envConfig.DATABASE_URL)