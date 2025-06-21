import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  Home, 
  Vote, 
  Users, 
  FileText, 
  Scale, 
  MessageSquare, 
  BarChart3, 
  Globe, 
  Bell, 
  Settings, 
  LogOut,
  ChevronRight,
  ChevronDown,
  Gavel,
  BookOpen,
  Shield,
  Map,
  Newspaper,
  Search,
  AlertTriangle,
  TrendingUp,
  Eye,
  DollarSign,
  Building,
  Megaphone,
  UserCheck,
  PenTool,
  Archive,
  Clock,
  Handshake,
  Briefcase,
  Target,
  Zap,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import canadianCrest from "@assets/ChatGPT Image Jun 20, 2025, 06_03_54 PM_1750464244456.png";

export function MobileNavigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>(["Democratic Systems"]);
  const [showDonationPopup, setShowDonationPopup] = useState(false);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionTitle) 
        ? prev.filter(s => s !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  const navigationSections = [
    {
      title: "Democratic Systems",
      items: [
        { title: "Dashboard", href: "/", icon: Home, badge: "Live" },
        { title: "Politicians", href: "/politicians", icon: Users, badge: "85K+" },
        { title: "Voting System", href: "/voting", icon: Vote, badge: "Active" },
        { title: "Elections", href: "/elections", icon: Target, badge: "2025" },
        { title: "Civic Ledger", href: "/ledger", icon: BookOpen },
        { title: "Pulse Monitor", href: "/pulse", icon: TrendingUp, badge: "Real-time" }
      ]
    },
    {
      title: "Legal Framework",
      items: [
        { title: "Legal Database", href: "/legal", icon: Scale, badge: "Complete" },
        { title: "Legal Search", href: "/legal-search", icon: Search },
        { title: "Court Cases", href: "/cases", icon: Gavel, badge: "Active" },
        { title: "Rights Portal", href: "/rights", icon: Shield },
        { title: "Procurement", href: "/procurement", icon: DollarSign, badge: "Tracked" }
      ]
    },
    {
      title: "Civic Intelligence",
      items: [
        { title: "News Analysis", href: "/news", icon: Newspaper, badge: "AI" },
        { title: "Finance Tracker", href: "/finance", icon: BarChart3, badge: "Live" },
        { title: "Lobbyist Watch", href: "/lobbyists", icon: Handshake, badge: "Monitored" },
        { title: "Corruption Intel", href: "/corruption", icon: AlertTriangle, badge: "Active" },
        { title: "Trust Metrics", href: "/trust", icon: UserCheck },
        { title: "Memory Bank", href: "/memory", icon: Archive, badge: "Historical" }
      ]
    },
    {
      title: "Engagement Tools",
      items: [
        { title: "Discussion Forum", href: "/discussions", icon: MessageSquare, badge: "Active" },
        { title: "Petitions", href: "/petitions", icon: PenTool, badge: "Open" },
        { title: "Whistleblower", href: "/whistleblower", icon: AlertTriangle, badge: "Secure" },
        { title: "FOI Requests", href: "/foi", icon: FileText, badge: "Tracked" },
        { title: "Service Tracker", href: "/services", icon: Building },
        { title: "Contact Officials", href: "/contacts", icon: Megaphone }
      ]
    },
    {
      title: "Intelligence Hub",
      items: [
        { title: "Maps & Data", href: "/maps", icon: Map, badge: "Interactive" },
        { title: "Leaks Portal", href: "/leaks", icon: Zap, badge: "Verified" },
        { title: "Manifesto", href: "/manifesto", icon: BookOpen, badge: "Core" }
      ]
    }
  ];

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => setShowDonationPopup(true)}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 px-3 py-1 text-sm h-8"
          size="sm"
        >
          <Heart className="w-4 h-4 mr-1" />
          Support
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-700 dark:text-slate-300">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 bg-white dark:bg-gray-900 h-full">
        <div className="flex flex-col h-full">
          {/* Header with User Profile */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center shadow-lg border border-red-500 overflow-hidden">
                <img 
                  src={canadianCrest} 
                  alt="CivicOS" 
                  className="w-8 h-8 object-contain rounded-full"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">CivicOS</h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium tracking-wide">DIGITAL DEMOCRACY</p>
              </div>
            </div>
            
            {user && (
              <Link href={`/users/${user.id || 'profile'}`}>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-white">
                        {user.firstName?.[0] || user.email?.[0] || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.firstName || user.email}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          Civic Level 3
                        </Badge>
                        <span className="text-xs text-gray-500">1,247 pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Navigation Content with Scrolling */}
          <div className="flex-1 overflow-y-auto p-4 scrollable max-h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {navigationSections.map((section) => (
                <div key={section.title} className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-3 h-auto text-left font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => toggleSection(section.title)}
                  >
                    <span className="text-sm font-serif text-gray-800 dark:text-gray-200">{section.title}</span>
                    {expandedSections.includes(section.title) ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </Button>
                  
                  {expandedSections.includes(section.title) && (
                    <div className="ml-3 mt-2 space-y-1">
                      {section.items.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start space-x-3 h-10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                              isActive(item.href) && "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-3 border-blue-500"
                            )}
                          >
                            <item.icon className="w-4 h-4" />
                            <span className="flex-1 text-left text-sm">{item.title}</span>
                            {item.badge && (
                              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                                {item.badge}
                              </Badge>
                            )}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer with Settings and Logout */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <Link href="/settings">
                <Button
                  variant={isActive("/settings") ? "secondary" : "ghost"}
                  className="w-full justify-start space-x-3 text-sm h-9"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Button>
              </Link>
              
              <Link href="/notifications">
                <Button 
                  variant={isActive("/notifications") ? "secondary" : "ghost"} 
                  className="w-full justify-start space-x-3 text-sm h-9"
                >
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                  <Badge variant="destructive" className="ml-auto text-xs">3</Badge>
                </Button>
              </Link>
              
              <Button
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                variant="ghost"
                className="w-full justify-start space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 text-sm h-9"
              >
                <LogOut className="w-4 h-4" />
                <span>{logout.isPending ? "Logging out..." : "Logout"}</span>
              </Button>
            </div>
            
            {/* Attribution */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Built by Jordan Kenneth Boisclair
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  © 2025 CivicOS™
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Transparency is no longer optional
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
        </Sheet>
      </div>
      
      {/* Donation Popup */}
      {showDonationPopup && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Support CivicOS</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Help us build the most comprehensive political transparency platform Canada has ever seen!
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowDonationPopup(false)}
                variant="outline"
                className="flex-1"
              >
                Later
              </Button>
              <Button
                onClick={() => {
                  setShowDonationPopup(false);
                  window.location.href = "/donate";
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Donate Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}