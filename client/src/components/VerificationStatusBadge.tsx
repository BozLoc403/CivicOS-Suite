import { useIdentityVerification } from "@/hooks/useIdentityVerification";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertTriangle, Clock } from "lucide-react";

export function VerificationStatusBadge() {
  const { isVerified, verificationLevel, isLoading } = useIdentityVerification();

  if (isLoading) {
    return (
      <Badge variant="outline" className="text-xs">
        <Clock className="w-3 h-3 mr-1" />
        Checking...
      </Badge>
    );
  }

  if (isVerified && verificationLevel === 'government') {
    return (
      <Badge variant="default" className="bg-green-600 text-white text-xs">
        <CheckCircle className="w-3 h-3 mr-1" />
        Verified
      </Badge>
    );
  }

  if (verificationLevel === 'email') {
    return (
      <Badge variant="outline" className="border-blue-500 text-blue-700 text-xs">
        <Shield className="w-3 h-3 mr-1" />
        Email Verified
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-yellow-500 text-yellow-700 text-xs">
      <AlertTriangle className="w-3 h-3 mr-1" />
      Unverified
    </Badge>
  );
}