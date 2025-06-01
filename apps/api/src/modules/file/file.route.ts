import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { uploadFileBodySchema } from "./file.schema";
import fileService from "./file.service";
import { idParamsSchema } from "../../utils/basicSchema";
import { bearerAuth } from "../../middlewares/auth";
import { zValidatorCustomFunc } from "../../middlewares/zValidatorCustomFunc";

export const fileRoutes = new Hono()
    .use("*", bearerAuth)
    .post(
        "/upload",
        zValidator("form", uploadFileBodySchema, zValidatorCustomFunc),
        async (c) => {
            const { file } = c.req.valid("form");
            const user = c.get("user");
            const response = await fileService.uploadFile(file, user.id);
            return c.json(response, 201);
        }
    )
    .delete(
        "/:id",
        zValidator("param", idParamsSchema, zValidatorCustomFunc),
        async (c) => {
            const { id } = c.req.valid("param");
            const user = c.get("user");
            await fileService.removeFile(user.id, id);
            return c.json({ message: "File deleted successfully" }, 200);
        }
    );
