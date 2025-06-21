import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Share2, Twitter, Linkedin, Mail } from "lucide-react";

interface DonationSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

export default function DonationSuccess({ isOpen, onClose, amount }: DonationSuccessProps) {
  const shareText = "I just supported CivicOS - Canada's premier government transparency platform. Join me in keeping democracy accountable! 🇨🇦";
  const shareUrl = window.location.origin;

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleEmailShare = () => {
    const subject = "Check out CivicOS - Canadian Government Transparency Platform";
    const body = `${shareText}\n\nVisit: ${shareUrl}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-green-900 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            Thank You!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-center">
          {/* Success Message */}
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg font-bold text-green-900 mb-2">
                  Your ${amount?.toFixed(2)} donation was successful!
                </p>
                <p className="text-green-800 font-medium">
                  Thanks for supporting truth infrastructure.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Impact Message */}
          <div className="space-y-3">
            <p className="text-gray-700 font-semibold">
              Your contribution helps maintain:
            </p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>✓ Real-time government data access</p>
              <p>✓ Secure platform infrastructure</p>
              <p>✓ Independent journalism support</p>
              <p>✓ Democratic accountability tools</p>
            </div>
          </div>

          {/* Share Section */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-center mb-3">
                <Share2 className="w-5 h-5 text-gray-600 mr-2" />
                <p className="font-bold text-gray-800">Share CivicOS with your network</p>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Help spread government transparency across Canada
              </p>
            </div>

            {/* Share Buttons */}
            <div className="flex justify-center space-x-3">
              <Button
                onClick={handleTwitterShare}
                variant="outline"
                className="border-blue-400 text-blue-600 hover:bg-blue-50"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              
              <Button
                onClick={handleLinkedInShare}
                variant="outline"
                className="border-blue-700 text-blue-700 hover:bg-blue-50"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              
              <Button
                onClick={handleEmailShare}
                variant="outline"
                className="border-gray-600 text-gray-600 hover:bg-gray-50"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
          >
            Continue to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}