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
    <Alert className={`border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertDescription className="text-yellow-800 dark:text-yellow-200">
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
    <Alert className={`border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 ${className}`}>
      <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
      <AlertDescription className="text-green-800 dark:text-green-200">
        <strong>Live Data:</strong> Information sourced directly from {dataSource}
        {lastSync && ` • Last synchronized ${lastSync}`}
      </AlertDescription>
    </Alert>
  );
}