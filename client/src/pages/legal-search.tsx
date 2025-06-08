import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Scale, BookOpen, Gavel, FileText, AlertCircle, ExternalLink } from "lucide-react";

interface CriminalCodeSection {
  id: number;
  sectionNumber: string;
  title: string;
  offense: string;
  content: string;
  maxPenalty: string;
  minPenalty: string;
  isSummary: boolean;
  isIndictable: boolean;
  isHybrid: boolean;
  explanationSimple: string;
  commonExamples: string[];
  defenses: string[];
  relatedSections: string[];
  amendments: Record<string, string>;
}

interface LegalAct {
  id: number;
  title: string;
  shortTitle: string;
  actNumber: string;
  jurisdiction: string;
  category: string;
  dateEnacted: string;
  lastAmended?: string;
  summary: string;
  keyProvisions: string[];
  relatedActs: string[];
  sourceUrl: string;
  province?: string;
}

interface LegalCase {
  id: number;
  caseName: string;
  caseNumber: string;
  court: string;
  jurisdiction: string;
  dateDecided: string;
  judge: string;
  parties: Record<string, string>;
  summary: string;
  ruling: string;
  precedentSet: string;
  keyQuotes: string[];
  significance: string;
  sourceUrl: string;
}

export default function LegalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("criminal");
  const [filters, setFilters] = useState({
    jurisdiction: "",
    category: "",
    court: ""
  });

  // Fetch criminal code sections
  const { data: criminalCodeSections = [], isLoading: criminalLoading } = useQuery<CriminalCodeSection[]>({
    queryKey: ["/api/legal/criminal-code", searchQuery],
    enabled: selectedTab === "criminal"
  });

  // Fetch legal acts
  const { data: legalActs = [], isLoading: actsLoading } = useQuery<LegalAct[]>({
    queryKey: ["/api/legal/acts", filters.jurisdiction, filters.category, searchQuery],
    enabled: selectedTab === "acts"
  });

  // Fetch legal cases
  const { data: legalCases = [], isLoading: casesLoading } = useQuery<LegalCase[]>({
    queryKey: ["/api/legal/cases", filters.court, filters.jurisdiction, searchQuery],
    enabled: selectedTab === "cases"
  });

  // Search across all legal content
  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ["/api/legal/search", searchQuery],
    enabled: !!searchQuery && selectedTab === "search"
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setSelectedTab("search");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Legal Research Database
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Search through Canadian criminal code, federal acts, provincial legislation, and landmark legal cases
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex space-x-4 mb-8 max-w-2xl mx-auto">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search laws, cases, acts..."
          className="flex-1"
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="criminal">Criminal Code</TabsTrigger>
          <TabsTrigger value="acts">Federal Acts</TabsTrigger>
          <TabsTrigger value="cases">Legal Cases</TabsTrigger>
          <TabsTrigger value="search">Search Results</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="criminal" className="mt-6">
          <div className="grid gap-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Scale className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold">Canadian Criminal Code</h2>
              </div>
              <Badge variant="outline" className="text-sm">
                {criminalCodeSections.length} sections loaded
              </Badge>
            </div>
            
            {criminalLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Loading criminal code sections...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {criminalCodeSections.map((section) => (
                  <Card key={section.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          Section {section.sectionNumber}: {section.title}
                        </CardTitle>
                        <Badge variant="outline" className="ml-2">
                          {section.offense}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {section.content}
                      </p>
                      {section.explanationSimple && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Simple Explanation:</strong> {section.explanationSimple}
                          </p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="secondary" className="text-xs">
                          Max: {section.maxPenalty}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Min: {section.minPenalty}
                        </Badge>
                        {section.isHybrid && (
                          <Badge variant="outline" className="text-xs">
                            Hybrid Offence
                          </Badge>
                        )}
                      </div>
                      {section.commonExamples && section.commonExamples.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Common Examples:
                          </p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                            {section.commonExamples.slice(0, 3).map((example, idx) => (
                              <li key={idx}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="acts" className="mt-6">
          <div className="grid gap-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold">Federal & Provincial Acts</h2>
              </div>
              <div className="flex space-x-2">
                <Select 
                  value={filters.jurisdiction} 
                  onValueChange={(value) => setFilters({...filters, jurisdiction: value})}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Jurisdictions</SelectItem>
                    <SelectItem value="federal">Federal</SelectItem>
                    <SelectItem value="provincial">Provincial</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={filters.category} 
                  onValueChange={(value) => setFilters({...filters, category: value})}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="constitutional">Constitutional</SelectItem>
                    <SelectItem value="criminal">Criminal</SelectItem>
                    <SelectItem value="privacy">Privacy</SelectItem>
                    <SelectItem value="traffic">Traffic</SelectItem>
                    <SelectItem value="housing">Housing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {actsLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Loading legal acts...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {legalActs.map((act) => (
                  <Card key={act.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{act.title}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">{act.actNumber}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="capitalize">
                            {act.jurisdiction}
                          </Badge>
                          <Badge variant="secondary" className="capitalize">
                            {act.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {act.summary}
                      </p>
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Key Provisions:
                        </p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                          {act.keyProvisions.slice(0, 3).map((provision, idx) => (
                            <li key={idx}>{provision}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Enacted: {formatDate(act.dateEnacted)}</span>
                        {act.lastAmended && (
                          <span>Last Amended: {formatDate(act.lastAmended)}</span>
                        )}
                        <a 
                          href={act.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-purple-600 hover:text-purple-700"
                        >
                          View Source <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="cases" className="mt-6">
          <div className="grid gap-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Gavel className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold">Landmark Legal Cases</h2>
              </div>
              <Select 
                value={filters.court} 
                onValueChange={(value) => setFilters({...filters, court: value})}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filter by court" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Courts</SelectItem>
                  <SelectItem value="Supreme Court of Canada">Supreme Court of Canada</SelectItem>
                  <SelectItem value="Federal Court">Federal Court</SelectItem>
                  <SelectItem value="Provincial Court">Provincial Courts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {casesLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Loading legal cases...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {legalCases.map((legalCase) => (
                  <Card key={legalCase.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{legalCase.caseName}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">{legalCase.caseNumber}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="outline">
                            {legalCase.court}
                          </Badge>
                          <Badge variant="secondary" className="capitalize">
                            {legalCase.significance}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {legalCase.summary}
                      </p>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-3">
                        <p className="text-sm text-green-800 dark:text-green-300">
                          <strong>Precedent Set:</strong> {legalCase.precedentSet}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Decided: {formatDate(legalCase.dateDecided)}</span>
                        <span>Judge: {legalCase.judge}</span>
                        <a 
                          href={legalCase.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-purple-600 hover:text-purple-700"
                        >
                          View Case <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="search" className="mt-6">
          <div className="grid gap-6">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold">Search Results</h2>
              {searchQuery && (
                <Badge variant="outline">
                  Results for "{searchQuery}"
                </Badge>
              )}
            </div>
            
            {searchLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Searching legal database...</p>
              </div>
            ) : searchData ? (
              <div className="space-y-8">
                {searchData.criminalCode && searchData.criminalCode.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Criminal Code Sections</h3>
                    <div className="grid gap-4">
                      {searchData.criminalCode.map((section: CriminalCodeSection) => (
                        <Card key={section.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="pt-4">
                            <h4 className="font-medium">Section {section.sectionNumber}: {section.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {section.content.substring(0, 200)}...
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {searchData.acts && searchData.acts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Legal Acts</h3>
                    <div className="grid gap-4">
                      {searchData.acts.map((act: LegalAct) => (
                        <Card key={act.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="pt-4">
                            <h4 className="font-medium">{act.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {act.summary.substring(0, 200)}...
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {searchData.cases && searchData.cases.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Legal Cases</h3>
                    <div className="grid gap-4">
                      {searchData.cases.map((legalCase: LegalCase) => (
                        <Card key={legalCase.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="pt-4">
                            <h4 className="font-medium">{legalCase.caseName}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {legalCase.summary.substring(0, 200)}...
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Enter a search query
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Search through criminal code, acts, and cases to find relevant legal information
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="updates" className="mt-6">
          <div className="grid gap-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold">Recent Law Updates</h2>
            </div>
            
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Recent Updates
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Check back regularly for the latest changes to Canadian law
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}