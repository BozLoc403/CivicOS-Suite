import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Download, Eye } from "lucide-react";
import type { Bill, Vote } from "@shared/schema";

interface VoteConfirmationModalProps {
  vote: Vote;
  bill: Bill;
  isOpen: boolean;
  onClose: () => void;
}

export function VoteConfirmationModal({ vote, bill, isOpen, onClose }: VoteConfirmationModalProps) {
  const formatDate = (timestamp: string | Date) => {
    return new Date(timestamp).toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getVoteColor = (voteValue: string) => {
    switch (voteValue) {
      case "yes": return "bg-civic-green text-white";
      case "no": return "bg-civic-red text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getVoteLabel = (voteValue: string) => {
    switch (voteValue) {
      case "yes": return "Support";
      case "no": return "Oppose";
      default: return "Abstain";
    }
  };

  const downloadReceipt = () => {
    const receiptData = {
      bill: {
        number: bill.billNumber,
        title: bill.title,
      },
      vote: {
        value: vote.voteValue,
        timestamp: vote.timestamp,
        verificationId: vote.verificationId,
        blockHash: vote.blockHash,
      },
      security: {
        cryptographicallyVerified: true,
        immutable: true,
      }
    };
    
    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `civicos-vote-receipt-${vote.verificationId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const viewInLedger = () => {
    onClose();
    window.location.href = '/ledger';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-civic-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-white text-2xl" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Vote Confirmed</h3>
          <p className="text-gray-600 mb-6">Your vote has been securely recorded and verified.</p>
          
          {/* Vote Receipt */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-medium text-gray-900 mb-3">Vote Receipt</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bill:</span>
                <span className="font-medium">{bill.billNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vote:</span>
                <Badge className={getVoteColor(vote.voteValue)}>
                  {getVoteLabel(vote.voteValue)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Timestamp:</span>
                <span className="font-medium font-mono text-xs">
                  {formatDate(vote.timestamp!)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Verification ID:</span>
                <span className="font-medium font-mono text-xs">
                  {vote.verificationId}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Block Hash:</span>
                <span className="font-medium font-mono text-xs break-all text-right max-w-[150px]">
                  {vote.blockHash}
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={downloadReceipt}
              className="w-full bg-civic-blue hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button
              variant="outline"
              onClick={viewInLedger}
              className="w-full border-civic-blue text-civic-blue hover:bg-civic-blue hover:text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              View in My Ledger
            </Button>
            <Button
              variant="link"
              onClick={onClose}
              className="w-full civic-blue"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
