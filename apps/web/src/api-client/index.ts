import { AppType } from "@passman/api";
import { hc } from "hono/client";

export const api = hc<AppType>(import.meta.env.VITE_API_URL);
