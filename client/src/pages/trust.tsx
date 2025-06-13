import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingDown, TrendingUp, Users, Crown, Building, AlertTriangle, Shield } from "lucide-react";

export default function TrustPage() {
  const [timeframe, setTimeframe] = useState("12months");

  // Trust metrics data from public polling and surveys
  const trustMetrics = {
    federal: {
      overall: 34,
      change: -2.3,
      parliament: 28,
      primeMinister: 41,
      cabinet: 32,
      publicService: 58
    },
    provincial: {
      overall: 42,
      change: +1.8,
      premiers: 39,
      legislatures: 45,
      publicService: 62
    },
    municipal: {
      overall: 67,
      change: +0.5,
      mayors: 64,
      councils: 69,
      publicService: 71
    },
    institutions: {
      judiciary: 72,
      police: 58,
      military: 81,
      elections: 76,
      media: 34,
      publicHealth: 69
    }
  };

  const regionalTrust = [
    {
      province: "British Columbia",
      federalTrust: 31,
      provincialTrust: 45,
      municipalTrust: 69,
      keyIssues: ["Housing Crisis", "Cost of Living", "Healthcare"],
      trendDirection: "down",
      change: -3.2
    },
    {
      province: "Alberta", 
      federalTrust: 22,
      provincialTrust: 48,
      municipalTrust: 64,
      keyIssues: ["Energy Policy", "Federal Relations", "Healthcare"],
      trendDirection: "down",
      change: -5.1
    },
    {
      province: "Saskatchewan",
      federalTrust: 28,
      provincialTrust: 52,
      municipalTrust: 71,
      keyIssues: ["Agriculture", "Infrastructure", "Healthcare"],
      trendDirection: "stable",
      change: +0.8
    },
    {
      province: "Manitoba",
      federalTrust: 36,
      provincialTrust: 41,
      municipalTrust: 65,
      keyIssues: ["Economy", "Crime", "Healthcare"],
      trendDirection: "up",
      change: +2.1
    },
    {
      province: "Ontario",
      federalTrust: 38,
      provincialTrust: 39,
      municipalTrust: 66,
      keyIssues: ["Housing", "Healthcare", "Education"],
      trendDirection: "stable",
      change: -0.3
    },
    {
      province: "Quebec",
      federalTrust: 29,
      provincialTrust: 47,
      municipalTrust: 70,
      keyIssues: ["Autonomy", "Language Rights", "Healthcare"],
      trendDirection: "down",
      change: -1.9
    },
    // Maritime provinces
    {
      province: "Nova Scotia",
      federalTrust: 42,
      provincialTrust: 51,
      municipalTrust: 73,
      keyIssues: ["Healthcare", "Economy", "Fisheries"],
      trendDirection: "up",
      change: +1.7
    },
    {
      province: "New Brunswick",
      federalTrust: 39,
      provincialTrust: 48,
      municipalTrust: 69,
      keyIssues: ["Healthcare", "Education", "Economic Development"],
      trendDirection: "stable",
      change: +0.4
    },
    {
      province: "Prince Edward Island",
      federalTrust: 44,
      provincialTrust: 56,
      municipalTrust: 78,
      keyIssues: ["Healthcare", "Tourism", "Agriculture"],
      trendDirection: "up",
      change: +2.3
    },
    {
      province: "Newfoundland and Labrador",
      federalTrust: 35,
      provincialTrust: 43,
      municipalTrust: 67,
      keyIssues: ["Economy", "Healthcare", "Population Decline"],
      trendDirection: "down",
      change: -2.8
    },
    // Territories
    {
      province: "Yukon",
      federalTrust: 38,
      provincialTrust: 49,
      municipalTrust: 72,
      keyIssues: ["Indigenous Rights", "Mining", "Cost of Living"],
      trendDirection: "stable",
      change: +0.6
    },
    {
      province: "Northwest Territories",
      federalTrust: 41,
      provincialTrust: 52,
      municipalTrust: 74,
      keyIssues: ["Indigenous Self-Government", "Mining", "Infrastructure"],
      trendDirection: "up",
      change: +1.9
    },
    {
      province: "Nunavut",
      federalTrust: 37,
      provincialTrust: 45,
      municipalTrust: 71,
      keyIssues: ["Food Security", "Housing", "Indigenous Rights"],
      trendDirection: "stable",
      change: -0.2
    }
  ];

  const trustFactors = [
    {
      factor: "Transparency",
      impact: 87,
      description: "Open government data and decision-making processes",
      currentScore: 42,
      trend: "improving"
    },
    {
      factor: "Accountability",
      impact: 91,
      description: "Consequences for misconduct and policy failures",
      currentScore: 38,
      trend: "declining"
    },
    {
      factor: "Competence",
      impact: 83,
      description: "Effective policy implementation and service delivery",
      currentScore: 56,
      trend: "stable"
    },
    {
      factor: "Responsiveness",
      impact: 79,
      description: "Acting on citizen concerns and feedback",
      currentScore: 45,
      trend: "improving"
    },
    {
      factor: "Integrity",
      impact: 94,
      description: "Ethical behavior and freedom from corruption",
      currentScore: 51,
      trend: "declining"
    }
  ];

  const getTrustColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-blue-600";
    if (score >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case "up": return TrendingUp;
      case "down": return TrendingDown;
      default: return BarChart3;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Government Trust Metrics</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive analysis of public trust in Canadian democratic institutions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <BarChart3 className="w-3 h-3 mr-1" />
            Public Polling Data
          </Badge>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="12months">12 Months</SelectItem>
              <SelectItem value="24months">24 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Trust Overview</TabsTrigger>
          <TabsTrigger value="levels">Government Levels</TabsTrigger>
          <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
          <TabsTrigger value="factors">Trust Factors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-red-600" />
                  <span>Federal Government</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-3xl font-bold ${getTrustColor(trustMetrics.federal.overall)}`}>
                    {trustMetrics.federal.overall}%
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">{trustMetrics.federal.change}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Public trust in federal institutions</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-yellow-600" />
                  <span>Provincial Government</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-3xl font-bold ${getTrustColor(trustMetrics.provincial.overall)}`}>
                    {trustMetrics.provincial.overall}%
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">+{trustMetrics.provincial.change}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Average provincial trust levels</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span>Municipal Government</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-3xl font-bold ${getTrustColor(trustMetrics.municipal.overall)}`}>
                    {trustMetrics.municipal.overall}%
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">+{trustMetrics.municipal.change}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Local government trust ratings</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Institutional Trust Comparison</CardTitle>
              <CardDescription>Public confidence in key Canadian institutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(trustMetrics.institutions).map(([institution, score]) => (
                  <div key={institution} className="flex items-center justify-between">
                    <span className="text-sm capitalize font-medium">{institution.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-blue-500' : score >= 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{width: `${score}%`}}
                        ></div>
                      </div>
                      <span className={`text-sm font-bold w-8 ${getTrustColor(score)}`}>{score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="levels" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Federal Level</CardTitle>
                <CardDescription>Trust in federal institutions and leadership</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Parliament</span>
                    <span className={`font-bold ${getTrustColor(trustMetrics.federal.parliament)}`}>
                      {trustMetrics.federal.parliament}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Prime Minister</span>
                    <span className={`font-bold ${getTrustColor(trustMetrics.federal.primeMinister)}`}>
                      {trustMetrics.federal.primeMinister}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cabinet</span>
                    <span className={`font-bold ${getTrustColor(trustMetrics.federal.cabinet)}`}>
                      {trustMetrics.federal.cabinet}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Public Service</span>
                    <span className={`font-bold ${getTrustColor(trustMetrics.federal.publicService)}`}>
                      {trustMetrics.federal.publicService}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Provincial Level</CardTitle>
                <CardDescription>Provincial government trust metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Premiers</span>
                    <span className={`font-bold ${getTrustColor(trustMetrics.provincial.premiers)}`}>
                      {trustMetrics.provincial.premiers}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Legislatures</span>
                    <span className={`font-bold ${getTrustColor(trustMetrics.provincial.legislatures)}`}>
                      {trustMetrics.provincial.legislatures}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Public Service</span>
                    <span className={`font-bold ${getTrustColor(trustMetrics.provincial.publicService)}`}>
                      {trustMetrics.provincial.publicService}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Municipal Level</CardTitle>
                <CardDescription>Local government trust ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mayors</span>
                    <span className={`font-bold ${getTrustColor(trustMetrics.municipal.mayors)}`}>
                      {trustMetrics.municipal.mayors}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">City Councils</span>
                    <span className={`font-bold ${getTrustColor(trustMetrics.municipal.councils)}`}>
                      {trustMetrics.municipal.councils}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Public Service</span>
                    <span className={`font-bold ${getTrustColor(trustMetrics.municipal.publicService)}`}>
                      {trustMetrics.municipal.publicService}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          <div className="grid gap-4">
            {regionalTrust.map((region) => {
              const TrendIcon = getTrendIcon(region.trendDirection);
              return (
                <Card key={region.province} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{region.province}</h3>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <div>
                            <div className="text-xs text-muted-foreground">Federal</div>
                            <div className={`text-lg font-bold ${getTrustColor(region.federalTrust)}`}>
                              {region.federalTrust}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Provincial</div>
                            <div className={`text-lg font-bold ${getTrustColor(region.provincialTrust)}`}>
                              {region.provincialTrust}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Municipal</div>
                            <div className={`text-lg font-bold ${getTrustColor(region.municipalTrust)}`}>
                              {region.municipalTrust}%
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {region.keyIssues.map((issue, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex items-center space-x-1 mb-1">
                          <TrendIcon className={`w-4 h-4 ${getTrendColor(region.trendDirection)}`} />
                          <span className={`text-sm ${getTrendColor(region.trendDirection)}`}>
                            {region.change > 0 ? '+' : ''}{region.change}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {region.trendDirection}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="factors" className="space-y-6">
          <div className="grid gap-6">
            {trustFactors.map((factor) => (
              <Card key={factor.factor} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{factor.factor}</CardTitle>
                      <CardDescription className="mt-1">
                        {factor.description}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Impact Weight</div>
                      <div className="text-2xl font-bold text-blue-600">{factor.impact}%</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Current Score</div>
                        <div className={`text-xl font-bold ${getTrustColor(factor.currentScore)}`}>
                          {factor.currentScore}%
                        </div>
                      </div>
                      <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${factor.currentScore >= 70 ? 'bg-green-500' : factor.currentScore >= 50 ? 'bg-blue-500' : factor.currentScore >= 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{width: `${factor.currentScore}%`}}
                        ></div>
                      </div>
                    </div>
                    <Badge variant="outline" className={
                      factor.trend === "improving" ? "text-green-600 border-green-200" :
                      factor.trend === "declining" ? "text-red-600 border-red-200" :
                      "text-gray-600 border-gray-200"
                    }>
                      {factor.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}