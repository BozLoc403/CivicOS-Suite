import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Eye, Shield, Target, Zap, Users, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function Manifesto() {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [, setLocation] = useLocation();

  const handleAgreeAndContinue = () => {
    if (hasAgreed) {
      // Store agreement in localStorage
      localStorage.setItem('civicos-manifesto-agreed', 'true');
      localStorage.setItem('civicos-manifesto-date', new Date().toISOString());
      setLocation('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">CivicOS</h1>
          </div>
          <Badge className="bg-blue-600 text-white px-4 py-1">
            Sovereign Intelligence Platform
          </Badge>
        </div>

        {/* Main Manifesto Card */}
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-slate-200 dark:border-slate-700 mb-8">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Why I Built CivicOS
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              A Message from the Creator
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed">
                CivicOS was born from <strong>necessity</strong>, not theory.
              </p>

              <p className="leading-relaxed">
                I built this system because I was tired of watching institutions lie with impunity, 
                elected officials escape scrutiny, and everyday citizens being gaslit by the very 
                mechanisms meant to serve them. Our current information environment rewards confusion, 
                not clarity. Distraction, not decision. Obedience, not ownership.
              </p>

              <p className="text-xl font-semibold text-center py-4 text-blue-600 dark:text-blue-400">
                CivicOS exists to reverse that.
              </p>

              <p className="leading-relaxed">
                This is not just another political dashboard. CivicOS is a <strong>sovereign intelligence interface</strong>—a 
                platform designed to track, decode, and expose the true behavior of governments, lobbyists, 
                lawmakers, and media narratives in real time. It empowers citizens with structured truth: 
                verified data, legislative transparency, and behavioral accountability.
              </p>

              <p className="leading-relaxed">
                I didn't build CivicOS because I believed the system could be fixed. I built it because 
                I know the people still deserve tools that let them see it clearly, navigate it precisely, 
                and—if necessary—stand against it fully informed.
              </p>

              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 my-6">
                <p className="leading-relaxed mb-4">
                  This project is part of a larger ecosystem I'm building. CivicOS connects to the same 
                  core philosophy that drives PrometheOS, PersonaOS, and ScheduleOS: systems that return 
                  power to the individual by removing confusion, cutting through noise, and enforcing 
                  clarity of action.
                </p>
              </div>

              <p className="leading-relaxed">
                If you've ever felt like your voice didn't matter, your vote didn't count, or your 
                government didn't hear you—this platform was built for you. Not to convince you. But to arm you.
              </p>

              <div className="text-center py-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Welcome to CivicOS.
                </h3>
                <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                  Transparency is no longer optional.
                </p>
              </div>
            </div>

            {/* Core Principles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">Radical Transparency</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Real-time tracking of all government actions and decisions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Target className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">Behavioral Accountability</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tracking actions vs. promises with verification systems
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">Sovereign Intelligence</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Independent analysis free from institutional bias
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Users className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">Citizen Empowerment</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tools that give individuals real democratic power
                  </p>
                </div>
              </div>
            </div>

            {/* Attribution */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-8">
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Built by Jordan Kenneth Boisclair
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Founder & Chief Architect • © 2025 CivicOS™
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  All rights reserved. CivicOS is a trademark of Jordan Kenneth Boisclair.
                </p>
              </div>
            </div>

            {/* Agreement Section */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-8">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="manifesto-agreement" 
                    checked={hasAgreed}
                    onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor="manifesto-agreement" 
                      className="text-sm font-medium text-slate-900 dark:text-slate-100 cursor-pointer"
                    >
                      I understand the purpose and philosophy of CivicOS
                    </label>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      By checking this box, you acknowledge that you understand CivicOS is designed 
                      to provide transparent access to government data and democratic tools for citizen engagement.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleAgreeAndContinue}
                    disabled={!hasAgreed}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  >
                    {hasAgreed ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Enter CivicOS</span>
                      </div>
                    ) : (
                      "Agree to Continue"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}