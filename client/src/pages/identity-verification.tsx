import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CanadianAuthWidget } from "@/components/CanadianAuthWidget";

export default function IdentityVerification() {
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [verificationProfile, setVerificationProfile] = useState<any>(null);
  const [verificationMethod, setVerificationMethod] = useState<string>('');
  const { toast } = useToast();

  const handleVerificationComplete = (profile: any, method: string) => {
    setVerificationProfile(profile);
    setVerificationMethod(method);
    setVerificationStatus('verified');
    
    toast({
      title: "Identity Verified",
      description: `Successfully verified through ${method}`,
    });
  };

  if (verificationStatus === 'verified') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              Identity Verification Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your identity has been successfully verified through <strong>{verificationMethod}</strong>.
                You now have full access to all CivicOS features including voting, petitions, and civic engagement.
              </AlertDescription>
            </Alert>
            
            {verificationProfile && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Verification Details</h3>
                <div className="text-sm space-y-1">
                  {verificationProfile.gcKeyId && (
                    <p><strong>GCKey ID:</strong> {verificationProfile.gcKeyId}</p>
                  )}
                  {verificationProfile.bankId && (
                    <p><strong>Bank ID:</strong> {verificationProfile.bankId}</p>
                  )}
                  {verificationProfile.firstName && (
                    <p><strong>Name:</strong> {verificationProfile.firstName} {verificationProfile.lastName}</p>
                  )}
                  {verificationProfile.verificationLevel && (
                    <p><strong>Level:</strong> {verificationProfile.verificationLevel}</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Temporary Warning Banner */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-700">
          <strong>TEMPORARY VERIFICATION SYSTEM:</strong> Government integrations are currently in development. 
          All users are granted temporary verified access until official GCKey and banking integrations are complete.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="w-6 h-6" />
            Canadian Identity Verification
          </CardTitle>
          <p className="text-muted-foreground">
            Verify your identity using official Canadian government or banking credentials
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              CivicOS uses official Canadian government and banking infrastructure for secure identity verification.
              This provides the highest level of trust and security for democratic participation.
            </AlertDescription>
          </Alert>
          
          <CanadianAuthWidget onVerified={handleVerificationComplete} />
          
          {/* Temporary Verification Button */}
          <div className="mt-6 pt-6 border-t">
            <Button 
              onClick={() => handleVerificationComplete({
                tempVerified: true,
                verificationLevel: "Temporary",
                trustScore: 50
              }, "Temporary System")}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Grant Temporary Verification Access
            </Button>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Temporary access until government integrations are complete
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}