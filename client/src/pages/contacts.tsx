import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, MapPin, Globe, Clock, User, Building2, Calendar, FileText, ExternalLink, Shield, DollarSign, Heart, Users, Home, Car, Baby } from "lucide-react";
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

interface GovernmentService {
  id: string;
  name: string;
  abbreviation: string;
  category: 'Employment' | 'Tax' | 'Health' | 'Social' | 'Immigration' | 'Veterans' | 'Transportation' | 'Emergency' | 'Legal' | 'Business';
  description: string;
  mainPhone: string;
  altPhone?: string;
  email: string;
  website: string;
  onlineServices: string;
  hours: string;
  languages: string[];
  waitTimes?: string;
  urgentLine?: string;
  textService?: string;
  appName?: string;
  keyServices: string[];
  regionalOffices?: Array<{
    region: string;
    phone: string;
    address: string;
  }>;
}

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>("all");
  const [partyFilter, setPartyFilter] = useState<string>("all");
  const [serviceCategory, setServiceCategory] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<ContactInfo | null>(null);
  const [selectedService, setSelectedService] = useState<GovernmentService | null>(null);

  const { data: contacts = [], isLoading } = useQuery<ContactInfo[]>({
    queryKey: ["/api/contacts/comprehensive"],
  });

  const { data: jurisdictions = [] } = useQuery<string[]>({
    queryKey: ["/api/contacts/jurisdictions"],
  });

  const { data: parties = [] } = useQuery<string[]>({
    queryKey: ["/api/contacts/parties"],
  });

  // Comprehensive Canadian Government Services
  const governmentServices: GovernmentService[] = [
    {
      id: "cra",
      name: "Canada Revenue Agency",
      abbreviation: "CRA",
      category: "Tax",
      description: "Tax filing, benefits, credits, and revenue services",
      mainPhone: "1-800-959-8281",
      altPhone: "1-855-284-5946",
      email: "info@cra-arc.gc.ca",
      website: "https://www.canada.ca/en/revenue-agency.html",
      onlineServices: "My Account, My Business Account, Represent a Client",
      hours: "Monday-Friday 9:00 AM - 5:00 PM",
      languages: ["English", "French"],
      waitTimes: "Average 15-20 minutes",
      urgentLine: "1-888-863-8662",
      textService: "Available",
      appName: "MyCRA",
      keyServices: ["Tax Returns", "GST/HST", "Payroll", "Benefits", "Child Care Benefit", "Tax Credits"]
    },
    {
      id: "ei",
      name: "Employment Insurance",
      abbreviation: "EI",
      category: "Employment",
      description: "Unemployment benefits, maternity/parental leave, sickness benefits",
      mainPhone: "1-800-206-7218",
      email: "ei-ae@servicecanada.gc.ca",
      website: "https://www.canada.ca/en/employment-social-development/programs/ei.html",
      onlineServices: "My Service Canada Account",
      hours: "Monday-Friday 8:30 AM - 4:30 PM",
      languages: ["English", "French"],
      waitTimes: "Average 25-30 minutes",
      urgentLine: "1-800-808-6352",
      textService: "Available",
      appName: "MSCA Mobile",
      keyServices: ["Regular Benefits", "Maternity/Parental Leave", "Sickness Benefits", "Compassionate Care", "Fishing Benefits"]
    },
    {
      id: "wcb",
      name: "Workers' Compensation Board",
      abbreviation: "WCB/WSIB",
      category: "Employment",
      description: "Workplace injury compensation and prevention services",
      mainPhone: "1-800-387-0750",
      altPhone: "416-344-1000",
      email: "contactcentre@wsib.on.ca",
      website: "https://www.wsib.on.ca",
      onlineServices: "My WSIB, Employer Portal",
      hours: "Monday-Friday 7:30 AM - 6:00 PM",
      languages: ["English", "French", "Spanish", "Italian", "Portuguese"],
      waitTimes: "Average 10-15 minutes",
      urgentLine: "1-800-387-0750",
      appName: "My WSIB",
      keyServices: ["Injury Claims", "Return to Work", "Prevention Services", "Premium Payments", "Healthcare Provider Services"],
      regionalOffices: [
        { region: "Toronto", phone: "416-344-1000", address: "200 Front St W, Toronto, ON" },
        { region: "Ottawa", phone: "613-238-5972", address: "347 Preston St, Ottawa, ON" },
        { region: "London", phone: "519-645-7100", address: "148 Fullarton St, London, ON" }
      ]
    },
    {
      id: "msca",
      name: "My Service Canada Account",
      abbreviation: "MSCA",
      category: "Social",
      description: "Online access to government benefits and services",
      mainPhone: "1-800-206-7218",
      email: "nc-msca-msdc-gd@hrsdc-rhdcc.gc.ca",
      website: "https://www.canada.ca/en/employment-social-development/services/my-account.html",
      onlineServices: "Full online portal access",
      hours: "24/7 online, phone support Monday-Friday 8:30 AM - 4:30 PM",
      languages: ["English", "French"],
      waitTimes: "Online instant, phone average 20 minutes",
      appName: "MSCA Mobile",
      keyServices: ["CPP/OAS", "EI Benefits", "Social Insurance Number", "Employment Records", "Direct Deposit"]
    }
  ];

  const filteredServices = governmentServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.keyServices.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = serviceCategory === "all" || service.category === serviceCategory;
    
    return matchesSearch && matchesCategory;
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Tax": return DollarSign;
      case "Employment": return Building2;
      case "Health": return Heart;
      case "Social": return Users;
      case "Immigration": return Globe;
      case "Veterans": return Shield;
      case "Transportation": return Car;
      case "Emergency": return Phone;
      case "Legal": return FileText;
      case "Business": return Building2;
      default: return Building2;
    }
  };

  const ServiceCard = ({ service }: { service: GovernmentService }) => {
    const IconComponent = getCategoryIcon(service.category);
    
    return (
      <Card className="glass-card fade-in-up hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedService(service)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-civic-blue/10">
                  <IconComponent className="h-5 w-5 civic-blue" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold civic-blue">{service.name}</CardTitle>
                  <p className="text-sm font-medium civic-green">{service.abbreviation}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {service.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 civic-green" />
              <span className="font-mono">{service.mainPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 civic-blue" />
              <span className="truncate">{service.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 civic-purple" />
              <span className="truncate">{service.website}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 civic-orange" />
              <span className="text-xs">{service.hours}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
      {!selectedContact && !selectedService ? (
        <>
          {/* Header */}
          <div className="glass-card p-6">
            <h1 className="text-3xl font-bold civic-blue mb-2">Government Directory</h1>
            <p className="text-muted-foreground mb-4">
              Complete access to government services and elected officials with comprehensive contact information
            </p>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Search services and contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/90"
              />
            </div>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="services" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/90">
              <TabsTrigger value="services" className="data-[state=active]:bg-civic-blue data-[state=active]:text-white">
                Government Services
              </TabsTrigger>
              <TabsTrigger value="politicians" className="data-[state=active]:bg-civic-blue data-[state=active]:text-white">
                Elected Officials
              </TabsTrigger>
            </TabsList>

            {/* Government Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <div className="glass-card p-4">
                <div className="flex flex-wrap gap-3 mb-4">
                  <Select value={serviceCategory} onValueChange={setServiceCategory}>
                    <SelectTrigger className="w-48 bg-white/90">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Tax">Tax Services</SelectItem>
                      <SelectItem value="Employment">Employment</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Social">Social Services</SelectItem>
                      <SelectItem value="Immigration">Immigration</SelectItem>
                      <SelectItem value="Veterans">Veterans</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
                
                {filteredServices.length === 0 && (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No services found matching your criteria</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Politicians Tab */}
            <TabsContent value="politicians" className="space-y-6">
              <div className="glass-card p-4">
                <div className="flex flex-wrap gap-3 mb-4">
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-48 bg-white/90">
                      <SelectValue placeholder="Filter by level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Federal">Federal</SelectItem>
                      <SelectItem value="Provincial">Provincial</SelectItem>
                      <SelectItem value="Municipal">Municipal</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={jurisdictionFilter} onValueChange={setJurisdictionFilter}>
                    <SelectTrigger className="w-48 bg-white/90">
                      <SelectValue placeholder="Filter by jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Jurisdictions</SelectItem>
                      {jurisdictions.map((jurisdiction) => (
                        <SelectItem key={jurisdiction} value={jurisdiction}>
                          {jurisdiction}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={partyFilter} onValueChange={setPartyFilter}>
                    <SelectTrigger className="w-48 bg-white/90">
                      <SelectValue placeholder="Filter by party" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Parties</SelectItem>
                      {parties.map((party) => (
                        <SelectItem key={party} value={party}>
                          {party}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredContacts.map((contact) => (
                    <ContactCard key={contact.id} contact={contact} />
                  ))}
                </div>
                
                {filteredContacts.length === 0 && (
                  <div className="text-center py-12">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No contacts found matching your criteria</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : selectedService ? (
        <div className="space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedService(null)}
            className="mb-4"
          >
            ← Back to Services
          </Button>
          <div className="glass-card p-6">
            <h1 className="text-3xl font-bold civic-blue">{selectedService.name}</h1>
            <p className="text-xl font-semibold civic-green mt-1">{selectedService.abbreviation}</p>
            <p className="text-muted-foreground mt-2">{selectedService.description}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedContact(null)}
            className="mb-4"
          >
            ← Back to Contacts
          </Button>
          <div className="glass-card p-6">
            <h1 className="text-3xl font-bold civic-blue">{selectedContact!.name}</h1>
            <p className="text-xl text-muted-foreground mt-1">{selectedContact!.position}</p>
          </div>
        </div>
      )}
    </div>
  );
}