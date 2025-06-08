import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { LuxuryCard } from "@/components/ui/luxury-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  Shield, 
  MapPin, 
  Scale, 
  Users, 
  Home, 
  Briefcase, 
  Heart,
  Search,
  Globe,
  BookOpen,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface ChartRight {
  id: string;
  section: number;
  title: string;
  category: "fundamental" | "democratic" | "mobility" | "legal" | "equality" | "language";
  text: string;
  plainLanguage: string;
  examples: string[];
  limitations?: string[];
  relatedSections?: number[];
  provincialVariations?: Array<{
    province: string;
    variation: string;
    examples: string[];
  }>;
}

interface ProvincialRight {
  id: string;
  province: string;
  title: string;
  category: string;
  description: string;
  plainLanguage: string;
  examples: string[];
  relatedCharter?: number[];
}

export default function RightsPage() {
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Geolocation not available");
        }
      );
    }
  }, []);

  const { data: charterRights = [] } = useQuery<ChartRight[]>({
    queryKey: ["/api/rights/charter"],
  });

  const { data: provincialRights = [] } = useQuery<ProvincialRight[]>({
    queryKey: ["/api/rights/provincial", selectedProvince],
  });

  const { data: detectedProvince } = useQuery<string>({
    queryKey: ["/api/location/province", userLocation?.lat, userLocation?.lng],
    enabled: !!userLocation,
  });

  const provinces = [
    "British Columbia", "Alberta", "Saskatchewan", "Manitoba", "Ontario", 
    "Quebec", "New Brunswick", "Nova Scotia", "Prince Edward Island", 
    "Newfoundland and Labrador", "Northwest Territories", "Nunavut", "Yukon"
  ];

  const categories = [
    { id: "fundamental", name: "Fundamental Freedoms", icon: Shield, color: "bg-blue-500" },
    { id: "democratic", name: "Democratic Rights", icon: Users, color: "bg-green-500" },
    { id: "mobility", name: "Mobility Rights", icon: MapPin, color: "bg-purple-500" },
    { id: "legal", name: "Legal Rights", icon: Scale, color: "bg-orange-500" },
    { id: "equality", name: "Equality Rights", icon: Heart, color: "bg-red-500" },
    { id: "language", name: "Language Rights", icon: Globe, color: "bg-teal-500" }
  ];

  const filteredCharterRights = charterRights.filter(right => {
    const matchesSearch = right.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         right.plainLanguage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || right.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredProvincialRights = provincialRights.filter(right => {
    const matchesSearch = right.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         right.plainLanguage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvince = selectedProvince === "all" || right.province === selectedProvince;
    return matchesSearch && matchesProvince;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-serif text-primary">Your Rights in Canada</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Understanding your fundamental rights and freedoms under the Canadian Charter of Rights and Freedoms 
          and provincial legislation, explained in plain language with real-world examples.
        </p>
        
        {detectedProvince && (
          <div className="flex items-center justify-center space-x-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Detected location: <span className="font-medium text-primary">{detectedProvince}</span>
            </span>
          </div>
        )}
      </motion.div>

      {/* Search and Filters */}
      <LuxuryCard title="Search Your Rights" variant="pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rights and freedoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedProvince} onValueChange={setSelectedProvince}>
            <SelectTrigger>
              <SelectValue placeholder="Select province/territory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Provinces/Territories</SelectItem>
              {provinces.map(province => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </LuxuryCard>

      <Tabs defaultValue="charter" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="charter">Charter Rights</TabsTrigger>
          <TabsTrigger value="provincial">Provincial Rights</TabsTrigger>
          <TabsTrigger value="overview">Rights Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="charter" className="space-y-6">
          {/* Category Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={isActive ? "default" : "outline"}
                    className="w-full h-20 flex flex-col items-center space-y-2"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs text-center">{category.name}</span>
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Charter Rights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCharterRights.map((right, index) => {
              const category = categories.find(c => c.id === right.category);
              const Icon = category?.icon || Shield;
              
              return (
                <motion.div
                  key={right.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <LuxuryCard title={`Section ${right.section}: ${right.title}`} variant="dark">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-5 h-5 text-primary" />
                        <Badge variant="secondary" className="text-xs">
                          {category?.name}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-2 flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            What this means in plain language:
                          </h4>
                          <p className="text-sm text-muted-foreground">{right.plainLanguage}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-2 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Real-world examples:
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {right.examples.map((example, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {right.limitations && (
                          <div>
                            <h4 className="font-medium text-sm mb-2 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Important limitations:
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {right.limitations.map((limitation, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                                  {limitation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {right.provincialVariations && (
                          <div>
                            <h4 className="font-medium text-sm mb-2 flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              Provincial variations:
                            </h4>
                            <div className="space-y-2">
                              {right.provincialVariations.map((variation, idx) => (
                                <div key={idx} className="p-3 bg-muted/50 rounded">
                                  <h5 className="font-medium text-xs">{variation.province}</h5>
                                  <p className="text-xs text-muted-foreground mt-1">{variation.variation}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="text-xs text-muted-foreground border-t pt-2">
                          <strong>Legal text:</strong> {right.text}
                        </div>
                      </div>
                    </div>
                  </LuxuryCard>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="provincial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProvincialRights.map((right, index) => (
              <motion.div
                key={right.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LuxuryCard title={right.title} variant="dark">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <Badge variant="secondary" className="text-xs">
                        {right.province}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {right.category}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">What this means:</h4>
                        <p className="text-sm text-muted-foreground">{right.plainLanguage}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2">Examples:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {right.examples.map((example, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="text-xs text-muted-foreground border-t pt-2">
                        <strong>Description:</strong> {right.description}
                      </div>
                    </div>
                  </div>
                </LuxuryCard>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => {
              const Icon = category.icon;
              const categoryRights = charterRights.filter(r => r.category === category.id);
              
              return (
                <LuxuryCard key={category.id} title={category.name} variant="pulse">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-full ${category.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {categoryRights.length} rights protected
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {categoryRights.slice(0, 3).map(right => (
                        <div key={right.id} className="p-2 bg-muted/50 rounded text-sm">
                          <strong>Section {right.section}:</strong> {right.title}
                        </div>
                      ))}
                      {categoryRights.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{categoryRights.length - 3} more rights
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      View All {category.name}
                    </Button>
                  </div>
                </LuxuryCard>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}