import { fastifyPlugin } from "fastify-plugin";
import {
    serializerCompiler,
    validatorCompiler,
} from "fastify-type-provider-zod";

export default fastifyPlugin((fastify, _opts, done) => {
    fastify.setValidatorCompiler(validatorCompiler);
    fastify.setSerializerCompiler(serializerCompiler);

    done();
});
