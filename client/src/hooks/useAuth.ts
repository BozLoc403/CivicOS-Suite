import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const logout = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/auth/logout", "POST");
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      // Invalidate user query to trigger re-fetch
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      // Redirect to login page
      window.location.href = "/auth";
    },
    onError: (error: any) => {
      toast({
        title: "Logout failed",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    },
  });

  const login = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return apiRequest("/api/auth/login", "POST", credentials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Login successful",
        description: "Welcome to CivicOS!",
      });
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user && !error,
    logout,
    login,
  };
}
