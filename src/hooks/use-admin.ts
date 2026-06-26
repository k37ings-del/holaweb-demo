import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services";
import { authService } from "@/services";

export function useAdminData() {
  return useQuery({
    queryKey: ["adminData"],
    queryFn: adminService.getAdminData,
  });
}

export function useIsAdmin(userId: string | null) {
  return useQuery({
    queryKey: ["isAdmin", userId],
    queryFn: () => (userId ? adminService.checkIsAdmin(userId) : false),
    enabled: !!userId,
  });
}
