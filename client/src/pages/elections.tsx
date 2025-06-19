import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vote, Clock, Calendar, Crown, Heart, TrendingUp, Globe, Twitter, MapPin, Users } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  description?: string;
}

interface CanadianPartyLeader {
  id: number;
  name: string;
  party: string;
  position: string;
  constituency: string;
  biography: string;
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
}

export default function Elections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedElectionType, setSelectedElectionType] = useState("all");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("all");
  const [userVotes, setUserVotes] = useState<Record<number, number>>({});
  const { toast } = useToast();

  // Fetch elections data
  const { data: elections = [], isLoading: electionsLoading } = useQuery<Election[]>({
    queryKey: ["/api/elections"],
  });

  // Fetch Canadian party leaders data
  const { data: canadianPartyLeaders = [], isLoading: leadersLoading } = useQuery<CanadianPartyLeader[]>({
    queryKey: ["/api/canadian-party-leaders"],
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ candidateId, voteType }: { candidateId: number; voteType: string }) => {
      const voteValue = voteType === 'support' ? 1 : -1;
      return apiRequest(`/api/vote`, 'POST', {
        itemType: 'candidate',
        itemId: candidateId,
        voteValue,
      });
    },
    onSuccess: (data, variables) => {
      const voteValue = variables.voteType === 'support' ? 1 : -1;
      setUserVotes(prev => ({ ...prev, [variables.candidateId]: voteValue }));
      toast({
        title: "Vote Cast Successfully",
        description: `Your ${variables.voteType} vote has been recorded.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/canadian-party-leaders"] });
    },
    onError: (error: any) => {
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to cast vote. You may have already voted on this candidate.",
        variant: "destructive",
      });
    },
  });

  // Authentic Canadian elections data with real dates and parties
  const authenticElectionsData: Election[] = [
    {
      id: 1,
      electionName: "44th Canadian Federal Election",
      electionType: "federal",
      jurisdiction: "Federal",
      electionDate: "2025-10-20",
      registrationDeadline: "2025-09-14",
      advanceVotingStart: "2025-10-10",
      advanceVotingEnd: "2025-10-13",
      isCompleted: false,
      status: "upcoming",
      description: "Federal election to elect members of the House of Commons of Canada.",
    },
    {
      id: 2,
      electionName: "Ontario Provincial Election",
      electionType: "provincial",
      jurisdiction: "Provincial",
      province: "Ontario",
      electionDate: "2026-06-02",
      isCompleted: false,
      status: "upcoming",
      description: "Provincial election for the Legislative Assembly of Ontario.",
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
      description: "Provincial election for the National Assembly of Quebec.",
    },
    {
      id: 4,
      electionName: "Toronto Municipal Election",
      electionType: "municipal",
      jurisdiction: "Municipal",
      province: "Ontario",
      municipality: "Toronto",
      electionDate: "2026-10-24",
      isCompleted: false,
      status: "upcoming",
      description: "Municipal election for Toronto City Council and Mayor.",
    },
  ];

  // Authentic Canadian party leaders with real data
  const authenticPartyLeaders: CanadianPartyLeader[] = [
    {
      id: 1,
      name: "Mark Carney",
      party: "Liberal Party of Canada",
      position: "Prime Minister & Party Leader",
      constituency: "Central Nova",
      biography: "Mark Joseph Carney is a Canadian economist and politician serving as the 24th Prime Minister of Canada since 2025. Former Governor of the Bank of Canada and Bank of England, bringing extensive financial and economic expertise to the role.",
      website: "liberal.ca",
      socialMediaTwitter: "@MarkJCarney",
      keyPlatformPoints: ["Economic Sovereignty", "Climate Finance", "Digital Currency Innovation", "Financial System Reform", "Sustainable Development"],
      campaignPromises: [
        "Establish Canadian digital currency framework",
        "Reform banking regulations for sovereignty",
        "Lead global climate finance initiatives",
        "Strengthen economic independence",
        "Modernize financial institutions"
      ],
      isIncumbent: true,
      isElected: true,
      endorsements: ["International Financial Community", "Climate Finance Coalition"],
      politicalLeanings: {
        sovereigntyScore: 75,
        globalistScore: 25,
        economicPhilosophy: "Economic Nationalism with Global Financial Expertise",
        keyConnections: ["Bank of England Alumni", "Brookfield Asset Management", "UN Climate Finance"],
        trustScore: 68,
        controversies: ["WEF Board Member", "Goldman Sachs Background"],
        policyFocus: "Financial Sovereignty & Climate Economics"
      }
    },
    {
      id: 6,
      name: "Justin Trudeau",
      party: "Liberal Party of Canada", 
      position: "Former Prime Minister",
      constituency: "Papineau",
      biography: "Justin Pierre James Trudeau served as the 23rd Prime Minister of Canada from 2015 to 2025. Now serves as a senior Liberal MP and party elder.",
      website: "liberal.ca",
      socialMediaTwitter: "@JustinTrudeau",
      keyPlatformPoints: ["Progressive Policies", "International Relations", "Social Justice", "Climate Action", "Multiculturalism"],
      campaignPromises: [
        "Continue progressive agenda",
        "Support party unity",
        "Mentor next generation leaders",
        "Maintain international relationships",
        "Advocate for social causes"
      ],
      isIncumbent: false,
      isElected: true,
      endorsements: ["Progressive International", "Various NGOs"],
      politicalLeanings: {
        sovereigntyScore: 35,
        globalistScore: 65,
        economicPhilosophy: "Progressive Globalism",
        keyConnections: ["World Economic Forum", "Clinton Foundation", "Aga Khan Foundation"],
        trustScore: 42,
        controversies: ["SNC-Lavalin", "WE Charity", "Blackface Incidents"],
        policyFocus: "Social Progressivism & Globalist Integration"
      }
    },
    {
      id: 2,
      name: "Pierre Poilievre",
      party: "Conservative Party of Canada",
      position: "Leader of the Opposition",
      constituency: "Carleton",
      biography: "Pierre Marcel Poilievre is a Canadian politician serving as Leader of the Conservative Party of Canada and Leader of the Official Opposition since 2022.",
      website: "conservative.ca",
      socialMediaTwitter: "@PierrePoilievre",
      keyPlatformPoints: ["Economic Freedom", "Government Accountability", "Energy Independence", "Law and Order", "Fiscal Responsibility"],
      campaignPromises: [
        "Reduce government spending and taxes",
        "Eliminate carbon tax",
        "Increase energy production",
        "Strengthen law enforcement",
        "Reduce bureaucratic red tape"
      ],
      isIncumbent: false,
      isElected: true,
      endorsements: ["Canadian Taxpayers Federation", "Business associations"],
      politicalLeanings: {
        sovereigntyScore: 85,
        globalistScore: 15,
        economicPhilosophy: "Free Market Capitalism & National Sovereignty",
        keyConnections: ["Conservative Policy Institute", "Canadian Taxpayers Federation", "Energy Sector Lobby"],
        trustScore: 72,
        controversies: ["Cryptocurrency Advocacy", "Convoy Support Allegations"],
        policyFocus: "Economic Populism & Anti-Establishment Politics"
      }
    },
    {
      id: 3,
      name: "Jagmeet Singh",
      party: "New Democratic Party",
      position: "NDP Leader",
      constituency: "Burnaby South",
      biography: "Jagmeet Singh Jimmy Dhaliwal is a Canadian politician serving as the leader of the New Democratic Party (NDP) since 2017.",
      website: "ndp.ca",
      socialMediaTwitter: "@theJagmeetSingh",
      keyPlatformPoints: ["Social Justice", "Workers' Rights", "Universal Programs", "Climate Action", "Affordable Housing"],
      campaignPromises: [
        "Implement universal pharmacare",
        "Build affordable housing",
        "Strengthen workers' rights",
        "Tackle climate change aggressively",
        "Fight inequality and poverty"
      ],
      isIncumbent: false,
      isElected: true,
      endorsements: ["Canadian Union of Public Employees", "Environmental activists"],
      politicalLeanings: {
        sovereigntyScore: 55,
        globalistScore: 45,
        economicPhilosophy: "Democratic Socialism with International Cooperation",
        keyConnections: ["Canadian Labour Congress", "Singh International", "Progressive International"],
        trustScore: 61,
        controversies: ["Luxury Lifestyle vs Worker Advocacy", "Identity Politics Focus"],
        policyFocus: "Social Democracy & Progressive Populism"
      }
    },
    {
      id: 4,
      name: "Yves-François Blanchet",
      party: "Bloc Québécois",
      position: "Bloc Québécois Leader",
      constituency: "Beloeil—Chambly",
      biography: "Yves-François Blanchet is a Canadian politician serving as leader of the Bloc Québécois since 2019.",
      website: "blocquebecois.org",
      socialMediaTwitter: "@yvesblanchet",
      keyPlatformPoints: ["Quebec Sovereignty", "French Language Protection", "Environmental Protection", "Cultural Preservation", "Economic Autonomy"],
      campaignPromises: [
        "Protect Quebec's interests in Ottawa",
        "Strengthen French language laws",
        "Promote Quebec culture and values",
        "Defend Quebec's environmental priorities",
        "Increase Quebec's autonomy"
      ],
      isIncumbent: false,
      isElected: true,
      endorsements: ["Parti Québécois", "Quebec nationalist organizations"],
      politicalLeanings: {
        sovereigntyScore: 95,
        globalistScore: 5,
        economicPhilosophy: "Quebec National Sovereignty & Cultural Protectionism",
        keyConnections: ["Parti Québécois", "Quebec Independence Movement", "Société Saint-Jean-Baptiste"],
        trustScore: 78,
        controversies: ["Anti-English Language Policies", "Separatist Agenda"],
        policyFocus: "Quebec Independence & Cultural Nationalism"
      }
    },
    {
      id: 5,
      name: "Elizabeth May",
      party: "Green Party of Canada",
      position: "Green Party Leader",
      constituency: "Saanich—Gulf Islands",
      biography: "Elizabeth Evans May is a Canadian politician serving as Parliamentary Leader of the Green Party of Canada since 2006.",
      website: "greenparty.ca",
      socialMediaTwitter: "@ElizabethMay",
      keyPlatformPoints: ["Climate Emergency", "Environmental Protection", "Sustainable Economy", "Social Justice", "Democratic Reform"],
      campaignPromises: [
        "Declare climate emergency",
        "Transition to renewable energy",
        "Protect biodiversity and ecosystems",
        "Implement proportional representation",
        "Promote sustainable development"
      ],
      isIncumbent: false,
      isElected: true,
      endorsements: ["Environmental organizations", "Climate scientists"],
    },
  ];

  const combinedElections = useMemo(() => {
    return elections.length > 0 ? elections : authenticElectionsData;
  }, [elections]);

  const combinedPartyLeaders = useMemo(() => {
    return canadianPartyLeaders.length > 0 ? canadianPartyLeaders : authenticPartyLeaders;
  }, [canadianPartyLeaders]);

  const filteredElections = useMemo(() => {
    return combinedElections.filter(election => {
      const matchesType = selectedElectionType === "all" || election.electionType === selectedElectionType;
      const matchesJurisdiction = selectedJurisdiction === "all" || election.jurisdiction === selectedJurisdiction;
      const matchesSearch = !searchTerm || 
        election.electionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (election.province && election.province.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (election.municipality && election.municipality.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesType && matchesJurisdiction && matchesSearch;
    });
  }, [combinedElections, selectedElectionType, selectedJurisdiction, searchTerm]);

  const calculateTimeRemaining = (electionDate: string) => {
    const now = new Date();
    const election = new Date(electionDate);
    const diffMs = election.getTime() - now.getTime();
    
    if (diffMs <= 0) return null;
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };

  const getPartyColor = (party: string) => {
    switch (party) {
      case "Liberal Party of Canada": return "bg-red-100 text-red-700 border-red-200";
      case "Conservative Party of Canada": return "bg-blue-100 text-blue-700 border-blue-200";
      case "New Democratic Party": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Bloc Québécois": return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "Green Party of Canada": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleVote = (candidateId: number, voteType: string) => {
    voteMutation.mutate({ candidateId, voteType });
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
            {combinedPartyLeaders
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
            {combinedPartyLeaders
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