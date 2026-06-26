import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@/services";
import { authService } from "@/services";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const session = await authService.getSessionData();
      if (!session) return [];
      return subscriptionService.getCurrentSubscription(session.user.id);
    },
  });
}
