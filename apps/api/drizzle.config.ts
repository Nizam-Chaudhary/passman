import process from "node:process";

import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: "./.env.local" });

export default defineConfig({
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DB_URI,
  },
  verbose: process.env.NODE_ENV === "development",
  strict: true,
});
