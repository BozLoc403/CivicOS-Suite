import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { 
  Trophy, 
  Target, 
  Users, 
  Calendar, 
  MapPin, 
  Vote, 
  FileText, 
  Megaphone,
  Award,
  TrendingUp,
  BookOpen,
  Star
} from 'lucide-react';

interface CivicAction {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'voting' | 'engagement' | 'knowledge' | 'advocacy';
  difficulty: 'easy' | 'medium' | 'hard';
  timeRequired: string;
  impact: 'local' | 'provincial' | 'federal';
}

export default function CivicEngagementHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { user } = useAuth();

  // Fetch real civic actions from API
  const { data: civicActions = [] } = useQuery({
    queryKey: ['/api/civic/civic-actions'],
  });

  const { data: userStats } = useQuery({
    queryKey: ['/api/civic/user-stats', user?.id],
    enabled: !!user?.id
  });

  const { data: leaderboard = [] } = useQuery({
    queryKey: ['/api/civic/leaderboard'],
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'voting': return <Vote className="h-4 w-4" />;
      case 'engagement': return <Users className="h-4 w-4" />;
      case 'knowledge': return <FileText className="h-4 w-4" />;
      case 'advocacy': return <Megaphone className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'local': return 'bg-blue-100 text-blue-800';
      case 'provincial': return 'bg-purple-100 text-purple-800';
      case 'federal': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Your Civic Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{userStats?.points || 0}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">Level {userStats?.level || 1}</div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{userStats?.actionsCompleted || 0}</div>
              <div className="text-sm text-gray-600">Actions Completed</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{userStats?.badgesEarned || 0}</div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {(userStats?.level || 1) + 1}</span>
              <span>{userStats ? Math.round(((userStats.points % 200) / 200) * 100) : 0}%</span>
            </div>
            <Progress value={userStats ? ((userStats.points % 200) / 200) * 100 : 0} className="w-full" />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>{userStats?.points || 0} points</span>
              <span>Next level: {userStats ? (Math.floor(userStats.points / 200) + 1) * 200 : 200} points</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Vote className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Votes Cast</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm text-muted-foreground">Bills Read</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Megaphone className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Actions Taken</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm text-muted-foreground">Badges Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Available Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Available Civic Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="voting">Voting</TabsTrigger>
              <TabsTrigger value="advocacy">Advocacy</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(civicActions || []).filter((action: any) => 
              selectedCategory === 'all' || action.category === selectedCategory
            ).map((action: any) => (
              <Card key={action.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(action.category)}
                      <h3 className="font-semibold">{action.title}</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">+{action.points}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className={getImpactColor(action.impact)}>
                      {action.impact}
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${getDifficultyColor(action.difficulty)}`} />
                      <span>{action.difficulty}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{action.timeRequired}</span>
                    </Badge>
                  </div>
                  
                  <Button size="sm" className="w-full">
                    Start Action
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Challenge */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
            This Week's Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Local Government Week</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Connect with your local representatives and learn about municipal issues affecting your community.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Bonus: +50% XP for local actions</span>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                6 days left
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-500" />
            Community Leaders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.slice(0, 3).map((leader, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{leader.name}</div>
                    <div className="text-sm text-muted-foreground">{leader.badge}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{leader.points.toLocaleString()} XP</div>
                  <div className="text-sm text-muted-foreground">Level {leader.level}</div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View Full Leaderboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}