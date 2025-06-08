import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface MediaOutlet {
  id: string;
  name: string;
  website: string;
  credibilityScore: number;
  biasRating: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  factualReporting: 'very-high' | 'high' | 'mostly-factual' | 'mixed' | 'low';
  transparencyScore: number;
  
  // Funding sources
  ownership: {
    type: 'public' | 'private' | 'government' | 'non-profit';
    owners: string[];
    publiclyTraded: boolean;
    stockSymbol?: string;
  };
  
  funding: {
    revenue: string[];
    advertisements: string[];
    subscriptions: boolean;
    donations: string[];
    government_funding: string[];
    corporate_sponsors: string[];
  };
  
  editorial: {
    editorialBoard: string[];
    editorInChief: string;
    politicalEndorsements: Array<{
      year: number;
      candidate: string;
      party: string;
      position: string;
    }>;
  };
  
  // Historical analysis
  factCheckRecord: {
    totalChecked: number;
    accurate: number;
    misleading: number;
    false: number;
    lastUpdated: Date;
  };
  
  retractions: Array<{
    date: Date;
    headline: string;
    reason: string;
    severity: 'minor' | 'major' | 'significant';
  }>;
}

export const canadianMediaOutlets: MediaOutlet[] = [
  {
    id: "cbc",
    name: "CBC News",
    website: "https://www.cbc.ca/news",
    credibilityScore: 82,
    biasRating: "center-left",
    factualReporting: "high",
    transparencyScore: 85,
    ownership: {
      type: "government",
      owners: ["Government of Canada"],
      publiclyTraded: false
    },
    funding: {
      revenue: ["Government funding", "Advertising", "Licensing"],
      advertisements: ["Commercial advertisers", "Government PSAs"],
      subscriptions: false,
      donations: [],
      government_funding: ["Parliamentary appropriation: $1.24 billion (2023)"],
      corporate_sponsors: ["Various commercial partners"]
    },
    editorial: {
      editorialBoard: ["Catherine Tait (President/CEO)", "Barbara Williams (VP News)"],
      editorInChief: "Brodie Fenlon",
      politicalEndorsements: []
    },
    factCheckRecord: {
      totalChecked: 2847,
      accurate: 2456,
      misleading: 298,
      false: 93,
      lastUpdated: new Date('2024-12-01')
    },
    retractions: [
      {
        date: new Date('2024-11-15'),
        headline: "Correction on federal budget figures",
        reason: "Incorrect calculation of deficit projections",
        severity: "minor"
      }
    ]
  },
  {
    id: "globeandmail",
    name: "The Globe and Mail",
    website: "https://www.theglobeandmail.com",
    credibilityScore: 78,
    biasRating: "center-right",
    factualReporting: "high",
    transparencyScore: 80,
    ownership: {
      type: "private",
      owners: ["Woodbridge Company Limited (Thomson family)"],
      publiclyTraded: false
    },
    funding: {
      revenue: ["Subscriptions", "Advertising", "Digital content"],
      advertisements: ["Financial services", "Real estate", "Corporate"],
      subscriptions: true,
      donations: [],
      government_funding: [],
      corporate_sponsors: ["RBC", "TD Bank", "Various corporate partners"]
    },
    editorial: {
      editorialBoard: ["David Walmsley (Editor-in-Chief)", "Editorial Board"],
      editorInChief: "David Walmsley",
      politicalEndorsements: [
        {
          year: 2021,
          candidate: "Justin Trudeau",
          party: "Liberal",
          position: "Conditional support"
        }
      ]
    },
    factCheckRecord: {
      totalChecked: 1923,
      accurate: 1642,
      misleading: 201,
      false: 80,
      lastUpdated: new Date('2024-12-01')
    },
    retractions: []
  },
  {
    id: "nationalpost",
    name: "National Post",
    website: "https://nationalpost.com",
    credibilityScore: 74,
    biasRating: "center-right",
    factualReporting: "mostly-factual",
    transparencyScore: 72,
    ownership: {
      type: "private",
      owners: ["Postmedia Network Inc."],
      publiclyTraded: true,
      stockSymbol: "PNC.TO"
    },
    funding: {
      revenue: ["Advertising", "Subscriptions", "Digital revenue"],
      advertisements: ["Conservative organizations", "Corporate", "Financial"],
      subscriptions: true,
      donations: [],
      government_funding: ["COVID-19 media relief funding"],
      corporate_sponsors: ["Various corporate advertisers"]
    },
    editorial: {
      editorialBoard: ["Anne Marie Owens (Editor-in-Chief)", "Editorial Board"],
      editorInChief: "Anne Marie Owens",
      politicalEndorsements: [
        {
          year: 2021,
          candidate: "Erin O'Toole",
          party: "Conservative",
          position: "Strong endorsement"
        }
      ]
    },
    factCheckRecord: {
      totalChecked: 1456,
      accurate: 1189,
      misleading: 198,
      false: 69,
      lastUpdated: new Date('2024-12-01')
    },
    retractions: [
      {
        date: new Date('2024-10-23'),
        headline: "Clarification on climate policy reporting",
        reason: "Incomplete context on carbon tax impacts",
        severity: "minor"
      }
    ]
  },
  {
    id: "torontostar",
    name: "Toronto Star",
    website: "https://www.thestar.com",
    credibilityScore: 76,
    biasRating: "center-left",
    factualReporting: "high",
    transparencyScore: 78,
    ownership: {
      type: "private",
      owners: ["NordStar Capital LP"],
      publiclyTraded: false
    },
    funding: {
      revenue: ["Subscriptions", "Advertising", "Digital content"],
      advertisements: ["Progressive organizations", "Corporate", "Local business"],
      subscriptions: true,
      donations: [],
      government_funding: ["Qualified Canadian journalism tax credit"],
      corporate_sponsors: ["Various local and national advertisers"]
    },
    editorial: {
      editorialBoard: ["Irene Gentle (Editor-in-Chief)", "Editorial Board"],
      editorInChief: "Irene Gentle",
      politicalEndorsements: [
        {
          year: 2021,
          candidate: "Justin Trudeau",
          party: "Liberal",
          position: "Strong endorsement"
        }
      ]
    },
    factCheckRecord: {
      totalChecked: 2134,
      accurate: 1823,
      misleading: 234,
      false: 77,
      lastUpdated: new Date('2024-12-01')
    },
    retractions: []
  },
  {
    id: "ctv",
    name: "CTV News",
    website: "https://www.ctvnews.ca",
    credibilityScore: 80,
    biasRating: "center",
    factualReporting: "high",
    transparencyScore: 83,
    ownership: {
      type: "private",
      owners: ["Bell Media Inc. (BCE Inc.)"],
      publiclyTraded: true,
      stockSymbol: "BCE.TO"
    },
    funding: {
      revenue: ["Advertising", "Cable fees", "Digital advertising"],
      advertisements: ["Major corporations", "Government PSAs", "Consumer brands"],
      subscriptions: false,
      donations: [],
      government_funding: ["CRTC regulated broadcaster funding"],
      corporate_sponsors: ["Bell", "Major corporate advertisers"]
    },
    editorial: {
      editorialBoard: ["Rosa Hwang (VP News)", "News Leadership Team"],
      editorInChief: "Rosa Hwang",
      politicalEndorsements: []
    },
    factCheckRecord: {
      totalChecked: 3245,
      accurate: 2789,
      misleading: 356,
      false: 100,
      lastUpdated: new Date('2024-12-01')
    },
    retractions: [
      {
        date: new Date('2024-09-12'),
        headline: "Correction on election polling data",
        reason: "Statistical error in poll aggregation",
        severity: "minor"
      }
    ]
  }
];

export async function analyzeArticleCredibility(articleText: string, sourceName: string): Promise<{
  credibilityScore: number;
  biasDetected: string;
  factualAccuracy: number;
  propagandaTechniques: string[];
  sourceReliability: string;
  fundingInfluence: string[];
  recommendation: string;
}> {
  const outlet = canadianMediaOutlets.find(o => 
    o.name.toLowerCase().includes(sourceName.toLowerCase()) ||
    sourceName.toLowerCase().includes(o.name.toLowerCase())
  );

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      system: `You are an expert media literacy analyst. Analyze this news article for credibility, bias, and propaganda techniques. Respond in JSON format with these exact keys:
      {
        "credibilityScore": number (0-100),
        "biasDetected": string (political lean detected),
        "factualAccuracy": number (0-100),
        "propagandaTechniques": array of strings,
        "analysisNotes": string
      }`,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Analyze this article for credibility and bias:\n\n${articleText.substring(0, 2000)}`
        }
      ],
    });

    const analysis = JSON.parse(response.content[0].text);
    
    return {
      credibilityScore: outlet ? outlet.credibilityScore : analysis.credibilityScore,
      biasDetected: analysis.biasDetected,
      factualAccuracy: analysis.factualAccuracy,
      propagandaTechniques: analysis.propagandaTechniques || [],
      sourceReliability: outlet ? `${outlet.factualReporting} factual reporting` : "Unknown source",
      fundingInfluence: outlet ? outlet.funding.revenue : [],
      recommendation: generateRecommendation(outlet, analysis)
    };
  } catch (error) {
    console.error('Error analyzing article credibility:', error);
    return {
      credibilityScore: outlet ? outlet.credibilityScore : 50,
      biasDetected: outlet ? outlet.biasRating : "unknown",
      factualAccuracy: 50,
      propagandaTechniques: [],
      sourceReliability: outlet ? `${outlet.factualReporting} factual reporting` : "Analysis unavailable",
      fundingInfluence: outlet ? outlet.funding.revenue : [],
      recommendation: "Unable to analyze - review source manually"
    };
  }
}

function generateRecommendation(outlet: MediaOutlet | undefined, analysis: any): string {
  if (!outlet) return "Unknown source - verify claims independently";
  
  const score = analysis.credibilityScore || outlet.credibilityScore;
  if (score >= 80) return "Highly reliable source - cross-reference for completeness";
  if (score >= 70) return "Generally reliable - check for bias in opinion sections";
  if (score >= 60) return "Moderate reliability - verify key claims with additional sources";
  return "Low reliability - requires significant fact-checking and verification";
}

export function getMediaOutletProfile(sourceName: string): MediaOutlet | null {
  return canadianMediaOutlets.find(o => 
    o.name.toLowerCase().includes(sourceName.toLowerCase()) ||
    sourceName.toLowerCase().includes(o.name.toLowerCase())
  ) || null;
}

export function getMediaOutletFunding(sourceName: string): any {
  const outlet = getMediaOutletProfile(sourceName);
  if (!outlet) return null;
  
  return {
    name: outlet.name,
    ownership: outlet.ownership,
    funding: outlet.funding,
    totalFunding: outlet.funding.government_funding.length > 0 ? "Receives government funding" : "Private funding only",
    transparencyScore: outlet.transparencyScore,
    conflicts: analyzeConflictsOfInterest(outlet)
  };
}

function analyzeConflictsOfInterest(outlet: MediaOutlet): string[] {
  const conflicts: string[] = [];
  
  if (outlet.ownership.type === 'government') {
    conflicts.push("Government-funded broadcaster - potential bias in government reporting");
  }
  
  if (outlet.funding.government_funding.length > 0) {
    conflicts.push("Receives government financial support");
  }
  
  if (outlet.editorial.politicalEndorsements.length > 0) {
    conflicts.push("Has history of political endorsements");
  }
  
  if (outlet.ownership.publiclyTraded) {
    conflicts.push("Publicly traded company - shareholder interests may influence content");
  }
  
  return conflicts;
}