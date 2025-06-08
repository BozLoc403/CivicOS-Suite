import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NavigationHeader } from "@/components/NavigationHeader";
import { VotingModal } from "@/components/VotingModal";
import { Clock, ExternalLink, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { Bill } from "@shared/schema";

export default function Voting() {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);

  const { data: bills = [], isLoading } = useQuery<Bill[]>({
    queryKey: ["/api/bills"],
  });

  const handleVoteClick = (bill: Bill) => {
    setSelectedBill(bill);
    setIsVotingModalOpen(true);
  };

  const formatTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) return `${diffDays} days`;
    if (diffDays === 1) return "1 day";
    return "Less than 24 hours";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-civic-blue mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading active legislation...</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Active Legislation</h2>
          <p className="text-gray-600">Review and vote on current bills and policies</p>
        </div>

        {/* Bills List */}
        {bills.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Legislation</h3>
              <p className="text-gray-600">
                There are currently no bills available for voting. Check back later for new legislation.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bills.map((bill) => (
              <Card key={bill.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{bill.title}</h3>
                        <Badge variant={bill.status === "Active" ? "default" : "secondary"}>
                          {bill.status}
                        </Badge>
                        {bill.jurisdiction === "Federal" && (
                          <Badge variant="outline" className="border-civic-blue text-civic-blue">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {bill.jurisdiction} · {bill.category}
                      </p>
                      <p className="text-gray-700 mb-4">{bill.description}</p>
                    </div>
                  </div>

                  {/* AI Summary */}
                  {bill.aiSummary && (
                    <div className="mb-6 bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">AI Summary:</h4>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {bill.aiSummary}
                      </p>
                      <Button variant="link" className="civic-blue p-0 h-auto text-sm">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Read full bill
                      </Button>
                    </div>
                  )}

                  {/* Public Sentiment */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Public Sentiment</span>
                      <span>Calculating...</span>
                    </div>
                    <Progress value={Math.random() * 100} className="h-2" />
                  </div>

                  {/* Action Bar */}
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {bill.votingDeadline 
                        ? `Voting ends in ${formatTimeRemaining(bill.votingDeadline)}`
                        : "No deadline set"
                      }
                    </div>
                    <Button
                      onClick={() => handleVoteClick(bill)}
                      className="bg-civic-blue hover:bg-blue-700"
                    >
                      Cast Vote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Voting Modal */}
      {selectedBill && (
        <VotingModal
          bill={selectedBill}
          isOpen={isVotingModalOpen}
          onClose={() => {
            setIsVotingModalOpen(false);
            setSelectedBill(null);
          }}
        />
      )}
    </div>
  );
}
