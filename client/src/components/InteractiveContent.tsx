import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { VotingButtons } from "./VotingButtons";
import { CommentSystem } from "./CommentSystem";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  MessageCircle, 
  Reply, 
  Clock,
  Share2,
  Flag,
  Heart,
  MoreHorizontal
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Comment {
  id: number;
  content: string;
  author_id: string;
  target_type: string;
  target_id: number;
  parent_comment_id?: number;
  created_at: string;
  like_count: number;
  can_delete: boolean;
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_image_url?: string;
  replies?: Comment[];
}

interface InteractiveContentProps {
  targetType: 'politician' | 'bill' | 'petition' | 'post' | 'news';
  targetId: number;
  title: string;
  description?: string;
  showVoting?: boolean;
  showComments?: boolean;
  showSharing?: boolean;
}

export function InteractiveContent({ 
  targetType, 
  targetId, 
  title,
  description,
  showVoting = true,
  showComments = true,
  showSharing = true
}: InteractiveContentProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  // Using CommentSystem component instead of local state

  const handleShare = async () => {
    try {
      await navigator.share({
        title: title,
        text: description,
        url: window.location.href
      });
    } catch (err) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard."
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Interaction Bar */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4">
          {showVoting && (
            <VotingButtons 
              targetType={targetType as any} 
              targetId={targetId} 
              size="md" 
            />
          )}
          
          {showSharing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MessageCircle className="w-4 h-4" />
          <span>Discussion</span>
        </div>
      </div>

      {/* Facebook-style Comments Section */}
      {showComments && (
        <CommentSystem targetType={targetType} targetId={targetId} />
      )}
    </div>
  );
}