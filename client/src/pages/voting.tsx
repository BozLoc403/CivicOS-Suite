import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Vote, Calendar, CheckCircle, XCircle, Clock, Users, TrendingUp } from "lucide-react";

export default function VotingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Recent bills and voting records
  const activeBills = [
    {
      id: 1,
      billNumber: "C-18",
      title: "Online News Act",
      status: "Royal Assent",
      stage: "Complete",
      dateIntroduced: "2022-04-05",
      lastAction: "2023-06-22",
      sponsor: "Pablo Rodriguez",
      party: "Liberal",
      summary: "An Act respecting online communications platforms that make news content available to persons in Canada",
      votingRecord: {
        house: { yes: 170, no: 145, abstain: 3 },
        senate: { yes: 52, no: 16, abstain: 4 }
      },
      controversyLevel: "High",
      publicSupport: 45,
      keyProvisions: [
        "Requires digital platforms to compensate news publishers",
        "Establishes framework for mandatory bargaining",
        "Creates exemptions for smaller platforms"
      ]
    },
    {
      id: 2,
      billNumber: "C-11",
      title: "Online Streaming Act",
      status: "Royal Assent", 
      stage: "Complete",
      dateIntroduced: "2022-02-02",
      lastAction: "2023-04-27",
      sponsor: "Pablo Rodriguez",
      party: "Liberal",
      summary: "An Act to amend the Broadcasting Act and to make related and consequential amendments to other Acts",
      votingRecord: {
        house: { yes: 208, no: 117, abstain: 0 },
        senate: { yes: 43, no: 28, abstain: 1 }
      },
      controversyLevel: "High",
      publicSupport: 38,
      keyProvisions: [
        "Subjects streaming services to Canadian content requirements",
        "Expands CRTC authority over online platforms",
        "Promotes Indigenous and official language content"
      ]
    },
    {
      id: 3,
      billNumber: "C-27",
      title: "Digital Charter Implementation Act",
      status: "Committee Study",
      stage: "House Committee",
      dateIntroduced: "2022-06-16",
      lastAction: "2024-01-15",
      sponsor: "François-Philippe Champagne",
      party: "Liberal",
      summary: "An Act to enact the Consumer Privacy Protection Act, the Personal Information and Data Protection Tribunal Act and the Artificial Intelligence and Data Act",
      votingRecord: {
        house: { yes: null, no: null, abstain: null },
        senate: { yes: null, no: null, abstain: null }
      },
      controversyLevel: "Medium",
      publicSupport: 62,
      keyProvisions: [
        "Establishes new privacy rights for Canadians",
        "Creates AI governance framework",
        "Provides enforcement mechanisms for data protection"
      ]
    },
    {
      id: 4,
      billNumber: "C-26",
      title: "Budget Implementation Act, 2024, No. 1",
      status: "Royal Assent",
      stage: "Complete",
      dateIntroduced: "2024-04-30",
      lastAction: "2024-06-20",
      sponsor: "Chrystia Freeland",
      party: "Liberal",
      summary: "An Act to implement certain provisions of the budget tabled in Parliament on April 16, 2024",
      votingRecord: {
        house: { yes: 175, no: 147, abstain: 1 },
        senate: { yes: 57, no: 15, abstain: 0 }
      },
      controversyLevel: "Medium",
      publicSupport: 51,
      keyProvisions: [
        "Implements new housing measures",
        "Establishes digital services tax",
        "Enhances competition law enforcement"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Royal Assent": return "text-green-600 bg-green-50 border-green-200";
      case "Senate": return "text-blue-600 bg-blue-50 border-blue-200";
      case "Committee Study": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "First Reading": return "text-gray-600 bg-gray-50 border-gray-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getControversyColor = (level: string) => {
    switch (level) {
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateTotalVotes = (votingRecord: any, chamber: string) => {
    const votes = votingRecord[chamber];
    if (!votes.yes) return 0;
    return votes.yes + votes.no + votes.abstain;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Bills & Voting Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Live tracking of parliamentary bills, votes, and legislative progress
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Vote className="w-3 h-3 mr-1" />
            44th Parliament
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <FileText className="w-3 h-3 mr-1" />
            {activeBills.length} Active Bills
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="bills" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bills">Active Bills</TabsTrigger>
          <TabsTrigger value="votes">Recent Votes</TabsTrigger>
          <TabsTrigger value="analytics">Voting Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="bills" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search bills by number, title, or sponsor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Royal Assent">Royal Assent</SelectItem>
                <SelectItem value="Senate">Senate</SelectItem>
                <SelectItem value="Committee Study">Committee Study</SelectItem>
                <SelectItem value="First Reading">First Reading</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            {activeBills.map((bill) => (
              <Card key={bill.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">
                        Bill {bill.billNumber}: {bill.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Sponsored by {bill.sponsor} ({bill.party}) • Introduced {formatDate(bill.dateIntroduced)}
                      </CardDescription>
                      <div className="flex items-center space-x-2 mt-3">
                        <Badge className={getStatusColor(bill.status)}>
                          {bill.status === "Royal Assent" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {bill.status === "Committee Study" && <Clock className="w-3 h-3 mr-1" />}
                          {bill.status}
                        </Badge>
                        <Badge variant="outline">
                          Stage: {bill.stage}
                        </Badge>
                        <Badge variant="outline" className={getControversyColor(bill.controversyLevel)}>
                          {bill.controversyLevel} Controversy
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {bill.publicSupport}%
                      </div>
                      <div className="text-sm text-muted-foreground">Public Support</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Bill Summary</div>
                      <p className="text-sm">{bill.summary}</p>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Key Provisions</div>
                      <ul className="text-sm space-y-1">
                        {bill.keyProvisions.map((provision, index) => (
                          <li key={index} className="text-muted-foreground">• {provision}</li>
                        ))}
                      </ul>
                    </div>

                    {bill.votingRecord.house.yes && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Voting Results</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-muted/50 p-3 rounded">
                            <div className="text-sm font-medium mb-2">House of Commons</div>
                            <div className="flex items-center space-x-4 text-xs">
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span>Yes: {bill.votingRecord.house.yes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <XCircle className="w-3 h-3 text-red-600" />
                                <span>No: {bill.votingRecord.house.no}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-gray-600" />
                                <span>Abstain: {bill.votingRecord.house.abstain}</span>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Total: {calculateTotalVotes(bill.votingRecord, 'house')} MPs
                            </div>
                          </div>
                          <div className="bg-muted/50 p-3 rounded">
                            <div className="text-sm font-medium mb-2">Senate</div>
                            <div className="flex items-center space-x-4 text-xs">
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span>Yes: {bill.votingRecord.senate.yes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <XCircle className="w-3 h-3 text-red-600" />
                                <span>No: {bill.votingRecord.senate.no}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-gray-600" />
                                <span>Abstain: {bill.votingRecord.senate.abstain}</span>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Total: {calculateTotalVotes(bill.votingRecord, 'senate')} Senators
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Last Action</div>
                        <div className="text-sm">{formatDate(bill.lastAction)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Current Stage</div>
                        <div className="text-sm">{bill.stage}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t mt-4">
                    <div className="flex items-center space-x-2">
                      <Vote className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Bill {bill.billNumber} • {bill.party} Government Bill
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Full Text
                      </Button>
                      <Button variant="outline" size="sm">
                        Voting Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="votes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Parliamentary Votes</CardTitle>
              <CardDescription>
                Latest voting records from House of Commons and Senate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Vote className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Recent voting records will be displayed here.</p>
                <p className="text-sm">Detailed breakdown of MP and Senator voting patterns.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Active Bills</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">47</div>
                <p className="text-sm text-muted-foreground">
                  Bills in current session
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Passed Bills</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">23</div>
                <p className="text-sm text-muted-foreground">
                  Received Royal Assent
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>Avg Attendance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">84%</div>
                <p className="text-sm text-muted-foreground">
                  MP voting participation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <span>Party Unity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 mb-2">91%</div>
                <p className="text-sm text-muted-foreground">
                  Average party discipline
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}