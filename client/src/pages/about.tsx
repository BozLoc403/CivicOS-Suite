import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CanadianMapleLeaf } from "@/components/CanadianCoatOfArms";
import canadianCrest from "@assets/ChatGPT Image Jun 20, 2025, 06_03_54 PM_1750464244456.png";
import { 
  Shield, 
  Eye, 
  Users, 
  FileText, 
  Vote, 
  Search,
  Database,
  MessageSquare,
  Calendar,
  TrendingUp,
  Globe,
  Lock,
  CheckCircle,
  ArrowRight,
  Target,
  Heart,
  Lightbulb
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <img 
                src={canadianCrest} 
                alt="CivicOS Heraldic Crest" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">CivicOS</h1>
                <p className="text-sm text-gray-600 font-medium">Digital Democracy Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Back to Home
              </Button>
              <Button 
                onClick={() => window.location.href = '/login'}
                className="bg-red-600 text-white hover:bg-red-700 font-semibold px-8 py-3 rounded-lg"
              >
                Access Platform
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Coat of Arms */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.015]">
          <img 
            src={canadianCrest} 
            alt="Background emblem" 
            className="w-[600px] h-[600px] object-contain"
          />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-8 py-4 bg-red-600 border-2 border-red-700 text-white rounded-xl text-sm font-bold mb-10 shadow-lg">
            <Shield className="w-6 h-6 mr-3" />
            INDEPENDENT GOVERNMENT ACCOUNTABILITY PLATFORM
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight leading-tight">
            About CivicOS
          </h1>
          
          <p className="text-2xl font-semibold text-gray-800 mb-12 leading-relaxed max-w-3xl mx-auto">
            Canada's premier independent platform for government accountability and democratic transparency. 
            Providing citizens with real-time access to political data and enabling informed civic engagement 
            across all levels of Canadian government.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-4xl font-black text-red-600 mb-3">85,000+</div>
              <div className="text-sm font-bold text-gray-700 uppercase tracking-wide">Politicians Tracked</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-4xl font-black text-red-600 mb-3">24/7</div>
              <div className="text-sm font-bold text-gray-700 uppercase tracking-wide">Real-time Updates</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-4xl font-black text-red-600 mb-3">100%</div>
              <div className="text-sm font-bold text-gray-700 uppercase tracking-wide">Independent</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-4xl font-black text-red-600 mb-3">3</div>
              <div className="text-sm font-bold text-gray-700 uppercase tracking-wide">Government Levels</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center shadow-xl border-2 border-gray-200">
              <CardHeader>
                <Target className="w-14 h-14 text-red-600 mx-auto mb-6" />
                <CardTitle className="text-2xl font-black tracking-tight">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed font-semibold">
                  To strengthen Canadian democracy by providing transparent, accessible, and authentic government data 
                  to all citizens, enabling informed civic participation and accountability.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-xl border-2 border-gray-200">
              <CardHeader>
                <Eye className="w-14 h-14 text-red-600 mx-auto mb-6" />
                <CardTitle className="text-2xl font-black tracking-tight">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed font-semibold">
                  A Canada where every citizen has immediate access to government information, where transparency 
                  is the norm, and where democratic engagement is enhanced through technology.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-xl border-2 border-gray-200">
              <CardHeader>
                <Heart className="w-14 h-14 text-red-600 mx-auto mb-6" />
                <CardTitle className="text-2xl font-black tracking-tight">Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed font-semibold">
                  Independence, transparency, authenticity, and accessibility. We believe in empowering citizens 
                  with factual information to make informed democratic choices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Platform Features</h2>
            <p className="text-xl font-semibold text-gray-700 max-w-3xl mx-auto">
              Comprehensive tools for government accountability and democratic engagement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle>Politicians Database</CardTitle>
                <CardDescription>
                  Complete profiles of 85,000+ Canadian politicians across federal, provincial, and municipal levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Contact information and office details</li>
                  <li>• Voting records and legislative history</li>
                  <li>• Trust scores and performance metrics</li>
                  <li>• Public statements and positions</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <FileText className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle>Bills & Legislation</CardTitle>
                <CardDescription>
                  Real-time tracking of parliamentary bills, voting records, and legislative progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• AI-powered bill summaries</li>
                  <li>• Voting breakdowns by party and MP</li>
                  <li>• Legislative impact analysis</li>
                  <li>• Bill status and timeline tracking</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle>News Analysis</CardTitle>
                <CardDescription>
                  Comprehensive analysis of Canadian political news with bias detection and fact-checking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Multi-source news aggregation</li>
                  <li>• Bias and credibility ratings</li>
                  <li>• Cross-reference verification</li>
                  <li>• Trend analysis and insights</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Vote className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle>Civic Engagement</CardTitle>
                <CardDescription>
                  Tools for democratic participation including petitions, voting, and community discussions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Public petition platform</li>
                  <li>• Civic voting and polls</li>
                  <li>• Community forums</li>
                  <li>• Direct representative contact</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Database className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle>Legal Database</CardTitle>
                <CardDescription>
                  Complete Canadian legal framework including Criminal Code, court cases, and legal precedents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Criminal Code sections</li>
                  <li>• Supreme Court decisions</li>
                  <li>• Legal precedent tracking</li>
                  <li>• Searchable case database</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Calendar className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle>Elections</CardTitle>
                <CardDescription>
                  Comprehensive election data, results, and upcoming electoral information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Historical election results</li>
                  <li>• Upcoming election schedules</li>
                  <li>• Candidate information</li>
                  <li>• Electoral district mapping</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology & Security */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Technology & Security</h2>
            <p className="text-xl font-semibold text-gray-700 max-w-3xl mx-auto">
              Built with cutting-edge technology and enterprise-grade security
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <Lightbulb className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle>AI-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>OpenAI GPT-4o for content analysis and summarization</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Anthropic Claude for legal document processing</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Truth scoring and propaganda detection algorithms</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Real-time content verification and cross-referencing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Lock className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle>Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Enterprise-grade encryption and data protection</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Multi-factor authentication and identity verification</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>PostgreSQL database with connection pooling</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Regular security audits and compliance monitoring</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Authentic Data Sources</h2>
            <p className="text-xl font-semibold text-gray-700 max-w-3xl mx-auto">
              All data sourced directly from official Canadian government sources
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <Globe className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Federal Sources</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Parliament of Canada</li>
                <li>Elections Canada</li>
                <li>Statistics Canada</li>
                <li>Government of Canada Open Data</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <Globe className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Provincial Sources</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>All 10 Provincial Legislatures</li>
                <li>3 Territorial Assemblies</li>
                <li>Provincial Election Authorities</li>
                <li>Open Government Portals</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <Globe className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Municipal Sources</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Major City Councils</li>
                <li>Municipal Election Data</li>
                <li>Public Meeting Records</li>
                <li>Municipal Open Data</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Independence Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-yellow-50 border-t-4 border-yellow-400">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-sm font-bold mb-6">
            <Shield className="w-5 h-5 mr-3" />
            INDEPENDENCE STATEMENT
          </div>
          
          <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
            Complete Independence from Government
          </h2>
          
          <div className="prose prose-xl max-w-none text-gray-800">
            <p className="mb-6 font-semibold text-lg leading-relaxed">
              CivicOS is a completely independent platform with <strong className="text-red-600">no affiliation</strong> to any level of 
              Canadian government. We are not funded by, controlled by, or associated with any government entity, 
              political party, or special interest group.
            </p>
            
            <p className="mb-6 font-semibold text-lg leading-relaxed">
              Our independence ensures that we can provide unbiased, factual information about government activities 
              without political influence or agenda. We maintain editorial independence and technical autonomy to 
              serve the public interest.
            </p>
            
            <p className="text-base font-bold text-yellow-800 bg-yellow-100 p-4 rounded-lg border border-yellow-300">
              Built by Jordan Kenneth Boisclair • Independent Canadian Developer • Not affiliated with any government
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-red-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-8 tracking-tight">
            Join the Democratic Revolution
          </h2>
          <p className="text-2xl font-semibold text-red-100 mb-12 leading-relaxed max-w-4xl mx-auto">
            Become part of Canada's most comprehensive government accountability platform. 
            Access real-time data, engage with democracy, and hold your representatives accountable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/login'}
              className="bg-white text-red-600 hover:bg-red-50 px-10 py-4 text-lg font-bold rounded-lg shadow-lg"
            >
              Access Platform Now
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
            <Button 
              size="lg"
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-10 py-4 text-lg font-semibold rounded-lg"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}