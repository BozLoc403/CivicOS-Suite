import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  itemId: number;
  itemType: "post" | "reply" | "comment" | "politician" | "bill" | "petition";
  initialLikeCount: number;
  initialIsLiked?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
  className?: string;
}

export function LikeButton({
  itemId,
  itemType,
  initialLikeCount,
  initialIsLiked = false,
  size = "md",
  variant = "ghost",
  className
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(Number(initialLikeCount) || 0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async () => {
      // Use the unified voting API
      return await apiRequest("/api/vote", "POST", {
        targetType: itemType,
        targetId: itemId,
        voteType: isLiked ? "downvote" : "upvote"
      });
    },
    onMutate: () => {
      // Optimistic update
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    },
    onSuccess: (data: any) => {
      // Update with server response from unified voting API
      const isCurrentlyLiked = data.userVote === 'upvote';
      setIsLiked(isCurrentlyLiked);
      setLikeCount(data.upvotes || 0);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/replies"] });
    },
    onError: (error: Error) => {
      // Revert optimistic update
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
      
      // Handle already voted error
      if (error.message.includes("already voted")) {
        toast({
          title: "Already Voted",
          description: "You have already voted on this item. Each user can only vote once.",
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to update like",
          variant: "destructive"
        });
      }
    }
  });

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeMutation.mutate();
  };

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm", 
    lg: "h-10 w-10 text-base"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleLike}
      disabled={likeMutation.isPending}
      className={cn(
        "flex items-center space-x-1 transition-colors",
        sizeClasses[size],
        isLiked && "text-red-500 hover:text-red-600",
        !isLiked && "text-gray-500 hover:text-red-500",
        className
      )}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          "transition-all",
          isLiked && "fill-current",
          likeMutation.isPending && "animate-pulse"
        )} 
      />
      <span className="font-medium">{likeCount}</span>
    </Button>
  );
}