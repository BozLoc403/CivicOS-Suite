import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CanadianCoatOfArms, CanadianMapleLeaf } from "@/components/CanadianCoatOfArms";
import { 
  Shield, 
  Vote, 
  Users, 
  FileText, 
  Globe,
  CheckCircle,
  ArrowRight,
  Flag,
  Scale,
  MapPin,
  Building,
  Search
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Official Government Header */}
      <header className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Government Banner */}
          <div className="border-b border-red-500 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <span className="flex items-center space-x-2">
                  <CanadianMapleLeaf size="sm" />
                  <span>Government of Canada</span>
                </span>
                <span className="flex items-center space-x-2">
                  <CanadianMapleLeaf size="sm" />
                  <span>Gouvernement du Canada</span>
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="hover:underline">English</button>
                <span>|</span>
                <button className="hover:underline">Français</button>
              </div>
            </div>
          </div>
          
          {/* Main Header */}
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <CanadianCoatOfArms size="md" />
              <div>
                <h1 className="text-2xl font-bold">CivicOS</h1>
                <p className="text-red-100">Canadian Digital Democracy Platform</p>
                <p className="text-red-100 text-sm">Plateforme Démocratique Numérique Canadienne</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-white text-red-600 hover:bg-red-50">
                <CheckCircle className="w-3 h-3 mr-1" />
                Official Platform
              </Badge>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-white text-red-600 hover:bg-red-50 font-semibold"
              >
                Access Platform
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-red-600 text-white px-6 py-2 text-sm font-semibold">
                <Shield className="w-4 h-4 mr-2" />
                Official Government Platform
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Canadian Digital Democracy
            </h1>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-6">
              Démocratie Numérique Canadienne
            </h2>
            
            <p className="text-lg text-gray-700 mb-4 max-w-4xl mx-auto leading-relaxed">
              Access real-time Canadian government data, track parliamentary proceedings, 
              monitor your elected representatives, and engage with democratic processes 
              across federal, provincial, and municipal levels.
            </p>
            
            <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Accédez aux données gouvernementales canadiennes en temps réel, suivez les 
              délibérations parlementaires, surveillez vos représentants élus et participez 
              aux processus démocratiques aux niveaux fédéral, provincial et municipal.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/api/login'}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-semibold"
              >
                Access Platform / Accéder à la Plateforme
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3"
              >
                Learn More / En Savoir Plus
                <FileText className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Government Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-8 border border-gray-200">
              <div className="text-center border-r border-gray-200 last:border-r-0">
                <div className="text-3xl font-bold text-red-600">338</div>
                <div className="text-sm text-gray-600 font-medium">Federal MPs</div>
                <div className="text-xs text-gray-500">Députés fédéraux</div>
              </div>
              <div className="text-center border-r border-gray-200 last:border-r-0">
                <div className="text-3xl font-bold text-red-600">905</div>
                <div className="text-sm text-gray-600 font-medium">Provincial MLAs</div>
                <div className="text-xs text-gray-500">Députés provinciaux</div>
              </div>
              <div className="text-center border-r border-gray-200 last:border-r-0">
                <div className="text-3xl font-bold text-red-600">3,600+</div>
                <div className="text-sm text-gray-600 font-medium">Municipal Officials</div>
                <div className="text-xs text-gray-500">Élus municipaux</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">24/7</div>
                <div className="text-sm text-gray-600 font-medium">Real-time Updates</div>
                <div className="text-xs text-gray-500">Mises à jour</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Government Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Government Services and Information
            </h2>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Services Gouvernementaux et Information
            </h3>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Comprehensive access to Canadian government data, parliamentary proceedings, 
              and democratic engagement tools across federal, provincial, and municipal levels.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Parliament & Legislature</CardTitle>
                <CardDescription className="text-sm">
                  Parlement et Assemblées Législatives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Federal MPs and Senators</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Provincial MLAs</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Voting records & proceedings</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Bills & Legislation</CardTitle>
                <CardDescription className="text-sm">
                  Projets de Loi et Législation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Federal & provincial bills</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Legislative progress tracking</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Public consultation access</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Legal Information</CardTitle>
                <CardDescription className="text-sm">
                  Information Juridique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Canadian legal database</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Court decisions & rulings</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Constitutional resources</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                  <Vote className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Elections & Voting</CardTitle>
                <CardDescription className="text-sm">
                  Élections et Vote
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Election schedules & results</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Voter information</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Electoral district data</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Regional Services</CardTitle>
                <CardDescription className="text-sm">
                  Services Régionaux
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Provincial government data</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Municipal information</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Local representative contacts</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Secure Access</CardTitle>
                <CardDescription className="text-sm">
                  Accès Sécurisé
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Government-grade security</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Privacy protection</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-red-600 mr-2" />Verified identity system</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Official CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Access Your Government Information
          </h2>
          <h3 className="text-2xl font-semibold text-red-100 mb-6">
            Accédez à Vos Informations Gouvernementales
          </h3>
          <p className="text-lg text-red-100 mb-8">
            Connect with your democracy through official government data, representative information, 
            and parliamentary proceedings. All data sourced directly from official Canadian government sources.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-white text-red-600 hover:bg-red-50 px-8 py-3 text-lg font-semibold"
          >
            Access Platform / Accéder à la Plateforme
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Official Footer */}
      <footer className="bg-gray-100 border-t-4 border-red-600 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <CanadianCoatOfArms size="sm" />
                <span className="font-bold text-lg text-gray-900">CivicOS</span>
              </div>
              <p className="text-gray-600 text-sm">
                Official Canadian Digital Democracy Platform<br />
                Plateforme Démocratique Numérique Officielle du Canada
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Government Levels</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Federal Parliament</li>
                <li>Provincial Legislatures</li>
                <li>Municipal Councils</li>
                <li>Electoral Information</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Contact Information</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Accessibility</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Contact</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>CivicOS Platform</p>
                <p>Digital Government Services</p>
                <p>Built by Jordan Kenneth Boisclair</p>
                <p>© 2025 All rights reserved</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-300" />
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-2">
                <Flag className="w-4 h-4 text-red-600" />
                <span>Government of Canada</span>
              </span>
              <span>|</span>
              <span className="flex items-center space-x-2">
                <Flag className="w-4 h-4 text-red-600" />
                <span>Gouvernement du Canada</span>
              </span>
            </div>
            <div className="text-xs">
              © 2025 CivicOS. Built by Jordan Kenneth Boisclair. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}