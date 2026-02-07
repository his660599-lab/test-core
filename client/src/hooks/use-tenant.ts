import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type Tenant } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useTenant() {
  return useQuery({
    queryKey: [api.tenant.get.path],
    queryFn: async () => {
      const res = await fetch(api.tenant.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tenant info");
      return api.tenant.get.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updates: Partial<Tenant>) => {
      const res = await fetch(api.tenant.update.path, {
        method: api.tenant.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update tenant settings");
      return api.tenant.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tenant.get.path] });
      toast({ title: "Settings saved", description: "Your workspace has been updated." });
    },
    onError: () => {
      toast({ 
        title: "Update failed", 
        description: "Could not save settings. Please try again.",
        variant: "destructive" 
      });
    },
  });
}
