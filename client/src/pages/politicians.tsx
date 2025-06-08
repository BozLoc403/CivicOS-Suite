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
            Monitor political statements, track consistency, and view trust scores
          </p>
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
                      variant="outline" 
                      className="w-full text-civic-blue border-civic-blue hover:bg-civic-blue hover:text-white"
                    >
                      View Statements
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
                    >
                      Track Voting Record
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
      </main>
    </div>
  );
}
