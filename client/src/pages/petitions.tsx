import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { NavigationHeader } from "@/components/NavigationHeader";
import { PenTool, Users, Calendar, TrendingUp, FileText, CheckCircle } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Petition {
  id: number;
  title: string;
  description: string;
  relatedBillId?: number;
  creatorId: string;
  targetSignatures: number;
  currentSignatures: number;
  status: string;
  autoCreated: boolean;
  voteThresholdMet?: string;
  deadlineDate?: string;
  createdAt: string;
  relatedBill?: {
    billNumber: string;
    title: string;
    jurisdiction: string;
  };
  creator?: {
    firstName?: string;
    lastName?: string;
  };
}

export default function Petitions() {
  const [selectedTab, setSelectedTab] = useState("active");
  const { toast } = useToast();

  const { data: petitions = [], isLoading } = useQuery<Petition[]>({
    queryKey: ["/api/petitions"],
  });

  const signPetitionMutation = useMutation({
    mutationFn: async (petitionId: number) => {
      return await apiRequest(`/api/petitions/${petitionId}/sign`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/petitions"] });
      toast({
        title: "Petition Signed",
        description: "Your signature has been recorded and verified.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const activePetitions = petitions.filter(p => p.status === "active");
  const autoPetitions = petitions.filter(p => p.autoCreated);
  const successfulPetitions = petitions.filter(p => p.status === "successful");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'successful': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const PetitionCard = ({ petition }: { petition: Petition }) => {
    const progressPercentage = getProgressPercentage(petition.currentSignatures, petition.targetSignatures);
    const isNearTarget = progressPercentage >= 80;
    const canSign = petition.status === "active";

    return (
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`text-xs px-2 py-1 border ${getStatusColor(petition.status)}`}>
                  {petition.status}
                </Badge>
                {petition.autoCreated && (
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Auto-Generated
                  </Badge>
                )}
                {isNearTarget && (
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                    Near Target!
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl mb-2 text-gray-900 leading-tight">
                {petition.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {petition.relatedBill && (
                  <span className="flex items-center gap-1 mb-1">
                    <FileText className="w-3 h-3" />
                    Related to Bill {petition.relatedBill.billNumber}: {petition.relatedBill.title}
                  </span>
                )}
                <span>Created {formatDate(petition.createdAt)}</span>
              </CardDescription>
            </div>
            {canSign && (
              <Button 
                onClick={() => signPetitionMutation.mutate(petition.id)}
                disabled={signPetitionMutation.isPending}
                className="bg-civic-blue hover:bg-civic-blue/90"
                size="sm"
              >
                <PenTool className="w-4 h-4 mr-2" />
                Sign Petition
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed text-sm">
            {petition.description}
          </p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Signatures Progress</span>
              <span className="font-medium">
                {petition.currentSignatures.toLocaleString()} / {petition.targetSignatures.toLocaleString()}
              </span>
            </div>
            
            <Progress 
              value={progressPercentage} 
              className="h-3"
            />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 bg-gray-50">
                <Users className="w-4 h-4 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Support Level</div>
                  <div className="text-xs text-gray-600">{progressPercentage.toFixed(1)}% of target</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 bg-gray-50">
                <Calendar className="w-4 h-4 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Deadline</div>
                  <div className="text-xs text-gray-600">
                    {petition.deadlineDate ? formatDate(petition.deadlineDate) : 'No deadline set'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {petition.autoCreated && petition.voteThresholdMet && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Citizen-Initiated Petition
              </h4>
              <p className="text-orange-800 text-sm leading-relaxed">
                This petition was automatically created when citizen votes against the related legislation 
                reached the threshold for a formal petition ({petition.targetSignatures} signatures required).
                Vote threshold was met on {formatDate(petition.voteThresholdMet)}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <div className="container mx-auto py-8 px-4">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Citizen Petitions</h1>
          <p className="text-gray-600 mb-4">
            Sign petitions to Parliament or create new ones. Petitions with 500+ signatures are automatically forwarded to MPs.
          </p>
          <div className="flex gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {activePetitions.length} Active Petitions
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              {autoPetitions.length} Auto-Generated
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {successfulPetitions.length} Successful
            </span>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active ({activePetitions.length})</TabsTrigger>
            <TabsTrigger value="auto">Auto-Generated ({autoPetitions.length})</TabsTrigger>
            <TabsTrigger value="successful">Successful ({successfulPetitions.length})</TabsTrigger>
            <TabsTrigger value="all">All Petitions ({petitions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activePetitions.map((petition) => (
              <PetitionCard key={petition.id} petition={petition} />
            ))}
            {activePetitions.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <PenTool className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Active Petitions</h3>
                  <p className="text-gray-500">
                    New petitions will appear here. They can be created manually or automatically when vote thresholds are met.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="auto" className="space-y-6">
            {autoPetitions.map((petition) => (
              <PetitionCard key={petition.id} petition={petition} />
            ))}
            {autoPetitions.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Auto-Generated Petitions</h3>
                  <p className="text-gray-500">
                    When citizen votes against legislation reach the petition threshold, automatic petitions will be created here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="successful" className="space-y-6">
            {successfulPetitions.map((petition) => (
              <PetitionCard key={petition.id} petition={petition} />
            ))}
            {successfulPetitions.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Successful Petitions Yet</h3>
                  <p className="text-gray-500">
                    Petitions that reach their signature target will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            {petitions.map((petition) => (
              <PetitionCard key={petition.id} petition={petition} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}