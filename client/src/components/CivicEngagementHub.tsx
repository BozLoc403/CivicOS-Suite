import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  TrendingUp
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

const civicActions: CivicAction[] = [
  {
    id: '1',
    title: 'Contact Your MP About Bill C-27',
    description: 'The Digital Charter Implementation Act is currently before Parliament - contact your MP about privacy concerns',
    points: 150,
    category: 'advocacy',
    difficulty: 'medium',
    timeRequired: '15 min',
    impact: 'federal'
  },
  {
    id: '2',
    title: 'Attend December Budget Consultation',
    description: 'Federal budget consultations are happening across Canada - find your local session',
    points: 300,
    category: 'engagement',
    difficulty: 'hard',
    timeRequired: '2 hours',
    impact: 'federal'
  },
  {
    id: '3',
    title: 'Review Housing Accelerator Fund',
    description: 'Learn about Canada\'s $4B Housing Accelerator Fund and how it affects your community',
    points: 100,
    category: 'knowledge',
    difficulty: 'easy',
    timeRequired: '20 min',
    impact: 'federal'
  },
  {
    id: '4',
    title: 'Vote on Current Bills',
    description: 'Cast your vote on active legislation including federal budget bills and environmental policies',
    points: 75,
    category: 'voting',
    difficulty: 'easy',
    timeRequired: '10 min',
    impact: 'federal'
  },
  {
    id: '5',
    title: 'Share Climate Action Updates',
    description: 'Share verified information about Canada\'s 2030 emissions reduction plan',
    points: 50,
    category: 'advocacy',
    difficulty: 'easy',
    timeRequired: '5 min',
    impact: 'federal'
  }
];

export default function CivicEngagementHub() {
  const [userLevel] = useState(3);
  const [currentXP] = useState(450);
  const [nextLevelXP] = useState(600);
  const [completedActions] = useState(['3', '4']);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Level {userLevel}</div>
              <div className="text-sm text-muted-foreground">Civic Advocate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentXP} XP</div>
              <div className="text-sm text-muted-foreground">Current Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{nextLevelXP - currentXP}</div>
              <div className="text-sm text-muted-foreground">To Next Level</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userLevel + 1}</span>
              <span>{Math.round((currentXP / nextLevelXP) * 100)}%</span>
            </div>
            <Progress value={(currentXP / nextLevelXP) * 100} className="h-3" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {civicActions.map((action) => {
              const isCompleted = completedActions.includes(action.id);
              
              return (
                <Card key={action.id} className={`${isCompleted ? 'opacity-60 bg-gray-50' : 'hover:shadow-md'} transition-all`}>
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
                    
                    <Button 
                      size="sm" 
                      className="w-full" 
                      disabled={isCompleted}
                      variant={isCompleted ? "secondary" : "default"}
                    >
                      {isCompleted ? 'Completed ✓' : 'Start Action'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
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
            {[
              { name: 'Jordan K.', points: 2150, level: 8, badge: 'Platform Creator' },
              { name: 'Demo User', points: 450, level: 3, badge: 'Civic Advocate' },
              { name: 'Anonymous', points: 125, level: 1, badge: 'New Citizen' }
            ].map((leader, index) => (
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