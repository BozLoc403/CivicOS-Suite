import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { FloatingCivicBot } from "@/components/FloatingCivicBot";
import { LuxuryNavigation } from "@/components/layout/LuxuryNavigation";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Voting from "@/pages/voting";
import Ledger from "@/pages/ledger";
import Politicians from "@/pages/politicians";
import Petitions from "@/pages/petitions";
import Discussions from "@/pages/discussions";
import Legal from "@/pages/legal";
import LegalSearch from "@/pages/legal-search";
import Rights from "@/pages/rights";
import Services from "@/pages/services";
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

import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {(isAuthenticated && !isLoading) ? (
        <div className="flex">
          <LuxuryNavigation />
          <main className="flex-1 bg-gradient-civic-ambient min-h-screen overflow-x-auto">
            <div className="p-6">
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/voting" component={Voting} />
                <Route path="/ledger" component={Ledger} />
                <Route path="/politicians" component={Politicians} />
                <Route path="/petitions" component={Petitions} />
                <Route path="/discussions" component={Discussions} />
                <Route path="/legal" component={Legal} />
                <Route path="/legal-search" component={LegalSearch} />
                <Route path="/rights" component={Rights} />
                <Route path="/services" component={Services} />
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
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </div>
      ) : (
        <main>
          <Switch>
            <Route path="/" component={Landing} />
            <Route component={NotFound} />
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
      <FloatingCivicBot />
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
