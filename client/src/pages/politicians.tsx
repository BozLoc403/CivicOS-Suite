import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationHeader } from "@/components/NavigationHeader";
import { Users, AlertTriangle, CheckCircle, AlertCircle, MapPin, Phone, Mail, Globe, Calendar, FileText, Vote, DollarSign, Eye, TrendingUp, Award } from "lucide-react";
import { useState } from "react";
import type { Politician } from "@shared/schema";

export default function Politicians() {
  const [selectedPolitician, setSelectedPolitician] = useState<Politician | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [partyFilter, setPartyFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const { data: politicians = [], isLoading } = useQuery<Politician[]>({
    queryKey: ["/api/politicians"],
  });

  const { data: votingRecord = [], isLoading: votingLoading } = useQuery({
    queryKey: ["/api/politicians", selectedPolitician?.id, "voting-record"],
    enabled: !!selectedPolitician,
  });

  const { data: policyPositions = [], isLoading: policyLoading } = useQuery({
    queryKey: ["/api/politicians", selectedPolitician?.id, "policy-positions"],
    enabled: !!selectedPolitician,
  });

  const { data: publicStatements = [], isLoading: statementsLoading } = useQuery({
    queryKey: ["/api/politicians", selectedPolitician?.id, "public-statements"],
    enabled: !!selectedPolitician,
  });

  const { data: financialDisclosures = [], isLoading: financialLoading } = useQuery({
    queryKey: ["/api/politicians", selectedPolitician?.id, "financial-disclosures"],
    enabled: !!selectedPolitician,
  });

  const filteredPoliticians = politicians.filter(politician => {
    const matchesSearch = politician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         politician.constituency?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesParty = partyFilter === "all" || politician.party === partyFilter;
    const matchesLevel = levelFilter === "all" || politician.jurisdiction === levelFilter;
    
    return matchesSearch && matchesParty && matchesLevel;
  });

  const getTrustScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 80) return "civic-green";
    if (numScore >= 60) return "text-yellow-600";
    return "civic-red";
  };

  const getTrustScoreIcon = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 80) return <CheckCircle className="w-5 h-5 civic-green" />;
    if (numScore >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 civic-red" />;
  };

  const getPartyColor = (party?: string) => {
    if (!party) return "bg-gray-500";
    switch (party.toLowerCase()) {
      case "liberal": return "bg-red-600";
      case "conservative": return "bg-blue-600";
      case "ndp": case "new democratic": return "bg-orange-500";
      case "bloc québécois": case "bloc quebecois": return "bg-cyan-600";
      case "green": return "bg-green-600";
      default: return "bg-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-civic-blue mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading politician data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Politician Tracker</h2>
          <p className="text-gray-600">
            Access authentic voting records, policy positions, and financial disclosures
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Input
            placeholder="Search politicians or constituencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select value={partyFilter} onValueChange={setPartyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by party" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Parties</SelectItem>
              <SelectItem value="Liberal">Liberal</SelectItem>
              <SelectItem value="Conservative">Conservative</SelectItem>
              <SelectItem value="NDP">NDP</SelectItem>
              <SelectItem value="Bloc Québécois">Bloc Québécois</SelectItem>
              <SelectItem value="Green">Green</SelectItem>
            </SelectContent>
          </Select>

          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Canada">Federal</SelectItem>
              <SelectItem value="Ontario">Provincial</SelectItem>
              <SelectItem value="Municipal">Municipal</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => {
            setSearchTerm("");
            setPartyFilter("all");
            setLevelFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>

        {/* Trust Score Explanation */}
        <Card className="mb-8 bg-blue-50 border-civic-blue">
          <CardContent className="p-6">
            <div className="flex items-start">
              <Users className="civic-blue text-2xl mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold civic-blue mb-2">Trust Score System</h3>
                <p className="text-sm text-blue-700">
                  Trust scores are calculated based on statement consistency, promise fulfillment, 
                  and voting record alignment. Scores are updated monthly using AI-powered analysis 
                  of public statements and verified actions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Politicians List */}
        {politicians.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Politicians Tracked</h3>
              <p className="text-gray-600">
                Politician data is being populated. Check back soon for comprehensive tracking.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {politicians.map((politician) => (
              <Card key={politician.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mr-4 flex-shrink-0">
                      {politician.profileImageUrl ? (
                        <img 
                          src={politician.profileImageUrl} 
                          alt={politician.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-civic-blue flex items-center justify-center">
                          <span className="text-white text-lg font-semibold">
                            {politician.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {politician.name}
                      </h3>
                      <p className="text-sm text-gray-600">{politician.position}</p>
                      {politician.party && (
                        <Badge variant="outline" className="mt-1">
                          {politician.party}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Constituency:</span> {politician.constituency || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Jurisdiction:</span> {politician.jurisdiction}
                    </p>
                  </div>

                  {/* Trust Score */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Trust Score</span>
                      {getTrustScoreIcon(politician.trustScore || "50.00")}
                    </div>
                    <div className="flex items-baseline">
                      <span className={`text-2xl font-bold ${getTrustScoreColor(politician.trustScore || "50.00")}`}>
                        {parseFloat(politician.trustScore || "50.00").toFixed(0)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        Based on statement consistency
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button 
                      onClick={() => setSelectedPolitician(politician)}
                      variant="outline" 
                      className="w-full text-civic-blue border-civic-blue hover:bg-civic-blue hover:text-white"
                    >
                      View Complete Profile
                    </Button>
                    <Button 
                      onClick={() => setSelectedPolitician(politician)}
                      variant="outline" 
                      size="sm" 
                      className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
                    >
                      Voting Records & Financial Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Legend */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trust Score Legend</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 civic-green mr-3" />
                <div>
                  <div className="font-medium civic-green">80-100%</div>
                  <div className="text-sm text-gray-600">High Trust</div>
                </div>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <div className="font-medium text-yellow-600">60-79%</div>
                  <div className="text-sm text-gray-600">Moderate Trust</div>
                </div>
              </div>
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 civic-red mr-3" />
                <div>
                  <div className="font-medium civic-red">0-59%</div>
                  <div className="text-sm text-gray-600">Low Trust</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Politician Detail Modal */}
        {selectedPolitician && (
          <PoliticianDetailModal 
            politician={selectedPolitician} 
            onClose={() => setSelectedPolitician(null)} 
          />
        )}
      </main>
    </div>
  );
}

interface PoliticianDetailModalProps {
  politician: Politician;
  onClose: () => void;
}

function PoliticianDetailModal({ politician, onClose }: PoliticianDetailModalProps) {
  const { data: votingRecord = [] } = useQuery({
    queryKey: ["/api/politicians", politician.id, "voting-record"],
    enabled: !!politician.id
  });

  const { data: policyPositions = [] } = useQuery({
    queryKey: ["/api/politicians", politician.id, "policy-positions"], 
    enabled: !!politician.id
  });

  const { data: financialDisclosures = [] } = useQuery({
    queryKey: ["/api/politicians", politician.id, "financial-disclosures"],
    enabled: !!politician.id
  });

  const { data: publicStatements = [] } = useQuery({
    queryKey: ["/api/politicians", politician.id, "statements"],
    enabled: !!politician.id
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-civic-blue rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  {politician.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{politician.name}</h2>
                <p className="text-gray-600">{politician.position}</p>
                <div className="flex items-center gap-2 mt-1">
                  {politician.party && (
                    <Badge variant="outline">{politician.party}</Badge>
                  )}
                  <Badge variant="secondary">{politician.jurisdiction}</Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="overview" className="p-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="voting">Voting Record</TabsTrigger>
              <TabsTrigger value="policies">Policy Positions</TabsTrigger>
              <TabsTrigger value="financial">Financial Data</TabsTrigger>
              <TabsTrigger value="statements">Public Statements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Constituency Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Constituency</p>
                      <p className="text-gray-900">{politician.constituency || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Jurisdiction</p>
                      <p className="text-gray-900">{politician.jurisdiction}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Party Affiliation</p>
                      <p className="text-gray-900">{politician.party || "Independent"}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Trust & Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Trust Score</p>
                      <p className="text-2xl font-bold civic-blue">{politician.trustScore || "N/A"}%</p>
                      <p className="text-xs text-gray-500">Based on statement consistency and promise fulfillment</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-blue-700 text-sm">
                      Comprehensive politician data is being synchronized with official government sources.
                      This includes authentic voting records, verified statements, and official financial disclosures.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voting" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="w-5 h-5" />
                    Official Voting Record
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {votingRecord.length === 0 ? (
                    <div className="bg-blue-50 rounded-lg p-6 text-center">
                      <Vote className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-blue-900 mb-2">Voting Records Loading</h3>
                      <p className="text-blue-700 text-sm">
                        Official voting records are being synchronized from parliamentary databases.
                        This will include votes on bills, amendments, and committee decisions.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {votingRecord.map((vote: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{vote.billTitle}</h4>
                              <p className="text-sm text-gray-600 mt-1">{vote.description}</p>
                            </div>
                            <Badge variant={vote.voteType === "Yes" ? "default" : vote.voteType === "No" ? "destructive" : "secondary"}>
                              {vote.voteType}
                            </Badge>
                          </div>
                          <div className="mt-3 text-xs text-gray-500">
                            Voted on {new Date(vote.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="policies" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Policy Positions & Stances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {policyPositions.length === 0 ? (
                    <div className="bg-green-50 rounded-lg p-6 text-center">
                      <FileText className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-green-900 mb-2">Policy Analysis in Progress</h3>
                      <p className="text-green-700 text-sm">
                        Policy positions are being analyzed from official statements, voting patterns, and public declarations.
                        This will include positions on healthcare, economy, environment, and social issues.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {policyPositions.map((position: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{position.category}</h4>
                              <p className="text-sm text-gray-600 mt-1">{position.position}</p>
                            </div>
                            <Badge variant="outline">{position.source}</Badge>
                          </div>
                          <div className="mt-3 text-xs text-gray-500">
                            Last updated: {new Date(position.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Financial Disclosures & Assets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {financialDisclosures.length === 0 ? (
                    <div className="bg-purple-50 rounded-lg p-6 text-center">
                      <DollarSign className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-purple-900 mb-2">Financial Data Compilation</h3>
                      <p className="text-purple-700 text-sm">
                        Financial disclosure information is being compiled from official ethics filings.
                        This will include assets, investments, income sources, and potential conflicts of interest.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {financialDisclosures.map((disclosure: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{disclosure.category}</h4>
                              <p className="text-sm text-gray-600 mt-1">{disclosure.description}</p>
                            </div>
                            <Badge variant="outline">{disclosure.year}</Badge>
                          </div>
                          <div className="mt-3 text-xs text-gray-500">
                            Filed: {new Date(disclosure.filingDate).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statements" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Public Statements & Communications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {publicStatements.length === 0 ? (
                    <div className="bg-yellow-50 rounded-lg p-6 text-center">
                      <Calendar className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-yellow-900 mb-2">Statement Tracking Active</h3>
                      <p className="text-yellow-700 text-sm">
                        Public statements are being monitored from official sources including parliament,
                        press releases, and verified communications channels.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {publicStatements.map((statement: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-gray-900">{statement.content}</p>
                              <p className="text-sm text-gray-600 mt-2">{statement.context}</p>
                            </div>
                            <Badge variant="outline">{statement.source}</Badge>
                          </div>
                          <div className="mt-3 text-xs text-gray-500">
                            {new Date(statement.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
