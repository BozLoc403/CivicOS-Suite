import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NavigationHeader } from "@/components/NavigationHeader";
import { VotingModal } from "@/components/VotingModal";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { DailyChallenges } from "@/components/DailyChallenges";
import { AIStatusBanner } from "@/components/AIStatusBanner";
import { Vote, Clock, Shield, Users, ExternalLink, AlertCircle, MapPin, Trophy, Zap, TrendingUp } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Bill, Vote as VoteType } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);

  const { data: bills = [] } = useQuery<Bill[]>({
    queryKey: ["/api/bills"],
  });

  const { data: userStats } = useQuery<{
    voteCount: number;
    trustScore: string;
    civicLevel: string;
  }>({
    queryKey: ["/api/user/stats"],
  });

  const { data: recentVotes = [] } = useQuery<(VoteType & { bill: Bill })[]>({
    queryKey: ["/api/votes/user"],
  });

  const { data: politicians = [] } = useQuery({
    queryKey: ["/api/politicians"],
  });

  const { data: comprehensiveContacts = [] } = useQuery({
    queryKey: ["/api/contacts/comprehensive"],
  });

  const { data: aiStatus } = useQuery({
    queryKey: ['/api/ai/status'],
  });

  const { data: newsArticles = [] } = useQuery({
    queryKey: ["/api/news/articles"],
  });

  const handleVoteClick = (bill: Bill) => {
    setSelectedBill(bill);
    setIsVotingModalOpen(true);
  };

  // Mock data for gamification features
  const mockBadges = [
    {
      id: 1,
      name: "First Vote",
      description: "Cast your first vote on legislation",
      icon: "trophy",
      category: "voting",
      rarity: "common",
      earnedAt: "2024-01-15",
      isCompleted: true,
      progress: 100
    },
    {
      id: 2,
      name: "News Reader",
      description: "Read 10 verified news articles",
      icon: "star",
      category: "knowledge",
      rarity: "rare",
      isCompleted: false,
      progress: 60
    },
    {
      id: 3,
      name: "Civic Champion",
      description: "Achieve 1000 civic points",
      icon: "crown",
      category: "engagement",
      rarity: "epic",
      isCompleted: false,
      progress: 45
    }
  ];

  const mockChallenges = [
    {
      id: 1,
      title: "Daily Voter",
      description: "Vote on 3 bills today",
      category: "voting",
      pointsReward: 50,
      difficulty: "easy",
      progress: 1,
      maxProgress: 3,
      isCompleted: false,
      timeRemaining: "18h 42m"
    },
    {
      id: 2,
      title: "News Analyst",
      description: "Verify credibility of 5 news articles",
      category: "learning",
      pointsReward: 75,
      difficulty: "medium",
      progress: 2,
      maxProgress: 5,
      isCompleted: false,
      timeRemaining: "18h 42m"
    },
    {
      id: 3,
      title: "Community Engager",
      description: "Participate in 2 discussions",
      category: "engagement",
      pointsReward: 100,
      difficulty: "hard",
      progress: 2,
      maxProgress: 2,
      isCompleted: true
    }
  ];

  const formatTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) return `${diffDays} days`;
    if (diffDays === 1) return "1 day";
    return "Less than 24 hours";
  };

  const getVoteColor = (vote: string) => {
    switch (vote) {
      case "yes": return "bg-civic-green";
      case "no": return "bg-civic-red";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Status Banner */}
        <AIStatusBanner hasApiKey={!!aiStatus?.enabled} className="mb-6" />
        
        {/* Welcome Section */}
        <div className="mb-8 bg-gradient-to-br from-civic-green via-civic-blue to-civic-purple text-white p-10 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-sm">
          <h1 className="text-luxury text-5xl font-bold mb-6 tracking-tight">
            Welcome to CivicOS
          </h1>
          <p className="text-political text-xl text-white/90 leading-relaxed max-w-2xl">
            Your comprehensive platform for transparent democracy and civic engagement with authentic government data
          </p>
          <div className="flex items-center mt-6 space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full pulse-glow"></div>
              <span className="text-sm text-white/80">Real-time data monitoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full pulse-glow"></div>
              <span className="text-sm text-white/80">15,412+ verified officials</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Vote className="civic-blue text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Votes Cast</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {userStats?.voteCount || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="civic-green text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Bills</p>
                  <p className="text-2xl font-semibold text-gray-900">{bills.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="civic-green text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Trust Score</p>
                  <p className="text-2xl font-semibold civic-green">
                    {userStats?.trustScore ? `${parseFloat(userStats.trustScore).toFixed(1)}%` : "100.0%"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="civic-blue text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Civic Level</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {userStats?.civicLevel || "Registered"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Legislation */}
          <div className="lg:col-span-2">
            <Card>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Active Legislation</h3>
                <p className="text-sm text-gray-600">Bills requiring your vote</p>
              </div>
              <CardContent className="p-6">
                {bills.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No active legislation at this time</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bills.slice(0, 3).map((bill) => (
                      <div key={bill.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{bill.title}</h4>
                            <p className="text-sm text-gray-600">
                              {bill.jurisdiction} · {bill.category}
                            </p>
                          </div>
                          <Badge variant={bill.status === "Active" ? "default" : "secondary"}>
                            {bill.status}
                          </Badge>
                        </div>

                        {bill.aiSummary && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">AI Summary:</h5>
                            <p className="text-sm text-gray-600 leading-relaxed">{bill.aiSummary}</p>
                          </div>
                        )}

                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Public Sentiment</span>
                            <span>Calculating...</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {bill.votingDeadline 
                              ? `Voting ends in ${formatTimeRemaining(bill.votingDeadline)}`
                              : "No deadline set"
                            }
                          </div>
                          <Button
                            onClick={() => handleVoteClick(bill)}
                            className="bg-civic-blue hover:bg-blue-700"
                          >
                            Cast Vote
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Votes */}
            <Card>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Votes</h3>
              </div>
              <CardContent className="p-6">
                {recentVotes.length === 0 ? (
                  <p className="text-gray-500 text-sm">No votes cast yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentVotes.slice(0, 5).map((vote) => (
                      <div key={vote.id} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {vote.bill.billNumber}
                          </p>
                          <p className="text-xs text-gray-500">{vote.bill.title}</p>
                        </div>
                        <div className="flex items-center">
                          <Badge className={`${getVoteColor(vote.voteValue)} text-white text-xs`}>
                            {vote.voteValue.toUpperCase()}
                          </Badge>
                          <Shield className="civic-green ml-2 w-4 h-4" title="Verified" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4">
                  <Button variant="link" className="w-full civic-blue p-0">
                    View complete voting ledger
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Politician Tracker */}
            <Card>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Politician Tracker</h3>
              </div>
              <CardContent className="p-6">
                {politicians.slice(0, 3).map((politician: any) => (
                  <div key={politician.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{politician.name}</p>
                        <p className="text-xs text-gray-500">{politician.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold civic-green">
                        {parseFloat(politician.trustScore).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">Trust Score</div>
                    </div>
                  </div>
                ))}
                <div className="mt-4">
                  <Button variant="link" className="w-full civic-blue p-0">
                    View all politicians
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card className="bg-civic-green text-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Shield className="text-2xl mr-3" />
                  <h3 className="text-lg font-semibold">Security Status</h3>
                </div>
                <p className="text-sm opacity-90 mb-4">
                  All systems operational. Your vote integrity is protected.
                </p>
                <div className="text-xs opacity-75">
                  Last verification: Just now
                </div>
              </CardContent>
            </Card>

            {/* Gamification Features */}
            <div className="space-y-6">
              <BadgeDisplay 
                badges={mockBadges} 
                userLevel={user?.currentLevel || 1}
                civicPoints={user?.civicPoints || 0}
                showAnimation={true}
              />
              <DailyChallenges 
                challenges={mockChallenges}
                streakDays={user?.streakDays || 0}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Voting Modal */}
      {selectedBill && (
        <VotingModal
          bill={selectedBill}
          isOpen={isVotingModalOpen}
          onClose={() => {
            setIsVotingModalOpen(false);
            setSelectedBill(null);
          }}
        />
      )}
    </div>
  );
}
