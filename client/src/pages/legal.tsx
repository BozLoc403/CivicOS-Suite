import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavigationHeader } from "@/components/NavigationHeader";
import { Search, Calendar, AlertTriangle, Book, Scale, FileText, Clock, MapPin } from "lucide-react";

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

export default function Legal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("all");

  const { data: lawUpdates = [] } = useQuery<LawUpdate[]>({
    queryKey: ["/api/legal/updates", searchTerm, selectedCategory, selectedJurisdiction],
  });

  const { data: criminalCode = [] } = useQuery<CriminalCodeSection[]>({
    queryKey: ["/api/legal/criminal-code", searchTerm],
  });

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case "new": return "bg-green-100 text-green-800 border-green-300";
      case "amended": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "repealed": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getJurisdictionColor = (jurisdiction: string) => {
    switch (jurisdiction) {
      case "federal": return "bg-blue-100 text-blue-800";
      case "provincial": return "bg-purple-100 text-purple-800";
      case "municipal": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Scale className="w-8 h-8 mr-3 text-civic-blue" />
            Legal System Transparency
          </h1>
          <p className="mt-2 text-gray-600">
            Complete transparency of Canadian legal changes, criminal code sections, and law updates. 
            No legal jargon - just the facts about what's changing and how it affects you.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search laws, sections, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Law Types</option>
              <option value="criminal_code">Criminal Code</option>
              <option value="civil_code">Civil Code</option>
              <option value="statute">Statutes</option>
              <option value="regulation">Regulations</option>
            </select>
            
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Jurisdictions</option>
              <option value="federal">Federal</option>
              <option value="provincial">Provincial</option>
              <option value="municipal">Municipal</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Law Updates */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Recent Law Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lawUpdates.map((update) => (
                    <div key={update.id} className="border-l-4 border-civic-blue pl-4 py-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={getChangeTypeColor(update.changeType)}>
                            {update.changeType.toUpperCase()}
                          </Badge>
                          <Badge className={getJurisdictionColor(update.jurisdiction)}>
                            {update.jurisdiction}
                          </Badge>
                          {update.province && (
                            <Badge variant="outline">
                              <MapPin className="w-3 h-3 mr-1" />
                              {update.province}
                            </Badge>
                          )}
                          {isRecentUpdate(update.createdAt) && (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              NEW
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(update.effectiveDate)}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {update.title}
                      </h3>
                      
                      <p className="text-gray-700 mb-3">{update.summary}</p>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <strong>Legal Reference:</strong> {update.legalReference}
                      </div>
                      
                      {update.impactAnalysis && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <h4 className="font-medium text-blue-900 mb-1">Impact Analysis</h4>
                          <p className="text-blue-800 text-sm">{update.impactAnalysis}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Updated {formatDate(update.createdAt)}
                        </span>
                        {update.sourceUrl && (
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-1" />
                            View Full Text
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {lawUpdates.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No updates found</h3>
                      <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Criminal Code Quick Reference */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="w-5 h-5 mr-2" />
                  Criminal Code Lookup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criminalCode.slice(0, 10).map((section) => (
                    <div key={section.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="font-mono">
                          Section {section.sectionNumber}
                        </Badge>
                        {section.recentChanges && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Updated
                          </Badge>
                        )}
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-2">{section.title}</h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-3">{section.summary}</p>
                      
                      {section.penalties && (
                        <div className="text-xs text-red-700 bg-red-50 rounded px-2 py-1">
                          <strong>Penalties:</strong> {section.penalties}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    <Book className="w-4 h-4 mr-2" />
                    Browse All Sections
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Legal System Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Laws updated this month:</span>
                    <span className="font-medium">{lawUpdates.filter(u => isRecentUpdate(u.createdAt)).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total criminal code sections:</span>
                    <span className="font-medium">{criminalCode.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Federal changes:</span>
                    <span className="font-medium">{lawUpdates.filter(u => u.jurisdiction === 'federal').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provincial changes:</span>
                    <span className="font-medium">{lawUpdates.filter(u => u.jurisdiction === 'provincial').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Notices */}
        <div className="mt-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Legal Information Disclaimer
                  </h3>
                  <p className="text-red-800 text-sm">
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
  );
}