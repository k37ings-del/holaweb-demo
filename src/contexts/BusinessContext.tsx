import { createContext, useContext, ReactNode, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessService, subscriptionService, profileService } from "@/services";
import { useAuth } from "@/contexts/AuthContext";

type Business = Awaited<ReturnType<typeof businessService.getCurrentBusiness>>;
type Subscription = Awaited<ReturnType<typeof subscriptionService.getCurrentSubscription>>;
type Profile = Awaited<ReturnType<typeof profileService.getProfile>>;

interface BusinessContextValue {
  business: Business | null;
  businessId: string | null;
  settings: Business | null;
  branding: { name?: string; type?: string } | null;
  subscription: Subscription | null;
  owner: Profile | null;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

const BusinessContext = createContext<BusinessContextValue | null>(null);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();

  const businessQuery = useQuery({
    queryKey: ["business", user?.id],
    queryFn: () => (user ? businessService.getCurrentBusiness(user.id) : null),
    enabled: !!user,
    staleTime: 60_000,
  });

  const subscriptionQuery = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: () => (user ? subscriptionService.getCurrentSubscription(user.id) : null),
    enabled: !!user,
    staleTime: 60_000,
  });

  const ownerQuery = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => (user ? profileService.getProfile(user.id) : null),
    enabled: !!user,
    staleTime: 5 * 60_000,
  });

  const business = businessQuery.data ?? null;

  const value = useMemo<BusinessContextValue>(
    () => ({
      business,
      businessId: business?.id ?? null,
      settings: business,
      branding: business ? { name: business.name, type: business.type } : null,
      subscription: subscriptionQuery.data ?? null,
      owner: ownerQuery.data ?? null,
      isLoading: authLoading || (!!user && businessQuery.isLoading),
      error: businessQuery.error,
      refetch: () => {
        businessQuery.refetch();
        subscriptionQuery.refetch();
        ownerQuery.refetch();
      },
    }),
    [business, subscriptionQuery.data, ownerQuery.data, authLoading, user, businessQuery.isLoading, businessQuery.error],
  );

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export function useBusiness(): BusinessContextValue {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used within a BusinessProvider");
  return ctx;
}
