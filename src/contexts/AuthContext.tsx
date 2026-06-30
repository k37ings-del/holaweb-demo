import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { authService, adminService } from "@/services";
import { logger } from "@/utils/logger";

interface Permissions {
  isAdmin: boolean;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  permissions: Permissions;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = authService.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setIsLoading(false);
    });

    authService
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session);
        setIsLoading(false);
      })
      .catch((e) => {
        logger.error("[auth] getSession failed", e);
        if (!mounted) return;
        setError(e instanceof Error ? e : new Error(String(e)));
        setIsLoading(false);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user?.id ?? null;
  const adminQuery = useQuery({
    queryKey: ["isAdmin", userId],
    queryFn: () => (userId ? adminService.checkIsAdmin(userId) : false),
    enabled: !!userId,
    staleTime: 5 * 60_000,
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      permissions: { isAdmin: !!adminQuery.data },
      isLoading,
      error,
      signOut: async () => {
        await authService.signOut();
        setSession(null);
      },
    }),
    [session, isLoading, error, adminQuery.data],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
