import { useQuery } from "@tanstack/react-query";

export function useIdentityVerification() {
  const { data: verificationStatus, isLoading } = useQuery({
    queryKey: ["/api/identity/status"],
    retry: false,
  });

  return {
    isVerified: verificationStatus?.isVerified || false,
    verificationLevel: verificationStatus?.verificationLevel || 'none',
    verifiedAt: verificationStatus?.verifiedAt,
    permissions: verificationStatus?.permissions || {
      canVote: false,
      canComment: false,
      canCreatePetitions: false,
      canAccessFOI: false
    },
    isLoading
  };
}