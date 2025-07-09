import { z } from "zod/v4";

export const addPasswordFormSchema = z.object({
  url: z.string().min(1, "Url is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  note: z
    .string()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional(),
});

export type AddPasswordForm = z.infer<typeof addPasswordFormSchema>;

export const updatePasswordFormSchema = addPasswordFormSchema;

export type UpdatePasswordForm = z.infer<typeof updatePasswordFormSchema>;
