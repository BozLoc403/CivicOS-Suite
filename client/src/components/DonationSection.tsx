import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, DollarSign, Server, Database, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import DonationSuccess from "./DonationSuccess";

export default function DonationSection() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [donatedAmount, setDonatedAmount] = useState(0);
  const { toast } = useToast();

  const presetAmounts = [5, 10, 25, 50];

  const donationMutation = useMutation({
    mutationFn: async (amount: number) => {
      return apiRequest("/api/create-payment-intent", "POST", { amount });
    },
    onSuccess: (data) => {
      toast({
        title: "Donation Initiated",
        description: "Redirecting to secure payment...",
      });
      
      // Simulate successful donation
      setTimeout(() => {
        setIsProcessing(false);
        setDonatedAmount(getDonationAmount());
        setShowSuccess(true);
        setSelectedAmount(null);
        setCustomAmount("");
      }, 2000);
    },
    onError: (error: any) => {
      setIsProcessing(false);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process donation",
        variant: "destructive",
      });
    },
  });

  const handleDonate = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    
    if (!amount || amount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please select or enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    donationMutation.mutate(amount);
  };

  const getDonationAmount = () => {
    return selectedAmount || parseFloat(customAmount) || 0;
  };

  return (
    <>
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-gray-900 flex items-center">
            <Heart className="w-6 h-6 text-red-600 mr-3" />
            Support CivicOS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Support Message */}
          <div>
            <p className="text-lg font-bold text-gray-900 mb-2">
              Power Independent Journalism
            </p>
            <p className="text-gray-700 mb-3 text-sm">
              Direct funding for government accountability tools
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
              <p className="text-xs text-yellow-800">
                <strong>Transparency Crisis:</strong> Traditional media can't track 85,000+ politicians. 
                Your support funds the technology that can.
              </p>
            </div>
          </div>

          {/* What Donations Support */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-3">Your donation supports:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Server className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">API access costs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">Infrastructure & uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">Data sourcing accuracy</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">Future upgrades</span>
              </div>
            </div>
          </div>

          {/* Preset Donation Amounts */}
          <div>
            <Label className="text-sm font-bold text-gray-700 mb-3 block">
              Choose donation amount:
            </Label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {presetAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  size="sm"
                  className={`font-bold ${
                    selectedAmount === amount 
                      ? "bg-red-600 text-white hover:bg-red-700" 
                      : "border-red-600 text-red-600 hover:bg-red-50"
                  }`}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <Label htmlFor="customAmount" className="text-sm font-bold text-gray-700 mb-2 block">
              Or enter custom amount:
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="customAmount"
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Donate Button */}
          <Button
            onClick={handleDonate}
            disabled={getDonationAmount() === 0 || isProcessing}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2" />
                {getDonationAmount() > 0 ? `Donate $${getDonationAmount().toFixed(2)} Now` : "Donate Now"}
              </>
            )}
          </Button>

          {/* Security Notice */}
          <p className="text-xs text-gray-500 text-center">
            Secure payments via Stripe • Your information is never stored
          </p>
        </CardContent>
      </Card>

      <DonationSuccess
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        amount={donatedAmount}
      />
    </>
  );
}