import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessService } from "@/services";
import { useAuth } from "@/contexts/AuthContext";

type Business = Awaited<ReturnType<typeof businessService.getCurrentBusiness>>;

interface BusinessContextValue {
  business: Business | null;
  businessId: string | null;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

const BusinessContext = createContext<BusinessContextValue | null>(null);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();

  const query = useQuery({
    queryKey: ["business", user?.id],
    queryFn: () => (user ? businessService.getCurrentBusiness(user.id) : null),
    enabled: !!user,
    staleTime: 60_000,
  });

  const value: BusinessContextValue = {
    business: query.data ?? null,
    businessId: query.data?.id ?? null,
    isLoading: authLoading || (!!user && query.isLoading),
    error: query.error,
    refetch: () => query.refetch(),
  };

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export function useBusiness(): BusinessContextValue {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used within a BusinessProvider");
  return ctx;
}
