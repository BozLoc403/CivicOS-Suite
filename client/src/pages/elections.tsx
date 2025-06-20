import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, MapPin, ExternalLink, Info, Clock, Users, Vote } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Election {
  id: string;
  type: 'federal' | 'provincial' | 'municipal';
  region: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  description: string;
  source: string;
  sourceUrl?: string;
  registrationDeadline?: string;
  advanceVotingDates?: string[];
}

interface ElectionData {
  upcoming: Election[];
  recent: Election[];
  lastUpdated: string;
  sources: string[];
}

export default function Elections() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState('upcoming');

  // Fetch authentic election data
  const { data: electionData, isLoading, error } = useQuery<ElectionData>({
    queryKey: ['/api/elections/authentic'],
    enabled: isAuthenticated,
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = '/api/login';
    }
  }, [isAuthenticated, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading authentic election data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <Alert className="mt-20">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Unable to load election data. Please try again later or contact support.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeUntilElection = (dateString: string) => {
    const electionDate = new Date(dateString);
    const now = new Date();
    const diffTime = electionDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Election has passed';
    if (diffDays === 0) return 'Election today!';
    if (diffDays === 1) return '1 day remaining';
    return `${diffDays} days remaining`;
  };

  const ElectionCard = ({ election }: { election: Election }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge 
              variant={election.type === 'federal' ? 'default' : 
                      election.type === 'provincial' ? 'secondary' : 'outline'}
              className="capitalize"
            >
              {election.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {election.status}
            </Badge>
          </div>
          {election.sourceUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(election.sourceUrl, '_blank')}
              className="text-xs"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Source
            </Button>
          )}
        </div>
        <CardTitle className="text-lg">{election.description}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{election.region}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(election.date)}</span>
        </div>

        {election.status === 'upcoming' && (
          <div className="flex items-center space-x-2 text-sm text-blue-600 font-medium">
            <Clock className="w-4 h-4" />
            <span>{getTimeUntilElection(election.date)}</span>
          </div>
        )}

        {election.registrationDeadline && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Registration Deadline:</strong> {formatDate(election.registrationDeadline)}
            </p>
          </div>
        )}

        {election.advanceVotingDates && election.advanceVotingDates.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Advance Voting:</strong> {election.advanceVotingDates.map(date => formatDate(date)).join(', ')}
            </p>
          </div>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            Source: {election.source}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const NoElectionsMessage = ({ type }: { type: string }) => (
    <Card className="border-dashed border-2 border-gray-300">
      <CardContent className="text-center py-8">
        <Vote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Scheduled Elections
        </h3>
        <p className="text-gray-600">
          No {type} elections are currently scheduled at this time.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Data sourced from Elections Canada and provincial election authorities
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Canadian Elections
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Authentic election information from verified government sources
          </p>
          
          {electionData && (
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Last updated: {new Date(electionData.lastUpdated).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{electionData.sources.length} verified sources</span>
              </div>
            </div>
          )}
        </div>

        {/* Data Sources Alert */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            All election data is sourced directly from Elections Canada, provincial election authorities, 
            and official government websites. This page shows only confirmed, scheduled elections.
          </AlertDescription>
        </Alert>

        {/* Election Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Elections</TabsTrigger>
            <TabsTrigger value="recent">Recent Elections</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {electionData?.upcoming && electionData.upcoming.length > 0 ? (
              <div className="grid gap-4">
                {electionData.upcoming.map((election) => (
                  <ElectionCard key={election.id} election={election} />
                ))}
              </div>
            ) : (
              <NoElectionsMessage type="upcoming" />
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            {electionData?.recent && electionData.recent.length > 0 ? (
              <div className="grid gap-4">
                {electionData.recent.map((election) => (
                  <ElectionCard key={election.id} election={election} />
                ))}
              </div>
            ) : (
              <NoElectionsMessage type="recent" />
            )}
          </TabsContent>
        </Tabs>

        {/* Data Sources Footer */}
        {electionData?.sources && (
          <div className="mt-12 p-6 bg-white rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Verified Data Sources</h3>
            <ul className="space-y-2">
              {electionData.sources.map((source, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm">
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                  <span>{source}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}