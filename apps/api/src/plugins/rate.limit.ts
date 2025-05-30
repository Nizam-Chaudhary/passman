import fastifyRateLimit from "@fastify/rate-limit";
import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin((fastify, opts, done) => {
    fastify.register(fastifyRateLimit, {
        max: 100,
        timeWindow: "1 minute",
    });
    done();
});
