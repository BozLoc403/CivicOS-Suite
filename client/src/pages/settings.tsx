import { NavigationHeader } from "@/components/NavigationHeader";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, Globe, Eye, Mail, Smartphone } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    bills: true,
    elections: true,
    petitions: false
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    showVotes: false,
    showLocation: true
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account preferences and privacy settings</p>
          </div>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={user?.firstName || ''}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={user?.lastName || ''}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ''}
                  placeholder="Enter your email"
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>Choose how you want to be notified about civic activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Notification Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>Email notifications</span>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-gray-500" />
                      <span>Push notifications</span>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-gray-500" />
                      <span>SMS notifications</span>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Content Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>New bills and legislation</span>
                    <Switch
                      checked={notifications.bills}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, bills: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Election updates</span>
                    <Switch
                      checked={notifications.elections}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, elections: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Petition milestones</span>
                    <Switch
                      checked={notifications.petitions}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, petitions: checked }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Privacy Settings</span>
              </CardTitle>
              <CardDescription>Control what information is visible to others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Public Profile</h4>
                  <p className="text-sm text-gray-600">Allow others to see your civic engagement stats</p>
                </div>
                <Switch
                  checked={privacy.publicProfile}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, publicProfile: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Show Voting History</h4>
                  <p className="text-sm text-gray-600">Display your votes on bills and petitions</p>
                </div>
                <Switch
                  checked={privacy.showVotes}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showVotes: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Location-based Features</h4>
                  <p className="text-sm text-gray-600">Show relevant local politicians and issues</p>
                </div>
                <Switch
                  checked={privacy.showLocation}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showLocation: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Regional Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Regional Preferences</span>
              </CardTitle>
              <CardDescription>Customize content for your location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="province">Province/Territory</Label>
                  <Input
                    id="province"
                    placeholder="Select your province"
                    defaultValue="Ontario"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riding">Federal Riding</Label>
                  <Input
                    id="riding"
                    placeholder="Enter your riding"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="municipality">Municipality</Label>
                <Input
                  id="municipality"
                  placeholder="Enter your city/town"
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Account Actions</CardTitle>
              <CardDescription>Manage your account status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <h4 className="font-medium text-red-900">Delete Account</h4>
                  <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}