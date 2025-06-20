import { useIdentityVerification } from "@/hooks/useIdentityVerification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { useLocation } from "wouter";

export function IdentityVerificationStatus() {
  const { isVerified, verificationLevel, verifiedAt, isLoading } = useIdentityVerification();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
        <span>Checking verification...</span>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="default" className="bg-green-600 text-white">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
        <span className="text-xs text-slate-600">
          {verificationLevel === 'government' ? 'Government ID' : verificationLevel}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Badge variant="outline" className="border-yellow-500 text-yellow-700">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Unverified
      </Badge>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLocation('/identity-verification')}
        className="text-xs h-6 px-2"
      >
        <Shield className="w-3 h-3 mr-1" />
        Verify Identity
      </Button>
    </div>
  );
}