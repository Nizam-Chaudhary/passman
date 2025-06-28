import type { HeadersInit } from "bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { HTTPException } from "hono/http-exception";

// Standard error response structure
interface ErrorResponse {
  success: false;
  message: string;
  error: unknown;
}

// Success response structure
interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

// Union type for all responses
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

interface CreateResponseOptions {
  status: number;
  data: ApiResponse;
  headers?: HeadersInit;
}

export function createResponse({ status, data, headers = {} }: CreateResponseOptions): Response {
  const finalHeaders = new Headers({
    "Content-Type": "application/json",
    ...(headers instanceof Headers ? Object.fromEntries(headers.entries()) : headers),
  });

  return new Response(JSON.stringify(data), {
    headers: finalHeaders,
    status,
  });
}

// Base exception class with standardized error format
class BaseException extends HTTPException {
  constructor(status: ContentfulStatusCode, code: string, message: string, cause?: unknown) {
    super(status, {
      message: code,
      cause,
      res: createResponse({
        status,
        data: {
          success: false,
          message,
          error: cause,
        },
      }),
    });
  }
}

// 400 Bad Request
export class BadRequestException extends BaseException {
  constructor(message = "Bad Request", cause?: unknown) {
    super(400, "BAD_REQUEST", message, cause);
  }
}

// 401 Unauthorized
export class UnauthorizedException extends BaseException {
  constructor(message = "Unauthorized", cause?: unknown) {
    super(401, "UNAUTHORIZED", message, cause);
  }
}

// 403 Forbidden
export class ForbiddenException extends BaseException {
  constructor(message = "Forbidden", cause?: unknown) {
    super(403, "FORBIDDEN", message, cause);
  }
}

// 404 Not Found
export class NotFoundException extends BaseException {
  constructor(message = "Resource not found", cause?: unknown) {
    super(404, "NOT_FOUND", message, cause);
  }
}

// 409 Conflict
export class ConflictException extends BaseException {
  constructor(message = "Conflict", cause?: unknown) {
    super(409, "CONFLICT", message, cause);
  }
}

// 422 Unprocessable Entity
export class UnprocessableEntityException extends BaseException {
  constructor(message = "Unprocessable Entity", cause?: unknown) {
    super(422, "UNPROCESSABLE_ENTITY", message, cause);
  }
}

// 429 Too Many Requests
export class TooManyRequestsException extends BaseException {
  constructor(message = "Too Many Requests", cause?: unknown) {
    super(429, "TOO_MANY_REQUESTS", message, cause);
  }
}

// 500 Internal Server Error
export class InternalServerErrorException extends BaseException {
  constructor(message = "Internal Server Error", cause?: unknown) {
    super(500, "INTERNAL_SERVER_ERROR", message, cause);
  }
}

// 502 Bad Gateway
export class BadGatewayException extends BaseException {
  constructor(message = "Bad Gateway", cause?: unknown) {
    super(502, "BAD_GATEWAY", message, cause);
  }
}

// 503 Service Unavailable
export class ServiceUnavailableException extends BaseException {
  constructor(message = "Service Unavailable", cause?: unknown) {
    super(503, "SERVICE_UNAVAILABLE", message, cause);
  }
}

// Validation specific exception
export class ValidationException extends BaseException {
  constructor(message = "Validation failed", cause?: unknown) {
    super(400, "VALIDATION_ERROR", message, cause);
  }
}

// Authentication specific exception
export class AuthenticationException extends BaseException {
  constructor(message = "Authentication failed", cause?: unknown) {
    super(401, "AUTHENTICATION_FAILED", message, cause);
  }
}

// Database specific exception
export class DatabaseException extends BaseException {
  constructor(message = "Database operation failed", cause?: unknown) {
    super(500, "DATABASE_ERROR", message, cause);
  }
}

// External service exception
export class ExternalServiceException extends BaseException {
  constructor(message = "External service error", cause?: unknown) {
    super(502, "EXTERNAL_SERVICE_ERROR", message, cause);
  }
}

// Rate limiting exception
export class RateLimitException extends BaseException {
  constructor(message = "Rate limit exceeded", cause?: unknown) {
    super(429, "RATE_LIMIT_EXCEEDED", message, cause);
  }
}

// Permission denied exception
export class PermissionDeniedException extends BaseException {
  constructor(message = "Permission denied", cause?: unknown) {
    super(403, "PERMISSION_DENIED", message, cause);
  }
}

// Resource locked exception
export class ResourceLockedException extends BaseException {
  constructor(message = "Resource is locked", cause?: unknown) {
    super(423, "RESOURCE_LOCKED", message, cause);
  }
}

// Export all exception types for easy importing
export const HttpExceptions = {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  TooManyRequestsException,
  InternalServerErrorException,
  BadGatewayException,
  ServiceUnavailableException,
  ValidationException,
  AuthenticationException,
  DatabaseException,
  ExternalServiceException,
  RateLimitException,
  PermissionDeniedException,
  ResourceLockedException,
};
