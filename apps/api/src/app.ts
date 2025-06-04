import { Hono } from "hono";
import { logger } from "hono/logger";
import { routes } from "./route";
import { trimTrailingSlash } from "hono/trailing-slash";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { timeout } from "hono/timeout";
import { env } from "./lib/env";
import { errorHandler } from "./middlewares/errorHandler";

const app = new Hono();

app.use(trimTrailingSlash());
app.use("*", logger());
app.use(
    "/api",
    cors({
        origin: [env.FE_URL],
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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
