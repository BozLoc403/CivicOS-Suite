import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, ExternalLink, Bell, Star } from 'lucide-react';

interface PoliticalEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'town_hall' | 'debate' | 'committee' | 'election' | 'protest' | 'meeting';
  level: 'federal' | 'provincial' | 'municipal';
  description: string;
  organizer: string;
  attendees?: number;
  maxAttendees?: number;
  isVirtual: boolean;
  registrationRequired: boolean;
  cost: 'free' | 'paid';
  importance: 'low' | 'medium' | 'high';
}

const upcomingEvents: PoliticalEvent[] = [
  {
    id: '1',
    title: 'Federal Budget 2025 Town Hall',
    date: '2025-06-25',
    time: '19:00',
    location: 'Toronto City Hall',
    type: 'town_hall',
    level: 'federal',
    description: 'Public discussion on the upcoming federal budget priorities and citizen input session.',
    organizer: 'Hon. Chrystia Freeland',
    attendees: 45,
    maxAttendees: 100,
    isVirtual: false,
    registrationRequired: true,
    cost: 'free',
    importance: 'high'
  },
  {
    id: '2',
    title: 'Climate Action Committee Meeting',
    date: '2025-06-26',
    time: '14:00',
    location: 'Virtual - Zoom',
    type: 'committee',
    level: 'provincial',
    description: 'Ontario\'s climate action plan review and public consultation.',
    organizer: 'Ministry of Environment',
    attendees: 23,
    maxAttendees: 50,
    isVirtual: true,
    registrationRequired: true,
    cost: 'free',
    importance: 'medium'
  },
  {
    id: '3',
    title: 'Municipal Housing Crisis Forum',
    date: '2025-06-27',
    time: '18:30',
    location: 'Vancouver Community Centre',
    type: 'meeting',
    level: 'municipal',
    description: 'Community forum addressing the housing affordability crisis and proposed solutions.',
    organizer: 'Vancouver City Council',
    attendees: 78,
    maxAttendees: 150,
    isVirtual: false,
    registrationRequired: false,
    cost: 'free',
    importance: 'high'
  },
  {
    id: '4',
    title: 'Healthcare Reform Debate',
    date: '2025-06-28',
    time: '20:00',
    location: 'CBC Studios',
    type: 'debate',
    level: 'federal',
    description: 'Live televised debate on proposed healthcare system reforms.',
    organizer: 'CBC News',
    isVirtual: true,
    registrationRequired: false,
    cost: 'free',
    importance: 'high'
  },
  {
    id: '5',
    title: 'Student Climate Strike',
    date: '2025-06-29',
    time: '12:00',
    location: 'Parliament Hill',
    type: 'protest',
    level: 'federal',
    description: 'Student-led climate action demonstration calling for stronger environmental policies.',
    organizer: 'Climate Action Youth',
    attendees: 340,
    isVirtual: false,
    registrationRequired: false,
    cost: 'free',
    importance: 'medium'
  }
];

export default function PoliticalCalendar() {
  const [selectedEvent, setSelectedEvent] = useState<PoliticalEvent | null>(null);
  const [followedEvents, setFollowedEvents] = useState<string[]>(['1', '3']);

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'town_hall': return <Users className="h-4 w-4" />;
      case 'debate': return <ExternalLink className="h-4 w-4" />;
      case 'committee': return <Calendar className="h-4 w-4" />;
      case 'election': return <Star className="h-4 w-4" />;
      case 'protest': return <Bell className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'town_hall': return 'bg-blue-100 text-blue-800';
      case 'debate': return 'bg-red-100 text-red-800';
      case 'committee': return 'bg-green-100 text-green-800';
      case 'election': return 'bg-purple-100 text-purple-800';
      case 'protest': return 'bg-orange-100 text-orange-800';
      case 'meeting': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'federal': return 'bg-red-50 text-red-700 border-red-200';
      case 'provincial': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'municipal': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const toggleFollow = (eventId: string) => {
    setFollowedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Political Calendar
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-1" />
                Reminders
              </Button>
              <Button variant="outline" size="sm">
                Add Event
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Stay informed about important political events, town halls, and civic opportunities in your area.
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">5</div>
            <div className="text-sm text-muted-foreground">This Week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">2</div>
            <div className="text-sm text-muted-foreground">Following</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-muted-foreground">Virtual</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id}
                className={`border-l-4 ${getImportanceColor(event.importance)} bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center space-x-2">
                      {getEventTypeIcon(event.type)}
                      <h3 className="font-semibold">{event.title}</h3>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollow(event.id);
                    }}
                    className={followedEvents.includes(event.id) ? 'text-blue-600' : 'text-gray-400'}
                  >
                    <Bell className={`h-4 w-4 ${followedEvents.includes(event.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className={getEventTypeColor(event.type)}>
                    {event.type.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className={getLevelColor(event.level)}>
                    {event.level}
                  </Badge>
                  {event.isVirtual && (
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">
                      Virtual
                    </Badge>
                  )}
                  {event.cost === 'free' && (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Free
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-3">{event.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                {event.attendees && event.maxAttendees && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Attendance</span>
                      <span>{event.attendees}/{event.maxAttendees}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-muted-foreground">
                    Organized by {event.organizer}
                  </span>
                  <div className="flex space-x-2">
                    {event.registrationRequired && (
                      <Button size="sm" variant="outline">
                        Register
                      </Button>
                    )}
                    <Button size="sm">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Calendar Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Export to Google Calendar
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Export to Outlook
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Enable Push Notifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}