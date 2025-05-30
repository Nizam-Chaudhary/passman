import fastifyPlugin from "fastify-plugin";

import auth from "./auth";
import cors from "./cors";
import errorHandler from "./error.handler";
import fastifyTypeProviderZod from "./fastify.type.provider.zod";
import jwt from "./jwt";
import multipart from "./multipart";
import rateLimit from "./rate.limit";
import recordFastifyMetrics from "./record.fastify.metrics";
import swaggerDocs from "./swagger.docs";

export default fastifyPlugin((fastify, opts, done) => {
    fastify.register(cors, opts);
    fastify.register(jwt, opts);
    fastify.register(fastifyTypeProviderZod, opts);
    fastify.register(errorHandler, opts);
    fastify.register(multipart, opts);
    fastify.register(swaggerDocs, opts);
    fastify.register(auth, opts);
    fastify.register(rateLimit, opts);
    fastify.register(recordFastifyMetrics, opts);
    done();
});
