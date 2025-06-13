import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LikeButtonProps {
  itemId: number;
  itemType: string;
  variant?: "heart" | "thumbs";
  className?: string;
}

interface VoteData {
  upvotes: number;
  downvotes: number;
  totalScore: number;
  hasVoted?: boolean;
}

export function LikeButton({ itemId, itemType, variant = "heart", className = "" }: LikeButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: voteData } = useQuery<VoteData>({
    queryKey: [`/api/vote/${itemType}/${itemId}`],
  });

  const votes: VoteData = voteData || { upvotes: 0, downvotes: 0, totalScore: 0 };

  const voteMutation = useMutation({
    mutationFn: async ({ vote }: { vote: number }) => {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, itemType, vote })
      });
      if (!response.ok) throw new Error("Failed to vote");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/vote/${itemType}/${itemId}`] });
      toast({
        title: "Vote recorded",
        description: "Your vote has been recorded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Vote failed",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleVote = (voteValue: number) => {
    voteMutation.mutate({ vote: voteValue });
  };

  if (variant === "heart") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(1)}
        disabled={voteMutation.isPending}
        className={`text-gray-500 hover:text-red-500 transition-colors ${className}`}
      >
        <Heart className="h-4 w-4 mr-1" />
        <span className="text-sm">{votes.upvotes}</span>
      </Button>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(1)}
        disabled={voteMutation.isPending}
        className="text-gray-500 hover:text-green-500 transition-colors"
      >
        <ThumbsUp className="h-4 w-4" />
        <span className="text-sm ml-1">{votes.upvotes}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(-1)}
        disabled={voteMutation.isPending}
        className="text-gray-500 hover:text-red-500 transition-colors"
      >
        <ThumbsDown className="h-4 w-4" />
        <span className="text-sm ml-1">{votes.downvotes}</span>
      </Button>
    </div>
  );
}