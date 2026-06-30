/**
 * Toast notification service. Thin facade over sonner so the rest of the app
 * doesn't depend on the toast library directly.
 */
import { toast } from "sonner";
import { normalizeError } from "@/api/response";
import { logger } from "@/utils/logger";

export const notify = {
  success: (message: string, description?: string) => toast.success(message, { description }),
  info: (message: string, description?: string) => toast(message, { description }),
  warn: (message: string, description?: string) => toast.warning(message, { description }),
  error: (err: unknown, fallback = "Something went wrong") => {
    const e = normalizeError(err);
    logger.error("[notify]", e);
    toast.error(fallback, { description: e.message });
  },
};
