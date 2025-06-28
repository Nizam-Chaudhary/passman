import { drizzle } from "drizzle-orm/mysql2";
import { env } from "../lib/env";
import * as schema from "./schema";

export const db = drizzle({
  connection: env.DB_URI,
  mode: "default",
  schema,
});

export type DB = typeof db;
