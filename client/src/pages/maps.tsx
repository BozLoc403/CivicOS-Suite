import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, MapPin, Users, Activity, Building, Crown, Eye, BarChart3 } from "lucide-react";

export default function MapsPage() {
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [engagementType, setEngagementType] = useState("all");

  // Geographic engagement data across Canada
  const provincialEngagement = [
    {
      province: "British Columbia",
      abbreviation: "BC",
      population: 5214805,
      activeUsers: 78429,
      engagementRate: 1.5,
      topIssues: ["Housing Crisis", "Climate Change", "Healthcare"],
      recentActivity: 2847,
      politicalActivity: {
        discussions: 1204,
        petitions: 567,
        foiRequests: 89,
        votes: 987
      },
      demographics: {
        "18-34": 32,
        "35-54": 41,
        "55+": 27
      },
      urbanRural: {
        urban: 87,
        rural: 13
      }
    },
    {
      province: "Alberta",
      abbreviation: "AB", 
      population: 4428112,
      activeUsers: 52134,
      engagementRate: 1.2,
      topIssues: ["Energy Policy", "Healthcare", "Economy"],
      recentActivity: 1823,
      politicalActivity: {
        discussions: 789,
        petitions: 234,
        foiRequests: 67,
        votes: 733
      },
      demographics: {
        "18-34": 35,
        "35-54": 38,
        "55+": 27
      },
      urbanRural: {
        urban: 83,
        rural: 17
      }
    },
    {
      province: "Saskatchewan",
      abbreviation: "SK",
      population: 1196994,
      activeUsers: 8934,
      engagementRate: 0.7,
      topIssues: ["Agriculture", "Healthcare", "Infrastructure"],
      recentActivity: 412,
      politicalActivity: {
        discussions: 178,
        petitions: 89,
        foiRequests: 23,
        votes: 122
      },
      demographics: {
        "18-34": 28,
        "35-54": 42,
        "55+": 30
      },
      urbanRural: {
        urban: 66,
        rural: 34
      }
    },
    {
      province: "Manitoba",
      abbreviation: "MB",
      population: 1380935,
      activeUsers: 12847,
      engagementRate: 0.9,
      topIssues: ["Healthcare", "Indigenous Rights", "Economy"],
      recentActivity: 534,
      politicalActivity: {
        discussions: 234,
        petitions: 123,
        foiRequests: 34,
        votes: 143
      },
      demographics: {
        "18-34": 31,
        "35-54": 39,
        "55+": 30
      },
      urbanRural: {
        urban: 72,
        rural: 28
      }
    },
    {
      province: "Ontario",
      abbreviation: "ON",
      population: 15109293,
      activeUsers: 189234,
      engagementRate: 1.3,
      topIssues: ["Housing", "Healthcare", "Education"],
      recentActivity: 6847,
      politicalActivity: {
        discussions: 2934,
        petitions: 1456,
        foiRequests: 278,
        votes: 2179
      },
      demographics: {
        "18-34": 33,
        "35-54": 40,
        "55+": 27
      },
      urbanRural: {
        urban: 86,
        rural: 14
      }
    },
    {
      province: "Quebec",
      abbreviation: "QC",
      population: 8575779,
      activeUsers: 94567,
      engagementRate: 1.1,
      topIssues: ["Language Rights", "Healthcare", "Environment"],
      recentActivity: 3456,
      politicalActivity: {
        discussions: 1567,
        petitions: 789,
        foiRequests: 134,
        votes: 966
      },
      demographics: {
        "18-34": 29,
        "35-54": 41,
        "55+": 30
      },
      urbanRural: {
        urban: 81,
        rural: 19
      }
    }
  ];

  const cityEngagement = [
    {
      city: "Toronto",
      province: "ON",
      population: 2794356,
      activeUsers: 42847,
      engagementRate: 1.5,
      topIssues: ["Housing", "Transit", "Development"],
      politicalLean: "Progressive"
    },
    {
      city: "Montreal",
      province: "QC", 
      population: 1762949,
      activeUsers: 28934,
      engagementRate: 1.6,
      topIssues: ["Language", "Infrastructure", "Environment"],
      politicalLean: "Progressive"
    },
    {
      city: "Vancouver",
      province: "BC",
      population: 675218,
      activeUsers: 19456,
      engagementRate: 2.9,
      topIssues: ["Housing Crisis", "Climate", "Transit"],
      politicalLean: "Progressive"
    },
    {
      city: "Calgary",
      province: "AB",
      population: 1336000,
      activeUsers: 15678,
      engagementRate: 1.2,
      topIssues: ["Economy", "Energy", "Healthcare"],
      politicalLean: "Conservative"
    },
    {
      city: "Edmonton",
      province: "AB",
      population: 1010899,
      activeUsers: 11234,
      engagementRate: 1.1,
      topIssues: ["Healthcare", "Economy", "Education"],
      politicalLean: "Mixed"
    },
    {
      city: "Ottawa",
      province: "ON",
      population: 1017449,
      activeUsers: 23456,
      engagementRate: 2.3,
      topIssues: ["Government", "Transit", "Housing"],
      politicalLean: "Progressive"
    }
  ];

  const engagementMetrics = {
    totalActiveUsers: provincialEngagement.reduce((sum, p) => sum + p.activeUsers, 0),
    averageEngagement: 1.3,
    mostActiveProvince: "British Columbia",
    fastestGrowing: "Ontario",
    totalActivities: provincialEngagement.reduce((sum, p) => sum + p.recentActivity, 0)
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 2.0) return "text-green-600 bg-green-50";
    if (rate >= 1.0) return "text-blue-600 bg-blue-50";
    if (rate >= 0.5) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getPoliticalLeanColor = (lean: string) => {
    switch (lean) {
      case "Progressive": return "text-blue-600 bg-blue-50";
      case "Conservative": return "text-red-600 bg-red-50";
      case "Mixed": return "text-purple-600 bg-purple-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-CA').format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Civic Engagement Maps</h1>
          <p className="text-muted-foreground mt-2">
            Geographic visualization of democratic participation and political engagement across Canada
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <MapPin className="w-3 h-3 mr-1" />
            Geographic Data
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Users className="w-3 h-3 mr-1" />
            {formatNumber(engagementMetrics.totalActiveUsers)} Users
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="provincial" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="provincial">Provincial Overview</TabsTrigger>
          <TabsTrigger value="cities">Major Cities</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="trends">Engagement Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="provincial" className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                {provincialEngagement.map((province) => (
                  <SelectItem key={province.abbreviation} value={province.abbreviation}>
                    {province.province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={engagementType} onValueChange={setEngagementType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Engagement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="discussions">Discussions</SelectItem>
                <SelectItem value="petitions">Petitions</SelectItem>
                <SelectItem value="foi">FOI Requests</SelectItem>
                <SelectItem value="votes">Voting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {provincialEngagement.map((province) => (
              <Card key={province.abbreviation} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{province.province}</CardTitle>
                      <CardDescription>
                        Population: {formatNumber(province.population)}
                      </CardDescription>
                    </div>
                    <Badge className={getEngagementColor(province.engagementRate)}>
                      {province.engagementRate}% engaged
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Users</span>
                      <span className="font-bold text-blue-600">
                        {formatNumber(province.activeUsers)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Recent Activity</span>
                      <span className="font-bold text-green-600">
                        {formatNumber(province.recentActivity)}
                      </span>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Top Issues</div>
                      <div className="flex flex-wrap gap-1">
                        {province.topIssues.map((issue, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Activity Breakdown</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span>Discussions</span>
                          <span className="font-medium">{province.politicalActivity.discussions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Petitions</span>
                          <span className="font-medium">{province.politicalActivity.petitions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>FOI Requests</span>
                          <span className="font-medium">{province.politicalActivity.foiRequests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Votes</span>
                          <span className="font-medium">{province.politicalActivity.votes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cities" className="space-y-6">
          <div className="grid gap-4">
            {cityEngagement.map((city) => (
              <Card key={city.city} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{city.city}</h3>
                        <Badge variant="outline" className="text-xs">
                          {city.province}
                        </Badge>
                        <Badge className={getPoliticalLeanColor(city.politicalLean)}>
                          {city.politicalLean}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Population</div>
                          <div className="font-bold">{formatNumber(city.population)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Active Users</div>
                          <div className="font-bold text-blue-600">{formatNumber(city.activeUsers)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Engagement Rate</div>
                          <div className={`font-bold ${city.engagementRate >= 2.0 ? 'text-green-600' : city.engagementRate >= 1.0 ? 'text-blue-600' : 'text-yellow-600'}`}>
                            {city.engagementRate}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Top Issues</div>
                          <div className="flex flex-wrap gap-1">
                            {city.topIssues.slice(0, 2).map((issue, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Civic engagement by age group across Canada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">18-34 years</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{width: "32%"}}></div>
                      </div>
                      <span className="text-sm font-medium w-8">32%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">35-54 years</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{width: "40%"}}></div>
                      </div>
                      <span className="text-sm font-medium w-8">40%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">55+ years</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{width: "28%"}}></div>
                      </div>
                      <span className="text-sm font-medium w-8">28%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Urban vs Rural</CardTitle>
                <CardDescription>Geographic distribution of civic engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Urban Areas</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{width: "82%"}}></div>
                      </div>
                      <span className="text-sm font-medium w-8">82%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rural Areas</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{width: "18%"}}></div>
                      </div>
                      <span className="text-sm font-medium w-8">18%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Highest Engagement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">Vancouver</div>
                <p className="text-sm text-muted-foreground">
                  2.9% engagement rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Most Active Users</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-2">Ontario</div>
                <p className="text-sm text-muted-foreground">
                  {formatNumber(189234)} active users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span>Growth Leader</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-2">Quebec</div>
                <p className="text-sm text-muted-foreground">
                  +23% month-over-month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  <span>Total Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600 mb-2">{formatNumber(engagementMetrics.totalActivities)}</div>
                <p className="text-sm text-muted-foreground">
                  Democratic actions this month
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}