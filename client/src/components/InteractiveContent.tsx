import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { VotingButtons } from "./VotingButtons";
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

interface Comment {
  id: number;
  content: string;
  authorId: string;
  targetType: string;
  targetId: number;
  parentCommentId?: number;
  createdAt: string;
  likeCount: number;
  author?: {
    firstName: string;
    lastName?: string;
    email: string;
    profileImageUrl?: string;
  };
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
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: [`/api/comments/${targetType}/${targetId}`],
    enabled: showComments && !!targetId
  });

  const commentMutation = useMutation({
    mutationFn: async ({ content, parentCommentId }: { content: string; parentCommentId?: number }) => {
      const res = await apiRequest("POST", "/api/comments", {
        targetType,
        targetId,
        content,
        parentCommentId
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/comments/${targetType}/${targetId}`] });
      setNewComment("");
      setReplyText("");
      setReplyingTo(null);
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to post comment",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const likeMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const res = await apiRequest("POST", "/api/comments/like", {
        commentId
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/comments/${targetType}/${targetId}`] });
    }
  });

  const handleSubmitComment = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to post comments",
        variant: "destructive"
      });
      return;
    }

    if (!newComment.trim()) return;
    commentMutation.mutate({ content: newComment });
  };

  const handleSubmitReply = (parentId: number) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to reply",
        variant: "destructive"
      });
      return;
    }

    if (!replyText.trim()) return;
    commentMutation.mutate({ content: replyText, parentCommentId: parentId });
  };

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

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={comment.author?.profileImageUrl} />
              <AvatarFallback>
                {comment.author?.firstName?.[0] || comment.author?.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-sm">
                  {comment.author?.firstName} {comment.author?.lastName}
                </span>
                <Badge variant="outline" className="text-xs">
                  Civic Level 2
                </Badge>
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDistanceToNow(new Date(comment.createdAt))} ago
                </span>
              </div>
              
              <p className="text-gray-900 mb-3">{comment.content}</p>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => likeMutation.mutate(comment.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  {comment.likeCount}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="text-gray-500 hover:text-blue-500"
                >
                  <Reply className="w-4 h-4 mr-1" />
                  Reply
                </Button>
                
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-yellow-500">
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
              
              {replyingTo === comment.id && (
                <div className="mt-3 space-y-2">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={commentMutation.isPending}
                    >
                      Post Reply
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {comment.replies?.map(reply => renderComment(reply, true))}
    </div>
  );

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
          <span>{(comments as any[])?.length || 0} comments</span>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Discussion</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* New Comment Form */}
              <div className="space-y-3">
                <Textarea
                  placeholder={user ? "Share your thoughts..." : "Please log in to comment"}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={!user}
                  className="min-h-[100px]"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {user ? "All comments are moderated for quality" : "Login required to participate"}
                  </span>
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!user || !newComment.trim() || commentMutation.isPending}
                  >
                    Post Comment
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              {commentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading comments...</p>
                </div>
              ) : (comments as any[])?.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">No comments yet</h3>
                  <p className="text-gray-500">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(comments as any[])?.map((comment: Comment) => renderComment(comment))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}