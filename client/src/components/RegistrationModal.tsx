import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Shield, Info } from "lucide-react";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    electoralDistrict: "",
    phoneNumber: "",
    agreeToTerms: false,
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: { electoralDistrict: string; phoneNumber: string }) => {
      const response = await apiRequest("POST", "/api/user/profile", profileData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setStep(2);
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const verifyUserMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/user/verify", {});
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Verification Complete",
        description: "Your account has been verified successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitProfile = () => {
    if (!formData.electoralDistrict || !formData.phoneNumber || !formData.agreeToTerms) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and agree to the terms.",
        variant: "destructive",
      });
      return;
    }

    updateProfileMutation.mutate({
      electoralDistrict: formData.electoralDistrict,
      phoneNumber: formData.phoneNumber,
    });
  };

  const handleVerification = () => {
    verifyUserMutation.mutate();
  };

  const handleClose = () => {
    if (!updateProfileMutation.isPending && !verifyUserMutation.isPending) {
      setStep(1);
      setFormData({
        electoralDistrict: "",
        phoneNumber: "",
        agreeToTerms: false,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Secure Registration</DialogTitle>
          <p className="text-sm text-gray-600">
            Step {step} of 2: {step === 1 ? "Basic Information" : "Identity Verification"}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {step === 1 ? (
            <>
              {/* Basic Information Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="electoralDistrict" className="text-sm font-medium text-gray-700">
                    Electoral District *
                  </Label>
                  <Select
                    value={formData.electoralDistrict}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, electoralDistrict: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your riding..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="toronto-centre">Toronto Centre</SelectItem>
                      <SelectItem value="vancouver-east">Vancouver East</SelectItem>
                      <SelectItem value="calgary-west">Calgary West</SelectItem>
                      <SelectItem value="montreal-downtown">Montreal Downtown</SelectItem>
                      <SelectItem value="ottawa-vanier">Ottawa-Vanier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="civic-blue mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h6 className="font-medium civic-blue mb-1">Privacy & Security</h6>
                    <p className="text-sm text-blue-700">
                      Your personal information is encrypted and stored securely. We only verify your eligibility to vote - your actual votes remain anonymous.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                  }
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="civic-blue hover:underline">Terms of Service</a> and{" "}
                  <a href="#" className="civic-blue hover:underline">Privacy Policy</a>
                </Label>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitProfile}
                  disabled={updateProfileMutation.isPending}
                  className="bg-civic-blue hover:bg-blue-700"
                >
                  {updateProfileMutation.isPending ? "Updating..." : "Continue to Verification"}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Verification Step */}
              <div className="text-center">
                <Shield className="w-16 h-16 civic-blue mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Identity Verification</h3>
                <p className="text-sm text-gray-600 mb-6">
                  For this MVP, we'll verify your identity with the information you've provided. 
                  In the full version, this would include document upload and biometric verification.
                </p>
              </div>

              <div className="bg-civic-green/10 border border-civic-green/20 rounded-lg p-4">
                <div className="flex items-start">
                  <Shield className="civic-green mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h6 className="font-medium civic-green mb-1">Verification Process</h6>
                    <p className="text-sm text-green-700">
                      Your eligibility will be verified against electoral rolls. This process ensures only eligible citizens can participate in voting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={handleVerification}
                  disabled={verifyUserMutation.isPending}
                  className="bg-civic-green hover:bg-green-700"
                >
                  {verifyUserMutation.isPending ? "Verifying..." : "Complete Verification"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
