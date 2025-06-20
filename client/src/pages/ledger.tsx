import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationHeader } from "@/components/NavigationHeader";
import { Shield, Download, Eye, AlertCircle, Vote, FileText, MessageSquare, Users, Calendar, ExternalLink, TrendingUp } from "lucide-react";
import { useEffect } from "react";

interface CivicAction {
  id: number;
  activityType: string;
  entityId: number;
  entityType: string;
  pointsEarned: number;
  details: any;
  createdAt: string;
}

interface CivicLedgerData {
  actions: CivicAction[];
  totals: {
    totalActions: number;
    votescast: number;
    petitionsSigned: number;
    postsCreated: number;
    commentsPosted: number;
    totalPoints: number;
  };
  votes: Array<{
    id: number;
    itemId: number;
    itemType: string;
    voteValue: number;
    reasoning: string | null;
    timestamp: string;
    billTitle?: string;
    sourceUrl?: string;
  }>;
  petitions: Array<{
    id: number;
    petitionId: number;
    signedAt: string;
    petitionTitle: string;
    petitionStatus: string;
    targetSignatures: number;
    currentSignatures: number;
  }>;
}

export default function Ledger() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = '/auth';
    }
  }, [isAuthenticated, authLoading]);

  const { data: ledgerData, isLoading } = useQuery<CivicLedgerData>({
    queryKey: ["/api/civic-ledger"],
    enabled: isAuthenticated,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });

  const getVoteColor = (voteValue: number) => {
    if (voteValue > 0) return "bg-green-500 text-white";
    if (voteValue < 0) return "bg-red-500 text-white";
    return "bg-gray-500 text-white";
  };

  const getVoteText = (voteValue: number) => {
    if (voteValue > 0) return "Support";
    if (voteValue < 0) return "Oppose";
    return "Neutral";
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'vote': return <Vote className="h-4 w-4" />;
      case 'petition_sign': return <FileText className="h-4 w-4" />;
      case 'post': return <MessageSquare className="h-4 w-4" />;
      case 'reply': return <MessageSquare className="h-4 w-4" />;
      case 'comment': return <MessageSquare className="h-4 w-4" />;
      case 'legal_search': return <Eye className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'vote': return "bg-blue-100 text-blue-800";
      case 'petition_sign': return "bg-green-100 text-green-800";
      case 'post': return "bg-purple-100 text-purple-800";
      case 'reply': return "bg-orange-100 text-orange-800";
      case 'comment': return "bg-yellow-100 text-yellow-800";
      case 'legal_search': return "bg-gray-100 text-gray-800";
      default: return "bg-indigo-100 text-indigo-800";
    }
  };

  const formatDate = (timestamp: string | Date) => {
    return new Date(timestamp).toLocaleString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatActivityType = (activityType: string) => {
    switch (activityType) {
      case 'vote': return 'Vote Cast';
      case 'petition_sign': return 'Petition Signed';
      case 'post': return 'Forum Post';
      case 'reply': return 'Forum Reply';
      case 'comment': return 'Comment Posted';
      case 'legal_search': return 'Legal Search';
      default: return activityType.charAt(0).toUpperCase() + activityType.slice(1);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <NavigationHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your civic action history...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Civic Ledger</h1>
          <p className="text-gray-600">Complete history of your democratic participation and civic engagement</p>
        </div>

        {/* Activity Summary Cards */}
        {ledgerData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{ledgerData.totals.totalActions}</p>
                <p className="text-sm text-gray-600">Total Actions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Vote className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{ledgerData.totals.votescast}</p>
                <p className="text-sm text-gray-600">Votes Cast</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{ledgerData.totals.petitionsSigned}</p>
                <p className="text-sm text-gray-600">Petitions Signed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{ledgerData.totals.postsCreated}</p>
                <p className="text-sm text-gray-600">Posts Created</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{ledgerData.totals.commentsPosted}</p>
                <p className="text-sm text-gray-600">Comments Posted</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{ledgerData.totals.totalPoints}</p>
                <p className="text-sm text-gray-600">Civic Points</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Notice */}
        <Card className="mb-8 bg-civic-green text-white">
          <CardContent className="p-6">
            <div className="flex items-start">
              <Shield className="text-2xl mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Cryptographic Security</h3>
                <p className="text-sm opacity-90">
                  Every vote is secured with a unique verification ID and block hash. 
                  This ensures your votes cannot be tampered with or deleted. 
                  You can download individual receipts as proof of participation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voting History */}
        {votes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Votes Cast</h3>
              <p className="text-gray-600 mb-4">
                You haven't cast any votes yet. Visit the Active Legislation page to participate in democracy.
              </p>
              <Button className="bg-civic-blue hover:bg-blue-700">
                View Active Bills
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {votes.map((vote) => (
              <Card key={vote.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vote.bill.title}
                        </h3>
                        <Badge className={getVoteColor(vote.voteValue)}>
                          {vote.voteValue.toUpperCase()}
                        </Badge>
                        <Shield className="civic-green w-5 h-5" title="Cryptographically Verified" />
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {vote.bill.jurisdiction} · {vote.bill.category}
                      </p>

                      {vote.reasoning && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Your reasoning:</p>
                          <p className="text-sm text-gray-600 italic">"{vote.reasoning}"</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Timestamp:</span> {formatDate(vote.timestamp!)}
                        </div>
                        <div>
                          <span className="font-medium">Verification ID:</span>
                          <code className="ml-1 bg-gray-100 px-1 rounded text-xs">
                            {vote.verificationId}
                          </code>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium">Block Hash:</span>
                          <code className="ml-1 bg-gray-100 px-1 rounded text-xs break-all">
                            {vote.blockHash}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:ml-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReceipt(vote)}
                        className="text-civic-blue border-civic-blue hover:bg-civic-blue hover:text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Receipt
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-600 border-gray-300 hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Verify on Blockchain
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {votes.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Showing {votes.length} vote{votes.length !== 1 ? 's' : ''} · 
              All votes are cryptographically verified and immutable
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
