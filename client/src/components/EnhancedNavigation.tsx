import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  FileText, 
  Users, 
  Gavel, 
  BarChart3, 
  MessageSquare, 
  Newspaper, 
  Target,
  Calendar,
  MapPin,
  TrendingUp
} from "lucide-react";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
  description: string;
}

const navigationItems: NavItem[] = [
  {
    href: "/",
    icon: Home,
    label: "Dashboard",
    description: "Overview of Canadian political activity"
  },
  {
    href: "/bills",
    icon: FileText,
    label: "Bills & Laws",
    badge: "42 Active",
    description: "Track federal and provincial legislation"
  },
  {
    href: "/politicians",
    icon: Users,
    label: "Politicians",
    badge: "85K+",
    description: "Federal, provincial, and municipal representatives"
  },
  {
    href: "/legal",
    icon: Gavel,
    label: "Legal Database",
    description: "Canadian Criminal Code and legal precedents"
  },
  {
    href: "/civic-hub",
    icon: Target,
    label: "Civic Hub",
    badge: "New",
    description: "Gamified civic engagement and challenges"
  },
  {
    href: "/calendar",
    icon: Calendar,
    label: "Political Events",
    badge: "5 This Week",
    description: "Town halls, debates, and public meetings"
  },
  {
    href: "/representatives",
    icon: MapPin,
    label: "My Representatives",
    description: "Find and contact your local officials"
  },
  {
    href: "/forum",
    icon: MessageSquare,
    label: "Community Forum",
    description: "Discuss political issues with fellow Canadians"
  },
  {
    href: "/petitions",
    icon: FileText,
    label: "Petitions",
    description: "Create and sign citizen petitions"
  },
  {
    href: "/news",
    icon: Newspaper,
    label: "News Analysis",
    description: "AI-analyzed Canadian political news"
  },
  {
    href: "/civic-ledger",
    icon: BarChart3,
    label: "Civic Ledger",
    description: "Transparency and accountability metrics"
  },
  {
    href: "/analytics",
    icon: TrendingUp,
    label: "Platform Analytics",
    description: "User engagement and platform statistics"
  }
];

export default function EnhancedNavigation() {
  const [location] = useLocation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
      {navigationItems.map((item) => {
        const isActive = location === item.href;
        const Icon = item.icon;
        
        return (
          <Link key={item.href} href={item.href}>
            <div className={`
              group p-4 rounded-lg border transition-all duration-200 cursor-pointer
              ${isActive 
                ? 'border-red-500 bg-red-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white'
              }
            `}>
              <div className="flex items-start justify-between mb-3">
                <div className={`
                  p-2 rounded-lg 
                  ${isActive 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }
                `}>
                  <Icon className="h-5 w-5" />
                </div>
                {item.badge && (
                  <Badge 
                    variant={isActive ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              
              <h3 className={`
                font-semibold mb-1 
                ${isActive ? 'text-red-700' : 'text-gray-900'}
              `}>
                {item.label}
              </h3>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}