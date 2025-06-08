import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Scale, BookOpen, FileText, AlertTriangle, Phone, Globe, MapPin, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { NavigationHeader } from "@/components/NavigationHeader";

export default function LegalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("criminal-code");

  const { data: criminalCodeSections = [] } = useQuery({
    queryKey: ["/api/legal/criminal-code"],
  });

  const { data: lawUpdates = [] } = useQuery({
    queryKey: ["/api/legal/updates"],
  });

  const { data: governmentServices = [] } = useQuery({
    queryKey: ["/api/legal/services"],
  });

  const filteredCriminalCode = criminalCodeSections.filter((section: any) =>
    section.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.sectionNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLawUpdates = lawUpdates.filter((update: any) =>
    update.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    update.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    update.jurisdiction?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = governmentServices.filter((service: any) =>
    service.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 bg-gradient-to-br from-civic-blue via-civic-purple to-civic-green text-white p-10 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-sm">
          <h1 className="text-luxury text-5xl font-bold mb-6 tracking-tight">
            Legal Research Center
          </h1>
          <p className="text-political text-xl text-white/90 leading-relaxed max-w-2xl">
            Comprehensive legal research with authentic Canadian criminal code, law updates, and government services
          </p>
          <div className="flex items-center mt-6 space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full pulse-glow"></div>
              <span className="text-sm text-white/80">Real-time legal updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full pulse-glow"></div>
              <span className="text-sm text-white/80">Verified government sources</span>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg border-none glass-card">
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search criminal code sections, law updates, or government services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2 focus:border-civic-blue text-political"
                />
              </div>
              <Button className="bg-civic-blue hover:bg-civic-blue/90 text-white">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="criminal-code" className="text-political data-[state=active]:bg-civic-blue data-[state=active]:text-white">
              <Scale className="w-4 h-4 mr-2" />
              Criminal Code
            </TabsTrigger>
            <TabsTrigger value="law-updates" className="text-political data-[state=active]:bg-civic-green data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Law Updates
            </TabsTrigger>
            <TabsTrigger value="services" className="text-political data-[state=active]:bg-civic-purple data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Government Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="criminal-code" className="space-y-6">
            <div className="grid gap-6">
              {filteredCriminalCode.length === 0 ? (
                <Card className="border-none shadow-lg glass-card">
                  <CardContent className="p-8 text-center">
                    <Scale className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-luxury text-lg font-semibold text-foreground mb-2">
                      {searchQuery ? "No Results Found" : "Criminal Code Sections"}
                    </h3>
                    <p className="text-political text-muted-foreground">
                      {searchQuery 
                        ? "Try adjusting your search terms to find relevant criminal code sections."
                        : "Search for specific criminal code sections, offenses, or legal terms."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredCriminalCode.map((section: any) => (
                    <AccordionItem 
                      key={section.id} 
                      value={`section-${section.id}`}
                      className="border-none shadow-lg rounded-lg glass-card"
                    >
                      <AccordionTrigger className="hover:no-underline p-6">
                        <div className="flex items-start space-x-4">
                          <Badge variant="outline" className="border-civic-blue text-civic-blue">
                            Section {section.sectionNumber}
                          </Badge>
                          <div className="text-left">
                            <h3 className="text-luxury text-lg font-semibold text-foreground">
                              {section.title}
                            </h3>
                            {section.summary && (
                              <p className="text-political text-sm text-muted-foreground mt-1">
                                {section.summary}
                              </p>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-political font-semibold text-foreground mb-2">Full Text</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {section.fullText}
                            </p>
                          </div>
                          
                          {section.penalties && (
                            <div>
                              <h4 className="text-political font-semibold text-foreground mb-2">Penalties</h4>
                              <p className="text-sm text-muted-foreground">
                                {section.penalties}
                              </p>
                            </div>
                          )}

                          {section.recentChanges && (
                            <div>
                              <h4 className="text-political font-semibold text-foreground mb-2">Recent Changes</h4>
                              <p className="text-sm text-muted-foreground">
                                {section.recentChanges}
                              </p>
                            </div>
                          )}

                          {section.relatedSections && section.relatedSections.length > 0 && (
                            <div>
                              <h4 className="text-political font-semibold text-foreground mb-2">Related Sections</h4>
                              <div className="flex flex-wrap gap-2">
                                {section.relatedSections.map((related: string, index: number) => (
                                  <Badge key={index} variant="secondary">
                                    {related}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            Last updated: {new Date(section.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </TabsContent>

          <TabsContent value="law-updates" className="space-y-6">
            <div className="grid gap-6">
              {filteredLawUpdates.length === 0 ? (
                <Card className="border-none shadow-lg glass-card">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-luxury text-lg font-semibold text-foreground mb-2">
                      {searchQuery ? "No Updates Found" : "Recent Law Updates"}
                    </h3>
                    <p className="text-political text-muted-foreground">
                      {searchQuery 
                        ? "Try adjusting your search terms to find relevant law updates."
                        : "Recent changes and updates to Canadian federal and provincial laws."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredLawUpdates.map((update: any) => (
                  <Card key={update.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={`
                              ${update.jurisdiction === 'federal' ? 'border-civic-blue text-civic-blue' : ''}
                              ${update.jurisdiction === 'provincial' ? 'border-civic-green text-civic-green' : ''}
                              ${update.jurisdiction === 'municipal' ? 'border-civic-purple text-civic-purple' : ''}
                            `}
                          >
                            {update.jurisdiction}
                          </Badge>
                          <Badge variant="secondary">
                            {update.lawType}
                          </Badge>
                          <Badge 
                            variant={update.changeType === 'new' ? 'default' : 'outline'}
                            className={update.changeType === 'amended' ? 'border-civic-gold text-civic-gold' : ''}
                          >
                            {update.changeType}
                          </Badge>
                        </div>
                        {update.effectiveDate && (
                          <div className="text-xs text-muted-foreground">
                            Effective: {new Date(update.effectiveDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <h3 className="text-luxury text-xl font-semibold text-foreground mb-3">
                        {update.title}
                      </h3>

                      <p className="text-political text-muted-foreground mb-4 leading-relaxed">
                        {update.description}
                      </p>

                      {update.summary && (
                        <div className="mb-4">
                          <h4 className="text-political font-semibold text-foreground mb-2">Summary</h4>
                          <p className="text-sm text-muted-foreground">
                            {update.summary}
                          </p>
                        </div>
                      )}

                      {update.impactAnalysis && (
                        <div className="mb-4">
                          <h4 className="text-political font-semibold text-foreground mb-2">Impact Analysis</h4>
                          <p className="text-sm text-muted-foreground">
                            {update.impactAnalysis}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          Reference: {update.legalReference}
                        </div>
                        {update.sourceUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={update.sourceUrl} target="_blank" rel="noopener noreferrer">
                              <Globe className="w-3 h-3 mr-1" />
                              View Source
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid gap-6">
              {filteredServices.length === 0 ? (
                <Card className="border-none shadow-lg glass-card">
                  <CardContent className="p-8 text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-luxury text-lg font-semibold text-foreground mb-2">
                      {searchQuery ? "No Services Found" : "Government Services"}
                    </h3>
                    <p className="text-political text-muted-foreground">
                      {searchQuery 
                        ? "Try adjusting your search terms to find relevant government services."
                        : "Comprehensive directory of Canadian government services with contact information."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredServices.map((service: any) => (
                    <Card key={service.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 glass-card">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-luxury text-lg font-semibold text-foreground">
                              {service.serviceName}
                            </CardTitle>
                            <p className="text-political text-sm text-muted-foreground mt-1">
                              {service.department}
                            </p>
                          </div>
                          <Badge 
                            variant="outline"
                            className={`
                              ${service.jurisdiction === 'federal' ? 'border-civic-blue text-civic-blue' : ''}
                              ${service.jurisdiction === 'provincial' ? 'border-civic-green text-civic-green' : ''}
                              ${service.jurisdiction === 'municipal' ? 'border-civic-purple text-civic-purple' : ''}
                            `}
                          >
                            {service.jurisdiction}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-political text-sm text-muted-foreground mb-4 leading-relaxed">
                          {service.description}
                        </p>

                        <div className="space-y-3">
                          {service.phoneNumber && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-civic-blue" />
                              <a 
                                href={`tel:${service.phoneNumber}`}
                                className="text-sm text-civic-blue hover:underline"
                              >
                                {service.phoneNumber}
                              </a>
                            </div>
                          )}

                          {service.websiteUrl && (
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4 text-civic-green" />
                              <a 
                                href={service.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-civic-green hover:underline"
                              >
                                Visit Website
                              </a>
                            </div>
                          )}

                          {service.physicalAddress && (
                            <div className="flex items-start space-x-2">
                              <MapPin className="w-4 h-4 text-civic-purple mt-0.5" />
                              <span className="text-sm text-muted-foreground">
                                {service.physicalAddress}
                              </span>
                            </div>
                          )}

                          {service.hoursOfOperation && (
                            <div className="flex items-start space-x-2">
                              <Clock className="w-4 h-4 text-civic-gold mt-0.5" />
                              <span className="text-sm text-muted-foreground">
                                {service.hoursOfOperation}
                              </span>
                            </div>
                          )}
                        </div>

                        {service.fees && (
                          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                            <h4 className="text-political font-semibold text-foreground text-sm mb-1">Fees</h4>
                            <p className="text-xs text-muted-foreground">
                              {service.fees}
                            </p>
                          </div>
                        )}

                        {service.processingTime && (
                          <div className="mt-3">
                            <span className="text-xs text-muted-foreground">
                              Processing time: {service.processingTime}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex space-x-2">
                            {service.onlineAccessible && (
                              <Badge variant="secondary" className="text-xs">
                                Online Available
                              </Badge>
                            )}
                            {service.applicationRequired && (
                              <Badge variant="outline" className="text-xs">
                                Application Required
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Updated: {new Date(service.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}