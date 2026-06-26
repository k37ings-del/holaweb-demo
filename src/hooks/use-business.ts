import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { businessService } from "@/services";

export function useCurrentBusiness(userId: string | null) {
  return useQuery({
    queryKey: ["business", userId],
    queryFn: () => (userId ? businessService.getCurrentBusiness(userId) : null),
    enabled: !!userId,
  });
}

export function useBusinessStats(businessId: string | null) {
  return useQuery({
    queryKey: ["businessStats", businessId],
    queryFn: () => (businessId ? businessService.getBusinessStats(businessId) : null),
    enabled: !!businessId,
  });
}

export function useCreateBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: businessService.createBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business"] });
    },
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ businessId, data }: { businessId: string; data: Record<string, unknown> }) =>
      businessService.updateBusiness(businessId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business"] });
    },
  });
}
