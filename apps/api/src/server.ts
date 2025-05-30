import Fastify, { FastifyInstance } from "fastify";
import env from "./lib/env";
import logger from "./lib/logger";
import otelSdk from "./lib/otel";
import plugins from "./plugins/index";
import routes from "./route";

if (env.TELEMETRY_ENABLED === "true") {
    otelSdk.start();
}

const fastify = Fastify({
    logger,
});

async function main() {
    await fastify.register(plugins);
    await fastify.register(routes);
    await fastify.listen({
        port: env.PORT,
        host: env.HOST,
    });

    setupGracefulShutdown(fastify);
}

main();

function setupGracefulShutdown(fastify: FastifyInstance) {
    const listeners = ["SIGINT", "SIGTERM"];
    for (const signal of listeners) {
        process.once(signal, async () => {
            await fastify.close();
            await otelSdk.shutdown();
            process.exit(0);
        });
    }
}
