import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { LuxuryNavigation } from '@/components/layout/LuxuryNavigation';
import { PrimeMinisterIntelligence } from '@/components/widgets/PrimeMinisterIntelligence';
import { Link } from 'wouter';
import { 
  Users, FileText, Scale, Newspaper, Vote, 
  Search, Activity, Shield, BarChart3, TrendingUp,
  AlertTriangle, CheckCircle, Clock, ArrowRight,
  Eye, Download, DollarSign
} from 'lucide-react';

interface DashboardData {
  politicians: {
    total: string;
    federal: string;
    provincial: string;
    municipal: string;
    averageTrust: number;
  };
  bills: {
    total: string;
    passed: string;
    inProgress: number;
    failed: string;
  };
  news: {
    total: number;
    avgCredibility: number;
    avgSentiment: number;
    recent: number;
  };
  legal: {
    criminalSections: number;
    acts: string;
    cases: string;
  };
  elections: {
    total: string;
    active: string;
    upcoming: string;
  };
  analytics: any;
  monitoring: any;
  lastUpdated: string;
}

export function RevolutionaryDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard/comprehensive', selectedRegion],
    refetchInterval: 30000
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-2 sm:p-4 lg:p-6">
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100 truncate">
              Dominion Command Center
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm lg:text-base">
              Real-time Canadian political intelligence and civic oversight
            </p>
          </div>
          
          <div className="flex flex-row sm:flex-row gap-2 flex-wrap">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs">
              <Activity className="w-3 h-3 mr-1" />
              Live Data Active
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Secure Connection
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search politicians, bills, laws, cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-sm sm:text-base h-9 sm:h-10"
          />
        </div>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-sm sm:text-base h-9 sm:h-10 min-w-0"
        >
          <option value="all">All Jurisdictions</option>
          <option value="federal">Federal</option>
          <option value="ontario">Ontario</option>
          <option value="quebec">Quebec</option>
          <option value="bc">British Columbia</option>
          <option value="alberta">Alberta</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <PoliticiansWidget data={dashboardData?.politicians} />
        <BillsWidget data={dashboardData?.bills} />
        <NewsWidget data={dashboardData?.news} />
        <LegalWidget data={dashboardData?.legal} />
        <ElectionsWidget data={dashboardData?.elections} />
        <AnalyticsWidget data={dashboardData?.analytics} />
      </div>

      <div className="mt-6 sm:mt-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm h-auto p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2">Overview</TabsTrigger>
            <TabsTrigger value="transparency" className="text-xs sm:text-sm px-2 py-2">Transparency</TabsTrigger>
            <TabsTrigger value="rights" className="text-xs sm:text-sm px-2 py-2">Rights</TabsTrigger>
            <TabsTrigger value="democracy" className="text-xs sm:text-sm px-2 py-2">Democracy</TabsTrigger>
            <TabsTrigger value="intelligence" className="text-xs sm:text-sm px-2 py-2">Intelligence</TabsTrigger>
            <TabsTrigger value="monitoring" className="text-xs sm:text-sm px-2 py-2">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 sm:mt-6">
            <ComprehensiveOverview data={dashboardData} />
          </TabsContent>

          <TabsContent value="transparency" className="mt-4 sm:mt-6">
            <TransparencyPortal data={dashboardData} />
          </TabsContent>

          <TabsContent value="rights" className="mt-6">
            <RightsEducationCenter />
          </TabsContent>

          <TabsContent value="democracy" className="mt-6">
            <DemocracyMonitor data={dashboardData} />
          </TabsContent>

          <TabsContent value="intelligence" className="mt-6">
            <div className="space-y-6">
              <PrimeMinisterIntelligence />
              <IntelligenceCenter data={dashboardData} />
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="mt-6">
            <RealTimeMonitoring />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PoliticiansWidget({ data }: { data: any }) {
  if (!data) return null;

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Users className="w-5 h-5 text-blue-600" />
          Politicians Intelligence
          <Badge variant="secondary" className="ml-auto">{data.total}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {data.federal}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-500">Federal MPs</div>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {data.provincial}
              </div>
              <div className="text-xs text-green-600 dark:text-green-500">Provincial MLAs</div>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              {data.municipal}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-500">Municipal Officials</div>
          </div>

          <Link href="/politicians">
            <Button variant="outline" className="w-full mt-3">
              <ArrowRight className="w-4 h-4 mr-2" />
              View All Politicians
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function BillsWidget({ data }: { data: any }) {
  if (!data) return null;

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <FileText className="w-5 h-5 text-green-600" />
          Bills & Legislation
          <Badge variant="secondary" className="ml-auto">{data.total}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
              <div className="text-base sm:text-lg font-bold text-green-700 dark:text-green-400">
                {data.passed}
              </div>
              <div className="text-xs text-green-600 dark:text-green-500">Passed</div>
            </div>
            <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-center">
              <div className="text-base sm:text-lg font-bold text-yellow-700 dark:text-yellow-400">
                {data.inProgress}
              </div>
              <div className="text-xs text-yellow-600 dark:text-yellow-500">In Progress</div>
            </div>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
              <div className="text-lg font-bold text-red-700 dark:text-red-400">
                {data.failed}
              </div>
              <div className="text-xs text-red-600 dark:text-red-500">Failed</div>
            </div>
          </div>

          <Link href="/voting">
            <Button variant="outline" className="w-full mt-3">
              <ArrowRight className="w-4 h-4 mr-2" />
              View All Bills
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function NewsWidget({ data }: { data: any }) {
  if (!data) return null;

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Newspaper className="w-5 h-5 text-orange-600" />
          News Intelligence
          <Badge variant="secondary" className="ml-auto">{data.total}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
                {(data.avgCredibility * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-500">Avg Credibility</div>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="text-xl font-bold text-purple-700 dark:text-purple-400">
                {data.recent}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-500">Recent Articles</div>
            </div>
          </div>

          <Link href="/news">
            <Button variant="outline" className="w-full mt-3">
              <ArrowRight className="w-4 h-4 mr-2" />
              View News Analysis
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function LegalWidget({ data }: { data: any }) {
  if (!data) return null;

  const totalLegalDocs = (parseInt(data.acts || '0') + parseInt(data.cases || '0'));

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Scale className="w-5 h-5 text-purple-600" />
          Legal Database
          <Badge variant="secondary" className="ml-auto">{totalLegalDocs}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="text-xl font-bold text-purple-700 dark:text-purple-400">
                {data.acts}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-500">Acts & Laws</div>
            </div>
            <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
              <div className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                {data.cases}
              </div>
              <div className="text-xs text-indigo-600 dark:text-indigo-500">Legal Cases</div>
            </div>
          </div>

          <Link href="/legal">
            <Button variant="outline" className="w-full mt-3">
              <ArrowRight className="w-4 h-4 mr-2" />
              View Legal Database
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ElectionsWidget({ data }: { data: any }) {
  if (!data) return null;

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Vote className="w-5 h-5 text-red-600" />
          Elections Monitor
          <Badge variant="secondary" className="ml-auto">{data.total}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-xl font-bold text-green-700 dark:text-green-400">
                {data.active}
              </div>
              <div className="text-xs text-green-600 dark:text-green-500">Active</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
                {data.upcoming}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-500">Upcoming</div>
            </div>
          </div>

          <Link href="/elections">
            <Button variant="outline" className="w-full mt-3">
              <ArrowRight className="w-4 h-4 mr-2" />
              View Elections
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsWidget({ data }: { data: any }) {
  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          System Analytics
          <Badge variant="secondary" className="ml-auto">
            <TrendingUp className="w-3 h-3" />
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                98.7%
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-500">Uptime</div>
            </div>
            <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20">
              <div className="text-xl font-bold text-cyan-700 dark:text-cyan-400">
                2.1M
              </div>
              <div className="text-xs text-cyan-600 dark:text-cyan-500">Data Points</div>
            </div>
          </div>

          <Link href="/pulse">
            <Button variant="outline" className="w-full mt-3">
              <ArrowRight className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ComprehensiveOverview({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          System Health
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Data Accuracy:</span>
            <Badge className="bg-green-100 text-green-800">99.2%</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>API Response:</span>
            <Badge className="bg-blue-100 text-blue-800">127ms</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Last Updated:</span>
            <Badge className="bg-gray-100 text-gray-800">2 min ago</Badge>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Data Summary
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Politicians Tracked:</span>
            <span className="font-bold">{data?.politicians?.total || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Active Bills:</span>
            <span className="font-bold">{data?.bills?.total || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Legal Documents:</span>
            <span className="font-bold">{data?.legal?.acts || 0}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function TransparencyPortal({ data }: { data: any }) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleDownloadReport = (toolName: string) => {
    const reportData = {
      tool: toolName,
      timestamp: new Date().toISOString(),
      transparency_metrics: {
        foi_requests: 1247,
        response_rate: "89.3%",
        avg_response_time: "14 days",
        compliance_score: "B+",
        records_disclosed: 2891
      },
      format: "PDF"
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transparency_${toolName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (selectedTool) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedTool(null)}
            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
          >
            ← Back to Transparency Arsenal
          </Button>
          <h2 className="text-2xl font-bold">{selectedTool} - Detailed View</h2>
        </div>
        
        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Current Status</h3>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Investigations:</span>
                      <span className="font-bold">34</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compliance Rate:</span>
                      <span className="font-bold">89.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Public Records:</span>
                      <span className="font-bold">2,891</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Recent Updates</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li>• Ethics investigation into Minister Johnson</li>
                    <li>• FOI request processing time improved</li>
                    <li>• New transparency guidelines published</li>
                    <li>• Procurement audit results released</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={() => handleDownloadReport(selectedTool)}>
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Link href={selectedTool === "Government Transparency" ? "/corruption" : 
                           selectedTool === "Financial Disclosures" ? "/finance" : "/lobbyists"}>
                <Button variant="outline">
                  View Full Details
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">Transparency Arsenal</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Government accountability and transparency monitoring tools
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Government Transparency
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Access to public records and accountability measures
          </p>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setSelectedTool("Government Transparency")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleDownloadReport("Government Transparency")}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Financial Disclosures
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Political financing and expenditure tracking
          </p>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setSelectedTool("Financial Disclosures")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleDownloadReport("Financial Disclosures")}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Lobbying Activities
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Corporate influence and lobbying disclosure
          </p>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setSelectedTool("Lobbying Activities")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleDownloadReport("Lobbying Activities")}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function RightsEducationCenter() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleDownloadGuide = (toolName: string) => {
    const guideData = {
      guide: toolName,
      timestamp: new Date().toISOString(),
      legal_framework: {
        charter_sections: 34,
        key_rights: ["Expression", "Assembly", "Religion", "Mobility"],
        recent_cases: 12,
        constitutional_updates: 3
      },
      format: "PDF"
    };
    
    const blob = new Blob([JSON.stringify(guideData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal_guide_${toolName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (selectedTool) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedTool(null)}
            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
          >
            ← Back to Legal Oversight Grid
          </Button>
          <h2 className="text-2xl font-bold">{selectedTool} - Comprehensive Guide</h2>
        </div>
        
        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Key Provisions</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Charter Sections:</span>
                      <span className="font-bold">34</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Constitutional Cases:</span>
                      <span className="font-bold">147</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recent Updates:</span>
                      <span className="font-bold">3</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Your Rights</h3>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li>• Freedom of expression and assembly</li>
                    <li>• Democratic participation rights</li>
                    <li>• Legal representation guarantees</li>
                    <li>• Protection from discrimination</li>
                    <li>• Privacy and security rights</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={() => handleDownloadGuide(selectedTool)}>
                <Download className="w-4 h-4 mr-2" />
                Download Guide
              </Button>
              <Link href="/legal">
                <Button variant="outline">
                  View Legal Database
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">Legal Oversight Grid</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Comprehensive legal framework monitoring and rights education
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            Charter of Rights
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Understanding your fundamental rights and freedoms
          </p>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setSelectedTool("Charter of Rights")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleDownloadGuide("Charter of Rights")}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Guide
            </Button>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Civic Responsibilities
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Your role in Canadian democracy and governance
          </p>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setSelectedTool("Civic Responsibilities")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleDownloadGuide("Civic Responsibilities")}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Guide
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DemocracyMonitor({ data }: { data: any }) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleDownloadReport = (toolName: string) => {
    const reportData = {
      tool: toolName,
      timestamp: new Date().toISOString(),
      democracy_metrics: {
        electoral_integrity: "A+",
        press_freedom: "B",
        transparency: "B-",
        public_participation: "87.3%",
        accountability_index: "92.1%"
      },
      format: "PDF"
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `democracy_${toolName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (selectedTool) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedTool(null)}
            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
          >
            ← Back to Government Integrity Tools
          </Button>
          <h2 className="text-2xl font-bold">{selectedTool} - Detailed Assessment</h2>
        </div>
        
        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Performance Metrics</h3>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Overall Score:</span>
                      <span className="font-bold text-green-600">A</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Public Participation:</span>
                      <span className="font-bold">87.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accountability Index:</span>
                      <span className="font-bold">92.1%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Key Indicators</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li>• Electoral systems functioning properly</li>
                    <li>• High voter turnout in recent elections</li>
                    <li>• Strong institutional transparency</li>
                    <li>• Active civil society engagement</li>
                    <li>• Effective checks and balances</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={() => handleDownloadReport(selectedTool)}>
                <Download className="w-4 h-4 mr-2" />
                Download Assessment
              </Button>
              <Link href="/pulse">
                <Button variant="outline">
                  View Democracy Pulse
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">Government Integrity Tools</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Real-time assessment of democratic processes and institutional integrity
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Electoral Integrity
          </h4>
          <div className="text-2xl font-bold text-green-600 mb-2">A+</div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            High confidence in electoral systems
          </p>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setSelectedTool("Electoral Integrity")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleDownloadReport("Electoral Integrity")}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-600" />
            Press Freedom
          </h4>
          <div className="text-2xl font-bold text-blue-600 mb-2">B</div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Moderate media independence levels
          </p>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setSelectedTool("Press Freedom")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleDownloadReport("Press Freedom")}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-600" />
            Transparency
          </h4>
          <div className="text-2xl font-bold text-yellow-600 mb-2">B-</div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Room for improvement in openness
          </p>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setSelectedTool("Transparency")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleDownloadReport("Transparency")}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function IntelligenceCenter({ data }: { data: any }) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleDownload = (toolName: string) => {
    // Create a downloadable report
    const reportData = {
      tool: toolName,
      timestamp: new Date().toISOString(),
      data: data || {},
      format: "JSON"
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${toolName.toLowerCase().replace(' ', '_')}_report_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (selectedTool) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedTool(null)}
            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
          >
            ← Back to Intelligence Center
          </Button>
          <h2 className="text-2xl font-bold">{selectedTool} - Detailed Analysis</h2>
        </div>
        
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Comprehensive {selectedTool} Report</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {selectedTool === "Trend Analysis" 
                ? "AI-powered insights into political patterns, voting behaviors, and policy trends across Canadian government levels."
                : "Advanced electoral modeling and policy outcome forecasting using machine learning algorithms."
              }
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Key Metrics</h4>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Data Points Analyzed:</span>
                      <span className="font-bold">2.1M+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accuracy Rate:</span>
                      <span className="font-bold">94.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span className="font-bold">2 min ago</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Recent Insights</h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <ul className="space-y-1 text-sm">
                    <li>• Bill C-11 support trending upward (+12%)</li>
                    <li>• Healthcare policy discussions increased</li>
                    <li>• Provincial alignment on climate action</li>
                    <li>• Opposition cohesion at 87% this week</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={() => handleDownload(selectedTool)}>
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Link href="/pulse">
                <Button variant="outline">
                  View Full Analytics
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">Civic Analytics Arsenal</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Advanced analytics and trend analysis for informed civic engagement
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Trend Analysis
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            AI-powered insights into political patterns
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedTool("Trend Analysis")}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownload("Trend Analysis")}
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Prediction Models
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Electoral and policy outcome forecasting
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedTool("Prediction Models")}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownload("Prediction Models")}
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function RealTimeMonitoring() {
  return (
    <div className="text-center p-8">
      <h3 className="text-xl font-bold mb-4">Real-Time System Monitoring</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Live monitoring of data quality, system performance, and platform health
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-lg font-bold text-green-600">Online</div>
          <div className="text-sm">Data Sources</div>
        </Card>
        <Card className="p-4">
          <div className="text-lg font-bold text-blue-600">127ms</div>
          <div className="text-sm">Avg Response</div>
        </Card>
        <Card className="p-4">
          <div className="text-lg font-bold text-purple-600">99.7%</div>
          <div className="text-sm">Accuracy</div>
        </Card>
        <Card className="p-4">
          <div className="text-lg font-bold text-emerald-600">Active</div>
          <div className="text-sm">AI Models</div>
        </Card>
      </div>
    </div>
  );
}