import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NavigationHeader } from "@/components/NavigationHeader";
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Shield, 
  Target,
  Newspaper,
  BarChart3,
  Users,
  RefreshCw
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  url: string;
  source: string;
  author?: string;
  publishedAt: string;
  category: string;
  truthScore?: string;
  biasScore?: string;
  propagandaRisk?: string;
  credibilityScore?: string;
  sentiment?: string;
  emotionalLanguage?: boolean;
  mentionedPoliticians?: string[];
  mentionedParties?: string[];
  analysisNotes?: string;
}

interface NewsSource {
  id: number;
  sourceName: string;
  overallCredibility: string;
  factualReporting: string;
  biasRating: string;
  propagandaFrequency: string;
  totalArticles: number;
  accurateReports: number;
  misleadingReports: number;
  falseReports: number;
  lastEvaluated: string;
}

interface PoliticianTruthfulness {
  politician_truth_tracking: {
    id: number;
    politicianId: number;
    overallTruthScore: string;
    promiseKeepingScore: string;
    factualAccuracyScore: string;
    consistencyScore: string;
    totalStatements: number;
    truthfulStatements: number;
    misleadingStatements: number;
    falseStatements: number;
    lastUpdated: string;
  };
  politicians: {
    id: number;
    name: string;
    position: string;
    party?: string;
    province?: string;
  } | null;
}

export default function News() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const { toast } = useToast();

  const { data: articles = [], isLoading: articlesLoading } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news/articles'],
  });

  const { data: sources = [], isLoading: sourcesLoading } = useQuery<NewsSource[]>({
    queryKey: ['/api/news/sources'],
  });

  const { data: politicianTruthfulness = [], isLoading: truthfulnessLoading } = useQuery<PoliticianTruthfulness[]>({
    queryKey: ['/api/politicians/truthfulness'],
  });

  const analyzeNewsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/news/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to analyze news');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Analysis Complete",
        description: "News analysis and propaganda detection completed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/news/articles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/news/sources'] });
      queryClient.invalidateQueries({ queryKey: ['/api/politicians/truthfulness'] });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getTruthScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 80) return "text-green-600";
    if (numScore >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPropagandaRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return "bg-green-100 text-green-800";
      case 'medium': return "bg-yellow-100 text-yellow-800";
      case 'high': return "bg-red-100 text-red-800";
      case 'extreme': return "bg-red-200 text-red-900";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getBiasIndicator = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore < -30) return { label: "Left", color: "bg-blue-500" };
    if (numScore > 30) return { label: "Right", color: "bg-red-500" };
    return { label: "Center", color: "bg-green-500" };
  };

  if (articlesLoading || sourcesLoading || truthfulnessLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading news analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Eye className="h-10 w-10 text-blue-600" />
                News Analysis & Propaganda Detection
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                Real-time analysis of Canadian news sources with AI-powered propaganda detection and politician truthfulness tracking
              </p>
            </div>
            <Button 
              onClick={() => analyzeNewsMutation.mutate()}
              disabled={analyzeNewsMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {analyzeNewsMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              Run Analysis
            </Button>
          </div>

          <Tabs defaultValue="articles" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="articles" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                Articles & Analysis
              </TabsTrigger>
              <TabsTrigger value="sources" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Source Credibility
              </TabsTrigger>
              <TabsTrigger value="politicians" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Politician Truthfulness
              </TabsTrigger>
            </TabsList>

            <TabsContent value="articles">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Recent Political News</h2>
                  {articles.length === 0 ? (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        No news articles have been analyzed yet. Click "Run Analysis" to start scanning Canadian news sources.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    articles.map((article) => (
                      <Card 
                        key={article.id} 
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedArticle?.id === article.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setSelectedArticle(article)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <span className="font-medium">{article.source}</span>
                                {article.author && <span>• {article.author}</span>}
                                <span>• {new Date(article.publishedAt).toLocaleDateString()}</span>
                              </CardDescription>
                            </div>
                            {article.propagandaRisk && (
                              <Badge className={getPropagandaRiskColor(article.propagandaRisk)}>
                                {article.propagandaRisk.toUpperCase()} RISK
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        
                        {(article.truthScore || article.biasScore) && (
                          <CardContent className="pt-0">
                            <div className="flex items-center gap-4 text-sm">
                              {article.truthScore && (
                                <div className="flex items-center gap-1">
                                  <Target className="h-4 w-4" />
                                  <span className={getTruthScoreColor(article.truthScore)}>
                                    Truth: {parseFloat(article.truthScore).toFixed(0)}%
                                  </span>
                                </div>
                              )}
                              {article.biasScore && (
                                <div className="flex items-center gap-1">
                                  {getBiasIndicator(article.biasScore).label === "Left" && <TrendingDown className="h-4 w-4 text-blue-500" />}
                                  {getBiasIndicator(article.biasScore).label === "Right" && <TrendingUp className="h-4 w-4 text-red-500" />}
                                  {getBiasIndicator(article.biasScore).label === "Center" && <div className="h-4 w-4 rounded-full bg-green-500" />}
                                  <span>{getBiasIndicator(article.biasScore).label}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))
                  )}
                </div>

                <div className="space-y-4">
                  {selectedArticle ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">{selectedArticle.title}</CardTitle>
                        <CardDescription>
                          <a 
                            href={selectedArticle.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Read full article →
                          </a>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Truth and Credibility Scores */}
                        {selectedArticle.truthScore && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Truth Score</span>
                              <span className={`text-sm font-semibold ${getTruthScoreColor(selectedArticle.truthScore)}`}>
                                {parseFloat(selectedArticle.truthScore).toFixed(0)}%
                              </span>
                            </div>
                            <Progress value={parseFloat(selectedArticle.truthScore)} className="h-2" />
                          </div>
                        )}

                        {selectedArticle.credibilityScore && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Credibility Score</span>
                              <span className={`text-sm font-semibold ${getTruthScoreColor(selectedArticle.credibilityScore)}`}>
                                {parseFloat(selectedArticle.credibilityScore).toFixed(0)}%
                              </span>
                            </div>
                            <Progress value={parseFloat(selectedArticle.credibilityScore)} className="h-2" />
                          </div>
                        )}

                        {/* Political Mentions */}
                        {selectedArticle.mentionedPoliticians && selectedArticle.mentionedPoliticians.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Politicians Mentioned</h4>
                            <div className="flex flex-wrap gap-1">
                              {selectedArticle.mentionedPoliticians.map((politician, index) => (
                                <Badge key={index} variant="outline">{politician}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedArticle.mentionedParties && selectedArticle.mentionedParties.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Parties Mentioned</h4>
                            <div className="flex flex-wrap gap-1">
                              {selectedArticle.mentionedParties.map((party, index) => (
                                <Badge key={index} variant="outline">{party}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Analysis Notes */}
                        {selectedArticle.analysisNotes && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">AI Analysis</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                              {selectedArticle.analysisNotes}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Select an article to view detailed analysis</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sources">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">News Source Credibility Rankings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sources.map((source) => (
                    <Card key={source.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{source.sourceName}</CardTitle>
                        <CardDescription>
                          Analyzed {source.totalArticles} articles
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Overall Credibility</span>
                            <span className={`text-sm font-semibold ${getTruthScoreColor(source.overallCredibility)}`}>
                              {parseFloat(source.overallCredibility).toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={parseFloat(source.overallCredibility)} className="h-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Factual Reporting</span>
                            <span className={`text-sm font-semibold ${getTruthScoreColor(source.factualReporting)}`}>
                              {parseFloat(source.factualReporting).toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={parseFloat(source.factualReporting)} className="h-2" />
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                          <div>
                            <div className="text-lg font-semibold text-green-600">{source.accurateReports}</div>
                            <div className="text-gray-500">Accurate</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-yellow-600">{source.misleadingReports}</div>
                            <div className="text-gray-500">Misleading</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-red-600">{source.falseReports}</div>
                            <div className="text-gray-500">False</div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 text-center">
                          Last evaluated: {new Date(source.lastEvaluated).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="politicians">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Politician Truthfulness Rankings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {politicianTruthfulness.map((data) => (
                    data.politicians && (
                      <Card key={data.politician_truth_tracking.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{data.politicians.name}</CardTitle>
                          <CardDescription>
                            {data.politicians.position}
                            {data.politicians.party && ` • ${data.politicians.party}`}
                            {data.politicians.province && ` • ${data.politicians.province}`}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">Overall Truth Score</span>
                              <span className={`text-sm font-semibold ${getTruthScoreColor(data.politician_truth_tracking.overallTruthScore)}`}>
                                {parseFloat(data.politician_truth_tracking.overallTruthScore).toFixed(0)}%
                              </span>
                            </div>
                            <Progress value={parseFloat(data.politician_truth_tracking.overallTruthScore)} className="h-2" />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">Promise Keeping</span>
                              <span className={`text-sm font-semibold ${getTruthScoreColor(data.politician_truth_tracking.promiseKeepingScore)}`}>
                                {parseFloat(data.politician_truth_tracking.promiseKeepingScore).toFixed(0)}%
                              </span>
                            </div>
                            <Progress value={parseFloat(data.politician_truth_tracking.promiseKeepingScore)} className="h-2" />
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-center text-sm">
                            <div>
                              <div className="text-lg font-semibold text-green-600">
                                {data.politician_truth_tracking.truthfulStatements}
                              </div>
                              <div className="text-gray-500">Truthful</div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-red-600">
                                {data.politician_truth_tracking.falseStatements}
                              </div>
                              <div className="text-gray-500">False</div>
                            </div>
                          </div>

                          <div className="text-xs text-gray-500 text-center">
                            {data.politician_truth_tracking.totalStatements} total statements analyzed
                          </div>
                        </CardContent>
                      </Card>
                    )
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}