import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, CheckCircle, Share2, Twitter, Linkedin, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DonationSuccess() {
  const [location, setLocation] = useLocation();
  const [amount, setAmount] = useState("0");
  const { toast } = useToast();

  useEffect(() => {
    // Get amount from URL params
    const params = new URLSearchParams(window.location.search);
    const donationAmount = params.get('amount') || '0';
    setAmount(donationAmount);
  }, []);

  const shareMessage = `I just supported CivicOS, Canada's independent political transparency platform! Help keep our democracy accountable. #CivicOS #CanadianDemocracy`;
  const shareUrl = window.location.origin;

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareByEmail = () => {
    const subject = "Supporting Canadian Democracy with CivicOS";
    const body = `${shareMessage}\n\nCheck it out: ${shareUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            Thank You!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Your donation of</p>
            <p className="text-3xl font-bold text-green-600">${amount} CAD</p>
            <p className="text-sm text-gray-500 mt-2">
              has been successfully processed
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Heart className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Impact of Your Donation
                </p>
                <p className="text-xs text-blue-700">
                  Your contribution directly supports server infrastructure, government data access, 
                  and the tools that keep 85,000+ Canadian politicians accountable to citizens.
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">
              Help spread the word about CivicOS:
            </p>
            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={shareOnTwitter}
                className="flex items-center space-x-2"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareOnLinkedIn}
                className="flex items-center space-x-2"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareByEmail}
                className="flex items-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </Button>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button
              onClick={() => setLocation("/")}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Return to CivicOS
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>Receipt will be sent to your email address.</p>
            <p className="mt-1">Questions? Contact support@civicos.ca</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}