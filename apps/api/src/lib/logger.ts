import env from "./env";

const pinoLogger = {
    target: env.LOGGER_TARGET,
};

const loggerTargets = [pinoLogger];

const logger = {
    level: env.LOG_LEVEL,
    transport: {
        targets: loggerTargets,
    },
};
export default logger;
