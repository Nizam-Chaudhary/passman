import { zValidator } from "@hono/zod-validator";
import { headerSchema, idParamsSchema, uploadFileBodySchema } from "@passman/schema/api";
import { Hono } from "hono";

import { bearerAuth } from "../../middlewares/auth";
import { zValidatorCustomFunc } from "../../middlewares/z-validator-custom-func";
import fileService from "./file.service";

export const fileRoutes = new Hono()
  .post(
    "/upload",
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
    zValidator("form", uploadFileBodySchema, zValidatorCustomFunc),
    async (c) => {
      const { file } = c.req.valid("form");
      const user = c.get("user");
      const response = await fileService.uploadFile(file, user.id);
      return c.json(response, 201);
    },
  )
  .delete(
    "/:id",
    bearerAuth,
    zValidator("header", headerSchema, zValidatorCustomFunc),
    zValidator("param", idParamsSchema, zValidatorCustomFunc),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = c.get("user");
      await fileService.removeFile(user.id, id);
      return c.json({ message: "File deleted successfully" }, 200);
    },
  );
