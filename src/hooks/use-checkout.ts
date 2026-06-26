import { useQuery } from "@tanstack/react-query";
import { checkoutService } from "@/services";

export function usePaymentLinkBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["paymentLink", slug],
    queryFn: () => (slug ? checkoutService.getPaymentLinkBySlug(slug) : null),
    enabled: !!slug,
  });
}
