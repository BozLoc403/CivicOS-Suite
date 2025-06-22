import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FloatingChatButton } from "@/components/FloatingChatButton";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import { LuxuryNavigation } from "@/components/layout/LuxuryNavigation";
import { MobileNavigation } from "@/components/MobileNavigation";
import Landing from "@/pages/landing";
import About from "@/pages/about";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Contact from "@/pages/contact";
import Accessibility from "@/pages/accessibility";
import Dashboard from "@/pages/dashboard";
import Voting from "@/pages/voting";
import Ledger from "@/pages/ledger";
import Politicians from "@/pages/politicians";
import Petitions from "@/pages/petitions";
import Discussions from "@/pages/discussions";
import Legal from "@/pages/legal";
import LegalSearch from "@/pages/legal-search";
import Rights from "@/pages/rights";
import Auth from "@/pages/auth";

import Elections from "@/pages/elections";
import Finance from "@/pages/finance";
import Lobbyists from "@/pages/lobbyists";
import Procurement from "@/pages/procurement";
import Memory from "@/pages/memory";
import Cases from "@/pages/cases";
import News from "@/pages/news";
import Contacts from "@/pages/contacts";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import FOI from "@/pages/foi";
import Leaks from "@/pages/leaks";
import Whistleblower from "@/pages/whistleblower";
import Corruption from "@/pages/corruption";
import Pulse from "@/pages/pulse";
import Trust from "@/pages/trust";
import Maps from "@/pages/maps";
import Notifications from "@/pages/notifications";
import UserProfile from "@/pages/user-profile";
import IdentityVerification from "@/pages/identity-verification";
import IdentityReview from "@/pages/admin/identity-review";
import Manifesto from "@/pages/manifesto";
import NotFound from "@/pages/not-found";
import Donate from "@/pages/donate";
import Analytics from "@/pages/analytics";
import CivicHub from "@/pages/civic-hub";
import PoliticalCalendar from "@/pages/political-calendar";
import Representatives from "@/pages/representatives";
import Trends from "@/pages/trends";
import canadianCrest from "@assets/ChatGPT Image Jun 20, 2025, 06_03_54 PM_1750464244456.png";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [hasAgreedToManifesto, setHasAgreedToManifesto] = useState(() => {
    return localStorage.getItem('civicos-manifesto-agreed') === 'true';
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading CivicOS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && hasAgreedToManifesto ? (
        <div className="flex">
          <LuxuryNavigation />
          <main className="flex-1 bg-gradient-civic-ambient min-h-screen overflow-x-auto">
            {/* Mobile Navigation */}
            <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center shadow-lg border border-slate-600 overflow-hidden">
                    <img 
                      src={canadianCrest} 
                      alt="CivicOS" 
                      className="w-6 h-6 object-contain rounded-full"
                    />
                  </div>
                  <h1 className="text-lg font-bold font-serif text-slate-900 dark:text-slate-100">CivicOS</h1>
                </div>
                <div className="flex items-center space-x-2">
                  <MobileNavigation />
                </div>
              </div>
            </div>
            <div className="p-2 sm:p-4 lg:p-6">
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/voting" component={Voting} />
                <Route path="/ledger" component={Ledger} />
                <Route path="/politicians" component={Politicians} />
                <Route path="/petitions" component={Petitions} />
                <Route path="/discussions" component={Discussions} />
                <Route path="/legal" component={Legal} />
                <Route path="/legal-search" component={LegalSearch} />
                <Route path="/rights" component={Rights} />

                <Route path="/elections" component={Elections} />
                <Route path="/news" component={News} />
                <Route path="/contacts" component={Contacts} />
                <Route path="/profile" component={Profile} />
                <Route path="/settings" component={Settings} />
                <Route path="/finance" component={Finance} />
                <Route path="/lobbyists" component={Lobbyists} />
                <Route path="/procurement" component={Procurement} />
                <Route path="/memory" component={Memory} />
                <Route path="/cases" component={Cases} />
                <Route path="/foi" component={FOI} />
                <Route path="/leaks" component={Leaks} />
                <Route path="/whistleblower" component={Whistleblower} />
                <Route path="/corruption" component={Corruption} />
                <Route path="/pulse" component={Pulse} />
                <Route path="/trust" component={Trust} />
                <Route path="/maps" component={Maps} />
                <Route path="/manifesto" component={Manifesto} />
                <Route path="/identity-verification" component={IdentityVerification} />
                <Route path="/admin/identity-review" component={IdentityReview} />
                <Route path="/notifications" component={Notifications} />
                <Route path="/users/:userId" component={UserProfile} />
                <Route path="/donate" component={Donate} />
                <Route path="/analytics" component={Analytics} />
                <Route path="/civic-hub" component={CivicHub} />
                <Route path="/calendar" component={PoliticalCalendar} />
                <Route path="/representatives" component={Representatives} />
                <Route path="*">
                  {() => <NotFound />}
                </Route>
              </Switch>
            </div>
          </main>
        </div>
      ) : isAuthenticated && !hasAgreedToManifesto ? (
        <main>
          <Manifesto onAgree={() => setHasAgreedToManifesto(true)} />
        </main>
      ) : (
        <main>
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/about" component={About} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={Terms} />
            <Route path="/contact" component={Contact} />
            <Route path="/accessibility" component={Accessibility} />
            <Route path="/auth" component={Auth} />
            <Route path="/login" component={Auth} />
            <Route path="/register" component={Auth} />
            <Route path="/manifesto" component={Manifesto} />
            <Route path="/donate" component={Donate} />
            <Route path="/civic-hub" component={CivicHub} />
            <Route path="/calendar" component={PoliticalCalendar} />
            <Route path="/representatives" component={Representatives} />
            <Route path="/trends" component={Trends} />
            <Route path="*">
              {() => <NotFound />}
            </Route>
          </Switch>
        </main>
      )}
    </div>
  );
}

function AppWithBot() {
  return (
    <>
      <Router />
      <FloatingChatButton />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppWithBot />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
