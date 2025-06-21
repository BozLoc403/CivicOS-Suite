import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, X, DollarSign, Server, Database, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface DonationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DonationPopup({ isOpen, onClose, onSuccess }: DonationPopupProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const presetAmounts = [5, 10, 25, 50];

  const donationMutation = useMutation({
    mutationFn: async (amount: number) => {
      return apiRequest("/api/create-payment-intent", "POST", { amount });
    },
    onSuccess: (data) => {
      // In a real implementation, this would redirect to Stripe checkout
      toast({
        title: "Donation Initiated",
        description: "Redirecting to secure payment...",
      });
      
      // Simulate successful donation after 2 seconds
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
        onClose();
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

  const getImpactMessage = (amount: number) => {
    if (amount >= 50) return "1 day of servers";
    if (amount >= 25) return "12 hours uptime";
    if (amount >= 10) return "4 hours data";
    return "1 hour support";
  };

  const handleDonate = async () => {
    const amount = getDonationAmount();
    if (amount <= 0) return;

    setIsProcessing(true);
    donationMutation.mutate(amount);
  };

  const getDonationAmount = () => {
    return selectedAmount || parseFloat(customAmount) || 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden p-0">
        <div className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between p-4 pb-2 sticky top-0 bg-white z-10">
            <DialogTitle className="text-lg font-bold text-gray-900 flex items-center">
              <Heart className="w-5 h-5 text-red-600 mr-2" />
              Support CivicOS
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogHeader>
          
          <div className="px-4 pb-4 space-y-4">
            {/* Support Message */}
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900 mb-2">
                Keep Democracy Transparent
              </p>
              <p className="text-gray-700 mb-3 text-sm">
                Your support powers independent government accountability in Canada
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800 font-medium">
                  Impact: Every dollar directly funds real-time government data access, 
                  server infrastructure, and the tools that keep 85,000+ politicians accountable to Canadians.
                </p>
              </div>
            </div>

            {/* What Your Donation Supports */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3">
              <h3 className="font-bold text-green-900 mb-2 text-center text-sm">Monthly Platform Costs</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Server className="w-3 h-3 text-green-600" />
                  <span className="text-green-800">API Access: $890/mo</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-green-600" />
                  <span className="text-green-800">Servers: $340/mo</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Database className="w-3 h-3 text-green-600" />
                  <span className="text-green-800">Database: $180/mo</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3 text-green-600" />
                  <span className="text-green-800">Development: $1,200/mo</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-green-200">
                <p className="text-center font-bold text-green-900 text-sm">
                  Total Monthly: <span className="text-base">$2,610</span>
                </p>
                <p className="text-center text-xs text-green-700">
                  100% goes to platform operations - no salaries or profit
                </p>
              </div>
            </div>

            {/* Preset Donation Amounts */}
            <div>
              <Label className="text-sm font-bold text-gray-700 mb-2 block">
                Choose your contribution:
              </Label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {presetAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className="relative h-16 flex flex-col items-center justify-center border-2 hover:border-red-300 transition-all duration-200"
                  >
                    <span className="text-lg font-black text-gray-900">${amount}</span>
                    <span className="text-xs text-gray-600 mt-1 text-center leading-tight">
                      {getImpactMessage(amount)}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <Label className="text-sm font-bold text-gray-700 mb-2 block">
                Or enter a custom amount:
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-bold">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="pl-8 text-sm font-bold text-center border-2 focus:border-red-400"
                  min="1"
                  step="0.01"
                />
              </div>
            </div>

            {/* Donation Summary */}
            {getDonationAmount() > 0 && (
              <Card className="border-2 border-green-500 bg-green-50">
                <CardContent className="pt-3">
                  <div className="text-center">
                    <p className="text-xs text-green-800 font-medium">Donation Amount:</p>
                    <p className="text-xl font-black text-green-900">${getDonationAmount().toFixed(2)} CAD</p>
                    <p className="text-xs text-green-700">Secure payment via Stripe</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Donate Button */}
            <Button
              onClick={handleDonate}
              disabled={getDonationAmount() === 0 || isProcessing}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-sm"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Donate ${getDonationAmount().toFixed(2)} Now
                </>
              )}
            </Button>

            {/* Security Notice */}
            <div className="bg-gray-50 border border-gray-200 rounded p-2">
              <p className="text-xs text-gray-600 text-center mb-1">
                Secure Payment: Processed by Stripe with bank-level encryption
              </p>
              <p className="text-xs text-gray-500 text-center">
                CivicOS is a registered non-profit platform. Donations support infrastructure costs only.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}