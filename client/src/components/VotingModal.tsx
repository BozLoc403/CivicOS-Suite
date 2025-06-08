import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { VoteConfirmationModal } from "@/components/VoteConfirmationModal";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Shield, ExternalLink } from "lucide-react";
import type { Bill, Vote } from "@shared/schema";

interface VotingModalProps {
  bill: Bill;
  isOpen: boolean;
  onClose: () => void;
}

export function VotingModal({ bill, isOpen, onClose }: VotingModalProps) {
  const [voteValue, setVoteValue] = useState<string>("");
  const [reasoning, setReasoning] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [voteResult, setVoteResult] = useState<Vote | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: async (voteData: { billId: number; voteValue: string; reasoning?: string }) => {
      const response = await apiRequest("POST", "/api/votes", voteData);
      return await response.json();
    },
    onSuccess: (vote: Vote) => {
      setVoteResult(vote);
      setShowConfirmation(true);
      queryClient.invalidateQueries({ queryKey: ["/api/votes/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      toast({
        title: "Vote Cast Successfully",
        description: "Your vote has been recorded and verified.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to cast vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!voteValue) {
      toast({
        title: "Please Select Vote",
        description: "You must choose Support, Oppose, or Abstain.",
        variant: "destructive",
      });
      return;
    }

    voteMutation.mutate({
      billId: bill.id,
      voteValue,
      reasoning: reasoning.trim() || undefined,
    });
  };

  const handleClose = () => {
    if (!voteMutation.isPending) {
      setVoteValue("");
      setReasoning("");
      onClose();
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setVoteResult(null);
    handleClose();
  };

  return (
    <>
      <Dialog open={isOpen && !showConfirmation} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cast Your Vote</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Bill Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{bill.title}</h4>
              <p className="text-sm text-gray-600 mb-4">
                {bill.description || bill.aiSummary}
              </p>

              {/* Key Points */}
              {bill.aiSummary && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h5 className="font-medium text-gray-900 mb-2">AI Summary:</h5>
                  <p className="text-sm text-gray-600">{bill.aiSummary}</p>
                  <Button 
                    variant="link" 
                    className="civic-blue p-0 h-auto text-sm mt-2"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Read full bill
                  </Button>
                </div>
              )}
            </div>

            {/* Voting Options */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Your Vote</h5>
              <RadioGroup value={voteValue} onValueChange={setVoteValue}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-green-50 transition-colors">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900">Support</div>
                      <div className="text-sm text-gray-600">I support this legislation</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-red-50 transition-colors">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900">Oppose</div>
                      <div className="text-sm text-gray-600">I oppose this legislation</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="abstain" id="abstain" />
                    <Label htmlFor="abstain" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900">Abstain</div>
                      <div className="text-sm text-gray-600">I choose not to vote on this matter</div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Optional Comment */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Optional: Why are you voting this way? (Anonymous feedback)
              </Label>
              <Textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                rows={3}
                placeholder="Your reasoning will help inform policy makers..."
                className="resize-none"
              />
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="civic-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h6 className="font-medium civic-blue mb-1">Secure Voting Process</h6>
                  <p className="text-sm text-blue-700">
                    Your vote will be cryptographically signed and added to an immutable ledger. 
                    You will receive a verification receipt that you can use to confirm your vote was recorded correctly.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={handleClose}
                disabled={voteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={voteMutation.isPending || !voteValue}
                className="bg-civic-blue hover:bg-blue-700"
              >
                {voteMutation.isPending ? "Casting Vote..." : "Cast Vote Securely"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      {voteResult && (
        <VoteConfirmationModal
          vote={voteResult}
          bill={bill}
          isOpen={showConfirmation}
          onClose={handleConfirmationClose}
        />
      )}
    </>
  );
}
