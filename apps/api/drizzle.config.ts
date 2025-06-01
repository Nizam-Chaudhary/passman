import { defineConfig } from "drizzle-kit";

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
