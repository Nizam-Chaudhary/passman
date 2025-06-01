import app from "./app";
import "./lib/env";

Bun.serve({
    fetch: app.fetch,
});

// eslint-disable-next-line no-console
console.log("Server started on port 3000");
