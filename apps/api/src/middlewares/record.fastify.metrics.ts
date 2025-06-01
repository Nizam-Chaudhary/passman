import fastifyPlugin from "fastify-plugin";
import {
    activeRequests,
    requestCounter,
    requestDurationHistogram,
    requestDurationSummary,
    requestSizeHistogram,
    responseSizeHistogram,
} from "../lib/customMetrics";
import env from "../lib/env";

export default fastifyPlugin((fastify, _opts, done) => {
    if (env.TELEMETRY_ENABLED === "false") {
        done();
        return;
    }
    fastify.addHook("onRequest", (request, reply, done) => {
        activeRequests.add(1); // Increase active request count
        request.metricsStartTime = process.hrtime(); // Store start time

        done();
    });

    fastify.addHook("preHandler", (request, reply, done) => {
        // Ensure body exists before recording request size
        const requestBody = request.body ? JSON.stringify(request.body) : "";
        requestSizeHistogram.record(Buffer.byteLength(requestBody));

        done();
    });

    fastify.addHook("onResponse", (request, reply, done) => {
        if (!request.metricsStartTime) {
            return done(); // Avoid errors if request start time is missing
        }

        const [seconds, nanoseconds] = process.hrtime(request.metricsStartTime);
        const durationInSeconds = seconds + nanoseconds / 1e9;

        requestCounter.add(1, {
            route: request.routeOptions?.url || "unknown",
            method: request.method,
            status_code: reply.statusCode,
        });

        requestDurationHistogram.record(durationInSeconds, {
            route: request.routeOptions?.url || "unknown",
            method: request.method,
            status_code: reply.statusCode,
        });

        requestDurationSummary.record(durationInSeconds, {
            route: request.routeOptions?.url || "unknown",
            method: request.method,
            status_code: reply.statusCode,
        });

        activeRequests.add(-1); // Decrease active request count

        done();
    });

    // Capture response size
    fastify.addHook("onSend", (request, reply, payload, done) => {
        if (payload) {
            responseSizeHistogram.record(Buffer.byteLength(payload.toString()));
        }
        done();
    });

    done();
});
