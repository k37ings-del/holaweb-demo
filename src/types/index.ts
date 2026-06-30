/**
 * Shared cross-cutting types.
 */
import type { Session, User } from "@supabase/supabase-js";

export type { Session, User };

export interface Permissions {
  isAdmin: boolean;
}

export type UUID = string;

export type Nullable<T> = T | null;
