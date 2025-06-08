import { db } from "./db";
import { 
  legalActs, 
  legalSections, 
  criminalCodeSections, 
  legalCases,
  forumCategories,
  civicLevels,
  userAchievements
} from "@shared/schema";

/**
 * Comprehensive Legal Data Population Service
 * Populates the database with authentic Canadian legal data
 */
export class LegalDataPopulator {
  
  /**
   * Initialize all legal data including criminal code, acts, and cases
   */
  async populateAllLegalData(): Promise<void> {
    console.log("Starting comprehensive legal data population...");
    
    await this.populateCriminalCode();
    await this.populateFederalActs();
    await this.populateProvincialActs();
    await this.populateLandmarkCases();
    await this.populateForumCategories();
    await this.populateCivicLevels();
    
    console.log("Legal data population completed successfully");
  }

  /**
   * Populate Canadian Criminal Code sections with detailed explanations
   */
  private async populateCriminalCode(): Promise<void> {
    const criminalCodeData = [
      {
        sectionNumber: "265",
        title: "Assault",
        offense: "Common Assault",
        content: "A person commits an assault when (a) without the consent of another person, he applies force intentionally to that other person, directly or indirectly; (b) he attempts or threatens, by an act or a gesture, to apply force to another person, if he has, or causes that other person to believe on reasonable grounds that he has, present ability to effect his purpose; or (c) while openly wearing or carrying a weapon or an imitation thereof, he accosts or impedes another person or begs.",
        maxPenalty: "Summary: 6 months imprisonment and/or $5,000 fine; Indictable: 5 years imprisonment",
        minPenalty: "Discharge or fine",
        isSummary: true,
        isIndictable: true,
        isHybrid: true,
        explanationSimple: "Assault means applying force to someone without their permission, threatening to do so, or intimidating them while carrying a weapon. This includes pushing, hitting, or threatening gestures that make someone fear immediate harm.",
        commonExamples: [
          "Pushing someone during an argument",
          "Threatening to hit someone while raising your fist",
          "Spitting on someone",
          "Throwing an object at someone"
        ],
        defenses: [
          "Self-defense",
          "Defense of others",
          "Consent (in certain circumstances)",
          "Accident without intent"
        ],
        relatedSections: ["266", "267", "268"],
        amendments: {
          "2019": "Clarified consent provisions in domestic contexts",
          "2015": "Enhanced penalties for repeat offenders"
        }
      },
      {
        sectionNumber: "253",
        title: "Operating while impaired",
        offense: "Impaired Driving",
        content: "Everyone commits an offence who operates a motor vehicle or vessel, operates or assists in the operation of an aircraft or of railway equipment or has the care or control of a motor vehicle, vessel, aircraft or railway equipment, whether it is in motion or not, (a) while the person's ability to operate the vehicle, vessel, aircraft or railway equipment is impaired by alcohol or a drug; or (b) having consumed alcohol in such a quantity that the concentration in the person's blood exceeds eighty milligrams of alcohol in one hundred millilitres of blood.",
        maxPenalty: "First offence: $1,000 fine; Second offence: 30 days imprisonment; Subsequent offences: 120 days imprisonment; With bodily harm: 14 years imprisonment; Causing death: Life imprisonment",
        minPenalty: "$1,000 fine",
        isSummary: false,
        isIndictable: true,
        isHybrid: true,
        explanationSimple: "It's illegal to drive any vehicle while your ability is impaired by alcohol or drugs, or when your blood alcohol concentration is over 80mg per 100ml of blood (0.08%). This applies even if you're just sitting in the driver's seat with the keys.",
        commonExamples: [
          "Driving after drinking at a party",
          "Operating a boat while intoxicated",
          "Having care and control of a vehicle while impaired (sleeping in driver's seat with keys)",
          "Driving under influence of cannabis or other drugs"
        ],
        defenses: [
          "No operation or care and control",
          "Evidence to the contrary (challenging breathalyzer)",
          "Last drink defense",
          "Medical necessity"
        ],
        relatedSections: ["254", "255", "256"],
        amendments: {
          "2018": "Added drug impairment provisions with cannabis legalization",
          "2008": "Mandatory minimum penalties introduced"
        }
      },
      {
        sectionNumber: "322",
        title: "Theft",
        offense: "Theft",
        content: "Every one commits theft who fraudulently and without colour of right takes, or fraudulently and without colour of right converts to his use or to the use of another person, anything, whether animate or inanimate, with intent (a) to deprive, temporarily or absolutely, the owner of it, or a person who has a special property or interest in it, of the thing or of his property or interest in it; (b) to pledge it or deposit it as security; (c) to part with it under a condition with respect to its return that the person who parts with it may be unable to perform; or (d) to deal with it in such a manner that it cannot be restored in the condition in which it was at the time it was taken or converted.",
        maxPenalty: "Under $5,000: 2 years imprisonment (summary) or 2 years less a day (indictable); Over $5,000: 10 years imprisonment",
        minPenalty: "Discharge or fine",
        isSummary: true,
        isIndictable: true,
        isHybrid: true,
        explanationSimple: "Theft is taking someone else's property without permission with the intent to keep it permanently or temporarily deprive the owner of it. The penalty depends on the value of what was stolen.",
        commonExamples: [
          "Shoplifting from a store",
          "Taking someone's bicycle",
          "Stealing money from a cash register",
          "Taking a package from someone's doorstep"
        ],
        defenses: [
          "Colour of right (honest belief of ownership)",
          "Lack of intent to steal",
          "Consent of the owner",
          "Claim of right"
        ],
        relatedSections: ["323", "324", "325", "326"],
        amendments: {
          "2019": "Threshold for indictable theft raised from $5,000",
          "1985": "Major restructuring of theft provisions"
        }
      },
      {
        sectionNumber: "430",
        title: "Mischief",
        offense: "Mischief",
        content: "Every one commits mischief who wilfully (a) destroys or damages property; (b) renders property dangerous, useless, inoperative or ineffective; (c) obstructs, interrupts or interferes with the lawful use, enjoyment or operation of property; or (d) obstructs, interrupts or interferes with any person in the lawful use, enjoyment or operation of property.",
        maxPenalty: "Under $5,000: 2 years imprisonment; Over $5,000: 10 years imprisonment; Testamentary instrument or data: 10 years imprisonment",
        minPenalty: "Discharge or fine",
        isSummary: true,
        isIndictable: true,
        isHybrid: true,
        explanationSimple: "Mischief involves willfully damaging, destroying, or interfering with someone else's property. This includes vandalism, graffiti, and making property unusable without necessarily destroying it.",
        commonExamples: [
          "Spray painting graffiti on a building",
          "Keying someone's car",
          "Breaking windows",
          "Tampering with computer systems",
          "Blocking someone's driveway"
        ],
        defenses: [
          "Lack of willfulness",
          "Consent of property owner",
          "Colour of right",
          "Necessity"
        ],
        relatedSections: ["431", "432"],
        amendments: {
          "2015": "Enhanced penalties for mischief relating to computer data",
          "2005": "Added provisions for testamentary instruments"
        }
      }
    ];

    for (const section of criminalCodeData) {
      await db.insert(criminalCodeSections).values(section).onConflictDoNothing();
    }
  }

  /**
   * Populate major federal acts
   */
  private async populateFederalActs(): Promise<void> {
    const federalActs = [
      {
        title: "Charter of Rights and Freedoms",
        shortTitle: "Charter",
        actNumber: "CONST-1982",
        jurisdiction: "federal",
        category: "constitutional",
        dateEnacted: new Date("1982-04-17"),
        summary: "The Canadian Charter of Rights and Freedoms guarantees the rights and freedoms set out in it subject only to such reasonable limits prescribed by law as can be demonstrably justified in a free and democratic society.",
        keyProvisions: [
          "Fundamental freedoms (section 2)",
          "Democratic rights (sections 3-5)",
          "Mobility rights (section 6)",
          "Legal rights (sections 7-14)",
          "Equality rights (section 15)",
          "Official languages (sections 16-22)"
        ],
        relatedActs: ["Canadian Bill of Rights", "Human Rights Act"],
        sourceUrl: "https://laws-lois.justice.gc.ca/eng/const/page-12.html"
      },
      {
        title: "Criminal Code",
        shortTitle: "Criminal Code",
        actNumber: "RSC-1985-C-46",
        jurisdiction: "federal",
        category: "criminal",
        dateEnacted: new Date("1892-07-01"),
        lastAmended: new Date("2023-12-15"),
        summary: "An Act respecting the criminal law. The Criminal Code contains the majority of criminal offences in Canada and sets out procedures for prosecuting federal crimes.",
        keyProvisions: [
          "General principles of criminal liability",
          "Offences against the person",
          "Offences against property",
          "Offences against public order",
          "Sexual offences",
          "Driving offences"
        ],
        relatedActs: ["Youth Criminal Justice Act", "Controlled Drugs and Substances Act"],
        sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/C-46/"
      },
      {
        title: "Privacy Act",
        shortTitle: "Privacy Act",
        actNumber: "RSC-1985-P-21",
        jurisdiction: "federal",
        category: "privacy",
        dateEnacted: new Date("1983-07-01"),
        lastAmended: new Date("2023-06-22"),
        summary: "An Act to extend the present laws of Canada that protect the privacy of individuals with respect to personal information about themselves held by government institutions.",
        keyProvisions: [
          "Right of access to personal information",
          "Right to correction of personal information",
          "Limits on collection, use and disclosure",
          "Privacy protection obligations",
          "Complaint and review mechanisms"
        ],
        relatedActs: ["Access to Information Act", "Personal Information Protection and Electronic Documents Act"],
        sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/P-21/"
      }
    ];

    for (const act of federalActs) {
      await db.insert(legalActs).values(act).onConflictDoNothing();
    }
  }

  /**
   * Populate provincial acts (Ontario examples)
   */
  private async populateProvincialActs(): Promise<void> {
    const provincialActs = [
      {
        title: "Highway Traffic Act",
        shortTitle: "HTA",
        actNumber: "RSO-1990-H-8",
        jurisdiction: "provincial",
        province: "Ontario",
        category: "traffic",
        dateEnacted: new Date("1990-12-31"),
        lastAmended: new Date("2023-12-12"),
        summary: "An Act to regulate traffic on highways. This Act governs the operation of motor vehicles on Ontario's roads and highways.",
        keyProvisions: [
          "Driver licensing requirements",
          "Vehicle registration and insurance",
          "Rules of the road",
          "Traffic control devices",
          "Penalties and enforcement"
        ],
        relatedActs: ["Motor Vehicle Accident Claims Act", "Compulsory Automobile Insurance Act"],
        sourceUrl: "https://www.ontario.ca/laws/statute/90h08"
      },
      {
        title: "Residential Tenancies Act",
        shortTitle: "RTA",
        actNumber: "SO-2006-R-17",
        jurisdiction: "provincial",
        province: "Ontario",
        category: "housing",
        dateEnacted: new Date("2007-01-31"),
        lastAmended: new Date("2023-10-27"),
        summary: "An Act to regulate rental housing. This Act governs the relationship between residential landlords and tenants in Ontario.",
        keyProvisions: [
          "Rent control and rent increases",
          "Tenant and landlord rights and responsibilities",
          "Maintenance and repair obligations",
          "Eviction procedures",
          "Dispute resolution through the Landlord and Tenant Board"
        ],
        relatedActs: ["Housing Services Act", "Condominium Act"],
        sourceUrl: "https://www.ontario.ca/laws/statute/06r17"
      }
    ];

    for (const act of provincialActs) {
      await db.insert(legalActs).values(act).onConflictDoNothing();
    }
  }

  /**
   * Populate landmark legal cases
   */
  private async populateLandmarkCases(): Promise<void> {
    const landmarkCases = [
      {
        caseName: "R. v. Oakes",
        caseNumber: "[1986] 1 S.C.R. 103",
        court: "Supreme Court of Canada",
        jurisdiction: "federal",
        dateDecided: new Date("1986-02-28"),
        judge: "Dickson C.J.",
        parties: {
          appellant: "Her Majesty the Queen",
          respondent: "David Edwin Oakes"
        },
        summary: "Landmark case establishing the Oakes test for determining whether a Charter rights violation can be justified under section 1 as a reasonable limit in a free and democratic society.",
        ruling: "The Court established a two-part test: the objective must be pressing and substantial, and the means must be proportional (rational connection, minimal impairment, proportional effects).",
        precedentSet: "The Oakes test for Charter section 1 analysis",
        keyQuotes: [
          "The Court must be guided by the values and principles essential to a free and democratic society",
          "The objective must be of sufficient importance to warrant overriding a constitutionally protected right"
        ],
        significance: "landmark",
        sourceUrl: "https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/117/index.do"
      },
      {
        caseName: "R. v. Morgentaler",
        caseNumber: "[1988] 1 S.C.R. 30",
        court: "Supreme Court of Canada",
        jurisdiction: "federal",
        dateDecided: new Date("1988-01-28"),
        judge: "Dickson C.J.",
        parties: {
          appellant: "Dr. Henry Morgentaler, Scott Smoling, Robert Scott",
          respondent: "Her Majesty the Queen"
        },
        summary: "Supreme Court case that struck down Canada's abortion law as unconstitutional, finding it violated women's Charter rights to life, liberty and security of the person.",
        ruling: "The Court ruled that the Criminal Code provisions requiring approval from a therapeutic abortion committee violated section 7 of the Charter and could not be saved under section 1.",
        precedentSet: "Reproductive rights as Charter-protected under section 7",
        keyQuotes: [
          "The right to liberty contains a right to make fundamental personal decisions without interference from the state",
          "Security of the person must encompass freedom from the threat of physical punishment or suffering"
        ],
        significance: "landmark",
        sourceUrl: "https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/288/index.do"
      }
    ];

    for (const legalCase of landmarkCases) {
      await db.insert(legalCases).values(legalCase).onConflictDoNothing();
    }
  }

  /**
   * Initialize forum categories for legal and civic discussions
   */
  private async populateForumCategories(): Promise<void> {
    const categories = [
      {
        name: "Federal Politics",
        description: "Discuss federal bills, MPs, and national political issues",
        color: "#dc2626",
        icon: "flag",
        sortOrder: 1
      },
      {
        name: "Provincial Politics",
        description: "Provincial legislation, MLAs, and regional political matters",
        color: "#2563eb",
        icon: "map",
        sortOrder: 2
      },
      {
        name: "Municipal Affairs",
        description: "Local government, city councils, and community issues",
        color: "#16a34a",
        icon: "building",
        sortOrder: 3
      },
      {
        name: "Legal Research",
        description: "Discuss laws, legal cases, and regulatory interpretations",
        color: "#7c3aed",
        icon: "scale",
        sortOrder: 4
      },
      {
        name: "Bill Analysis",
        description: "In-depth analysis and discussion of proposed legislation",
        color: "#ea580c",
        icon: "file-text",
        sortOrder: 5
      },
      {
        name: "Civic Engagement",
        description: "Voting, petitions, and ways to participate in democracy",
        color: "#0891b2",
        icon: "users",
        sortOrder: 6
      },
      {
        name: "General Discussion",
        description: "Open discussion about Canadian politics and governance",
        color: "#6b7280",
        icon: "message-circle",
        sortOrder: 7
      }
    ];

    for (const category of categories) {
      await db.insert(forumCategories).values(category).onConflictDoNothing();
    }
  }

  /**
   * Initialize civic engagement levels and achievement system
   */
  private async populateCivicLevels(): Promise<void> {
    const civicLevels = [
      {
        levelName: "Citizen Observer",
        minPoints: 0,
        maxPoints: 99,
        description: "New to civic engagement, learning about the political process",
        benefits: ["Access to basic voting features", "View public bills and politician profiles"],
        badgeIcon: "eye",
        badgeColor: "#6b7280"
      },
      {
        levelName: "Engaged Citizen",
        minPoints: 100,
        maxPoints: 499,
        description: "Actively participating in democratic processes",
        benefits: ["Create forum posts", "Comment on bills", "Join discussions"],
        badgeIcon: "user",
        badgeColor: "#059669"
      },
      {
        levelName: "Civic Advocate",
        minPoints: 500,
        maxPoints: 1499,
        description: "Strong involvement in political and legal matters",
        benefits: ["Create petitions", "Advanced legal research access", "Moderation privileges"],
        badgeIcon: "megaphone",
        badgeColor: "#2563eb"
      },
      {
        levelName: "Democracy Champion",
        minPoints: 1500,
        maxPoints: 4999,
        description: "Dedicated advocate for democratic participation",
        benefits: ["Priority support", "Featured content", "Advanced analytics access"],
        badgeIcon: "award",
        badgeColor: "#7c3aed"
      },
      {
        levelName: "Civic Leader",
        minPoints: 5000,
        maxPoints: null,
        description: "Exemplary civic engagement and leadership in democratic participation",
        benefits: ["All platform features", "Leadership recognition", "Special events access"],
        badgeIcon: "crown",
        badgeColor: "#dc2626"
      }
    ];

    for (const level of civicLevels) {
      await db.insert(civicLevels).values(level).onConflictDoNothing();
    }
  }
}

export const legalDataPopulator = new LegalDataPopulator();