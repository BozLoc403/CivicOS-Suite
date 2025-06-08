import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, MapPin, Globe, Clock, User, Building2, Calendar, FileText, ExternalLink } from "lucide-react";
import { useState } from "react";

interface ContactInfo {
  id: number;
  name: string;
  position: string;
  party?: string;
  constituency?: string;
  level: 'Federal' | 'Provincial' | 'Municipal';
  jurisdiction: string;
  
  // Primary Contact
  primaryPhone?: string;
  primaryEmail?: string;
  primaryOffice?: string;
  
  // Constituency Office
  constituencyPhone?: string;
  constituencyEmail?: string;
  constituencyAddress?: string;
  constituencyHours?: string;
  
  // Parliament/Legislative Office
  parliamentPhone?: string;
  parliamentEmail?: string;
  parliamentOffice?: string;
  parliamentAddress?: string;
  
  // Staff Contacts
  chiefOfStaffPhone?: string;
  chiefOfStaffEmail?: string;
  pressSecretaryPhone?: string;
  pressSecretaryEmail?: string;
  schedulerPhone?: string;
  schedulerEmail?: string;
  
  // Digital Presence
  website?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  
  // Additional Contact Methods
  emergencyPhone?: string;
  afterHoursPhone?: string;
  faxNumber?: string;
  mailingAddress?: string;
  
  // Office Hours & Availability
  officeHours?: string;
  townHallSchedule?: string;
  nextAvailableAppointment?: string;
  
  // Specializations
  portfolios?: string[];
  committees?: string[];
  caucusRole?: string;
  
  // Response Times
  emailResponseTime?: string;
  phoneResponseTime?: string;
  meetingAvailability?: string;
  
  // Regional Offices (for higher-level officials)
  regionalOffices?: Array<{
    city: string;
    phone: string;
    email: string;
    address: string;
    hours: string;
  }>;
}

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>("all");
  const [partyFilter, setPartyFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<ContactInfo | null>(null);

  const { data: contacts = [], isLoading } = useQuery<ContactInfo[]>({
    queryKey: ["/api/contacts/comprehensive"],
  });

  const { data: jurisdictions = [] } = useQuery<string[]>({
    queryKey: ["/api/contacts/jurisdictions"],
  });

  const { data: parties = [] } = useQuery<string[]>({
    queryKey: ["/api/contacts/parties"],
  });

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.constituency?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || contact.level === levelFilter;
    const matchesJurisdiction = jurisdictionFilter === "all" || contact.jurisdiction === jurisdictionFilter;
    const matchesParty = partyFilter === "all" || contact.party === partyFilter;
    
    return matchesSearch && matchesLevel && matchesJurisdiction && matchesParty;
  });

  const getPartyColor = (party?: string) => {
    if (!party) return "bg-gray-500";
    switch (party.toLowerCase()) {
      case "liberal": return "bg-liberal-red";
      case "conservative": return "bg-conservative-blue";
      case "ndp": case "new democratic": return "bg-ndp-orange";
      case "bloc québécois": case "bloc quebecois": return "bg-bloc-cyan";
      case "green": return "bg-green-party";
      default: return "bg-civic-gray";
    }
  };

  const ContactCard = ({ contact }: { contact: ContactInfo }) => (
    <Card className="glass-card fade-in-up hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => setSelectedContact(contact)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold civic-blue">{contact.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{contact.position}</p>
            {contact.constituency && (
              <p className="text-sm civic-green mt-1">{contact.constituency}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${getPartyColor(contact.party)} text-white`}>
              {contact.party || "Independent"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {contact.level}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {contact.primaryPhone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 civic-green" />
              <span className="font-mono">{contact.primaryPhone}</span>
            </div>
          )}
          {contact.primaryEmail && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 civic-blue" />
              <span className="truncate">{contact.primaryEmail}</span>
            </div>
          )}
          {contact.primaryOffice && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 civic-red" />
              <span className="truncate">{contact.primaryOffice}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const DetailedContactView = ({ contact }: { contact: ContactInfo }) => (
    <div className="space-y-6 fade-in-up">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold civic-blue mb-2">{contact.name}</h1>
            <p className="text-xl text-muted-foreground mb-2">{contact.position}</p>
            {contact.constituency && (
              <p className="text-lg civic-green">{contact.constituency}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={`${getPartyColor(contact.party)} text-white text-sm px-3 py-1`}>
              {contact.party || "Independent"}
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {contact.level} • {contact.jurisdiction}
            </Badge>
          </div>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          {contact.primaryPhone && (
            <Button variant="outline" size="sm" className="gap-2">
              <Phone className="h-4 w-4" />
              Call Primary
            </Button>
          )}
          {contact.primaryEmail && (
            <Button variant="outline" size="sm" className="gap-2">
              <Mail className="h-4 w-4" />
              Email Primary
            </Button>
          )}
          {contact.website && (
            <Button variant="outline" size="sm" className="gap-2">
              <Globe className="h-4 w-4" />
              Visit Website
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="primary" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="primary">Primary Contact</TabsTrigger>
          <TabsTrigger value="offices">Offices</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="digital">Digital</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="primary" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 civic-blue" />
                Primary Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contact.primaryPhone && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Primary Phone</label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Phone className="h-4 w-4 civic-green" />
                      <span className="font-mono text-lg">{contact.primaryPhone}</span>
                    </div>
                  </div>
                )}
                {contact.primaryEmail && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Primary Email</label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Mail className="h-4 w-4 civic-blue" />
                      <span className="break-all">{contact.primaryEmail}</span>
                    </div>
                  </div>
                )}
                {contact.emergencyPhone && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Emergency Contact</label>
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <Phone className="h-4 w-4 text-destructive" />
                      <span className="font-mono text-lg">{contact.emergencyPhone}</span>
                    </div>
                  </div>
                )}
                {contact.afterHoursPhone && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">After Hours</label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Clock className="h-4 w-4 civic-purple" />
                      <span className="font-mono text-lg">{contact.afterHoursPhone}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offices" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Constituency Office */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 civic-green" />
                  Constituency Office
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contact.constituencyPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 civic-green" />
                    <span className="font-mono">{contact.constituencyPhone}</span>
                  </div>
                )}
                {contact.constituencyEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 civic-blue" />
                    <span className="break-all">{contact.constituencyEmail}</span>
                  </div>
                )}
                {contact.constituencyAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 civic-red mt-1" />
                    <span className="text-sm">{contact.constituencyAddress}</span>
                  </div>
                )}
                {contact.constituencyHours && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 civic-purple" />
                    <span className="text-sm">{contact.constituencyHours}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Parliament/Legislative Office */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 civic-red" />
                  {contact.level === 'Federal' ? 'Parliament Office' : 'Legislative Office'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contact.parliamentPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 civic-green" />
                    <span className="font-mono">{contact.parliamentPhone}</span>
                  </div>
                )}
                {contact.parliamentEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 civic-blue" />
                    <span className="break-all">{contact.parliamentEmail}</span>
                  </div>
                )}
                {contact.parliamentOffice && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 civic-red" />
                    <span className="text-sm">{contact.parliamentOffice}</span>
                  </div>
                )}
                {contact.parliamentAddress && (
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 civic-gray mt-1" />
                    <span className="text-sm">{contact.parliamentAddress}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Regional Offices */}
          {contact.regionalOffices && contact.regionalOffices.length > 0 && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Regional Offices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contact.regionalOffices.map((office, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <h4 className="font-semibold civic-blue">{office.city}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span className="font-mono">{office.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span>{office.email}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-3 w-3 mt-1" />
                          <span>{office.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>{office.hours}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Chief of Staff */}
            {(contact.chiefOfStaffPhone || contact.chiefOfStaffEmail) && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Chief of Staff</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {contact.chiefOfStaffPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 civic-green" />
                      <span className="font-mono">{contact.chiefOfStaffPhone}</span>
                    </div>
                  )}
                  {contact.chiefOfStaffEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 civic-blue" />
                      <span className="text-sm break-all">{contact.chiefOfStaffEmail}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Press Secretary */}
            {(contact.pressSecretaryPhone || contact.pressSecretaryEmail) && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Press Secretary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {contact.pressSecretaryPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 civic-green" />
                      <span className="font-mono">{contact.pressSecretaryPhone}</span>
                    </div>
                  )}
                  {contact.pressSecretaryEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 civic-blue" />
                      <span className="text-sm break-all">{contact.pressSecretaryEmail}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Scheduler */}
            {(contact.schedulerPhone || contact.schedulerEmail) && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Scheduler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {contact.schedulerPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 civic-green" />
                      <span className="font-mono">{contact.schedulerPhone}</span>
                    </div>
                  )}
                  {contact.schedulerEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 civic-blue" />
                      <span className="text-sm break-all">{contact.schedulerEmail}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="digital" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 civic-blue" />
                Digital Presence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contact.website && (
                  <a href={contact.website} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors">
                    <Globe className="h-4 w-4 civic-blue" />
                    <span>Official Website</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
                {contact.twitter && (
                  <a href={contact.twitter} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors">
                    <span className="text-blue-500">𝕏</span>
                    <span>Twitter/X</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
                {contact.facebook && (
                  <a href={contact.facebook} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors">
                    <span className="text-blue-600">f</span>
                    <span>Facebook</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
                {contact.instagram && (
                  <a href={contact.instagram} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors">
                    <span className="text-pink-500">📷</span>
                    <span>Instagram</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
                {contact.linkedin && (
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors">
                    <span className="text-blue-700">in</span>
                    <span>LinkedIn</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 civic-purple" />
                  Office Hours & Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contact.officeHours && (
                  <div>
                    <label className="text-sm font-medium">Office Hours</label>
                    <p className="text-sm text-muted-foreground mt-1">{contact.officeHours}</p>
                  </div>
                )}
                {contact.nextAvailableAppointment && (
                  <div>
                    <label className="text-sm font-medium">Next Available Appointment</label>
                    <p className="text-sm civic-green mt-1">{contact.nextAvailableAppointment}</p>
                  </div>
                )}
                {contact.townHallSchedule && (
                  <div>
                    <label className="text-sm font-medium">Town Hall Schedule</label>
                    <p className="text-sm text-muted-foreground mt-1">{contact.townHallSchedule}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 civic-blue" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contact.emailResponseTime && (
                  <div>
                    <label className="text-sm font-medium">Email Response</label>
                    <p className="text-sm text-muted-foreground mt-1">{contact.emailResponseTime}</p>
                  </div>
                )}
                {contact.phoneResponseTime && (
                  <div>
                    <label className="text-sm font-medium">Phone Response</label>
                    <p className="text-sm text-muted-foreground mt-1">{contact.phoneResponseTime}</p>
                  </div>
                )}
                {contact.meetingAvailability && (
                  <div>
                    <label className="text-sm font-medium">Meeting Availability</label>
                    <p className="text-sm text-muted-foreground mt-1">{contact.meetingAvailability}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Portfolios and Committees */}
          {(contact.portfolios?.length || contact.committees?.length || contact.caucusRole) && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 civic-gold" />
                  Roles & Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contact.portfolios && contact.portfolios.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Portfolios</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {contact.portfolios.map((portfolio, index) => (
                        <Badge key={index} variant="secondary">{portfolio}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {contact.committees && contact.committees.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Committees</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {contact.committees.map((committee, index) => (
                        <Badge key={index} variant="outline">{committee}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {contact.caucusRole && (
                  <div>
                    <label className="text-sm font-medium">Caucus Role</label>
                    <p className="text-sm text-muted-foreground mt-1">{contact.caucusRole}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {!selectedContact ? (
        <>
          {/* Header */}
          <div className="glass-card p-6">
            <h1 className="text-3xl font-bold civic-blue mb-2">Government Contacts Directory</h1>
            <p className="text-muted-foreground mb-4">
              Comprehensive contact information for all government officials across Canada
            </p>
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="outline">{contacts.length} Total Contacts</Badge>
              <Badge variant="outline">{contacts.filter(c => c.level === 'Federal').length} Federal</Badge>
              <Badge variant="outline">{contacts.filter(c => c.level === 'Provincial').length} Provincial</Badge>
              <Badge variant="outline">{contacts.filter(c => c.level === 'Municipal').length} Municipal</Badge>
            </div>
          </div>

          {/* Filters */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <Input
                    placeholder="Search by name, position, or constituency..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Federal">Federal</SelectItem>
                    <SelectItem value="Provincial">Provincial</SelectItem>
                    <SelectItem value="Municipal">Municipal</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={jurisdictionFilter} onValueChange={setJurisdictionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jurisdictions</SelectItem>
                    {jurisdictions.map(jurisdiction => (
                      <SelectItem key={jurisdiction} value={jurisdiction}>{jurisdiction}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={partyFilter} onValueChange={setPartyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Party" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Parties</SelectItem>
                    {parties.map(party => (
                      <SelectItem key={party} value={party}>{party}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {filteredContacts.length} Contact{filteredContacts.length !== 1 ? 's' : ''} Found
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setLevelFilter("all");
                  setJurisdictionFilter("all");
                  setPartyFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.map(contact => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <Button 
            variant="outline" 
            onClick={() => setSelectedContact(null)}
            className="mb-4"
          >
            ← Back to Directory
          </Button>
          <DetailedContactView contact={selectedContact} />
        </>
      )}
    </div>
  );
}