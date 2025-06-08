import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, FileText, Scale, Newspaper, Vote, 
  Search, Activity, Shield, BarChart3
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
        </div>
      </CardContent>
    </Card>
  );
}

function LegalWidget({ data }: { data: any }) {
  if (!data) return null;

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Scale className="w-5 h-5 text-purple-600" />
          Legal Database
          <Badge variant="secondary" className="ml-auto">{parseInt(data.acts) + parseInt(data.cases)}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="text-xl font-bold text-purple-700 dark:text-purple-400">
                {data.acts}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-500">Legal Acts</div>
            </div>
            <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
              <div className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                {data.cases}
              </div>
              <div className="text-xs text-indigo-600 dark:text-indigo-500">Court Cases</div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div className="text-xl font-bold text-slate-700 dark:text-slate-400">
              {data.criminalSections}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-500">Criminal Code Sections</div>
          </div>
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
          Elections & Democracy
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
              <div className="text-xs text-green-600 dark:text-green-500">Active Elections</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
                {data.upcoming}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-500">Upcoming Elections</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsWidget({ data }: { data: any }) {
  if (!data) return null;

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          Analytics & Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
            <div className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
              Political Landscape
            </div>
            <div className="text-xs text-indigo-600 dark:text-indigo-500">
              {data?.politicalLandscape?.partyDistribution?.length || 0} parties tracked
            </div>
          </div>
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="text-sm font-medium text-green-700 dark:text-green-400">
              Legislative Analytics
            </div>
            <div className="text-xs text-green-600 dark:text-green-500">
              {data?.legislativeAnalytics?.billsByCategory?.length || 0} categories analyzed
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ComprehensiveOverview({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Status</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}

function TransparencyPortal({ data }: { data: any }) {
  return (
    <div className="text-center p-8">
      <h3 className="text-xl font-bold mb-4">Transparency Portal</h3>
      <p className="text-slate-600 dark:text-slate-400">
        Access to government transparency data and accountability metrics.
      </p>
    </div>
  );
}

function RightsEducationCenter() {
  return (
    <div className="text-center p-8">
      <h3 className="text-xl font-bold mb-4">Rights Education Center</h3>
      <p className="text-slate-600 dark:text-slate-400">
        Educational resources about Canadian rights and civic responsibilities.
      </p>
    </div>
  );
}

function DemocracyMonitor({ data }: { data: any }) {
  return (
    <div className="text-center p-8">
      <h3 className="text-xl font-bold mb-4">Democracy Monitor</h3>
      <p className="text-slate-600 dark:text-slate-400">
        Real-time monitoring of democratic processes and participation.
      </p>
    </div>
  );
}

function IntelligenceCenter({ data }: { data: any }) {
  return (
    <div className="text-center p-8">
      <h3 className="text-xl font-bold mb-4">Intelligence Center</h3>
      <p className="text-slate-600 dark:text-slate-400">
        Advanced analytics and insights into political trends.
      </p>
    </div>
  );
}

function RealTimeMonitoring() {
  return (
    <div className="text-center p-8">
      <h3 className="text-xl font-bold mb-4">Real-Time Monitoring</h3>
      <p className="text-slate-600 dark:text-slate-400">
        Live system performance and data quality metrics.
      </p>
    </div>
  );
}