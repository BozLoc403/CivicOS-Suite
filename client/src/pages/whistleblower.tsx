import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Shield, Lock, FileText, Users, Phone, Mail, Globe } from "lucide-react";

export default function WhistleblowerPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Canadian whistleblower protections and cases
  const protectionLaws = [
    {
      id: 1,
      title: "Public Servants Disclosure Protection Act",
      jurisdiction: "Federal",
      year: 2007,
      coverage: "Federal public servants",
      protections: [
        "Protection from reprisal for disclosing wrongdoing",
        "Anonymous disclosure options",
        "Investigation by Public Sector Integrity Commissioner",
        "Remedial measures for victims of reprisal"
      ],
      limitations: [
        "Limited to federal public service",
        "No monetary compensation for damages",
        "Complex investigation process"
      ],
      recentCases: 12,
      successRate: 23
    },
    {
      id: 2,
      title: "Criminal Code Whistleblower Protections",
      jurisdiction: "Federal",
      year: 2004,
      coverage: "Corporate employees reporting securities violations",
      protections: [
        "Protection from employer retaliation",
        "Criminal penalties for retaliation",
        "Job reinstatement rights"
      ],
      limitations: [
        "Limited to securities and financial crimes",
        "Must report to designated authorities",
        "High burden of proof"
      ],
      recentCases: 8,
      successRate: 45
    },
    {
      id: 3,
      title: "Ontario Public Service Act",
      jurisdiction: "Ontario",
      year: 2006,
      coverage: "Ontario public servants",
      protections: [
        "Protection from disciplinary action",
        "Anonymous reporting mechanisms", 
        "Investigation by Integrity Commissioner",
        "Workplace restoration measures"
      ],
      limitations: [
        "Provincial jurisdiction only",
        "Limited remedial powers",
        "No financial compensation"
      ],
      recentCases: 34,
      successRate: 31
    }
  ];

  const reportingChannels = [
    {
      id: 1,
      name: "Public Sector Integrity Commissioner",
      type: "Federal Agency",
      jurisdiction: "Federal Government",
      contact: {
        phone: "1-866-941-6400",
        email: "info@psic-ispc.gc.ca",
        website: "psic-ispc.gc.ca",
        address: "60 East Block, Parliament Hill"
      },
      mandate: "Investigate wrongdoing in federal public sector",
      anonymousReporting: true,
      languages: ["English", "French"],
      responseTime: "30 days initial assessment"
    },
    {
      id: 2,
      name: "RCMP National Security Information Network",
      type: "Law Enforcement",
      jurisdiction: "National",
      contact: {
        phone: "1-800-420-5805",
        email: "nsin-rnsn@rcmp-grc.gc.ca",
        website: "rcmp-grc.gc.ca",
        address: "RCMP National Headquarters"
      },
      mandate: "National security and criminal matters",
      anonymousReporting: true,
      languages: ["English", "French"],
      responseTime: "Immediate for urgent matters"
    },
    {
      id: 3,
      name: "Ethics Commissioner (Parliament)",
      type: "Parliamentary Officer",
      jurisdiction: "Parliament",
      contact: {
        phone: "613-995-0721",
        email: "cse-cce@parl.gc.ca",
        website: "cse-cce.parl.gc.ca",
        address: "Centre Block, Parliament Hill"
      },
      mandate: "MP and Minister conflict of interest",
      anonymousReporting: false,
      languages: ["English", "French"],
      responseTime: "60 days for investigations"
    }
  ];

  const securityGuidelines = [
    {
      title: "Digital Security",
      icon: Shield,
      measures: [
        "Use Tor browser for anonymous browsing",
        "Communicate through encrypted messaging apps",
        "Use VPN services to hide location",
        "Create anonymous email accounts"
      ]
    },
    {
      title: "Document Protection",
      icon: FileText,
      measures: [
        "Make copies of all evidence before reporting",
        "Store documents in secure, encrypted locations",
        "Don't access sensitive files from work computers",
        "Use personal devices for whistleblowing activities"
      ]
    },
    {
      title: "Legal Preparation",
      icon: Users,
      measures: [
        "Consult with employment lawyer before proceeding",
        "Understand your organization's internal policies",
        "Document any retaliation attempts",
        "Keep detailed records of all communications"
      ]
    },
    {
      title: "Personal Safety",
      icon: AlertTriangle,
      measures: [
        "Inform trusted family members of your situation",
        "Maintain normal work routines initially",
        "Avoid discussing plans with colleagues",
        "Consider timing of disclosure carefully"
      ]
    }
  ];

  const formatSuccessRate = (rate: number) => {
    if (rate < 30) return { color: "text-red-600", label: "Low" };
    if (rate < 60) return { color: "text-yellow-600", label: "Moderate" };
    return { color: "text-green-600", label: "High" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Whistleblower Protection Portal</h1>
          <p className="text-muted-foreground mt-2">
            Secure reporting channels and legal protections for exposing government wrongdoing
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Protected Disclosure
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Shield className="w-3 h-3 mr-1" />
            Legal Protection
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="protections" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="protections">Legal Protections</TabsTrigger>
          <TabsTrigger value="reporting">Reporting Channels</TabsTrigger>
          <TabsTrigger value="security">Security Guide</TabsTrigger>
          <TabsTrigger value="submit">Secure Submission</TabsTrigger>
        </TabsList>

        <TabsContent value="protections" className="space-y-6">
          <div className="grid gap-6">
            {protectionLaws.map((law) => (
              <Card key={law.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{law.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {law.jurisdiction} • Enacted {law.year} • Covers: {law.coverage}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${formatSuccessRate(law.successRate).color}`}>
                        {law.successRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Legal Protections</div>
                      <ul className="text-sm space-y-1">
                        {law.protections.map((protection, index) => (
                          <li key={index} className="text-muted-foreground flex items-start">
                            <Shield className="w-3 h-3 mr-2 mt-1 text-green-500 flex-shrink-0" />
                            {protection}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Limitations</div>
                      <ul className="text-sm space-y-1">
                        {law.limitations.map((limitation, index) => (
                          <li key={index} className="text-muted-foreground flex items-start">
                            <AlertTriangle className="w-3 h-3 mr-2 mt-1 text-yellow-500 flex-shrink-0" />
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Recent Cases</div>
                        <div className="text-2xl font-bold text-blue-600">{law.recentCases}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Protection Effectiveness</div>
                        <div className={`text-sm font-medium ${formatSuccessRate(law.successRate).color}`}>
                          {formatSuccessRate(law.successRate).label}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reporting" className="space-y-6">
          <div className="grid gap-6">
            {reportingChannels.map((channel) => (
              <Card key={channel.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{channel.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {channel.type} • {channel.jurisdiction}
                      </CardDescription>
                      <div className="flex items-center space-x-2 mt-3">
                        <Badge variant={channel.anonymousReporting ? "default" : "secondary"}>
                          {channel.anonymousReporting ? (
                            <>
                              <Lock className="w-3 h-3 mr-1" />
                              Anonymous Reporting
                            </>
                          ) : (
                            "Identity Required"
                          )}
                        </Badge>
                        <Badge variant="outline">
                          Response: {channel.responseTime}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Mandate</div>
                      <p className="text-sm">{channel.mandate}</p>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Contact Information</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{channel.contact.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{channel.contact.email}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <span>{channel.contact.website}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {channel.contact.address}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Languages</div>
                        <div className="flex space-x-1">
                          {channel.languages.map((language, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Anonymous Reporting</div>
                        <div className="text-sm">
                          {channel.anonymousReporting ? "Available" : "Not Available"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t mt-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Official Government Channel
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Visit Website
                      </Button>
                      <Button variant="outline" size="sm">
                        Contact Info
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityGuidelines.map((guideline, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <guideline.icon className="w-5 h-5 text-blue-600" />
                    <span>{guideline.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {guideline.measures.map((measure, measureIndex) => (
                      <li key={measureIndex} className="text-sm flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {measure}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Important Security Warning</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-yellow-800 space-y-2 text-sm">
                <p>• Never use your work computer or network to research whistleblowing</p>
                <p>• Assume all workplace communications are monitored</p>
                <p>• Consider consulting a lawyer before making any disclosure</p>
                <p>• Document everything but store evidence securely</p>
                <p>• Be prepared for potential retaliation despite legal protections</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Secure Anonymous Submission</CardTitle>
              <CardDescription>
                Submit evidence of government wrongdoing through encrypted channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Maximum Security Portal</p>
                <p className="text-sm mb-4">End-to-end encrypted submission with complete anonymity</p>
                <div className="space-y-2 text-sm">
                  <p>• Zero-knowledge encryption</p>
                  <p>• No IP logging or tracking</p>
                  <p>• Self-destructing messages</p>
                  <p>• Legal protection coordination</p>
                </div>
                <div className="flex space-x-4 justify-center mt-6">
                  <Button variant="default">
                    <Shield className="w-4 h-4 mr-2" />
                    Secure Upload
                  </Button>
                  <Button variant="outline">
                    <Lock className="w-4 h-4 mr-2" />
                    Anonymous Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}