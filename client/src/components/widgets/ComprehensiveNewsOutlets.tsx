import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Building, 
  Globe, 
  Users,
  TrendingUp,
  Radio,
  Newspaper,
  FileText
} from "lucide-react";

interface NewsOutlet {
  id: string;
  name: string;
  website: string;
  type: 'mainstream' | 'alternative' | 'government' | 'independent';
  bias: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  credibilityScore: number;
  reach: 'national' | 'regional' | 'local' | 'online';
  language: 'english' | 'french' | 'bilingual';
  ownership: string;
  founded: number;
  specialization?: string;
}

export function ComprehensiveNewsOutlets() {
  const newsOutlets: NewsOutlet[] = [
    // Major Mainstream Media
    {
      id: "cbc",
      name: "CBC News",
      website: "cbc.ca",
      type: "government",
      bias: "center",
      credibilityScore: 85,
      reach: "national",
      language: "bilingual",
      ownership: "Government of Canada",
      founded: 1936
    },
    {
      id: "globe",
      name: "The Globe and Mail",
      website: "theglobeandmail.com",
      type: "mainstream",
      bias: "center",
      credibilityScore: 88,
      reach: "national",
      language: "english",
      ownership: "Woodbridge Company",
      founded: 1844
    },
    {
      id: "nationalpost",
      name: "National Post",
      website: "nationalpost.com",
      type: "mainstream",
      bias: "right",
      credibilityScore: 78,
      reach: "national",
      language: "english",
      ownership: "Postmedia Network",
      founded: 1998
    },
    {
      id: "ctv",
      name: "CTV News",
      website: "ctvnews.ca",
      type: "mainstream",
      bias: "center",
      credibilityScore: 83,
      reach: "national",
      language: "english",
      ownership: "Bell Media",
      founded: 1961
    },
    {
      id: "global",
      name: "Global News",
      website: "globalnews.ca",
      type: "mainstream",
      bias: "center",
      credibilityScore: 82,
      reach: "national",
      language: "english",
      ownership: "Corus Entertainment",
      founded: 1974
    },
    {
      id: "torontostar",
      name: "Toronto Star",
      website: "thestar.com",
      type: "mainstream",
      bias: "left",
      credibilityScore: 79,
      reach: "national",
      language: "english",
      ownership: "Torstar Corporation",
      founded: 1892
    },

    // French-Canadian Media
    {
      id: "ledevoir",
      name: "Le Devoir",
      website: "ledevoir.com",
      type: "mainstream",
      bias: "center",
      credibilityScore: 84,
      reach: "regional",
      language: "french",
      ownership: "Independent",
      founded: 1910
    },
    {
      id: "lapresse",
      name: "La Presse",
      website: "lapresse.ca",
      type: "mainstream",
      bias: "center",
      credibilityScore: 82,
      reach: "regional",
      language: "french",
      ownership: "Power Corporation",
      founded: 1884
    },
    {
      id: "radiocanada",
      name: "Radio-Canada",
      website: "ici.radio-canada.ca",
      type: "government",
      bias: "center",
      credibilityScore: 87,
      reach: "national",
      language: "french",
      ownership: "Government of Canada",
      founded: 1936
    },

    // Political Specialist Media
    {
      id: "ipolitics",
      name: "iPolitics",
      website: "ipolitics.ca",
      type: "alternative",
      bias: "center",
      credibilityScore: 81,
      reach: "national",
      language: "english",
      ownership: "Independent",
      founded: 2010,
      specialization: "Politics & Policy"
    },
    {
      id: "hilltimes",
      name: "The Hill Times",
      website: "hilltimes.com",
      type: "alternative",
      bias: "center",
      credibilityScore: 86,
      reach: "national",
      language: "english",
      ownership: "Independent",
      founded: 1989,
      specialization: "Parliamentary Affairs"
    },
    {
      id: "policyoptions",
      name: "Policy Options",
      website: "policyoptions.irpp.org",
      type: "alternative",
      bias: "center",
      credibilityScore: 89,
      reach: "national",
      language: "bilingual",
      ownership: "Institute for Research on Public Policy",
      founded: 1980,
      specialization: "Public Policy Analysis"
    },
    {
      id: "blacklocks",
      name: "Blacklock's Reporter",
      website: "blacklocks.ca",
      type: "alternative",
      bias: "center",
      credibilityScore: 89,
      reach: "national",
      language: "english",
      ownership: "Independent",
      founded: 2012,
      specialization: "Government Accountability"
    },

    // Independent & Alternative Media
    {
      id: "tyee",
      name: "The Tyee",
      website: "thetyee.ca",
      type: "alternative",
      bias: "left",
      credibilityScore: 82,
      reach: "regional",
      language: "english",
      ownership: "Independent",
      founded: 2003,
      specialization: "Progressive Politics"
    },
    {
      id: "canadaland",
      name: "Canadaland",
      website: "canadaland.com",
      type: "alternative",
      bias: "left",
      credibilityScore: 78,
      reach: "national",
      language: "english",
      ownership: "Independent",
      founded: 2013,
      specialization: "Media Criticism"
    },
    {
      id: "nationalobserver",
      name: "National Observer",
      website: "nationalobserver.com",
      type: "alternative",
      bias: "left",
      credibilityScore: 81,
      reach: "national",
      language: "english",
      ownership: "Independent",
      founded: 2015,
      specialization: "Environment & Politics"
    },
    {
      id: "thenarwhal",
      name: "The Narwhal",
      website: "thenarwhal.ca",
      type: "alternative",
      bias: "left",
      credibilityScore: 85,
      reach: "national",
      language: "english",
      ownership: "Independent",
      founded: 2018,
      specialization: "Environmental Journalism"
    },
    {
      id: "truenorth",
      name: "True North",
      website: "tnc.news",
      type: "alternative",
      bias: "right",
      credibilityScore: 65,
      reach: "national",
      language: "english",
      ownership: "Independent",
      founded: 2019,
      specialization: "Conservative Commentary"
    },
    {
      id: "rebelnews",
      name: "Rebel News",
      website: "rebelnews.com",
      type: "alternative",
      bias: "right",
      credibilityScore: 45,
      reach: "national",
      language: "english",
      ownership: "Rebel News Network",
      founded: 2015,
      specialization: "Right-wing Activism"
    },

    // Indigenous Media
    {
      id: "aptn",
      name: "APTN News",
      website: "aptnnews.ca",
      type: "alternative",
      bias: "center",
      credibilityScore: 88,
      reach: "national",
      language: "english",
      ownership: "Aboriginal Peoples Television Network",
      founded: 1999,
      specialization: "Indigenous Affairs"
    },
    {
      id: "windspeaker",
      name: "Windspeaker",
      website: "windspeaker.com",
      type: "alternative",
      bias: "center",
      credibilityScore: 84,
      reach: "national",
      language: "english",
      ownership: "Aboriginal Multi-Media Society",
      founded: 1983,
      specialization: "Indigenous Communities"
    },

    // Additional Regional Media
    {
      id: "ottawacitizen",
      name: "Ottawa Citizen",
      website: "ottawacitizen.com",
      type: "mainstream",
      bias: "center",
      credibilityScore: 76,
      reach: "regional",
      language: "english",
      ownership: "Postmedia Network",
      founded: 1845
    },
    {
      id: "montrealgazette",
      name: "Montreal Gazette",
      website: "montrealgazette.com",
      type: "mainstream",
      bias: "center",
      credibilityScore: 77,
      reach: "regional",
      language: "english",
      ownership: "Postmedia Network",
      founded: 1778
    },
    {
      id: "telegraphjournal",
      name: "Telegraph-Journal",
      website: "telegraphjournal.com",
      type: "mainstream",
      bias: "center",
      credibilityScore: 75,
      reach: "regional",
      language: "english",
      ownership: "Irving Media",
      founded: 1862
    },
    {
      id: "theguardianpei",
      name: "The Guardian (PEI)",
      website: "theguardian.pe.ca",
      type: "mainstream",
      bias: "center",
      credibilityScore: 73,
      reach: "local",
      language: "english",
      ownership: "Transcontinental Media",
      founded: 1870
    },
    {
      id: "thetelegram",
      name: "The Telegram",
      website: "thetelegram.com",
      type: "mainstream",
      bias: "center",
      credibilityScore: 74,
      reach: "regional",
      language: "english",
      ownership: "SaltWire Network",
      founded: 1879
    },

    // Additional French Media
    {
      id: "tvanouvelles",
      name: "TVA Nouvelles",
      website: "tvanouvelles.ca",
      type: "mainstream",
      bias: "center-right",
      credibilityScore: 75,
      reach: "regional",
      language: "french",
      ownership: "Quebecor Media",
      founded: 1961
    },
    {
      id: "lesoleil",
      name: "Le Soleil",
      website: "lesoleil.com",
      type: "mainstream",
      bias: "center",
      credibilityScore: 78,
      reach: "regional",
      language: "french",
      ownership: "Capitales Médias",
      founded: 1896
    },

    // Northern/Territorial Media
    {
      id: "whitehorsestar",
      name: "Whitehorse Star",
      website: "whitehorsestar.com",
      type: "mainstream",
      bias: "center",
      credibilityScore: 72,
      reach: "local",
      language: "english",
      ownership: "Independent",
      founded: 1900,
      specialization: "Northern Affairs"
    },
    {
      id: "yellowknifer",
      name: "Yellowknifer",
      website: "nnsl.com/yellowknifer",
      type: "mainstream",
      bias: "center",
      credibilityScore: 71,
      reach: "local",
      language: "english",
      ownership: "Northern News Services",
      founded: 1977,
      specialization: "Northern Affairs"
    },
    {
      id: "nunavutnews",
      name: "Nunavut News",
      website: "nunavutnews.com",
      type: "mainstream",
      bias: "center",
      credibilityScore: 70,
      reach: "local",
      language: "english",
      ownership: "Northern News Services",
      founded: 1999,
      specialization: "Arctic Affairs"
    },

    // Additional Independent Media
    {
      id: "ricochet",
      name: "Ricochet",
      website: "ricochet.media",
      type: "alternative",
      bias: "left",
      credibilityScore: 79,
      reach: "national",
      language: "bilingual",
      ownership: "Independent",
      founded: 2014,
      specialization: "Investigative Journalism"
    },
    {
      id: "theenergymix",
      name: "The Energy Mix",
      website: "theenergymix.com",
      type: "alternative",
      bias: "left",
      credibilityScore: 83,
      reach: "national",
      language: "english",
      ownership: "Independent",
      founded: 2016,
      specialization: "Climate & Energy"
    },
    {
      id: "westernstandard",
      name: "Western Standard",
      website: "westernstandard.news",
      type: "alternative",
      bias: "right",
      credibilityScore: 62,
      reach: "regional",
      language: "english",
      ownership: "Independent",
      founded: 2020,
      specialization: "Western Canadian Politics"
    },
    {
      id: "postmillennial",
      name: "The Post Millennial",
      website: "thepostmillennial.com",
      type: "alternative",
      bias: "right",
      credibilityScore: 58,
      reach: "national",
      language: "english",
      ownership: "Independent",
      founded: 2017,
      specialization: "Conservative Commentary"
    },

    // Professional/Specialized Media
    {
      id: "lawtimes",
      name: "Law Times",
      website: "lawtimesnews.com",
      type: "alternative",
      bias: "center",
      credibilityScore: 85,
      reach: "national",
      language: "english",
      ownership: "Thomson Reuters",
      founded: 1991,
      specialization: "Legal Affairs"
    },
    {
      id: "canadianlawyermag",
      name: "Canadian Lawyer",
      website: "canadianlawyermag.com",
      type: "alternative",
      bias: "center",
      credibilityScore: 87,
      reach: "national",
      language: "english",
      ownership: "Key Media",
      founded: 1977,
      specialization: "Legal Profession"
    }
  ];

  const getCredibilityColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50 dark:bg-green-950";
    if (score >= 75) return "text-blue-600 bg-blue-50 dark:bg-blue-950";
    if (score >= 65) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950";
    if (score >= 55) return "text-orange-600 bg-orange-50 dark:bg-orange-950";
    return "text-red-600 bg-red-50 dark:bg-red-950";
  };

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case 'center-left': return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
      case 'center': return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case 'center-right': return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case 'right': return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'government': return <Building className="w-4 h-4" />;
      case 'mainstream': return <Newspaper className="w-4 h-4" />;
      case 'alternative': return <Radio className="w-4 h-4" />;
      case 'independent': return <Users className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filterOutletsByType = (type: string) => {
    if (type === 'all') return newsOutlets;
    return newsOutlets.filter(outlet => outlet.type === type);
  };

  const filterOutletsByLanguage = (language: string) => {
    if (language === 'all') return newsOutlets;
    return newsOutlets.filter(outlet => outlet.language === language || outlet.language === 'bilingual');
  };

  const getOverallStats = () => {
    const total = newsOutlets.length;
    const avgCredibility = Math.round(newsOutlets.reduce((sum, outlet) => sum + outlet.credibilityScore, 0) / total);
    const typeDistribution = newsOutlets.reduce((acc, outlet) => {
      acc[outlet.type] = (acc[outlet.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, avgCredibility, typeDistribution };
  };

  const stats = getOverallStats();

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
            <Globe className="w-6 h-6 mr-2" />
            Comprehensive Canadian News Media Analysis
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Total Outlets</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.avgCredibility}%</div>
              <div className="text-sm text-green-600 dark:text-green-400">Avg Credibility</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.typeDistribution.mainstream || 0}</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Mainstream</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.typeDistribution.alternative || 0}</div>
              <div className="text-sm text-orange-600 dark:text-orange-400">Independent</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All Sources</TabsTrigger>
          <TabsTrigger value="mainstream">Mainstream</TabsTrigger>
          <TabsTrigger value="alternative">Independent</TabsTrigger>
          <TabsTrigger value="government">Government</TabsTrigger>
          <TabsTrigger value="french">French</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="specialist">Specialist</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsOutlets.map((outlet) => (
              <NewsOutletCard key={outlet.id} outlet={outlet} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mainstream" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterOutletsByType('mainstream').map((outlet) => (
              <NewsOutletCard key={outlet.id} outlet={outlet} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alternative" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterOutletsByType('alternative').map((outlet) => (
              <NewsOutletCard key={outlet.id} outlet={outlet} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="government" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterOutletsByType('government').map((outlet) => (
              <NewsOutletCard key={outlet.id} outlet={outlet} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="french" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterOutletsByLanguage('french').map((outlet) => (
              <NewsOutletCard key={outlet.id} outlet={outlet} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="regional" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsOutlets.filter(outlet => outlet.reach === 'regional' || outlet.reach === 'local').map((outlet) => (
              <NewsOutletCard key={outlet.id} outlet={outlet} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="specialist" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsOutlets.filter(outlet => outlet.specialization).map((outlet) => (
              <NewsOutletCard key={outlet.id} outlet={outlet} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NewsOutletCard({ outlet }: { outlet: NewsOutlet }) {
  const getCredibilityColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50 dark:bg-green-950";
    if (score >= 75) return "text-blue-600 bg-blue-50 dark:bg-blue-950";
    if (score >= 65) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950";
    if (score >= 55) return "text-orange-600 bg-orange-50 dark:bg-orange-950";
    return "text-red-600 bg-red-50 dark:bg-red-950";
  };

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case 'center-left': return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
      case 'center': return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case 'center-right': return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case 'right': return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'government': return <Building className="w-4 h-4" />;
      case 'mainstream': return <Newspaper className="w-4 h-4" />;
      case 'alternative': return <Radio className="w-4 h-4" />;
      case 'independent': return <Users className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{outlet.name}</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">{outlet.website}</p>
          </div>
          <div className="flex items-center space-x-1">
            {getTypeIcon(outlet.type)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Credibility Score</span>
          <div className={`px-2 py-1 rounded text-sm font-bold ${getCredibilityColor(outlet.credibilityScore)}`}>
            {outlet.credibilityScore}%
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={outlet.credibilityScore} className="h-2" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={getBiasColor(outlet.bias)}>
            {outlet.bias}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {outlet.type}
          </Badge>
          <Badge variant="secondary" className="capitalize">
            {outlet.language}
          </Badge>
        </div>

        {outlet.specialization && (
          <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded text-sm">
            <span className="font-medium">Focus: </span>
            {outlet.specialization}
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>Founded: {outlet.founded}</div>
          <div>Ownership: {outlet.ownership}</div>
          <div className="capitalize">Reach: {outlet.reach}</div>
        </div>
      </CardContent>
    </Card>
  );
}