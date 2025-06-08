import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Vote, Users, FileText } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Vote className="text-civic-blue text-2xl mr-3" />
              <h1 className="text-xl font-bold civic-gray">CivicOS</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-civic-blue hover:bg-blue-700"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold civic-gray mb-4">
            Secure Democratic Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your voice matters. Participate in real-time democracy with 
            cryptographic security, AI-powered bill analysis, and complete transparency.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-civic-blue hover:bg-blue-700 text-lg px-8 py-3"
          >
            Get Started
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
            onClick={() => window.location.href = '/api/login'}
            className="bg-civic-blue hover:bg-blue-700 text-lg px-8 py-3"
          >
            Sign Up Now
          </Button>
        </div>
      </main>
    </div>
  );
}
