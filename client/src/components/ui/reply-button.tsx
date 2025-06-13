import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ReplyButtonProps {
  postId: number;
  replyCount: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
  className?: string;
  onReplyAdded?: () => void;
}

export function ReplyButton({
  postId,
  replyCount,
  size = "md",
  variant = "ghost",
  className,
  onReplyAdded
}: ReplyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createReplyMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("/api/forum/replies", "POST", {
        postId,
        content
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your reply has been posted!"
      });
      setReplyContent("");
      setIsOpen(false);
      onReplyAdded?.();
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/replies", postId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post reply",
        variant: "destructive"
      });
    }
  });

  const handleSubmitReply = () => {
    if (!replyContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply",
        variant: "destructive"
      });
      return;
    }
    createReplyMutation.mutate(replyContent);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={cn(
            "flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors",
            sizeClasses[size],
            className
          )}
        >
          <MessageCircle className={iconSizes[size]} />
          <span className="font-medium">{replyCount}</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reply to Discussion</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={6}
            className="w-full"
          />
          
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitReply}
              disabled={createReplyMutation.isPending || !replyContent.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createReplyMutation.isPending ? (
                "Posting..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post Reply
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}