import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import canadianCrest from "@assets/ChatGPT Image Jun 20, 2025, 06_03_54 PM_1750464244456.png";
import { Shield, Lock, Eye, Database, ArrowRight, Calendar, Mail } from "lucide-react";

export default function Privacy() {
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
                <p className="text-sm text-gray-600 font-medium">Privacy Policy</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => window.location.href = '/about'}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Back to About
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-red-600 text-white hover:bg-red-700 font-semibold px-6 py-3 rounded-lg"
              >
                Home
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg text-sm font-bold mb-6">
            <Lock className="w-5 h-5 mr-3" />
            PRIVACY POLICY
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Your Privacy Matters
          </h1>
          <p className="text-xl font-semibold text-gray-700 max-w-3xl mx-auto">
            Complete transparency about how we collect, use, and protect your personal information
          </p>
          <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Effective: June 21, 2025</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>Last Updated: June 21, 2025</span>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-xl font-black text-blue-900">Privacy Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-blue-800 font-semibold">
              <li>• We collect minimal personal information required for platform functionality</li>
              <li>• Your data is never sold, shared, or used for advertising purposes</li>
              <li>• All data is encrypted and stored securely in Canada</li>
              <li>• You have complete control over your data and can delete your account anytime</li>
              <li>• We comply with all Canadian privacy laws including PIPEDA</li>
            </ul>
          </CardContent>
        </Card>

        {/* 1. Information We Collect */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">1. Information We Collect</h2>
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center">
                <Database className="w-5 h-5 mr-2 text-red-600" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700 font-medium">
                <li><strong>Required:</strong> Email address, chosen username, encrypted password</li>
                <li><strong>Optional:</strong> First name, last name, profile picture</li>
                <li><strong>Verification:</strong> Government ID (if choosing identity verification), encrypted and stored separately</li>
                <li><strong>Authentication:</strong> Multi-factor authentication tokens (encrypted)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center">
                <Eye className="w-5 h-5 mr-2 text-red-600" />
                Usage Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700 font-medium">
                <li><strong>Platform Activity:</strong> Pages visited, features used, voting records, comments posted</li>
                <li><strong>Technical Data:</strong> IP address (anonymized after 30 days), browser type, device information</li>
                <li><strong>Security Logs:</strong> Login attempts, failed authentication, suspicious activity</li>
                <li><strong>Performance:</strong> Page load times, error reports (no personal data included)</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 2. How We Use Your Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">2. How We Use Your Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-green-700">Permitted Uses</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700 font-medium">
                  <li>• Provide platform services and features</li>
                  <li>• Authenticate your identity and prevent fraud</li>
                  <li>• Send important security and service updates</li>
                  <li>• Improve platform performance and functionality</li>
                  <li>• Comply with legal obligations</li>
                  <li>• Provide customer support</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-red-700">Prohibited Uses</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700 font-medium">
                  <li>• Selling your data to third parties</li>
                  <li>• Advertising or marketing purposes</li>
                  <li>• Political profiling or targeting</li>
                  <li>• Sharing with government agencies (except legal requirements)</li>
                  <li>• Creating user profiles for external use</li>
                  <li>• Any commercial exploitation of your data</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 3. Data Sharing and Disclosure */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">3. Data Sharing and Disclosure</h2>
          
          <Card className="border-2 border-red-200 bg-red-50 mb-4">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-red-800">Zero Third-Party Sharing Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-800 font-semibold">
                CivicOS does not share, sell, rent, or otherwise distribute your personal information to any third parties, 
                except in the limited circumstances outlined below.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Legal Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 font-medium">
                  We may disclose personal information only when legally required by:
                </p>
                <ul className="mt-2 space-y-1 text-gray-700 font-medium ml-4">
                  <li>• Valid court orders or subpoenas</li>
                  <li>• Law enforcement requests with proper legal authority</li>
                  <li>• Emergency situations involving imminent threat to life or safety</li>
                  <li>• Compliance with Canadian federal or provincial privacy laws</li>
                </ul>
                <p className="mt-3 text-sm font-semibold text-gray-600">
                  In all cases, we will challenge overbroad requests and notify users when legally permitted.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Service Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 font-medium">
                  Limited technical service providers with strict data protection agreements:
                </p>
                <ul className="mt-2 space-y-1 text-gray-700 font-medium ml-4">
                  <li>• Database hosting (Neon - encrypted storage in Canada)</li>
                  <li>• Authentication services (encrypted tokens only)</li>
                  <li>• Security monitoring (anonymized logs only)</li>
                </ul>
                <p className="mt-3 text-sm font-semibold text-gray-600">
                  All service providers are contractually bound to Canadian privacy standards.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 4. Data Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">4. Data Security</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Technical Safeguards</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700 font-medium">
                  <li>• AES-256 encryption for all data at rest</li>
                  <li>• TLS 1.3 encryption for all data in transit</li>
                  <li>• Encrypted database connections with certificate pinning</li>
                  <li>• Multi-factor authentication requirements</li>
                  <li>• Regular security audits and penetration testing</li>
                  <li>• Automated threat detection and monitoring</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Operational Safeguards</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700 font-medium">
                  <li>• Access controls with role-based permissions</li>
                  <li>• Employee background checks and NDAs</li>
                  <li>• Regular security training and awareness</li>
                  <li>• Incident response and breach notification procedures</li>
                  <li>• Data backup and disaster recovery plans</li>
                  <li>• Physical security at data centers</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 5. Your Rights and Controls */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">5. Your Rights and Controls</h2>
          
          <Card className="border-2 border-green-200 bg-green-50 mb-4">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-green-800">Complete Data Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800 font-semibold">
                You have complete control over your personal information. We provide easy-to-use tools 
                for accessing, modifying, and deleting your data at any time.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Data Access Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700 font-medium">
                  <li>• View all personal data we have collected</li>
                  <li>• Download your data in portable formats</li>
                  <li>• See how your data is being used</li>
                  <li>• Review your account activity and history</li>
                  <li>• Access data processing logs</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Data Control Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700 font-medium">
                  <li>• Update or correct your information</li>
                  <li>• Delete specific data or your entire account</li>
                  <li>• Control notification preferences</li>
                  <li>• Manage privacy settings</li>
                  <li>• Revoke consent for optional data collection</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 6. Data Retention */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">6. Data Retention</h2>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Active Accounts</h4>
                  <p className="text-gray-700 font-medium">Personal data retained while account is active and for legitimate business purposes.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Closed Accounts</h4>
                  <p className="text-gray-700 font-medium">All personal data deleted within 30 days of account closure, except as required by law.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Anonymous Data</h4>
                  <p className="text-gray-700 font-medium">Aggregated, anonymized usage statistics may be retained indefinitely for platform improvement.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Legal Obligations</h4>
                  <p className="text-gray-700 font-medium">Some data may be retained longer when required by Canadian law or valid legal process.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 7. Children's Privacy */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">7. Children's Privacy</h2>
          
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <p className="text-orange-800 font-semibold mb-4">
                CivicOS is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13.
              </p>
              <p className="text-orange-800 font-medium">
                If we become aware that we have collected personal information from a child under 13, 
                we will take immediate steps to delete that information. Parents or guardians who believe 
                their child has provided personal information should contact us immediately.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 8. International Transfers */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">8. International Data Transfers</h2>
          
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <p className="text-blue-800 font-semibold mb-4">
                Your personal information is stored and processed exclusively in Canada. We do not 
                transfer personal data outside of Canada except in very limited circumstances.
              </p>
              <div className="space-y-2 text-blue-800 font-medium">
                <p><strong>Permitted transfers:</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• When required by Canadian law enforcement cooperation</li>
                  <li>• For essential technical support (with encryption and strict controls)</li>
                  <li>• With your explicit consent for specific purposes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 9. Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">9. Privacy Contact Information</h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center">
                <Mail className="w-5 h-5 mr-2 text-red-600" />
                Privacy Officer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-700 font-medium">
                <p><strong>Jordan Kenneth Boisclair</strong><br />Privacy Officer & Platform Creator</p>
                <p><strong>Email:</strong> privacy@civicos.ca</p>
                <p><strong>Address:</strong> CivicOS Privacy Office<br />Toronto, Ontario, Canada</p>
                <p><strong>Response Time:</strong> We respond to privacy inquiries within 5 business days</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 10. Changes to Privacy Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 text-gray-700 font-medium">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, 
                  technology, legal requirements, or other factors.
                </p>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Notification Process:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Email notification to all users for material changes</li>
                    <li>• Platform notification banner for 30 days</li>
                    <li>• Updated "Last Modified" date at the top of this policy</li>
                  </ul>
                </div>
                <p>
                  Continued use of CivicOS after changes become effective constitutes acceptance 
                  of the updated Privacy Policy.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer Navigation */}
        <div className="flex justify-center space-x-4 pt-8 border-t border-gray-200">
          <Button 
            onClick={() => window.location.href = '/terms'}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            Terms of Service
          </Button>
          <Button 
            onClick={() => window.location.href = '/contact'}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            Contact Us
          </Button>
          <Button 
            onClick={() => window.location.href = '/accessibility'}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            Accessibility
          </Button>
        </div>
      </div>
    </div>
  );
}