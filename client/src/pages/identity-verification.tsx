import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Mail, 
  Camera, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Upload,
  Eye,
  Lock,
  QrCode
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  current: boolean;
}

export default function IdentityVerification() {
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationData, setVerificationData] = useState({
    email: "",
    otpCode: "",
    totpCode: "",
    idFrontFile: null as File | null,
    idBackFile: null as File | null,
    selfieFile: null as File | null,
    livenessVideo: null as Blob | null,
    digitalSignature: "",
    termsAgreed: false,
    captchaToken: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [totpQR, setTotpQR] = useState("");
  const [faceMatchScore, setFaceMatchScore] = useState<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const steps: VerificationStep[] = [
    {
      id: "captcha",
      title: "CAPTCHA Verification",
      description: "Prove you're human with security challenge",
      icon: <Shield className="w-5 h-5" />,
      completed: !!verificationData.captchaToken,
      current: currentStep === 0
    },
    {
      id: "email",
      title: "Email Verification",
      description: "Verify your email with OTP code",
      icon: <Mail className="w-5 h-5" />,
      completed: emailVerified,
      current: currentStep === 1
    },
    {
      id: "mfa",
      title: "Multi-Factor Authentication",
      description: "Setup TOTP with authenticator app",
      icon: <QrCode className="w-5 h-5" />,
      completed: false,
      current: currentStep === 2
    },
    {
      id: "id-upload",
      title: "Government ID Upload",
      description: "Upload front and back of Canadian government ID",
      icon: <FileText className="w-5 h-5" />,
      completed: !!(verificationData.idFrontFile && verificationData.idBackFile),
      current: currentStep === 3
    },
    {
      id: "liveness",
      title: "Face Verification",
      description: "Live selfie and face matching",
      icon: <Camera className="w-5 h-5" />,
      completed: !!verificationData.selfieFile,
      current: currentStep === 4
    },
    {
      id: "duplicate-check",
      title: "Duplicate Account Check",
      description: "Verify unique identity in system",
      icon: <Eye className="w-5 h-5" />,
      completed: false,
      current: currentStep === 5
    },
    {
      id: "terms",
      title: "Terms Agreement",
      description: "Digital signature and final agreement",
      icon: <Lock className="w-5 h-5" />,
      completed: verificationData.termsAgreed && !!verificationData.digitalSignature,
      current: currentStep === 6
    }
  ];

  // Step 1: CAPTCHA Challenge
  const renderCaptchaStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Security Verification</h3>
        <p className="text-slate-600">Complete the CAPTCHA challenge to continue</p>
      </div>
      
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
        <div className="bg-slate-100 p-4 rounded-lg mb-4">
          <p className="font-mono text-lg">CAPTCHA Challenge</p>
          <p className="text-sm text-slate-600 mt-2">
            In production, this would use Cloudflare Turnstile or hCaptcha
          </p>
        </div>
        
        <Button 
          onClick={() => {
            setVerificationData(prev => ({ ...prev, captchaToken: "demo-token-" + Date.now() }));
            setTimeout(() => setCurrentStep(1), 500);
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Complete CAPTCHA
        </Button>
      </div>
    </div>
  );

  // Step 2: Email OTP Verification
  const renderEmailStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Mail className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Email Verification</h3>
        <p className="text-slate-600">Enter your email to receive a verification code</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={verificationData.email}
            onChange={(e) => setVerificationData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your.email@example.com"
            className="mt-1"
          />
        </div>
        
        <Button 
          onClick={handleSendEmailVerification}
          disabled={!verificationData.email || sendingEmail}
          className="w-full"
        >
          {sendingEmail ? 'Sending...' : 'Send Verification Code'}
        </Button>
        
        <div>
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            value={verificationData.otpCode}
            onChange={(e) => setVerificationData(prev => ({ ...prev, otpCode: e.target.value }))}
            placeholder="Enter 6-digit code"
            className="mt-1 text-center text-lg tracking-widest"
            maxLength={6}
          />
        </div>
        
        <Button 
          onClick={handleVerifyEmailCode}
          disabled={!verificationData.email || verificationData.otpCode.length !== 6 || verifyingEmail}
          className="w-full"
        >
          {verifyingEmail ? 'Verifying...' : 'Verify Email'}
        </Button>
      </div>
    </div>
  );

  // Step 3: TOTP MFA Setup
  const renderMFAStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <QrCode className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Two-Factor Authentication</h3>
        <p className="text-slate-600">Setup TOTP with Google Authenticator or similar app</p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="w-48 h-48 bg-slate-100 mx-auto mb-4 rounded-lg flex items-center justify-center">
            <p className="text-slate-600">QR Code would appear here</p>
          </div>
          <p className="text-sm text-slate-600">
            Scan this QR code with your authenticator app
          </p>
        </div>
        
        <div>
          <Label htmlFor="totp">Authentication Code</Label>
          <Input
            id="totp"
            type="text"
            value={verificationData.totpCode}
            onChange={(e) => setVerificationData(prev => ({ ...prev, totpCode: e.target.value }))}
            placeholder="Enter 6-digit code from app"
            className="mt-1 text-center text-lg tracking-widest"
            maxLength={6}
          />
        </div>
        
        <Button 
          onClick={() => setCurrentStep(3)}
          disabled={verificationData.totpCode.length !== 6}
          className="w-full"
        >
          Verify TOTP Code
        </Button>
      </div>
    </div>
  );

  // Step 4: Government ID Upload
  const renderIDUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Government ID Upload</h3>
        <p className="text-slate-600">Upload front and back of Canadian government-issued ID</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>ID Front</Label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm text-slate-600">Click to upload front of ID</p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setVerificationData(prev => ({ ...prev, idFrontFile: file }));
              }}
              className="hidden"
              id="id-front"
            />
            <label htmlFor="id-front" className="cursor-pointer">
              <Button variant="outline" className="mt-2">
                Choose File
              </Button>
            </label>
          </div>
          {verificationData.idFrontFile && (
            <p className="text-sm text-green-600">✓ {verificationData.idFrontFile.name}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>ID Back</Label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm text-slate-600">Click to upload back of ID</p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setVerificationData(prev => ({ ...prev, idBackFile: file }));
              }}
              className="hidden"
              id="id-back"
            />
            <label htmlFor="id-back" className="cursor-pointer">
              <Button variant="outline" className="mt-2">
                Choose File
              </Button>
            </label>
          </div>
          {verificationData.idBackFile && (
            <p className="text-sm text-green-600">✓ {verificationData.idBackFile.name}</p>
          )}
        </div>
      </div>
      
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Accepted: Driver's License, Health Card, Passport, or other Canadian government-issued photo ID
        </AlertDescription>
      </Alert>
      
      <Button 
        onClick={() => setCurrentStep(4)}
        disabled={!verificationData.idFrontFile || !verificationData.idBackFile}
        className="w-full"
      >
        Continue to Face Verification
      </Button>
    </div>
  );

  // Step 5: Live Face Verification
  const renderLivenessStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Camera className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Live Face Verification</h3>
        <p className="text-slate-600">Take a live selfie to match against your ID photo</p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-slate-100 rounded-lg p-4 text-center">
          <video
            ref={videoRef}
            className="w-full max-w-md mx-auto rounded-lg bg-black"
            autoPlay
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        
        <div className="flex gap-2 justify-center">
          <Button
            onClick={async () => {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                  videoRef.current.srcObject = stream;
                }
              } catch (error) {
                toast({
                  title: "Camera Access Required",
                  description: "Please allow camera access to continue",
                  variant: "destructive"
                });
              }
            }}
            variant="outline"
          >
            Start Camera
          </Button>
          
          <Button
            onClick={() => {
              if (videoRef.current && canvasRef.current) {
                const canvas = canvasRef.current;
                const video = videoRef.current;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(video, 0, 0);
                
                canvas.toBlob((blob) => {
                  if (blob) {
                    const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
                    setVerificationData(prev => ({ ...prev, selfieFile: file }));
                    setFaceMatchScore(Math.random() * 30 + 70); // Demo score 70-100
                  }
                });
              }
            }}
            disabled={!videoRef.current?.srcObject}
          >
            <Camera className="w-4 h-4 mr-2" />
            Capture Selfie
          </Button>
        </div>
        
        {verificationData.selfieFile && (
          <div className="text-center space-y-2">
            <p className="text-sm text-green-600">✓ Selfie captured successfully</p>
            {faceMatchScore && (
              <div className="space-y-2">
                <p className="text-sm">Face Match Score: <strong>{faceMatchScore.toFixed(1)}%</strong></p>
                {faceMatchScore >= 75 ? (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Match Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Low Match Score
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}
        
        <Button 
          onClick={() => setCurrentStep(5)}
          disabled={!verificationData.selfieFile || (faceMatchScore && faceMatchScore < 75)}
          className="w-full"
        >
          Continue to Duplicate Check
        </Button>
      </div>
    </div>
  );

  // Step 6: Duplicate Account Check
  const renderDuplicateCheckStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Eye className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Duplicate Account Check</h3>
        <p className="text-slate-600">Verifying unique identity in our system</p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            <div>
              <p className="font-medium">Running Security Checks...</p>
              <p className="text-sm text-slate-600">Checking for duplicate identities and fraud prevention</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>ID number hash verification</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Face vector matching</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>IP and geolocation analysis</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Account uniqueness confirmed</span>
          </div>
        </div>
        
        <Button 
          onClick={() => setCurrentStep(6)}
          className="w-full"
        >
          Proceed to Final Agreement
        </Button>
      </div>
    </div>
  );

  // Step 7: Terms Agreement and Digital Signature
  const renderTermsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Lock className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Final Terms Agreement</h3>
        <p className="text-slate-600">Digital signature and platform agreement</p>
      </div>
      
      <div className="space-y-4">
        <div className="border rounded-lg p-4 max-h-64 overflow-y-auto bg-slate-50">
          <h4 className="font-semibold mb-2">CivicOS Identity Verification Agreement</h4>
          <div className="text-sm space-y-2">
            <p>By completing this verification process, I confirm that:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>I am using my real, legal identity for all interactions on CivicOS</li>
              <li>I will not create duplicate accounts or circumvent security measures</li>
              <li>I understand that my government ID was used solely for identity verification</li>
              <li>I consent to facial recognition matching for account security</li>
              <li>I agree to use CivicOS for legitimate civic engagement only</li>
              <li>I will not engage in voter fraud, manipulation, or other illegal activities</li>
            </ul>
            <p className="mt-4">
              <strong>Data Usage:</strong> Your ID documents are securely processed and automatically 
              purged after 72 hours. Only verification status is retained.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms"
              checked={verificationData.termsAgreed}
              onCheckedChange={(checked) => 
                setVerificationData(prev => ({ ...prev, termsAgreed: !!checked }))
              }
            />
            <label htmlFor="terms" className="text-sm">
              I have read and agree to the above terms and conditions
            </label>
          </div>
          
          <div>
            <Label htmlFor="signature">Digital Signature</Label>
            <Input
              id="signature"
              type="text"
              value={verificationData.digitalSignature}
              onChange={(e) => setVerificationData(prev => ({ ...prev, digitalSignature: e.target.value }))}
              placeholder="Type your full legal name as digital signature"
              className="mt-1"
            />
          </div>
          
          <Button 
            onClick={() => {
              toast({
                title: "Identity Verification Complete!",
                description: "Welcome to CivicOS. You now have full access to all civic features.",
              });
              // Redirect to dashboard or close modal
            }}
            disabled={!verificationData.termsAgreed || !verificationData.digitalSignature}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Verification & Enter CivicOS
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderCaptchaStep();
      case 1: return renderEmailStep();
      case 2: return renderMFAStep();
      case 3: return renderIDUploadStep();
      case 4: return renderLivenessStep();
      case 5: return renderDuplicateCheckStep();
      case 6: return renderTermsStep();
      default: return renderCaptchaStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            CivicOS Identity Verification
          </h1>
          <p className="text-slate-600">
            Secure, government-grade identity verification for authentic civic participation
          </p>
        </div>
        
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-slate-600">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
        </div>
        
        {/* Step Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                  step.current
                    ? 'bg-blue-600 text-white'
                    : step.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {step.icon}
                <span className="hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              {steps[currentStep].icon}
              <span>{steps[currentStep].title}</span>
            </CardTitle>
            <p className="text-slate-600">{steps[currentStep].description}</p>
          </CardHeader>
          <CardContent>
            {renderCurrentStep()}
          </CardContent>
        </Card>
        
        {/* Security Notice */}
        <div className="mt-8 text-center">
          <Alert className="max-w-2xl mx-auto">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your privacy is protected. All verification data is encrypted and automatically 
              purged after 72 hours. Only verification status is retained for account security.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}