import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { FloatingCivicBot } from "@/components/FloatingCivicBot";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Voting from "@/pages/voting";
import Ledger from "@/pages/ledger";
import Politicians from "@/pages/politicians";
import Petitions from "@/pages/petitions";
import Discussions from "@/pages/discussions";
import Legal from "@/pages/legal";
import LegalSearch from "@/pages/legal-search";
import Services from "@/pages/services";
import Elections from "@/pages/elections";
import News from "@/pages/news";
import Contacts from "@/pages/contacts";

import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/voting" component={Voting} />
          <Route path="/ledger" component={Ledger} />
          <Route path="/politicians" component={Politicians} />
          <Route path="/petitions" component={Petitions} />
          <Route path="/discussions" component={Discussions} />
          <Route path="/legal" component={Legal} />
          <Route path="/legal-search" component={LegalSearch} />
          <Route path="/services" component={Services} />
          <Route path="/elections" component={Elections} />
          <Route path="/news" component={News} />
          <Route path="/contacts" component={Contacts} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
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
