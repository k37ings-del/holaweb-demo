import { supabase } from "@/integrations/supabase/client";

export const authService = {
  getSession: () => supabase.auth.getSession(),
  getSessionData: () => supabase.auth.getSession().then(({ data: { session } }) => session),
  signInWithPassword: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),
  signUp: (email: string, password: string, options?: { data?: Record<string, unknown> }) =>
    supabase.auth.signUp({ email, password, options }),
  resetPasswordForEmail: (email: string) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    }),
  signOut: () => supabase.auth.signOut(),
  onAuthStateChange: (callback: (event: string, session: unknown) => void) =>
    supabase.auth.onAuthStateChange(callback),
  updateUser: (attributes: { password?: string }) =>
    supabase.auth.updateUser(attributes),
  getUser: () => supabase.auth.getSession().then(({ data: { session } }) => session?.user ?? null),
};
