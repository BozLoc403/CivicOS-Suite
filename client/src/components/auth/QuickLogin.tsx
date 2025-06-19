import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, User, LogIn } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface QuickLoginProps {
  onLogin: (user: any) => void;
}

export function QuickLogin({ onLogin }: QuickLoginProps) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/api/auth/demo-login', 'POST', {});
      onLogin(response.user);
    } catch (error) {
      console.error('Demo login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomLogin = async () => {
    if (!username.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await apiRequest('/api/auth/easy-login', 'POST', { username: username.trim() });
      onLogin(response.user);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-8 h-8 text-blue-400" />
            <CardTitle className="text-2xl font-bold">CivicOS Access</CardTitle>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Enter the sovereign intelligence platform
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username (Optional)</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your preferred username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCustomLogin()}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create a custom identity or use the demo account
              </p>
            </div>

            <Button 
              onClick={handleCustomLogin}
              disabled={!username.trim() || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <User className="w-4 h-4 mr-2" />
              {isLoading ? "Accessing..." : "Enter with Custom Identity"}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-300 dark:border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-800 px-2 text-slate-500">
                Or
              </span>
            </div>
          </div>

          <Button 
            onClick={handleDemoLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            <LogIn className="w-4 h-4 mr-2" />
            {isLoading ? "Accessing..." : "Use Demo Account"}
          </Button>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            <p>Built by Jordan Kenneth Boisclair</p>
            <p>© 2025 CivicOS™ - Transparency is no longer optional</p>
            <p className="text-xs text-slate-400 mt-1">All rights reserved.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}