import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface VotingButtonsProps {
  targetType: 'politician' | 'bill' | 'post' | 'comment' | 'petition';
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
      const res = await apiRequest("POST", "/api/vote", {
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
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to register vote",
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

  const upvotes = voteData?.upvotes || 0;
  const downvotes = voteData?.downvotes || 0;
  const totalScore = voteData?.totalScore || 0;
  const userVote = voteData?.userVote;

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