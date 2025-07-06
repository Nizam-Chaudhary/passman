import type { EnvSchema } from "./env";

declare module "bun" {
  type Env = {} & EnvSchema;
}
