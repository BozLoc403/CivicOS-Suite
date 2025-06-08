import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Database, Download, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Admin() {
  const [isPopulating, setIsPopulating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const { toast } = useToast();

  const populateDatabase = async () => {
    setIsPopulating(true);
    
    try {
      const response = await fetch('/api/admin/populate-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to populate database: ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: "Database Updated",
        description: "Successfully populated database with real Canadian government data",
      });
      
      setLastUpdate(new Date().toLocaleString());
      
      // Refresh the page to show new data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Error populating database:', error);
      toast({
        title: "Population Failed",
        description: error instanceof Error ? error.message : "Failed to update database",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">CivicOS Administration</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Management
              </CardTitle>
              <CardDescription>
                Populate the platform with real Canadian government data from official sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will fetch current bills and politicians from Parliament of Canada websites including:
                  • House of Commons Members Directory
                  • LEGISinfo Bill Database
                  • Parliament RSS Feeds
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Real Government Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Scrape authentic data from official government sources
                  </p>
                  {lastUpdate && (
                    <p className="text-xs text-green-600 mt-1">
                      Last updated: {lastUpdate}
                    </p>
                  )}
                </div>
                
                <Button 
                  onClick={populateDatabase}
                  disabled={isPopulating}
                  className="min-w-[140px]"
                >
                  {isPopulating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Update Database
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>
                Official Canadian government sources used for data collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <h4 className="font-medium">Parliament of Canada</h4>
                    <p className="text-sm text-muted-foreground">Members directory and voting records</p>
                  </div>
                  <span className="text-green-600 text-sm">Active</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <h4 className="font-medium">LEGISinfo</h4>
                    <p className="text-sm text-muted-foreground">Federal bills and legislation tracking</p>
                  </div>
                  <span className="text-green-600 text-sm">Active</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium">Parliament RSS Feeds</h4>
                    <p className="text-sm text-muted-foreground">Real-time government bill updates</p>
                  </div>
                  <span className="text-green-600 text-sm">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}