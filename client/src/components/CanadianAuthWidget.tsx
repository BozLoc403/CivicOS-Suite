import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  CreditCard, 
  Building2, 
  MapPin,
  ExternalLink,
  CheckCircle,
  Star
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AuthMethod {
  gckey: {
    name: string;
    description: string;
    verificationLevel: string;
    trustScore: number;
  };
  banking: {
    name: string;
    description: string;
    verificationLevel: string;
    trustScore: number;
    providers: Array<{
      id: string;
      name: string;
      logo: string;
    }>;
  };
  provincial: Array<{
    province: string;
    name: string;
    endpoint: string;
    trustScore: number;
  }>;
}

export function CanadianAuthWidget({ onVerified }: { 
  onVerified: (profile: any, method: string) => void; 
}) {
  const [authMethods, setAuthMethods] = useState<AuthMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const { toast } = useToast();

  const loadAuthMethods = async () => {
    setLoading(true);
    try {
      const methods = await apiRequest("/api/auth/canadian-methods", "GET");
      setAuthMethods(methods.methods);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load authentication methods",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startGCKeyAuth = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/api/auth/gckey/init", "POST", {});
      
      // Open GCKey authentication in new window
      const authWindow = window.open(
        response.authUrl, 
        'gckey_auth', 
        'width=600,height=700,scrollbars=yes'
      );
      
      // Listen for authentication completion
      const checkAuth = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkAuth);
          // Check if authentication was successful
          toast({
            title: "GCKey Authentication",
            description: "Please complete authentication in the popup window"
          });
        }
      }, 1000);
      
    } catch (error: any) {
      toast({
        title: "GCKey Error",
        description: error.message || "Failed to start GCKey authentication",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startBankingAuth = async (provider: string) => {
    setLoading(true);
    setSelectedProvider(provider);
    
    try {
      const response = await apiRequest("/api/auth/banking/init", "POST", { provider });
      
      // Open banking authentication in new window
      const authWindow = window.open(
        response.authUrl,
        'banking_auth',
        'width=800,height=600,scrollbars=yes'
      );
      
      const checkAuth = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkAuth);
          toast({
            title: "Banking Authentication",
            description: `Complete authentication with ${provider.toUpperCase()}`
          });
        }
      }, 1000);
      
    } catch (error: any) {
      toast({
        title: "Banking Error", 
        description: error.message || "Failed to start banking authentication",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setSelectedProvider("");
    }
  };

  if (!authMethods) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Canadian Government & Banking Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertDescription>
              Verify your identity using official Canadian government services or your banking credentials.
              This provides the highest level of trust and verification.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={loadAuthMethods} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Loading Methods..." : "View Authentication Options"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Canadian Identity Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* GCKey Authentication */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="font-semibold">{authMethods.gckey.name}</h3>
                <p className="text-sm text-muted-foreground">{authMethods.gckey.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-red-600">
                <Star className="w-3 h-3 mr-1" />
                {authMethods.gckey.trustScore}% Trust
              </Badge>
            </div>
          </div>
          
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>{authMethods.gckey.verificationLevel}</strong> - 
              Authenticate using your Government of Canada account
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={startGCKeyAuth}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Authenticate with GCKey
          </Button>
        </div>

        <Separator />

        {/* Banking Authentication */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-semibold">{authMethods.banking.name}</h3>
                <p className="text-sm text-muted-foreground">{authMethods.banking.description}</p>
              </div>
            </div>
            <Badge variant="secondary">
              <Star className="w-3 h-3 mr-1" />
              {authMethods.banking.trustScore}% Trust
            </Badge>
          </div>
          
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>{authMethods.banking.verificationLevel}</strong> - 
              Verify through your Canadian bank account
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 gap-2">
            {authMethods.banking.providers.map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                onClick={() => startBankingAuth(provider.id)}
                disabled={loading}
                className="justify-start h-auto p-3"
              >
                <CreditCard className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{provider.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {selectedProvider === provider.id && loading ? "Connecting..." : "Secure banking verification"}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Provincial Authentication */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="font-semibold">Provincial Government ID</h3>
              <p className="text-sm text-muted-foreground">Authenticate through your provincial government account</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {authMethods.provincial.slice(0, 4).map((method) => (
              <Button
                key={method.province}
                variant="outline"
                onClick={() => window.open(method.endpoint, '_blank')}
                className="h-auto p-3 text-left"
              >
                <div className="w-full">
                  <div className="font-medium text-sm">{method.province}</div>
                  <div className="text-xs text-muted-foreground">{method.name}</div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {method.trustScore}% Trust
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            All authentication methods use official Canadian government and financial institution infrastructure.
            Your data is processed securely according to Canadian privacy laws.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}