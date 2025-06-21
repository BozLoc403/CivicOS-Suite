import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import canadianCrest from "@assets/ChatGPT Image Jun 20, 2025, 06_03_54 PM_1750464244456.png";
import { Mail, Phone, MapPin, ArrowRight, Clock, MessageSquare } from "lucide-react";

export default function Contact() {
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
                <p className="text-sm text-gray-600 font-medium">Contact Information</p>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg text-sm font-bold mb-6">
            <MessageSquare className="w-5 h-5 mr-3" />
            CONTACT INFORMATION
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-xl font-semibold text-gray-700 max-w-3xl mx-auto">
            We're here to help with questions, support, and feedback about the CivicOS platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="border-2 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-red-900">Contact Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-red-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">General Inquiries</h3>
                      <p className="text-gray-700 font-medium">contact@civicos.ca</p>
                      <p className="text-sm text-gray-600">For general questions and platform support</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-red-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Privacy & Legal</h3>
                      <p className="text-gray-700 font-medium">privacy@civicos.ca</p>
                      <p className="text-sm text-gray-600">Privacy concerns and legal inquiries</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-red-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Media & Press</h3>
                      <p className="text-gray-700 font-medium">media@civicos.ca</p>
                      <p className="text-sm text-gray-600">Press inquiries and media relations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-red-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Mailing Address</h3>
                      <p className="text-gray-700 font-medium">
                        CivicOS Platform<br />
                        Toronto, Ontario<br />
                        Canada
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 text-red-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Response Time</h3>
                      <p className="text-gray-700 font-medium">Within 24-48 hours</p>
                      <p className="text-sm text-gray-600">We respond to all inquiries promptly</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Platform Creator */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-black text-gray-900">Platform Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900">Jordan Kenneth Boisclair</h3>
                  <p className="text-gray-700 font-medium">
                    Founder & Lead Developer of CivicOS
                  </p>
                  <p className="text-gray-600 text-sm">
                    Independent Canadian developer committed to government transparency 
                    and democratic accountability. Not affiliated with any political party 
                    or government entity.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border-2 border-gray-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-gray-900">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-bold text-gray-700">
                        First Name *
                      </Label>
                      <Input 
                        id="firstName" 
                        required 
                        className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-bold text-gray-700">
                        Last Name *
                      </Label>
                      <Input 
                        id="lastName" 
                        required 
                        className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-sm font-bold text-gray-700">
                      Email Address *
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="text-sm font-bold text-gray-700">
                      Subject *
                    </Label>
                    <Input 
                      id="subject" 
                      required 
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="text-sm font-bold text-gray-700">
                      Category
                    </Label>
                    <select 
                      id="category" 
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:border-red-500 focus:ring-red-500"
                    >
                      <option value="">Select a category</option>
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="privacy">Privacy & Security</option>
                      <option value="legal">Legal Question</option>
                      <option value="media">Media Inquiry</option>
                      <option value="feedback">Platform Feedback</option>
                      <option value="bug">Bug Report</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-sm font-bold text-gray-700">
                      Message *
                    </Label>
                    <Textarea 
                      id="message" 
                      required 
                      rows={6}
                      className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      placeholder="Please provide as much detail as possible..."
                    />
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-medium">
                      <strong>Note:</strong> This contact form is for general inquiries only. 
                      For urgent security issues or privacy concerns, please email us directly 
                      at the appropriate address listed above.
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg"
                  >
                    Send Message
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16">
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-xl font-black text-yellow-900">Important Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-yellow-800 font-medium">
                <div>
                  <h4 className="font-bold mb-2">Privacy & Confidentiality:</h4>
                  <p>
                    All communications are treated as confidential and are protected under Canadian privacy laws. 
                    We do not share contact information with third parties.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Platform Independence:</h4>
                  <p>
                    CivicOS is completely independent from all levels of Canadian government. We are not 
                    a government service and cannot provide official government information or services.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Emergency Situations:</h4>
                  <p>
                    For emergencies, contact your local emergency services (911). CivicOS is not an 
                    emergency service and cannot provide immediate assistance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-center space-x-4 pt-8 border-t border-gray-200 mt-12">
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