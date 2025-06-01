import { z, ZodError } from "zod/v4";

const envSchema = z.object({
    PORT: z.coerce.number().min(1),
    HOST: z.string().min(1),
    NODE_ENV: z.enum(["development", "production"]),
    FE_URL: z.url(),
    DB_URI: z.url(),
    SALT_ROUNDS: z.coerce.number().min(6),
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN_SECONDS: z.coerce.number().min(1),
    JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS: z.coerce.number().min(1),
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
    FROM_EMAIL_ADDR: z.email(),
    TELEMETRY_ENABLED: z.enum(["false", "true"]),
    OTLP_COLLECTOR_URL: z.url(),
});

export type EnvSchema = z.infer<typeof envSchema>;

const envResult = envSchema.safeParse(Bun.env);
if (!envResult.success) {
    console.error(z.flattenError(envResult.error));
    throw new Error("Invalid environment variables");
}
const env = envResult.data;

export { env };
