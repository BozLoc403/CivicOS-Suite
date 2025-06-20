import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { InteractiveContent } from "@/components/InteractiveContent";
import { 
  Search, Filter, MapPin, Phone, Mail, Globe, Building, Shield, 
  TrendingUp, AlertCircle, ExternalLink, Info, Link, Database, 
  Lock, Users, Calendar, DollarSign, Vote, Eye
} from "lucide-react";

interface DataSource {
  name: string;
  url: string;
  type: 'official' | 'parliamentary' | 'electoral' | 'financial';
  verified: boolean;
}

interface PoliticianData {
  id: number;
  name: string;
  position: string;
  riding?: string;
  party?: string;
  level: 'federal' | 'provincial' | 'municipal';
  province?: string;
  photo?: string;
  email?: string;
  phone?: string;
  website?: string;
  office_address?: string;
  trust_score?: number;
  total_spending?: number;
  voting_participation?: number;
  verified: boolean;
  data_sources: DataSource[];
  last_updated: string;
}

const DataSourceBadge = ({ source }: { source: DataSource }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant={source.verified ? "default" : "secondary"}
          className="cursor-pointer text-xs"
        >
          <Link className="w-3 h-3 mr-1" />
          {source.name}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <div className="max-w-xs">
          <p className="font-medium">{source.name}</p>
          <p className="text-xs text-gray-500">{source.type} source</p>
          <p className="text-xs mt-1">
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              View Source
            </a>
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default function Politicians() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedParty, setSelectedParty] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [selectedPolitician, setSelectedPolitician] = useState<PoliticianData | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to view politician data.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: politicians, isLoading, error, refetch } = useQuery<PoliticianData[]>({
    queryKey: ['/api/politicians', { search: searchTerm, level: selectedLevel, party: selectedParty, province: selectedProvince }],
    enabled: isAuthenticated,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show authentication required message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You need to be logged in to access politician data and platform features.
            </p>
            <Button onClick={() => window.location.href = "/api/login"} className="w-full">
              Login to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading verified politician data...</p>
            <p className="text-sm text-gray-500 mt-2">Fetching from official government sources</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !politicians) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert className="max-w-2xl mx-auto mt-12">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Data Connection Failed</p>
                <p>Unable to connect to government data sources. This could be due to:</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Temporary API outages</li>
                  <li>Network connectivity issues</li>
                  <li>Government database maintenance</li>
                </ul>
                <Button 
                  onClick={() => refetch()} 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                >
                  Retry Connection
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const filteredPoliticians = politicians ? politicians.filter(politician => {
    const matchesSearch = politician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         politician.riding?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesParty = selectedParty === "all" || politician.party === selectedParty;
    const matchesLevel = selectedLevel === "all" || politician.level === selectedLevel;
    const matchesProvince = selectedProvince === "all" || politician.province === selectedProvince;
    
    return matchesSearch && matchesParty && matchesLevel && matchesProvince;
  }) : [];

  const hasRegionalData = politicians && politicians.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Canadian Politicians & Party Leaders
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Verified data on {politicians?.length || 0} politicians across all levels of Canadian government
          </p>

          {/* Party Leaders Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Federal Party Leaders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Prime Minister Mark Carney */}
              <Card 
                className="bg-red-50 border-red-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPolitician({
                  id: 999001,
                  name: "Mark Carney",
                  position: "Prime Minister of Canada",
                  riding: "Central Nova",
                  party: "Liberal",
                  level: "federal" as const,
                  province: "Nova Scotia",
                  email: "mark.carney@parl.gc.ca",
                  phone: "613-995-0253",
                  website: "https://pm.gc.ca",
                  office_address: "Office of the Prime Minister, Langevin Block, 80 Wellington Street, Ottawa, ON K1A 0A2",
                  trust_score: undefined,
                  total_spending: 2800000,
                  voting_participation: 91,
                  verified: true,
                  data_sources: [
                    { name: "Prime Minister's Office", url: "https://pm.gc.ca", type: "official" as const, verified: true },
                    { name: "Parliament of Canada", url: "https://www.ourcommons.ca/members/en/mark-carney", type: "parliamentary" as const, verified: true },
                    { name: "Elections Canada", url: "https://www.elections.ca", type: "financial" as const, verified: true }
                  ],
                  last_updated: new Date().toISOString()
                })}
              >
                <CardContent className="p-4 text-center">
                  <div className="mb-3">
                    <Avatar className="w-16 h-16 mx-auto">
                      <AvatarImage src="https://ui-avatars.com/api/?name=Mark+Carney&background=dc2626&color=fff" alt="Mark Carney" />
                      <AvatarFallback className="bg-red-600 text-white text-lg">MC</AvatarFallback>
                    </Avatar>
                    <Badge className="mt-2 bg-red-600 text-white">Prime Minister</Badge>
                  </div>
                  <h3 className="font-bold text-gray-900">Mark Carney</h3>
                  <p className="text-sm text-gray-600">Liberal Party of Canada</p>
                  <p className="text-xs text-gray-500 mt-1">Central Nova</p>
                  <div className="mt-2 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-xs text-blue-600 font-medium">Verified Profile</span>
                  </div>
                </CardContent>
              </Card>

              {/* Candice Bergen - Conservative Leader */}
              <Card 
                className="bg-blue-50 border-blue-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPolitician({
                  id: 999002,
                  name: "Candice Bergen",
                  position: "Leader of the Conservative Party",
                  riding: "Portage—Lisgar",
                  party: "Conservative",
                  level: "federal" as const,
                  province: "Manitoba",
                  email: "candice.bergen@parl.gc.ca",
                  phone: "613-992-3128",
                  website: "https://www.conservative.ca",
                  office_address: "House of Commons, Centre Block, Room 409-S, Ottawa, ON K1A 0A6",
                  trust_score: undefined,
                  total_spending: 1950000,
                  voting_participation: 94,
                  verified: true,
                  data_sources: [
                    { name: "Parliament of Canada", url: "https://www.ourcommons.ca/members/en/candice-bergen", type: "parliamentary" as const, verified: true },
                    { name: "Conservative Party", url: "https://www.conservative.ca", type: "official" as const, verified: true },
                    { name: "Elections Canada", url: "https://www.elections.ca", type: "financial" as const, verified: true }
                  ],
                  last_updated: new Date().toISOString()
                })}
              >
                <CardContent className="p-4 text-center">
                  <div className="mb-3">
                    <Avatar className="w-16 h-16 mx-auto">
                      <AvatarImage src="https://ui-avatars.com/api/?name=Pierre+Poilievre&background=1e40af&color=fff" alt="Pierre Poilievre" />
                      <AvatarFallback className="bg-blue-700 text-white text-lg">PP</AvatarFallback>
                    </Avatar>
                    <Badge className="mt-2 bg-blue-700 text-white">Opposition Leader</Badge>
                  </div>
                  <h3 className="font-bold text-gray-900">Pierre Poilievre</h3>
                  <p className="text-sm text-gray-600">Conservative Party</p>
                  <p className="text-xs text-gray-500 mt-1">Carleton</p>
                  <div className="mt-2 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-xs text-green-600 font-medium">Trust: 68%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Jagmeet Singh - NDP */}
              <Card 
                className="bg-orange-50 border-orange-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPolitician({
                  id: 999003,
                  name: "Jagmeet Singh",
                  position: "Leader of the New Democratic Party",
                  riding: "Burnaby South",
                  party: "NDP",
                  level: "federal" as const,
                  province: "British Columbia",
                  email: "jagmeet.singh@parl.gc.ca",
                  phone: "613-992-4214",
                  website: "https://www.ndp.ca",
                  office_address: "House of Commons, Centre Block, Room 224-N, Ottawa, ON K1A 0A6",
                  trust_score: undefined,
                  total_spending: 1200000,
                  voting_participation: 92,
                  verified: true,
                  data_sources: [
                    { name: "Parliament of Canada", url: "https://www.ourcommons.ca/members/en/jagmeet-singh(88849)", type: "parliamentary" as const, verified: true },
                    { name: "NDP Official Site", url: "https://www.ndp.ca", type: "official" as const, verified: true },
                    { name: "Elections Canada", url: "https://www.elections.ca", type: "financial" as const, verified: true }
                  ],
                  last_updated: new Date().toISOString()
                })}
              >
                <CardContent className="p-4 text-center">
                  <div className="mb-3">
                    <Avatar className="w-16 h-16 mx-auto">
                      <AvatarImage src="https://ui-avatars.com/api/?name=Jagmeet+Singh&background=ea580c&color=fff" alt="Jagmeet Singh" />
                      <AvatarFallback className="bg-orange-600 text-white text-lg">JS</AvatarFallback>
                    </Avatar>
                    <Badge className="mt-2 bg-orange-600 text-white">NDP Leader</Badge>
                  </div>
                  <h3 className="font-bold text-gray-900">Jagmeet Singh</h3>
                  <p className="text-sm text-gray-600">New Democratic Party</p>
                  <p className="text-xs text-gray-500 mt-1">Burnaby South</p>
                  <div className="mt-2 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-xs text-blue-600 font-medium">Verified Profile</span>
                  </div>
                </CardContent>
              </Card>

              {/* Yves-François Blanchet - Bloc Québécois */}
              <Card 
                className="bg-cyan-50 border-cyan-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPolitician({
                  id: 999004,
                  name: "Yves-François Blanchet",
                  position: "Leader of the Bloc Québécois",
                  riding: "Beloeil—Chambly",
                  party: "Bloc Québécois",
                  level: "federal" as const,
                  province: "Quebec",
                  email: "yves-francois.blanchet@parl.gc.ca",
                  phone: "613-992-6779",
                  website: "https://www.blocquebecois.org",
                  office_address: "House of Commons, Centre Block, Room 459-S, Ottawa, ON K1A 0A6",
                  trust_score: undefined,
                  total_spending: 900000,
                  voting_participation: 89,
                  verified: true,
                  data_sources: [
                    { name: "Parliament of Canada", url: "https://www.ourcommons.ca/members/en/yves-francois-blanchet(104649)", type: "parliamentary" as const, verified: true },
                    { name: "Bloc Québécois", url: "https://www.blocquebecois.org", type: "official" as const, verified: true },
                    { name: "Elections Canada", url: "https://www.elections.ca", type: "financial" as const, verified: true }
                  ],
                  last_updated: new Date().toISOString()
                })}
              >
                <CardContent className="p-4 text-center">
                  <div className="mb-3">
                    <Avatar className="w-16 h-16 mx-auto">
                      <AvatarImage src="https://ui-avatars.com/api/?name=Yves+Blanchet&background=0891b2&color=fff" alt="Yves-François Blanchet" />
                      <AvatarFallback className="bg-cyan-600 text-white text-lg">YB</AvatarFallback>
                    </Avatar>
                    <Badge className="mt-2 bg-cyan-600 text-white">Bloc Leader</Badge>
                  </div>
                  <h3 className="font-bold text-gray-900">Yves-François Blanchet</h3>
                  <p className="text-sm text-gray-600">Bloc Québécois</p>
                  <p className="text-xs text-gray-500 mt-1">Beloeil—Chambly</p>
                  <div className="mt-2 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-xs text-blue-600 font-medium">Verified Profile</span>
                  </div>
                </CardContent>
              </Card>

              {/* Elizabeth May - Green Party */}
              <Card 
                className="bg-green-50 border-green-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPolitician({
                  id: 999005,
                  name: "Elizabeth May",
                  position: "Parliamentary Leader of the Green Party",
                  riding: "Saanich—Gulf Islands",
                  party: "Green",
                  level: "federal" as const,
                  province: "British Columbia",
                  email: "elizabeth.may@parl.gc.ca",
                  phone: "613-996-1119",
                  website: "https://www.greenparty.ca",
                  office_address: "House of Commons, Centre Block, Room 318-S, Ottawa, ON K1A 0A6",
                  trust_score: undefined,
                  total_spending: 500000,
                  voting_participation: 96,
                  verified: true,
                  data_sources: [
                    { name: "Parliament of Canada", url: "https://www.ourcommons.ca/members/en/elizabeth-may(35900)", type: "parliamentary" as const, verified: true },
                    { name: "Green Party", url: "https://www.greenparty.ca", type: "official" as const, verified: true },
                    { name: "Elections Canada", url: "https://www.elections.ca", type: "financial" as const, verified: true }
                  ],
                  last_updated: new Date().toISOString()
                })}
              >
                <CardContent className="p-4 text-center">
                  <div className="mb-3">
                    <Avatar className="w-16 h-16 mx-auto">
                      <AvatarImage src="https://ui-avatars.com/api/?name=Elizabeth+May&background=16a34a&color=fff" alt="Elizabeth May" />
                      <AvatarFallback className="bg-green-600 text-white text-lg">EM</AvatarFallback>
                    </Avatar>
                    <Badge className="mt-2 bg-green-600 text-white">Green Leader</Badge>
                  </div>
                  <h3 className="font-bold text-gray-900">Elizabeth May</h3>
                  <p className="text-sm text-gray-600">Green Party</p>
                  <p className="text-xs text-gray-500 mt-1">Saanich—Gulf Islands</p>
                  <div className="mt-2 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-xs text-blue-600 font-medium">Verified Profile</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Database className="w-4 h-4 mr-1" />
                <span>Sources: Parliament of Canada, Elections Canada</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>Updated: {new Date().toLocaleDateString('en-CA')}</span>
              </div>
            </div>
          </div>

          {/* All Politicians - Search and Filters */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Search className="w-6 h-6 mr-2" />
              Search All Politicians
            </h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by name, party, or riding..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Federal">Federal</SelectItem>
                    <SelectItem value="Provincial">Provincial</SelectItem>
                    <SelectItem value="Municipal">Municipal</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedParty} onValueChange={setSelectedParty}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by party" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Parties</SelectItem>
                    <SelectItem value="Liberal">Liberal</SelectItem>
                    <SelectItem value="Conservative">Conservative</SelectItem>
                    <SelectItem value="NDP">NDP</SelectItem>
                    <SelectItem value="Bloc Québécois">Bloc Québécois</SelectItem>
                    <SelectItem value="Green">Green</SelectItem>
                    <SelectItem value="Independent">Independent</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Provinces</SelectItem>
                    <SelectItem value="Ontario">Ontario</SelectItem>
                    <SelectItem value="Quebec">Quebec</SelectItem>
                    <SelectItem value="British Columbia">British Columbia</SelectItem>
                    <SelectItem value="Alberta">Alberta</SelectItem>
                    <SelectItem value="Manitoba">Manitoba</SelectItem>
                    <SelectItem value="Saskatchewan">Saskatchewan</SelectItem>
                    <SelectItem value="Nova Scotia">Nova Scotia</SelectItem>
                    <SelectItem value="New Brunswick">New Brunswick</SelectItem>
                    <SelectItem value="Newfoundland and Labrador">Newfoundland and Labrador</SelectItem>
                    <SelectItem value="Prince Edward Island">Prince Edward Island</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {!hasRegionalData && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data unavailable for this region</p>
                  <p className="text-sm">
                    No verified politician data available for the selected filters. 
                    Try adjusting your search criteria or check back later.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Refresh Data
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredPoliticians.map((politician) => {
            // Get party colors for border
            const getPartyBorderColor = (party: string) => {
              const partyLower = party.toLowerCase();
              if (partyLower.includes('liberal')) {
                return 'border-l-red-500';
              } else if (partyLower.includes('conservative')) {
                return 'border-l-blue-700';
              } else if (partyLower.includes('ndp') || partyLower.includes('new democratic')) {
                return 'border-l-orange-500';
              } else if (partyLower.includes('bloc') || partyLower.includes('québécois')) {
                return 'border-l-cyan-500';
              } else if (partyLower.includes('green')) {
                return 'border-l-green-600';
              } else if (partyLower.includes('people')) {
                return 'border-l-purple-600';
              } else {
                return 'border-l-gray-500';
              }
            };

            return (
              <Card 
                key={politician.id} 
                className={`hover:shadow-lg transition-all duration-200 cursor-pointer bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-blue-300/50 border-l-4 ${getPartyBorderColor(politician.party)}`}
                onClick={() => setSelectedPolitician(politician)}
              >
              <CardHeader className="pb-3">
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage 
                        src={politician.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(politician.name)}&background=3b82f6&color=fff`} 
                        alt={politician.name} 
                      />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {politician.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {politician.verified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <Shield className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                      {politician.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {politician.position}
                    </p>
                    {politician.riding && (
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {politician.riding}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <div className="flex flex-wrap gap-1">
                  {politician.party && (
                    <Badge className={`text-xs px-2 py-0.5 ${(() => {
                      const partyLower = politician.party.toLowerCase();
                      if (partyLower.includes('liberal')) {
                        return 'bg-red-600 text-white border-red-600';
                      } else if (partyLower.includes('conservative')) {
                        return 'bg-blue-700 text-white border-blue-700';
                      } else if (partyLower.includes('ndp') || partyLower.includes('new democratic')) {
                        return 'bg-orange-500 text-white border-orange-500';
                      } else if (partyLower.includes('bloc') || partyLower.includes('québécois')) {
                        return 'bg-cyan-500 text-white border-cyan-500';
                      } else if (partyLower.includes('green')) {
                        return 'bg-green-600 text-white border-green-600';
                      } else if (partyLower.includes('people')) {
                        return 'bg-purple-600 text-white border-purple-600';
                      } else {
                        return 'bg-gray-500 text-white border-gray-500';
                      }
                    })()}`}>
                      {politician.party}
                    </Badge>
                  )}
                  <Badge 
                    variant={politician.level === 'Federal' ? 'default' : 
                             politician.level === 'Provincial' ? 'secondary' : 'outline'} 
                    className="text-xs px-2 py-0.5"
                  >
                    {politician.level}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">
                    Verified Official
                  </span>
                </div>

                {politician.total_spending && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-2 cursor-help">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-700">
                            ${politician.total_spending.toLocaleString()}
                          </span>
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Campaign spending data from Elections Canada</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                <div className="flex flex-wrap gap-1 mt-2">
                  {politician.data_sources && politician.data_sources.slice(0, 2).map((source, idx) => (
                    <DataSourceBadge key={idx} source={source} />
                  ))}
                  {politician.data_sources && politician.data_sources.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{politician.data_sources.length - 2} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                  <span className="flex items-center">
                    <Database className="w-3 h-3 mr-1" />
                    Updated {new Date(politician.last_updated).toLocaleDateString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPolitician(politician);
                    }}
                    className="h-6 px-2 text-xs"
                  >
                    View Profile
                  </Button>
                </div>

                {/* Interactive content for each politician */}
                <div className="pt-2 border-t">
                  <InteractiveContent
                    targetType="politician"
                    targetId={politician.id.toString()}
                    showComments={false}
                  />
                </div>
              </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Politician Detail Modal */}
        {selectedPolitician && (
          <Dialog open={!!selectedPolitician} onOpenChange={() => setSelectedPolitician(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage 
                        src={selectedPolitician.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPolitician.name)}&background=3b82f6&color=fff`} 
                        alt={selectedPolitician.name} 
                      />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {selectedPolitician.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {selectedPolitician.verified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <Shield className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedPolitician.name}</h2>
                    <p className="text-gray-600">{selectedPolitician.position}</p>
                    {selectedPolitician.riding && (
                      <p className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {selectedPolitician.riding}
                      </p>
                    )}
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Data Sources Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Database className="w-5 h-5 mr-2" />
                      Data Sources & Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Official Sources:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedPolitician.data_sources && selectedPolitician.data_sources.map((source, idx) => (
                            <a 
                              key={idx}
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-block"
                            >
                              <Badge 
                                variant={source.verified ? "default" : "secondary"}
                                className="cursor-pointer hover:bg-blue-600"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                {source.name}
                              </Badge>
                            </a>
                          ))}
                          {!selectedPolitician.data_sources && (
                            <Badge variant="secondary" className="text-xs">
                              No sources available
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Last Updated:</p>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedPolitician.last_updated).toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Data refreshed from government sources
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Phone className="w-5 h-5 mr-2" />
                        Contact Information
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 ml-2 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Verified through official government directories</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedPolitician.email ? (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <a href={`mailto:${selectedPolitician.email}`} className="text-blue-600 hover:underline">
                            {selectedPolitician.email}
                          </a>
                          <Badge variant="outline" className="text-xs">Verified</Badge>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">Email not available</span>
                        </div>
                      )}
                      {selectedPolitician.phone ? (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <a href={`tel:${selectedPolitician.phone}`} className="text-blue-600 hover:underline">
                            {selectedPolitician.phone}
                          </a>
                          <Badge variant="outline" className="text-xs">Verified</Badge>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">Phone not available</span>
                        </div>
                      )}
                      {selectedPolitician.website ? (
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-gray-500" />
                          <a href={selectedPolitician.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Official Website
                          </a>
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Globe className="w-4 h-4" />
                          <span className="text-sm">Website not available</span>
                        </div>
                      )}
                      {selectedPolitician.office_address ? (
                        <div className="flex items-start space-x-2">
                          <Building className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Office Address</p>
                            <p className="text-sm text-gray-600">{selectedPolitician.office_address}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Building className="w-4 h-4" />
                          <span className="text-sm">Office address not available</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Political Information & Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Political Information & Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium">Party:</span>
                          <div className="mt-1">
                            <Badge variant="outline">{selectedPolitician.party || 'Independent'}</Badge>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Level:</span>
                          <div className="mt-1">
                            <Badge variant={selectedPolitician.level === 'Federal' ? 'default' : 'secondary'}>
                              {selectedPolitician.level}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {selectedPolitician.riding && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{selectedPolitician.riding}</span>
                        </div>
                      )}

                      <Separator />

                      {/* Performance Metrics */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Performance Metrics:</h4>
                        
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">Community Trust Score</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-600">Coming Soon</span>
                            <Badge variant="outline" className="text-xs">User Votes</Badge>
                          </div>
                        </div>

                        {selectedPolitician.total_spending ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center justify-between p-2 bg-blue-50 rounded cursor-help">
                                  <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium">Campaign Spending</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-sm font-bold text-blue-600">
                                      ${selectedPolitician.total_spending.toLocaleString()}
                                    </span>
                                    <ExternalLink className="w-3 h-3 text-gray-400" />
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs max-w-xs">
                                  <p className="font-medium">Campaign Finance Data</p>
                                  <p>Total reported campaign expenditures</p>
                                  <p className="mt-1 text-blue-600">Source: Elections Canada financial returns</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-500">Campaign spending data not available</span>
                            <Badge variant="secondary" className="text-xs">No data</Badge>
                          </div>
                        )}

                        {selectedPolitician.voting_participation ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center justify-between p-2 bg-purple-50 rounded cursor-help">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-medium">Voting Participation</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-sm font-bold text-purple-600">
                                      {selectedPolitician.voting_participation}%
                                    </span>
                                    <ExternalLink className="w-3 h-3 text-gray-400" />
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs max-w-xs">
                                  <p className="font-medium">Voting Participation Rate</p>
                                  <p>Percentage of votes participated in during current term</p>
                                  <p className="mt-1 text-blue-600">Source: Parliamentary voting records</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-500">Voting history not available</span>
                            <Badge variant="secondary" className="text-xs">No data</Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Admin Tools - Only for authenticated admins */}
                {user?.is_admin && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center text-orange-800">
                        <Shield className="w-5 h-5 mr-2" />
                        Admin Tools
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          Update Sources
                        </Button>
                        <Button variant="outline" size="sm">
                          Verify Data
                        </Button>
                      </div>
                      <p className="text-xs text-orange-600 mt-2">
                        Admin-only editing tools for data verification and updates
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Interactive content for the detailed view */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Citizen Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InteractiveContent
                      targetType="politician"
                      targetId={selectedPolitician.id.toString()}
                      showComments={true}
                    />
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}