import { ReactNode } from "react";
import { useIdentityVerification } from "@/hooks/useIdentityVerification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

interface VerificationGuardProps {
  children: ReactNode;
  requiredPermission?: 'canVote' | 'canComment' | 'canCreatePetitions' | 'canAccessFOI';
  fallbackMessage?: string;
}

export function VerificationGuard({ 
  children, 
  requiredPermission, 
  fallbackMessage = "Identity verification required to access this feature" 
}: VerificationGuardProps) {
  const { isVerified, permissions, isLoading } = useIdentityVerification();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // Check if user is verified and has required permission
  const hasPermission = isVerified && (
    !requiredPermission || permissions[requiredPermission]
  );

  if (hasPermission) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="flex items-center justify-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Verification Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              {fallbackMessage}
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2 text-sm text-slate-600">
            <p>To access this feature, you need to complete government-grade identity verification:</p>
            <ul className="space-y-1 ml-4">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Government ID upload</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Live face verification</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Multi-factor authentication</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Duplicate account prevention</span>
              </li>
            </ul>
          </div>
          
          <Button 
            onClick={() => setLocation('/identity-verification')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Shield className="w-4 h-4 mr-2" />
            Start Identity Verification
          </Button>
          
          <p className="text-xs text-slate-500 text-center">
            Your privacy is protected. All verification data is encrypted and 
            automatically purged after 72 hours.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}