import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services";

export function useProducts(businessId: string | null) {
  return useQuery({
    queryKey: ["products", businessId],
    queryFn: () => (businessId ? productService.getProducts(businessId) : []),
    enabled: !!businessId,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ businessId, userId, data }: { businessId: string; userId: string; data: Record<string, unknown> }) =>
      productService.createProduct(businessId, userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products", variables.businessId] });
      queryClient.invalidateQueries({ queryKey: ["businessStats", variables.businessId] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useImportProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ businessId, userId, products }: { businessId: string; userId: string; products: Record<string, unknown>[] }) =>
      productService.importProducts(businessId, userId, products),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products", variables.businessId] });
    },
  });
}
