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
  MessageSquare, 
  Scale, 
  Search,
  Settings,
  Phone,
  Calendar,
  Newspaper,
  User,
  Briefcase,
  X
} from "lucide-react";

const navigationItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/voting", label: "Voting", icon: Vote },
  { path: "/politicians", label: "Politicians", icon: Users },
  { path: "/petitions", label: "Petitions", icon: FileText },
  { path: "/discussions", label: "Discussions", icon: MessageSquare },
  { path: "/legal", label: "Legal System", icon: Scale },
  { path: "/legal-search", label: "Legal Search", icon: Search },
  { path: "/elections", label: "Elections", icon: Calendar },
  { path: "/news", label: "News Analysis", icon: Newspaper },
  { path: "/contacts", label: "Officials", icon: Phone },
  { path: "/services", label: "Services", icon: Briefcase },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function MobileNavigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <Vote className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-foreground">CivicOS</h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeSheet}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-4 py-6">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  
                  return (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start space-x-3 h-12 ${
                          isActive 
                            ? "bg-blue-600 text-white hover:bg-blue-700" 
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={closeSheet}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
                            Active
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  CivicOS v2.1
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Secure Democratic Platform
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}