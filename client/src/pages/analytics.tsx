import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, TrendingUp, Shield, BarChart3, Calendar } from 'lucide-react';

interface AnalyticsData {
  userStats: {
    total_users: number;
    daily_signups: number;
    weekly_signups: number;
    monthly_signups: number;
    verified_users: number;
    avg_trust_score: number;
  };
  sessionStats: {
    total_sessions: number;
    unique_sessions: number;
    active_sessions: number;
  };
  dailyActivity: Array<{
    date: string;
    new_users: number;
  }>;
  verificationBreakdown: Array<{
    verification_level: string;
    count: number;
  }>;
  trustScoreDistribution: Array<{
    trust_range: string;
    count: number;
  }>;
}

interface EngagementData {
  votingStats: {
    total_votes: number;
    unique_voters: number;
    upvotes: number;
    downvotes: number;
  };
  petitionStats: {
    total_signatures: number;
    unique_signers: number;
  };
  activeUsers: Array<{
    email: string;
    trust_score: number;
    vote_count: number;
  }>;
}

export default function Analytics() {
  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics/stats'],
  });

  const { data: engagement, isLoading: engagementLoading } = useQuery<EngagementData>({
    queryKey: ['/api/analytics/engagement'],
  });

  const { data: users, isLoading: usersLoading } = useQuery<any[]>({
    queryKey: ['/api/analytics/users'],
  });

  if (analyticsLoading || engagementLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            CivicOS Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Platform usage and engagement metrics
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.userStats.total_users || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{analytics?.userStats.daily_signups || 0} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.sessionStats.active_sessions || 0}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.sessionStats.total_sessions || 0} total sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.userStats.verified_users || 0}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.userStats.total_users ? 
                  Math.round((analytics.userStats.verified_users / analytics.userStats.total_users) * 100) 
                  : 0}% verification rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Trust Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.userStats.avg_trust_score ? 
                  Math.round(Number(analytics.userStats.avg_trust_score)) 
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Platform average</p>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Civic Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Votes Cast</span>
                  <Badge variant="outline">{engagement?.votingStats.total_votes || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Unique Voters</span>
                  <Badge variant="outline">{engagement?.votingStats.unique_voters || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Petition Signatures</span>
                  <Badge variant="outline">{engagement?.petitionStats.total_signatures || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Unique Signers</span>
                  <Badge variant="outline">{engagement?.petitionStats.unique_signers || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Recent Signups (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {analytics?.dailyActivity?.slice(0, 10).map((day, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                    <Badge variant="secondary">{day.new_users} users</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification and Trust Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Verification Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.verificationBreakdown?.map((level, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="capitalize">{level.verification_level.replace('_', ' ')}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{level.count}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {analytics.userStats.total_users ? 
                          Math.round((level.count / analytics.userStats.total_users) * 100) 
                          : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trust Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.trustScoreDistribution?.map((range, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{range.trust_range}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{range.count}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {analytics.userStats.total_users ? 
                          Math.round((range.count / analytics.userStats.total_users) * 100) 
                          : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Most Active Users */}
        <Card>
          <CardHeader>
            <CardTitle>Most Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {engagement?.activeUsers?.slice(0, 10).map((user, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{user.vote_count} votes</Badge>
                    <Badge variant="outline">Trust: {user.trust_score}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users?.slice(0, 20).map((user, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm">{user.email}</span>
                    {user.is_verified && <Badge variant="default">Verified</Badge>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Trust: {user.trust_score}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}