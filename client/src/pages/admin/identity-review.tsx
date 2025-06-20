import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  FileText,
  Download,
  Clock
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PendingVerification {
  id: string;
  userId: string;
  email: string;
  submittedAt: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  riskScore: number;
  flaggedReasons: string[];
  faceMatchScore?: number;
  documents: {
    idFront: string;
    idBack: string;
    selfie: string;
    livenessVideo?: string;
  };
  metadata: {
    ipAddress: string;
    userAgent: string;
    geolocation: string;
    duplicateChecks: {
      idHash: boolean;
      faceVector: boolean;
      ipMatch: boolean;
    };
  };
}

export default function IdentityReview() {
  const [selectedVerification, setSelectedVerification] = useState<PendingVerification | null>(null);
  const { toast } = useToast();

  // Fetch pending verifications
  const { data: pendingVerifications = [], isLoading } = useQuery({
    queryKey: ['/api/admin/identity-verifications'],
    retry: false,
  });

  // Approve verification mutation
  const approveMutation = useMutation({
    mutationFn: async (verificationId: string) => {
      return apiRequest(`/api/admin/identity-verifications/${verificationId}/approve`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/identity-verifications'] });
      toast({
        title: "Verification Approved",
        description: "User has been granted full platform access",
      });
      setSelectedVerification(null);
    },
    onError: (error: any) => {
      toast({
        title: "Approval Failed",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // Reject verification mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ verificationId, reason }: { verificationId: string; reason: string }) => {
      return apiRequest(`/api/admin/identity-verifications/${verificationId}/reject`, "POST", { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/identity-verifications'] });
      toast({
        title: "Verification Rejected",
        description: "User will need to re-submit verification",
      });
      setSelectedVerification(null);
    },
    onError: (error: any) => {
      toast({
        title: "Rejection Failed",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const getRiskBadge = (score: number) => {
    if (score >= 80) return <Badge variant="destructive">High Risk</Badge>;
    if (score >= 50) return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Medium Risk</Badge>;
    return <Badge variant="default" className="bg-green-600">Low Risk</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'reviewing':
        return <Badge variant="outline" className="border-blue-500 text-blue-700"><Eye className="w-3 h-3 mr-1" />Reviewing</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
          <Shield className="w-6 h-6" />
          <span>Identity Verification Review</span>
        </h1>
        <p className="text-slate-600 mt-1">
          Review and approve pending identity verifications for CivicOS access
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Queue */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Pending Verifications ({pendingVerifications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingVerifications.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No pending verifications</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Risk Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingVerifications.map((verification: PendingVerification) => (
                        <TableRow 
                          key={verification.id}
                          className={selectedVerification?.id === verification.id ? "bg-blue-50" : ""}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{verification.email}</p>
                              <p className="text-sm text-slate-500">ID: {verification.userId}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(verification.submittedAt).toLocaleDateString()}
                              <br />
                              {new Date(verification.submittedAt).toLocaleTimeString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getRiskBadge(verification.riskScore)}
                            <br />
                            <span className="text-sm text-slate-500">{verification.riskScore}%</span>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(verification.status)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedVerification(verification)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Review Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Verification Details</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedVerification ? (
                <div className="text-center py-8 text-slate-500">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a verification to review</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* User Info */}
                  <div>
                    <h4 className="font-semibold mb-2">User Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Email:</strong> {selectedVerification.email}</p>
                      <p><strong>User ID:</strong> {selectedVerification.userId}</p>
                      <p><strong>Submitted:</strong> {new Date(selectedVerification.submittedAt).toLocaleString()}</p>
                      <p><strong>IP:</strong> {selectedVerification.metadata.ipAddress}</p>
                      <p><strong>Location:</strong> {selectedVerification.metadata.geolocation}</p>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div>
                    <h4 className="font-semibold mb-2">Risk Assessment</h4>
                    <div className="space-y-2">
                      {getRiskBadge(selectedVerification.riskScore)}
                      {selectedVerification.flaggedReasons.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-red-600 mb-1">Flagged Issues:</p>
                          <ul className="text-sm space-y-1">
                            {selectedVerification.flaggedReasons.map((reason, index) => (
                              <li key={index} className="flex items-center space-x-1">
                                <AlertTriangle className="w-3 h-3 text-red-500" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Duplicate Checks */}
                  <div>
                    <h4 className="font-semibold mb-2">Duplicate Checks</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        {selectedVerification.metadata.duplicateChecks.idHash ? (
                          <XCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <span>ID Hash Check</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {selectedVerification.metadata.duplicateChecks.faceVector ? (
                          <XCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <span>Face Vector Check</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {selectedVerification.metadata.duplicateChecks.ipMatch ? (
                          <XCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <span>IP Match Check</span>
                      </div>
                    </div>
                  </div>

                  {/* Face Match Score */}
                  {selectedVerification.faceMatchScore && (
                    <div>
                      <h4 className="font-semibold mb-2">Face Verification</h4>
                      <div className="text-sm">
                        <p>Match Score: <strong>{selectedVerification.faceMatchScore.toFixed(1)}%</strong></p>
                        {selectedVerification.faceMatchScore >= 75 ? (
                          <Badge variant="default" className="bg-green-600 mt-1">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Match Verified
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="mt-1">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Low Match Score
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  <div>
                    <h4 className="font-semibold mb-2">Uploaded Documents</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        View ID Front
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        View ID Back
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        View Selfie
                      </Button>
                      {selectedVerification.documents.livenessVideo && (
                        <Button variant="outline" size="sm" className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          View Liveness Video
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t">
                    <Button
                      onClick={() => approveMutation.mutate(selectedVerification.id)}
                      disabled={approveMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Verification
                    </Button>
                    <Button
                      onClick={() => rejectMutation.mutate({
                        verificationId: selectedVerification.id,
                        reason: "Failed manual review"
                      })}
                      disabled={rejectMutation.isPending}
                      variant="destructive"
                      className="w-full"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Verification
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}