import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export function errorHandler(err: unknown, c: Context) {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error("error", err);
  return c.json({ status: false, message: "Internal Server Error" }, 500);
}
