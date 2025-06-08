import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Eye, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  Shield, 
  Target,
  BarChart3,
  Users,
  Clock,
  ExternalLink,
  Zap,
  Brain
} from "lucide-react";

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  credibilityScore: number;
  bias: string;
  category: string;
  url?: string;
}

interface CrossSourceAnalysis {
  sourceComparison: Array<{
    source: string;
    angle: string;
    bias: string;
    credibility: number;
    keyPoints: string[];
    omittedFacts: string[];
  }>;
  consensusFacts: string[];
  contradictions: Array<{
    fact: string;
    sources: Array<{
      source: string;
      claim: string;
      evidence: string;
    }>;
  }>;
  mediaManipulation: {
    detectedTechniques: string[];
    propagandaElements: string[];
    emotionalLanguage: string[];
  };
  unbiasedSummary: string;
  reliabilityScore: number;
  recommendations: string[];
}

interface NewsComparison {
  primaryArticle: NewsArticle;
  relatedArticles: NewsArticle[];
  crossSourceAnalysis: CrossSourceAnalysis;
  factCheckResults: {
    verifiedFacts: string[];
    disputedClaims: string[];
    unsupportedStatements: string[];
  };
  publicInterestScore: number;
  credibilityAssessment: {
    overallScore: number;
    sourceDiversity: number;
    factualAccuracy: number;
    biasLevel: string;
  };
}

export function NewsAnalysisWidget() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [analysisData, setAnalysisData] = useState<NewsComparison | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: articles = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news/articles"],
  });

  const { data: trending = [] } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news/trending"],
  });

  const analyzeArticle = async (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsAnalyzing(true);
    
    try {
      const response = await fetch(`/api/news/analysis/${article.id}`);
      if (response.ok) {
        const data = await response.json();
        setAnalysisData(data);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getBiasColor = (bias: string) => {
    switch (bias.toLowerCase()) {
      case 'left': return 'text-blue-600';
      case 'right': return 'text-red-600';
      case 'center': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-civic-blue" />
            AI News Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedArticle && analysisData) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-civic-blue" />
              AI Cross-Source Analysis
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedArticle(null);
                setAnalysisData(null);
              }}
            >
              ← Back to Articles
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Article Header */}
            <div className="p-4 border rounded-lg bg-gradient-to-r from-civic-blue/5 to-civic-green/5">
              <h3 className="font-semibold text-lg mb-2">{selectedArticle.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{selectedArticle.source}</span>
                <Badge variant="outline" className={getBiasColor(selectedArticle.bias)}>
                  {selectedArticle.bias}
                </Badge>
                <span className={getCredibilityColor(selectedArticle.credibilityScore)}>
                  {selectedArticle.credibilityScore}% credible
                </span>
              </div>
            </div>

            {/* Analysis Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="sources">Sources</TabsTrigger>
                <TabsTrigger value="facts">Fact Check</TabsTrigger>
                <TabsTrigger value="bias">Bias Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-civic-blue">
                      {analysisData.credibilityAssessment.overallScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-civic-green">
                      {analysisData.publicInterestScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">Public Interest</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {analysisData.relatedArticles.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Related Sources</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Unbiased Summary
                  </h4>
                  <p className="text-sm bg-green-50 p-3 rounded border-l-4 border-green-500">
                    {analysisData.crossSourceAnalysis.unbiasedSummary}
                  </p>
                </div>

                {analysisData.crossSourceAnalysis.consensusFacts.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      Verified Facts
                    </h4>
                    <ul className="space-y-2">
                      {analysisData.crossSourceAnalysis.consensusFacts.slice(0, 3).map((fact, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysisData.crossSourceAnalysis.recommendations.length > 0 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>AI Recommendation:</strong> {analysisData.crossSourceAnalysis.recommendations[0]}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="sources" className="space-y-4">
                <div className="grid gap-4">
                  {analysisData.crossSourceAnalysis.sourceComparison.map((source, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{source.source}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getBiasColor(source.bias)}>
                            {source.bias}
                          </Badge>
                          <span className={`text-sm ${getCredibilityColor(source.credibility)}`}>
                            {source.credibility}% credible
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{source.angle}</p>
                      
                      {source.keyPoints.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Key Points:</h5>
                          <ul className="text-sm space-y-1">
                            {source.keyPoints.slice(0, 3).map((point, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-civic-blue">•</span> {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="facts" className="space-y-4">
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Verified Facts ({analysisData.factCheckResults.verifiedFacts.length})
                    </h4>
                    <ul className="space-y-2">
                      {analysisData.factCheckResults.verifiedFacts.slice(0, 5).map((fact, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-1 shrink-0" />
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {analysisData.factCheckResults.disputedClaims.length > 0 && (
                    <div className="border rounded-lg p-4 space-y-3">
                      <h4 className="font-semibold flex items-center gap-2 text-yellow-600">
                        <AlertTriangle className="h-4 w-4" />
                        Disputed Claims ({analysisData.factCheckResults.disputedClaims.length})
                      </h4>
                      <ul className="space-y-2">
                        {analysisData.factCheckResults.disputedClaims.slice(0, 3).map((claim, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-3 w-3 text-yellow-600 mt-1 shrink-0" />
                            {claim}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisData.factCheckResults.unsupportedStatements.length > 0 && (
                    <div className="border rounded-lg p-4 space-y-3">
                      <h4 className="font-semibold flex items-center gap-2 text-red-600">
                        <XCircle className="h-4 w-4" />
                        Unsupported Statements ({analysisData.factCheckResults.unsupportedStatements.length})
                      </h4>
                      <ul className="space-y-2">
                        {analysisData.factCheckResults.unsupportedStatements.slice(0, 3).map((statement, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <XCircle className="h-3 w-3 text-red-600 mt-1 shrink-0" />
                            {statement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="bias" className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">Source Diversity</h4>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(analysisData.credibilityAssessment.sourceDiversity / 5) * 100} 
                          className="flex-1"
                        />
                        <span className="text-sm font-medium">
                          {analysisData.credibilityAssessment.sourceDiversity}/5
                        </span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">Bias Level</h4>
                      <Badge 
                        variant="outline" 
                        className={
                          analysisData.credibilityAssessment.biasLevel === 'high diversity' 
                            ? 'text-green-600' 
                            : analysisData.credibilityAssessment.biasLevel === 'moderate diversity'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }
                      >
                        {analysisData.credibilityAssessment.biasLevel}
                      </Badge>
                    </div>
                  </div>

                  {analysisData.crossSourceAnalysis.mediaManipulation.detectedTechniques.length > 0 && (
                    <div className="border rounded-lg p-4 space-y-3">
                      <h4 className="font-semibold flex items-center gap-2 text-red-600">
                        <Target className="h-4 w-4" />
                        Detected Manipulation Techniques
                      </h4>
                      <ul className="space-y-2">
                        {analysisData.crossSourceAnalysis.mediaManipulation.detectedTechniques.map((technique, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Target className="h-3 w-3 text-red-600 mt-1 shrink-0" />
                            {technique}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisData.crossSourceAnalysis.contradictions.length > 0 && (
                    <div className="border rounded-lg p-4 space-y-3">
                      <h4 className="font-semibold flex items-center gap-2 text-orange-600">
                        <AlertTriangle className="h-4 w-4" />
                        Source Contradictions
                      </h4>
                      {analysisData.crossSourceAnalysis.contradictions.slice(0, 2).map((contradiction, index) => (
                        <div key={index} className="bg-orange-50 p-3 rounded border-l-4 border-orange-500">
                          <p className="text-sm font-medium mb-2">{contradiction.fact}</p>
                          <div className="space-y-1">
                            {contradiction.sources.slice(0, 2).map((source, i) => (
                              <div key={i} className="text-xs text-muted-foreground">
                                <strong>{source.source}:</strong> {source.claim}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-civic-blue" />
          AI News Analysis
          <Badge variant="secondary" className="ml-auto">
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trending.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-civic-green" />
                Trending Stories
              </h3>
              {trending.slice(0, 2).map((article) => (
                <div 
                  key={article.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => analyzeArticle(article)}
                >
                  <h4 className="font-medium text-sm mb-2">{article.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{article.source}</span>
                    <Badge variant="outline" className={getBiasColor(article.bias)}>
                      {article.bias}
                    </Badge>
                    <span className={getCredibilityColor(article.credibilityScore)}>
                      {article.credibilityScore}% credible
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4 text-civic-blue" />
              Recent Articles
            </h3>
            {articles.slice(0, 3).map((article) => (
              <div 
                key={article.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => analyzeArticle(article)}
              >
                <h4 className="font-medium text-sm mb-2">{article.title}</h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{article.source}</span>
                  <Badge variant="outline" size="sm" className={getBiasColor(article.bias)}>
                    {article.bias}
                  </Badge>
                  <span className={getCredibilityColor(article.credibilityScore)}>
                    {article.credibilityScore}% credible
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {articles.length === 0 && trending.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No articles available for analysis</p>
              <p className="text-xs mt-1">News sources are being monitored for authentic Canadian content</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-civic-blue animate-pulse" />
                  <span className="font-medium">Analyzing article with AI...</span>
                </div>
                <Progress value={75} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Cross-referencing sources and detecting bias...
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}