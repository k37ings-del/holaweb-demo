/**
 * Centralized environment validation.
 * Runs once at module load and surfaces missing required configuration
 * without crashing the application.
 */

type EnvSpec = { key: string; required: boolean };

const SPEC: EnvSpec[] = [
  { key: "VITE_SUPABASE_URL", required: true },
  { key: "VITE_SUPABASE_PUBLISHABLE_KEY", required: true },
  { key: "VITE_SUPABASE_PROJECT_ID", required: false },
];

const env = import.meta.env as Record<string, string | undefined>;

const missing: string[] = [];
for (const { key, required } of SPEC) {
  if (required && !env[key]) missing.push(key);
}

export const envIssues = missing;
export const isEnvValid = missing.length === 0;

if (!isEnvValid && typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.warn("[env] Missing required configuration:", missing.join(", "));
}

export const ENV = {
  SUPABASE_URL: env.VITE_SUPABASE_URL ?? "",
  SUPABASE_PUBLISHABLE_KEY: env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "",
  SUPABASE_PROJECT_ID: env.VITE_SUPABASE_PROJECT_ID ?? "",
  MODE: env.MODE ?? "production",
  IS_DEV: import.meta.env.DEV === true || env.MODE === "development",
};
