import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InteractiveContent } from "@/components/InteractiveContent";
import { 
  Search, Calendar, AlertTriangle, Book, Scale, FileText, Clock, MapPin, 
  Crown, Building2, Users, TrendingUp, AlertCircle, CheckCircle, ExternalLink
} from "lucide-react";

interface LawUpdate {
  id: number;
  lawType: string;
  title: string;
  description: string;
  changeType: string;
  effectiveDate: string;
  jurisdiction: string;
  province?: string;
  legalReference: string;
  summary: string;
  impactAnalysis: string;
  sourceUrl: string;
  createdAt: string;
}

interface CriminalCodeSection {
  id: number;
  sectionNumber: string;
  title: string;
  fullText: string;
  summary: string;
  penalties: string;
  recentChanges: string;
  relatedSections: string[];
}

interface LegalStats {
  totalSections: number;
  recentUpdates: number;
  federalChanges: number;
  provincialChanges: number;
  criminalCodeSections: number;
  acts: number;
  lastUpdated: string;
}

export default function Legal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("all");
  const [selectedSection, setSelectedSection] = useState<CriminalCodeSection | null>(null);

  const { data: lawUpdates = [], isLoading: updatesLoading } = useQuery<LawUpdate[]>({
    queryKey: ["/api/legal/updates", searchTerm, selectedCategory, selectedJurisdiction],
  });

  const { data: criminalCode = [], isLoading: codeLoading } = useQuery<CriminalCodeSection[]>({
    queryKey: ["/api/legal/criminal-code", searchTerm],
  });

  const { data: legalStats } = useQuery<LegalStats>({
    queryKey: ["/api/legal/stats"],
  });

  const getChangeTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "amendment": return "bg-blue-100 text-blue-800 border-blue-300";
      case "new": return "bg-green-100 text-green-800 border-green-300";
      case "repeal": return "bg-red-100 text-red-800 border-red-300";
      case "update": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getJurisdictionColor = (jurisdiction: string) => {
    switch (jurisdiction.toLowerCase()) {
      case "federal": return "bg-blue-100 text-blue-800 border-blue-300";
      case "provincial": return "bg-purple-100 text-purple-800 border-purple-300";
      case "municipal": return "bg-orange-100 text-orange-800 border-orange-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getJurisdictionIcon = (jurisdiction: string) => {
    switch (jurisdiction.toLowerCase()) {
      case "federal": return <Crown className="w-4 h-4" />;
      case "provincial": return <Building2 className="w-4 h-4" />;
      case "municipal": return <MapPin className="w-4 h-4" />;
      default: return <Scale className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isRecentUpdate = (dateString: string) => {
    const updateDate = new Date(dateString);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return updateDate > thirtyDaysAgo;
  };

  const filteredUpdates = lawUpdates.filter(update => {
    const matchesSearch = update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.legalReference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || update.lawType === selectedCategory;
    const matchesJurisdiction = selectedJurisdiction === "all" || update.jurisdiction === selectedJurisdiction;
    
    return matchesSearch && matchesCategory && matchesJurisdiction;
  });

  const filteredCriminalCode = criminalCode.filter(section => {
    return section.sectionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
           section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           section.summary.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (updatesLoading || codeLoading) {
    return (
      <div>
        <LuxuryNavigation />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                Loading Canadian legal database...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div>
      <LuxuryNavigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100 flex items-center">
                  <Scale className="w-8 h-8 mr-3 text-slate-600 dark:text-slate-400" />
                  Legal System Transparency
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Complete transparency of Canadian legal changes, criminal code sections, and law updates
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  <FileText className="w-3 h-3 mr-1" />
                  {lawUpdates.length} Updates
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  <Book className="w-3 h-3 mr-1" />
                  {criminalCode.length} Sections
                </Badge>
              </div>
            </div>

            {/* Legal Statistics */}
            {legalStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {legalStats.criminalCodeSections || 0}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Criminal Code Sections</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Book className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {legalStats.acts || 0}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Federal Acts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {legalStats.recentUpdates || 0}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Recent Updates</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {legalStats.lastUpdated ? formatDate(legalStats.lastUpdated) : "N/A"}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Last Updated</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search laws, sections, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                  <SelectValue placeholder="Filter by law type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Law Types</SelectItem>
                  <SelectItem value="criminal_code">Criminal Code</SelectItem>
                  <SelectItem value="civil_code">Civil Code</SelectItem>
                  <SelectItem value="statute">Statutes</SelectItem>
                  <SelectItem value="regulation">Regulations</SelectItem>
                  <SelectItem value="charter">Charter Rights</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                  <SelectValue placeholder="Filter by jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jurisdictions</SelectItem>
                  <SelectItem value="federal">Federal</SelectItem>
                  <SelectItem value="provincial">Provincial</SelectItem>
                  <SelectItem value="municipal">Municipal</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Recent Changes
              </Button>
            </div>
          </div>

          <Tabs defaultValue="updates" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <TabsTrigger value="updates">Law Updates</TabsTrigger>
              <TabsTrigger value="criminal-code">Criminal Code</TabsTrigger>
              <TabsTrigger value="rights">Charter Rights</TabsTrigger>
            </TabsList>

            <TabsContent value="updates" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 gap-6">
                {filteredUpdates.map((update) => (
                  <Card 
                    key={update.id} 
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getJurisdictionIcon(update.jurisdiction)}
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                              {update.title}
                            </h3>
                            {isRecentUpdate(update.createdAt) && (
                              <Badge className="bg-red-100 text-red-700 border-red-300">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-600 dark:text-slate-400">
                            {update.description}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={`${getChangeTypeColor(update.changeType)}`}>
                            {update.changeType}
                          </Badge>
                          <Badge className={`${getJurisdictionColor(update.jurisdiction)}`}>
                            {getJurisdictionIcon(update.jurisdiction)}
                            <span className="ml-1">{update.jurisdiction}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-600 dark:text-slate-400">Effective:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {formatDate(update.effectiveDate)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-600 dark:text-slate-400">Reference:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {update.legalReference}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Book className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-600 dark:text-slate-400">Type:</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {update.lawType.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Summary</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{update.summary}</p>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Impact Analysis</h4>
                        <p className="text-sm text-blue-800 dark:text-blue-200">{update.impactAnalysis}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          Updated {formatDate(update.createdAt)}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={update.sourceUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Source
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredUpdates.length === 0 && (
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        No Law Updates Found
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        No law updates match your current filter criteria. Try adjusting your search terms or filters.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="criminal-code" className="space-y-6 mt-6">
              {!selectedSection ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCriminalCode.map((section) => (
                    <Card 
                      key={section.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      onClick={() => setSelectedSection(section)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                              Section {section.sectionNumber}
                            </h3>
                            <h4 className="text-md font-semibold text-slate-700 dark:text-slate-300">
                              {section.title}
                            </h4>
                          </div>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                            Criminal Code
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {section.summary}
                        </p>
                        
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                          <h5 className="font-semibold text-red-900 dark:text-red-100 text-sm mb-1">Penalties</h5>
                          <p className="text-sm text-red-800 dark:text-red-200">{section.penalties}</p>
                        </div>

                        {section.recentChanges && (
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                            <h5 className="font-semibold text-yellow-900 dark:text-yellow-100 text-sm mb-1">Recent Changes</h5>
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">{section.recentChanges}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Users className="w-4 h-4" />
                            {section.relatedSections.length} related sections
                          </div>
                          <Button variant="outline" size="sm">
                            View Details →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredCriminalCode.length === 0 && (
                    <div className="col-span-2">
                      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardContent className="p-8 text-center">
                          <Book className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            No Criminal Code Sections Found
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400">
                            No sections match your search criteria. Try different keywords.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedSection(null)}
                      className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                    >
                      ← Back to Sections
                    </Button>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Section {selectedSection.sectionNumber} - {selectedSection.title}
                    </h2>
                  </div>

                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Full Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {selectedSection.fullText}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-red-900 dark:text-red-100">Penalties</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-700 dark:text-slate-300">{selectedSection.penalties}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Related Sections</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedSection.relatedSections.map((relatedSection, index) => (
                            <Badge key={index} variant="outline" className="mr-2 mb-2">
                              Section {relatedSection}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <InteractiveContent
                    targetType="post"
                    targetId={selectedSection.id}
                    title={`Section ${selectedSection.sectionNumber} - ${selectedSection.title}`}
                    description={selectedSection.summary}
                    showVoting={true}
                    showComments={true}
                    showSharing={true}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="rights" className="space-y-6 mt-6">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    Canadian Charter of Rights and Freedoms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Charter Rights Database</h3>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Comprehensive database of Charter rights, court decisions, and constitutional interpretations is being compiled from official government sources.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Legal Disclaimer */}
          <div className="mt-8">
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                      Legal Information Disclaimer
                    </h3>
                    <p className="text-amber-800 dark:text-amber-200 text-sm">
                      This information is provided for transparency and educational purposes. 
                      Always consult with a qualified legal professional for specific legal advice. 
                      Law changes may have implementation delays or require additional regulatory processes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}