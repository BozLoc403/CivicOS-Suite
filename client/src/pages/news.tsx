import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NavigationHeader } from "@/components/NavigationHeader";
import { AlertTriangle, CheckCircle, AlertCircle, DollarSign, Users, Globe, TrendingUp, Eye, Shield, FileText } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

interface MediaOutlet {
  id: string;
  name: string;
  website: string;
  credibilityScore: number;
  biasRating: string;
  factualReporting: string;
  transparencyScore: number;
  ownership: {
    type: string;
    owners: string[];
    publiclyTraded: boolean;
    stockSymbol?: string;
  };
  funding: {
    revenue: string[];
    advertisements: string[];
    subscriptions: boolean;
    donations: string[];
    government_funding: string[];
    corporate_sponsors: string[];
  };
  editorial: {
    editorialBoard: string[];
    editorInChief: string;
    politicalEndorsements: Array<{
      year: number;
      candidate: string;
      party: string;
      position: string;
    }>;
  };
  factCheckRecord: {
    totalChecked: number;
    accurate: number;
    misleading: number;
    false: number;
    lastUpdated: Date;
  };
  retractions: Array<{
    date: Date;
    headline: string;
    reason: string;
    severity: string;
  }>;
}

export default function News() {
  const [selectedOutlet, setSelectedOutlet] = useState<MediaOutlet | null>(null);
  const [analysisText, setAnalysisText] = useState("");
  const [analysisSource, setAnalysisSource] = useState("");
  const queryClient = useQueryClient();

  const { data: mediaOutlets = [], isLoading: outletsLoading } = useQuery<MediaOutlet[]>({
    queryKey: ["/api/news/outlets"],
  });

  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ["/api/news/articles"],
  });

  const credibilityMutation = useMutation({
    mutationFn: async (data: { articleText: string; sourceName: string }) => {
      return await apiRequest("/api/news/analyze-credibility", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
    }
  });

  const getCredibilityColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getCredibilityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  const getBiasColor = (bias: string) => {
    switch (bias.toLowerCase()) {
      case "left": return "bg-blue-100 text-blue-800";
      case "center-left": return "bg-blue-50 text-blue-700";
      case "center": return "bg-gray-100 text-gray-800";
      case "center-right": return "bg-red-50 text-red-700";
      case "right": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleAnalyzeCredibility = () => {
    if (analysisText && analysisSource) {
      credibilityMutation.mutate({
        articleText: analysisText,
        sourceName: analysisSource
      });
    }
  };

  if (outletsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-civic-blue mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading media credibility data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">News Analysis & Media Credibility</h2>
          <p className="text-gray-600">
            Analyze media sources, track funding, and evaluate credibility with authentic transparency data
          </p>
        </div>

        <Tabs defaultValue="outlets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="outlets">Media Outlets</TabsTrigger>
            <TabsTrigger value="analyze">Analyze Article</TabsTrigger>
            <TabsTrigger value="comparison">Outlet Comparison</TabsTrigger>
          </TabsList>

          {/* Media Outlets Tab */}
          <TabsContent value="outlets" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mediaOutlets.map((outlet) => (
                <Card key={outlet.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedOutlet(outlet)}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{outlet.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        {getCredibilityIcon(outlet.credibilityScore)}
                        <span className={`font-semibold ${getCredibilityColor(outlet.credibilityScore)}`}>
                          {outlet.credibilityScore}%
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Bias Rating:</span>
                        <Badge className={getBiasColor(outlet.biasRating)}>
                          {outlet.biasRating}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Factual Reporting:</span>
                        <Badge variant="outline">{outlet.factualReporting}</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Ownership:</span>
                        <Badge variant="secondary">{outlet.ownership.type}</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Funding Sources:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {outlet.funding.revenue.slice(0, 2).map((source, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {source}
                            </Badge>
                          ))}
                          {outlet.funding.revenue.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{outlet.funding.revenue.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {outlet.funding.government_funding.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <span className="text-xs text-yellow-800 font-medium">
                              Receives Government Funding
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Outlet View */}
            {selectedOutlet && (
              <Card className="mt-8">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{selectedOutlet.name}</CardTitle>
                      <p className="text-gray-600 mt-1">{selectedOutlet.website}</p>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedOutlet(null)}>
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Credibility Metrics */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Credibility Metrics</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Credibility Score:</span>
                          <div className="flex items-center gap-2">
                            {getCredibilityIcon(selectedOutlet.credibilityScore)}
                            <span className={`font-bold ${getCredibilityColor(selectedOutlet.credibilityScore)}`}>
                              {selectedOutlet.credibilityScore}%
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Transparency Score:</span>
                          <span className="font-semibold">{selectedOutlet.transparencyScore}%</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Bias Rating:</span>
                          <Badge className={getBiasColor(selectedOutlet.biasRating)}>
                            {selectedOutlet.biasRating}
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Factual Reporting:</span>
                          <Badge variant="outline">{selectedOutlet.factualReporting}</Badge>
                        </div>
                      </div>

                      {/* Fact Check Record */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-3">Fact Check Record</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total Checked:</span>
                            <span className="font-medium">{selectedOutlet.factCheckRecord.totalChecked}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Accurate:</span>
                            <span className="text-green-600 font-medium">{selectedOutlet.factCheckRecord.accurate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Misleading:</span>
                            <span className="text-yellow-600 font-medium">{selectedOutlet.factCheckRecord.misleading}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>False:</span>
                            <span className="text-red-600 font-medium">{selectedOutlet.factCheckRecord.false}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ownership & Funding */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Ownership & Funding</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Ownership
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Type:</span>
                              <Badge variant="secondary">{selectedOutlet.ownership.type}</Badge>
                            </div>
                            <div>
                              <span className="font-medium">Owners:</span>
                              <ul className="mt-1 space-y-1">
                                {selectedOutlet.ownership.owners.map((owner, index) => (
                                  <li key={index} className="text-gray-700">• {owner}</li>
                                ))}
                              </ul>
                            </div>
                            {selectedOutlet.ownership.publiclyTraded && (
                              <div className="flex justify-between">
                                <span>Stock Symbol:</span>
                                <span className="font-medium">{selectedOutlet.ownership.stockSymbol}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Funding Sources
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <span className="font-medium">Revenue:</span>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {selectedOutlet.funding.revenue.map((source, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {source}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {selectedOutlet.funding.government_funding.length > 0 && (
                              <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                                <span className="font-medium text-yellow-800">Government Funding:</span>
                                <ul className="mt-1 space-y-1">
                                  {selectedOutlet.funding.government_funding.map((funding, index) => (
                                    <li key={index} className="text-yellow-700 text-xs">• {funding}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div>
                              <span className="font-medium">Corporate Sponsors:</span>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {selectedOutlet.funding.corporate_sponsors.slice(0, 3).map((sponsor, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {sponsor}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Editorial Information */}
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Editorial
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Editor-in-Chief:</span>
                              <span className="ml-2">{selectedOutlet.editorial.editorInChief}</span>
                            </div>
                            
                            {selectedOutlet.editorial.politicalEndorsements.length > 0 && (
                              <div>
                                <span className="font-medium">Recent Endorsements:</span>
                                <ul className="mt-1 space-y-1">
                                  {selectedOutlet.editorial.politicalEndorsements.slice(0, 2).map((endorsement, index) => (
                                    <li key={index} className="text-gray-700 text-xs">
                                      • {endorsement.year}: {endorsement.candidate} ({endorsement.party}) - {endorsement.position}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Retractions */}
                  {selectedOutlet.retractions.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Recent Retractions</h3>
                      <div className="space-y-2">
                        {selectedOutlet.retractions.map((retraction, index) => (
                          <div key={index} className="bg-red-50 border border-red-200 rounded p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-red-900">{retraction.headline}</h4>
                                <p className="text-red-700 text-sm mt-1">{retraction.reason}</p>
                              </div>
                              <div className="text-right">
                                <Badge variant={retraction.severity === 'major' ? 'destructive' : 'outline'}>
                                  {retraction.severity}
                                </Badge>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(retraction.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analyze Article Tab */}
          <TabsContent value="analyze" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Credibility Analysis</CardTitle>
                <p className="text-gray-600">
                  Paste an article and source to analyze credibility, detect bias, and identify propaganda techniques
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Source Name</label>
                  <Select value={analysisSource} onValueChange={setAnalysisSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select or type media source..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mediaOutlets.map((outlet) => (
                        <SelectItem key={outlet.id} value={outlet.name}>
                          {outlet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Article Text</label>
                  <Textarea
                    value={analysisText}
                    onChange={(e) => setAnalysisText(e.target.value)}
                    placeholder="Paste the article content here..."
                    rows={10}
                  />
                </div>

                <Button 
                  onClick={handleAnalyzeCredibility}
                  disabled={!analysisText || !analysisSource || credibilityMutation.isPending}
                  className="w-full"
                >
                  {credibilityMutation.isPending ? "Analyzing..." : "Analyze Credibility"}
                </Button>

                {credibilityMutation.data && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-3">Analysis Results</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Credibility Score:</span>
                          <span className={`font-bold ${getCredibilityColor(credibilityMutation.data.credibilityScore)}`}>
                            {credibilityMutation.data.credibilityScore}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Factual Accuracy:</span>
                          <span className="font-semibold">{credibilityMutation.data.factualAccuracy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bias Detected:</span>
                          <Badge className={getBiasColor(credibilityMutation.data.biasDetected)}>
                            {credibilityMutation.data.biasDetected}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Propaganda Techniques:</span>
                        <div className="mt-1 space-y-1">
                          {credibilityMutation.data.propagandaTechniques.map((technique: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs mr-1">
                              {technique}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <h4 className="font-medium text-blue-900">Recommendation:</h4>
                      <p className="text-blue-800 text-sm mt-1">{credibilityMutation.data.recommendation}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Outlet Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Media Outlet Comparison</CardTitle>
                <p className="text-gray-600">
                  Compare credibility scores, funding sources, and bias ratings across outlets
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Outlet</th>
                        <th className="text-center p-2">Credibility</th>
                        <th className="text-center p-2">Bias</th>
                        <th className="text-center p-2">Ownership</th>
                        <th className="text-center p-2">Gov't Funding</th>
                        <th className="text-center p-2">Transparency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mediaOutlets.map((outlet) => (
                        <tr key={outlet.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{outlet.name}</td>
                          <td className="p-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {getCredibilityIcon(outlet.credibilityScore)}
                              <span className={getCredibilityColor(outlet.credibilityScore)}>
                                {outlet.credibilityScore}%
                              </span>
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            <Badge className={getBiasColor(outlet.biasRating)}>
                              {outlet.biasRating}
                            </Badge>
                          </td>
                          <td className="p-2 text-center">
                            <Badge variant="secondary">{outlet.ownership.type}</Badge>
                          </td>
                          <td className="p-2 text-center">
                            {outlet.funding.government_funding.length > 0 ? (
                              <AlertTriangle className="w-4 h-4 text-yellow-600 mx-auto" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                            )}
                          </td>
                          <td className="p-2 text-center">{outlet.transparencyScore}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}