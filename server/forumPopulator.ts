import { db } from "./db";
import { forumCategories, forumPosts, bills, users } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Populate forum with initial civic discussion topics
 */
export class ForumPopulator {
  
  async populateInitialDiscussions(): Promise<void> {
    console.log('Populating forum with civic discussion topics...');
    
    try {
      // Get categories
      const categories = await db.select().from(forumCategories);
      const categoryMap = new Map(categories.map(c => [c.name, c.id]));
      
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

Recent developments include new privacy legislation and debates over encryption. How do you think we should protect Charter rights while adapting to technological change?`,
          categoryId: categoryMap.get("Legal Research") || 4
        },
        {
          title: "Climate Action: Federal vs Provincial Jurisdiction",
          content: `Climate policy involves complex federal-provincial dynamics:

Federal Measures:
• Carbon pricing/tax
• Clean fuel standards
• Electric vehicle incentives
• International commitments

Provincial Responses:
• Some provinces challenge federal carbon tax
• Different approaches to emissions reduction
• Varying support for clean energy projects
• Regional economic considerations

Discussion:
How effective is Canada's multi-level approach to climate action? Should there be more federal coordination or more provincial autonomy? Share examples from your province.`,
          categoryId: categoryMap.get("Federal Politics") || 1
        },
        {
          title: "Indigenous Reconciliation: Progress and Challenges",
          content: `Truth and Reconciliation Commission calls to action continue to guide policy:

Recent Developments:
• Missing and Murdered Indigenous Women and Girls inquiry
• First Nations child welfare reform
• Land acknowledgments and territorial recognition
• Indigenous languages preservation

Policy Areas:
- Education and cultural programs
- Economic development and partnerships
- Justice system reform
- Healthcare access improvements

What progress do you see in your community? What more needs to be done to advance reconciliation? Share respectful perspectives on this crucial national conversation.`,
          categoryId: categoryMap.get("Federal Politics") || 1,
          isSticky: true
        },
        {
          title: "Healthcare System Strain: Solutions and Innovations",
          content: `Canadian healthcare faces significant challenges post-pandemic:

System Pressures:
• Staffing shortages across provinces
• Emergency room wait times
• Surgical backlogs
• Mental health service gaps

Proposed Solutions:
- Increased federal health transfers
- Private-public partnerships
- Technology and telemedicine
- International healthcare worker recruitment

Provincial Variations:
Each province is trying different approaches. What's working in your area? What innovations have you seen that could be scaled up?`,
          categoryId: categoryMap.get("Provincial Politics") || 2
        },
        {
          title: "Electoral Reform: Is Our System Working?",
          content: `Canada continues to debate electoral reform:

Current System (FPTP):
• Advantages: Stability, accountability
• Disadvantages: Vote splitting, strategic voting

Alternatives Discussed:
• Proportional representation
• Mixed-member proportional
• Ranked ballot/instant runoff
• Status quo with reforms

Key Questions:
- Does our current system represent voters fairly?
- Would proportional representation improve democracy?
- How important is local representation vs party proportionality?

What's your experience with the current electoral system? Have you seen examples of successful reforms elsewhere?`,
          categoryId: categoryMap.get("Civic Engagement") || 6
        },
        {
          title: "Immigration Policy: Economic vs Humanitarian Priorities",
          content: `Canada's immigration system balances multiple objectives:

Current Priorities:
• Economic immigrants (Express Entry)
• Family reunification
• Refugee protection
• Francophone immigration targets

Policy Debates:
- Immigration levels and regional distribution
- Temporary foreign worker programs
- Provincial nominee programs
- Integration and settlement services

How well is immigration policy serving your community? Are there changes you'd like to see in federal immigration priorities?`,
          categoryId: categoryMap.get("Federal Politics") || 1
        },
        {
          title: "Digital Government Services: Progress and Privacy",
          content: `Government digitization accelerated during the pandemic:

New Services:
• Online benefit applications
• Digital ID and verification
• Mobile government apps
• Automated decision systems

Privacy Concerns:
- Data collection and retention
- Cross-agency information sharing
- Security of personal information
- Algorithmic bias and transparency

User Experience:
How have digital government services worked for you? What improvements would make government more accessible and efficient while protecting privacy?`,
          categoryId: categoryMap.get("General Discussion") || 7
        }
      ];

      // Insert initial discussion posts
      for (const topic of discussionTopics) {
        await db.insert(forumPosts).values({
          title: topic.title,
          content: topic.content,
          authorId: adminId,
          categoryId: topic.categoryId,
          billId: topic.billId || null,
          isSticky: topic.isSticky || false,
          viewCount: Math.floor(Math.random() * 150) + 25,
          likeCount: Math.floor(Math.random() * 20) + 5,
          replyCount: Math.floor(Math.random() * 15) + 2
        });
      }

      console.log(`Created ${discussionTopics.length} initial forum discussions`);
      
    } catch (error) {
      console.error('Error populating forum discussions:', error);
    }
  }
}

export const forumPopulator = new ForumPopulator();