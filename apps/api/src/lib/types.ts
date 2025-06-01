import type { EnvSchema } from "./env";

declare module "bun" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Env extends EnvSchema {}
}
