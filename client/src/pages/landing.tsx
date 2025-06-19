import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Vote, Users, FileText, Crown, Lock, BarChart3, Zap } from "lucide-react";
import dominionEmblem from "@assets/EFE54ED9-DEE5-4F72-88D4-4441CE2D11CB_1_105_c_1749411960407.jpeg";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Professional Header */}
      <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 shadow-2xl border-b border-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 flex items-center justify-center shadow-lg border border-slate-500 overflow-hidden">
                <img 
                  src={dominionEmblem} 
                  alt="Dominion Intelligence" 
                  className="w-10 h-10 object-cover rounded-full filter brightness-125 contrast-125"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-serif text-slate-100">CivicOS</h1>
                <p className="text-sm text-slate-400 font-medium tracking-wider">DOMINION INTELLIGENCE</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-500 px-6 py-2 font-medium"
              variant="outline"
            >
              <Lock className="w-4 h-4 mr-2" />
              SECURE ACCESS
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-20">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center shadow-2xl border border-slate-600 overflow-hidden">
              <img 
                src={dominionEmblem} 
                alt="Dominion Intelligence" 
                className="w-20 h-20 object-cover rounded-full filter brightness-125 contrast-125"
              />
            </div>
          </div>
          <h2 className="text-6xl font-bold font-serif text-slate-900 dark:text-slate-100 mb-6">
            Dominion Intelligence
          </h2>
          <h3 className="text-2xl font-medium text-slate-700 dark:text-slate-300 mb-8 tracking-wide">
            CLASSIFIED DEMOCRATIC PLATFORM
          </h3>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-4xl mx-auto leading-relaxed">
            Access sovereign digital democracy infrastructure with military-grade security, 
            real-time intelligence analysis, and comprehensive governmental oversight capabilities.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/auth'}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100 text-lg px-12 py-4 font-semibold shadow-xl"
          >
            <Crown className="w-5 h-5 mr-3" />
            REQUEST ACCESS
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Vote className="w-12 h-12 civic-blue mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure Voting</h3>
              <p className="text-gray-600 text-sm">
                Cast votes with military-grade encryption and cryptographic verification
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <FileText className="w-12 h-12 civic-green mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Bill Analysis</h3>
              <p className="text-gray-600 text-sm">
                Complex legislation simplified into plain language with key insights
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Shield className="w-12 h-12 civic-green mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Vote Verification</h3>
              <p className="text-gray-600 text-sm">
                Personal ledger with cryptographic proof of every vote cast
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 civic-blue mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Politician Tracking</h3>
              <p className="text-gray-600 text-sm">
                Monitor political statements and track consistency over time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="bg-civic-green text-white">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-4">Built for Trust</h3>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              CivicOS uses government-grade security protocols to ensure your vote 
              is recorded accurately and your privacy is protected. Every vote 
              generates a cryptographic receipt you can verify independently.
            </p>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold civic-gray mb-4">
            Ready to Participate in Democracy?
          </h3>
          <p className="text-gray-600 mb-8">
            Join thousands of citizens making their voices heard through secure, transparent voting.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/auth'}
            className="bg-civic-blue hover:bg-blue-700 text-lg px-8 py-3"
          >
            Sign Up Now
          </Button>
        </div>
      </main>
    </div>
  );
}
