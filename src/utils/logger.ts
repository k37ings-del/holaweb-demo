/**
 * Centralized logger. Prefer over raw console.* so production output stays clean
 * and we can later swap in a remote sink (Sentry, Logflare, etc.).
 */
import { ENV } from "@/config/env";

type Level = "debug" | "info" | "warn" | "error";

const emit = (level: Level, args: unknown[]) => {
  if (!ENV.IS_DEV && (level === "debug" || level === "info")) return;
  // eslint-disable-next-line no-console
  const fn = (console as any)[level] ?? console.log;
  fn(...args);
};

export const logger = {
  debug: (...args: unknown[]) => emit("debug", args),
  info: (...args: unknown[]) => emit("info", args),
  warn: (...args: unknown[]) => emit("warn", args),
  error: (...args: unknown[]) => emit("error", args),
};
