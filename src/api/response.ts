/**
 * Typed success/error envelope for normalizing service responses.
 * Existing services may continue to throw; new code should prefer this envelope.
 */

export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = { ok: false; error: ApiError };
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export class ApiError extends Error {
  code: string;
  cause?: unknown;
  constructor(message: string, code = "UNKNOWN", cause?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.cause = cause;
  }
}

export const ok = <T>(data: T): ApiSuccess<T> => ({ ok: true, data });
export const fail = (error: unknown): ApiFailure => ({ ok: false, error: normalizeError(error) });

export const normalizeError = (err: unknown): ApiError => {
  if (err instanceof ApiError) return err;
  if (err && typeof err === "object" && "message" in err) {
    const anyErr = err as { message?: string; code?: string };
    return new ApiError(anyErr.message ?? "Unexpected error", anyErr.code ?? "UNKNOWN", err);
  }
  if (typeof err === "string") return new ApiError(err);
  return new ApiError("Unexpected error");
};

export async function safeCall<T>(fn: () => Promise<T>): Promise<ApiResult<T>> {
  try {
    return ok(await fn());
  } catch (e) {
    return fail(e);
  }
}
