import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import dominionEmblem from "@assets/EFE54ED9-DEE5-4F72-88D4-4441CE2D11CB_1_105_c_1749411960407.jpeg";
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
  X
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
      { title: "Discussions", href: "/discussions", icon: MessageSquare, badge: "24" },
      { title: "Petitions", href: "/petitions", icon: FileText },
      { title: "Services", href: "/services", icon: Building },
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
  }
];

export function LuxuryNavigation() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>(["Political Intelligence Hub"]);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-72"
    )}>
      {/* Header with Toggle */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </Button>
        </div>
        
        {!isCollapsed && (
          <div className="mt-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center shadow-lg border border-slate-600 overflow-hidden">
                <img 
                  src={dominionEmblem} 
                  alt="Dominion Emblem" 
                  className="w-10 h-10 object-cover rounded-full filter brightness-125 contrast-125 ml-[0px] mr-[0px] pl-[-87px] pr-[-87px] pt-[-59px] pb-[-59px]"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">CivicOS</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium tracking-wide">DOMINION INTELLIGENCE</p>
              </div>
            </div>
            
            {user && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
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
            )}
          </div>
        )}
      </div>
      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {isCollapsed ? (
          // Collapsed view - show only icons
          (<div className="space-y-2">
            {navigationSections.flatMap(section => section.items).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-10 h-10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    isActive(item.href) && "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  )}
                  title={item.title}
                >
                  <item.icon className="w-5 h-5" />
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
                  "ml-3 mt-2 space-y-1 overflow-hidden transition-all duration-200 ease-in-out",
                  expandedSections.includes(section.title) 
                    ? "max-h-96 opacity-100" 
                    : "max-h-0 opacity-0"
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
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-2">
          <Link href="/settings">
            <Button
              variant={isActive("/settings") ? "secondary" : "ghost"}
              className="w-full justify-start space-x-3"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>
          </Link>
          
          <Link href="/notifications">
            <Button 
              variant={isActive("/notifications") ? "secondary" : "ghost"} 
              className="w-full justify-start space-x-3"
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              <Badge variant="destructive" className="ml-auto text-xs">3</Badge>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}