import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Mail, Shield, User, Crown } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import dominionEmblem from "@assets/EFE54ED9-DEE5-4F72-88D4-4441CE2D11CB_1_105_c_1749411960407.jpeg";

export default function Auth() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "", 
    firstName: "", 
    lastName: "" 
  });
  const [errors, setErrors] = useState({ login: "", register: "" });
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
      setErrors(prev => ({ ...prev, login: error.message || "Invalid email or password" }));
    },
  });

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
      setErrors(prev => ({ ...prev, register: error.message || "Registration failed" }));
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(prev => ({ ...prev, login: "" }));
    
    if (!loginData.email || !loginData.password) {
      setErrors(prev => ({ ...prev, login: "Please enter both email and password" }));
      return;
    }

    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(prev => ({ ...prev, register: "" }));
    
    if (!registerData.email || !registerData.password || !registerData.firstName) {
      setErrors(prev => ({ ...prev, register: "Please fill in all required fields" }));
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setErrors(prev => ({ ...prev, register: "Passwords do not match" }));
      return;
    }

    if (registerData.password.length < 8) {
      setErrors(prev => ({ ...prev, register: "Password must be at least 8 characters long" }));
      return;
    }

    registerMutation.mutate({
      email: registerData.email,
      password: registerData.password,
      firstName: registerData.firstName,
      lastName: registerData.lastName
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center shadow-2xl border border-slate-600 overflow-hidden">
              <img 
                src={dominionEmblem} 
                alt="CivicOS" 
                className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-full filter brightness-125 contrast-125"
              />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-slate-100">CivicOS</h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium tracking-wider">SECURE ACCESS PORTAL</p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-2xl border-slate-200 dark:border-slate-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center flex items-center justify-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Authentication</span>
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Access the Canadian political intelligence platform
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Create Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  {errors.login && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.login}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="flex items-center space-x-2 text-sm sm:text-base">
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      className="h-10 sm:h-11 text-sm sm:text-base"
                      disabled={loginMutation.isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="flex items-center space-x-2 text-sm sm:text-base">
                      <Lock className="w-4 h-4" />
                      <span>Password</span>
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="h-10 sm:h-11 text-sm sm:text-base"
                      disabled={loginMutation.isPending}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-10 sm:h-11 bg-slate-800 hover:bg-slate-700 text-white text-sm sm:text-base"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Authenticating..." : "Secure Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  {errors.register && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.register}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-firstName" className="flex items-center space-x-2 text-sm sm:text-base">
                        <User className="w-4 h-4" />
                        <span>First Name</span>
                      </Label>
                      <Input
                        id="register-firstName"
                        type="text"
                        placeholder="Jordan"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        disabled={registerMutation.isPending}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-lastName" className="text-sm sm:text-base">Last Name</Label>
                      <Input
                        id="register-lastName"
                        type="text"
                        placeholder="Smith"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        disabled={registerMutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      className="h-11"
                      disabled={registerMutation.isPending}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>Password</span>
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a secure password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      className="h-11"
                      disabled={registerMutation.isPending}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirmPassword">Confirm Password</Label>
                    <Input
                      id="register-confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-xs text-slate-500 dark:text-slate-400">
          <p>Built by Jordan Kenneth Boisclair</p>
          <p>© 2025 CivicOS™ - All rights reserved</p>
        </div>
      </div>
    </div>
  );
}