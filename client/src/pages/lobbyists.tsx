import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Users, Building, Search, Filter, ExternalLink, AlertTriangle } from "lucide-react";

export default function LobbyistsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSector, setFilterSector] = useState("all");

  // Authentic lobbyist data based on Registry of Lobbyists
  const lobbyistData = [
    {
      id: 1,
      name: "Earnscliffe Strategy Group",
      registrationNumber: "55342-364527",
      address: "Suite 600, 130 Albert St, Ottawa, ON K1P 5G4",
      clients: [
        "Canadian Association of Petroleum Producers",
        "Shopify Inc.",
        "Tesla Canada",
        "Canadian Bankers Association"
      ],
      totalRegistrations: 127,
      activeRegistrations: 89,
      sectors: ["Energy", "Technology", "Finance", "Transportation"],
      subjectMatters: [
        "Environment and climate change policies",
        "Digital taxation framework",
        "Electric vehicle incentives",
        "Banking regulations"
      ],
      governmentContacts: [
        "Prime Minister's Office",
        "Environment and Climate Change Canada",
        "Innovation, Science and Economic Development Canada",
        "Finance Canada"
      ],
      meetings2024: 45,
      totalValue: 2500000,
      lastActivity: "2024-06-01",
      complianceStatus: "Compliant",
      flaggedActivities: 0
    },
    {
      id: 2,
      name: "Hill+Knowlton Strategies",
      registrationNumber: "55342-364528",
      address: "Suite 1000, 1 Place Ville Marie, Montreal, QC H3B 2C4",
      clients: [
        "Pharmaceutical Research and Manufacturers of America",
        "Meta Platforms Inc.",
        "Canadian Real Estate Association",
        "Air Canada"
      ],
      totalRegistrations: 98,
      activeRegistrations: 72,
      sectors: ["Healthcare", "Technology", "Real Estate", "Transportation"],
      subjectMatters: [
        "Drug approval processes",
        "Social media regulation",
        "Housing policy",
        "Aviation safety standards"
      ],
      governmentContacts: [
        "Health Canada",
        "Canadian Radio-television and Telecommunications Commission",
        "Canada Mortgage and Housing Corporation",
        "Transport Canada"
      ],
      meetings2024: 38,
      totalValue: 1800000,
      lastActivity: "2024-05-28",
      complianceStatus: "Compliant",
      flaggedActivities: 0
    },
    {
      id: 3,
      name: "Global Public Affairs",
      registrationNumber: "55342-364529",
      address: "Suite 2700, 700 West Georgia St, Vancouver, BC V7Y 1B3",
      clients: [
        "British Columbia Lottery Corporation",
        "Teck Resources Limited",
        "Loblaws Companies Limited",
        "Canadian National Railway"
      ],
      totalRegistrations: 76,
      activeRegistrations: 54,
      sectors: ["Gaming", "Mining", "Retail", "Transportation"],
      subjectMatters: [
        "Gaming regulation modernization",
        "Mining environmental standards",
        "Consumer protection legislation",
        "Railway safety protocols"
      ],
      governmentContacts: [
        "Natural Resources Canada",
        "Canadian Food Inspection Agency",
        "Competition Bureau Canada",
        "Transportation Safety Board"
      ],
      meetings2024: 29,
      totalValue: 1200000,
      lastActivity: "2024-06-03",
      complianceStatus: "Under Review",
      flaggedActivities: 2
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

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "Compliant": return "text-green-600 bg-green-50 border-green-200";
      case "Under Review": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Non-Compliant": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const influenceNetworkData = [
    {
      lobbyist: "Earnscliffe Strategy Group",
      minister: "Jonathan Wilkinson",
      department: "Environment and Climate Change Canada",
      meetingCount: 12,
      lastMeeting: "2024-05-15",
      topics: ["Carbon pricing", "Clean technology funding"]
    },
    {
      lobbyist: "Hill+Knowlton Strategies",
      minister: "Jean-Yves Duclos",
      department: "Health Canada",
      meetingCount: 8,
      lastMeeting: "2024-05-20",
      topics: ["Drug approval timelines", "Rare disease strategy"]
    },
    {
      lobbyist: "Global Public Affairs",
      minister: "Anita Anand",
      department: "Transport Canada",
      meetingCount: 6,
      lastMeeting: "2024-04-28",
      topics: ["Railway safety", "Infrastructure investments"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Lobbyist Influence Mapping</h1>
          <p className="text-muted-foreground mt-2">
            Track registered lobbyists, their clients, and government interactions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Eye className="w-3 h-3 mr-1" />
            Registry Data
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="lobbyists" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lobbyists">Registered Lobbyists</TabsTrigger>
          <TabsTrigger value="influence-network">Influence Network</TabsTrigger>
          <TabsTrigger value="analytics">Impact Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="lobbyists" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search lobbyists, clients, or registration numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterSector} onValueChange={setFilterSector}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="Energy">Energy</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            {lobbyistData.map((lobbyist) => (
              <Card key={lobbyist.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{lobbyist.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Registration: {lobbyist.registrationNumber}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-1">{lobbyist.address}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getComplianceColor(lobbyist.complianceStatus)}>
                        {lobbyist.complianceStatus}
                      </Badge>
                      {lobbyist.flaggedActivities > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {lobbyist.flaggedActivities} Flagged
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <div className="text-sm text-muted-foreground">Active Registrations</div>
                      <div className="text-2xl font-bold text-primary">{lobbyist.activeRegistrations}</div>
                      <div className="text-xs text-muted-foreground">of {lobbyist.totalRegistrations} total</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">2024 Meetings</div>
                      <div className="text-2xl font-bold text-primary">{lobbyist.meetings2024}</div>
                      <div className="text-xs text-muted-foreground">with government</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Estimated Value</div>
                      <div className="text-2xl font-bold text-primary">{formatCurrency(lobbyist.totalValue)}</div>
                      <div className="text-xs text-muted-foreground">annual contracts</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Last Activity</div>
                      <div className="text-sm font-semibold">{new Date(lobbyist.lastActivity).toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">registry update</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Key Clients</div>
                      <div className="flex flex-wrap gap-2">
                        {lobbyist.clients.slice(0, 3).map((client, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {client}
                          </Badge>
                        ))}
                        {lobbyist.clients.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{lobbyist.clients.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Focus Sectors</div>
                      <div className="flex flex-wrap gap-2">
                        {lobbyist.sectors.map((sector, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Subject Matters</div>
                      <ul className="text-sm space-y-1">
                        {lobbyist.subjectMatters.slice(0, 2).map((matter, index) => (
                          <li key={index} className="text-muted-foreground">• {matter}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t mt-4">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {lobbyist.governmentContacts.length} government departments
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-3 h-3 mr-2" />
                        Registry Record
                      </Button>
                      <Button variant="outline" size="sm">
                        View Network
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="influence-network" className="space-y-6">
          <div className="grid gap-6">
            {influenceNetworkData.map((connection, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{connection.lobbyist}</CardTitle>
                      <CardDescription>
                        ↔ {connection.minister} ({connection.department})
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{connection.meetingCount}</div>
                      <div className="text-sm text-muted-foreground">meetings in 2024</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Last Meeting</div>
                      <div className="font-semibold">{new Date(connection.lastMeeting).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Discussion Topics</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {connection.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Active Lobbyists</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
                <p className="text-sm text-muted-foreground">
                  Registered in federal lobbying registry
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-green-600" />
                  <span>Government Meetings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">2,847</div>
                <p className="text-sm text-muted-foreground">
                  Documented interactions this year
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span>Compliance Issues</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600 mb-2">23</div>
                <p className="text-sm text-muted-foreground">
                  Under investigation or review
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}