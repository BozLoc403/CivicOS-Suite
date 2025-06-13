import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

import { Search, Calendar, MapPin, Users, Vote, DollarSign, FileText, Globe, Phone, Mail, Twitter, Facebook, Instagram, TrendingUp, Clock, Crown, Building2, Heart } from "lucide-react";

interface Election {
  id: number;
  electionName: string;
  electionType: string;
  jurisdiction: string;
  province?: string;
  municipality?: string;
  electionDate: string;
  registrationDeadline?: string;
  advanceVotingStart?: string;
  advanceVotingEnd?: string;
  isCompleted: boolean;
  totalVoters?: number;
  voterTurnout?: number;
  status: string;
  officialResultsUrl?: string;
}

interface Candidate {
  id: number;
  electionId: number;
  name: string;
  party?: string;
  constituency: string;
  biography?: string;
  website?: string;
  email?: string;
  phoneNumber?: string;
  campaignWebsite?: string;
  socialMediaTwitter?: string;
  socialMediaFacebook?: string;
  socialMediaInstagram?: string;
  occupation?: string;
  education?: string;
  previousExperience?: string;
  keyPlatformPoints: string[];
  campaignPromises: string[];
  votesReceived?: number;
  votePercentage?: number;
  isIncumbent: boolean;
  isElected: boolean;
  endorsements: string[];
  financialDisclosure?: string;
  election: {
    electionName: string;
    electionType: string;
    electionDate: string;
  };
}

interface CandidatePolicy {
  id: number;
  candidateId: number;
  policyArea: string;
  policyTitle: string;
  policyDescription: string;
  implementationPlan?: string;
  estimatedCost?: string;
  timeline?: string;
  priority: string;
  sourceDocument?: string;
}

interface ElectoralDistrict {
  id: number;
  districtName: string;
  districtNumber?: string;
  province: string;
  population?: number;
  area?: number;
  demographics?: any;
  economicProfile?: string;
  keyIssues: string[];
  historicalVoting?: any;
  boundaries?: string;
  majorCities: string[];
  currentRepresentative?: string;
  lastElectionTurnout?: number;
  isUrban: boolean;
  isRural: boolean;
}

// Comprehensive Canadian Election Data
const canadianElections = [
  // Federal Elections
  {
    id: 1,
    electionName: "44th Canadian Federal Election",
    electionType: "federal",
    jurisdiction: "Federal",
    electionDate: "2025-10-20", // Next scheduled federal election
    registrationDeadline: "2025-09-20",
    advanceVotingStart: "2025-10-10",
    advanceVotingEnd: "2025-10-13",
    isCompleted: false,
    status: "upcoming",
    officialResultsUrl: "https://www.elections.ca",
    description: "Next Canadian federal election to elect members to the House of Commons"
  },
  // Provincial Elections - All 10 Provinces
  {
    id: 2,
    electionName: "Ontario Provincial Election",
    electionType: "provincial",
    jurisdiction: "Provincial",
    province: "Ontario",
    electionDate: "2026-06-04",
    isCompleted: false,
    status: "upcoming",
    description: "Ontario provincial election to elect MPPs to the Legislative Assembly"
  },
  {
    id: 3,
    electionName: "Quebec Provincial Election",
    electionType: "provincial", 
    jurisdiction: "Provincial",
    province: "Quebec",
    electionDate: "2026-10-03",
    isCompleted: false,
    status: "upcoming",
    description: "Quebec provincial election to elect MNAs to the National Assembly"
  },
  {
    id: 4,
    electionName: "British Columbia Provincial Election",
    electionType: "provincial",
    jurisdiction: "Provincial", 
    province: "British Columbia",
    electionDate: "2028-10-19",
    isCompleted: false,
    status: "upcoming",
    description: "BC provincial election to elect MLAs to the Legislative Assembly"
  },
  {
    id: 5,
    electionName: "Alberta Provincial Election",
    electionType: "provincial",
    jurisdiction: "Provincial",
    province: "Alberta", 
    electionDate: "2027-05-29",
    isCompleted: false,
    status: "upcoming",
    description: "Alberta provincial election to elect MLAs to the Legislative Assembly"
  },
  {
    id: 6,
    electionName: "Nova Scotia Provincial Election",
    electionType: "provincial",
    jurisdiction: "Provincial",
    province: "Nova Scotia",
    electionDate: "2025-07-15",
    isCompleted: false,
    status: "upcoming",
    description: "Nova Scotia provincial election to elect MLAs to the House of Assembly"
  },
  // Municipal Elections - Major Cities
  {
    id: 7,
    electionName: "Toronto Municipal Election",
    electionType: "municipal",
    jurisdiction: "Municipal",
    province: "Ontario",
    municipality: "Toronto",
    electionDate: "2026-10-26",
    isCompleted: false,
    status: "upcoming",
    description: "Toronto municipal election for mayor and city councillors"
  },
  {
    id: 8,
    electionName: "Vancouver Municipal Election", 
    electionType: "municipal",
    jurisdiction: "Municipal",
    province: "British Columbia",
    municipality: "Vancouver",
    electionDate: "2026-10-15",
    isCompleted: false,
    status: "upcoming",
    description: "Vancouver municipal election for mayor and city councillors"
  }
];

// Comprehensive Party Leaders and Candidates
const canadianPartyLeaders = [
  // Federal Party Leaders
  {
    id: 101,
    electionId: 1,
    name: "Justin Trudeau",
    party: "Liberal Party of Canada",
    constituency: "Papineau",
    position: "Prime Minister",
    biography: "Leader of the Liberal Party since 2013, Prime Minister since 2015",
    keyPlatformPoints: ["Climate Action", "Healthcare", "Economic Recovery", "Reconciliation"],
    campaignPromises: ["Net-zero emissions by 2050", "National childcare program", "Pharmacare"],
    isIncumbent: true,
    isElected: false,
    endorsements: ["Canadian Labour Congress"],
    socialMediaTwitter: "@JustinTrudeau",
    website: "liberal.ca"
  },
  {
    id: 102,
    electionId: 1,
    name: "Pierre Poilievre",
    party: "Conservative Party of Canada", 
    constituency: "Carleton",
    position: "Leader of the Opposition",
    biography: "Conservative Party leader since 2022, MP since 2004",
    keyPlatformPoints: ["Affordability", "Freedom", "Small Government", "Economic Growth"],
    campaignPromises: ["Axe the tax", "Build the homes", "Fix the budget"],
    isIncumbent: false,
    isElected: false,
    endorsements: ["Canadian Taxpayers Federation"],
    socialMediaTwitter: "@PierrePoilievre",
    website: "conservative.ca"
  },
  {
    id: 103,
    electionId: 1,
    name: "Jagmeet Singh",
    party: "New Democratic Party",
    constituency: "Burnaby South", 
    position: "NDP Leader",
    biography: "NDP leader since 2017, former Ontario MPP",
    keyPlatformPoints: ["Healthcare", "Housing", "Workers' Rights", "Climate Justice"],
    campaignPromises: ["Dental care for all", "Wealth tax", "Housing for people"],
    isIncumbent: false,
    isElected: false,
    endorsements: ["Canadian Union of Public Employees"],
    socialMediaTwitter: "@theJagmeetSingh",
    website: "ndp.ca"
  },
  {
    id: 104,
    electionId: 1,
    name: "Yves-François Blanchet",
    party: "Bloc Québécois",
    constituency: "Beloeil—Chambly",
    position: "Bloc Leader",
    biography: "Bloc Québécois leader since 2019, Quebec sovereignty advocate",
    keyPlatformPoints: ["Quebec Sovereignty", "French Language", "Quebec Interests"],
    campaignPromises: ["Protect Quebec jurisdiction", "Promote French", "Quebec autonomy"],
    isIncumbent: false,
    isElected: false,
    endorsements: ["Parti Québécois"],
    socialMediaTwitter: "@yfblanchet",
    website: "blocquebecois.org"
  },
  {
    id: 105,
    electionId: 1,
    name: "Elizabeth May",
    party: "Green Party of Canada",
    constituency: "Saanich—Gulf Islands",
    position: "Green Party Leader", 
    biography: "Green Party leader, environmental lawyer and activist",
    keyPlatformPoints: ["Climate Emergency", "Environmental Protection", "Social Justice"],
    campaignPromises: ["Green New Deal", "Carbon pricing", "Biodiversity protection"],
    isIncumbent: false,
    isElected: false,
    endorsements: ["Environmental groups"],
    socialMediaTwitter: "@ElizabethMay",
    website: "greenparty.ca"
  },
  // Ontario Provincial Leaders
  {
    id: 201,
    electionId: 2,
    name: "Doug Ford",
    party: "Progressive Conservative Party of Ontario",
    constituency: "Etobicoke North",
    position: "Premier of Ontario",
    biography: "Premier since 2018, business background",
    keyPlatformPoints: ["Economic Growth", "Healthcare", "Infrastructure"],
    campaignPromises: ["Build Ontario", "Protect healthcare", "Lower costs"],
    isIncumbent: true,
    isElected: false,
    endorsements: ["Ontario Chamber of Commerce"],
    website: "ontariopc.ca"
  },
  {
    id: 202,
    electionId: 2,
    name: "Bonnie Crombie",
    party: "Ontario Liberal Party",
    constituency: "Mississauga—Lakeshore",
    position: "Liberal Leader",
    biography: "Former mayor of Mississauga, Liberal leader since 2023",
    keyPlatformPoints: ["Healthcare", "Education", "Climate Action"],
    campaignPromises: ["Fix healthcare", "Build schools", "Clean environment"],
    isIncumbent: false,
    isElected: false,
    endorsements: ["Ontario Teachers' Federation"],
    website: "ontarioliberal.ca"
  },
  // Quebec Provincial Leaders
  {
    id: 301,
    electionId: 3,
    name: "François Legault",
    party: "Coalition Avenir Québec",
    constituency: "L'Assomption",
    position: "Premier of Quebec",
    biography: "Premier since 2018, CAQ founder",
    keyPlatformPoints: ["Quebec Nationalism", "Economy", "Immigration"],
    campaignPromises: ["Quebec autonomy", "Economic development", "French protection"],
    isIncumbent: true,
    isElected: false,
    endorsements: ["Business Quebec"],
    website: "coalitionavenirquebec.org"
  },
  // Municipal Leaders - Toronto
  {
    id: 401,
    electionId: 7,
    name: "Olivia Chow",
    party: "Independent",
    constituency: "Mayor of Toronto",
    position: "Mayor", 
    biography: "Mayor since 2023, former NDP MP and city councillor",
    keyPlatformPoints: ["Housing", "Transit", "Community Safety"],
    campaignPromises: ["Build affordable housing", "Improve TTC", "Community programs"],
    isIncumbent: true,
    isElected: false,
    endorsements: ["Toronto Labour Council"],
    website: "toronto.ca"
  }
];

export default function Elections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedElectionType, setSelectedElectionType] = useState("all");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [userVotes, setUserVotes] = useState<{[key: number]: number}>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Countdown timer functionality
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateTimeRemaining = (electionDate: string) => {
    const election = new Date(electionDate);
    const now = currentTime;
    const diff = election.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };

  // Voting functionality
  const voteMutation = useMutation({
    mutationFn: async ({ candidateId, voteType }: { candidateId: number; voteType: 'support' | 'oppose' }) => {
      const response = await fetch('/api/vote/candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, voteType })
      });
      if (!response.ok) throw new Error('Failed to vote');
      return response.json();
    },
    onSuccess: (data, variables) => {
      setUserVotes(prev => ({ ...prev, [variables.candidateId]: variables.voteType === 'support' ? 1 : -1 }));
      toast({
        title: "Vote Cast Successfully",
        description: `Your vote has been recorded for this candidate.`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/vote/candidate'] });
    },
    onError: () => {
      toast({
        title: "Vote Failed", 
        description: "Unable to cast vote. You may have already voted.",
        variant: "destructive"
      });
    }
  });

  const handleVote = (candidateId: number, voteType: 'support' | 'oppose') => {
    voteMutation.mutate({ candidateId, voteType });
  };

  // Filter elections and candidates
  const filteredElections = canadianElections.filter(election => {
    if (selectedElectionType !== "all" && election.electionType !== selectedElectionType) return false;
    if (selectedJurisdiction !== "all" && election.jurisdiction !== selectedJurisdiction) return false;
    if (searchTerm && !election.electionName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getPartyColor = (party: string) => {
    const colors: { [key: string]: string } = {
      "Liberal Party of Canada": "bg-red-100 text-red-700 border-red-200",
      "Conservative Party of Canada": "bg-blue-100 text-blue-700 border-blue-200",
      "New Democratic Party": "bg-orange-100 text-orange-700 border-orange-200",
      "Bloc Québécois": "bg-cyan-100 text-cyan-700 border-cyan-200",
      "Green Party of Canada": "bg-green-100 text-green-700 border-green-200",
      "Progressive Conservative Party of Ontario": "bg-blue-100 text-blue-700 border-blue-200",
      "Ontario Liberal Party": "bg-red-100 text-red-700 border-red-200",
      "Coalition Avenir Québec": "bg-purple-100 text-purple-700 border-purple-200",
      "Independent": "bg-gray-100 text-gray-700 border-gray-200"
    };
    return colors[party] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const { data: elections = [] } = useQuery<Election[]>({
    queryKey: ["/api/elections", selectedElectionType, selectedJurisdiction],
  });

  const { data: candidates = [] } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates", searchTerm, selectedElectionType],
  });

  const { data: districts = [] } = useQuery<ElectoralDistrict[]>({
    queryKey: ["/api/electoral-districts"],
  });

  const { data: candidatePolicies = [] } = useQuery<CandidatePolicy[]>({
    queryKey: ["/api/candidate-policies", selectedCandidate],
    enabled: !!selectedCandidate,
  });

  const getElectionTypeColor = (type: string) => {
    switch (type) {
      case "federal": return "bg-blue-100 text-blue-800";
      case "provincial": return "bg-purple-100 text-purple-800";
      case "municipal": return "bg-orange-100 text-orange-800";
      case "by-election": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDaysUntil = (dateString: string) => {
    const electionDate = new Date(dateString);
    const today = new Date();
    const diffTime = electionDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const groupPoliciesByArea = (policies: CandidatePolicy[]) => {
    return policies.reduce((acc, policy) => {
      if (!acc[policy.policyArea]) {
        acc[policy.policyArea] = [];
      }
      acc[policy.policyArea].push(policy);
      return acc;
    }, {} as Record<string, CandidatePolicy[]>);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Canadian Elections</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive electoral information with authentic party leaders, election dates, and democratic voting across all levels of government.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Vote className="w-3 h-3 mr-1" />
            Democratic Voting
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Clock className="w-3 h-3 mr-1" />
            Live Countdowns
          </Badge>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search elections, candidates, or parties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={selectedElectionType} onValueChange={setSelectedElectionType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Election Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Elections</SelectItem>
            <SelectItem value="federal">Federal</SelectItem>
            <SelectItem value="provincial">Provincial</SelectItem>
            <SelectItem value="municipal">Municipal</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Jurisdiction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jurisdictions</SelectItem>
            <SelectItem value="Federal">Federal</SelectItem>
            <SelectItem value="Provincial">Provincial</SelectItem>
            <SelectItem value="Municipal">Municipal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="elections" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="elections">Upcoming Elections</TabsTrigger>
          <TabsTrigger value="candidates">Party Leaders</TabsTrigger>
          <TabsTrigger value="voting">Cast Your Vote</TabsTrigger>
        </TabsList>

        {/* Elections Tab - Show upcoming elections with countdown timers */}
        <TabsContent value="elections" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredElections.map((election) => {
              const timeRemaining = calculateTimeRemaining(election.electionDate);
              const isUpcoming = timeRemaining !== null;
              
              return (
                <Card key={election.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold">{election.electionName}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {election.province && `${election.province} • `}
                          {election.municipality && `${election.municipality} • `}
                          {new Date(election.electionDate).toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge variant="outline" className={
                          election.electionType === 'federal' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          election.electionType === 'provincial' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                          'bg-orange-100 text-orange-700 border-orange-200'
                        }>
                          <Crown className="w-3 h-3 mr-1" />
                          {election.electionType}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {isUpcoming && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Clock className="w-5 h-5 text-green-600 mr-2" />
                            <span className="font-medium text-green-900">Time Remaining:</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-900">
                              {timeRemaining.days} days, {timeRemaining.hours} hours, {timeRemaining.minutes} minutes
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{election.description}</p>
                      {election.registrationDeadline && (
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                          <span>Registration Deadline: {new Date(election.registrationDeadline).toLocaleDateString('en-CA')}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Candidates Tab - Show party leaders with voting */}
        <TabsContent value="candidates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {canadianPartyLeaders
              .filter(candidate => 
                !searchTerm || 
                candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidate.party.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((candidate) => (
                <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold">{candidate.name}</CardTitle>
                        <p className="text-sm font-medium text-muted-foreground">{candidate.position}</p>
                        <Badge className={`mt-2 ${getPartyColor(candidate.party)}`}>
                          {candidate.party}
                        </Badge>
                      </div>
                      {candidate.isIncumbent && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <Crown className="w-3 h-3 mr-1" />
                          Incumbent
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Biography</h4>
                      <p className="text-sm text-muted-foreground">{candidate.biography}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Key Platform Points</h4>
                      <div className="flex flex-wrap gap-1">
                        {candidate.keyPlatformPoints.map((point, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Campaign Promises</h4>
                      <ul className="text-sm space-y-1">
                        {candidate.campaignPromises.map((promise, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {promise}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2 border-t">
                      {candidate.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`https://${candidate.website}`} target="_blank" rel="noopener noreferrer">
                            <Globe className="w-4 h-4 mr-1" />
                            Website
                          </a>
                        </Button>
                      )}
                      {candidate.socialMediaTwitter && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`https://twitter.com/${candidate.socialMediaTwitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                            <Twitter className="w-4 h-4 mr-1" />
                            Twitter
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Voting Tab - Democratic participation */}
        <TabsContent value="voting" className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Vote className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-blue-900">Cast Your Democratic Vote</h2>
            </div>
            <p className="text-blue-800">
              Participate in democratic engagement by voting for the candidates and party leaders you support. 
              Your vote helps gauge public opinion and democratic participation across Canada.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {canadianPartyLeaders
              .filter(candidate => 
                !searchTerm || 
                candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidate.party.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((candidate) => (
                <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold">{candidate.name}</CardTitle>
                        <Badge className={`mt-1 ${getPartyColor(candidate.party)}`}>
                          {candidate.party}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant={userVotes[candidate.id] === 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleVote(candidate.id, 'support')}
                          disabled={voteMutation.isPending}
                          className="flex items-center"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          Support
                        </Button>
                        <Button
                          variant={userVotes[candidate.id] === -1 ? "destructive" : "outline"}
                          size="sm" 
                          onClick={() => handleVote(candidate.id, 'oppose')}
                          disabled={voteMutation.isPending}
                          className="flex items-center"
                        >
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Oppose
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{candidate.position}</p>
                      <p className="text-sm text-muted-foreground">{candidate.constituency}</p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {candidate.keyPlatformPoints.slice(0, 3).map((point, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={selectedElectionType}
                onChange={(e) => setSelectedElectionType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">All Election Types</option>
                <option value="federal">Federal</option>
                <option value="provincial">Provincial</option>
                <option value="municipal">Municipal</option>
                <option value="by-election">By-Elections</option>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {elections.map((election) => {
                const daysUntil = calculateDaysUntil(election.electionDate);
                return (
                  <Card key={election.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{election.electionName}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {election.province && `${election.province} • `}
                            {election.municipality && `${election.municipality} • `}
                            {formatDate(election.electionDate)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={getElectionTypeColor(election.electionType)}>
                            {election.electionType}
                          </Badge>
                          <Badge className={getStatusColor(election.status)}>
                            {election.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {!election.isCompleted && daysUntil > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="font-medium text-blue-900">
                              {daysUntil} days until election
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {election.registrationDeadline && (
                          <div>
                            <span className="font-medium">Registration Deadline:</span>
                            <div className="text-gray-600">{formatDate(election.registrationDeadline)}</div>
                          </div>
                        )}
                        
                        {election.advanceVotingStart && (
                          <div>
                            <span className="font-medium">Advance Voting:</span>
                            <div className="text-gray-600">
                              {formatDate(election.advanceVotingStart)} - {election.advanceVotingEnd && formatDate(election.advanceVotingEnd)}
                            </div>
                          </div>
                        )}
                        
                        {election.totalVoters && (
                          <div>
                            <span className="font-medium">Total Voters:</span>
                            <div className="text-gray-600">{election.totalVoters.toLocaleString()}</div>
                          </div>
                        )}
                        
                        {election.voterTurnout && (
                          <div>
                            <span className="font-medium">Voter Turnout:</span>
                            <div className="text-gray-600">{election.voterTurnout}%</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-civic-blue hover:bg-civic-blue/90">
                          <Users className="w-4 h-4 mr-1" />
                          View Candidates
                        </Button>
                        
                        {election.officialResultsUrl && (
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-1" />
                            Official Results
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search candidates by name, party, or constituency..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {candidates.map((candidate) => (
                <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {candidate.name}
                          {candidate.isIncumbent && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800">Incumbent</Badge>
                          )}
                          {candidate.isElected && (
                            <Badge className="ml-2 bg-green-100 text-green-800">Elected</Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {candidate.party && `${candidate.party} • `}
                          {candidate.constituency}
                        </p>
                        <p className="text-xs text-gray-500">
                          {candidate.election.electionName} - {formatDate(candidate.election.electionDate)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {candidate.occupation && (
                      <div className="text-sm">
                        <span className="font-medium">Occupation:</span> {candidate.occupation}
                      </div>
                    )}
                    
                    {candidate.biography && (
                      <p className="text-gray-700 text-sm line-clamp-3">{candidate.biography}</p>
                    )}
                    
                    {candidate.keyPlatformPoints.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Platform Points:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {candidate.keyPlatformPoints.slice(0, 3).map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {(candidate.votesReceived || candidate.votePercentage) && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Election Results:</span>
                          <div className="text-right">
                            {candidate.votesReceived && (
                              <div className="font-medium">{candidate.votesReceived.toLocaleString()} votes</div>
                            )}
                            {candidate.votePercentage && (
                              <div className="text-sm text-gray-600">{candidate.votePercentage}%</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Contact Information */}
                    <div className="flex flex-wrap gap-2">
                      {candidate.website && (
                        <Button size="sm" variant="outline">
                          <Globe className="w-3 h-3 mr-1" />
                          Website
                        </Button>
                      )}
                      {candidate.email && (
                        <Button size="sm" variant="outline">
                          <Mail className="w-3 h-3 mr-1" />
                          Email
                        </Button>
                      )}
                      {candidate.socialMediaTwitter && (
                        <Button size="sm" variant="outline">
                          <Twitter className="w-3 h-3 mr-1" />
                          Twitter
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-civic-blue hover:bg-civic-blue/90"
                        onClick={() => setSelectedCandidate(candidate.id)}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        View Policies
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Electoral Districts Tab */}
          <TabsContent value="districts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {districts.map((district) => (
                <Card key={district.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{district.districtName}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {district.province}
                      {district.districtNumber && ` • District ${district.districtNumber}`}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {district.population && (
                        <div>
                          <span className="font-medium">Population:</span>
                          <div className="text-gray-600">{district.population.toLocaleString()}</div>
                        </div>
                      )}
                      
                      {district.area && (
                        <div>
                          <span className="font-medium">Area:</span>
                          <div className="text-gray-600">{district.area} km²</div>
                        </div>
                      )}
                      
                      {district.lastElectionTurnout && (
                        <div>
                          <span className="font-medium">Last Turnout:</span>
                          <div className="text-gray-600">{district.lastElectionTurnout}%</div>
                        </div>
                      )}
                      
                      {district.currentRepresentative && (
                        <div>
                          <span className="font-medium">Current Rep:</span>
                          <div className="text-gray-600">{district.currentRepresentative}</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {district.isUrban && (
                        <Badge className="bg-blue-100 text-blue-800">Urban</Badge>
                      )}
                      {district.isRural && (
                        <Badge className="bg-green-100 text-green-800">Rural</Badge>
                      )}
                    </div>
                    
                    {district.keyIssues.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Issues:</h4>
                        <div className="flex flex-wrap gap-1">
                          {district.keyIssues.slice(0, 4).map((issue, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {district.majorCities.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Major Cities:</h4>
                        <p className="text-sm text-gray-700">
                          {district.majorCities.slice(0, 3).join(", ")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-6">
            {selectedCandidate ? (
              <div className="space-y-6">
                {Object.entries(groupPoliciesByArea(candidatePolicies)).map(([area, policies]) => (
                  <Card key={area}>
                    <CardHeader>
                      <CardTitle className="text-lg capitalize">{area} Policies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {policies.map((policy) => (
                          <div key={policy.id} className="border-l-4 border-civic-blue pl-4 py-2">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{policy.policyTitle}</h4>
                              <Badge className={getPriorityColor(policy.priority)}>
                                {policy.priority} priority
                              </Badge>
                            </div>
                            
                            <p className="text-gray-700 mb-3">{policy.policyDescription}</p>
                            
                            {policy.implementationPlan && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                <h5 className="font-medium text-blue-900 mb-1">Implementation Plan:</h5>
                                <p className="text-blue-800 text-sm">{policy.implementationPlan}</p>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex space-x-4">
                                {policy.estimatedCost && (
                                  <span className="text-gray-600">
                                    <DollarSign className="w-4 h-4 inline mr-1" />
                                    {policy.estimatedCost}
                                  </span>
                                )}
                                {policy.timeline && (
                                  <span className="text-gray-600">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    {policy.timeline}
                                  </span>
                                )}
                              </div>
                              {policy.sourceDocument && (
                                <Button size="sm" variant="outline">
                                  <FileText className="w-3 h-3 mr-1" />
                                  Source
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Candidate</h3>
                  <p className="text-gray-600">Choose a candidate from the Candidates tab to view their detailed policies.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}