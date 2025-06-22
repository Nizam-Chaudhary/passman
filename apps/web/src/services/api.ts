import type { AppType } from "@passman/api";
import { hc } from "hono/client";

export const api = hc<AppType>(import.meta.env.VITE_BE_BASE_URL).v1;
