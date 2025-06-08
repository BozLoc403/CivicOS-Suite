import { NavigationHeader } from "@/components/NavigationHeader";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Vote, MessageSquare, FileText, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { user } = useAuth();

  const { data: userStats } = useQuery({
    queryKey: ['/api/user/stats'],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Information */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="h-24 w-24 rounded-full object-cover border-4 border-civic-blue"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-civic-blue text-white flex items-center justify-center text-2xl font-bold">
                    {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                  </div>
                )}
              </div>
              <CardTitle className="text-xl">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email?.split('@')[0] || 'User'
                }
              </CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trust Score</span>
                <Badge variant="secondary">{userStats?.trustScore || '100.00'}%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Civic Level</span>
                <div className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4 text-amber-600" />
                  <span className="font-medium">{userStats?.civicLevel || 1}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Civic Points</span>
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{userStats?.civicPoints || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Civic Engagement</CardTitle>
              <CardDescription>Your participation in democratic processes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Vote className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Votes Cast</span>
                    </div>
                    <span className="font-medium">{userStats?.voteCount || 0}</span>
                  </div>
                  <Progress value={(userStats?.voteCount || 0) * 10} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Discussions</span>
                    </div>
                    <span className="font-medium">{userStats?.discussionCount || 0}</span>
                  </div>
                  <Progress value={(userStats?.discussionCount || 0) * 5} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Petitions Signed</span>
                    </div>
                    <span className="font-medium">{userStats?.petitionCount || 0}</span>
                  </div>
                  <Progress value={(userStats?.petitionCount || 0) * 15} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Representatives Contacted</span>
                    </div>
                    <span className="font-medium">{userStats?.contactCount || 0}</span>
                  </div>
                  <Progress value={(userStats?.contactCount || 0) * 20} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest civic engagement activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userStats?.recentActivity?.length > 0 ? (
                  userStats.recentActivity.map((activity: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 bg-civic-blue rounded-full flex items-center justify-center">
                        <Vote className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-600">{activity.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Start engaging with civic activities to see your activity here!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}