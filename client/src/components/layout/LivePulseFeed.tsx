import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { LuxuryCard } from "@/components/ui/luxury-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  FileText, 
  Eye,
  Clock,
  Zap,
  Bell,
  ChevronRight
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PulseEvent {
  id: string;
  type: 'bill_update' | 'politician_activity' | 'news_alert' | 'vote_cast' | 'corruption_alert' | 'legal_update';
  title: string;
  description: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  url?: string;
  metadata?: Record<string, any>;
}

const eventIcons = {
  bill_update: FileText,
  politician_activity: Users,
  news_alert: TrendingUp,
  vote_cast: Activity,
  corruption_alert: AlertTriangle,
  legal_update: Eye
};

const priorityColors = {
  low: "bg-blue-500/10 text-blue-600 border-blue-200",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  high: "bg-orange-500/10 text-orange-600 border-orange-200",
  critical: "bg-red-500/10 text-red-600 border-red-200"
};

export function LivePulseFeed() {
  const [isLive, setIsLive] = useState(true);
  const [pulseEvents, setPulseEvents] = useState<PulseEvent[]>([]);

  // Fetch real-time pulse data
  const { data: liveData } = useQuery({
    queryKey: ['/api/civic/pulse'],
    refetchInterval: isLive ? 15000 : false, // 15 second updates when live
  });

  // Fetch latest news articles for pulse
  const { data: newsData } = useQuery({
    queryKey: ['/api/news/articles'],
    refetchInterval: 30000, // 30 second updates
  });

  // Fetch voting activity for pulse
  const { data: votingData } = useQuery({
    queryKey: ['/api/voting/recent'],
    refetchInterval: 60000, // 1 minute updates
  });

  // Fetch politician activity for pulse
  const { data: politicianActivity } = useQuery({
    queryKey: ['/api/politicians/activity'],
    refetchInterval: 120000, // 2 minute updates
  });

  useEffect(() => {
    // Generate pulse events from real data
    const events: PulseEvent[] = [];

    // News alerts
    if (newsData?.length > 0) {
      newsData.slice(0, 3).forEach((article: any) => {
        events.push({
          id: `news-${article.id}`,
          type: 'news_alert',
          title: `Breaking: ${article.title}`,
          description: `New analysis from ${article.source}`,
          timestamp: new Date(article.publishedAt),
          priority: article.credibilityScore > 8 ? 'high' : 'medium',
          source: article.source,
          url: `/news?article=${article.id}`
        });
      });
    }

    // Voting activity
    if (votingData?.length > 0) {
      votingData.slice(0, 2).forEach((vote: any) => {
        events.push({
          id: `vote-${vote.id}`,
          type: 'vote_cast',
          title: `Vote Cast: ${vote.bill?.title}`,
          description: `${vote.position} vote recorded`,
          timestamp: new Date(vote.createdAt),
          priority: 'medium',
          source: 'Parliamentary System',
          url: `/voting?bill=${vote.billId}`
        });
      });
    }

    // Bill updates
    if (liveData?.bills?.length > 0) {
      liveData.bills.slice(0, 2).forEach((bill: any) => {
        events.push({
          id: `bill-${bill.id}`,
          type: 'bill_update',
          title: `Bill Update: ${bill.billNumber}`,
          description: `Status changed to ${bill.status}`,
          timestamp: new Date(bill.updatedAt),
          priority: bill.status === 'Passed' ? 'high' : 'medium',
          source: 'Legislative Assembly',
          url: `/voting?bill=${bill.id}`
        });
      });
    }

    // Sort by timestamp and priority
    events.sort((a, b) => {
      const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    setPulseEvents(events.slice(0, 20)); // Keep latest 20 events
  }, [liveData, newsData, votingData, politicianActivity]);

  return (
    <LuxuryCard 
      title="Live Civic Pulse"
      description="Real-time intelligence feed"
      variant="pulse"
      className="h-full max-h-[600px]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"
          )} />
          <span className="text-sm font-medium">
            {isLive ? "Live Feed" : "Paused"}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsLive(!isLive)}
          className="text-xs"
        >
          {isLive ? "Pause" : "Resume"}
        </Button>
      </div>

      <ScrollArea className="h-[480px]">
        <div className="space-y-3">
          {pulseEvents.length > 0 ? (
            pulseEvents.map((event, index) => {
              const IconComponent = eventIcons[event.type];
              return (
                <div key={event.id} className="group">
                  <div className={cn(
                    "p-3 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer",
                    priorityColors[event.priority]
                  )}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">
                            {event.title}
                          </p>
                          <Badge 
                            variant="outline" 
                            className="text-xs ml-2 flex-shrink-0"
                          >
                            {event.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {event.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {event.source}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  
                  {index < pulseEvents.length - 1 && (
                    <Separator className="my-2 opacity-30" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Monitoring civic activity...
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{pulseEvents.length} active events</span>
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>Auto-refresh: {isLive ? '15s' : 'Off'}</span>
          </div>
        </div>
      </div>
    </LuxuryCard>
  );
}