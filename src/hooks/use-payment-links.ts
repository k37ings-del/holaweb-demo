import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services";

export function usePaymentLinks(businessId: string | null) {
  return useQuery({
    queryKey: ["paymentLinks", businessId],
    queryFn: () => (businessId ? paymentService.getPaymentLinks(businessId) : []),
    enabled: !!businessId,
  });
}

export function useCreatePaymentLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ businessId, userId, data }: { businessId: string; userId: string; data: Parameters<typeof paymentService.createPaymentLink>[2] }) =>
      paymentService.createPaymentLink(businessId, userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["paymentLinks", variables.businessId] });
    },
  });
}

export function useTogglePaymentLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      paymentService.togglePaymentLink(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentLinks"] });
    },
  });
}

export function useDeletePaymentLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: paymentService.deletePaymentLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentLinks"] });
    },
  });
}
