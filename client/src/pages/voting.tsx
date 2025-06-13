import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LuxuryNavigation } from "@/components/layout/LuxuryNavigation";
import { VotingButtons } from "@/components/VotingButtons";
import { InteractiveContent } from "@/components/InteractiveContent";
import { 
  FileText, Vote, Calendar, CheckCircle, XCircle, Clock, Users, TrendingUp, 
  Search, Filter, Eye, BarChart3, AlertTriangle, Crown, Building2
} from "lucide-react";
import type { Bill } from "@shared/schema";

export default function VotingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterJurisdiction, setFilterJurisdiction] = useState("all");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const { data: bills = [], isLoading } = useQuery<Bill[]>({
    queryKey: ["/api/bills"],
  });

  const { data: votingStats } = useQuery<{
    totalVotes: number;
    activeUsers: number;
    engagementRate: number;
    consensusRate: number;
  }>({
    queryKey: ["/api/voting/stats"],
  });

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.billNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || bill.status === filterStatus;
    const matchesJurisdiction = filterJurisdiction === "all" || bill.jurisdiction === filterJurisdiction;
    
    return matchesSearch && matchesStatus && matchesJurisdiction;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "royal assent": case "passed": return "bg-green-600";
      case "in committee": case "second reading": return "bg-blue-600";
      case "first reading": return "bg-yellow-600";
      case "defeated": case "withdrawn": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "royal assent": case "passed": return <CheckCircle className="w-4 h-4" />;
      case "in committee": case "second reading": return <Clock className="w-4 h-4" />;
      case "first reading": return <FileText className="w-4 h-4" />;
      case "defeated": case "withdrawn": return <XCircle className="w-4 h-4" />;
      default: return <Vote className="w-4 h-4" />;
    }
  };

  const getJurisdictionIcon = (jurisdiction: string) => {
    switch (jurisdiction.toLowerCase()) {
      case "federal": return <Crown className="w-4 h-4" />;
      case "provincial": return <Building2 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
              Loading legislative voting data...
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
                  Legislative Voting System
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Track and participate in democratic decision-making on {bills.length} active bills
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  <Vote className="w-3 h-3 mr-1" />
                  {bills.length} Bills
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  <Eye className="w-3 h-3 mr-1" />
                  Live Tracking
                </Badge>
              </div>
            </div>

            {/* Voting Statistics */}
            {votingStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {votingStats?.totalVotes?.toLocaleString() || '0'}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total Votes Cast</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {(votingStats as any)?.activeUsers ? (votingStats as any).activeUsers.toLocaleString() : '0'}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Active Participants</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {(votingStats as any)?.engagementRate || 0}%
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Engagement Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {(votingStats as any)?.consensusRate || 0}%
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Consensus Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search bills by title or number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="First Reading">First Reading</SelectItem>
                  <SelectItem value="Second Reading">Second Reading</SelectItem>
                  <SelectItem value="In Committee">In Committee</SelectItem>
                  <SelectItem value="Third Reading">Third Reading</SelectItem>
                  <SelectItem value="Royal Assent">Royal Assent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterJurisdiction} onValueChange={setFilterJurisdiction}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                  <SelectValue placeholder="Filter by jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jurisdictions</SelectItem>
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

          {!selectedBill ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredBills.map((bill) => (
                <Card 
                  key={bill.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  onClick={() => setSelectedBill(bill)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getJurisdictionIcon(bill.jurisdiction)}
                          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            {bill.billNumber} - {bill.title}
                          </h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          {bill.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          className={`text-white text-sm ${getStatusColor(bill.status || 'unknown')}`}
                        >
                          {getStatusIcon(bill.status || 'unknown')}
                          <span className="ml-1">{bill.status || 'Unknown'}</span>
                        </Badge>
                        
                        <Badge variant="outline" className="text-xs">
                          {bill.jurisdiction}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600 dark:text-slate-400">Introduced:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {bill.dateIntroduced ? new Date(bill.dateIntroduced).toLocaleDateString() : "Unknown"}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600 dark:text-slate-400">Sponsor:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {bill.sponsor || "Unknown"}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600 dark:text-slate-400">Category:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {bill.category || "General"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <VotingButtons
                        targetType="bill"
                        targetId={bill.id}
                      />
                      
                      <Button variant="outline" size="sm">
                        View Details →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredBills.length === 0 && (
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      No Bills Found
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      No bills match your current filter criteria. Try adjusting your search terms or filters.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedBill(null)}
                  className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                >
                  ← Back to Bills
                </Button>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {selectedBill.billNumber} - {selectedBill.title}
                </h2>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="voting">Voting</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bill Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-slate-700 dark:text-slate-300">
                          {selectedBill.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Bill Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Number:</span>
                                <span className="font-medium">{selectedBill.billNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Status:</span>
                                <Badge className={`text-white ${getStatusColor(selectedBill.status || 'unknown')}`}>
                                  {selectedBill.status || 'Unknown'}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Jurisdiction:</span>
                                <span className="font-medium">{selectedBill.jurisdiction}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Category:</span>
                                <span className="font-medium">{selectedBill.category || "General"}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Timeline</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Introduced:</span>
                                <span className="font-medium">
                                  {selectedBill.dateIntroduced ? new Date(selectedBill.dateIntroduced).toLocaleDateString() : "Unknown"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Last Updated:</span>
                                <span className="font-medium">
                                  {selectedBill.updatedAt ? new Date(selectedBill.updatedAt).toLocaleDateString() : "Unknown"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Sponsor:</span>
                                <span className="font-medium">{selectedBill.sponsor || "Unknown"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="voting" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Public Voting</CardTitle>
                      <CardDescription>
                        Cast your vote and see how the community responds to this legislation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <VotingButtons
                        targetType="bill"
                        targetId={selectedBill.id}
                        size="lg"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Legislative Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
                        <Clock className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Timeline Loading</h3>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          Legislative timeline and procedural history is being compiled from official parliamentary records.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Impact Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center">
                        <BarChart3 className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Analysis in Progress</h3>
                        <p className="text-purple-700 dark:text-purple-300 text-sm">
                          Comprehensive impact analysis including economic, social, and legal implications is being generated.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <InteractiveContent
                  targetType="bill"
                  targetId={selectedBill.id}
                  title={`${selectedBill.billNumber || 'Unknown'} - ${selectedBill.title}`}
                  description={selectedBill.description || undefined}
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