import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z, ZodError } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().min(1),
    HOST: z.string().min(1),
    NODE_ENV: z.enum(["development", "production"]),
    FE_URL: z.string().url().min(1),
    DB_HOST: z.string().min(1),
    DB_USERNAME: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_NAME: z.string().min(1),
    DB_PORT: z.coerce.number().min(1),
    DB_SSL: z.string().default(""),
    SALT_ROUNDS: z.coerce.number().min(6),
    JWT_SECRET: z.string().min(1),
    ENC_KEY_LENGTH: z.coerce.number().min(1),
    ENC_IV_LENGTH: z.coerce.number().min(1),
    LOG_LEVEL: z.string().min(1),
    LOGGER_TARGET: z.string().min(1),
    DOC_USERNAME: z.string().min(1),
    DOC_PASSWORD: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_REGION: z.string().min(1),
    S3_BUCKET: z.string().min(1),
    FROM_EMAIL_ADDR: z.string().email(),
    TELEMETRY_ENABLED: z.enum(["false", "true"]),
    OTLP_COLLECTOR_URL: z.string().url(),
});

expand(config());

try {
    envSchema.parse(process.env);
} catch (e) {
    if (e instanceof ZodError) {
        console.error("Environment validation error:", e.flatten());
    }
}

export default envSchema.parse(process.env);
