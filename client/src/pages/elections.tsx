import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationHeader } from "@/components/NavigationHeader";
import { Search, Calendar, MapPin, Users, Vote, DollarSign, FileText, Globe, Phone, Mail, Twitter, Facebook, Instagram, TrendingUp } from "lucide-react";

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

export default function Elections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedElectionType, setSelectedElectionType] = useState("all");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);

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
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Vote className="w-8 h-8 mr-3 text-civic-blue" />
            Elections & Candidates
          </h1>
          <p className="mt-2 text-gray-600">
            Complete transparency of all Canadian elections, candidates, policies, and electoral data.
            Know exactly who you're voting for and what they stand for.
          </p>
        </div>

        <Tabs defaultValue="elections" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="elections">Elections</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="districts">Districts</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          {/* Elections Tab */}
          <TabsContent value="elections" className="space-y-6">
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