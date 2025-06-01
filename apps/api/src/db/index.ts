import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import { env } from "../lib/env";

export const db = drizzle({
    connection: env.DB_URI,
    mode: "default",
    schema: schema,
});

export type DB = typeof db;
