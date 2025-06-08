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
import LegalUpdatesWidget from "@/components/widgets/LegalUpdatesWidget";
import PoliticiansWidget from "@/components/widgets/PoliticiansWidget";
import NewsAnalysisWidget from "@/components/widgets/NewsAnalysisWidget";
import BillsVotingWidget from "@/components/widgets/BillsVotingWidget";
import PetitionsWidget from "@/components/widgets/PetitionsWidget";
import { LegalSystemWidget } from "@/components/widgets/LegalSystemWidget";
import { Vote, Clock, Shield, Users, ExternalLink, AlertCircle, MapPin, Trophy, Zap, TrendingUp, BarChart3, Globe, MessageSquare, Calendar, FileText } from "lucide-react";
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

  // Daily challenges data
  const dailyChallenges = [
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

        {/* Comprehensive Auto-Updating Widgets Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Column 1: Bills & Voting */}
          <div className="space-y-6">
            <BillsVotingWidget />
            <LegalUpdatesWidget />
          </div>

          {/* Column 2: Petitions & Politicians */}
          <div className="space-y-6">
            <PetitionsWidget />
            <PoliticiansWidget />
          </div>

          {/* Column 3: News & Analysis */}
          <div className="space-y-6">
            <NewsAnalysisWidget />
            
            {/* Quick Action Cards */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Globe className="h-4 w-4 mr-2" />
                    Explore Maps
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Join Discussions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Civic Achievements */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Vote className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">First Vote Cast</p>
                      <p className="text-xs text-gray-500">+50 Civic Points</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Petition Signed</p>
                      <p className="text-xs text-gray-500">+25 Civic Points</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Trust Score Rising</p>
                      <p className="text-xs text-gray-500">Top 10% Civic Engagement</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Daily Challenges Section */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Today's Civic Challenges
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dailyChallenges.map((challenge) => (
                  <div key={challenge.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={challenge.isCompleted ? "default" : "secondary"}>
                        {challenge.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{challenge.pointsReward} pts</span>
                    </div>
                    <h4 className="font-medium mb-1">{challenge.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(challenge.progress / challenge.maxProgress) * 100} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {challenge.isCompleted ? (
                        <Badge variant="default" className="text-xs">Completed</Badge>
                      ) : (
                        <span className="text-xs text-gray-500">
                          {challenge.timeRemaining || "No deadline"}
                        </span>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
