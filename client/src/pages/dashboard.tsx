
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdentityVerificationBanner } from "@/components/IdentityVerificationBanner";
import { 
  Users, 
  FileText, 
  Vote, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Eye,
  Zap
} from "lucide-react";

import PoliticiansWidget from "@/components/widgets/PoliticiansWidget";
import BillsVotingWidget from "@/components/widgets/BillsVotingWidget";
import PetitionsWidget from "@/components/widgets/PetitionsWidget";
import { NewsAnalysisWidget } from "@/components/widgets/NewsAnalysisWidget";
import { LegalSystemWidget } from "@/components/widgets/LegalSystemWidget";
import ComprehensiveNewsWidget from "@/components/widgets/ComprehensiveNewsWidget";
import { PrimeMinisterIntelligence } from "@/components/widgets/PrimeMinisterIntelligence";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access your civic dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <IdentityVerificationBanner />

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1">
          <TabsTrigger value="overview" className="flex items-center justify-center space-x-1 lg:space-x-2 text-xs lg:text-sm p-2 lg:p-3">
            <Activity className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Home</span>
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm p-2 md:p-3">
            <Vote className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Engagement</span>
            <span className="sm:hidden">Vote</span>
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm p-2 md:p-3">
            <Eye className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Intelligence</span>
            <span className="sm:hidden">Intel</span>
          </TabsTrigger>
          <TabsTrigger value="legal" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm p-2 md:p-3">
            <Shield className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Legal</span>
            <span className="sm:hidden">Law</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            <PoliticiansWidget />
            <BillsVotingWidget />
            <PetitionsWidget />
            <NewsAnalysisWidget />
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <BillsVotingWidget />
            <PetitionsWidget />
          </div>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <PrimeMinisterIntelligence />
            <ComprehensiveNewsWidget />
          </div>
        </TabsContent>

        <TabsContent value="legal" className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <LegalSystemWidget />
            <NewsAnalysisWidget />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}