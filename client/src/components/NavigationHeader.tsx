import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Vote, Bell } from "lucide-react";
import type { Notification } from "@shared/schema";

export function NavigationHeader() {
  const { user } = useAuth();
  const [location] = useLocation();

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Vote className="civic-blue text-2xl mr-3" />
              <h1 className="text-xl font-bold civic-gray">CivicOS</h1>
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/">
                <a className={`px-1 pb-4 text-sm font-medium transition-colors ${
                  isActive("/") 
                    ? "civic-blue border-b-2 border-civic-blue" 
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                  Dashboard
                </a>
              </Link>
              <Link href="/voting">
                <a className={`px-1 pb-4 text-sm font-medium transition-colors ${
                  isActive("/voting") 
                    ? "civic-blue border-b-2 border-civic-blue" 
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                  Active Votes
                </a>
              </Link>
              <Link href="/ledger">
                <a className={`px-1 pb-4 text-sm font-medium transition-colors ${
                  isActive("/ledger") 
                    ? "civic-blue border-b-2 border-civic-blue" 
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                  My Ledger
                </a>
              </Link>
              <Link href="/politicians">
                <a className={`px-1 pb-4 text-sm font-medium transition-colors ${
                  isActive("/politicians") 
                    ? "civic-blue border-b-2 border-civic-blue" 
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                  Politicians
                </a>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-civic-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </button>
            
            {/* User Info */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-civic-blue rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {getInitials(user?.firstName, user?.lastName)}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.firstName || "Citizen"}
              </span>
            </div>
            
            {/* Logout */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
              className="hidden sm:inline-flex"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
