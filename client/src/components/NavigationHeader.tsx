import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { ChevronDown, Trophy, Zap, Settings, User, LogOut } from "lucide-react";
import { useState } from "react";

export function NavigationHeader() {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    return location === path;
  };

  const navGroups = [
    {
      title: "Overview",
      items: [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/politicians", label: "Politicians" },
        { href: "/news", label: "News" }
      ]
    },
    {
      title: "Participate",
      items: [
        { href: "/voting", label: "Voting" },
        { href: "/petitions", label: "Petitions" },
        { href: "/discussions", label: "Discussions" }
      ]
    },
    {
      title: "Government",
      items: [
        { href: "/elections", label: "Elections" },
        { href: "/legal", label: "Legal System" },
        { href: "/services", label: "Services" },
        { href: "/contacts", label: "Contacts" }
      ]
    },
    {
      title: "Tools",
      items: [
        { href: "/legal-search", label: "Legal Research" },
        { href: "/ledger", label: "Blockchain" }
      ]
    }
  ];

  if (isLoading) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-civic-blue">CivicOS</h1>
              </div>
            </div>
            <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <a className="text-2xl font-bold text-civic-blue hover:text-civic-dark transition-colors">
                  CivicOS
                </a>
              </Link>
            </div>
            
            {user && (
              <nav className="hidden lg:block ml-10">
                <div className="flex items-baseline space-x-6">
                  {navGroups.map((group) => (
                    <div key={group.title} className="relative group">
                      <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-civic-blue transition-colors">
                        {group.title}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-1">
                          {group.items.map((item) => (
                            <Link key={item.href} href={item.href}>
                              <a className={`block px-4 py-2 text-sm transition-colors ${
                                isActive(item.href)
                                  ? "bg-civic-blue text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}>
                                {item.label}
                              </a>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Gamification Stats */}
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-1 bg-amber-50 px-3 py-1 rounded-full">
                    <Trophy className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">
                      Lvl {user.currentLevel || 1}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      {user.civicPoints || 0} pts
                    </span>
                  </div>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    {user.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="h-8 w-8 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-civic-blue text-white flex items-center justify-center text-sm font-medium">
                        {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:block">
                      {user.firstName || user.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <Link href="/profile">
                          <a className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <User className="mr-3 h-4 w-4" />
                            Profile
                          </a>
                        </Link>
                        <Link href="/settings">
                          <a className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Settings className="mr-3 h-4 w-4" />
                            Settings
                          </a>
                        </Link>
                        <div className="border-t border-gray-100"></div>
                        <a 
                          href="/api/logout"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Logout
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <a 
                href="/api/login" 
                className="bg-civic-blue hover:bg-civic-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}