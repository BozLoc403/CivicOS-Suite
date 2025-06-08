import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, Calendar, Gavel, ExternalLink, Search } from "lucide-react";

export default function CasesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourt, setFilterCourt] = useState("all");

  // Constitutional and landmark Canadian cases
  const constitutionalCases = [
    {
      id: 1,
      caseName: "Reference re Same-Sex Marriage",
      citation: "[2004] 3 S.C.R. 698",
      court: "Supreme Court of Canada",
      dateDecided: "2004-12-09",
      category: "Charter Rights",
      significance: "Constitutional",
      parties: ["Government of Canada"],
      summary: "Reference question on whether Parliament has exclusive jurisdiction to define marriage and whether same-sex marriage violates Charter rights.",
      ruling: "Parliament has exclusive jurisdiction over marriage definition; same-sex marriage does not violate Charter rights.",
      chartereections: ["Section 15 (Equality Rights)"],
      precedentValue: "High",
      currentStatus: "Active precedent",
      implications: [
        "Established constitutional framework for same-sex marriage",
        "Clarified division of powers between federal and provincial governments",
        "Reinforced equality protections under Charter"
      ]
    },
    {
      id: 2,
      caseName: "R. v. Morgentaler",
      citation: "[1988] 1 S.C.R. 30",
      court: "Supreme Court of Canada", 
      dateDecided: "1988-01-28",
      category: "Charter Rights",
      significance: "Constitutional",
      parties: ["Dr. Henry Morgentaler", "Crown"],
      summary: "Challenge to Criminal Code provisions restricting access to abortion services.",
      ruling: "Abortion restrictions under s. 251 of Criminal Code violated Charter rights to life, liberty and security of the person.",
      charterSections: ["Section 7 (Life, Liberty and Security)"],
      precedentValue: "High",
      currentStatus: "Active precedent",
      implications: [
        "Struck down federal abortion restrictions",
        "Established reproductive rights framework",
        "Clarified s. 7 Charter protections"
      ]
    },
    {
      id: 3,
      caseName: "Oakes v. The Queen",
      citation: "[1986] 1 S.C.R. 103",
      court: "Supreme Court of Canada",
      dateDecided: "1986-02-28", 
      category: "Charter Interpretation",
      significance: "Constitutional",
      parties: ["David Edwin Oakes", "Crown"],
      summary: "Established test for determining when Charter rights can be reasonably limited under s. 1.",
      ruling: "Created the Oakes test - a two-part analysis for s. 1 justification of Charter violations.",
      charterSections: ["Section 1 (Reasonable Limits)"],
      precedentValue: "Fundamental",
      currentStatus: "Active precedent - foundational",
      implications: [
        "Created framework for all Charter analysis",
        "Established proportionality test",
        "Fundamental to Canadian constitutional law"
      ]
    },
    {
      id: 4,
      caseName: "Eldridge v. British Columbia",
      citation: "[1997] 3 S.C.R. 624",
      court: "Supreme Court of Canada",
      dateDecided: "1997-10-09",
      category: "Equality Rights",
      significance: "Constitutional", 
      parties: ["Robin Eldridge et al.", "British Columbia"],
      summary: "Challenge to lack of sign language interpretation in medical services for deaf patients.",
      ruling: "Failure to provide sign language interpretation violated equality rights under s. 15 of Charter.",
      charterSections: ["Section 15 (Equality Rights)"],
      precedentValue: "High",
      currentStatus: "Active precedent",
      implications: [
        "Extended equality rights to government-funded services",
        "Established duty to accommodate disabilities",
        "Clarified scope of s. 15 protections"
      ]
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case "Constitutional": return "text-purple-600 bg-purple-50 border-purple-200";
      case "Landmark": return "text-blue-600 bg-blue-50 border-blue-200"; 
      case "Important": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPrecedentColor = (value: string) => {
    switch (value) {
      case "Fundamental": return "text-red-600";
      case "High": return "text-orange-600";
      case "Medium": return "text-blue-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Constitutional Cases</h1>
          <p className="text-muted-foreground mt-2">
            Landmark Supreme Court decisions shaping Canadian law and Charter interpretation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Scale className="w-3 h-3 mr-1" />
            SCC Decisions
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="constitutional" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="constitutional">Constitutional Cases</TabsTrigger>
          <TabsTrigger value="charter">Charter Decisions</TabsTrigger>
          <TabsTrigger value="recent">Recent Rulings</TabsTrigger>
        </TabsList>

        <TabsContent value="constitutional" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search cases, parties, or legal principles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCourt} onValueChange={setFilterCourt}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by court" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courts</SelectItem>
                <SelectItem value="Supreme Court of Canada">Supreme Court of Canada</SelectItem>
                <SelectItem value="Federal Court of Appeal">Federal Court of Appeal</SelectItem>
                <SelectItem value="Provincial Courts of Appeal">Provincial Courts of Appeal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            {constitutionalCases.map((case_) => (
              <Card key={case_.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{case_.caseName}</CardTitle>
                      <CardDescription className="mt-1">
                        {case_.citation} | {case_.court}
                      </CardDescription>
                      <div className="flex items-center space-x-2 mt-3">
                        <Badge className={getSignificanceColor(case_.significance)}>
                          {case_.significance}
                        </Badge>
                        <Badge variant="outline">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(case_.dateDecided)}
                        </Badge>
                        <Badge variant="outline">
                          {case_.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getPrecedentColor(case_.precedentValue)}`}>
                        {case_.precedentValue}
                      </div>
                      <div className="text-sm text-muted-foreground">Precedent Value</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Case Summary</div>
                      <p className="text-sm">{case_.summary}</p>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Court's Ruling</div>
                      <div className="text-sm bg-muted/50 p-3 rounded">
                        {case_.ruling}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Charter Sections</div>
                        <div className="flex flex-wrap gap-1">
                          {case_.charterSections?.map((section, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {section}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Current Status</div>
                        <div className="text-sm font-medium">{case_.currentStatus}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Legal Implications</div>
                      <ul className="text-sm space-y-1">
                        {case_.implications.map((implication, index) => (
                          <li key={index} className="text-muted-foreground">• {implication}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t mt-4">
                    <div className="flex items-center space-x-2">
                      <Gavel className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Parties: {case_.parties.join(" v. ")}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-3 h-3 mr-2" />
                        Full Decision
                      </Button>
                      <Button variant="outline" size="sm">
                        Case Analysis
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="charter" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Charter Rights Jurisprudence</CardTitle>
              <CardDescription>
                Key Supreme Court decisions interpreting Charter of Rights and Freedoms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Scale className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Charter jurisprudence analysis coming soon.</p>
                <p className="text-sm">This will show how Charter rights have evolved through court decisions.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Scale className="w-5 h-5 text-blue-600" />
                  <span>Cases This Year</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">47</div>
                <p className="text-sm text-muted-foreground">
                  Supreme Court decisions in 2024
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gavel className="w-5 h-5 text-green-600" />
                  <span>Charter Challenges</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">12</div>
                <p className="text-sm text-muted-foreground">
                  Charter-based appeals heard
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Pending Appeals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">89</div>
                <p className="text-sm text-muted-foreground">
                  Cases awaiting hearing
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}