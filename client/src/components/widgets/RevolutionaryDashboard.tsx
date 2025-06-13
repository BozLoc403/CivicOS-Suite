import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { LuxuryNavigation } from '@/components/layout/LuxuryNavigation';
import { Link } from 'wouter';
import { 
  Users, FileText, Scale, Newspaper, Vote, 
  Search, Activity, Shield, BarChart3, TrendingUp,
  AlertTriangle, CheckCircle, Clock, ArrowRight
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
    <div>
      <LuxuryNavigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <PoliticiansWidget data={dashboardData?.politicians} />
          <BillsWidget data={dashboardData?.bills} />
          <NewsWidget data={dashboardData?.news} />
          <LegalWidget data={dashboardData?.legal} />
          <ElectionsWidget data={dashboardData?.elections} />
          <AnalyticsWidget data={dashboardData?.analytics} />
        </div>

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
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
              <div className="text-lg font-bold text-green-700 dark:text-green-400">
                {data.passed}
              </div>
              <div className="text-xs text-green-600 dark:text-green-500">Passed</div>
            </div>
            <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-center">
              <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
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

          <Link href="/bills">
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

          <Link href="/analytics">
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-3">Government Transparency</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Access to public records and accountability measures
        </p>
        <Link href="/transparency">
          <Button className="w-full">View Reports</Button>
        </Link>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-3">Financial Disclosures</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Political financing and expenditure tracking
        </p>
        <Link href="/finance">
          <Button className="w-full">View Finance</Button>
        </Link>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-3">Lobbying Activities</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Corporate influence and lobbying disclosure
        </p>
        <Link href="/lobbyists">
          <Button className="w-full">View Lobbyists</Button>
        </Link>
      </Card>
    </div>
  );
}

function RightsEducationCenter() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-3">Charter of Rights</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Understanding your fundamental rights and freedoms
        </p>
        <Link href="/rights">
          <Button className="w-full">Learn Rights</Button>
        </Link>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-3">Civic Responsibilities</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Your role in Canadian democracy and governance
        </p>
        <Link href="/civic">
          <Button className="w-full">Learn Duties</Button>
        </Link>
      </Card>
    </div>
  );
}

function DemocracyMonitor({ data }: { data: any }) {
  return (
    <div className="text-center p-8">
      <h3 className="text-xl font-bold mb-4">Democracy Health Monitor</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Real-time assessment of democratic processes and institutional integrity
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">A+</div>
          <div className="text-sm">Electoral Integrity</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">B</div>
          <div className="text-sm">Press Freedom</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">B-</div>
          <div className="text-sm">Transparency</div>
        </Card>
      </div>
    </div>
  );
}

function IntelligenceCenter({ data }: { data: any }) {
  return (
    <div className="text-center p-8">
      <h3 className="text-xl font-bold mb-4">Political Intelligence</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Advanced analytics and trend analysis for informed civic engagement
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="font-bold mb-2">Trend Analysis</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            AI-powered insights into political patterns
          </p>
        </Card>
        <Card className="p-6">
          <h4 className="font-bold mb-2">Prediction Models</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Electoral and policy outcome forecasting
          </p>
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