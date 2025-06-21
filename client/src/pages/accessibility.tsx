import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import canadianCrest from "@assets/ChatGPT Image Jun 20, 2025, 06_03_54 PM_1750464244456.png";
import { 
  Eye, 
  Ear, 
  MousePointer, 
  Keyboard, 
  ArrowRight, 
  CheckCircle, 
  Settings,
  Smartphone,
  Monitor,
  Volume2
} from "lucide-react";

export default function Accessibility() {
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
                <p className="text-sm text-gray-600 font-medium">Accessibility Statement</p>
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
          <div className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold mb-6">
            <Eye className="w-5 h-5 mr-3" />
            ACCESSIBILITY STATEMENT
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Accessible Democracy for All
          </h1>
          <p className="text-xl font-semibold text-gray-700 max-w-3xl mx-auto">
            CivicOS is committed to ensuring digital accessibility for all Canadians, 
            regardless of ability or technology used
          </p>
        </div>

        {/* Commitment Statement */}
        <Card className="mb-8 border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-xl font-black text-green-900">Our Accessibility Commitment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-800 font-semibold mb-4">
              CivicOS believes that democratic participation should be accessible to all Canadians. 
              We are committed to providing a platform that meets or exceeds accessibility standards 
              and works with assistive technologies.
            </p>
            <ul className="space-y-2 text-green-800 font-medium">
              <li>• Compliant with WCAG 2.1 AA standards</li>
              <li>• Compatible with screen readers and assistive technologies</li>
              <li>• Keyboard navigation support throughout the platform</li>
              <li>• High contrast and customizable display options</li>
              <li>• Alternative formats for multimedia content</li>
            </ul>
          </CardContent>
        </Card>

        {/* Accessibility Features */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Accessibility Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center">
                  <Eye className="w-6 h-6 mr-3 text-blue-600" />
                  Visual Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700 font-medium">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>High contrast color schemes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Scalable fonts and adjustable text sizes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Screen reader compatible markup</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Alternative text for all images</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Focus indicators for all interactive elements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center">
                  <Keyboard className="w-6 h-6 mr-3 text-blue-600" />
                  Navigation & Input
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700 font-medium">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Full keyboard navigation support</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Skip links for main content areas</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Logical tab order throughout pages</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Voice control compatibility</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Touch-friendly interface for mobile devices</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center">
                  <Volume2 className="w-6 h-6 mr-3 text-blue-600" />
                  Audio & Multimedia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700 font-medium">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Captions for all video content</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Audio descriptions when applicable</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Transcripts for audio content</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>No auto-playing audio</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Volume controls for all audio elements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center">
                  <Settings className="w-6 h-6 mr-3 text-blue-600" />
                  Customization Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700 font-medium">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Dark mode and light mode options</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Adjustable animation preferences</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Customizable notification settings</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Simplified layout options</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Language preferences</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Assistive Technology Support */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Assistive Technology Support</h2>
          
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Monitor className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Screen Readers</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>NVDA</li>
                    <li>JAWS</li>
                    <li>VoiceOver (macOS/iOS)</li>
                    <li>TalkBack (Android)</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <Keyboard className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Input Methods</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>Switch controls</li>
                    <li>Eye tracking</li>
                    <li>Voice recognition</li>
                    <li>Alternative keyboards</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <Smartphone className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Mobile Accessibility</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>Voice Control (iOS)</li>
                    <li>Android Accessibility Suite</li>
                    <li>Large touch targets</li>
                    <li>Gesture alternatives</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Standards Compliance */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Standards & Compliance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">International Standards</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700 font-medium">
                  <li>
                    <strong>WCAG 2.1 Level AA:</strong><br />
                    <span className="text-sm">Web Content Accessibility Guidelines compliance</span>
                  </li>
                  <li>
                    <strong>Section 508:</strong><br />
                    <span className="text-sm">US federal accessibility requirements</span>
                  </li>
                  <li>
                    <strong>EN 301 549:</strong><br />
                    <span className="text-sm">European accessibility standard</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Canadian Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700 font-medium">
                  <li>
                    <strong>Accessible Canada Act:</strong><br />
                    <span className="text-sm">Federal accessibility legislation compliance</span>
                  </li>
                  <li>
                    <strong>Provincial Standards:</strong><br />
                    <span className="text-sm">Meeting accessibility requirements across provinces</span>
                  </li>
                  <li>
                    <strong>Charter Rights:</strong><br />
                    <span className="text-sm">Supporting equality and inclusion principles</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Feedback and Support */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Accessibility Feedback & Support</h2>
          
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="space-y-4 text-blue-800 font-medium">
                <p className="font-semibold">
                  We welcome feedback about the accessibility of CivicOS. If you encounter 
                  accessibility barriers or have suggestions for improvement, please contact us.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold mb-2">Accessibility Support:</h4>
                    <p><strong>Email:</strong> accessibility@civicos.ca</p>
                    <p><strong>Response Time:</strong> Within 24 hours</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-2">Alternative Formats:</h4>
                    <p>We can provide information in alternative formats including:</p>
                    <ul className="text-sm ml-4 mt-1 space-y-1">
                      <li>• Large print</li>
                      <li>• Audio format</li>
                      <li>• Braille (upon request)</li>
                      <li>• Plain language summaries</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Continuous Improvement */}
        <section className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Continuous Improvement</h2>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 text-gray-700 font-medium">
                <p>
                  Accessibility is an ongoing commitment. We continuously work to improve the 
                  accessibility of CivicOS through:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    <li>• Regular accessibility audits and testing</li>
                    <li>• User feedback integration</li>
                    <li>• Staff training on accessibility best practices</li>
                    <li>• Technology updates and improvements</li>
                  </ul>
                  
                  <ul className="space-y-2">
                    <li>• Community engagement and consultation</li>
                    <li>• Collaboration with disability organizations</li>
                    <li>• Monitoring of new accessibility standards</li>
                    <li>• Regular review and updates of policies</li>
                  </ul>
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
        </div>
      </div>
    </div>
  );
}