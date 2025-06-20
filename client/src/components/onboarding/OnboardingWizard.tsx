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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Welcome to CivicOS</DialogTitle>
          <p className="text-center text-muted-foreground">
            Canada's comprehensive political intelligence platform. What brings you here today?
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {USER_TYPES.map((userType) => (
            <Card 
              key={userType.id}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary"
              onClick={() => handleUserTypeSelect(userType)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 text-primary">
                  {userType.icon}
                </div>
                <CardTitle className="text-lg">{userType.title}</CardTitle>
                <CardDescription>{userType.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {userType.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button variant="outline" onClick={handleSkip}>
            Skip for now
          </Button>
          <Button onClick={() => navigate("/dashboard")}>
            Explore all features
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}