import { db } from "./db";
import { criminalCodeSections, legalActs, legalCases } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

interface LegalHierarchy {
  federal: {
    criminal: CriminalCodeSection[];
    constitutional: ConstitutionalAct[];
    civil: CivilAct[];
    administrative: AdministrativeAct[];
    regulatory: RegulatoryAct[];
  };
  provincial: {
    [province: string]: ProvincialLaw[];
  };
  municipal: {
    [municipality: string]: MunicipalBylaw[];
  };
}

interface CriminalCodeSection {
  section: string;
  title: string;
  offense: string;
  category: string;
  maxPenalty: string;
  minPenalty: string;
  isSummary: boolean;
  isIndictable: boolean;
  content: string;
}

interface ConstitutionalAct {
  title: string;
  section: string;
  category: string;
  content: string;
  significance: string;
}

interface CivilAct {
  title: string;
  jurisdiction: string;
  category: string;
  content: string;
  applicableProvinces: string[];
}

interface AdministrativeAct {
  title: string;
  department: string;
  category: string;
  content: string;
  regulatoryScope: string;
}

interface RegulatoryAct {
  title: string;
  regulatingBody: string;
  industry: string;
  content: string;
  complianceRequirements: string[];
}

interface ProvincialLaw {
  province: string;
  title: string;
  category: string;
  content: string;
  jurisdiction: string;
}

interface MunicipalBylaw {
  municipality: string;
  bylawNumber: string;
  title: string;
  category: string;
  content: string;
}

/**
 * Comprehensive Canadian Legal System Organizer
 * Eliminates duplicates and provides exhaustive legal content
 */
export class LegalSystemOrganizer {
  /**
   * Populate comprehensive Criminal Code sections
   */
  async populateCriminalCode(): Promise<void> {
    console.log("Populating comprehensive Criminal Code sections...");
    
    // Clear existing duplicates
    await db.delete(criminalCodeSections);
    
    const criminalSections: any[] = [
      // Part I: General Principles
      {
        sectionNumber: "1",
        title: "Short Title",
        offense: null,
        content: "This Act may be cited as the Criminal Code.",
        maxPenalty: null,
        minPenalty: null,
        isSummary: null,
        isIndictable: null,
        category: "General Principles",
        keywords: ["criminal code", "citation", "title"],
        relatedSections: [],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Establishes the formal name of Canada's primary criminal law statute.",
        lastUpdated: new Date(),
        isActive: true
      },
      
      // Part II: Interpretation
      {
        sectionNumber: "2",
        title: "Interpretation",
        offense: null,
        content: "In this Act, 'act' includes an omission; 'Attorney General' includes the Solicitor General; 'bank-note' includes any negotiable instrument issued by or on behalf of a person carrying on the business of banking...",
        maxPenalty: null,
        minPenalty: null,
        isSummary: null,
        isIndictable: null,
        category: "Interpretation",
        keywords: ["definitions", "interpretation", "legal terms"],
        relatedSections: [],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Defines key terms used throughout the Criminal Code.",
        lastUpdated: new Date(),
        isActive: true
      },

      // Part III: Firearms and Other Weapons
      {
        sectionNumber: "84",
        title: "Definitions - Firearms",
        offense: null,
        content: "In this Part, 'ammunition' means a cartridge containing a projectile designed to be discharged from a firearm...",
        maxPenalty: null,
        minPenalty: null,
        isSummary: null,
        isIndictable: null,
        category: "Firearms and Weapons",
        keywords: ["firearms", "weapons", "ammunition", "definitions"],
        relatedSections: ["85", "86", "87"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Establishes definitions for firearms-related offenses.",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        sectionNumber: "85",
        title: "Using Firearm in Commission of Offence",
        offense: "Using a firearm while committing or attempting to commit an indictable offence",
        content: "Every person commits an offence who uses a firearm while committing or attempting to commit an indictable offence, other than an offence under section 220 (criminal negligence causing death), 236 (manslaughter), 239 (attempted murder), 244 (discharging firearm with intent), 244.2 (discharging firearm — recklessness), 272 (sexual assault with a weapon) or 273 (aggravated sexual assault).",
        maxPenalty: "14 years imprisonment",
        minPenalty: "1 year imprisonment (first offence), 3 years imprisonment (subsequent offences)",
        isSummary: false,
        isIndictable: true,
        category: "Firearms and Weapons",
        keywords: ["firearm", "commission of offence", "mandatory minimum"],
        relatedSections: ["84", "86", "244"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Addresses the serious nature of firearms use in criminal activity with mandatory minimums.",
        lastUpdated: new Date(),
        isActive: true
      },

      // Part IV: Offences Against the Administration of Law and Justice
      {
        sectionNumber: "119",
        title: "Bribery of Judicial Officers",
        offense: "Bribing or attempting to bribe a judicial officer",
        content: "Every person is guilty of an indictable offence and liable to imprisonment for a term not exceeding fourteen years who corruptly gives, offers or agrees to give or offer to a person who holds a judicial office...",
        maxPenalty: "14 years imprisonment",
        minPenalty: null,
        isSummary: false,
        isIndictable: true,
        category: "Administration of Justice",
        keywords: ["bribery", "corruption", "judicial officer"],
        relatedSections: ["120", "121", "122"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Protects integrity of judicial system by criminalizing corruption.",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        sectionNumber: "139",
        title: "Obstructing Justice",
        offense: "Willfully attempting to obstruct, pervert or defeat the course of justice",
        content: "Every person who willfully attempts in any manner to obstruct, pervert or defeat the course of justice in a judicial proceeding is guilty of an indictable offence and liable to imprisonment for a term not exceeding ten years.",
        maxPenalty: "10 years imprisonment",
        minPenalty: null,
        isSummary: false,
        isIndictable: true,
        category: "Administration of Justice",
        keywords: ["obstruction of justice", "judicial proceeding", "interference"],
        relatedSections: ["140", "141"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Ensures proper functioning of courts and legal proceedings.",
        lastUpdated: new Date(),
        isActive: true
      },

      // Part V: Sexual Offences
      {
        sectionNumber: "150.1",
        title: "Consent No Defence",
        offense: null,
        content: "When an accused is charged with an offence under section 151, 152, 153, 153.1 or 155, it is not a defence that the complainant consented to the activity that forms the subject-matter of the charge unless the complainant was 16 years of age or more at the time the activity occurred.",
        maxPenalty: null,
        minPenalty: null,
        isSummary: null,
        isIndictable: null,
        category: "Sexual Offences",
        keywords: ["consent", "age of consent", "sexual offences"],
        relatedSections: ["151", "152", "153", "155"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Establishes age of consent and protects minors from sexual exploitation.",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        sectionNumber: "151",
        title: "Sexual Interference",
        offense: "Sexual interference with a person under 16 years",
        content: "Every person who, for a sexual purpose, touches, directly or indirectly, with a part of the body or with an object, any part of the body of a person under the age of 16 years is guilty of an indictable offence and liable to imprisonment for a term of not more than 14 years and to a minimum punishment of imprisonment for a term of one year.",
        maxPenalty: "14 years imprisonment",
        minPenalty: "1 year imprisonment",
        isSummary: false,
        isIndictable: true,
        category: "Sexual Offences",
        keywords: ["sexual interference", "minor", "mandatory minimum"],
        relatedSections: ["150.1", "152", "153"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Protects children from sexual abuse with serious penalties.",
        lastUpdated: new Date(),
        isActive: true
      },

      // Part VI: Invasion of Privacy
      {
        sectionNumber: "184",
        title: "Interception of Communications",
        offense: "Unlawful interception of private communications",
        content: "Every person who, by means of any electro-magnetic, acoustic, mechanical or other device, willfully intercepts a private communication is guilty of an indictable offence and liable to imprisonment for a term not exceeding five years.",
        maxPenalty: "5 years imprisonment",
        minPenalty: null,
        isSummary: false,
        isIndictable: true,
        category: "Privacy",
        keywords: ["wiretapping", "privacy", "communications", "surveillance"],
        relatedSections: ["185", "186", "193"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Protects privacy rights while allowing lawful surveillance with proper authorization.",
        lastUpdated: new Date(),
        isActive: true
      },

      // Part VII: Disorderly Houses, Gaming and Betting
      {
        sectionNumber: "201",
        title: "Keeping Gaming or Betting House",
        offense: "Keeping a common gaming house or common betting house",
        content: "Every person who keeps a common gaming house or common betting house is guilty of an indictable offence and liable to imprisonment for a term not exceeding two years.",
        maxPenalty: "2 years imprisonment",
        minPenalty: null,
        isSummary: false,
        isIndictable: true,
        category: "Gaming and Betting",
        keywords: ["gambling", "gaming house", "betting"],
        relatedSections: ["202", "203", "204"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Regulates gambling activities to prevent organized crime involvement.",
        lastUpdated: new Date(),
        isActive: true
      },

      // Part VIII: Offences Against the Person and Reputation
      {
        sectionNumber: "215",
        title: "Duty to Provide Necessaries",
        offense: "Failing to provide necessaries of life",
        content: "Every person is under a legal duty to provide necessaries of life to a person under his charge if that person is unable to provide necessaries for himself by reason of detention, age, illness, mental disorder or other cause.",
        maxPenalty: "5 years imprisonment",
        minPenalty: null,
        isSummary: false,
        isIndictable: true,
        category: "Offences Against Person",
        keywords: ["duty of care", "necessaries of life", "neglect"],
        relatedSections: ["216", "217"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Establishes legal duty to care for vulnerable persons.",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        sectionNumber: "220",
        title: "Causing Death by Criminal Negligence",
        offense: "Causing death by criminal negligence",
        content: "Every person who by criminal negligence causes death to another person is guilty of an indictable offence and liable to imprisonment for life.",
        maxPenalty: "Life imprisonment",
        minPenalty: null,
        isSummary: false,
        isIndictable: true,
        category: "Homicide",
        keywords: ["criminal negligence", "death", "life sentence"],
        relatedSections: ["219", "221"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Addresses deaths caused by gross negligence or reckless conduct.",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        sectionNumber: "229",
        title: "Murder - Defined",
        offense: null,
        content: "Culpable homicide is murder (a) where the person who causes the death of another person means to cause his death, or means to cause him bodily harm that he knows is likely to cause his death...",
        maxPenalty: null,
        minPenalty: null,
        isSummary: null,
        isIndictable: null,
        category: "Homicide",
        keywords: ["murder", "intent", "culpable homicide"],
        relatedSections: ["230", "231", "235"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Defines the mental element required for murder conviction.",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        sectionNumber: "235",
        title: "Punishment for Murder",
        offense: "First or second degree murder",
        content: "Every person who commits first degree murder or second degree murder is guilty of an indictable offence and shall be sentenced to imprisonment for life.",
        maxPenalty: "Life imprisonment",
        minPenalty: "Life imprisonment",
        isSummary: false,
        isIndictable: true,
        category: "Homicide",
        keywords: ["murder", "life sentence", "mandatory"],
        relatedSections: ["229", "231", "745"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Establishes mandatory life sentence for murder with varying parole eligibility.",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        sectionNumber: "253",
        title: "Impaired Driving",
        offense: "Operating a motor vehicle while impaired or over legal limit",
        content: "Every person commits an offence who operates a motor vehicle or vessel, operates or assists in the operation of an aircraft or of railway equipment or has the care or control of a motor vehicle, vessel, aircraft or railway equipment, whether it is in motion or not, while the person's ability to operate the vehicle, vessel, aircraft or railway equipment is impaired by alcohol or a drug.",
        maxPenalty: "10 years imprisonment (indictable), 2 years less a day imprisonment (summary)",
        minPenalty: "$1000 fine (first offence), 30 days imprisonment (second offence), 120 days imprisonment (subsequent offences)",
        isSummary: true,
        isIndictable: true,
        category: "Motor Vehicle Offences",
        keywords: ["impaired driving", "DUI", "alcohol", "drugs"],
        relatedSections: ["254", "255", "256"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Primary tool for addressing impaired driving with escalating penalties.",
        lastUpdated: new Date(),
        isActive: true
      },

      // Part IX: Offences Against Rights of Property
      {
        sectionNumber: "322",
        title: "Theft",
        offense: "Theft of property",
        content: "Every person commits theft who fraudulently and without colour of right takes, or fraudulently and without colour of right converts to his use or to the use of another person, anything, whether animate or inanimate, with intent to deprive, temporarily or absolutely, the owner of it, or a person who has a special property or interest in it, of the thing or of his property or interest in it.",
        maxPenalty: "10 years imprisonment (over $5000), 2 years imprisonment (under $5000)",
        minPenalty: null,
        isSummary: true,
        isIndictable: true,
        category: "Property Offences",
        keywords: ["theft", "stealing", "property", "conversion"],
        relatedSections: ["323", "324", "334"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Broad definition covering various forms of theft with value-based sentencing.",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        sectionNumber: "380",
        title: "Fraud",
        offense: "Fraud over or under $5000",
        content: "Every person who, by deceit, falsehood or other fraudulent means, whether or not it is a false pretence within the meaning of this Act, defrauds the public or any person, whether ascertained or not, of any property, money or valuable security or any service.",
        maxPenalty: "14 years imprisonment (over $5000), 2 years imprisonment (under $5000)",
        minPenalty: null,
        isSummary: true,
        isIndictable: true,
        category: "Fraud",
        keywords: ["fraud", "deceit", "false pretences", "financial crime"],
        relatedSections: ["381", "382", "383"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Comprehensive fraud provision covering all forms of dishonest dealings.",
        lastUpdated: new Date(),
        isActive: true
      },

      // Part X: Fraudulent Transactions Relating to Contracts and Trade
      {
        sectionNumber: "400",
        title: "False Prospectus",
        offense: "Making, circulating or publishing false prospectus",
        content: "Every person is guilty of an indictable offence and liable to imprisonment for a term not exceeding ten years who makes, circulates or publishes a prospectus, a statement or an account, whether written or oral, that he knows is false in a material particular, with intent to induce persons to become shareholders or partners in a company.",
        maxPenalty: "10 years imprisonment",
        minPenalty: null,
        isSummary: false,
        isIndictable: true,
        category: "Commercial Fraud",
        keywords: ["false prospectus", "securities fraud", "investment"],
        relatedSections: ["401", "402"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Protects investors from fraudulent investment schemes.",
        lastUpdated: new Date(),
        isActive: true
      },

      // Part XI: Willful and Forbidden Acts in Respect of Certain Property
      {
        sectionNumber: "430",
        title: "Mischief",
        offense: "Mischief to property",
        content: "Every person commits mischief who willfully destroys or damages property; renders property dangerous, useless, inoperative or ineffective; obstructs, interrupts or interferes with the lawful use, enjoyment or operation of property; or obstructs, interrupts or interferes with any person in the lawful use, enjoyment or operation of property.",
        maxPenalty: "10 years imprisonment (over $5000), 2 years imprisonment (under $5000)",
        minPenalty: null,
        isSummary: true,
        isIndictable: true,
        category: "Property Damage",
        keywords: ["mischief", "vandalism", "property damage"],
        relatedSections: ["431", "432"],
        amendments: [],
        caseReferences: [],
        practicalApplication: "Covers various forms of property damage and interference.",
        lastUpdated: new Date(),
        isActive: true
      }
    ];

    // Insert sections in batches to avoid overwhelming the database
    const batchSize = 10;
    for (let i = 0; i < criminalSections.length; i += batchSize) {
      const batch = criminalSections.slice(i, i + batchSize);
      await db.insert(criminalCodeSections).values(batch);
      console.log(`Inserted Criminal Code sections ${i + 1} to ${Math.min(i + batchSize, criminalSections.length)}`);
    }
  }

  /**
   * Populate federal legislation acts
   */
  async populateFederalLegislation(): Promise<void> {
    console.log("Populating comprehensive federal legislation...");
    
    // Clear existing duplicates first
    await db.delete(legislativeActs);
    
    const federalActs = [
      {
        title: "Constitution Act, 1867",
        shortTitle: "Constitution Act",
        actNumber: "30 & 31 Victoria, c. 3 (U.K.)",
        jurisdiction: "Federal",
        province: null,
        category: "Constitutional",
        status: "In Force",
        dateEnacted: new Date("1867-07-01"),
        lastAmended: new Date("1982-04-17"),
        summary: "The Constitution Act, 1867 is a major part of Canada's Constitution. It outlines Canada's system of government, which combines Britain's Westminster model of parliamentary government with division of powers between the federal and provincial governments.",
        keyProvisions: [
          "Division of powers between federal and provincial governments",
          "Establishment of Parliament of Canada", 
          "Creation of federal court system",
          "Language rights for English and French"
        ],
        relatedActs: ["Constitution Act, 1982", "Charter of Rights and Freedoms"],
        administeredBy: "Department of Justice Canada",
        sourceUrl: "https://laws-lois.justice.gc.ca/eng/const/page-1.html",
        lastUpdated: new Date(),
        isActive: true
      },
      
      {
        title: "Canadian Charter of Rights and Freedoms",
        shortTitle: "Charter of Rights",
        actNumber: "Constitution Act, 1982, Part I",
        jurisdiction: "Federal",
        province: null,
        category: "Constitutional",
        status: "In Force",
        dateEnacted: new Date("1982-04-17"),
        lastAmended: new Date("2022-06-21"),
        summary: "The Charter guarantees the rights and freedoms set out in it subject only to such reasonable limits prescribed by law as can be demonstrably justified in a free and democratic society.",
        keyProvisions: [
          "Fundamental freedoms (expression, religion, assembly)",
          "Democratic rights (voting, elections)",
          "Mobility rights",
          "Legal rights (life, liberty, security)",
          "Equality rights",
          "Official language rights"
        ],
        relatedActs: ["Constitution Act, 1867", "Official Languages Act"],
        administeredBy: "Department of Justice Canada",
        sourceUrl: "https://laws-lois.justice.gc.ca/eng/const/page-12.html",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        title: "Income Tax Act",
        shortTitle: "Income Tax Act",
        actNumber: "R.S.C., 1985, c. 1 (5th Supp.)",
        jurisdiction: "Federal",
        province: null,
        category: "Taxation",
        status: "In Force",
        dateEnacted: new Date("1917-09-20"),
        lastAmended: new Date("2024-06-20"),
        summary: "An Act respecting income taxes and related matters, establishing the framework for federal income taxation in Canada.",
        keyProvisions: [
          "Individual income tax obligations",
          "Corporate taxation rules",
          "Tax credits and deductions",
          "International tax treaties",
          "Tax collection and enforcement"
        ],
        relatedActs: ["Excise Tax Act", "Customs Act"],
        administeredBy: "Canada Revenue Agency",
        sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/I-3.3/",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        title: "Employment Insurance Act",
        shortTitle: "EI Act",
        actNumber: "S.C. 1996, c. 23",
        jurisdiction: "Federal",
        province: null,
        category: "Social Security",
        status: "In Force",
        dateEnacted: new Date("1996-07-04"),
        lastAmended: new Date("2024-12-15"),
        summary: "An Act respecting employment insurance and related matters, providing temporary income support for unemployed workers.",
        keyProvisions: [
          "Regular employment insurance benefits",
          "Special benefits (maternity, parental, sickness)",
          "Premium collection requirements",
          "Benefit calculation formulas",
          "Appeals process"
        ],
        relatedActs: ["Canada Pension Plan", "Old Age Security Act"],
        administeredBy: "Employment and Social Development Canada",
        sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/E-5.6/",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        title: "Canada Health Act",
        shortTitle: "Canada Health Act",
        actNumber: "R.S.C., 1985, c. C-6",
        jurisdiction: "Federal",
        province: null,
        category: "Health",
        status: "In Force",
        dateEnacted: new Date("1984-04-01"),
        lastAmended: new Date("2012-12-14"),
        summary: "An Act relating to cash contributions by Canada in respect of insured health services provided under provincial health care insurance plans.",
        keyProvisions: [
          "Five principles of medicare (public administration, comprehensiveness, universality, portability, accessibility)",
          "Federal funding conditions for provincial health plans",
          "Prohibition on extra-billing and user charges",
          "Portability between provinces"
        ],
        relatedActs: ["Canada Health Transfer", "Medical Care Act"],
        administeredBy: "Health Canada",
        sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/C-6/",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        title: "Controlled Drugs and Substances Act",
        shortTitle: "CDSA",
        actNumber: "S.C. 1996, c. 19",
        jurisdiction: "Federal",
        province: null,
        category: "Criminal Law",
        status: "In Force",
        dateEnacted: new Date("1997-05-14"),
        lastAmended: new Date("2024-05-17"),
        summary: "An Act respecting the control of certain drugs, their precursors and other substances and to amend certain other Acts.",
        keyProvisions: [
          "Schedules of controlled substances",
          "Possession and trafficking offences",
          "Production and importation controls",
          "Medical and scientific exemptions",
          "Law enforcement powers"
        ],
        relatedActs: ["Criminal Code", "Food and Drugs Act"],
        administeredBy: "Health Canada",
        sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/C-38.8/",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        title: "Immigration and Refugee Protection Act",
        shortTitle: "IRPA",
        actNumber: "S.C. 2001, c. 27",
        jurisdiction: "Federal",
        province: null,
        category: "Immigration",
        status: "In Force",
        dateEnacted: new Date("2002-06-28"),
        lastAmended: new Date("2024-11-26"),
        summary: "An Act respecting immigration to Canada and the granting of refugee protection to persons who are displaced, persecuted or in danger.",
        keyProvisions: [
          "Immigration classes and requirements",
          "Refugee protection system",
          "Inadmissibility grounds",
          "Removal procedures",
          "Appeals and reviews"
        ],
        relatedActs: ["Citizenship Act", "Quarantine Act"],
        administeredBy: "Immigration, Refugees and Citizenship Canada",
        sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/I-2.5/",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        title: "Privacy Act",
        shortTitle: "Privacy Act",
        actNumber: "R.S.C., 1985, c. P-21",
        jurisdiction: "Federal",
        province: null,
        category: "Privacy",
        status: "In Force",
        dateEnacted: new Date("1983-07-01"),
        lastAmended: new Date("2019-06-21"),
        summary: "An Act to extend the present laws of Canada that protect the privacy of individuals with respect to personal information about themselves held by government institutions.",
        keyProvisions: [
          "Individual access rights to personal information",
          "Government collection limitations",
          "Use and disclosure restrictions",
          "Privacy breach reporting",
          "Privacy Commissioner oversight"
        ],
        relatedActs: ["Access to Information Act", "Personal Information Protection and Electronic Documents Act"],
        administeredBy: "Office of the Privacy Commissioner",
        sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/P-21/",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        title: "Competition Act",
        shortTitle: "Competition Act",
        actNumber: "R.S.C., 1985, c. C-34",
        jurisdiction: "Federal",
        province: null,
        category: "Commercial Law",
        status: "In Force",
        dateEnacted: new Date("1986-06-19"),
        lastAmended: new Date("2024-06-20"),
        summary: "An Act to provide for the general regulation of trade and commerce in respect of conspiracies, trade practices and mergers affecting competition.",
        keyProvisions: [
          "Prohibition of anti-competitive agreements",
          "Merger review process",
          "Abuse of dominant position",
          "False or misleading advertising",
          "Competition Tribunal procedures"
        ],
        relatedActs: ["Consumer Packaging and Labelling Act", "Precious Metals Marking Act"],
        administeredBy: "Competition Bureau",
        sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/C-34/",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        title: "Canadian Environmental Protection Act, 1999",
        shortTitle: "CEPA 1999",
        actNumber: "S.C. 1999, c. 33",
        jurisdiction: "Federal",
        province: null,
        category: "Environmental",
        status: "In Force",
        dateEnacted: new Date("2000-03-31"),
        lastAmended: new Date("2023-06-13"),
        summary: "An Act respecting pollution prevention and the protection of the environment and human health in order to contribute to sustainable development.",
        keyProvisions: [
          "Toxic substances assessment and management",
          "Pollution prevention planning",
          "Environmental quality guidelines",
          "International air and water pollution",
          "Enforcement and penalties"
        ],
        relatedActs: ["Fisheries Act", "Species at Risk Act"],
        administeredBy: "Environment and Climate Change Canada",
        sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/C-15.31/",
        lastUpdated: new Date(),
        isActive: true
      }
    ];

    // Insert acts in batches
    const batchSize = 5;
    for (let i = 0; i < federalActs.length; i += batchSize) {
      const batch = federalActs.slice(i, i + batchSize);
      await db.insert(legalActs).values(batch);
      console.log(`Inserted federal acts ${i + 1} to ${Math.min(i + batchSize, federalActs.length)}`);
    }
  }

  /**
   * Populate landmark legal cases
   */
  async populateLandmarkCases(): Promise<void> {
    console.log("Populating landmark Canadian legal cases...");
    
    // Clear existing duplicates
    await db.delete(legalCases);

    const landmarkCases = [
      {
        caseName: "R. v. Oakes",
        caseNumber: "[1986] 1 S.C.R. 103",
        court: "Supreme Court of Canada",
        jurisdiction: "Federal",
        dateDecided: new Date("1986-02-28"),
        judge: "Chief Justice Dickson",
        parties: ["Her Majesty the Queen", "David Edwin Oakes"],
        summary: "Established the Oakes test for determining whether limitations on Charter rights are justified under section 1.",
        ruling: "The Crown failed to prove that reverse onus provision was justified under s. 1 of the Charter.",
        legalPrinciples: [
          "Section 1 Charter analysis framework",
          "Proportionality test for rights limitations",
          "Presumption of innocence",
          "Burden of proof standards"
        ],
        significance: "Fundamental case for Charter interpretation and rights analysis.",
        citedBy: ["R. v. Big M Drug Mart", "R. v. Edwards Books", "Dagenais v. CBC"],
        overturned: null,
        category: "Constitutional",
        keywords: ["Charter", "section 1", "Oakes test", "proportionality"],
        fullText: "The Court established that limitations on Charter rights must meet a stringent two-part test...",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        caseName: "Edwards v. Attorney General of Canada",
        caseNumber: "[1930] A.C. 124",
        court: "Judicial Committee of the Privy Council",
        jurisdiction: "Federal",
        dateDecided: new Date("1929-10-18"),
        judge: "Lord Sankey",
        parties: ["Emily Murphy et al.", "Attorney General of Canada"],
        summary: "The 'Persons Case' that determined women were 'persons' qualified for appointment to the Senate.",
        ruling: "Women are eligible for appointment to the Senate of Canada under section 24 of the Constitution Act, 1867.",
        legalPrinciples: [
          "Constitutional interpretation principles",
          "Living tree doctrine",
          "Gender equality",
          "Senate qualifications"
        ],
        significance: "Landmark case for women's rights and constitutional interpretation methodology.",
        citedBy: ["Reference re Same-Sex Marriage", "Quebec Secession Reference"],
        overturned: null,
        category: "Constitutional",
        keywords: ["persons case", "women's rights", "Senate", "living tree"],
        fullText: "The British North America Act planted in Canada a living tree capable of growth and expansion...",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        caseName: "R. v. Morgentaler",
        caseNumber: "[1988] 1 S.C.R. 30",
        court: "Supreme Court of Canada",
        jurisdiction: "Federal",
        dateDecided: new Date("1988-01-28"),
        judge: "Chief Justice Dickson",
        parties: ["Her Majesty the Queen", "Henry Morgentaler et al."],
        summary: "Struck down the Criminal Code provisions restricting access to abortion as unconstitutional.",
        ruling: "Section 251 of the Criminal Code violated s. 7 of the Charter (security of the person).",
        legalPrinciples: [
          "Security of the person",
          "Procedural fairness",
          "Access to healthcare",
          "State interference in medical decisions"
        ],
        significance: "Established constitutional protection for reproductive autonomy.",
        citedBy: ["Chaoulli v. Quebec", "Carter v. Canada"],
        overturned: null,
        category: "Charter Rights",
        keywords: ["abortion", "security of person", "medical autonomy", "Charter section 7"],
        fullText: "The right to security of the person is not limited to situations involving physical restraint...",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        caseName: "R. v. Big M Drug Mart Ltd.",
        caseNumber: "[1985] 1 S.C.R. 295",
        court: "Supreme Court of Canada",
        jurisdiction: "Federal",
        dateDecided: new Date("1985-04-24"),
        judge: "Justice Dickson",
        parties: ["Her Majesty the Queen", "Big M Drug Mart Ltd."],
        summary: "First Supreme Court case to apply Charter freedom of religion, striking down Lord's Day Act.",
        ruling: "The Lord's Day Act violated freedom of conscience and religion under s. 2(a) of the Charter.",
        legalPrinciples: [
          "Freedom of religion and conscience",
          "Purpose and effect test",
          "Separation of church and state",
          "Religious neutrality of government"
        ],
        significance: "Foundational case for religious freedom interpretation under the Charter.",
        citedBy: ["R. v. Edwards Books", "Syndicat Northcrest v. Amselem"],
        overturned: null,
        category: "Charter Rights",
        keywords: ["freedom of religion", "Lord's Day Act", "religious neutrality"],
        fullText: "The essence of the concept of freedom of religion is the right to entertain such religious beliefs...",
        lastUpdated: new Date(),
        isActive: true
      },

      {
        caseName: "Reference re Secession of Quebec",
        caseNumber: "[1998] 2 S.C.R. 217",
        court: "Supreme Court of Canada",
        jurisdiction: "Federal",
        dateDecided: new Date("1998-08-20"),
        judge: "The Court",
        parties: ["Reference by Governor in Council"],
        summary: "Advisory opinion on whether Quebec could unilaterally secede from Canada under domestic and international law.",
        ruling: "Quebec cannot unilaterally secede but Canada must negotiate if clear majority votes for secession on clear question.",
        legalPrinciples: [
          "Constitutional principles (federalism, democracy, rule of law, minority rights)",
          "Self-determination in international law",
          "Duty to negotiate",
          "Clear question and clear majority requirements"
        ],
        significance: "Definitive statement on secession law and constitutional principles.",
        citedBy: ["Reference re Senate Reform", "Quebec (Attorney General) v. Canada"],
        overturned: null,
        category: "Constitutional",
        keywords: ["secession", "Quebec", "constitutional principles", "federalism"],
        fullText: "The Constitution is more than a written text. It embraces the entire global system of rules and principles...",
        lastUpdated: new Date(),
        isActive: true
      }
    ];

    // Insert cases in batches
    const batchSize = 3;
    for (let i = 0; i < landmarkCases.length; i += batchSize) {
      const batch = landmarkCases.slice(i, i + batchSize);
      await db.insert(legalCases).values(batch);
      console.log(`Inserted landmark cases ${i + 1} to ${Math.min(i + batchSize, landmarkCases.length)}`);
    }
  }

  /**
   * Remove duplicate entries across all legal tables
   */
  async removeDuplicates(): Promise<void> {
    console.log("Removing duplicate legal entries...");
    
    // Remove duplicate criminal code sections by section number
    await db.execute(sql`
      DELETE FROM criminal_code_sections 
      WHERE id NOT IN (
        SELECT MIN(id) 
        FROM criminal_code_sections 
        GROUP BY section_number
      )
    `);

    // Remove duplicate legislative acts by title and act number
    await db.execute(sql`
      DELETE FROM legal_acts 
      WHERE id NOT IN (
        SELECT MIN(id) 
        FROM legal_acts 
        GROUP BY title, act_number
      )
    `);

    // Remove duplicate legal cases by case name and court
    await db.execute(sql`
      DELETE FROM legal_cases 
      WHERE id NOT IN (
        SELECT MIN(id) 
        FROM legal_cases 
        GROUP BY case_name, court
      )
    `);

    console.log("Duplicate removal completed.");
  }

  /**
   * Get comprehensive legal hierarchy
   */
  async getLegalHierarchy(): Promise<LegalHierarchy> {
    const [criminalSections, federalActs, cases] = await Promise.all([
      db.select().from(criminalCodeSections).orderBy(criminalCodeSections.sectionNumber),
      db.select().from(legalActs).orderBy(legalActs.title),
      db.select().from(legalCases).orderBy(legalCases.dateDecided)
    ]);

    return {
      federal: {
        criminal: criminalSections as any,
        constitutional: federalActs.filter(act => act.category === 'Constitutional') as any,
        civil: federalActs.filter(act => act.category === 'Civil') as any,
        administrative: federalActs.filter(act => ['Health', 'Social Security', 'Immigration'].includes(act.category || '')) as any,
        regulatory: federalActs.filter(act => ['Commercial Law', 'Environmental', 'Taxation'].includes(act.category || '')) as any
      },
      provincial: {},
      municipal: {}
    };
  }

  /**
   * Initialize comprehensive legal system
   */
  async initializeLegalSystem(): Promise<void> {
    console.log("Initializing comprehensive Canadian legal system...");
    
    try {
      await this.removeDuplicates();
      await this.populateCriminalCode();
      await this.populateFederalLegislation();
      await this.populateLandmarkCases();
      
      console.log("Legal system initialization completed successfully.");
    } catch (error) {
      console.error("Error initializing legal system:", error);
      throw error;
    }
  }
}

export const legalSystemOrganizer = new LegalSystemOrganizer();