import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { timeout } from "hono/timeout";
import { trimTrailingSlash } from "hono/trailing-slash";
import { env } from "./lib/env";
import { errorHandler } from "./middlewares/errorHandler";
import { routes } from "./route";

const app = new Hono();

app.use(trimTrailingSlash());
app.use("*", logger());
app.use(
  "/api/*",
  cors({
    origin: env.NODE_ENV === "production" ? [env.FE_URL] : "*",
  })
);
app.use(secureHeaders());
app.onError(errorHandler);
app.use("/api", timeout(10 * 1000));
app.route("/api", routes);

// TODO: Enable openapi docs and api docs after zod v4 support
// app.get("/openapi", openAPISpecs(app, openApiOptions));
// app.get("/api/docs", Scalar({ url: "/openapi" }));

export default app;
export type AppType = typeof routes;
