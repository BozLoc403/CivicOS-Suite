import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LuxuryNavigation } from "@/components/layout/LuxuryNavigation";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  FileText, 
  Users, 
  Plus, 
  TrendingUp, 
  Clock, 
  Target,
  CheckCircle,
  AlertCircle,
  Share2,
  Eye,
  MessageCircle
} from "lucide-react";

interface Petition {
  id: number;
  title: string;
  description: string;
  targetSignatures: number;
  currentSignatures: number;
  creatorId: string;
  targetOfficial?: string;
  billId?: number;
  category: string;
  status: "active" | "successful" | "closed";
  createdAt: string;
  deadlineDate?: string;
  isVerified: boolean;
  creator?: {
    firstName: string;
    email: string;
    profileImageUrl?: string;
  };
  bill?: {
    title: string;
    billNumber: string;
  };
}

interface Bill {
  id: number;
  title: string;
  billNumber: string;
  status: string;
}

export default function Petitions() {
  const [showCreatePetition, setShowCreatePetition] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [newPetition, setNewPetition] = useState({
    title: "",
    description: "",
    targetSignatures: 1000,
    targetOfficial: "",
    billId: "",
    category: "general",
    deadlineDate: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch petitions
  const { data: petitions = [], isLoading: petitionsLoading } = useQuery<Petition[]>({
    queryKey: ["/api/petitions", selectedCategory, sortBy]
  });

  // Fetch bills for petition targeting
  const { data: bills = [] } = useQuery<Bill[]>({
    queryKey: ["/api/bills"]
  });

  // Create petition mutation
  const createPetitionMutation = useMutation({
    mutationFn: async (petitionData: any) => {
      return await apiRequest("/api/petitions", "POST", petitionData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your petition has been created successfully!"
      });
      setShowCreatePetition(false);
      setNewPetition({
        title: "",
        description: "",
        targetSignatures: 1000,
        targetOfficial: "",
        billId: "",
        category: "general",
        deadlineDate: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/petitions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create petition",
        variant: "destructive"
      });
    }
  });

  // Sign petition mutation
  const signPetitionMutation = useMutation({
    mutationFn: async (petitionId: number) => {
      return await apiRequest(`/api/petitions/${petitionId}/sign`, "POST");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Thank you for signing this petition!"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/petitions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to sign petition",
        variant: "destructive"
      });
    }
  });

  const handleCreatePetition = () => {
    if (!newPetition.title.trim() || !newPetition.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    createPetitionMutation.mutate({
      title: newPetition.title,
      description: newPetition.description,
      targetSignatures: newPetition.targetSignatures,
      targetOfficial: newPetition.targetOfficial || undefined,
      billId: newPetition.billId ? parseInt(newPetition.billId) : undefined,
      category: newPetition.category,
      deadlineDate: newPetition.deadlineDate || undefined
    });
  };

  const handleSignPetition = (petitionId: number) => {
    signPetitionMutation.mutate(petitionId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      case "successful": return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "closed": return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const filteredPetitions = petitions.filter(petition => 
    selectedCategory === "all" || petition.category === selectedCategory
  );

  const categories = [
    { value: "all", label: "All Petitions" },
    { value: "federal", label: "Federal Issues" },
    { value: "provincial", label: "Provincial Issues" },
    { value: "municipal", label: "Municipal Issues" },
    { value: "environment", label: "Environment" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "justice", label: "Justice & Rights" },
    { value: "general", label: "General" }
  ];

  return (
    <div>
      <LuxuryNavigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Petitions
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Create and sign petitions to drive legislative change
            </p>
          </div>

        <Dialog open={showCreatePetition} onOpenChange={setShowCreatePetition}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Petition
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create a New Petition</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={newPetition.title}
                  onChange={(e) => setNewPetition({ ...newPetition, title: e.target.value })}
                  placeholder="Enter petition title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select
                  value={newPetition.category}
                  onValueChange={(value) => setNewPetition({ ...newPetition, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat.value !== "all").map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Bill (Optional)</label>
                <Select
                  value={newPetition.billId}
                  onValueChange={(value) => setNewPetition({ ...newPetition, billId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bill to petition against" />
                  </SelectTrigger>
                  <SelectContent>
                    {bills.map((bill) => (
                      <SelectItem key={bill.id} value={bill.id.toString()}>
                        {bill.billNumber}: {bill.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Official (Optional)</label>
                <Input
                  value={newPetition.targetOfficial}
                  onChange={(e) => setNewPetition({ ...newPetition, targetOfficial: e.target.value })}
                  placeholder="e.g., Prime Minister, Minister of Health"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Signature Goal</label>
                <Input
                  type="number"
                  value={newPetition.targetSignatures}
                  onChange={(e) => setNewPetition({ ...newPetition, targetSignatures: parseInt(e.target.value) || 1000 })}
                  min="100"
                  max="1000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Deadline (Optional)</label>
                <Input
                  type="date"
                  value={newPetition.deadlineDate}
                  onChange={(e) => setNewPetition({ ...newPetition, deadlineDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={newPetition.description}
                  onChange={(e) => setNewPetition({ ...newPetition, description: e.target.value })}
                  placeholder="Explain why this petition is important and what you want to achieve..."
                  rows={6}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowCreatePetition(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreatePetition}
                  disabled={createPetitionMutation.isPending}
                >
                  {createPetitionMutation.isPending ? "Creating..." : "Create Petition"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Signatures</SelectItem>
            <SelectItem value="deadline">Deadline Soon</SelectItem>
            <SelectItem value="progress">Most Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Petitions List */}
      <div className="space-y-6">
        {petitionsLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading petitions...</p>
          </div>
        ) : filteredPetitions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No petitions found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Be the first to create a petition in this category!
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPetitions.map((petition) => {
            const progressPercentage = getProgressPercentage(petition.currentSignatures, petition.targetSignatures);
            const isSuccessful = petition.currentSignatures >= petition.targetSignatures;
            
            return (
              <Card key={petition.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getStatusColor(petition.status)}>
                          {petition.status.charAt(0).toUpperCase() + petition.status.slice(1)}
                        </Badge>
                        {petition.isVerified && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {petition.bill && (
                          <Badge variant="secondary">
                            Against {petition.bill.billNumber}
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {petition.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {petition.description}
                      </p>

                      {petition.targetOfficial && (
                        <div className="flex items-center space-x-2 mb-3">
                          <Target className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Directed to: {petition.targetOfficial}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="ml-6 text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {typeof petition.currentSignatures === 'number' ? petition.currentSignatures.toLocaleString() : '0'}
                      </div>
                      <div className="text-sm text-gray-500">
                        of {typeof petition.targetSignatures === 'number' ? petition.targetSignatures.toLocaleString() : '500'} signatures
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progress
                      </span>
                      <span className="text-sm text-gray-500">
                        {progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className={`h-2 ${isSuccessful ? 'bg-green-200' : 'bg-gray-200'}`}
                    />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {petition.creator?.firstName?.[0] || petition.creator?.email?.[0] || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <span>{petition.creator?.firstName || petition.creator?.email?.split('@')[0]}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(petition.createdAt).toLocaleDateString()}</span>
                      </div>

                      {petition.deadlineDate && (
                        <div className="flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>Deadline: {new Date(petition.deadlineDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      
                      {petition.status === "active" && !isSuccessful && (
                        <Button 
                          onClick={() => handleSignPetition(petition.id)}
                          disabled={signPetitionMutation.isPending}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Users className="h-4 w-4 mr-1" />
                          {signPetitionMutation.isPending ? "Signing..." : "Sign Petition"}
                        </Button>
                      )}

                      {isSuccessful && (
                        <Button disabled className="bg-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Goal Reached!
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
      </div>
    </div>
  );
}