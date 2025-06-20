import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Users, Target, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Link } from "wouter";

interface Petition {
  id: number;
  title: string;
  description: string;
  targetSignatures: number;
  currentSignatures: number;
  status: 'active' | 'closed' | 'successful' | 'failed';
  category: string;
  creator: {
    name: string;
    verified: boolean;
  };
  createdAt: string;
  deadlineDate?: string;
  targetOfficial?: string;
  impact: 'local' | 'provincial' | 'federal';
  urgency: 'low' | 'medium' | 'high';
  recentActivity: {
    signaturesLast24h: number;
    trending: boolean;
  };
}

interface UserSignature {
  petitionId: number;
  signedAt: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export default function PetitionsWidget() {
  const { data: petitions = [], isLoading: petitionsLoading } = useQuery<Petition[]>({
    queryKey: ['/api/petitions'],
    refetchInterval: 180000, // Refresh every 3 minutes
    select: (data) => data.slice(0, 6), // Show latest 6 petitions
  });

  const { data: userSignatures = [], isLoading: signaturesLoading } = useQuery<UserSignature[]>({
    queryKey: ['/api/petitions/user-signatures'],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const { data: petitionStats } = useQuery({
    queryKey: ['/api/petitions/stats'],
    refetchInterval: 300000,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'successful': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'federal': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'provincial': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'local': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getUserSignature = (petitionId: number) => {
    return userSignatures.find(sig => sig.petitionId === petitionId);
  };

  const isActive = (petition: Petition) => {
    return petition.status === 'active' && (!petition.deadlineDate || new Date(petition.deadlineDate) > new Date());
  };

  if (petitionsLoading && signaturesLoading) {
    return (
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Active Petitions</span>
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
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Active Petitions</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {petitions.filter(p => p.status === 'active').length} Active
            </Badge>
            {petitionStats && (
              <Badge variant="secondary" className="text-xs">
                {(petitionStats as any).totalSignatures || 0} Signatures
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-3">
          {/* Show empty state when no authentic data is available */}
          {petitions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Petition System Loading
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Connecting to authentic Canadian petition platforms and government petition systems. 
                Only verified petitions with real signatures and official status will be displayed.
              </p>
            </div>
          ) : (
            <>
              {/* Regular Petitions */}
              {petitions.map((petition) => {
                const userSignature = getUserSignature(petition.id);
                const progress = calculateProgress(petition.currentSignatures, petition.targetSignatures);
                
                return (
                  <div key={petition.id} className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="secondary" className="text-xs">{petition.category}</Badge>
                          <Badge className={`text-xs ${getStatusColor(petition.status)}`}>
                            {petition.status}
                          </Badge>
                          <Badge className={`text-xs ${getImpactColor(petition.impact)}`}>
                            {petition.impact}
                          </Badge>
                          {petition.recentActivity?.trending && (
                            <TrendingUp className="h-3 w-3 text-orange-500" />
                          )}
                        </div>
                        <h4 className="font-medium text-sm mb-1 line-clamp-2">{petition.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                          {petition.description}
                        </p>
                      </div>
                    </div>

                    {/* Creator & Target */}
                    <div className="flex items-center space-x-4 mb-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{petition.creator?.name || 'Unknown'}</span>
                        {petition.creator?.verified && <span className="text-green-500">✓</span>}
                      </div>
                      {petition.targetOfficial && (
                        <div className="flex items-center space-x-1">
                          <Target className="h-3 w-3" />
                          <span>{petition.targetOfficial}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-1 mb-2">
                      <Progress value={progress} className="h-1.5" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{petition.currentSignatures.toLocaleString()} signatures</span>
                        <span>{Math.round(progress)}% of goal</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <TrendingUp className="h-3 w-3" />
                        <span>+{petition.recentActivity?.signaturesLast24h || 0} today</span>
                        {petition.deadlineDate && (
                          <>
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            <span>{new Date(petition.deadlineDate).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                      
                      {userSignature ? (
                        <Badge variant="secondary" className="text-xs">
                          Signed
                        </Badge>
                      ) : isActive(petition) ? (
                        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                          Sign
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400">Closed</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div className="mt-4 pt-3 border-t">
          <Link href="/petitions">
            <Button variant="outline" size="sm" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              View All Petitions
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}