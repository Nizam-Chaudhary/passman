import { z } from "zod/v4";
import { BadRequestException } from "../lib/response";

export const zValidatorCustomFunc = (res: any) => {
    if (!res.success) {
        const flattenError = z.flattenError(res?.error);
        throw new BadRequestException(res.error.name, flattenError.fieldErrors);
    }
};
