import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { Search, Scale, FileText, Gavel, Calendar, MapPin, ExternalLink } from "lucide-react";

export default function LegalSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [jurisdiction, setJurisdiction] = useState("all");

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['/api/search', searchQuery, searchType, jurisdiction],
    enabled: searchQuery.length > 2,
    refetchOnWindowFocus: false
  });

  const { data: legalActs = [] } = useQuery({
    queryKey: ['/api/legal/acts'],
    refetchInterval: 300000 // 5 minutes
  });

  const { data: legalCases = [] } = useQuery({
    queryKey: ['/api/legal/cases'],
    refetchInterval: 300000
  });

  const handleSearch = () => {
    if (searchQuery.length > 2) {
      // Search will be triggered by the query key change
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Scale className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100">
              Legal Database Search
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-3xl mx-auto">
            Search comprehensive Canadian legal database including Criminal Code sections, federal acts, provincial laws, and Supreme Court decisions
          </p>
        </div>

        {/* Search Interface */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Advanced Legal Search
            </CardTitle>
            <CardDescription>
              Search across legal acts, court cases, and Criminal Code sections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search legal documents, case names, or act titles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full"
                />
              </div>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Search Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Legal Documents</SelectItem>
                  <SelectItem value="legal_act">Legal Acts</SelectItem>
                  <SelectItem value="legal_case">Court Cases</SelectItem>
                  <SelectItem value="criminal_code">Criminal Code</SelectItem>
                </SelectContent>
              </Select>
              <Select value={jurisdiction} onValueChange={setJurisdiction}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jurisdictions</SelectItem>
                  <SelectItem value="federal">Federal</SelectItem>
                  <SelectItem value="provincial">Provincial</SelectItem>
                  <SelectItem value="supreme">Supreme Court</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} className="px-8">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchQuery.length > 2 && (
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                {isLoading ? "Searching..." : `Found ${searchResults.length} results for "${searchQuery}"`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {searchResults.map((result: any, index: number) => (
                      <div key={index} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {result.type === 'legal_act' ? 'Legal Act' : 
                                 result.type === 'legal_case' ? 'Court Case' : 
                                 result.type === 'politician' ? 'Politician' : 'Bill'}
                              </Badge>
                              {result.type === 'legal_act' && <FileText className="w-4 h-4 text-blue-600" />}
                              {result.type === 'legal_case' && <Gavel className="w-4 h-4 text-purple-600" />}
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                              {result.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {result.description || 'No description available'}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-slate-500">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        )}

        {/* Legal Database Browse */}
        <Tabs defaultValue="acts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <TabsTrigger value="acts">Legal Acts ({legalActs.length})</TabsTrigger>
            <TabsTrigger value="cases">Court Cases ({legalCases.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="acts" className="mt-6">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Recent Legal Acts
                </CardTitle>
                <CardDescription>
                  Latest federal and provincial legal acts and legislation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {legalActs.slice(0, 20).map((act: any) => (
                      <div key={act.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {act.jurisdiction}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {act.category || 'General'}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                              {act.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {act.summary?.substring(0, 200) || 'No summary available'}
                              {act.summary?.length > 200 && '...'}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {act.date_enacted ? new Date(act.date_enacted).toLocaleDateString() : 'Date unknown'}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {act.jurisdiction}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-slate-500">
                        Loading legal acts...
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cases" className="mt-6">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-purple-600" />
                  Recent Court Cases
                </CardTitle>
                <CardDescription>
                  Latest Supreme Court and federal court decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {legalCases.slice(0, 20).map((case_item: any) => (
                      <div key={case_item.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {case_item.court}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {case_item.case_number}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                              {case_item.case_name}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {case_item.summary?.substring(0, 200) || 'No summary available'}
                              {case_item.summary?.length > 200 && '...'}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {case_item.date_decided ? new Date(case_item.date_decided).toLocaleDateString() : 'Date unknown'}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {case_item.jurisdiction}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-slate-500">
                        Loading court cases...
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}