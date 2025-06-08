import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, AlertTriangle, Search, Filter } from "lucide-react";

export default function FinancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterParty, setFilterParty] = useState("all");
  const [filterAmount, setFilterAmount] = useState("all");

  // Sample campaign finance data - in production, this would come from Elections Canada API
  const campaignFinanceData = [
    {
      id: 1,
      candidate: "Justin Trudeau",
      party: "Liberal",
      totalRaised: 1250000,
      individualDonations: 985000,
      corporateDonations: 0,
      publicFunding: 265000,
      expenditures: 1180000,
      surplus: 70000,
      largestDonor: "Individual - $1,500",
      suspiciousTransactions: 0,
      complianceScore: 98
    },
    {
      id: 2,
      candidate: "Pierre Poilievre",
      party: "Conservative",
      totalRaised: 1180000,
      individualDonations: 1050000,
      corporateDonations: 0,
      publicFunding: 130000,
      expenditures: 1150000,
      surplus: 30000,
      largestDonor: "Individual - $1,500",
      suspiciousTransactions: 1,
      complianceScore: 95
    },
    {
      id: 3,
      candidate: "Jagmeet Singh",
      party: "NDP",
      totalRaised: 780000,
      individualDonations: 620000,
      corporateDonations: 0,
      publicFunding: 160000,
      expenditures: 750000,
      surplus: 30000,
      largestDonor: "Individual - $1,500",
      suspiciousTransactions: 0,
      complianceScore: 97
    }
  ];

  const lobbyistData = [
    {
      id: 1,
      name: "Earnscliffe Strategy Group",
      clients: 127,
      totalSpent: 2500000,
      topClient: "Canadian Association of Petroleum Producers",
      focusAreas: ["Energy", "Environment", "Finance"],
      meetings: 340,
      flaggedActivities: 2
    },
    {
      id: 2,
      name: "Hill+Knowlton Strategies",
      clients: 89,
      totalSpent: 1800000,
      topClient: "Pharmaceutical Research and Manufacturers",
      focusAreas: ["Healthcare", "Technology", "Trade"],
      meetings: 256,
      flaggedActivities: 0
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getComplianceColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Campaign Finance Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Monitor political funding, lobbyist activities, and financial transparency
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <DollarSign className="w-3 h-3 mr-1" />
            Real-time Data
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="campaign-finance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaign-finance">Campaign Finance</TabsTrigger>
          <TabsTrigger value="lobbyists">Lobbyist Mapping</TabsTrigger>
          <TabsTrigger value="transparency">Transparency Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaign-finance" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search candidates or parties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterParty} onValueChange={setFilterParty}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by party" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parties</SelectItem>
                <SelectItem value="Liberal">Liberal</SelectItem>
                <SelectItem value="Conservative">Conservative</SelectItem>
                <SelectItem value="NDP">NDP</SelectItem>
                <SelectItem value="Bloc">Bloc Québécois</SelectItem>
                <SelectItem value="Green">Green</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            {campaignFinanceData.map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{candidate.candidate}</CardTitle>
                      <CardDescription>
                        <Badge variant="outline" className="mt-1">
                          {candidate.party}
                        </Badge>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(candidate.totalRaised)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Raised</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Individual Donations</div>
                      <div className="font-semibold">{formatCurrency(candidate.individualDonations)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Public Funding</div>
                      <div className="font-semibold">{formatCurrency(candidate.publicFunding)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Expenditures</div>
                      <div className="font-semibold">{formatCurrency(candidate.expenditures)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Surplus</div>
                      <div className="font-semibold">{formatCurrency(candidate.surplus)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Compliance Score:</span>
                        <span className={`font-semibold ${getComplianceColor(candidate.complianceScore)}`}>
                          {candidate.complianceScore}%
                        </span>
                      </div>
                      {candidate.suspiciousTransactions > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {candidate.suspiciousTransactions} Flagged
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lobbyists" className="space-y-6">
          <div className="grid gap-6">
            {lobbyistData.map((lobbyist) => (
              <Card key={lobbyist.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{lobbyist.name}</CardTitle>
                      <CardDescription>{lobbyist.clients} active clients</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(lobbyist.totalSpent)}
                      </div>
                      <div className="text-sm text-muted-foreground">Annual Spending</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Top Client</div>
                      <div className="font-semibold">{lobbyist.topClient}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Government Meetings</div>
                      <div className="font-semibold">{lobbyist.meetings}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Focus Areas</div>
                      <div className="flex flex-wrap gap-1">
                        {lobbyist.focusAreas.map((area, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      {lobbyist.flaggedActivities > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {lobbyist.flaggedActivities} Flagged Activities
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                          Clean Record
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      View Activity Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transparency" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Transparency Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
                <p className="text-sm text-muted-foreground">
                  Based on disclosure compliance, reporting timeliness, and data accessibility
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span>Active Investigations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600 mb-2">3</div>
                <p className="text-sm text-muted-foreground">
                  Ongoing investigations by Elections Canada
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span>Total Monitored</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">$47.2M</div>
                <p className="text-sm text-muted-foreground">
                  Combined political spending tracked this quarter
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}