import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Eye,
  Search,
  Filter,
  User,
  Calendar,
  Camera,
  FileText
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminVerificationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVerification, setSelectedVerification] = useState<any>(null);

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Alert className="border-red-500 bg-red-50">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Access denied. Administrator privileges required to view this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { data: verifications = [], isLoading } = useQuery({
    queryKey: ["/api/admin/verification-queue"],
    retry: false,
  });

  const approveMutation = useMutation({
    mutationFn: async (data: { verificationId: number; notes?: string }) => {
      return apiRequest("/api/admin/approve-verification", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Verification Approved",
        description: "User has been granted verified status and civic privileges.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verification-queue"] });
      setSelectedVerification(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve verification",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (data: { verificationId: number; reason: string; notes?: string }) => {
      return apiRequest("/api/admin/reject-verification", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Verification Rejected",
        description: "User has been notified of the rejection with feedback.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verification-queue"] });
      setSelectedVerification(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject verification",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string, riskScore: number) => {
    if (status === "pending") {
      const riskLevel = riskScore > 70 ? "high" : riskScore > 40 ? "medium" : "low";
      const colorClass = riskLevel === "high" ? "bg-red-100 text-red-800" : 
                        riskLevel === "medium" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-green-100 text-green-800";
      
      return (
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-orange-500 text-orange-700">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
          <Badge className={colorClass}>
            Risk: {riskScore}%
          </Badge>
        </div>
      );
    }
    
    return status === "approved" ? (
      <Badge className="bg-green-600 text-white">
        <CheckCircle className="w-3 h-3 mr-1" />
        Approved
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" />
        Rejected
      </Badge>
    );
  };

  const filteredVerifications = verifications.filter((verification: any) => {
    const matchesTab = selectedTab === "all" || verification.status === selectedTab;
    const matchesSearch = !searchTerm || 
      verification.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Identity Verification Review</h1>
        <p className="text-slate-600">Review and approve government-grade identity verifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Queue */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Verification Queue</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search by email or document..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
                
                <TabsContent value={selectedTab} className="mt-6">
                  <div className="space-y-4">
                    {filteredVerifications.length === 0 ? (
                      <div className="text-center py-8">
                        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No verifications found</p>
                      </div>
                    ) : (
                      filteredVerifications.map((verification: any) => (
                        <Card 
                          key={verification.id} 
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            selectedVerification?.id === verification.id && "ring-2 ring-blue-500"
                          )}
                          onClick={() => setSelectedVerification(verification)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span className="font-medium">{verification.email}</span>
                                  {getStatusBadge(verification.status, verification.riskScore)}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(verification.submittedAt).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <FileText className="w-3 h-3" />
                                    <span>{verification.documentType || 'Unknown'}</span>
                                  </div>
                                  {verification.faceMatchScore && (
                                    <div className="flex items-center space-x-1">
                                      <Camera className="w-3 h-3" />
                                      <span>Match: {verification.faceMatchScore}%</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Review Panel */}
        <div>
          {selectedVerification ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Review Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">User Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Email:</strong> {selectedVerification.email}</p>
                    <p><strong>Submitted:</strong> {new Date(selectedVerification.submittedAt).toLocaleString()}</p>
                    <p><strong>IP Address:</strong> {selectedVerification.ipAddress || 'Unknown'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Verification Steps</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Verified</span>
                      {selectedVerification.emailVerified ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">TOTP MFA</span>
                      {selectedVerification.totpVerified ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Terms Agreed</span>
                      {selectedVerification.termsAgreed ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>

                {selectedVerification.faceMatchScore && (
                  <div>
                    <h4 className="font-medium mb-2">Biometric Analysis</h4>
                    <div className="text-sm">
                      <p><strong>Face Match Score:</strong> {selectedVerification.faceMatchScore}%</p>
                      <p><strong>Risk Score:</strong> {selectedVerification.riskScore}%</p>
                    </div>
                  </div>
                )}

                {selectedVerification.flaggedReasons?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">Flagged Issues</h4>
                    <ul className="text-sm space-y-1">
                      {selectedVerification.flaggedReasons.map((reason: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedVerification.status === "pending" && (
                  <div className="space-y-3 pt-4 border-t">
                    <Button 
                      onClick={() => approveMutation.mutate({ verificationId: selectedVerification.id })}
                      disabled={approveMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Verification
                    </Button>
                    <Button 
                      onClick={() => rejectMutation.mutate({ 
                        verificationId: selectedVerification.id, 
                        reason: "Manual review rejection"
                      })}
                      disabled={rejectMutation.isPending}
                      variant="destructive"
                      className="w-full"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Verification
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a verification to review</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}