import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
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
  ChevronDown
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
      { title: "Constitutional Cases", href: "/cases", icon: Scale },
      { title: "Charter Monitor", href: "/charter", icon: Shield },
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
    <div className="w-80 bg-card dark:bg-card border-r border-border h-screen sticky top-0 glass-effect">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif">CivicOS</h1>
            <p className="text-sm text-muted-foreground">Sovereign Intelligence</p>
          </div>
        </div>
        
        {user && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-sm font-medium text-accent-foreground">
                  {user.firstName?.[0] || user.email?.[0] || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.firstName || user.email}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    Civic Level 3
                  </Badge>
                  <span className="text-xs text-muted-foreground">1,247 pts</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {navigationSections.map((section) => (
            <div key={section.title}>
              <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto font-medium text-sm"
                onClick={() => toggleSection(section.title)}
              >
                <span className="font-serif text-foreground/80">{section.title}</span>
                {expandedSections.includes(section.title) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
              
              {expandedSections.includes(section.title) && (
                <div className="ml-2 mt-2 space-y-1">
                  {section.items.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive(item.href) ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start space-x-3 h-10",
                          isActive(item.href) && "bg-accent/10 border-l-2 border-accent"
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="flex-1 text-left">{item.title}</span>
                        {item.badge && (
                          <Badge variant="outline" className="text-xs">
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
      </ScrollArea>

      <div className="p-4 border-t border-border">
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
          
          <Button variant="ghost" className="w-full justify-start space-x-3">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
            <Badge variant="destructive" className="ml-auto text-xs">3</Badge>
          </Button>
        </div>
      </div>
    </div>
  );
}