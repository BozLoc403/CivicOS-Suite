import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Newspaper, Vote, Users, FileText, Search, Scale } from "lucide-react";

interface UserType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  features: string[];
}

const USER_TYPES: UserType[] = [
  {
    id: "citizen",
    title: "Engaged Citizen",
    description: "Stay informed and participate in democracy",
    icon: <Vote className="h-8 w-8" />,
    route: "/dashboard",
    features: ["Vote on issues", "Track politician promises", "Join discussions"]
  },
  {
    id: "journalist",
    title: "Journalist / Reporter",
    description: "Research politicians and track accountability",
    icon: <Newspaper className="h-8 w-8" />,
    route: "/politicians",
    features: ["Politician profiles", "Voting records", "Trust scores"]
  },
  {
    id: "researcher",
    title: "FOI Researcher",
    description: "Access government transparency data",
    icon: <Search className="h-8 w-8" />,
    route: "/legal",
    features: ["Legal database", "Government contracts", "Access to information"]
  },
  {
    id: "activist",
    title: "Political Activist",
    description: "Organize campaigns and track legislation",
    icon: <Users className="h-8 w-8" />,
    route: "/bills",
    features: ["Bill tracking", "Community forums", "Petition management"]
  },
  {
    id: "developer",
    title: "Developer / Analyst",
    description: "Access APIs and data for civic tech",
    icon: <FileText className="h-8 w-8" />,
    route: "/news",
    features: ["News analysis", "Data exports", "API access"]
  },
  {
    id: "legal",
    title: "Legal Professional",
    description: "Research laws, cases, and regulations",
    icon: <Scale className="h-8 w-8" />,
    route: "/legal",
    features: ["Criminal Code", "Court cases", "Legal precedents"]
  }
];

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingWizard({ isOpen, onClose }: OnboardingWizardProps) {
  const [, navigate] = useLocation();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleUserTypeSelect = (userType: UserType) => {
    setSelectedType(userType.id);
    
    // Store user preference
    localStorage.setItem('civicos_user_type', userType.id);
    localStorage.setItem('civicos_onboarding_completed', 'true');
    
    // Navigate to recommended route
    navigate(userType.route);
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('civicos_onboarding_completed', 'true');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 backdrop-blur-sm border-slate-200 dark:border-slate-700 w-[95vw] sm:w-full p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent font-serif">
            Welcome to CivicOS
          </DialogTitle>
          <p className="text-center text-muted-foreground font-medium">
            Canada's comprehensive political intelligence platform. What brings you here today?
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6">
          {USER_TYPES.map((userType) => (
            <Card 
              key={userType.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-primary bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
              onClick={() => handleUserTypeSelect(userType)}
            >
              <CardHeader className="text-center pb-3 sm:pb-4">
                <div className="mx-auto mb-2 text-primary p-2 sm:p-3 rounded-full bg-primary/10 dark:bg-primary/20">
                  {userType.icon}
                </div>
                <CardTitle className="text-base sm:text-lg font-serif">{userType.title}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">{userType.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1 text-xs sm:text-sm">
                  {userType.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2 flex-shrink-0"></span>
                      <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6">
          <Button 
            variant="outline" 
            onClick={handleSkip}
            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-300 dark:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-800/80 w-full sm:w-auto"
          >
            Skip for now
          </Button>
          <Button 
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg w-full sm:w-auto"
          >
            Explore all features
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}