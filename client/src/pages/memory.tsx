import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Clock, AlertTriangle, Search, Calendar, Archive } from "lucide-react";

export default function MemoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTimeframe, setFilterTimeframe] = useState("all");

  // Political memory tracking - promises vs actions
  const politicalMemoryData = [
    {
      id: 1,
      politician: "Justin Trudeau",
      party: "Liberal",
      promise: "Electoral Reform - Implement proportional representation",
      datePromised: "2015-08-02",
      context: "Federal Election Campaign",
      status: "Broken",
      actualOutcome: "Abandoned after consultations in 2017",
      reasoning: "Lack of consensus on preferred system",
      impactScore: 8.5,
      publicReaction: "Significant backlash from reform advocates",
      mediaAttention: "High",
      followUpActions: "None - topic avoided in subsequent campaigns"
    },
    {
      id: 2,
      politician: "Pierre Poilievre", 
      party: "Conservative",
      promise: "Fire the Bank of Canada Governor",
      datePromised: "2022-05-10",
      context: "Conservative Leadership Campaign",
      status: "Pending",
      actualOutcome: "Position softened after becoming leader",
      reasoning: "Constitutional and practical limitations acknowledged",
      impactScore: 6.2,
      publicReaction: "Mixed - supporters approve, economists concerned",
      mediaAttention: "High",
      followUpActions: "Shifted to criticizing monetary policy instead"
    },
    {
      id: 3,
      politician: "Jagmeet Singh",
      party: "NDP",
      promise: "Universal Pharmacare by 2020",
      datePromised: "2019-09-11",
      context: "Federal Election Campaign",
      status: "Partially Kept",
      actualOutcome: "Limited dental and pharmacare programs launched",
      reasoning: "Negotiated through supply and confidence agreement",
      impactScore: 7.1,
      publicReaction: "Positive but incomplete",
      mediaAttention: "Moderate",
      followUpActions: "Continues to push for full implementation"
    },
    {
      id: 4,
      politician: "Doug Ford",
      party: "Progressive Conservative",
      promise: "Buck-a-beer pricing",
      datePromised: "2018-06-29",
      context: "Ontario Provincial Election",
      status: "Failed",
      actualOutcome: "Few breweries participated, minimal impact",
      reasoning: "Market forces and production costs",
      impactScore: 3.2,
      publicReaction: "Mostly ridiculed as gimmick",
      mediaAttention: "High initially, then mocked",
      followUpActions: "Quietly dropped from messaging"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Kept": return "text-green-600 bg-green-50 border-green-200";
      case "Partially Kept": return "text-blue-600 bg-blue-50 border-blue-200";
      case "Broken": return "text-red-600 bg-red-50 border-red-200";
      case "Pending": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Failed": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getImpactColor = (score: number) => {
    if (score >= 8) return "text-red-600";
    if (score >= 6) return "text-yellow-600";
    if (score >= 4) return "text-blue-600";
    return "text-green-600";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const timeSincePromise = (dateString: string) => {
    const promiseDate = new Date(dateString);
    const now = new Date();
    const years = now.getFullYear() - promiseDate.getFullYear();
    const months = now.getMonth() - promiseDate.getMonth();
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor((now.getTime() - promiseDate.getTime()) / (1000 * 60 * 60 * 24));
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Political Memory Bank</h1>
          <p className="text-muted-foreground mt-2">
            Track campaign promises, policy reversals, and political accountability over time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Brain className="w-3 h-3 mr-1" />
            Memory Tracking
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="promises" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="promises">Promise Tracker</TabsTrigger>
          <TabsTrigger value="reversals">Policy Reversals</TabsTrigger>
          <TabsTrigger value="accountability">Accountability Score</TabsTrigger>
        </TabsList>

        <TabsContent value="promises" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search promises, politicians, or policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterTimeframe} onValueChange={setFilterTimeframe}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="current">Current Term</SelectItem>
                <SelectItem value="last-election">Last Election</SelectItem>
                <SelectItem value="last-5-years">Last 5 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            {politicalMemoryData.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{item.promise}</CardTitle>
                      <CardDescription className="mt-1">
                        {item.politician} ({item.party}) • {item.context}
                      </CardDescription>
                      <div className="flex items-center space-x-2 mt-3">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <Badge variant="outline">
                          <Calendar className="w-3 h-3 mr-1" />
                          {timeSincePromise(item.datePromised)}
                        </Badge>
                        <Badge variant="outline">
                          Impact: {item.impactScore}/10
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getImpactColor(item.impactScore)}`}>
                        {item.impactScore}
                      </div>
                      <div className="text-sm text-muted-foreground">Impact Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Date Promised</div>
                        <div className="text-sm">{formatDate(item.datePromised)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Media Attention</div>
                        <div className="text-sm">{item.mediaAttention}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">What Actually Happened</div>
                      <div className="text-sm bg-muted/50 p-3 rounded">
                        <p className="mb-2"><strong>Outcome:</strong> {item.actualOutcome}</p>
                        <p className="mb-2"><strong>Reasoning:</strong> {item.reasoning}</p>
                        <p><strong>Public Reaction:</strong> {item.publicReaction}</p>
                      </div>
                    </div>

                    {item.followUpActions && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Follow-up Actions</div>
                        <div className="text-sm">{item.followUpActions}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t mt-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Promised {timeSincePromise(item.datePromised)}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Timeline
                      </Button>
                      <Button variant="outline" size="sm">
                        <Archive className="w-3 h-3 mr-2" />
                        Archive Sources
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reversals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Reversal Timeline</CardTitle>
              <CardDescription>
                Track when politicians change their positions on key issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Policy reversal tracking coming soon.</p>
                <p className="text-sm">This will show position changes over time with evidence.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accountability" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span>Promises Tracked</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">2,847</div>
                <p className="text-sm text-muted-foreground">
                  Campaign promises since 2015
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Broken Promises</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 mb-2">387</div>
                <p className="text-sm text-muted-foreground">
                  Documented promise breaks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span>Avg. Follow-through</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">68%</div>
                <p className="text-sm text-muted-foreground">
                  Promises kept or partially kept
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}