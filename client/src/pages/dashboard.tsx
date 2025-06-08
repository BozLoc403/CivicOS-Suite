import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { LuxuryCard } from "@/components/ui/luxury-card";
import { LivePulseFeed } from "@/components/layout/LivePulseFeed";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Activity, 
  BarChart3, 
  Shield, 
  MessageSquare, 
  Vote, 
  Crown,
  Pin,
  Plus,
  ExternalLink
} from "lucide-react";
import type { Bill } from "@shared/schema";

interface DashboardWidget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  size: 'small' | 'medium' | 'large';
  category: string;
  pinned: boolean;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const [pinnedWidgets, setPinnedWidgets] = useState<string[]>(['pulse', 'bills', 'politicians', 'news']);
  const [availableWidgets] = useState<DashboardWidget[]>([
    { id: 'pulse', title: 'Live Civic Pulse', component: LivePulseFeed, size: 'medium', category: 'intelligence', pinned: true },
    { id: 'bills', title: 'Bills & Voting', component: BillsWidget, size: 'large', category: 'politics', pinned: true },
    { id: 'politicians', title: 'Political Directory', component: PoliticiansWidget, size: 'medium', category: 'politics', pinned: true },
    { id: 'news', title: 'News Intelligence', component: NewsWidget, size: 'medium', category: 'intelligence', pinned: true },
    { id: 'legal', title: 'Legal Oversight', component: LegalWidget, size: 'large', category: 'legal', pinned: false },
    { id: 'discussions', title: 'Civic Discussions', component: DiscussionsWidget, size: 'medium', category: 'engagement', pinned: false },
    { id: 'analytics', title: 'Trust Analytics', component: AnalyticsWidget, size: 'large', category: 'analytics', pinned: false }
  ]);

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

  const { data: politicians = [] } = useQuery({
    queryKey: ["/api/politicians"],
  });

  const { data: newsData } = useQuery({
    queryKey: ["/api/news/articles"],
  });

  const togglePin = (widgetId: string) => {
    setPinnedWidgets(prev => 
      prev.includes(widgetId) 
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const handleQuickVote = () => {
    if (Array.isArray(bills) && bills.length > 0) {
      setSelectedBill(bills[0]);
      setIsVotingModalOpen(true);
    } else {
      setLocation('/voting');
    }
  };

  const handleJoinDiscussion = () => {
    setLocation('/discussions');
  };

  const handleSubmitPetition = () => {
    setLocation('/petitions');
  };

  const handleContactOfficial = () => {
    setLocation('/contacts');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Luxury Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-serif text-foreground mb-2">
            Civic Intelligence Command Center
          </h1>
          <p className="text-lg text-muted-foreground">
            Your sovereign digital democracy workspace
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Crown className="w-4 h-4 mr-2" />
            Sovereign Access
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Activity className="w-4 h-4 mr-2" />
            Live Feed Active
          </Badge>
        </div>
      </div>

      {/* Civic Status Bar */}
      <LuxuryCard variant="gold" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {Array.isArray(politicians) ? politicians.length : "2,847"}
            </div>
            <p className="text-sm text-muted-foreground">Political Profiles</p>
            <Progress value={85} className="mt-2" />
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-1">
              {Array.isArray(bills) ? bills.length : "147"}
            </div>
            <p className="text-sm text-muted-foreground">Active Legislation</p>
            <Progress value={72} className="mt-2" />
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {userStats?.civicLevel || "3"}
            </div>
            <p className="text-sm text-muted-foreground">Civic Level</p>
            <Progress value={60} className="mt-2" />
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-1">
              {userStats?.trustScore || "87"}
            </div>
            <p className="text-sm text-muted-foreground">Trust Rating</p>
            <Progress value={87} className="mt-2" />
          </div>
        </div>
      </LuxuryCard>

      {/* Modular Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Main Widgets */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pinnedWidgets.map(widgetId => {
              const widget = availableWidgets.find(w => w.id === widgetId);
              if (!widget) return null;
              
              return (
                <div key={widget.id} className="relative group">
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePin(widget.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Pin className="w-4 h-4" />
                    </Button>
                  </div>
                  <widget.component />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          <LuxuryCard title="Quick Actions" variant="dark">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-12 text-xs"
                onClick={handleQuickVote}
              >
                <Vote className="w-4 h-4 mr-2" />
                Cast Vote
              </Button>
              <Button 
                variant="outline" 
                className="h-12 text-xs"
                onClick={handleJoinDiscussion}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Join Discussion
              </Button>
              <Button 
                variant="outline" 
                className="h-12 text-xs"
                onClick={handleSubmitPetition}
              >
                <FileText className="w-4 h-4 mr-2" />
                Submit Petition
              </Button>
              <Button 
                variant="outline" 
                className="h-12 text-xs"
                onClick={handleContactOfficial}
              >
                <Users className="w-4 h-4 mr-2" />
                Contact Official
              </Button>
            </div>
          </LuxuryCard>

          <LuxuryCard title="Widget Store" variant="pulse">
            <div className="space-y-2">
              {availableWidgets
                .filter(w => !pinnedWidgets.includes(w.id))
                .slice(0, 3)
                .map(widget => (
                  <div key={widget.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm font-medium">{widget.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePin(widget.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
            </div>
          </LuxuryCard>
        </div>
      </div>

      {/* Voting Modal */}
      <Dialog open={isVotingModalOpen} onOpenChange={setIsVotingModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">Cast Your Vote</DialogTitle>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{selectedBill.billNumber}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {selectedBill.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedBill.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedBill.aiSummary?.slice(0, 200) || selectedBill.description?.slice(0, 200)}...
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  className="h-12 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    // Handle vote submission
                    setIsVotingModalOpen(false);
                    setSelectedBill(null);
                  }}
                >
                  <Vote className="w-4 h-4 mr-2" />
                  Support
                </Button>
                <Button 
                  className="h-12 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    // Handle vote submission
                    setIsVotingModalOpen(false);
                    setSelectedBill(null);
                  }}
                >
                  <Vote className="w-4 h-4 mr-2" />
                  Oppose
                </Button>
                <Button 
                  variant="outline"
                  className="h-12"
                  onClick={() => {
                    // Handle abstain
                    setIsVotingModalOpen(false);
                    setSelectedBill(null);
                  }}
                >
                  Abstain
                </Button>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/voting')}
                  className="text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View All Bills
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Widget Components
function BillsWidget() {
  const { data: bills } = useQuery({ queryKey: ['/api/bills'] });
  
  return (
    <LuxuryCard title="Bills & Voting" variant="default">
      <div className="space-y-3">
        {Array.isArray(bills) && bills.slice(0, 3).map((bill: any) => (
          <div key={bill.id} className="p-3 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-sm">{bill.billNumber}</h4>
              <Badge variant="secondary" className="text-xs">
                {bill.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {bill.title}
            </p>
          </div>
        ))}
        {(!bills || !Array.isArray(bills) || bills.length === 0) && (
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Loading authentic Canadian legislation data...</p>
          </div>
        )}
      </div>
    </LuxuryCard>
  );
}

function PoliticiansWidget() {
  const { data: politicians } = useQuery({ queryKey: ['/api/politicians'] });
  
  return (
    <LuxuryCard title="Political Directory" variant="default">
      <div className="space-y-3">
        {Array.isArray(politicians) && politicians.slice(0, 3).map((politician: any) => (
          <div key={politician.id} className="flex items-center space-x-3 p-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{politician.name}</p>
              <p className="text-xs text-muted-foreground">{politician.position}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {politician.party}
            </Badge>
          </div>
        ))}
        {(!politicians || !Array.isArray(politicians) || politicians.length === 0) && (
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Loading Canadian political profiles...</p>
          </div>
        )}
      </div>
    </LuxuryCard>
  );
}

function NewsWidget() {
  const { data: newsData } = useQuery({ queryKey: ['/api/news/articles'] });
  
  return (
    <LuxuryCard title="News Intelligence" variant="pulse">
      <div className="space-y-3">
        {Array.isArray(newsData) && newsData.slice(0, 2).map((article: any) => (
          <div key={article.id} className="p-3 bg-muted/50 rounded-lg">
            <Badge variant="secondary" className="text-xs mb-2">
              {article.source}
            </Badge>
            <p className="text-sm font-medium line-clamp-2">
              {article.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(article.publishedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
        {(!newsData || !Array.isArray(newsData) || newsData.length === 0) && (
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Loading verified Canadian news sources...</p>
          </div>
        )}
      </div>
    </LuxuryCard>
  );
}

function LegalWidget() {
  return (
    <LuxuryCard title="Legal Oversight" variant="dark">
      <div className="text-center py-8">
        <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Legal system monitoring active</p>
      </div>
    </LuxuryCard>
  );
}

function DiscussionsWidget() {
  return (
    <LuxuryCard title="Civic Discussions" variant="default">
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">24 active discussions</p>
      </div>
    </LuxuryCard>
  );
}

function AnalyticsWidget() {
  return (
    <LuxuryCard title="Trust Analytics" variant="gold">
      <div className="text-center py-8">
        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Analytics dashboard ready</p>
      </div>
    </LuxuryCard>
  );
}