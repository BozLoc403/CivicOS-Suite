import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calculator, Brain, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OfflineChallenge {
  mathChallenge: {
    question: string;
    id: string;
  };
  patternChallenge: {
    pattern: number[];
    id: string;
  };
  sessionId: string;
}

export function OfflineVerificationWidget({ email, onComplete }: { 
  email: string; 
  onComplete: (verified: boolean) => void; 
}) {
  const [challenges, setChallenges] = useState<OfflineChallenge | null>(null);
  const [mathAnswer, setMathAnswer] = useState("");
  const [patternAnswer, setPatternAnswer] = useState("");
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const initializeChallenges = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/api/identity/init-offline-verification", "POST", { email });
      setChallenges(response.challenges);
      toast({
        title: "Offline Challenges Generated",
        description: "Complete the mathematical and pattern challenges below"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate challenges",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyChallenge = async (challengeId: string, response: string) => {
    if (!challenges) return;
    
    try {
      const result = await apiRequest("/api/identity/verify-offline-challenge", "POST", {
        sessionId: challenges.sessionId,
        challengeId,
        response
      });

      if (result.valid) {
        setCompletedChallenges(prev => new Set([...prev, challengeId]));
        toast({
          title: "Challenge Verified",
          description: "Correct answer! Challenge completed."
        });

        if (result.complete) {
          onComplete(true);
          toast({
            title: "Verification Complete",
            description: "All offline challenges completed successfully!"
          });
        }
      } else {
        toast({
          title: "Incorrect Answer",
          description: "Please try again with the correct answer",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Verification Error",
        description: error.message || "Failed to verify challenge",
        variant: "destructive"
      });
    }
  };

  if (!challenges) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Offline Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertDescription>
              Complete mathematical and pattern challenges to verify your identity. 
              No external services required - everything works offline!
            </AlertDescription>
          </Alert>
          <Button 
            onClick={initializeChallenges} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Generating Challenges..." : "Start Offline Verification"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isMathCompleted = completedChallenges.has(challenges.mathChallenge.id);
  const isPatternCompleted = completedChallenges.has(challenges.patternChallenge.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Offline Verification Challenges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Math Challenge */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            <Label>Mathematical Challenge</Label>
            {isMathCompleted && <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Complete</Badge>}
          </div>
          
          <Alert>
            <AlertDescription>
              Solve: <strong>{challenges.mathChallenge.question}</strong>
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter your answer"
              value={mathAnswer}
              onChange={(e) => setMathAnswer(e.target.value)}
              disabled={isMathCompleted}
            />
            <Button 
              onClick={() => verifyChallenge(challenges.mathChallenge.id, mathAnswer)}
              disabled={!mathAnswer || isMathCompleted}
            >
              Verify
            </Button>
          </div>
        </div>

        {/* Pattern Challenge */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            <Label>Pattern Recognition Challenge</Label>
            {isPatternCompleted && <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Complete</Badge>}
          </div>
          
          <Alert>
            <AlertDescription>
              Find the next number in the sequence: <strong>{challenges.patternChallenge.pattern.join(', ')}, ?</strong>
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Next number in sequence"
              value={patternAnswer}
              onChange={(e) => setPatternAnswer(e.target.value)}
              disabled={isPatternCompleted}
            />
            <Button 
              onClick={() => verifyChallenge(challenges.patternChallenge.id, patternAnswer)}
              disabled={!patternAnswer || isPatternCompleted}
            >
              Verify
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Progress: {completedChallenges.size}/2 challenges completed
            </span>
            <div className="flex gap-1">
              <div className={`w-3 h-3 rounded-full ${isMathCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full ${isPatternCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}