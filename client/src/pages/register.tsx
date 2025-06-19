import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, Shield, User } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import dominionEmblem from "@assets/EFE54ED9-DEE5-4F72-88D4-4441CE2D11CB_1_105_c_1749411960407.jpeg";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const registerMutation = useMutation({
    mutationFn: async (credentials: { 
      email: string; 
      password: string; 
      firstName: string; 
      lastName: string; 
    }) => {
      const res = await apiRequest("/api/register", "POST", credentials);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/user"], user);
      toast({
        title: "Welcome to CivicOS",
        description: "Your account has been created successfully",
      });
      window.location.href = "/";
    },
    onError: (error: any) => {
      setError(error.message || "Registration failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password || !firstName) {
      setError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    registerMutation.mutate({ email, password, firstName, lastName });
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
          <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wider">CREATE ACCOUNT</p>
        </div>

        {/* Registration Card */}
        <Card className="shadow-2xl border-slate-200 dark:border-slate-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center flex items-center justify-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Join CivicOS</span>
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Create your secure civic engagement account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>First Name</span>
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Jordan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-11"
                    disabled={registerMutation.isPending}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Smith"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-11"
                    disabled={registerMutation.isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  disabled={registerMutation.isPending}
                  required
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
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  disabled={registerMutation.isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11"
                  disabled={registerMutation.isPending}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-white"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => window.location.href = '/login'}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-slate-500 dark:text-slate-400">
          <p>Built by Jordan Kenneth Boisclair</p>
          <p>© 2025 CivicOS™ - All rights reserved</p>
        </div>
      </div>
    </div>
  );
}