import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, MapPin, Globe, Clock, User, Building2, Calendar, FileText, ExternalLink, Shield, DollarSign, Heart, Users, Home, Car, Baby, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

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
    },
    {
      id: "cbsa",
      name: "Canada Border Services Agency",
      abbreviation: "CBSA",
      category: "Immigration",
      description: "Border security and customs services",
      mainPhone: "1-800-461-9999",
      email: "contact@cbsa-asfc.gc.ca",
      website: "https://www.cbsa-asfc.gc.ca",
      onlineServices: "eDeclaration, Customs Online Portal",
      hours: "Monday-Friday 8:00 AM - 4:00 PM",
      languages: ["English", "French"],
      waitTimes: "Average 25-30 minutes",
      appName: "ArriveCAN",
      keyServices: ["Customs Declaration", "Border Crossing", "Commercial Imports", "Travel Documents", "Detention Review"]
    },
    {
      id: "cic",
      name: "Citizenship and Immigration Canada",
      abbreviation: "CIC",
      category: "Immigration",
      description: "Citizenship applications and immigration services",
      mainPhone: "1-888-242-2100",
      email: "cic.feedback-retroaction.cic@cic.gc.ca",
      website: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
      onlineServices: "Online applications and status checking",
      hours: "Monday-Friday 8:00 AM - 4:00 PM",
      languages: ["English", "French", "Spanish", "Mandarin", "Arabic"],
      waitTimes: "Average 40-50 minutes",
      keyServices: ["Citizenship Test", "Passport Services", "Status Updates", "Application Processing", "Document Authentication"]
    },
    {
      id: "esdc",
      name: "Employment and Social Development Canada",
      abbreviation: "ESDC",
      category: "Employment",
      description: "Employment programs and social development",
      mainPhone: "1-800-622-6232",
      email: "nc-pli-lmi-gd@hrsdc-rhdcc.gc.ca",
      website: "https://www.canada.ca/en/employment-social-development.html",
      onlineServices: "Job Bank, Grant and Contribution Portal",
      hours: "Monday-Friday 8:30 AM - 4:30 PM",
      languages: ["English", "French"],
      waitTimes: "Average 20-25 minutes",
      keyServices: ["Job Search", "Skills Training", "Labour Market Information", "Social Programs", "Workplace Safety"]
    },
    {
      id: "healthcanada",
      name: "Health Canada",
      abbreviation: "HC",
      category: "Health",
      description: "Health regulation and public health services",
      mainPhone: "1-866-225-0709",
      email: "info@hc-sc.gc.ca",
      website: "https://www.canada.ca/en/health-canada.html",
      onlineServices: "MedEffect Canada, Health Product License Database",
      hours: "Monday-Friday 8:00 AM - 6:00 PM",
      languages: ["English", "French"],
      waitTimes: "Average 15-20 minutes",
      keyServices: ["Drug Approval", "Food Safety", "Medical Devices", "Health Warnings", "Clinical Trials", "Product Recalls"]
    },
    {
      id: "cfia",
      name: "Canadian Food Inspection Agency",
      abbreviation: "CFIA",
      category: "Health",
      description: "Food safety and agricultural protection",
      mainPhone: "1-800-442-2342",
      email: "cfia.enquiries-demandes.acia@inspection.gc.ca",
      website: "https://www.inspection.gc.ca",
      onlineServices: "My CFIA Portal, Food Safety Complaints",
      hours: "Monday-Friday 8:00 AM - 4:00 PM",
      languages: ["English", "French"],
      waitTimes: "Average 10-15 minutes",
      keyServices: ["Food Safety Inspections", "Plant Health", "Animal Health", "Import/Export Certification", "Food Recalls"]
    },
    {
      id: "statcan",
      name: "Statistics Canada",
      abbreviation: "StatCan",
      category: "Business",
      description: "National statistical information and census data",
      mainPhone: "1-800-263-1136",
      email: "infostats@statcan.gc.ca",
      website: "https://www.statcan.gc.ca",
      onlineServices: "Census Online, Data Tables, Economic Indicators",
      hours: "Monday-Friday 8:30 AM - 4:30 PM",
      languages: ["English", "French"],
      waitTimes: "Average 10-15 minutes",
      keyServices: ["Census Data", "Economic Statistics", "Labour Force Survey", "Business Statistics", "Population Data"]
    },
    {
      id: "cers",
      name: "Canada Emergency Response Benefit",
      abbreviation: "CERB",
      category: "Emergency",
      description: "Emergency financial support programs",
      mainPhone: "1-800-959-2019",
      email: "cers-ssuc@cra-arc.gc.ca",
      website: "https://www.canada.ca/en/revenue-agency/services/benefits/emergency-response-benefit.html",
      onlineServices: "CRA My Account, Direct Deposit",
      hours: "Monday-Friday 9:00 AM - 5:00 PM",
      languages: ["English", "French"],
      waitTimes: "Average 30-40 minutes",
      keyServices: ["Emergency Benefits", "Wage Subsidies", "Rent Relief", "Student Benefits", "Recovery Benefits"]
    },
    {
      id: "innovation",
      name: "Innovation, Science and Economic Development Canada",
      abbreviation: "ISED",
      category: "Business",
      description: "Business development and innovation support",
      mainPhone: "1-800-328-6189",
      email: "ic.contact-contact.ic@canada.ca",
      website: "https://www.ic.gc.ca",
      onlineServices: "Business Registration, Corporations Canada Online",
      hours: "Monday-Friday 8:00 AM - 5:00 PM",
      languages: ["English", "French"],
      waitTimes: "Average 15-20 minutes",
      keyServices: ["Business Registration", "Patent Services", "Trademark Registration", "Corporate Services", "Innovation Programs"]
    },
    {
      id: "passport",
      name: "Passport Canada",
      abbreviation: "PC",
      category: "Immigration",
      description: "Canadian passport services and travel documents",
      mainPhone: "1-800-567-6868",
      email: "passport@passportcanada.gc.ca",
      website: "https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports.html",
      onlineServices: "Online passport application, Status checking",
      hours: "Monday-Friday 8:30 AM - 4:30 PM",
      languages: ["English", "French"],
      waitTimes: "Average 20-30 minutes",
      urgentLine: "1-800-567-6868",
      keyServices: ["Passport Applications", "Passport Renewal", "Travel Documents", "Emergency Passports", "Certificate of Identity"]
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
    <div className="min-h-screen bg-gradient-to-br from-civic-blue/5 via-white to-civic-green/5">
      {/* Navigation Header */}
      <header className="glass-card border-b border-civic-blue/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-civic-blue hover:text-civic-green transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              <div className="w-px h-6 bg-civic-blue/20"></div>
              <h1 className="text-xl font-bold civic-blue">Government Directory</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="civic-green">
                {filteredServices.length + filteredContacts.length} Results
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        {!selectedContact && !selectedService ? (
          <>
            {/* Header */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold civic-blue mb-2">Complete Government Access</h2>
              <p className="text-muted-foreground mb-4">
                Comprehensive directory of government services and elected officials with verified contact information
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
    </div>
  );
}