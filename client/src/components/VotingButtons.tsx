import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface VotingButtonsProps {
  targetType: 'politician' | 'bill' | 'post' | 'comment' | 'petition' | 'news' | 'finance';
  targetId: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showCounts?: boolean;
}

export function VotingButtons({ 
  targetType, 
  targetId, 
  className = "",
  size = 'md',
  showCounts = true 
}: VotingButtonsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: voteData, isLoading } = useQuery({
    queryKey: [`/api/vote/${targetType}/${targetId}`],
    enabled: !!targetId
  });

  const voteMutation = useMutation({
    mutationFn: async (voteType: 'upvote' | 'downvote') => {
      const res = await apiRequest("/api/vote", "POST", {
        targetType,
        targetId,
        voteType
      });
      
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData([`/api/vote/${targetType}/${targetId}`], data);
      queryClient.invalidateQueries({ queryKey: [`/api/${targetType}s`] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/politicians"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
    },
    onError: (error: any) => {
      console.error("Voting error:", error);
      
      // Parse error message from API response
      let errorMessage = "Failed to register vote";
      if (error.message) {
        if (error.message.includes("already voted")) {
          toast({
            title: "Already Voted",
            description: "You have already voted on this item. Each user can only vote once.",
            variant: "default",
          });
          return;
        }
        // Extract message from "400: {message: ...}" format
        const match = error.message.match(/400: (.+)/);
        if (match) {
          try {
            const parsed = JSON.parse(match[1]);
            errorMessage = parsed.message || errorMessage;
          } catch {
            errorMessage = match[1];
          }
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Vote Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleVote = (voteType: 'upvote' | 'downvote') => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to vote",
        variant: "destructive",
      });
      return;
    }

    voteMutation.mutate(voteType);
  };

  const upvotes = (voteData as any)?.upvotes || 0;
  const downvotes = (voteData as any)?.downvotes || 0;
  const totalScore = (voteData as any)?.totalScore || 0;
  const userVote = (voteData as any)?.userVote;

  const buttonSizes = {
    sm: "h-7 w-7",
    md: "h-8 w-8", 
    lg: "h-10 w-10"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex items-center space-x-1">
        <Button
          variant={userVote === 'upvote' ? "default" : "outline"}
          size="sm"
          className={cn(
            buttonSizes[size],
            "p-0",
            userVote === 'upvote' && "bg-green-600 hover:bg-green-700 text-white"
          )}
          onClick={() => handleVote('upvote')}
          disabled={voteMutation.isPending || isLoading}
        >
          <ThumbsUp className={iconSizes[size]} />
        </Button>
        {showCounts && (
          <span className="text-sm font-medium text-green-600 min-w-[20px] text-center">
            {upvotes}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-1">
        <Button
          variant={userVote === 'downvote' ? "default" : "outline"}
          size="sm"
          className={cn(
            buttonSizes[size],
            "p-0",
            userVote === 'downvote' && "bg-red-600 hover:bg-red-700 text-white"
          )}
          onClick={() => handleVote('downvote')}
          disabled={voteMutation.isPending || isLoading}
        >
          <ThumbsDown className={iconSizes[size]} />
        </Button>
        {showCounts && (
          <span className="text-sm font-medium text-red-600 min-w-[20px] text-center">
            {downvotes}
          </span>
        )}
      </div>

      {showCounts && (
        <div className="flex items-center space-x-1 ml-2 pl-2 border-l">
          <span className="text-xs text-muted-foreground">Score:</span>
          <span className={cn(
            "text-sm font-bold",
            totalScore > 0 && "text-green-600",
            totalScore < 0 && "text-red-600",
            totalScore === 0 && "text-gray-500"
          )}>
            {totalScore > 0 ? `+${totalScore}` : totalScore}
          </span>
        </div>
      )}
    </div>
  );
}