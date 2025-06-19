import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Users, DollarSign, Globe, Shield, TrendingUp } from "lucide-react";

interface PMIntelligence {
  name: string;
  position: string;
  party: string;
  constituency: string;
  trustScore: number;
  sovereigntyScore: number;
  globalistScore: number;
  economicPhilosophy: string;
  keyConnections: string[];
  controversies: string[];
  policyFocus: string;
  currentInitiatives: string[];
  financialDisclosures: {
    assets: string[];
    investments: string[];
    potential_conflicts: string[];
  };
  politicalNetwork: {
    allies: string[];
    opposition: string[];
    international_contacts: string[];
  };
}

export function PrimeMinisterIntelligence() {
  // Current PM Intelligence Data - Mark Carney
  const pmData: PMIntelligence = {
    name: "Mark Carney",
    position: "Prime Minister of Canada",
    party: "Liberal Party of Canada",
    constituency: "Central Nova",
    trustScore: 68,
    sovereigntyScore: 75,
    globalistScore: 25,
    economicPhilosophy: "Economic Nationalism with Global Financial Expertise",
    keyConnections: [
      "Bank of England (Former Governor)",
      "Bank of Canada (Former Governor)",
      "Brookfield Asset Management",
      "UN Special Envoy for Climate Action",
      "Financial Stability Board",
      "G7 Financial Leaders Network"
    ],
    controversies: [
      "WEF Board Member - Potential globalist influence",
      "Goldman Sachs Background - Wall Street connections",
      "Climate Finance Policies - Corporate favoritism allegations"
    ],
    policyFocus: "Financial Sovereignty & Climate Economics",
    currentInitiatives: [
      "Canadian Digital Currency Framework",
      "Banking Sovereignty Act",
      "Climate Finance Leadership Initiative", 
      "Economic Independence Strategy",
      "Financial Institution Modernization"
    ],
    financialDisclosures: {
      assets: [
        "Brookfield Asset Management Holdings",
        "Government of Canada Pension",
        "Real Estate Holdings in Ottawa & London",
        "Investment Portfolio (Managed by Blind Trust)"
      ],
      investments: [
        "Clean Energy Infrastructure Funds",
        "Canadian Technology Sector",
        "Government Bonds Portfolio",
        "International Development Finance"
      ],
      potential_conflicts: [
        "Brookfield - Infrastructure policy decisions",
        "Climate Finance - Green bond regulations", 
        "Banking Reform - Former institution relationships"
      ]
    },
    politicalNetwork: {
      allies: [
        "Chrystia Freeland (Deputy PM)",
        "Sean Fraser (Immigration Minister)",
        "Jonathan Wilkinson (Natural Resources)",
        "Christine Lagarde (ECB President)"
      ],
      opposition: [
        "Pierre Poilievre (Conservative Leader)",
        "Jagmeet Singh (NDP Leader)",
        "Yves-François Blanchet (Bloc Leader)"
      ],
      international_contacts: [
        "Janet Yellen (US Treasury Secretary)",
        "Christine Lagarde (European Central Bank)",
        "António Guterres (UN Secretary-General)",
        "Kristalina Georgieva (IMF Managing Director)"
      ]
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getSovereigntyLeanColor = (score: number) => {
    if (score >= 70) return "bg-blue-500";
    if (score >= 30) return "bg-purple-500";
    return "bg-orange-500";
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {pmData.name}
              </CardTitle>
              <p className="text-lg text-blue-700 dark:text-blue-300">{pmData.position}</p>
              <Badge className="mt-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                {pmData.party} • {pmData.constituency}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {pmData.trustScore}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Trust Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Sovereignty Lean</span>
                <span className="text-sm font-bold">{pmData.sovereigntyScore}%</span>
              </div>
              <Progress 
                value={pmData.sovereigntyScore} 
                className="h-2"
              />
              <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Economic Nationalist Tendency
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Globalist Influence</span>
                <span className="text-sm font-bold">{pmData.globalistScore}%</span>
              </div>
              <Progress 
                value={pmData.globalistScore} 
                className="h-2"
              />
              <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                International Integration Level
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Economic Philosophy
            </h4>
            <p className="text-blue-800 dark:text-blue-200">{pmData.economicPhilosophy}</p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
              Policy Focus: {pmData.policyFocus}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="connections" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="controversies">Controversies</TabsTrigger>
          <TabsTrigger value="initiatives">Current Agenda</TabsTrigger>
          <TabsTrigger value="finances">Financial Profile</TabsTrigger>
          <TabsTrigger value="network">Political Network</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Key Connections & Influence Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pmData.keyConnections.map((connection, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Globe className="w-4 h-4 mr-3 text-blue-500" />
                    <span className="font-medium">{connection}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controversies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700 dark:text-orange-300">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Controversies & Concerns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pmData.controversies.map((controversy, index) => (
                  <div key={index} className="flex items-start p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border-l-4 border-orange-400">
                    <AlertTriangle className="w-4 h-4 mr-3 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-orange-800 dark:text-orange-200">{controversy}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="initiatives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Current Policy Initiatives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pmData.currentInitiatives.map((initiative, index) => (
                  <div key={index} className="flex items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <TrendingUp className="w-4 h-4 mr-3 text-green-500" />
                    <span className="font-medium text-green-800 dark:text-green-200">{initiative}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Assets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pmData.financialDisclosures.assets.map((asset, index) => (
                  <div key={index} className="text-sm p-2 bg-blue-50 dark:bg-blue-950 rounded">
                    {asset}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Investments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pmData.financialDisclosures.investments.map((investment, index) => (
                  <div key={index} className="text-sm p-2 bg-green-50 dark:bg-green-950 rounded">
                    {investment}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center text-red-700 dark:text-red-300">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Potential Conflicts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pmData.financialDisclosures.potential_conflicts.map((conflict, index) => (
                  <div key={index} className="text-sm p-2 bg-red-50 dark:bg-red-950 rounded text-red-800 dark:text-red-200">
                    {conflict}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-green-700 dark:text-green-300">
                  Political Allies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pmData.politicalNetwork.allies.map((ally, index) => (
                  <div key={index} className="text-sm p-2 bg-green-50 dark:bg-green-950 rounded">
                    {ally}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-red-700 dark:text-red-300">
                  Opposition Leaders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pmData.politicalNetwork.opposition.map((opponent, index) => (
                  <div key={index} className="text-sm p-2 bg-red-50 dark:bg-red-950 rounded">
                    {opponent}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-blue-700 dark:text-blue-300">
                  International Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pmData.politicalNetwork.international_contacts.map((contact, index) => (
                  <div key={index} className="text-sm p-2 bg-blue-50 dark:bg-blue-950 rounded">
                    {contact}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}