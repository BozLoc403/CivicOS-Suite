import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, Shield } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import dominionEmblem from "@assets/EFE54ED9-DEE5-4F72-88D4-4441CE2D11CB_1_105_c_1749411960407.jpeg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await apiRequest("/api/login", "POST", credentials);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/user"], user);
      toast({
        title: "Welcome to CivicOS",
        description: "You have successfully logged in",
      });
      window.location.href = "/";
    },
    onError: (error: any) => {
      setError(error.message || "Invalid email or password");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center shadow-2xl border border-slate-600 overflow-hidden">
              <img 
                src={dominionEmblem} 
                alt="CivicOS" 
                className="w-14 h-14 object-cover rounded-full filter brightness-125 contrast-125"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-slate-100">CivicOS</h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wider">SECURE ACCESS</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-slate-200 dark:border-slate-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center flex items-center justify-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Authentication Required</span>
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Access the Canadian political intelligence platform
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jordan@iron-oak.ca"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  disabled={loginMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  disabled={loginMutation.isPending}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-white"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Authenticating..." : "Secure Login"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => window.location.href = '/register'}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Create one here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Platform Info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Comprehensive Canadian Political Intelligence</p>
          <p>85,000+ Politicians • Real-time Data • Secure Platform</p>
        </div>
      </div>
    </div>
  );
}