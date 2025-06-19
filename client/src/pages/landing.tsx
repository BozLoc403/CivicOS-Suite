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
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 flex items-center justify-center shadow-lg border border-slate-500 overflow-hidden">
                <img 
                  src={dominionEmblem} 
                  alt="Dominion Intelligence" 
                  className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full filter brightness-125 contrast-125"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-100 truncate">CivicOS</h1>
                <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wider hidden sm:block">DOMINION INTELLIGENCE</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-500 px-3 py-1 sm:px-6 sm:py-2 font-medium text-sm sm:text-base"
              variant="outline"
            >
              <Lock className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">SECURE ACCESS</span>
              <span className="sm:hidden">ACCESS</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center mb-12 sm:mb-20">
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center shadow-2xl border border-slate-600 overflow-hidden">
              <img 
                src={dominionEmblem} 
                alt="Dominion Intelligence" 
                className="w-14 h-14 sm:w-20 sm:h-20 object-cover rounded-full filter brightness-125 contrast-125"
              />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-slate-900 dark:text-slate-100 mb-4 sm:mb-6 px-4">
            Dominion Intelligence
          </h2>
          <h3 className="text-2xl font-medium text-slate-700 dark:text-slate-300 mb-8 tracking-wide">
            CLASSIFIED DEMOCRATIC PLATFORM
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Access sovereign digital democracy infrastructure with military-grade security, 
            real-time intelligence analysis, and comprehensive governmental oversight capabilities.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/auth'}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100 text-base sm:text-lg px-6 py-3 sm:px-12 sm:py-4 font-semibold shadow-xl"
          >
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
            REQUEST ACCESS
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 px-4">
          <Card className="text-center p-4 sm:p-6">
            <CardContent className="pt-4 sm:pt-6">
              <Vote className="w-10 h-10 sm:w-12 sm:h-12 civic-blue mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">Secure Voting</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Cast votes with military-grade encryption and cryptographic verification
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:p-6">
            <CardContent className="pt-4 sm:pt-6">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 civic-green mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">AI Bill Analysis</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Complex legislation simplified into plain language with key insights
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:p-6">
            <CardContent className="pt-4 sm:pt-6">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 civic-green mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">Vote Verification</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Personal ledger with cryptographic proof of every vote cast
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:p-6">
            <CardContent className="pt-4 sm:pt-6">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 civic-blue mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">Politician Tracking</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Monitor political statements and track consistency over time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="bg-civic-green text-white mx-4">
          <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
            <Shield className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-90" />
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Built for Trust</h3>
            <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-3xl mx-auto leading-relaxed">
              CivicOS uses government-grade security protocols to ensure your vote 
              is recorded accurately and your privacy is protected. Every vote 
              generates a cryptographic receipt you can verify independently.
            </p>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12 sm:mt-16 px-4">
          <h3 className="text-xl sm:text-2xl font-bold civic-gray mb-3 sm:mb-4">
            Ready to Participate in Democracy?
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of citizens making their voices heard through secure, transparent voting.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/auth'}
            className="bg-civic-blue hover:bg-blue-700 text-base sm:text-lg px-6 py-3 sm:px-8"
          >
            Sign Up Now
          </Button>
        </div>
      </main>
    </div>
  );
}
