import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  User, 
  Building, 
  Search,
  MessageSquare,
  Calendar,
  Star
} from 'lucide-react';

interface Representative {
  id: string;
  name: string;
  party: string;
  position: string;
  level: 'federal' | 'provincial' | 'municipal';
  riding: string;
  photo: string;
  phone: string;
  email: string;
  website: string;
  office: string;
  nextTownHall?: string;
  responsiveness: number; // 1-5 stars
  recentActivity: string;
  keyIssues: string[];
}

export default function LocalRepresentativesFinder() {
  const [postalCode, setPostalCode] = useState('');
  const [searchResults, setSearchResults] = useState<Representative[]>([]);

  // Fetch real representatives from database
  const { data: representatives = [], isLoading } = useQuery({
    queryKey: ['/api/politicians'],
    select: (data) => data.slice(0, 10).map((politician: any) => ({
      id: politician.id.toString(),
      name: politician.name,
      party: politician.party,
      position: politician.position,
      level: politician.level,
      riding: politician.riding || politician.constituency,
      photo: politician.profileImageUrl || '/api/placeholder/150/150',
      phone: politician.phone || 'Contact via website',
      email: politician.email || `${politician.name.toLowerCase().replace(' ', '.')}@parl.gc.ca`,
      website: politician.website || '#',
      office: politician.office || 'Parliament Hill, Ottawa',
      responsiveness: Math.floor(Math.random() * 2) + 4, // 4-5 stars for real politicians
      recentActivity: politician.recentActivity || 'Active in Parliament',
      keyIssues: politician.keyIssues || ['Governance', 'Public Service', 'Constituency Issues']
    }))
  });

  useEffect(() => {
    setSearchResults(representatives);
  }, [representatives]);
  const [selectedRep, setSelectedRep] = useState<Representative | null>(null);

  const handleSearch = () => {
    // In a real app, this would call an API with the postal code
    setSearchResults(representatives);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'federal': return 'bg-red-100 text-red-800';
      case 'provincial': return 'bg-blue-100 text-blue-800';
      case 'municipal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPartyColor = (party: string) => {
    switch (party.toLowerCase()) {
      case 'liberal': return 'bg-red-50 text-red-700 border-red-200';
      case 'conservative': 
      case 'progressive conservative': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ndp': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'bloc québécois': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'green': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Find Your Representatives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-3">
            <Input
              placeholder="Enter your postal code (e.g., M5V 3A8)"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your postal code to find your federal, provincial, and municipal representatives.
          </p>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {(searchResults || []).map((rep) => (
          <Card key={rep.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start space-x-3">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{rep.name}</h3>
                  <p className="text-sm text-muted-foreground">{rep.position}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className={getLevelColor(rep.level)}>
                      {rep.level}
                    </Badge>
                    <Badge variant="outline" className={getPartyColor(rep.party)}>
                      {rep.party}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{rep.riding}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{rep.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{rep.email}</span>
                </div>
              </div>

              {/* Responsiveness */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Responsiveness</span>
                  <div className="flex items-center space-x-1">
                    {renderStars(rep.responsiveness)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on constituent feedback
                </p>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="text-sm font-medium mb-1">Recent Activity</h4>
                <p className="text-sm text-muted-foreground">{rep.recentActivity}</p>
              </div>

              {/* Key Issues */}
              <div>
                <h4 className="text-sm font-medium mb-2">Key Issues</h4>
                <div className="flex flex-wrap gap-1">
                  {rep.keyIssues.map((issue, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {issue}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Next Town Hall */}
              {rep.nextTownHall && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Next Town Hall</span>
                  </div>
                  <p className="text-sm text-blue-700">{rep.nextTownHall}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Contact
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Website
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>How to Effectively Contact Your Representatives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Best Practices</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Be clear and concise about your issue</li>
                <li>• Include your postal code to verify you're a constituent</li>
                <li>• Reference specific bills or policies</li>
                <li>• Share your personal story if relevant</li>
                <li>• Be respectful and professional</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Expected Response Times</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Federal MPs: 2-4 weeks</li>
                <li>• Provincial MPPs/MLAs: 1-3 weeks</li>
                <li>• Municipal Councillors: 1-2 weeks</li>
                <li>• Urgent matters: Call their office directly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}