import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavigationHeader } from "@/components/NavigationHeader";
import { Search, Phone, Mail, Globe, MapPin, Clock, FileText, DollarSign, Users, Building } from "lucide-react";

interface GovernmentService {
  id: number;
  serviceName: string;
  department: string;
  description: string;
  serviceType: string;
  jurisdiction: string;
  province?: string;
  city?: string;
  phoneNumber?: string;
  email?: string;
  websiteUrl?: string;
  physicalAddress?: string;
  hoursOfOperation?: string;
  onlineAccessible: boolean;
  applicationRequired: boolean;
  fees?: string;
  processingTime?: string;
  requiredDocuments: string[];
  keywords: string[];
  lastUpdated: string;
}

export default function Services() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("all");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("all");
  const [selectedProvince, setSelectedProvince] = useState("all");

  const { data: services = [] } = useQuery<GovernmentService[]>({
    queryKey: ["/api/services", searchTerm, selectedServiceType, selectedJurisdiction, selectedProvince],
  });

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case "application": return "bg-blue-100 text-blue-800";
      case "information": return "bg-green-100 text-green-800";
      case "complaint": return "bg-red-100 text-red-800";
      case "emergency": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getJurisdictionColor = (jurisdiction: string) => {
    switch (jurisdiction) {
      case "federal": return "bg-blue-100 text-blue-800";
      case "provincial": return "bg-purple-100 text-purple-800";
      case "municipal": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const provinces = [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", 
    "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", 
    "Nunavut", "Ontario", "Prince Edward Island", "Quebec", 
    "Saskatchewan", "Yukon"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Building className="w-8 h-8 mr-3 text-civic-blue" />
            Government Services Directory
          </h1>
          <p className="mt-2 text-gray-600">
            Complete directory of all Canadian government services with direct contact information, 
            required documents, fees, and processing times. No bureaucratic runaround.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search services, departments, or keywords (e.g., 'passport', 'EI', 'health card')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Service Types</option>
              <option value="application">Applications</option>
              <option value="information">Information</option>
              <option value="complaint">Complaints</option>
              <option value="emergency">Emergency Services</option>
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
            
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Provinces</option>
              {provinces.map(province => (
                <option key={province} value={province.toLowerCase().replace(/\s+/g, '_')}>{province}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{service.serviceName}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{service.department}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={getServiceTypeColor(service.serviceType)}>
                      {service.serviceType}
                    </Badge>
                    <Badge className={getJurisdictionColor(service.jurisdiction)}>
                      {service.jurisdiction}
                    </Badge>
                    {service.province && (
                      <Badge variant="outline">
                        <MapPin className="w-3 h-3 mr-1" />
                        {service.province}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-700">{service.description}</p>
                
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-gray-900">Contact Information</h4>
                  
                  {service.phoneNumber && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="font-mono">{formatPhoneNumber(service.phoneNumber)}</span>
                      <Button size="sm" variant="outline" className="ml-auto">
                        <Phone className="w-3 h-3 mr-1" />
                        Call Now
                      </Button>
                    </div>
                  )}
                  
                  {service.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="break-all">{service.email}</span>
                      <Button size="sm" variant="outline" className="ml-auto">
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                    </div>
                  )}
                  
                  {service.websiteUrl && (
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-civic-blue hover:underline cursor-pointer">
                        {service.websiteUrl}
                      </span>
                      <Button size="sm" variant="outline" className="ml-auto">
                        <Globe className="w-3 h-3 mr-1" />
                        Visit Site
                      </Button>
                    </div>
                  )}
                  
                  {service.physicalAddress && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-sm">{service.physicalAddress}</span>
                    </div>
                  )}
                  
                  {service.hoursOfOperation && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{service.hoursOfOperation}</span>
                    </div>
                  )}
                </div>
                
                {/* Service Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {service.onlineAccessible && (
                        <Badge className="bg-green-100 text-green-800">
                          <Globe className="w-3 h-3 mr-1" />
                          Online Available
                        </Badge>
                      )}
                      {service.applicationRequired && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <FileText className="w-3 h-3 mr-1" />
                          Application Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {service.fees && (
                    <div className="flex items-start space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Fees: </span>
                        <span>{service.fees}</span>
                      </div>
                    </div>
                  )}
                  
                  {service.processingTime && (
                    <div className="flex items-start space-x-2">
                      <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Processing Time: </span>
                        <span>{service.processingTime}</span>
                      </div>
                    </div>
                  )}
                  
                  {service.requiredDocuments.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        Required Documents:
                      </h5>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {service.requiredDocuments.map((doc, index) => (
                          <li key={index}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Keywords for SEO */}
                {service.keywords.length > 0 && (
                  <div className="border-t pt-3">
                    <div className="flex flex-wrap gap-1">
                      {service.keywords.slice(0, 5).map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 border-t pt-2">
                  Last updated: {new Date(service.lastUpdated).toLocaleDateString('en-CA')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {services.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or browse all services.</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Access Emergency Numbers */}
        <div className="mt-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Emergency & Important Numbers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-700">911</div>
                  <div className="text-sm text-red-600">Police, Fire, Ambulance</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-700">1-800-O-CANADA</div>
                  <div className="text-sm text-blue-600">Government of Canada Info</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-700">211</div>
                  <div className="text-sm text-green-600">Community Services</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}