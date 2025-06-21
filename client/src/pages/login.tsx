import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CanadianCoatOfArms, CanadianMapleLeaf } from "@/components/CanadianCoatOfArms";
import civicOSLogo from "@assets/ChatGPT Image Jun 20, 2025, 05_42_18 PM_1750462997583.png";
import canadianCrest from "@assets/ChatGPT Image Jun 20, 2025, 06_03_54 PM_1750464244456.png";
import { 
  Shield, 
  User, 
  Lock, 
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        setLocation('/');
      } else {
        const error = await response.json();
        console.error('Login failed:', error.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setCredentials({
      username: 'demo_user',
      password: 'demo_password'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Official Government Header */}
      <header className="bg-white border-b-4 border-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Government of Canada Banner */}
          <div className="border-b border-gray-200 py-2 bg-gray-50">
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center space-x-8">
                <span className="flex items-center space-x-1">
                  <CanadianMapleLeaf size="sm" className="text-red-600" />
                  <span className="font-semibold text-gray-800">Government of Canada</span>
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center space-x-1">
                  <CanadianMapleLeaf size="sm" className="text-red-600" />
                  <span className="font-semibold text-gray-800">Gouvernement du Canada</span>
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="text-red-600 font-bold bg-yellow-100 px-2 py-1 rounded">NOT OFFICIAL GOC SITE</span>
                <button className="px-2 py-1 bg-red-600 rounded text-white font-medium">EN</button>
                <button className="px-2 py-1 hover:bg-red-100 rounded text-red-600 hover:text-red-800 transition-colors">FR</button>
              </div>
            </div>
          </div>
          
          {/* Main Header Section */}
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <img 
                src={canadianCrest} 
                alt="Canadian Heraldic Crest" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <img 
                  src={civicOSLogo} 
                  alt="CivicOS" 
                  className="h-12 w-auto mb-2"
                />
                <p className="text-gray-600 text-sm font-medium">Government Accountability & Transparency Platform</p>
                <p className="text-gray-500 text-xs">Plateforme de Responsabilité Gouvernementale</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1 bg-yellow-100 text-red-600 rounded-md text-xs font-bold uppercase tracking-wide border border-yellow-300">
                Independent Platform
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Login Content */}
      <main className="max-w-md mx-auto pt-12 pb-24 px-4">
        {/* Disclaimer Banner */}
        <div className="mb-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-medium">
                  <strong>Important Notice:</strong> This is NOT an official Government of Canada website. 
                  CivicOS is an independent platform for government accountability.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex justify-center">
              <div className="p-3 bg-red-600 rounded-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Secure Access Portal
              </CardTitle>
              <CardTitle className="text-lg font-semibold text-red-600 mt-1">
                Portail d'Accès Sécurisé
              </CardDescription>
              <CardDescription className="mt-4 text-gray-600">
                Access the CivicOS Government Accountability Platform with your secure credentials.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                  Username / Nom d'utilisateur
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    className="pl-10 h-12 border-2 border-gray-300 focus:border-red-500"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password / Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10 h-12 border-2 border-gray-300 focus:border-red-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-base"
              >
                {isLoading ? (
                  "Authenticating..."
                ) : (
                  <>
                    Secure Login / Connexion Sécurisée
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <Separator />

            {/* Demo Access */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 font-medium">
                  For demonstration purposes / À des fins de démonstration
                </p>
              </div>
              
              <Button
                onClick={handleDemoLogin}
                variant="outline"
                className="w-full h-12 border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Use Demo Account / Utiliser le Compte de Démonstration
              </Button>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                <p className="text-xs text-blue-700">
                  <strong>Demo Credentials:</strong> Username: demo_user | Password: demo_password
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg">
            <Shield className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-xs text-gray-600 font-medium">
              Secured with Government-Grade Encryption
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t-2 border-red-600 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <CanadianCoatOfArms size="sm" />
            <span className="font-bold text-gray-900">CivicOS</span>
            <Badge variant="outline" className="ml-2 text-yellow-700 border-yellow-400">
              Independent Platform
            </Badge>
          </div>
          <p className="text-sm text-gray-600">
            Independent Canadian Government Accountability Platform<br />
            Plateforme Indépendante de Responsabilité Gouvernementale Canadienne
          </p>
          <p className="text-xs text-yellow-600 font-medium mt-2">
            * Not affiliated with the Government of Canada<br />
            * Non affilié au gouvernement du Canada
          </p>
        </div>
      </footer>
    </div>
  );
}