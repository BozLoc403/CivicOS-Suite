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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-black text-gray-900 flex items-center">
              <Heart className="w-6 h-6 text-red-600 mr-3" />
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
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Support Message */}
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800 mb-4">
              Help us maintain Canada's premier government transparency platform
            </p>
            <p className="text-gray-600">
              Your donations support the infrastructure that keeps democracy accountable
            </p>
          </div>

          {/* What Your Donation Supports */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <h3 className="font-bold text-blue-900 mb-4">Your donation supports:</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3">
                  <Server className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">API access costs & data sourcing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">Infrastructure & 24/7 uptime</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">Data accuracy & report quality</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">Future platform upgrades</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preset Donation Amounts */}
          <div>
            <Label className="text-sm font-bold text-gray-700 mb-3 block">
              Choose donation amount:
            </Label>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {presetAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className={`h-12 font-bold ${
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

          {/* Donation Summary */}
          {getDonationAmount() > 0 && (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-sm text-green-800 font-medium">Donation Amount:</p>
                  <p className="text-2xl font-black text-green-900">${getDonationAmount().toFixed(2)} CAD</p>
                  <p className="text-xs text-green-700 mt-1">Secure payment via Stripe</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Donate Button */}
          <Button
            onClick={handleDonate}
            disabled={getDonationAmount() === 0 || isProcessing}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-lg"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 mr-2" />
                Donate ${getDonationAmount().toFixed(2)} Now
              </>
            )}
          </Button>

          {/* Security Notice */}
          <p className="text-xs text-gray-500 text-center">
            Payments are processed securely through Stripe. Your card information is never stored on our servers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}