/**
 * Session hook. Convenience facade around AuthContext so consumers can grab
 * just the session without pulling the entire auth surface.
 */
import { useAuth } from "@/contexts/AuthContext";

export function useSession() {
  const { session, user, isLoading } = useAuth();
  return {
    session,
    user,
    userId: user?.id ?? null,
    isAuthenticated: !!session,
    isLoading,
  };
}
