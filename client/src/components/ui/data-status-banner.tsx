import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";

interface DataStatusBannerProps {
  isLiveData?: boolean;
  dataSource?: string;
  className?: string;
}

export function DataStatusBanner({ 
  isLiveData = true, 
  dataSource = "Government APIs", 
  className 
}: DataStatusBannerProps) {
  if (isLiveData) return null;

  return (
    <Alert className={`border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 dark:border-yellow-800 dark:bg-gradient-to-r dark:from-yellow-950 dark:to-amber-950 backdrop-blur-sm shadow-lg mx-2 sm:mx-0 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
      <AlertDescription className="text-yellow-800 dark:text-yellow-200 font-medium text-sm sm:text-base">
        <strong>Demo Data:</strong> This page displays simulated data for demonstration purposes. 
        Live data from {dataSource} will be available in production.
      </AlertDescription>
    </Alert>
  );
}

export function LiveDataBanner({ 
  dataSource = "Parliament of Canada", 
  lastSync,
  className 
}: { 
  dataSource?: string;
  lastSync?: string;
  className?: string;
}) {
  return (
    <Alert className={`border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:border-green-800 dark:bg-gradient-to-r dark:from-green-950 dark:to-emerald-950 backdrop-blur-sm shadow-lg mx-2 sm:mx-0 ${className}`}>
      <Info className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
      <AlertDescription className="text-green-800 dark:text-green-200 font-medium text-sm sm:text-base">
        <strong>Live Data:</strong> Information sourced directly from {dataSource}
        {lastSync && ` • Last synchronized ${lastSync}`}
      </AlertDescription>
    </Alert>
  );
}