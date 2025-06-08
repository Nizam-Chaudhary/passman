import { AppType } from "@passman/api";
import { hc } from "hono/client";

export const api = hc<AppType>("http://localhost:3000/api").v1;
