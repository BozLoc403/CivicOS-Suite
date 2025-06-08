import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Newspaper, AlertTriangle, TrendingUp, MessageCircle, ExternalLink, Eye, Users } from "lucide-react";
import { Link } from "wouter";

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  credibilityScore: number;
  bias: 'left' | 'center' | 'right';
  propagandaScore: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  politiciansInvolved: Array<{
    id: number;
    name: string;
    stance: string;
    quotes: string[];
    position: string;
    party: string;
  }>;
  controversyLevel: 'low' | 'medium' | 'high';
  simplifiedSummary?: string;
  keyPoints: string[];
  publicReaction: {
    supportPercent: number;
    oppositionPercent: number;
    neutralPercent: number;
  };
  crossSourceAnalysis?: {
    sourceComparison: Array<{
      source: string;
      angle: string;
      bias: string;
      credibility: number;
    }>;
    aiSummary: string;
    factCheck: {
      verified: boolean;
      discrepancies: string[];
    };
  };
}

interface Controversy {
  id: number;
  title: string;
  description: string;
  politician: {
    name: string;
    party: string;
    position: string;
    profileImage?: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  dateReported: string;
  sources: string[];
  publicImpact: number;
  relatedArticles: number;
}

export default function NewsAnalysisWidget() {
  const { data: articles = [], isLoading: articlesLoading } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news/articles'],
    refetchInterval: 60000, // Refresh every minute for breaking news
    select: (data) => data.slice(0, 6), // Show latest 6 articles
  });

  const { data: controversies = [], isLoading: controversiesLoading } = useQuery<Controversy[]>({
    queryKey: ['/api/news/controversies'],
    refetchInterval: 120000, // Refresh every 2 minutes
    select: (data) => data.slice(0, 3), // Show top 3 controversies
  });

  const { data: trendingTopics = [] } = useQuery({
    queryKey: ['/api/news/trending'],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const getCredibilityColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'right': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getControversyIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <MessageCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  if (articlesLoading && controversiesLoading) {
    return (
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5" />
            <span>News Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5" />
            <span>News Analysis</span>
          </div>
          <Badge variant="outline" className="text-xs">
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto">
        <div className="space-y-3">
          {/* Show empty state when no authentic data is available */}
          {articles.length === 0 && controversies.length === 0 ? (
            <div className="text-center py-8">
              <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                News Analysis Loading
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Analyzing authentic news sources from CBC, CTV, and other verified Canadian media outlets. 
                AI-powered analysis includes credibility scoring and propaganda detection.
              </p>
            </div>
          ) : (
            <>
              {/* Trending Controversies */}
              {controversies.length > 0 && (
                <div className="border-l-4 border-red-500 pl-3 mb-4">
                  <h4 className="font-medium text-sm mb-2 text-red-700 dark:text-red-300">
                    🚨 Active Controversies
                  </h4>
                  <div className="space-y-2">
                    {controversies.map((controversy) => (
                      <div key={controversy.id} className="border rounded-lg p-2 bg-red-50 dark:bg-red-900/20">
                        <div className="flex items-start space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={controversy.politician.profileImage} />
                            <AvatarFallback className="text-xs">
                              {controversy.politician.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              {getControversyIcon(controversy.severity)}
                              <Badge className={`text-xs ${getSeverityColor(controversy.severity)}`}>
                                {controversy.severity}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(controversy.dateReported).toLocaleDateString()}
                              </span>
                            </div>
                            <h5 className="font-medium text-xs mb-1">{controversy.politician.name}</h5>
                            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                              {controversy.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {controversy.politician.party}
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <Eye className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{controversy.publicImpact}% impact</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* News Articles with Politician Stances */}
              {articles.map((article) => (
                <div key={article.id} className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={`text-xs ${getCredibilityColor(article.credibilityScore)}`}>
                          {article.credibilityScore}% credible
                        </Badge>
                        <Badge className={`text-xs ${getBiasColor(article.bias)}`}>
                          {article.bias}
                        </Badge>
                        {article.propagandaScore > 30 && (
                          <Badge variant="destructive" className="text-xs">
                            Propaganda Risk
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-sm mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                        {article.simplifiedSummary || article.summary}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{article.source}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="mt-4 pt-3 border-t">
          <Link href="/news">
            <Button variant="outline" size="sm" className="w-full">
              <Newspaper className="h-4 w-4 mr-2" />
              View All News Analysis
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}