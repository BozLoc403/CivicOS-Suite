import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { VerificationStatusBadge } from "@/components/VerificationStatusBadge";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CanadianCoatOfArms, CanadianMapleLeaf } from "@/components/CanadianCoatOfArms";
import DonationPopup from "@/components/DonationPopup";
import DonationSuccess from "@/components/DonationSuccess";
import civicOSLogo from "@assets/ChatGPT Image Jun 20, 2025, 05_42_18 PM_1750462997583.png";
import canadianCrest from "@assets/ChatGPT Image Jun 20, 2025, 06_03_54 PM_1750464244456.png";
import { 
  Home, 
  Users, 
  FileText, 
  Gavel, 
  MessageSquare, 
  TrendingUp, 
  Settings, 
  Bell,
  Search,
  Crown,
  Shield,
  DollarSign,
  Building,
  Eye,
  Scale,
  AlertTriangle,
  Activity,
  Archive,
  BarChart3,
  Brain,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  LogOut,
  BookOpen,
  Heart
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  subItems?: NavItem[];
}

const navigationSections = [
  {
    title: "Political Intelligence Hub",
    items: [
      { title: "Dashboard", href: "/", icon: Home },
      { title: "Politicians", href: "/politicians", icon: Users, badge: "2,847" },
      { title: "Bills & Voting", href: "/voting", icon: FileText, badge: "Active" },
      { title: "Elections", href: "/elections", icon: Crown },
      { title: "News Analysis", href: "/news", icon: TrendingUp, badge: "Live" }
    ]
  },
  {
    title: "Civic Engagement Suite",
    items: [
      { title: "Civic Ledger", href: "/ledger", icon: BookOpen, badge: "Personal" },
      { title: "Discussions", href: "/discussions", icon: MessageSquare, badge: "24" },
      { title: "Petitions", href: "/petitions", icon: FileText },

      { title: "Contact Officials", href: "/contacts", icon: Users }
    ]
  },
  {
    title: "Government Integrity Tools",
    items: [
      { title: "Campaign Finance", href: "/finance", icon: DollarSign, badge: "New" },
      { title: "Lobbyist Mapping", href: "/lobbyists", icon: Eye },
      { title: "Procurement Tracker", href: "/procurement", icon: Building },
      { title: "Political Memory", href: "/memory", icon: Brain }
    ]
  },
  {
    title: "Legal Oversight Grid",
    items: [
      { title: "Legal System", href: "/legal", icon: Gavel },
      { title: "Your Rights", href: "/rights", icon: Shield, badge: "Charter" },
      { title: "Constitutional Cases", href: "/cases", icon: Scale },
      { title: "Legal Search", href: "/legal-search", icon: Search }
    ]
  },
  {
    title: "Transparency Arsenal",
    items: [
      { title: "Leak Archive", href: "/leaks", icon: Archive, badge: "Secure" },
      { title: "FOI Repository", href: "/foi", icon: Eye },
      { title: "Whistleblower Portal", href: "/whistleblower", icon: AlertTriangle },
      { title: "Corruption Patterns", href: "/corruption", icon: Activity }
    ]
  },
  {
    title: "Civic Analytics",
    items: [
      { title: "Civic Pulse", href: "/pulse", icon: Activity, badge: "Live" },
      { title: "Trust Metrics", href: "/trust", icon: BarChart3 },
      { title: "Engagement Maps", href: "/maps", icon: TrendingUp }
    ]
  },
  {
    title: "Intelligence Hub",
    items: [
      { title: "Manifesto", href: "/manifesto", icon: BookOpen, badge: "Core" },
      { title: "Leak Archive", href: "/leaks", icon: Archive, badge: "Secure" },
      { title: "FOI Repository", href: "/foi", icon: Eye }
    ]
  }
];

export function LuxuryNavigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>(["Political Intelligence Hub"]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDonationPopup, setShowDonationPopup] = useState(false);
  const [showDonationSuccess, setShowDonationSuccess] = useState(false);
  const [donatedAmount, setDonatedAmount] = useState(0);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/logout", "POST", {});
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
      queryClient.clear();
      toast({
        title: "Logged out successfully",
        description: "You have been securely logged out of CivicOS",
      });
      window.location.href = "/";
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionTitle)
        ? prev.filter(title => title !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <div className={cn(
      "bg-white border-r-2 border-gray-200 h-screen flex flex-col transition-all duration-300 ease-in-out shadow-lg",
      "hidden md:flex", // Hide on mobile, show on md and up
      isCollapsed ? "w-16" : "w-64 lg:w-72"
    )}>
      {/* Clean Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </Button>
          </div>
          
          {!isCollapsed && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <img 
                  src={canadianCrest} 
                  alt="CivicOS Crest" 
                  className="w-8 h-8 object-contain"
                />
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">CivicOS</h1>
              </div>
            </div>
          )}
        </div>
            
        {/* User Profile Section */}
        {user && !isCollapsed && (
          <div className="bg-gray-50 border-t border-gray-200 px-3 lg:px-4 py-2 lg:py-3">
            <Link href={`/users/${user.id || 'profile'}`}>
              <div className="flex items-center space-x-2 lg:space-x-3 hover:bg-gray-100 rounded p-2 transition-colors cursor-pointer">
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs lg:text-sm font-bold text-white">
                    {user.firstName?.[0] || user.email?.[0] || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs lg:text-sm font-medium text-gray-800 truncate">
                    {user.firstName || user.email}
                  </p>
                  <Badge className="text-xs bg-green-100 text-green-700 font-semibold mt-1">
                    Verified Citizen
                  </Badge>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 lg:px-3 py-3 lg:py-4 bg-white">
        {isCollapsed ? (
          // Collapsed view - show only icons
          (<div className="space-y-2">
            {navigationSections.flatMap(section => section.items).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-8 h-8 lg:w-10 lg:h-10 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200",
                    isActive(item.href) && "bg-red-600 text-white hover:bg-red-700 hover:text-white"
                  )}
                  title={item.title}
                >
                  <item.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                </Button>
              </Link>
            ))}
          </div>)
        ) : (
          // Expanded view - show full navigation
          (<div className="space-y-6">
            {navigationSections.map((section) => (
              <div key={section.title}>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-3 h-auto font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => toggleSection(section.title)}
                >
                  <span className="font-serif text-gray-800 dark:text-gray-200">{section.title}</span>
                  {expandedSections.includes(section.title) ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </Button>
                
                <div className={cn(
                  "ml-3 mt-2 space-y-1 transition-all duration-200 ease-in-out",
                  expandedSections.includes(section.title) 
                    ? "block opacity-100" 
                    : "hidden opacity-0"
                )}>
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
              </div>
            ))}
          </div>)
        )}
      </div>
      <div className="flex-shrink-0 p-3 lg:p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-2 lg:space-y-3">
          {/* Donation Button - Make it prominent */}
          <Button
            onClick={() => setShowDonationPopup(true)}
            className="w-full justify-start space-x-2 lg:space-x-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 group text-xs lg:text-sm h-10 lg:h-11 px-3 lg:px-4 mb-2"
          >
            <Heart className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-105 transition-transform duration-150" />
            <span className="font-semibold">Support Platform</span>
          </Button>
          
          <Link href="/settings">
            <Button
              variant={isActive("/settings") ? "secondary" : "ghost"}
              className="w-full justify-start space-x-2 lg:space-x-3 text-xs lg:text-sm h-8 lg:h-9 px-2 lg:px-3"
            >
              <Settings className="w-3 h-3 lg:w-4 lg:h-4" />
              <span>Settings</span>
            </Button>
          </Link>

          <Link href="/notifications">
            <Button 
              variant={isActive("/notifications") ? "secondary" : "ghost"} 
              className="w-full justify-start space-x-2 lg:space-x-3 text-xs lg:text-sm h-8 lg:h-9 px-2 lg:px-3"
            >
              <Bell className="w-3 h-3 lg:w-4 lg:h-4" />
              <span>Notifications</span>
              <Badge variant="destructive" className="ml-auto text-xs">3</Badge>
            </Button>
          </Link>
          
          <Button
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            variant="ghost"
            className="w-full justify-start space-x-2 lg:space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 text-xs lg:text-sm h-8 lg:h-9 px-2 lg:px-3"
          >
            <LogOut className="w-3 h-3 lg:w-4 lg:h-4" />
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

      {/* Donation Popups */}
      <DonationPopup
        isOpen={showDonationPopup}
        onClose={() => setShowDonationPopup(false)}
        onSuccess={() => {
          setShowDonationPopup(false);
          setDonatedAmount(25); // Default success amount
          setShowDonationSuccess(true);
        }}
      />

      <DonationSuccess
        isOpen={showDonationSuccess}
        onClose={() => setShowDonationSuccess(false)}
        amount={donatedAmount}
      />
    </div>
  );
}