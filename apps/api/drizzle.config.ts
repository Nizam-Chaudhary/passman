import { defineConfig } from "drizzle-kit";

import env from "./src/lib/env";

export default defineConfig({
    schema: "./src/db/schema/schema.ts",
    out: "./src/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: `postgresql://${env.DB_USERNAME}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}${env.DB_SSL}`,
    },
    verbose: env.NODE_ENV === "development",
    strict: true,
});
