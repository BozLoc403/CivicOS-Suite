import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { NavigationHeader } from "@/components/NavigationHeader";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MessageSquare, ThumbsUp, Reply, Shield, AlertCircle, Pin, Users, Clock } from "lucide-react";
import type { Bill } from "@shared/schema";

interface Discussion {
  id: number;
  billId: number;
  userId: string;
  title: string;
  content: string;
  type: string;
  isVerified: boolean;
  likesCount: number;
  repliesCount: number;
  isPinned: boolean;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    governmentIdVerified: boolean;
    verificationLevel: string;
  };
  bill: {
    billNumber: string;
    title: string;
  };
}

interface DiscussionReply {
  id: number;
  discussionId: number;
  userId: string;
  content: string;
  isVerified: boolean;
  likesCount: number;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    governmentIdVerified: boolean;
  };
}

export default function Discussions() {
  const { user } = useAuth();
  const [selectedBill, setSelectedBill] = useState<number | null>(null);
  const [newDiscussion, setNewDiscussion] = useState({ title: "", content: "", type: "general" });
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<number | null>(null);
  const [newReply, setNewReply] = useState("");

  const { data: bills = [] } = useQuery<Bill[]>({
    queryKey: ["/api/bills"],
  });

  const { data: discussions = [] } = useQuery<Discussion[]>({
    queryKey: ["/api/discussions", selectedBill],
    enabled: !!selectedBill,
  });

  const { data: replies = [] } = useQuery<DiscussionReply[]>({
    queryKey: ["/api/discussions", selectedDiscussion, "replies"],
    enabled: !!selectedDiscussion,
  });

  const createDiscussionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/discussions", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/discussions"] });
      setNewDiscussion({ title: "", content: "", type: "general" });
      setShowNewDiscussion(false);
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/discussions/replies", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/discussions", selectedDiscussion, "replies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/discussions"] });
      setNewReply("");
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (data: { discussionId?: number; replyId?: number; likeType: string }) => {
      return await apiRequest("/api/discussions/like", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/discussions"] });
      if (selectedDiscussion) {
        queryClient.invalidateQueries({ queryKey: ["/api/discussions", selectedDiscussion, "replies"] });
      }
    },
  });

  const handleCreateDiscussion = () => {
    if (!selectedBill || !newDiscussion.title || !newDiscussion.content) return;
    
    createDiscussionMutation.mutate({
      billId: selectedBill,
      title: newDiscussion.title,
      content: newDiscussion.content,
      type: newDiscussion.type,
    });
  };

  const handleCreateReply = () => {
    if (!selectedDiscussion || !newReply.trim()) return;
    
    createReplyMutation.mutate({
      discussionId: selectedDiscussion,
      content: newReply,
    });
  };

  const getVerificationBadge = (user: any) => {
    if (user.governmentIdVerified) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <Shield className="w-3 h-3 mr-1" />
          ID Verified
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-600 border-gray-300">
        <Users className="w-3 h-3 mr-1" />
        Unverified
      </Badge>
    );
  };

  const getDiscussionTypeColor = (type: string) => {
    switch (type) {
      case "analysis": return "bg-blue-100 text-blue-800";
      case "question": return "bg-yellow-100 text-yellow-800";
      case "debate": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMinutes > 0) return `${diffMinutes}m ago`;
    return "Just now";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bill Discussions</h1>
          <p className="mt-2 text-gray-600">
            Join verified discussions about legislation. All participants must link their real identity to their posts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Bill Selection Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select a Bill</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {bills.map((bill) => (
                  <Button
                    key={bill.id}
                    variant={selectedBill === bill.id ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => setSelectedBill(bill.id)}
                  >
                    <div>
                      <div className="font-medium text-sm">{bill.billNumber}</div>
                      <div className="text-xs text-gray-600 line-clamp-2">{bill.title}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Discussion Area */}
          <div className="lg:col-span-3">
            {selectedBill ? (
              <div className="space-y-6">
                {/* New Discussion Form */}
                {!showNewDiscussion ? (
                  <Card>
                    <CardContent className="p-4">
                      <Button
                        onClick={() => setShowNewDiscussion(true)}
                        className="w-full bg-civic-blue hover:bg-civic-blue/90"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Start a New Discussion
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Start New Discussion</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Discussion Type</label>
                        <select
                          value={newDiscussion.type}
                          onChange={(e) => setNewDiscussion(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                          <option value="general">General Discussion</option>
                          <option value="analysis">Bill Analysis</option>
                          <option value="question">Question</option>
                          <option value="debate">Debate</option>
                        </select>
                      </div>
                      
                      <Input
                        placeholder="Discussion title"
                        value={newDiscussion.title}
                        onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                      />
                      
                      <Textarea
                        placeholder="Share your thoughts on this bill..."
                        value={newDiscussion.content}
                        onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                        rows={4}
                      />
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleCreateDiscussion}
                          disabled={createDiscussionMutation.isPending}
                          className="bg-civic-blue hover:bg-civic-blue/90"
                        >
                          {createDiscussionMutation.isPending ? "Posting..." : "Post Discussion"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowNewDiscussion(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                      
                      <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-md">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        Your real name and verification status will be displayed with this post.
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Discussions List */}
                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <Badge className={getDiscussionTypeColor(discussion.type)}>
                                {discussion.type}
                              </Badge>
                              {discussion.isPinned && (
                                <Pin className="w-4 h-4 text-civic-blue" />
                              )}
                            </div>
                            {getVerificationBadge(discussion.user)}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTimeAgo(discussion.createdAt)}
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {discussion.title}
                        </h3>
                        
                        <p className="text-gray-700 mb-4 line-clamp-3">
                          {discussion.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                              By {discussion.user.firstName} {discussion.user.lastName}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => likeMutation.mutate({ discussionId: discussion.id, likeType: "like" })}
                              className="text-gray-600 hover:text-civic-blue"
                            >
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {discussion.likesCount}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedDiscussion(
                                selectedDiscussion === discussion.id ? null : discussion.id
                              )}
                              className="text-gray-600 hover:text-civic-blue"
                            >
                              <Reply className="w-4 h-4 mr-1" />
                              {discussion.repliesCount} replies
                            </Button>
                          </div>
                        </div>
                        
                        {/* Replies Section */}
                        {selectedDiscussion === discussion.id && (
                          <div className="mt-6 border-t pt-6">
                            <div className="space-y-4 mb-4">
                              {replies.map((reply) => (
                                <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium">
                                        {reply.user.firstName} {reply.user.lastName}
                                      </span>
                                      {getVerificationBadge(reply.user)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {formatTimeAgo(reply.createdAt)}
                                    </div>
                                  </div>
                                  <p className="text-gray-700 text-sm mb-2">{reply.content}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => likeMutation.mutate({ replyId: reply.id, likeType: "like" })}
                                    className="text-gray-600 hover:text-civic-blue text-xs"
                                  >
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    {reply.likesCount}
                                  </Button>
                                </div>
                              ))}
                            </div>
                            
                            <div className="space-y-3">
                              <Textarea
                                placeholder="Write a reply..."
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                rows={3}
                              />
                              <Button
                                onClick={handleCreateReply}
                                disabled={createReplyMutation.isPending}
                                size="sm"
                                className="bg-civic-blue hover:bg-civic-blue/90"
                              >
                                {createReplyMutation.isPending ? "Posting..." : "Post Reply"}
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  
                  {discussions.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
                        <p className="text-gray-600">Be the first to start a discussion about this bill.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Bill</h3>
                  <p className="text-gray-600">Choose a bill from the sidebar to view and join discussions.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}