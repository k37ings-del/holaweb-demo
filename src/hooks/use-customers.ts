import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services";

export function useCustomers(businessId: string | null) {
  return useQuery({
    queryKey: ["customers", businessId],
    queryFn: () => (businessId ? customerService.getCustomers(businessId) : []),
    enabled: !!businessId,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ businessId, userId, data }: { businessId: string; userId: string; data: Record<string, unknown> }) =>
      customerService.createCustomer(businessId, userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers", variables.businessId] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: Record<string, unknown> }) =>
      customerService.updateCustomer(customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customerService.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}
