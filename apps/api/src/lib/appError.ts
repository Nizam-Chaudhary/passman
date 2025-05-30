import type { FastifyError } from "fastify";

export default class AppError extends Error implements FastifyError {
    name: string;
    statusCode: number;
    code: string;
    isOperational: boolean;
    constructor(
        name: string,
        message: string,
        statusCode: number,
        isOperational = true,
        code = "ERR_INTERNAL_SERVER_ERROR"
    ) {
        super(message);

        this.name = name;
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}
