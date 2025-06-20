import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Clock, ExternalLink } from "lucide-react";

interface SourceBadgeProps {
  source: string;
  lastUpdated?: string;
  url?: string;
  verified?: boolean;
  className?: string;
}

export function SourceBadge({ source, lastUpdated, url, verified = true, className }: SourceBadgeProps) {
  const formatLastUpdated = (date?: string) => {
    if (!date) return "Real-time";
    const now = new Date();
    const updated = new Date(date);
    const diffDays = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}m ago`;
  };

  const getBadgeVariant = () => {
    if (!verified) return "destructive";
    if (lastUpdated) {
      const diffDays = Math.floor((new Date().getTime() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 30) return "secondary";
      if (diffDays > 7) return "outline";
    }
    return "default";
  };

  const tooltipContent = (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Shield className="h-3 w-3" />
        <span className="font-medium">Source: {source}</span>
      </div>
      {lastUpdated && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Updated {formatLastUpdated(lastUpdated)}</span>
        </div>
      )}
      {url && (
        <div className="flex items-center gap-2 text-xs">
          <ExternalLink className="h-3 w-3" />
          <span>View original data</span>
        </div>
      )}
      {!verified && (
        <div className="text-xs text-yellow-600 dark:text-yellow-400">
          ⚠ Data verification pending
        </div>
      )}
    </div>
  );

  const badge = (
    <Badge 
      variant={getBadgeVariant()} 
      className={`cursor-help transition-all hover:shadow-md backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-xs ${className}`}
    >
      <Shield className="h-3 w-3 mr-1 flex-shrink-0" />
      <span className="hidden sm:inline">Verified</span>
      <span className="sm:hidden">✓</span>
    </Badge>
  );

  if (url) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block">
              {badge}
            </a>
          </TooltipTrigger>
          <TooltipContent>{tooltipContent}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}