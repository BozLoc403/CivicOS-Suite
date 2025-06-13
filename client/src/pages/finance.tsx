import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LuxuryNavigation } from "@/components/layout/LuxuryNavigation";
import { InteractiveContent } from "@/components/InteractiveContent";
import { 
  DollarSign, TrendingUp, AlertTriangle, Search, Filter, Crown, Building2, 
  Users, Eye, BarChart3, Calendar, ExternalLink, CheckCircle, XCircle
} from "lucide-react";

interface CampaignFinance {
  id: number;
  politician: string;
  party: string;
  jurisdiction: string;
  totalRaised: number;
  individualDonations: number;
  corporateDonations: number;
  publicFunding: number;
  expenditures: number;
  surplus: number;
  largestDonor: string;
  suspiciousTransactions: number;
  complianceScore: number;
  reportingPeriod: string;
  filingDeadline: string;
  sourceUrl: string;
}

interface FinancialStats {
  totalDonations: number;
  averageDonation: number;
  complianceRate: number;
  transparencyScore: number;
  recentFilings: number;
  overdueFilers: number;
}

export default function FinancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterParty, setFilterParty] = useState("all");
  const [filterAmount, setFilterAmount] = useState("all");
  const [filterJurisdiction, setFilterJurisdiction] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<CampaignFinance | null>(null);

  const { data: financeData = [], isLoading } = useQuery<CampaignFinance[]>({
    queryKey: ["/api/campaign-finance", searchTerm, filterParty, filterAmount, filterJurisdiction],
  });

  const { data: financialStats } = useQuery<FinancialStats>({
    queryKey: ["/api/campaign-finance/stats"],
  });

  const getPartyColor = (party: string) => {
    switch (party.toLowerCase()) {
      case "liberal": return "bg-red-100 text-red-800 border-red-300";
      case "conservative": return "bg-blue-100 text-blue-800 border-blue-300";
      case "ndp": return "bg-orange-100 text-orange-800 border-orange-300";
      case "bloc québécois": return "bg-cyan-100 text-cyan-800 border-cyan-300";
      case "green": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getJurisdictionIcon = (jurisdiction: string) => {
    switch (jurisdiction.toLowerCase()) {
      case "federal": return <Crown className="w-4 h-4" />;
      case "provincial": return <Building2 className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getComplianceColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredFinanceData = financeData.filter(record => {
    const matchesSearch = record.politician?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.party?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesParty = filterParty === "all" || record.party === filterParty;
    const matchesJurisdiction = filterJurisdiction === "all" || record.jurisdiction === filterJurisdiction;
    
    let matchesAmount = true;
    if (filterAmount === "high") matchesAmount = record.totalRaised > 1000000;
    else if (filterAmount === "medium") matchesAmount = record.totalRaised >= 500000 && record.totalRaised <= 1000000;
    else if (filterAmount === "low") matchesAmount = record.totalRaised < 500000;
    
    return matchesSearch && matchesParty && matchesJurisdiction && matchesAmount;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
              Loading campaign finance data...
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
                <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100 flex items-center">
                  <DollarSign className="w-8 h-8 mr-3 text-slate-600 dark:text-slate-400" />
                  Campaign Finance Transparency
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Complete transparency of Canadian political campaign financing and expenditures
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  <Eye className="w-3 h-3 mr-1" />
                  {financeData.length} Records
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Elections Canada
                </Badge>
              </div>
            </div>

            {/* Financial Statistics */}
            {financialStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {formatCurrency(financialStats.totalDonations)}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total Donations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {formatCurrency(financialStats.averageDonation)}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Average Donation</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {financialStats.complianceRate}%
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Compliance Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {financialStats.overdueFilers}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Overdue Filers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search politicians or parties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                />
              </div>
              
              <Select value={filterParty} onValueChange={setFilterParty}>
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

              <Select value={filterAmount} onValueChange={setFilterAmount}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                  <SelectValue placeholder="Filter by amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Amounts</SelectItem>
                  <SelectItem value="high">Over $1M</SelectItem>
                  <SelectItem value="medium">$500K - $1M</SelectItem>
                  <SelectItem value="low">Under $500K</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredFinanceData.map((record) => (
              <Card 
                key={record.id} 
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getJurisdictionIcon(record.jurisdiction)}
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                          {record.politician}
                        </h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">
                        Campaign Finance Report - {record.reportingPeriod}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`${getPartyColor(record.party)}`}>
                        {record.party}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {record.jurisdiction}
                      </Badge>
                      <div className={`text-sm font-medium ${getComplianceColor(record.complianceScore)}`}>
                        Compliance: {record.complianceScore}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                      <div className="text-sm text-green-700 dark:text-green-300 font-medium">Total Raised</div>
                      <div className="text-xl font-bold text-green-900 dark:text-green-100">
                        {formatCurrency(record.totalRaised)}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Individual Donations</div>
                      <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                        {formatCurrency(record.individualDonations)}
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                      <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">Expenditures</div>
                      <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
                        {formatCurrency(record.expenditures)}
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                      <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">Surplus/Deficit</div>
                      <div className={`text-xl font-bold ${record.surplus >= 0 ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
                        {formatCurrency(record.surplus)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Public Funding:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {formatCurrency(record.publicFunding)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Largest Donor:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {record.largestDonor}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Filing Deadline:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {record.filingDeadline}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Corporate Donations:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {formatCurrency(record.corporateDonations)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Suspicious Transactions:</span>
                        <span className={`font-medium ${record.suspiciousTransactions > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {record.suspiciousTransactions}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Transparency Score:</span>
                        <span className={`font-medium ${getComplianceColor(record.complianceScore)}`}>
                          {record.complianceScore}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  {record.suspiciousTransactions > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h4 className="font-semibold text-red-900 dark:text-red-100">Compliance Alert</h4>
                      </div>
                      <p className="text-sm text-red-800 dark:text-red-200">
                        This record contains {record.suspiciousTransactions} flagged transaction(s) requiring review.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      Report Period: {record.reportingPeriod}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={record.sourceUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Elections Canada
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedRecord(record)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredFinanceData.length === 0 && (
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    No Financial Records Found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    No campaign finance records match your current filter criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Financial Disclaimer */}
          <div className="mt-8">
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <DollarSign className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Campaign Finance Data Source
                    </h3>
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      All financial data is sourced directly from Elections Canada and provincial election authorities. 
                      Data may be subject to reporting deadlines and verification processes. 
                      For official records, please consult Elections Canada directly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }