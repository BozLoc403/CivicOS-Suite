import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NavigationHeader } from "@/components/NavigationHeader";
import { Shield, Download, Eye, AlertCircle } from "lucide-react";
import type { Vote, Bill } from "@shared/schema";

export default function Ledger() {
  const { data: votes = [], isLoading } = useQuery<(Vote & { bill: Bill })[]>({
    queryKey: ["/api/votes/user"],
  });

  const getVoteColor = (vote: string) => {
    switch (vote) {
      case "yes": return "bg-civic-green text-white";
      case "no": return "bg-civic-red text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const formatDate = (timestamp: string | Date) => {
    return new Date(timestamp).toLocaleString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadReceipt = (vote: Vote) => {
    const receiptData = {
      billNumber: vote.billId,
      vote: vote.voteValue,
      timestamp: vote.timestamp,
      verificationId: vote.verificationId,
      blockHash: vote.blockHash
    };
    
    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vote-receipt-${vote.verificationId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-civic-blue mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your voting ledger...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Voting Ledger</h2>
          <p className="text-gray-600">Cryptographically verified record of all your votes</p>
        </div>

        {/* Security Notice */}
        <Card className="mb-8 bg-civic-green text-white">
          <CardContent className="p-6">
            <div className="flex items-start">
              <Shield className="text-2xl mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Cryptographic Security</h3>
                <p className="text-sm opacity-90">
                  Every vote is secured with a unique verification ID and block hash. 
                  This ensures your votes cannot be tampered with or deleted. 
                  You can download individual receipts as proof of participation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voting History */}
        {votes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Votes Cast</h3>
              <p className="text-gray-600 mb-4">
                You haven't cast any votes yet. Visit the Active Legislation page to participate in democracy.
              </p>
              <Button className="bg-civic-blue hover:bg-blue-700">
                View Active Bills
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {votes.map((vote) => (
              <Card key={vote.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vote.bill.title}
                        </h3>
                        <Badge className={getVoteColor(vote.voteValue)}>
                          {vote.voteValue.toUpperCase()}
                        </Badge>
                        <Shield className="civic-green w-5 h-5" title="Cryptographically Verified" />
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {vote.bill.jurisdiction} · {vote.bill.category}
                      </p>

                      {vote.reasoning && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Your reasoning:</p>
                          <p className="text-sm text-gray-600 italic">"{vote.reasoning}"</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Timestamp:</span> {formatDate(vote.timestamp!)}
                        </div>
                        <div>
                          <span className="font-medium">Verification ID:</span>
                          <code className="ml-1 bg-gray-100 px-1 rounded text-xs">
                            {vote.verificationId}
                          </code>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium">Block Hash:</span>
                          <code className="ml-1 bg-gray-100 px-1 rounded text-xs break-all">
                            {vote.blockHash}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:ml-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReceipt(vote)}
                        className="text-civic-blue border-civic-blue hover:bg-civic-blue hover:text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Receipt
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-600 border-gray-300 hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Verify on Blockchain
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {votes.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Showing {votes.length} vote{votes.length !== 1 ? 's' : ''} · 
              All votes are cryptographically verified and immutable
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
