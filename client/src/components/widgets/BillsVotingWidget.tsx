import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Vote, Clock, TrendingUp, Calendar, Users, CheckCircle } from "lucide-react";
import { Link } from "wouter";

interface Bill {
  id: number;
  billNumber: string;
  title: string;
  status: string;
  summary: string;
  votingDeadline?: string;
  yesVotes: number;
  noVotes: number;
  totalVotes: number;
  publicSupport: number;
  category: string;
  jurisdiction: string;
  sponsor?: string;
  urgency: 'low' | 'medium' | 'high';
  estimatedImpact: number;
}

interface UserVote {
  billId: number;
  voteValue: string;
  reasoning?: string;
  timestamp: string;
}

export default function BillsVotingWidget() {
  const { data: bills = [], isLoading: billsLoading } = useQuery<Bill[]>({
    queryKey: ['/api/bills'],
    refetchInterval: 120000, // Refresh every 2 minutes
    select: (data) => data.slice(0, 6), // Show latest 6 bills
  });

  const { data: userVotes = [], isLoading: votesLoading } = useQuery<UserVote[]>({
    queryKey: ['/api/votes/user'],
    refetchInterval: 180000, // Refresh every 3 minutes
  });

  const { data: votingStats } = useQuery({
    queryKey: ['/api/voting/stats'],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'passed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getUserVote = (billId: number) => {
    return userVotes.find(vote => vote.billId === billId);
  };

  const calculateVotePercentage = (yesVotes: number, totalVotes: number) => {
    return totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;
  };

  const isVotingActive = (deadline?: string) => {
    if (!deadline) return true;
    return new Date(deadline) > new Date();
  };

  if (billsLoading && votesLoading) {
    return (
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Vote className="h-5 w-5" />
            <span>Bills & Voting</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Vote className="h-5 w-5" />
            <span>Bills & Voting</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {bills.filter(b => b.status === 'active').length} Active
            </Badge>
            {votingStats && (
              <Badge variant="secondary" className="text-xs">
                {votingStats.totalParticipants} Voters
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto">
        <div className="space-y-3">
          {/* Urgent Bills Section */}
          {bills.filter(bill => bill.urgency === 'high').length > 0 && (
            <div className="border-l-4 border-red-500 pl-3 mb-4">
              <h4 className="font-medium text-sm mb-2 text-red-700 dark:text-red-300">
                🚨 Urgent - Voting Ends Soon
              </h4>
              <div className="space-y-2">
                {bills.filter(bill => bill.urgency === 'high').slice(0, 2).map((bill) => {
                  const userVote = getUserVote(bill.id);
                  const votePercentage = calculateVotePercentage(bill.yesVotes, bill.totalVotes);
                  const votingActive = isVotingActive(bill.votingDeadline);
                  
                  return (
                    <div key={bill.id} className={`border rounded-lg p-2 ${getUrgencyColor(bill.urgency)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="secondary" className="text-xs">{bill.billNumber}</Badge>
                            <Badge className={`text-xs ${getStatusColor(bill.status)}`}>
                              {bill.status}
                            </Badge>
                            {userVote && (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            )}
                          </div>
                          <h5 className="font-medium text-sm mb-1 line-clamp-2">{bill.title}</h5>
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                            {bill.summary}
                          </p>
                        </div>
                      </div>
                      
                      {/* Voting Progress */}
                      <div className="space-y-1 mb-2">
                        <div className="flex justify-between text-xs">
                          <span>Public Support</span>
                          <span>{votePercentage}% Yes</span>
                        </div>
                        <Progress value={votePercentage} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{bill.totalVotes} total votes</span>
                          <span>{bill.publicSupport}% public support</span>
                        </div>
                      </div>

                      {/* User Vote Status */}
                      {userVote ? (
                        <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
                          <CheckCircle className="h-3 w-3" />
                          <span>You voted: {userVote.voteValue}</span>
                          <span className="text-gray-400">
                            {new Date(userVote.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ) : votingActive ? (
                        <Button size="sm" className="w-full h-6 text-xs">
                          Vote Now
                        </Button>
                      ) : (
                        <div className="text-xs text-gray-500 text-center">
                          Voting Closed
                        </div>
                      )}

                      {/* Deadline */}
                      {bill.votingDeadline && (
                        <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>
                            Ends: {new Date(bill.votingDeadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Regular Bills */}
          {bills.filter(bill => bill.urgency !== 'high').map((bill) => {
            const userVote = getUserVote(bill.id);
            const votePercentage = calculateVotePercentage(bill.yesVotes, bill.totalVotes);
            const votingActive = isVotingActive(bill.votingDeadline);
            
            return (
              <div key={bill.id} className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="secondary" className="text-xs">{bill.billNumber}</Badge>
                      <Badge className={`text-xs ${getStatusColor(bill.status)}`}>
                        {bill.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{bill.category}</Badge>
                      {userVote && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">{bill.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                      {bill.summary}
                    </p>
                  </div>
                </div>

                {/* Vote Progress Bar */}
                <div className="space-y-1 mb-2">
                  <div className="flex justify-between text-xs">
                    <span>Support</span>
                    <span>{votePercentage}%</span>
                  </div>
                  <Progress value={votePercentage} className="h-1.5" />
                </div>

                {/* Vote Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Users className="h-3 w-3" />
                    <span>{bill.totalVotes} votes</span>
                    {bill.sponsor && (
                      <>
                        <span>•</span>
                        <span>{bill.sponsor}</span>
                      </>
                    )}
                  </div>
                  
                  {userVote ? (
                    <Badge variant="secondary" className="text-xs">
                      Voted {userVote.voteValue}
                    </Badge>
                  ) : votingActive ? (
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                      Vote
                    </Button>
                  ) : (
                    <span className="text-xs text-gray-400">Closed</span>
                  )}
                </div>

                {/* Impact & Deadline */}
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{bill.estimatedImpact}% impact</span>
                  </div>
                  {bill.votingDeadline && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(bill.votingDeadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t">
          <Link href="/voting">
            <Button variant="outline" size="sm" className="w-full">
              <Vote className="h-4 w-4 mr-2" />
              View All Bills
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}