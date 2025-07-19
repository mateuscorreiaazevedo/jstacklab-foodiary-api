import { drizzle } from "drizzle-orm/neon-http";
import { envConfig } from "../config/env";
import { schemas } from "./schemas";

export const db = drizzle(envConfig.DATABASE_URL, {
  schema: schemas
})