import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationHeader } from "@/components/NavigationHeader";
import { VotingModal } from "@/components/VotingModal";
import { Clock, MapPin, Scale, AlertCircle, Vote, FileText } from "lucide-react";
import { useState } from "react";
import type { Bill } from "@shared/schema";

export default function Voting() {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);

  const { data: bills = [], isLoading } = useQuery<Bill[]>({
    queryKey: ["/api/bills"],
  });

  const handleVoteClick = (bill: Bill) => {
    setSelectedBill(bill);
    setIsVotingModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'first reading':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'second reading':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'third reading':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'royal assent':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'finance & economy':
        return '💰';
      case 'healthcare':
        return '🏥';
      case 'environment':
        return '🌍';
      case 'education':
        return '📚';
      case 'defence & security':
        return '🛡️';
      case 'infrastructure':
        return '🏗️';
      default:
        return '📋';
    }
  };

  const formatTimeRemaining = (deadline: string | Date | null) => {
    if (!deadline) return 'No deadline set';
    const now = new Date();
    const end = new Date(deadline);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Voting closed';
    if (diffDays === 0) return 'Last day to vote';
    if (diffDays === 1) return '1 day remaining';
    return `${diffDays} days remaining`;
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Group bills by jurisdiction and category
  const federalBills = bills.filter(bill => bill.jurisdiction === 'Canada' || bill.jurisdiction === 'Federal');
  const provincialBills = bills.filter(bill => !['Canada', 'Federal'].includes(bill.jurisdiction));
  
  const billsByCategory = bills.reduce((acc, bill) => {
    const category = bill.category || 'General Legislation';
    if (!acc[category]) acc[category] = [];
    acc[category].push(bill);
    return acc;
  }, {} as Record<string, Bill[]>);

  const BillCard = ({ bill }: { bill: Bill }) => (
    <Card key={bill.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-civic-blue">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="font-mono text-xs px-2 py-1">
                {bill.billNumber}
              </Badge>
              <Badge className={`text-xs px-2 py-1 border ${getStatusColor(bill.status)}`}>
                {bill.status}
              </Badge>
              <Badge variant="secondary" className="text-xs px-2 py-1">
                <span className="mr-1">{getCategoryIcon(bill.category)}</span>
                {bill.category || 'General'}
              </Badge>
            </div>
            <CardTitle className="text-xl mb-2 text-gray-900 leading-tight">{bill.title}</CardTitle>
            <CardDescription className="text-sm text-gray-600 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {bill.jurisdiction}
              </span>
              <span className="flex items-center gap-1">
                <Scale className="w-3 h-3" />
                Parliamentary Bill
              </span>
            </CardDescription>
          </div>
          <Button 
            onClick={() => handleVoteClick(bill)}
            className="ml-4 bg-civic-blue hover:bg-civic-blue/90 shadow-sm"
            size="sm"
          >
            <Vote className="w-4 h-4 mr-2" />
            Cast Vote
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Bill Summary</h4>
          <p className="text-gray-700 leading-relaxed text-sm">
            {bill.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 bg-gray-50">
            <Clock className="w-4 h-4 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">Voting Deadline</div>
              <div className="text-xs text-gray-600">{formatDate(bill.votingDeadline)}</div>
              <div className="text-xs font-medium">{formatTimeRemaining(bill.votingDeadline)}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 bg-gray-50">
            <FileText className="w-4 h-4 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">Current Status</div>
              <div className="text-xs text-gray-600">{bill.status}</div>
              <div className="text-xs text-gray-500">Parliamentary Process</div>
            </div>
          </div>
        </div>

        {bill.aiSummary && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <span>🤖</span>
              AI Analysis
            </h4>
            <p className="text-blue-800 text-sm leading-relaxed">{bill.aiSummary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <div className="container mx-auto py-8 px-4">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Canadian Legislation</h1>
          <p className="text-gray-600 mb-4">
            Review and vote on authentic bills from Parliament of Canada. All legislation data is sourced directly from official government databases.
          </p>
          <div className="flex gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {bills.length} Active Bills
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Real Government Data
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Live Updates
            </span>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Bills ({bills.length})</TabsTrigger>
            <TabsTrigger value="federal">Federal ({federalBills.length})</TabsTrigger>
            <TabsTrigger value="provincial">Provincial ({provincialBills.length})</TabsTrigger>
            <TabsTrigger value="category">By Category</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {bills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </TabsContent>

          <TabsContent value="federal" className="space-y-6">
            {federalBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </TabsContent>

          <TabsContent value="provincial" className="space-y-6">
            {provincialBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </TabsContent>

          <TabsContent value="category" className="space-y-6">
            {Object.entries(billsByCategory).map(([category, categoryBills]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span>{getCategoryIcon(category)}</span>
                  {category} ({categoryBills.length})
                </h3>
                {categoryBills.map((bill) => (
                  <BillCard key={bill.id} bill={bill} />
                ))}
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {bills.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Vote className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Active Bills</h3>
              <p className="text-gray-500">
                The government data sync is running. New bills will appear as they become available from official sources.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedBill && (
        <VotingModal
          bill={selectedBill}
          isOpen={isVotingModalOpen}
          onClose={() => {
            setIsVotingModalOpen(false);
            setSelectedBill(null);
          }}
        />
      )}
    </div>
  );
}