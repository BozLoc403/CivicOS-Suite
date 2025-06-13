import { db } from "./db";
import { forumCategories, forumSubcategories, forumPosts, bills, users } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Populate forum with comprehensive categories, subcategories, and initial civic discussion topics
 */
export class ForumPopulator {
  
  async populateInitialDiscussions(): Promise<void> {
    console.log('Populating forum with civic discussion categories and topics...');
    
    try {
      // First, create comprehensive categories and subcategories
      await this.createCategories();
      await this.createSubcategories();
      
      // Get categories
      const categories = await db.select().from(forumCategories);
      const categoryMap = new Map(categories.map(c => [c.name, c.id]));
      
      // Get subcategories
      const subcategories = await db.select().from(forumSubcategories);
      const subcategoryMap = new Map(subcategories.map(s => [s.name, s.id]));
      
      // Get sample bills for discussion
      const recentBills = await db.select().from(bills).limit(5);
      
      // Get admin user for initial posts
      const adminUser = await db.select().from(users).where(eq(users.email, 'jordan@iron-oak.ca')).limit(1);
      const adminId = adminUser[0]?.id || '42199639';

      const discussionTopics = [
        {
          title: "Federal Budget 2024: Impact on Canadian Families",
          content: `The 2024 federal budget has introduced several key measures affecting Canadian families:

• Enhanced Canada Child Benefit indexation
• New housing affordability measures
• Increased investment in healthcare
• Changes to small business taxation

What are your thoughts on these budget priorities? How will they affect your community?

Key Questions:
- Are the housing measures sufficient to address affordability?
- Will the healthcare investments reach your province effectively?
- How do these changes compare to previous budgets?

Share your analysis and local perspective on these federal initiatives.`,
          categoryId: categoryMap.get("Federal Politics") || 1,
          subcategoryId: subcategoryMap.get("Prime Minister & Cabinet"),
          isSticky: true
        },
        {
          title: "Bill C-11: Online Streaming Act - Impact on Content Creation",
          content: `Bill C-11 (Online Streaming Act) has passed and will regulate streaming platforms like Netflix, YouTube, and TikTok in Canada.

Key Provisions:
• CRTC oversight of digital platforms
• Canadian content requirements for streamers
• Support for Canadian creators and producers
• Protection for user-generated content

Discussion Points:
- Will this help Canadian creators compete globally?
- Are there concerns about content regulation?
- How might this affect what we watch and create?

What's your take on government regulation of digital platforms? Share examples of how this might impact content you consume or create.`,
          categoryId: categoryMap.get("Bill Analysis") || 5,
          billId: recentBills[0]?.id
        },
        {
          title: "Municipal Elections 2024: Key Issues Across Canada",
          content: `Municipal elections are happening across Canada with several critical local issues:

Common Themes:
• Housing density and zoning reforms
• Public transit expansion
• Climate action at the local level
• Property tax and budget priorities
• Infrastructure maintenance and upgrades

Regional Variations:
- Vancouver: Housing crisis and drug policy
- Toronto: Transit and affordability
- Montreal: Language policy and development
- Calgary: Economic diversification
- Smaller cities: Service delivery and growth management

What are the key issues in your municipality? Which candidates or policies do you support and why?`,
          categoryId: categoryMap.get("Municipal Affairs") || 3,
          isSticky: true
        },
        {
          title: "Charter Rights in the Digital Age: Privacy vs Security",
          content: `Recent court cases and legislation raise important questions about Charter rights in our digital world:

Current Issues:
• Government surveillance powers
• Data collection by tech companies
• AI and algorithmic decision-making
• Online speech and expression rights

Legal Questions:
- How should we balance privacy with public safety?
- Are current laws adequate for protecting digital rights?
- What role should government play in regulating tech companies?

Share your thoughts on how Charter rights should apply in the digital age. What protections do you think are most important?`,
          categoryId: categoryMap.get("Legal & Rights") || 4,
          subcategoryId: subcategoryMap.get("Charter of Rights")
        },
        {
          title: "Provincial Healthcare Negotiations: Federal vs Provincial Roles",
          content: `Healthcare negotiations between federal and provincial governments continue to evolve:

Key Issues:
• Federal health transfer payments
• Provincial autonomy in healthcare delivery
• Wait times and access to services
• Mental health and addiction services
• Long-term care standards

Provincial Perspectives:
- Some provinces want more federal funding
- Others prioritize provincial autonomy
- Different approaches to private healthcare
- Varying success with healthcare innovation

How do you think healthcare responsibilities should be divided between federal and provincial governments? What's working well in your province?`,
          categoryId: categoryMap.get("Provincial & Territorial") || 2,
          isSticky: true
        },
        {
          title: "Civic Engagement: How to Make Your Voice Heard",
          content: `Democracy works best when citizens are actively engaged. Here are ways to participate:

Formal Channels:
• Voting in all elections (federal, provincial, municipal)
• Contacting your representatives
• Participating in public consultations
• Attending town halls and council meetings

Informal Engagement:
• Community organizing
• Advocacy groups and petitions
• Social media and public discourse
• Volunteer work and community service

Discussion:
- What barriers prevent people from participating?
- How can we improve civic education?
- What new forms of engagement should we explore?

Share your experiences with civic engagement. What has worked for you? What challenges have you faced?`,
          categoryId: categoryMap.get("Civic Engagement") || 6
        },
        {
          title: "Climate Policy: Federal Carbon Tax vs Provincial Alternatives",
          content: `Climate policy remains a contentious issue across Canada:

Federal Approach:
• National carbon pricing framework
• Clean fuel standards
• Investment in clean technology
• International climate commitments

Provincial Variations:
• Some provinces have their own carbon pricing
• Others oppose federal carbon tax
• Different approaches to energy transition
• Regional economic impacts vary

Questions for Discussion:
- Is a national approach to carbon pricing necessary?
- How should we balance environmental goals with economic concerns?
- What role should provinces play in climate policy?

What climate policies do you think would be most effective for Canada?`,
          categoryId: categoryMap.get("General Discussion") || 7
        }
      ];

      // Create initial discussion posts
      for (const topic of discussionTopics) {
        await db.insert(forumPosts).values({
          ...topic,
          authorId: adminId
        }).onConflictDoNothing();
      }

      console.log(`Created ${discussionTopics.length} initial forum discussions`);
    } catch (error) {
      console.error('Error populating forum discussions:', error);
    }
  }

  /**
   * Create comprehensive forum categories (only if they don't exist)
   */
  private async createCategories(): Promise<void> {
    // Check if categories already exist
    const existingCategories = await db.select().from(forumCategories);
    if (existingCategories.length > 0) {
      console.log(`Forum categories already exist (${existingCategories.length} found), skipping creation`);
      return;
    }

    const categories = [
      {
        name: "Federal Politics",
        description: "Discussions about federal government, Parliament, federal elections, and national policies",
        color: "#DC2626",
        icon: "flag",
        sortOrder: 1,
        isVisible: true
      },
      {
        name: "Provincial & Territorial", 
        description: "Provincial and territorial government matters, legislation, and regional policies",
        color: "#2563EB",
        icon: "map",
        sortOrder: 2,
        isVisible: true
      },
      {
        name: "Legal Research",
        description: "Legal analysis, court cases, and constitutional matters",
        color: "#7C3AED",
        icon: "scale",
        sortOrder: 3,
        isVisible: true
      },
      {
        name: "Bill Analysis",
        description: "In-depth discussion and analysis of current and proposed legislation",
        color: "#EA580C",
        icon: "file-text",
        sortOrder: 4,
        isVisible: true
      },
      {
        name: "Civic Engagement",
        description: "Voting, petitions, public consultations, and citizen participation",
        color: "#0891B2",
        icon: "users",
        sortOrder: 5,
        isVisible: true
      },
      {
        name: "General Discussion",
        description: "Open discussions about Canadian politics, current events, and civic issues",
        color: "#6B7280",
        icon: "message-circle",
        sortOrder: 6,
        isVisible: true
      },
      {
        name: "Legal & Rights",
        description: "Charter rights, court cases, legal analysis, and constitutional matters",
        color: "#7C3AED",
        icon: "scale",
        sortOrder: 7,
        isVisible: true
      }
    ];

    try {
      await db.insert(forumCategories).values(categories);
      console.log(`Created ${categories.length} forum categories`);
    } catch (error) {
      console.log('Categories may already exist, continuing...');
    }
  }

  /**
   * Create detailed subcategories for organized discussions (only if they don't exist)
   */
  private async createSubcategories(): Promise<void> {
    // Check if subcategories already exist
    const existingSubcategories = await db.select().from(forumSubcategories);
    if (existingSubcategories.length > 0) {
      console.log(`Forum subcategories already exist (${existingSubcategories.length} found), skipping creation`);
      return;
    }

    const categories = await db.select().from(forumCategories);
    const categoryMap = new Map(categories.map(c => [c.name, c.id]));

    const subcategoriesData = [
      // Federal Politics subcategories
      {
        categoryId: categoryMap.get("Federal Politics"),
        name: "Parliament & House of Commons",
        description: "MPs, parliamentary procedures, Question Period, committees",
        color: "#F87171",
        icon: "building",
        sortOrder: 1
      },
      {
        categoryId: categoryMap.get("Federal Politics"),
        name: "Senate",
        description: "Senate discussions, appointments, legislation review",
        color: "#FB7185",
        icon: "users",
        sortOrder: 2
      },
      {
        categoryId: categoryMap.get("Federal Politics"),
        name: "Federal Elections",
        description: "Election campaigns, party platforms, electoral reform",
        color: "#F472B6",
        icon: "flag",
        sortOrder: 3
      },
      {
        categoryId: categoryMap.get("Federal Politics"),
        name: "Prime Minister & Cabinet",
        description: "PMO, ministers, government announcements, policy direction",
        color: "#A78BFA",
        icon: "star",
        sortOrder: 4
      },
      
      // Provincial & Territorial subcategories
      {
        categoryId: categoryMap.get("Provincial & Territorial"),
        name: "Ontario",
        description: "Ontario government, Queen's Park, provincial issues",
        color: "#60A5FA",
        icon: "map-pin",
        sortOrder: 1
      },
      {
        categoryId: categoryMap.get("Provincial & Territorial"),
        name: "Quebec",
        description: "Quebec government, National Assembly, provincial matters",
        color: "#34D399",
        icon: "map-pin",
        sortOrder: 2
      },
      {
        categoryId: categoryMap.get("Provincial & Territorial"),
        name: "British Columbia",
        description: "BC government, legislature, provincial policies",
        color: "#FBBF24",
        icon: "map-pin",
        sortOrder: 3
      },
      {
        categoryId: categoryMap.get("Provincial & Territorial"),
        name: "Alberta",
        description: "Alberta government, legislature, oil & gas policy",
        color: "#F87171",
        icon: "map-pin",
        sortOrder: 4
      },
      {
        categoryId: categoryMap.get("Provincial & Territorial"),
        name: "Maritime Provinces",
        description: "Nova Scotia, New Brunswick, PEI government matters",
        color: "#06B6D4",
        icon: "anchor",
        sortOrder: 5
      },
      {
        categoryId: categoryMap.get("Provincial & Territorial"),
        name: "Territories",
        description: "Yukon, NWT, Nunavut territorial governments",
        color: "#8B5CF6",
        icon: "snowflake",
        sortOrder: 6
      },
      
      // Legal & Rights subcategories
      {
        categoryId: categoryMap.get("Legal & Rights"),
        name: "Charter of Rights",
        description: "Charter challenges, fundamental freedoms, constitutional law",
        color: "#EC4899",
        icon: "shield",
        sortOrder: 1
      },
      {
        categoryId: categoryMap.get("Legal & Rights"),
        name: "Supreme Court",
        description: "Supreme Court decisions, appeals, constitutional cases",
        color: "#8B5CF6",
        icon: "scale",
        sortOrder: 2
      },
      {
        categoryId: categoryMap.get("Legal & Rights"),
        name: "Criminal Law",
        description: "Criminal Code, justice system, law enforcement",
        color: "#EF4444",
        icon: "shield-alert",
        sortOrder: 3
      },
      {
        categoryId: categoryMap.get("Legal & Rights"),
        name: "Civil Rights",
        description: "Human rights, discrimination, accessibility, privacy",
        color: "#10B981",
        icon: "heart",
        sortOrder: 4
      }
    ];

    for (const subcategory of subcategoriesData) {
      if (subcategory.categoryId) {
        await db.insert(forumSubcategories).values(subcategory).onConflictDoNothing();
      }
    }
  }
}

export const forumPopulator = new ForumPopulator();