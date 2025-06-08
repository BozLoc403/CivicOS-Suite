import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, MapPin, Phone, Mail, ExternalLink, Star } from "lucide-react";
import { Link } from "wouter";

interface Politician {
  id: number;
  name: string;
  position: string;
  party: string;
  level: string;
  constituency?: string;
  trustScore: string;
  contact: {
    phone?: string;
    email?: string;
    office?: string;
  };
  recentActivity?: string;
  profileImage?: string;
}

export default function PoliticiansWidget() {
  const { data: politicians = [], isLoading } = useQuery<Politician[]>({
    queryKey: ['/api/politicians'],
    refetchInterval: 120000, // Refresh every 2 minutes for new politicians
    select: (data) => data.slice(0, 8), // Show latest 8 politicians
  });

  const { data: featuredPolitician } = useQuery({
    queryKey: ['/api/politicians/featured'],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const getPartyColor = (party: string) => {
    switch (party.toLowerCase()) {
      case 'liberal': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'conservative': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ndp': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'bloc québécois': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      case 'green': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'federal': return '🍁';
      case 'provincial': return '🏛️';
      case 'municipal': return '🏢';
      default: return '👤';
    }
  };

  if (isLoading) {
    return (
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Politicians</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Politicians</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {politicians.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto">
        <div className="space-y-3">
          {/* Featured Politician */}
          {featuredPolitician && (
            <div className="border-2 border-purple-200 rounded-lg p-3 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
              <div className="flex items-start space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={featuredPolitician.profileImage} />
                  <AvatarFallback>{featuredPolitician.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Featured</span>
                  </div>
                  <h4 className="font-medium text-sm">{featuredPolitician.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{featuredPolitician.position}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={`text-xs ${getPartyColor(featuredPolitician.party)}`}>
                      {featuredPolitician.party}
                    </Badge>
                    <span className="text-xs">{getLevelIcon(featuredPolitician.level)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Politicians List */}
          {politicians.map((politician) => (
            <div key={politician.id} className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={politician.profileImage} />
                  <AvatarFallback>{politician.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm truncate">{politician.name}</h4>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">{getLevelIcon(politician.level)}</span>
                      <Star className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs font-medium">{politician.trustScore}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 truncate">
                    {politician.position}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${getPartyColor(politician.party)}`}>
                      {politician.party}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {politician.contact.phone && (
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                          <Phone className="h-3 w-3" />
                        </Button>
                      )}
                      {politician.contact.email && (
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                          <Mail className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {politician.constituency && (
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500 truncate">{politician.constituency}</span>
                    </div>
                  )}
                  {politician.recentActivity && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 truncate">
                      {politician.recentActivity}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t">
          <Link href="/politicians">
            <Button variant="outline" size="sm" className="w-full">
              <Users className="h-4 w-4 mr-2" />
              View All Politicians
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}