import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // For development: always authenticate as demo user
  const demoUser = {
    id: "42199639",
    email: "jordan@iron-oak.ca",
    firstName: "Jordan",
    lastName: "",
    civicLevel: "Registered",
    trustScore: "100.00"
  };

  return {
    user: user || demoUser,
    isLoading: false,
    isAuthenticated: true, // Always authenticated for development
  };
}
