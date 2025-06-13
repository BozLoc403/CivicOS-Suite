import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { VotingButtons } from "@/components/VotingButtons";
import { 
  User, 
  MessageCircle, 
  Vote, 
  FileText, 
  Calendar,
  Award,
  TrendingUp,
  Users,
  ThumbsUp,
  ThumbsDown,
  Eye
} from "lucide-react";

interface UserProfile {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_image_url?: string;
    civic_level: string;
    civic_points: number;
    current_level: number;
    achievement_tier: string;
    engagement_level: string;
    trust_score: string;
    created_at: string;
  };
  interactions: Array<{
    interaction_type: string;
    target_type: string;
    target_id: number;
    content: string;
    created_at: string;
  }>;
  posts: Array<{
    id: number;
    title: string;
    content: string;
    created_at: string;
    category_name: string;
  }>;
  votes: Array<{
    id: number;
    vote_choice: string;
    bill_title: string;
    bill_number: string;
    created_at: string;
  }>;
}

export default function UserProfile() {
  const { userId } = useParams();
  
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: [`/api/users/${userId}/profile`],
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <div className="max-w-6xl mx-auto py-8 px-4">
          <Card>
            <CardContent className="p-12 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Not Found</h3>
              <p className="text-gray-600">The requested user profile could not be found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { user, interactions, posts, votes } = profile;

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'champion': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-blue-100 text-blue-800';
      case 'advocate': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-gradient-to-r from-purple-400 to-purple-600';
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'silver': return 'bg-gradient-to-r from-gray-400 to-gray-600';
      default: return 'bg-gradient-to-r from-orange-400 to-orange-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-start space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.profile_image_url} />
                <AvatarFallback className="text-2xl">
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="text-gray-600 mb-4">{user.email}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className={getEngagementColor(user.engagement_level)}>
                    {user.engagement_level}
                  </Badge>
                  <Badge className={`text-white ${getTierColor(user.achievement_tier)}`}>
                    {user.achievement_tier} tier
                  </Badge>
                  <Badge variant="secondary">
                    Level {user.current_level}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{user.civic_points}</div>
                    <div className="text-sm text-gray-500">Civic Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{parseFloat(user.trust_score).toFixed(0)}%</div>
                    <div className="text-sm text-gray-500">Trust Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{posts.length}</div>
                    <div className="text-sm text-gray-500">Forum Posts</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Tabs */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts">Forum Posts</TabsTrigger>
            <TabsTrigger value="votes">Voting Record</TabsTrigger>
            <TabsTrigger value="interactions">Recent Activity</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Forum Posts ({posts.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {posts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No forum posts yet</p>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post.id} className="border-l-4 border-blue-500 pl-4 py-2">
                        <h4 className="font-medium text-gray-900">{post.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{post.content.substring(0, 150)}...</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>in {post.category_name}</span>
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="votes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Vote className="w-5 h-5" />
                  <span>Voting Record ({votes.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {votes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No votes cast yet</p>
                ) : (
                  <div className="space-y-4">
                    {votes.map((vote) => (
                      <div key={vote.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{vote.bill_title}</h4>
                          <p className="text-sm text-gray-600">Bill {vote.bill_number}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={vote.vote_choice === 'yes' ? 'default' : 'destructive'}>
                            {vote.vote_choice}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(vote.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Recent Activity ({interactions.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {interactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent activity</p>
                ) : (
                  <div className="space-y-3">
                    {interactions.slice(0, 20).map((interaction, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {interaction.interaction_type === 'vote' && <Vote className="w-4 h-4 text-blue-600" />}
                          {interaction.interaction_type === 'comment' && <MessageCircle className="w-4 h-4 text-blue-600" />}
                          {interaction.interaction_type === 'post' && <FileText className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {interaction.interaction_type === 'vote' && `Voted ${interaction.content} on`}
                            {interaction.interaction_type === 'comment' && 'Commented on'}
                            {interaction.interaction_type === 'post' && 'Created post:'}
                            {' '}
                            {interaction.target_type}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(interaction.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Forum Posts</span>
                      <span className="font-bold">{posts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Votes Cast</span>
                      <span className="font-bold">{votes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Activity</span>
                      <span className="font-bold">{interactions.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Member Since</span>
                      <span className="font-bold">{formatDate(user.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Civic Level</span>
                      <span className="font-bold">{user.civic_level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Level</span>
                      <span className="font-bold">Level {user.current_level}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}