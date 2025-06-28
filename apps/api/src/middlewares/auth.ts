import type { JwtUserData } from "@passman/schema/api";
import { createMiddleware } from "hono/factory";
import { env } from "../lib/env";
import { UnauthorizedException } from "../lib/responseExceptions";
import { verifyToken } from "../utils/tokenHelper";

export const bearerAuth = createMiddleware<{
  Variables: { user: JwtUserData };
}>(async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) {
    throw new UnauthorizedException("Unauthorized");
  }
  const verifyTokenResult = await verifyToken<JwtUserData>(token, env.JWT_SECRET);

  if (!verifyTokenResult.success || !verifyTokenResult.payload) {
    throw new UnauthorizedException(verifyTokenResult.error?.message || "Unauthorized");
  }

  c.set("user", verifyTokenResult.payload);
  await next();
});
