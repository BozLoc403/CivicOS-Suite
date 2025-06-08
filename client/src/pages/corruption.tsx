import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, TrendingDown, AlertTriangle, Search, DollarSign, Users, Building, Eye } from "lucide-react";

export default function CorruptionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPattern, setFilterPattern] = useState("all");

  // Government corruption patterns and cases
  const corruptionPatterns = [
    {
      id: 1,
      patternName: "Procurement Kickback Schemes",
      category: "Contract Fraud",
      frequency: "High",
      riskLevel: "Critical",
      description: "Companies inflate contract prices and share profits with government officials who award the contracts.",
      commonIndicators: [
        "Sole-source contracts without justification",
        "Unusually high contract values for simple services",
        "Frequent contract amendments increasing value",
        "Same companies winning multiple contracts",
        "Officials with unexplained wealth"
      ],
      recentCases: [
        {
          name: "ArriveCAN App Scandal",
          amount: 54000000,
          year: 2022,
          status: "Under Investigation"
        },
        {
          name: "Federal IT Services Contracts",
          amount: 25000000,
          year: 2023,
          status: "Charges Laid"
        }
      ],
      preventionMeasures: [
        "Mandatory competitive bidding for contracts over $25,000",
        "Independent oversight of procurement processes",
        "Public disclosure of all contract details",
        "Regular audits of contractor performance"
      ],
      estimatedLoss: 250000000
    },
    {
      id: 2,
      patternName: "Regulatory Capture",
      category: "Influence Peddling",
      frequency: "Medium",
      riskLevel: "High",
      description: "Industries gain excessive influence over government agencies that regulate them, leading to policies favoring industry over public interest.",
      commonIndicators: [
        "Revolving door between industry and regulators",
        "Weak enforcement of existing regulations",
        "Industry-friendly policy changes",
        "Limited public consultation on new rules",
        "Regulators with financial ties to regulated industries"
      ],
      recentCases: [
        {
          name: "Telecommunications Regulation Conflicts",
          amount: 500000000,
          year: 2021,
          status: "Policy Review"
        },
        {
          name: "Pipeline Approval Process Issues",
          amount: 750000000,
          year: 2020,
          status: "Court Challenge"
        }
      ],
      preventionMeasures: [
        "Cooling-off periods for regulators joining industry",
        "Transparent conflict of interest declarations",
        "Independent oversight of regulatory decisions",
        "Enhanced public participation in rule-making"
      ],
      estimatedLoss: 1200000000
    },
    {
      id: 3,
      patternName: "Political Expense Fraud",
      category: "Misuse of Public Funds",
      frequency: "Medium",
      riskLevel: "High",
      description: "Politicians and political parties misuse public funds for personal or partisan purposes through fraudulent expense claims.",
      commonIndicators: [
        "Vague or missing receipts for large expenses",
        "Personal items claimed as business expenses",
        "Family members on government payroll without clear duties",
        "Unusual travel patterns or destinations",
        "Office expenses for non-office activities"
      ],
      recentCases: [
        {
          name: "Senate Expense Scandal",
          amount: 977000,
          year: 2019,
          status: "Concluded"
        },
        {
          name: "MP Housing Allowance Misuse",
          amount: 380000,
          year: 2023,
          status: "Under Review"
        }
      ],
      preventionMeasures: [
        "Real-time expense monitoring systems",
        "Independent review of all claims over $1,000",
        "Public disclosure of all political expenses",
        "Clear guidelines on allowable expenses"
      ],
      estimatedLoss: 15000000
    },
    {
      id: 4,
      patternName: "Grant and Subsidy Manipulation",
      category: "Program Abuse",
      frequency: "High",
      riskLevel: "High",
      description: "Government grants and subsidies directed to politically connected organizations or businesses without proper oversight.",
      commonIndicators: [
        "Grants to organizations with political connections",
        "Weak application review processes",
        "Lack of performance monitoring",
        "Repeated funding to same organizations",
        "Grants that don't meet program objectives"
      ],
      recentCases: [
        {
          name: "WE Charity Controversy",
          amount: 912000000,
          year: 2020,
          status: "Program Cancelled"
        },
        {
          name: "Green Technology Fund Misuse",
          amount: 156000000,
          year: 2022,
          status: "Under Investigation"
        }
      ],
      preventionMeasures: [
        "Independent review panels for large grants",
        "Public database of all grant recipients",
        "Regular audits of grant program outcomes",
        "Clear conflict of interest guidelines"
      ],
      estimatedLoss: 1800000000
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Critical": return "text-red-600 bg-red-50 border-red-200";
      case "High": return "text-orange-600 bg-orange-50 border-orange-200";
      case "Medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalEstimatedLoss = corruptionPatterns.reduce((sum, pattern) => sum + pattern.estimatedLoss, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Corruption Pattern Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Systematic analysis of government corruption patterns, indicators, and prevention strategies
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <Activity className="w-3 h-3 mr-1" />
            Pattern Detection
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <TrendingDown className="w-3 h-3 mr-1" />
            {formatCurrency(totalEstimatedLoss)} Lost
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="patterns" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patterns">Corruption Patterns</TabsTrigger>
          <TabsTrigger value="indicators">Warning Indicators</TabsTrigger>
          <TabsTrigger value="prevention">Prevention Strategies</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search corruption patterns, cases, or indicators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterPattern} onValueChange={setFilterPattern}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by pattern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patterns</SelectItem>
                <SelectItem value="Contract Fraud">Contract Fraud</SelectItem>
                <SelectItem value="Influence Peddling">Influence Peddling</SelectItem>
                <SelectItem value="Misuse of Public Funds">Misuse of Public Funds</SelectItem>
                <SelectItem value="Program Abuse">Program Abuse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            {corruptionPatterns.map((pattern) => (
              <Card key={pattern.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{pattern.patternName}</CardTitle>
                      <CardDescription className="mt-1">
                        {pattern.category} • {pattern.description}
                      </CardDescription>
                      <div className="flex items-center space-x-2 mt-3">
                        <Badge className={getRiskColor(pattern.riskLevel)}>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {pattern.riskLevel} Risk
                        </Badge>
                        <Badge variant="outline" className={getFrequencyColor(pattern.frequency)}>
                          Frequency: {pattern.frequency}
                        </Badge>
                        <Badge variant="outline">
                          {pattern.recentCases.length} Recent Cases
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(pattern.estimatedLoss)}
                      </div>
                      <div className="text-sm text-muted-foreground">Estimated Annual Loss</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Common Indicators</div>
                      <ul className="text-sm space-y-1">
                        {pattern.commonIndicators.map((indicator, index) => (
                          <li key={index} className="text-muted-foreground flex items-start">
                            <Eye className="w-3 h-3 mr-2 mt-1 text-orange-500 flex-shrink-0" />
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Recent Cases</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pattern.recentCases.map((case_, index) => (
                          <div key={index} className="bg-muted/50 p-3 rounded">
                            <div className="font-medium text-sm">{case_.name}</div>
                            <div className="text-xs text-muted-foreground mb-1">
                              {case_.year} • {case_.status}
                            </div>
                            <div className="text-lg font-bold text-red-600">
                              {formatCurrency(case_.amount)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Prevention Measures</div>
                      <ul className="text-sm space-y-1">
                        {pattern.preventionMeasures.slice(0, 3).map((measure, index) => (
                          <li key={index} className="text-muted-foreground">• {measure}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t mt-4">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {pattern.category} Pattern • Active Monitoring
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Report Instance
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="indicators" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-red-600" />
                  <span>Financial Red Flags</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Unexplained wealth of public officials</li>
                  <li>• Unusual cash transactions or payments</li>
                  <li>• Inflated contract prices without justification</li>
                  <li>• Frequent budget overruns on projects</li>
                  <li>• Missing or incomplete financial records</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-orange-600" />
                  <span>Procurement Warning Signs</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Sole-source contracts without justification</li>
                  <li>• Specifications written for specific vendors</li>
                  <li>• Rushed procurement processes</li>
                  <li>• Limited competition or bidding</li>
                  <li>• Close relationships between officials and vendors</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Personnel Indicators</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Rapid lifestyle changes of public officials</li>
                  <li>• Resistance to transparency measures</li>
                  <li>• Frequent interactions with industry representatives</li>
                  <li>• Employment of family members without merit</li>
                  <li>• Reluctance to follow established procedures</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span>Process Vulnerabilities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Weak internal controls and oversight</li>
                  <li>• Lack of segregation of duties</li>
                  <li>• Inadequate record keeping</li>
                  <li>• Limited public access to information</li>
                  <li>• Insufficient audit and monitoring</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="prevention" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>Detected Patterns</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">47</div>
                <p className="text-sm text-muted-foreground">
                  Corruption patterns identified
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>High-Risk Areas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 mb-2">12</div>
                <p className="text-sm text-muted-foreground">
                  Government departments flagged
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <span>Prevention Success</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">67%</div>
                <p className="text-sm text-muted-foreground">
                  Reduction in detected fraud
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Comprehensive Prevention Framework</CardTitle>
              <CardDescription>
                Multi-layered approach to preventing government corruption
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Institutional Measures</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Independent anti-corruption agencies</li>
                    <li>• Transparent procurement processes</li>
                    <li>• Regular auditing and oversight</li>
                    <li>• Whistleblower protection programs</li>
                    <li>• Conflict of interest regulations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Technology Solutions</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Real-time monitoring systems</li>
                    <li>• Public disclosure databases</li>
                    <li>• Digital audit trails</li>
                    <li>• AI-powered pattern detection</li>
                    <li>• Blockchain for contract transparency</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}