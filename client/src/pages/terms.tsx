import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import canadianCrest from "@assets/ChatGPT Image Jun 20, 2025, 06_03_54 PM_1750464244456.png";
import { Shield, Scale, AlertTriangle, ArrowRight, Calendar, Gavel } from "lucide-react";

export default function Terms() {
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
                <p className="text-sm text-gray-600 font-medium">Terms of Service</p>
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
            <Scale className="w-5 h-5 mr-3" />
            TERMS OF SERVICE
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Platform Terms & Conditions
          </h1>
          <p className="text-xl font-semibold text-gray-700 max-w-3xl mx-auto">
            Legal agreement governing your use of the CivicOS platform and services
          </p>
          <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Effective: June 21, 2025</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Gavel className="w-4 h-4" />
              <span>Governed by Canadian Law</span>
            </div>
          </div>
        </div>

        {/* Agreement Notice */}
        <Card className="mb-8 border-2 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-xl font-black text-red-900">Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-800 font-semibold">
              By accessing or using CivicOS, you agree to be bound by these Terms of Service and all applicable 
              laws and regulations. If you do not agree with any of these terms, you are prohibited from using 
              or accessing this site and must discontinue use immediately.
            </p>
          </CardContent>
        </Card>

        {/* 1. Platform Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">1. Platform Overview and Purpose</h2>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 text-gray-700 font-medium">
                <p>
                  CivicOS is an independent digital platform designed to enhance democratic engagement 
                  and government accountability in Canada. The platform provides:
                </p>
                <ul className="space-y-2 ml-6">
                  <li>• Access to verified government data and political information</li>
                  <li>• Tools for civic engagement including voting, petitions, and discussions</li>
                  <li>• Real-time tracking of political activities and legislation</li>
                  <li>• Educational resources about Canadian democracy and governance</li>
                  <li>• Secure communication channels for democratic participation</li>
                </ul>
                <p className="font-semibold text-gray-800">
                  CivicOS is completely independent and not affiliated with any government entity, 
                  political party, or special interest group.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. User Eligibility */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">2. User Eligibility and Registration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-green-700">Eligible Users</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700 font-medium">
                  <li>• Individuals 13 years of age or older</li>
                  <li>• Canadian citizens and permanent residents</li>
                  <li>• International users (limited features)</li>
                  <li>• Academic researchers and journalists</li>
                  <li>• Government transparency advocates</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-red-700">Account Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700 font-medium">
                  <li>• Accurate registration information</li>
                  <li>• Unique email address</li>
                  <li>• Strong password meeting security requirements</li>
                  <li>• Agreement to these Terms of Service</li>
                  <li>• Compliance with acceptable use policies</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 3. Acceptable Use */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">3. Acceptable Use Policy</h2>
          
          <Card className="mb-4 border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-green-800">Permitted Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-green-800 font-semibold">
                <li>• Accessing government data and political information</li>
                <li>• Participating in civic discussions and debates</li>
                <li>• Creating and signing petitions for legitimate causes</li>
                <li>• Voting on platform polls and civic questions</li>
                <li>• Sharing factual information and news articles</li>
                <li>• Contacting elected representatives</li>
                <li>• Educational and research activities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-red-800">Prohibited Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-red-900 mb-2">Content Violations:</h4>
                  <ul className="space-y-1 text-red-800 font-medium ml-4">
                    <li>• Posting false, misleading, or deliberately deceptive information</li>
                    <li>• Sharing hate speech, harassment, or discriminatory content</li>
                    <li>• Publishing defamatory or libelous statements</li>
                    <li>• Distributing spam, malware, or malicious links</li>
                    <li>• Violating copyright or intellectual property rights</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-red-900 mb-2">Platform Abuse:</h4>
                  <ul className="space-y-1 text-red-800 font-medium ml-4">
                    <li>• Creating multiple accounts to manipulate voting or discussions</li>
                    <li>• Attempting to hack, breach, or compromise platform security</li>
                    <li>• Using automated tools or bots without permission</li>
                    <li>• Impersonating other users, politicians, or officials</li>
                    <li>• Selling or transferring account access</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-red-900 mb-2">Legal Violations:</h4>
                  <ul className="space-y-1 text-red-800 font-medium ml-4">
                    <li>• Any illegal activity under Canadian federal or provincial law</li>
                    <li>• Threats of violence or harm against individuals or groups</li>
                    <li>• Privacy violations or unauthorized data collection</li>
                    <li>• Election interference or voter manipulation</li>
                    <li>• Fraud, scams, or financial crimes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 4. Content and Intellectual Property */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">4. Content and Intellectual Property</h2>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">User-Generated Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-700 font-medium">
                  <p>
                    You retain ownership of content you create and post on CivicOS, but grant us 
                    necessary rights to operate the platform:
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• Right to display your content to other users</li>
                    <li>• Right to moderate and remove content violating our policies</li>
                    <li>• Right to create anonymized aggregated statistics</li>
                    <li>• Right to preserve content for legal compliance</li>
                  </ul>
                  <p className="font-semibold text-gray-800">
                    We do not claim ownership of your content and will not use it for commercial purposes.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Platform Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-700 font-medium">
                  <p>
                    CivicOS platform design, software, databases, and original content are protected by:
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• Copyright laws</li>
                    <li>• Trademark protections</li>
                    <li>• Trade secret laws</li>
                    <li>• Database rights</li>
                  </ul>
                  <p>
                    Government data accessed through CivicOS remains in the public domain. 
                    Our analysis and presentation of this data is proprietary.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 5. Privacy and Data Protection */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">5. Privacy and Data Protection</h2>
          
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="space-y-4 text-blue-800 font-medium">
                <p className="font-semibold">
                  Your privacy is fundamental to our mission. We are committed to protecting your personal 
                  information and maintaining transparency about our data practices.
                </p>
                <div>
                  <h4 className="font-bold mb-2">Key Privacy Commitments:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• No sale or commercial use of personal data</li>
                    <li>• Minimal data collection for platform functionality</li>
                    <li>• Strong encryption and security measures</li>
                    <li>• User control over personal information</li>
                    <li>• Compliance with Canadian privacy laws (PIPEDA)</li>
                  </ul>
                </div>
                <p>
                  For complete details, see our <a href="/privacy" className="underline font-bold">Privacy Policy</a>, 
                  which is incorporated into these Terms by reference.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 6. Platform Availability */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">6. Platform Availability and Modifications</h2>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 text-gray-700 font-medium">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Service Availability:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
                    <li>• Planned maintenance will be announced in advance when possible</li>
                    <li>• Emergency maintenance may occur without notice</li>
                    <li>• Some features may be temporarily unavailable during updates</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Platform Modifications:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• We may modify, update, or discontinue features at any time</li>
                    <li>• Major changes will be communicated to users in advance</li>
                    <li>• New features may be added without notice</li>
                    <li>• We reserve the right to change these Terms as needed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 7. Disclaimers and Limitations */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">7. Disclaimers and Limitations of Liability</h2>
          
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-yellow-800 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Important Legal Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-yellow-900 font-medium">
                <div>
                  <h4 className="font-bold mb-2">Information Accuracy:</h4>
                  <p>
                    While we strive for accuracy, CivicOS provides information "as is" without warranties. 
                    Government data may contain errors, and political information can change rapidly. 
                    Users should verify important information through official sources.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Platform Availability:</h4>
                  <p>
                    CivicOS is provided "as available" without guarantees of continuous operation. 
                    We are not liable for service interruptions, data loss, or technical difficulties.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Third-Party Content:</h4>
                  <p>
                    Links to external websites and third-party content are provided for convenience. 
                    We do not endorse or take responsibility for external content or services.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Limitation of Liability:</h4>
                  <p>
                    To the maximum extent permitted by law, CivicOS and its operators shall not be 
                    liable for any indirect, incidental, special, or consequential damages resulting 
                    from platform use, including but not limited to loss of data, profits, or reputation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 8. Account Termination */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">8. Account Termination</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">User-Initiated Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-700 font-medium">
                  <p>You may terminate your account at any time by:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Using the account deletion feature in settings</li>
                    <li>• Contacting our support team</li>
                    <li>• Sending a written request</li>
                  </ul>
                  <p className="text-sm font-semibold">
                    Account deletion is permanent and cannot be reversed. 
                    Some information may be retained as required by law.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Platform-Initiated Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-700 font-medium">
                  <p>We may suspend or terminate accounts for:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Violation of these Terms of Service</li>
                    <li>• Illegal activities or content</li>
                    <li>• Repeated policy violations</li>
                    <li>• Security threats or abuse</li>
                    <li>• Non-compliance with legal requests</li>
                  </ul>
                  <p className="text-sm font-semibold">
                    We will provide notice and opportunity to cure violations 
                    when possible, except for serious violations requiring immediate action.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 9. Governing Law */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">9. Governing Law and Dispute Resolution</h2>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 text-gray-700 font-medium">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Jurisdiction:</h4>
                  <p>
                    These Terms are governed by the laws of Canada and the Province of Ontario. 
                    Any legal disputes shall be resolved in the courts of Ontario, Canada.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Dispute Resolution Process:</h4>
                  <ol className="space-y-1 ml-4">
                    <li>1. Direct communication with CivicOS support team</li>
                    <li>2. Good faith negotiation between parties</li>
                    <li>3. Mediation through Canadian dispute resolution services</li>
                    <li>4. Binding arbitration if mutually agreed</li>
                    <li>5. Court proceedings as a last resort</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Class Action Waiver:</h4>
                  <p>
                    Disputes must be resolved individually. Class action lawsuits are waived 
                    to the extent permitted by Canadian law.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 10. Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">10. Contact Information</h2>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 text-gray-700 font-medium">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Legal Inquiries:</h4>
                  <p>
                    <strong>Jordan Kenneth Boisclair</strong><br />
                    Legal & Compliance Officer<br />
                    <strong>Email:</strong> legal@civicos.ca<br />
                    <strong>Address:</strong> CivicOS Legal Department<br />
                    Toronto, Ontario, Canada
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Terms Updates:</h4>
                  <p>
                    Material changes to these Terms will be communicated via email 
                    and platform notifications at least 30 days before taking effect.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer Navigation */}
        <div className="flex justify-center space-x-4 pt-8 border-t border-gray-200">
          <Button 
            onClick={() => window.location.href = '/privacy'}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            Privacy Policy
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