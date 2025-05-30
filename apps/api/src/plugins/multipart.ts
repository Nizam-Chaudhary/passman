import multipart from "@fastify/multipart";
import fastifyPlugin from "fastify-plugin";

const fileUploadPlugin = fastifyPlugin((fastify, _opts, done) => {
    fastify.register(multipart, {
        limits: {
            fileSize: 2 * 1024 * 1000, // 2MB
            files: 1,
        },
    });
    done();
});

export default fileUploadPlugin;
