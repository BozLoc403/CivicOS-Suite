import { useIdentityVerification } from "@/hooks/useIdentityVerification";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export function IdentityVerificationBanner() {
  const { isVerified, verificationLevel, isLoading } = useIdentityVerification();
  const [, setLocation] = useLocation();

  if (isLoading || isVerified) {
    return null;
  }

  return (
    <Alert className="mb-6 border-yellow-500 bg-yellow-50">
      <Shield className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong>Identity Verification Required:</strong> Complete government-grade verification to unlock voting, petitions, and civic features.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLocation('/identity-verification')}
          className="ml-4"
        >
          <Shield className="w-4 h-4 mr-2" />
          Verify Now
        </Button>
      </AlertDescription>
    </Alert>
  );
}