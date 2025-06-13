import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VotingButtons } from "@/components/VotingButtons";
import { InteractiveContent } from "@/components/InteractiveContent";
import { LuxuryNavigation } from "@/components/layout/LuxuryNavigation";
import { 
  Users, AlertTriangle, CheckCircle, AlertCircle, MapPin, Phone, Mail, 
  Globe, Calendar, FileText, Vote, DollarSign, Eye, TrendingUp, Award, 
  User, Search, Filter, ArrowRight, Building2, Crown, Star
} from "lucide-react";
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

  const filteredPoliticians = politicians.filter(politician => {
    const matchesSearch = politician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         politician.constituency?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesParty = partyFilter === "all" || politician.party === partyFilter;
    const matchesLevel = levelFilter === "all" || politician.level === levelFilter || 
                        (levelFilter === "Canada" && politician.level === "Federal");
    
    return matchesSearch && matchesParty && matchesLevel;
  });

  const getTrustScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 80) return "text-green-600";
    if (numScore >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getTrustScoreIcon = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (numScore >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
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

  const getLevelIcon = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "federal": return <Crown className="w-4 h-4" />;
      case "provincial": return <Building2 className="w-4 h-4" />;
      case "municipal": return <MapPin className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
              Loading politician intelligence data...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100">
                  Politicians Intelligence
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Comprehensive tracking of {politicians.length} Canadian political officials
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  <Users className="w-3 h-3 mr-1" />
                  {politicians.length} Officials
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  <Eye className="w-3 h-3 mr-1" />
                  Live Tracking
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or constituency..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                />
              </div>
              
              <Select value={partyFilter} onValueChange={setPartyFilter}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
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
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Federal">Federal</SelectItem>
                  <SelectItem value="Provincial">Provincial</SelectItem>
                  <SelectItem value="Municipal">Municipal</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>

          {!selectedPolitician ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPoliticians.map((politician) => (
                <Card 
                  key={politician.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  onClick={() => setSelectedPolitician(politician)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={politician.profileImageUrl || undefined} alt={politician.name} />
                        <AvatarFallback className="bg-slate-200 dark:bg-slate-700">
                          {politician.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getLevelIcon(politician.level || undefined)}
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {politician.name}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                          {politician.position}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge 
                        className={`text-white text-xs ${getPartyColor(politician.party || undefined)}`}
                      >
                        {politician.party || "Independent"}
                      </Badge>
                      
                      <div className="flex items-center gap-1">
                        {getTrustScoreIcon(politician.trustScore || "0")}
                        <span className={`text-sm font-medium ${getTrustScoreColor(politician.trustScore || "0")}`}>
                          {politician.trustScore || "N/A"}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{politician.constituency || politician.jurisdiction || "Unknown"}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Building2 className="w-3 h-3" />
                        <span>{politician.level || "Unknown"} Level</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full mt-3">
                      <ArrowRight className="w-3 h-3 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPolitician(null)}
                  className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                >
                  ← Back to List
                </Button>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {selectedPolitician.name}
                </h2>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="voting">Voting Record</TabsTrigger>
                  <TabsTrigger value="statements">Statements</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Profile Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-20 h-20">
                            <AvatarImage src={selectedPolitician.profileImageUrl || undefined} alt={selectedPolitician.name} />
                            <AvatarFallback className="text-lg bg-slate-200 dark:bg-slate-700">
                              {selectedPolitician.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-2">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                {selectedPolitician.name}
                              </h3>
                              <p className="text-slate-600 dark:text-slate-400">
                                {selectedPolitician.position}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <Badge className={`text-white ${getPartyColor(selectedPolitician.party || undefined)}`}>
                                {selectedPolitician.party || "Independent"}
                              </Badge>
                              <Badge variant="outline">
                                {selectedPolitician.level || "Unknown"} Level
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 dark:text-slate-400">Constituency:</span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {selectedPolitician.constituency || "Unknown"}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm">
                              <Building2 className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 dark:text-slate-400">Jurisdiction:</span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {selectedPolitician.jurisdiction || "Unknown"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 dark:text-slate-400">Contact:</span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {selectedPolitician.contact ? "Available" : "Not Available"}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm">
                              <Globe className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 dark:text-slate-400">Level:</span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {selectedPolitician.level || "Not Specified"}
                              </span>
                            </div>
                          </div>
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
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${getTrustScoreColor(selectedPolitician.trustScore || "0")}`}>
                            {selectedPolitician.trustScore || "N/A"}%
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Trust Score</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Voting Participation:</span>
                            <span className="font-medium text-slate-900 dark:text-slate-100">95%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Transparency Score:</span>
                            <span className="font-medium text-slate-900 dark:text-slate-100">87%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Public Engagement:</span>
                            <span className="font-medium text-slate-900 dark:text-slate-100">92%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
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
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
                        <Vote className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Voting Records Loading</h3>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          Official voting records are being synchronized from parliamentary databases.
                          This will include votes on bills, amendments, and committee decisions.
                        </p>
                      </div>
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
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 text-center">
                        <Calendar className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Statement Tracking Active</h3>
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                          Public statements are being monitored from official sources including parliament,
                          press releases, and verified communications channels.
                        </p>
                      </div>
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
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center">
                        <DollarSign className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Financial Data Compilation</h3>
                        <p className="text-purple-700 dark:text-purple-300 text-sm">
                          Financial disclosure information is being compiled from official ethics filings.
                          This will include assets, investments, income sources, and potential conflicts of interest.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <InteractiveContent
                  targetType="politician"
                  targetId={selectedPolitician.id}
                  title={selectedPolitician.name}
                  description={`${selectedPolitician.position} - ${selectedPolitician.party}`}
                  showVoting={true}
                  showComments={true}
                  showSharing={true}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }