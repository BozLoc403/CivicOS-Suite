import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { useIdentityVerification } from "@/hooks/useIdentityVerification";
import { useLocation } from "wouter";

export function QuickVerificationCard() {
  const { isVerified, verificationLevel, permissions, isLoading } = useIdentityVerification();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <Card className="border-blue-200">
        <CardContent className="p-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  if (isVerified) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center space-x-2 text-green-800">
            <CheckCircle className="w-4 h-4" />
            <span>Identity Verified</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <Badge className="bg-green-600 text-white text-xs">
              Government ID Verified
            </Badge>
            <div className="text-xs text-green-700">
              <p>✓ Vote on bills and petitions</p>
              <p>✓ Create civic petitions</p>
              <p>✓ Access premium features</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center space-x-2 text-yellow-800">
          <Shield className="w-4 h-4" />
          <span>Identity Verification</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <Alert className="py-2">
          <AlertTriangle className="h-3 w-3" />
          <AlertDescription className="text-xs">
            Complete verification to unlock civic features
          </AlertDescription>
        </Alert>
        
        <div className="text-xs text-yellow-700 space-y-1">
          <p>Required for:</p>
          <p>• Voting on legislation</p>
          <p>• Creating petitions</p>
          <p>• Democratic participation</p>
        </div>
        
        <Button 
          size="sm" 
          onClick={() => setLocation('/identity-verification')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-xs h-8"
        >
          Start Verification
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}