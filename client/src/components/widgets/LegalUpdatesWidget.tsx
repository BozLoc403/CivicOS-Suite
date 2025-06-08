import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scale, ExternalLink, AlertCircle, Clock } from "lucide-react";
import { Link } from "wouter";

interface LegalUpdate {
  id: number;
  type: 'criminal-code' | 'act' | 'case';
  title: string;
  summary: string;
  dateUpdated: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  jurisdiction: string;
  sourceUrl?: string;
}

export default function LegalUpdatesWidget() {
  const { data: legalUpdates = [], isLoading } = useQuery<LegalUpdate[]>({
    queryKey: ['/api/legal/updates'],
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const { data: criminalCode = [], isLoading: criminalLoading } = useQuery({
    queryKey: ['/api/legal/criminal-code'],
    refetchInterval: 60000, // Refresh every minute
  });

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'criminal-code': return <Scale className="h-4 w-4" />;
      case 'case': return <AlertCircle className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  if (isLoading && criminalLoading) {
    return (
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scale className="h-5 w-5" />
            <span>Legal Updates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="h-5 w-5" />
            <span>Legal Updates</span>
          </div>
          <Badge variant="outline" className="text-xs">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto">
        <div className="space-y-3">
          {/* Recent Criminal Code Sections */}
          {criminalCode.slice(0, 2).map((section: any) => (
            <div key={`criminal-${section.id}`} className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Scale className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-sm">Section {section.sectionNumber}</span>
                    <Badge variant="secondary" className="text-xs">Criminal Code</Badge>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{section.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                    {section.explanationSimple || section.content?.substring(0, 100)}...
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${section.isIndictable ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {section.isIndictable ? 'Indictable' : 'Summary'}
                      </Badge>
                      {section.maxPenalty && (
                        <span className="text-xs text-gray-500">Max: {section.maxPenalty}</span>
                      )}
                    </div>
                    <Clock className="h-3 w-3 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Dynamic Legal Updates */}
          {legalUpdates.map((update) => (
            <div key={update.id} className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getTypeIcon(update.type)}
                    <span className="font-medium text-sm">{update.jurisdiction}</span>
                    <Badge className={`text-xs ${getUrgencyColor(update.urgencyLevel)}`}>
                      {update.urgencyLevel}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{update.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                    {update.summary}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {new Date(update.dateUpdated).toLocaleDateString()}
                    </span>
                    {update.sourceUrl && (
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t">
          <Link href="/legal-search">
            <Button variant="outline" size="sm" className="w-full">
              <Scale className="h-4 w-4 mr-2" />
              View Legal Research
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}