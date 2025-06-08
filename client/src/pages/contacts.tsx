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
    },
    {
      id: "cpp",
      name: "Canada Pension Plan",
      abbreviation: "CPP",
      category: "Social",
      description: "Retirement, disability, and survivor pension benefits",
      mainPhone: "1-800-277-9914",
      email: "cpp-rpc@servicecanada.gc.ca",
      website: "https://www.canada.ca/en/services/benefits/publicpensions/cpp.html",
      onlineServices: "My Service Canada Account",
      hours: "Monday-Friday 8:30 AM - 4:30 PM",
      languages: ["English", "French"],
      waitTimes: "Average 30-35 minutes",
      appName: "MSCA Mobile",
      keyServices: ["Retirement Pension", "Disability Benefits", "Survivor Benefits", "Children's Benefits", "Death Benefits"]
    },
    {
      id: "oas",
      name: "Old Age Security",
      abbreviation: "OAS",
      category: "Social",
      description: "Monthly pension for seniors 65 and older",
      mainPhone: "1-800-277-9914",
      email: "oas-sv@servicecanada.gc.ca",
      website: "https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security.html",
      onlineServices: "My Service Canada Account",
      hours: "Monday-Friday 8:30 AM - 4:30 PM",
      languages: ["English", "French"],
      waitTimes: "Average 25-30 minutes",
      keyServices: ["Old Age Security Pension", "Guaranteed Income Supplement", "Allowance", "Allowance for Survivor"]
    },
    {
      id: "ircc",
      name: "Immigration, Refugees and Citizenship Canada",
      abbreviation: "IRCC",
      category: "Immigration",
      description: "Immigration, citizenship, and refugee services",
      mainPhone: "1-888-242-2100",
      email: "IRCC.ClientPortal-PortailClient.IRCC@cic.gc.ca",
      website: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
      onlineServices: "Secure Account, Online Applications",
      hours: "Monday-Friday 8:00 AM - 4:00 PM",
      languages: ["English", "French", "Arabic", "Mandarin", "Spanish"],
      waitTimes: "Average 45-60 minutes",
      urgentLine: "1-888-242-2100",
      keyServices: ["Citizenship Applications", "Permanent Residence", "Work Permits", "Study Permits", "Visitor Visas", "Refugee Claims"]
    },
    {
      id: "vac",
      name: "Veterans Affairs Canada",
      abbreviation: "VAC",
      category: "Veterans",
      description: "Benefits and services for Canadian veterans",
      mainPhone: "1-866-522-2122",
      email: "information@vac-acc.gc.ca",
      website: "https://www.veterans.gc.ca",
      onlineServices: "My VAC Account",
      hours: "Monday-Friday 8:30 AM - 4:00 PM",
      languages: ["English", "French"],
      waitTimes: "Average 20-25 minutes",
      urgentLine: "1-866-522-2022",
      appName: "VAC Mobile",
      keyServices: ["Disability Benefits", "Rehabilitation", "Career Transition", "Health Care", "Commemorative Services"]
    },
    {
      id: "phac",
      name: "Public Health Agency of Canada",
      abbreviation: "PHAC",
      category: "Health",
      description: "Public health information and emergency response",
      mainPhone: "1-833-784-4397",
      email: "phac.info.aspc@canada.ca",
      website: "https://www.canada.ca/en/public-health.html",
      onlineServices: "Health Canada online services",
      hours: "Monday-Friday 8:00 AM - 8:00 PM",
      languages: ["English", "French"],
      waitTimes: "Average 15-20 minutes",
      urgentLine: "1-833-784-4397",
      keyServices: ["Disease Surveillance", "Emergency Preparedness", "Health Promotion", "Immunization", "Travel Health"]
    },
    {
      id: "transport",
      name: "Transport Canada",
      abbreviation: "TC",
      category: "Transportation",
      description: "Transportation safety and regulation services",
      mainPhone: "1-613-990-2309",
      email: "info@tc.gc.ca",
      website: "https://www.tc.gc.ca",
      onlineServices: "Online licensing and permits",
      hours: "Monday-Friday 8:00 AM - 4:00 PM",
      languages: ["English", "French"],
      waitTimes: "Average 20-25 minutes",
      keyServices: ["Driver's Licenses", "Vehicle Registration", "Aviation Licenses", "Marine Safety", "Rail Safety", "Dangerous Goods"]
    },
    {
      id: "emergency",
      name: "Emergency Management Canada",
      abbreviation: "EMC",
      category: "Emergency",
      description: "Emergency preparedness and disaster response",
      mainPhone: "1-800-830-3118",
      urgentLine: "911",
      email: "ps.emergency-urgence.sp@canada.ca",
      website: "https://www.publicsafety.gc.ca",
      onlineServices: "Emergency alerts and information",
      hours: "24/7 emergency line, office Monday-Friday 8:00 AM - 4:00 PM",
      languages: ["English", "French"],
      keyServices: ["Emergency Response", "Disaster Relief", "Emergency Preparedness", "Public Alerts", "Critical Infrastructure"]
    },
    {
      id: "justice",
      name: "Department of Justice Canada",
      abbreviation: "DOJ",
      category: "Legal",
      description: "Legal information and court services",
      mainPhone: "1-613-957-4222",
      email: "webadmin@justice.gc.ca",
      website: "https://www.justice.gc.ca",
      onlineServices: "Legal aid directory, court services",
      hours: "Monday-Friday 8:30 AM - 5:00 PM",
      languages: ["English", "French"],
      waitTimes: "Average 15-20 minutes",
      keyServices: ["Legal Aid", "Court Services", "Family Law", "Criminal Law", "Human Rights", "Access to Justice"]
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
        <DetailedServiceView service={selectedService} />
      ) : (
        <DetailedContactView contact={selectedContact!} />
      )}
    </div>
  );

  const DetailedServiceView = ({ service }: { service: GovernmentService }) => (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => setSelectedService(null)}
        className="mb-4"
      >
        ← Back to Services
      </Button>

      {/* Service Header */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-civic-blue/10">
            {(() => {
              const IconComponent = getCategoryIcon(service.category);
              return <IconComponent className="h-8 w-8 civic-blue" />;
            })()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold civic-blue">{service.name}</h1>
            <p className="text-xl font-semibold civic-green mt-1">{service.abbreviation}</p>
            <p className="text-muted-foreground mt-2">{service.description}</p>
            <div className="flex gap-2 mt-3">
              <Badge variant="outline">{service.category}</Badge>
              <Badge className="bg-civic-blue text-white">Government Service</Badge>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="contact" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/90">
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="online">Online Access</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Contact */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 civic-green" />
                  Primary Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 civic-green" />
                  <span className="font-mono text-lg">{service.mainPhone}</span>
                </div>
                {service.altPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 civic-blue" />
                    <span className="font-mono">{service.altPhone}</span>
                    <Badge variant="outline" className="text-xs">Alternative</Badge>
                  </div>
                )}
                {service.urgentLine && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 civic-red" />
                    <span className="font-mono">{service.urgentLine}</span>
                    <Badge className="bg-red-500 text-white text-xs">Urgent</Badge>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 civic-blue" />
                  <span className="break-all">{service.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 civic-orange" />
                  <span className="text-sm">{service.hours}</span>
                </div>
                {service.waitTimes && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 civic-purple" />
                    <span className="text-sm">{service.waitTimes}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Digital Services */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 civic-blue" />
                  Digital Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 civic-purple" />
                  <a href={service.website} target="_blank" rel="noopener noreferrer" 
                     className="text-civic-blue hover:underline break-all">
                    {service.website}
                  </a>
                  <ExternalLink className="h-3 w-3" />
                </div>
                <div>
                  <label className="text-sm font-medium">Online Services</label>
                  <p className="text-sm text-muted-foreground mt-1">{service.onlineServices}</p>
                </div>
                {service.appName && (
                  <div>
                    <label className="text-sm font-medium">Mobile App</label>
                    <p className="text-sm civic-blue mt-1">{service.appName}</p>
                  </div>
                )}
                {service.textService && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 civic-green" />
                    <span className="text-sm">Text Service Available</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Languages */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 civic-gold" />
                Available Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {service.languages.map((language, index) => (
                  <Badge key={index} variant="secondary">{language}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 civic-blue" />
                Key Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {service.keyServices.map((keyService, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-civic-blue rounded-full"></div>
                    <span className="font-medium">{keyService}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="online" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 civic-purple" />
                Online Portal Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <h4 className="font-semibold civic-blue mb-2">Primary Website</h4>
                <a href={service.website} target="_blank" rel="noopener noreferrer"
                   className="text-civic-blue hover:underline flex items-center gap-2">
                  {service.website}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Available Online Services</h4>
                <p className="text-muted-foreground">{service.onlineServices}</p>
              </div>
              {service.appName && (
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-semibold civic-green mb-2">Mobile Application</h4>
                  <p className="civic-blue font-medium">{service.appName}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Available on iOS and Android app stores
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          {service.regionalOffices && service.regionalOffices.length > 0 ? (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 civic-red" />
                  Regional Offices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.regionalOffices.map((office, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <h4 className="font-semibold civic-blue">{office.region}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span className="font-mono">{office.phone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-3 w-3 mt-1" />
                          <span>{office.address}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 civic-red" />
                  Service Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    This service is primarily available through phone and online channels.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Contact the service directly for information about in-person assistance.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
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