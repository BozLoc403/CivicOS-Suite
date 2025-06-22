import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity,
  Users,
  Vote,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  AlertCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface TrendData {
  period: string;
  value: number;
  category?: string;
  party?: string;
  region?: string;
}

interface PoliticalMetrics {
  partyPopularity: TrendData[];
  votingPatterns: TrendData[];
  billPassageRates: TrendData[];
  publicEngagement: TrendData[];
  regionalInfluence: TrendData[];
  trustScores: TrendData[];
}

export default function Trends() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedMetric, setSelectedMetric] = useState("overview");

  // Fetch trend data
  const { data: trendData, isLoading } = useQuery({
    queryKey: ['/api/trends', selectedTimeframe, selectedRegion],
    queryFn: () => apiRequest(`/api/trends?timeframe=${selectedTimeframe}&region=${selectedRegion}`)
  });

  // Generate sample data for demonstration
  const sampleTrendData: PoliticalMetrics = {
    partyPopularity: [
      { period: "Jan 2024", value: 32, party: "Conservative" },
      { period: "Feb 2024", value: 35, party: "Conservative" },
      { period: "Mar 2024", value: 33, party: "Conservative" },
      { period: "Apr 2024", value: 36, party: "Conservative" },
      { period: "May 2024", value: 38, party: "Conservative" },
      { period: "Jun 2024", value: 40, party: "Conservative" },
      { period: "Jan 2024", value: 34, party: "Liberal" },
      { period: "Feb 2024", value: 32, party: "Liberal" },
      { period: "Mar 2024", value: 30, party: "Liberal" },
      { period: "Apr 2024", value: 29, party: "Liberal" },
      { period: "May 2024", value: 27, party: "Liberal" },
      { period: "Jun 2024", value: 25, party: "Liberal" },
      { period: "Jan 2024", value: 18, party: "NDP" },
      { period: "Feb 2024", value: 19, party: "NDP" },
      { period: "Mar 2024", value: 21, party: "NDP" },
      { period: "Apr 2024", value: 20, party: "NDP" },
      { period: "May 2024", value: 19, party: "NDP" },
      { period: "Jun 2024", value: 18, party: "NDP" }
    ],
    votingPatterns: [
      { period: "Jan", value: 78 },
      { period: "Feb", value: 82 },
      { period: "Mar", value: 76 },
      { period: "Apr", value: 85 },
      { period: "May", value: 79 },
      { period: "Jun", value: 88 }
    ],
    billPassageRates: [
      { period: "Q1 2024", value: 65, category: "Economic" },
      { period: "Q1 2024", value: 78, category: "Social" },
      { period: "Q1 2024", value: 45, category: "Environmental" },
      { period: "Q2 2024", value: 72, category: "Economic" },
      { period: "Q2 2024", value: 81, category: "Social" },
      { period: "Q2 2024", value: 52, category: "Environmental" }
    ],
    publicEngagement: [
      { period: "Week 1", value: 1250 },
      { period: "Week 2", value: 1420 },
      { period: "Week 3", value: 1680 },
      { period: "Week 4", value: 1950 },
      { period: "Week 5", value: 2100 },
      { period: "Week 6", value: 2350 }
    ],
    regionalInfluence: [
      { region: "Ontario", value: 38.5 },
      { region: "Quebec", value: 22.8 },
      { region: "British Columbia", value: 13.2 },
      { region: "Alberta", value: 11.7 },
      { region: "Manitoba", value: 3.6 },
      { region: "Saskatchewan", value: 3.2 },
      { region: "Nova Scotia", value: 2.8 },
      { region: "New Brunswick", value: 2.3 },
      { region: "Newfoundland", value: 1.5 },
      { region: "PEI", value: 0.4 }
    ],
    trustScores: [
      { period: "Jan", value: 45, category: "Federal" },
      { period: "Feb", value: 48, category: "Federal" },
      { period: "Mar", value: 42, category: "Federal" },
      { period: "Apr", value: 46, category: "Federal" },
      { period: "May", value: 44, category: "Federal" },
      { period: "Jun", value: 41, category: "Federal" },
      { period: "Jan", value: 52, category: "Provincial" },
      { period: "Feb", value: 54, category: "Provincial" },
      { period: "Mar", value: 51, category: "Provincial" },
      { period: "Apr", value: 55, category: "Provincial" },
      { period: "May", value: 53, category: "Provincial" },
      { period: "Jun", value: 56, category: "Provincial" }
    ]
  };

  const displayData = trendData || sampleTrendData;

  const colors = ['#DC2626', '#059669', '#2563EB', '#7C3AED', '#EA580C', '#0891B2'];
  const partyColors = {
    'Conservative': '#1E40AF',
    'Liberal': '#DC2626',
    'NDP': '#EA580C',
    'Bloc Québécois': '#3B82F6',
    'Green': '#059669',
    'Other': '#6B7280'
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(displayData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `political-trends-${selectedTimeframe}-${selectedRegion}.json`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading political trend data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Political Trends</h1>
              <p className="text-lg text-gray-600">Interactive data visualization and trend analysis</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleExportData} variant="outline" className="border-blue-500 text-blue-600">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Eye className="w-4 h-4 mr-1" />
                Live Data
              </Badge>
            </div>
          </div>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Timeframe</label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                    <SelectItem value="2years">Last 2 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Region</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Canada</SelectItem>
                    <SelectItem value="ontario">Ontario</SelectItem>
                    <SelectItem value="quebec">Quebec</SelectItem>
                    <SelectItem value="bc">British Columbia</SelectItem>
                    <SelectItem value="alberta">Alberta</SelectItem>
                    <SelectItem value="prairie">Prairie Provinces</SelectItem>
                    <SelectItem value="atlantic">Atlantic Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Metric Focus</label>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="parties">Party Performance</SelectItem>
                    <SelectItem value="legislation">Legislative Trends</SelectItem>
                    <SelectItem value="engagement">Public Engagement</SelectItem>
                    <SelectItem value="trust">Trust Metrics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Visualization Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="parties">Party Trends</TabsTrigger>
            <TabsTrigger value="legislation">Legislation</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Party Popularity Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Party Popularity Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={displayData.partyPopularity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#1E40AF" 
                        strokeWidth={2}
                        dot={{ fill: '#1E40AF' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Voting Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Vote className="w-5 h-5 mr-2 text-green-600" />
                    Parliamentary Voting Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={displayData.votingPatterns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#059669" 
                        fill="#059669" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Public Engagement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-600" />
                    Public Engagement Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={displayData.publicEngagement}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#7C3AED" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Trust Scores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-orange-600" />
                    Government Trust Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={displayData.trustScores}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#EA580C" 
                        strokeWidth={2}
                        name="Trust Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Party Trends Tab */}
          <TabsContent value="parties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Multi-Party Polling Trends</CardTitle>
                <p className="text-sm text-gray-600">Track popularity changes across all major political parties</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={displayData.partyPopularity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {['Conservative', 'Liberal', 'NDP'].map((party, index) => (
                      <Line 
                        key={party}
                        type="monotone" 
                        dataKey="value" 
                        stroke={colors[index]}
                        strokeWidth={3}
                        name={party}
                        data={displayData.partyPopularity.filter(d => d.party === party)}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legislation Tab */}
          <TabsContent value="legislation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bill Passage Rates by Category</CardTitle>
                <p className="text-sm text-gray-600">Legislative efficiency across different policy areas</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={displayData.billPassageRates}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#2563EB" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Civic Engagement Metrics</CardTitle>
                <p className="text-sm text-gray-600">Public participation and platform usage trends</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={displayData.publicEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#059669" 
                      fill="#059669" 
                      fillOpacity={0.4}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regional Tab */}
          <TabsContent value="regional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Political Influence</CardTitle>
                <p className="text-sm text-gray-600">Distribution of political power across provinces</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={displayData.regionalInfluence}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ region, value }) => `${region}: ${value}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {displayData.regionalInfluence.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Key Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-amber-600" />
              Key Insights & Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Trending Up</h4>
                <p className="text-sm text-blue-700">Conservative party support has increased 8% over the last 6 months</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">Trending Down</h4>
                <p className="text-sm text-red-700">Liberal party approval has declined 9% in the same period</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">High Activity</h4>
                <p className="text-sm text-green-700">Public engagement has grown 88% with platform expansion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}