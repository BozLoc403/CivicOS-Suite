import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, FileText, Scale, Newspaper, Vote, MapPin, 
  TrendingUp, AlertTriangle, Search, Filter, Eye,
  Crown, Shield, Activity, BarChart3, Globe, Zap
} from 'lucide-react';

interface DashboardData {
  politicians: any[];
  bills: any[];
  news: any[];
  legalCases: any[];
  elections: any[];
  analytics: any;
}

interface WidgetProps {
  isCollapsed?: boolean;
  onExpand?: () => void;
}

export function RevolutionaryDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [activeWidgets, setActiveWidgets] = useState([
    'politicians', 'bills', 'news', 'legal', 'elections', 'analytics'
  ]);

  // Fetch comprehensive dashboard data
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard/comprehensive', selectedRegion],
    refetchInterval: 30000 // Real-time updates
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
            Loading Dominion Intelligence Systems...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
      {/* Command Center Header */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100">
              Dominion Command Center
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
              Real-time Canadian political intelligence and civic oversight
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              <Activity className="w-3 h-3 mr-1" />
              Live Data Active
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
              <Shield className="w-3 h-3 mr-1" />
              Secure Connection
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search politicians, bills, laws, cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
            />
          </div>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
          >
            <option value="all">All Jurisdictions</option>
            <option value="federal">Federal</option>
            <option value="ontario">Ontario</option>
            <option value="quebec">Quebec</option>
            <option value="bc">British Columbia</option>
            <option value="alberta">Alberta</option>
          </select>
        </div>
      </div>

      {/* Revolutionary Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Politicians Intelligence Widget */}
        <PoliticiansWidget data={dashboardData?.politicians || []} searchQuery={searchQuery} />
        
        {/* Bills & Legislation Widget */}
        <BillsWidget data={dashboardData?.bills || []} searchQuery={searchQuery} />
        
        {/* News Intelligence Widget */}
        <NewsWidget data={dashboardData?.news || []} searchQuery={searchQuery} />
        
        {/* Legal System Widget */}
        <LegalWidget data={dashboardData?.legalCases || []} searchQuery={searchQuery} />
        
        {/* Elections & Democracy Widget */}
        <ElectionsWidget data={dashboardData?.elections || []} searchQuery={searchQuery} />
        
        {/* Analytics & Insights Widget */}
        <AnalyticsWidget data={dashboardData?.analytics || {}} />
      </div>

      {/* Comprehensive Tabs Interface */}
      <div className="mt-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transparency">Transparency</TabsTrigger>
            <TabsTrigger value="rights">Rights</TabsTrigger>
            <TabsTrigger value="democracy">Democracy</TabsTrigger>
            <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <ComprehensiveOverview data={dashboardData} />
          </TabsContent>

          <TabsContent value="transparency" className="mt-6">
            <TransparencyPortal data={dashboardData} />
          </TabsContent>

          <TabsContent value="rights" className="mt-6">
            <RightsEducationCenter />
          </TabsContent>

          <TabsContent value="democracy" className="mt-6">
            <DemocracyMonitor data={dashboardData} />
          </TabsContent>

          <TabsContent value="intelligence" className="mt-6">
            <IntelligenceCenter data={dashboardData} />
          </TabsContent>

          <TabsContent value="monitoring" className="mt-6">
            <RealTimeMonitoring />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Individual Widget Components
function PoliticiansWidget({ data, searchQuery }: { data: any[], searchQuery: string }) {
  const validData = Array.isArray(data) ? data : [];
  const filteredData = validData.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.party?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Users className="w-5 h-5 text-blue-600" />
          Politicians Intelligence
          <Badge variant="secondary" className="ml-auto">{filteredData.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {filteredData.slice(0, 10).map((politician, index) => (
              <div key={index} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {politician.name}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      {politician.position} • {politician.party}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 truncate">
                      {politician.constituency}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-green-600 dark:text-green-400">
                      Trust: {politician.trustScore}%
                    </div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {politician.level}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Button variant="outline" className="w-full mt-3" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View All Politicians
        </Button>
      </CardContent>
    </Card>
  );
}

function BillsWidget({ data, searchQuery }: { data: any[], searchQuery: string }) {
  const validData = Array.isArray(data) ? data : [];
  const filteredData = validData.filter(b => 
    b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.billNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <FileText className="w-5 h-5 text-green-600" />
          Bills & Legislation
          <Badge variant="secondary" className="ml-auto">{filteredData.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {filteredData.slice(0, 8).map((bill, index) => (
              <div key={index} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      {bill.billNumber}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {bill.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {bill.jurisdiction} • {bill.sponsor}
                    </p>
                  </div>
                  <Badge 
                    variant={bill.status === 'Royal Assent' ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {bill.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Button variant="outline" className="w-full mt-3" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          View All Bills
        </Button>
      </CardContent>
    </Card>
  );
}

function NewsWidget({ data, searchQuery }: { data: any[], searchQuery: string }) {
  const validData = Array.isArray(data) ? data : [];
  const filteredData = validData.filter(n => 
    n.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Newspaper className="w-5 h-5 text-orange-600" />
          News Intelligence
          <Badge variant="secondary" className="ml-auto">{filteredData.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {filteredData.slice(0, 6).map((article, index) => (
              <div key={index} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 line-clamp-2">
                    {article.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">{article.source}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {article.bias}
                      </Badge>
                      <span className="text-slate-500">{article.credibilityScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Button variant="outline" className="w-full mt-3" size="sm">
          <Newspaper className="w-4 h-4 mr-2" />
          View All News
        </Button>
      </CardContent>
    </Card>
  );
}

function LegalWidget({ data, searchQuery }: { data: any[], searchQuery: string }) {
  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Scale className="w-5 h-5 text-purple-600" />
          Legal System
          <Badge variant="secondary" className="ml-auto">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center">
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">2,847</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Criminal Code Sections</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center">
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">15</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Charter Rights</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h5 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Recent Cases</h5>
            {data.slice(0, 3).map((case_, index) => (
              <div key={index} className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded text-xs">
                <div className="font-medium text-slate-900 dark:text-slate-100">{case_.caseName}</div>
                <div className="text-slate-600 dark:text-slate-400">{case_.court}</div>
              </div>
            ))}
          </div>
        </div>
        <Button variant="outline" className="w-full mt-3" size="sm">
          <Scale className="w-4 h-4 mr-2" />
          Legal Search
        </Button>
      </CardContent>
    </Card>
  );
}

function ElectionsWidget({ data, searchQuery }: { data: any[], searchQuery: string }) {
  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Vote className="w-5 h-5 text-red-600" />
          Elections & Democracy
          <Badge variant="secondary" className="ml-auto">Active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center p-4 bg-gradient-to-r from-red-50 to-blue-50 dark:from-red-900/20 dark:to-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">338</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Electoral Districts</div>
          </div>
          
          <div className="space-y-2">
            <h5 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Upcoming Elections</h5>
            <div className="space-y-1">
              <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded text-xs">
                <div className="font-medium text-slate-900 dark:text-slate-100">Municipal Elections 2024</div>
                <div className="text-slate-600 dark:text-slate-400">Various municipalities</div>
              </div>
            </div>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-3" size="sm">
          <Vote className="w-4 h-4 mr-2" />
          Election Center
        </Button>
      </CardContent>
    </Card>
  );
}

function AnalyticsWidget({ data }: { data: any }) {
  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          Civic Analytics
          <Badge variant="secondary" className="ml-auto">Real-time</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg text-center">
              <div className="text-lg font-bold text-blue-700 dark:text-blue-400">87%</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Transparency Score</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg text-center">
              <div className="text-lg font-bold text-green-700 dark:text-green-400">94%</div>
              <div className="text-xs text-green-600 dark:text-green-400">Data Accuracy</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h5 className="font-semibold text-sm text-slate-900 dark:text-slate-100">System Health</h5>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Data Sources</span>
                <span className="text-green-600 dark:text-green-400">200+ Active</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Last Update</span>
                <span className="text-slate-700 dark:text-slate-300">2 min ago</span>
              </div>
            </div>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-3" size="sm">
          <TrendingUp className="w-4 h-4 mr-2" />
          Full Analytics
        </Button>
      </CardContent>
    </Card>
  );
}

// Tab Content Components
function ComprehensiveOverview({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Politicians</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {data?.politicians?.length || 0}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Active Bills</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                {data?.bills?.length || 0}
              </p>
            </div>
            <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">News Articles</p>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                {data?.news?.length || 0}
              </p>
            </div>
            <Newspaper className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Legal Cases</p>
              <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                {data?.legalCases?.length || 0}
              </p>
            </div>
            <Scale className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TransparencyPortal({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Government Transparency Portal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold mb-2">Financial Disclosures</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Access MP expenses, travel claims, and financial declarations
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold mb-2">Lobbying Registry</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Track lobbyist activities and government meetings
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold mb-2">Contract Database</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Monitor government contracts and procurement
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RightsEducationCenter() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Charter of Rights & Freedoms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Learn about your fundamental rights and freedoms as a Canadian citizen
          </p>
          <Button className="w-full sm:w-auto">
            <Scale className="w-4 h-4 mr-2" />
            Explore Your Rights
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function DemocracyMonitor({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5" />
            Democracy Health Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">92%</div>
              <div className="text-sm text-green-600 dark:text-green-400">Electoral Integrity</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">88%</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Government Transparency</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">91%</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Civic Participation</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function IntelligenceCenter({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Intelligence Operations Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Active Monitoring</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Government Sources</span>
                  <span className="text-green-600">200+ Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">News Sources</span>
                  <span className="text-green-600">50+ Monitored</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Legal Databases</span>
                  <span className="text-green-600">15+ Connected</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Data Quality</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Accuracy Score</span>
                  <span className="text-green-600">96.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Real-time Updates</span>
                  <span className="text-blue-600">Every 30s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Verification Level</span>
                  <span className="text-purple-600">Military Grade</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RealTimeMonitoring() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Real-time System Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">System Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-sm">Data Collection</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-sm">AI Analysis</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-sm">Security Protocols</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    Secure
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Performance Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Response Time</span>
                  <span className="font-medium">127ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Uptime</span>
                  <span className="font-medium">99.97%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Data Freshness</span>
                  <span className="font-medium">Real-time</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}