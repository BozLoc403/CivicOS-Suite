import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NavigationHeader } from "@/components/NavigationHeader";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  MessageCircle, 
  Heart, 
  Eye, 
  Plus, 
  Filter, 
  TrendingUp,
  Clock,
  Users,
  Flag,
  Scale,
  FileText,
  Building,
  Map,
  Megaphone
} from "lucide-react";

interface ForumPost {
  id: number;
  title: string;
  content: string;
  authorId: string;
  categoryId: number;
  billId?: number;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  isSticky: boolean;
  isLocked: boolean;
  replyCount: number;
  likeCount: number;
  author?: {
    firstName: string;
    email: string;
    profileImageUrl?: string;
  };
  category?: {
    name: string;
    color: string;
    icon: string;
  };
  bill?: {
    title: string;
    billNumber: string;
  };
}

interface ForumCategory {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  sortOrder: number;
  postCount?: number;
}

interface ForumReply {
  id: number;
  content: string;
  authorId: string;
  postId: number;
  parentReplyId?: number;
  createdAt: string;
  likeCount: number;
  author?: {
    firstName: string;
    email: string;
    profileImageUrl?: string;
  };
}

const categoryIcons = {
  flag: Flag,
  map: Map,
  building: Building,
  scale: Scale,
  "file-text": FileText,
  users: Users,
  "message-circle": MessageCircle
};

export default function Discussions() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    categoryId: "",
    billId: ""
  });
  const [newReply, setNewReply] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch forum categories
  const { data: categories = [] } = useQuery<ForumCategory[]>({
    queryKey: ["/api/forum/categories"]
  });

  // Fetch forum posts
  const { data: posts = [], isLoading: postsLoading } = useQuery<ForumPost[]>({
    queryKey: ["/api/forum/posts", selectedCategory, sortBy],
    enabled: !!categories.length
  });

  // Fetch replies for selected post
  const { data: replies = [] } = useQuery<ForumReply[]>({
    queryKey: ["/api/forum/replies", selectedPost?.id],
    enabled: !!selectedPost
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return await apiRequest("/api/forum/posts", "POST", postData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your post has been created successfully!"
      });
      setShowCreatePost(false);
      setNewPost({ title: "", content: "", categoryId: "", billId: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive"
      });
    }
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      return await apiRequest(`/api/forum/posts/${postId}`, "DELETE");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post deleted successfully!"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive"
      });
    }
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      return await apiRequest(`/api/forum/posts/${postId}/like`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to toggle like",
        variant: "destructive"
      });
    }
  });

  // Create reply mutation
  const createReplyMutation = useMutation({
    mutationFn: async (replyData: any) => {
      return await apiRequest("/api/forum/replies", "POST", replyData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your reply has been posted!"
      });
      setNewReply("");
      queryClient.invalidateQueries({ queryKey: ["/api/forum/replies"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post reply",
        variant: "destructive"
      });
    }
  });

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.categoryId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    createPostMutation.mutate({
      title: newPost.title,
      content: newPost.content,
      categoryId: parseInt(newPost.categoryId),
      billId: newPost.billId ? parseInt(newPost.billId) : undefined
    });
  };

  const handleCreateReply = () => {
    if (!newReply.trim() || !selectedPost) {
      return;
    }

    createReplyMutation.mutate({
      content: newReply,
      postId: selectedPost.id
    });
  };

  const handleLikePost = (postId: number) => {
    likePostMutation.mutate(postId);
  };

  const getCategoryIcon = (iconName: string) => {
    const IconComponent = categoryIcons[iconName as keyof typeof categoryIcons] || MessageCircle;
    return IconComponent;
  };

  const filteredPosts = posts.filter(post => 
    selectedCategory === "all" || post.categoryId === parseInt(selectedCategory)
  );

  return (
    <div>
      <NavigationHeader />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Community Discussions
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Engage in meaningful conversations about Canadian politics and civic issues
            </p>
          </div>

        <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Discussion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Start a New Discussion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Enter discussion title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select
                  value={newPost.categoryId}
                  onValueChange={(value) => setNewPost({ ...newPost, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Share your thoughts..."
                  rows={6}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreatePost}
                  disabled={createPostMutation.isPending}
                >
                  {createPostMutation.isPending ? "Creating..." : "Create Discussion"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedCategory("all")}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                All Discussions
              </Button>
              
              {categories.map((category) => {
                const IconComponent = getCategoryIcon(category.icon);
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id.toString() ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id.toString())}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {category.name}
                    {category.postCount && (
                      <Badge variant="secondary" className="ml-auto">
                        {category.postCount}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="replies">Most Replies</SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {postsLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Loading discussions...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No discussions yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Be the first to start a discussion in this category!
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    post.isSticky ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20' : ''
                  }`}
                  onClick={() => setSelectedPost(post)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {post.author?.firstName?.[0] || post.author?.email?.[0] || '?'}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {post.isSticky && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              Sticky
                            </Badge>
                          )}
                          {post.category && (
                            <Badge 
                              variant="secondary" 
                              style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}
                            >
                              {post.category.name}
                            </Badge>
                          )}
                          {post.bill && (
                            <Badge variant="outline">
                              {post.bill.billNumber}
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {post.content}
                        </p>

                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <span>{post.author?.firstName || post.author?.email?.split('@')[0]}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.replyCount || 0}</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.viewCount || 0}</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikePost(post.id);
                            }}
                            className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                          >
                            <Heart className="h-4 w-4" />
                            <span>{post.likeCount || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedPost.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Original Post */}
              <div className="border-b pb-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {selectedPost.author?.firstName?.[0] || selectedPost.author?.email?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">
                        {selectedPost.author?.firstName || selectedPost.author?.email?.split('@')[0]}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(selectedPost.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="prose dark:prose-invert max-w-none">
                      <p>{selectedPost.content}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Replies */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Replies ({replies.length})
                </h3>

                {replies.map((reply) => (
                  <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {reply.author?.firstName?.[0] || reply.author?.email?.[0] || '?'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">
                            {reply.author?.firstName || reply.author?.email?.split('@')[0]}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Add a Reply</h3>
                <div className="space-y-4">
                  <Textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={4}
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleCreateReply}
                      disabled={createReplyMutation.isPending || !newReply.trim()}
                    >
                      {createReplyMutation.isPending ? "Posting..." : "Post Reply"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      </div>
    </div>
  );
}