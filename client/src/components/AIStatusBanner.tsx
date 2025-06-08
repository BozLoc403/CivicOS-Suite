import { AlertTriangle, Brain, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AIStatusBannerProps {
  hasApiKey: boolean;
  className?: string;
}

export function AIStatusBanner({ hasApiKey, className = "" }: AIStatusBannerProps) {
  if (hasApiKey) {
    return (
      <Alert className={`bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 ${className}`}>
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          AI features powered by Claude are active and analyzing political data.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className={`bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        <span className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          AI analysis requires Anthropic API key configuration for advanced political insights.
        </span>
      </AlertDescription>
    </Alert>
  );
}