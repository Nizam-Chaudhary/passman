import { verifyUserEmailBodySchema } from "@passman/schema/api/user";
import { z } from "zod/v4";

export const verifyUserEmailFormSchema = verifyUserEmailBodySchema.pick({
    otp: true,
});

export type VerifyUserEmailForm = z.infer<typeof verifyUserEmailFormSchema>;
