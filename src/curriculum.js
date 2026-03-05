// GMG UNIVERSITY CURRICULUM - ALL 75 DAYS
// Volume 1: Fundraising Foundations (30 days)
// Volume 2: The GMG Way (30 days)
// Volume 3: CPP Model (15 days)

export const V1_CONTENT = {
  1: { 
    title: "The Four Sources of Money", 
    sections: [
      { h: "Where Money Comes From", c: "Every dollar a nonprofit receives comes from one of four sources, and understanding this is the foundation of everything else you'll learn in this curriculum. Those four sources are individuals, foundations, corporations, and earned revenue. That's the complete list, and there are no other options.\n\nMost people who are new to fundraising assume that foundations fund most nonprofit work, but they're wrong about that. Individual donors provide roughly 70% of all charitable giving in the United States, which means if your organization isn't prioritizing individual donor fundraising, you're ignoring the largest pool of available money by a significant margin." },
      { h: "Individual Donors", c: "Individual giving includes everything from $25 online donations all the way up to million-dollar major gifts, making it the most diverse and accessible funding source available to any nonprofit organization.\n\nSmall donors give through annual appeals, online campaigns, and events, typically contributing $25, $50, or $100 at a time. Individually these gifts seem small, but they add up in meaningful ways. An organization with 1,000 donors giving $100 each raises $100,000, and that's real money.\n\nMid-level donors give $1,000 to $10,000 annually. They're often overlooked because they're not major donors yet, but they're your best prospects for upgrades. Major donors give $10,000 or more and require personal relationships." },
      { h: "Foundations and Corporations", c: "Foundations are organizations that exist specifically to give money away, and they come in several varieties. Private foundations are funded by individuals or families, corporate foundations are funded by companies, and community foundations pool donations from many sources for local grantmaking.\n\nFoundation giving is project-focused. Most foundations fund specific initiatives rather than general operations. Foundation relationships take time. The first grant might take 18 months from initial contact to check in hand.\n\nCorporate giving happens through two distinct channels. Corporate foundations operate like other foundations, making grants based on applications. Corporate marketing budgets fund sponsorships that provide business value back to the company." },
      { h: "The Healthy Mix", c: "No single source should dominate your revenue because over-reliance on any source creates vulnerability that can threaten your organization's survival. If 80% of your budget comes from one government contract, losing that contract devastates you.\n\nA healthy mix might be 50% individuals, 25% foundations, 15% earned revenue, and 10% corporate. The exact percentages depend on your organization, but diversification matters." }
    ],
    exercise: "Find the most recent financial data for an organization you know. Calculate the percentage of revenue from each of the four sources. Is the mix healthy or risky? What would you recommend changing?",
    interactive: { type: "matching", title: "Match the Source to the Percentage", pairs: [{ left: "Individual Donors", right: "70%" }, { left: "Foundations", right: "18%" }, { left: "Corporations", right: "5%" }, { left: "Bequests", right: "7%" }] },
    keyTakeaways: ["All revenue comes from four sources only", "Individual donors provide 70% of charitable giving", "Diversification creates stability", "Understanding your mix is the first step"]
  },
  2: { 
    title: "Why People Actually Give", 
    sections: [
      { h: "Beyond Simple Altruism", c: "Most people believe donors give purely to help others, but that understanding is only partly true and misses important nuances. Charitable giving is rarely purely altruistic. Donors get something back, even if it's intangible.\n\nUnderstanding what donors get from giving helps you position your asks. You're not just asking for help. You're offering an opportunity." },
      { h: "Connection to Cause", c: "People give to causes they care about personally. A cancer survivor gives to cancer research. A first-generation college graduate gives to scholarships. Someone whose child benefited from after-school programs gives to youth organizations.\n\nPersonal connection is the strongest predictor of giving. When someone has direct experience with an issue, they understand its importance viscerally. This is why storytelling matters in fundraising. Stories create emotional connection even for people without direct experience." },
      { h: "Relationship with Asker", c: "People give to people, not just causes. If someone they trust and respect asks them to give, they're far more likely to say yes. This is why board members asking their friends works better than direct mail to strangers.\n\nFundraising is relationship work. Every interaction either strengthens or weakens the relationship. Strong relationships lead to strong giving." },
      { h: "Belief in Impact", c: "Donors want to believe their gift matters. If they think their $100 will disappear into a bureaucracy and change nothing, they won't give. If they believe their $100 will feed a family for a month, they will.\n\nThis is why specific impact statements work. 'Your gift of $50 provides school supplies for one child' is more compelling than 'Your gift supports our education programs.'" }
    ],
    exercise: "Think about a donation you've made personally. Which of these motivations drove your giving? How might that inform how you ask others?",
    interactive: { type: "sorting", title: "Rank Giving Motivations by Strength", items: ["Personal Connection", "Relationship with Asker", "Belief in Impact", "Tax Benefits"] },
    keyTakeaways: ["Giving is rarely purely altruistic", "Personal connection is the strongest predictor", "People give to people, not just causes", "Specific impact statements work better"]
  },
  3: { 
    title: "The Donor Lifecycle", 
    sections: [
      { h: "Understanding the Journey", c: "Every donor moves through a journey with your organization. Understanding this lifecycle helps you meet donors where they are and move them forward appropriately.\n\nThe lifecycle has four stages: identification, cultivation, solicitation, and stewardship. Each stage requires different activities and different types of communication." },
      { h: "Identification", c: "Identification means finding potential donors. Who cares about your mission? Where do they gather? What characteristics do they share?\n\nProspect research helps you identify people with capacity and inclination to give. But don't overlook people already connected to your work. Current volunteers, event attendees, and service recipients often become donors." },
      { h: "Cultivation", c: "Cultivation builds the relationship before you ask. Share impact stories. Invite them to events. Make them feel like insiders who understand your work deeply.\n\nCultivation takes time. Rushing to the ask before building relationship usually fails. The bigger the gift you want, the longer the cultivation period." },
      { h: "Solicitation and Stewardship", c: "Solicitation is making the ask. Right amount, right timing, right asker. Always specific, never vague. 'Would you consider a gift of $1,000 to fund our summer program?' not 'Would you consider supporting us?'\n\nStewardship is thanking and retaining. Thank within 48 hours. Report impact. Upgrade over time. The goal is moving donors from first gift to legacy giving." }
    ],
    exercise: "Map your organization's current donors to lifecycle stages. Where are most of them? Where are the gaps?",
    interactive: { type: "sorting", title: "Put Lifecycle Stages in Order", items: ["Identification", "Cultivation", "Solicitation", "Stewardship"] },
    keyTakeaways: ["Four stages: identify, cultivate, solicit, steward", "Don't rush to the ask", "Stewardship leads to retention and upgrades", "The goal is lifetime giving, not single gifts"]
  },
  4: { 
    title: "The Donor Pyramid", 
    sections: [
      { h: "Visualizing Your Donors", c: "The donor pyramid is a visual representation of your donor base. It shows giving levels stacked from bottom to top, with the most donors at the bottom and fewest at the top.\n\nUnderstanding your pyramid helps you see where to focus energy and where upgrades might come from." },
      { h: "Base: Annual Fund", c: "The base of the pyramid holds your annual fund donors giving under $250. This is typically thousands of donors making small gifts through appeals, events, and online campaigns.\n\nThese donors are your entry point. Everyone starts somewhere. Today's $50 donor could become tomorrow's major donor if cultivated properly." },
      { h: "Middle: Mid-Level Donors", c: "The middle holds mid-level donors giving $250-$999. This group is often overlooked but critically important. They've demonstrated commitment beyond a casual gift.\n\nMid-level donors are your best upgrade prospects. Someone giving $500 consistently is showing loyalty worth cultivating toward major gift levels." },
      { h: "Top: Major and Planned Giving", c: "Upper levels hold major donors giving $1,000-$100,000+. These relationships require personal attention and strategic cultivation.\n\nThe very top holds planned giving donors who have included you in their estate plans. These gifts might not arrive for years but can be transformational.\n\nKey stat: 80-90% of dollars come from 10-20% of donors. Your job is moving donors UP the pyramid, not just adding to the base." }
    ],
    exercise: "Create a simple donor pyramid for your organization. How many donors at each level? What percentage of revenue comes from each level?",
    interactive: { type: "slider", title: "The 80/20 rule means top donors provide what percentage?", answer: 80, tolerance: 10 },
    keyTakeaways: ["80-90% of dollars come from 10-20% of donors", "Mid-level donors are often overlooked", "Everyone enters at the base", "Your job is moving donors UP"]
  },
  5: { 
    title: "Quiz: Days 1-4", 
    type: "quiz",
    questions: [
      { q: "What percentage of charitable giving comes from individuals?", a: "A", opts: ["A. About 70%", "B. About 40%", "C. About 25%", "D. About 90%"] },
      { q: "What is the strongest predictor of giving behavior?", a: "B", opts: ["A. Wealth", "B. Personal connection to cause", "C. Tax benefits", "D. Peer pressure"] },
      { q: "What is the industry average donor retention rate?", a: "A", opts: ["A. About 45%", "B. About 75%", "C. About 60%", "D. About 30%"] },
      { q: "The 80/20 rule means top donors provide what percentage of dollars?", a: "D", opts: ["A. 20%", "B. 50%", "C. 60%", "D. 80%"] },
      { q: "Which lifecycle stage comes immediately before solicitation?", a: "B", opts: ["A. Identification", "B. Cultivation", "C. Stewardship", "D. Retention"] }
    ]
  },
  6: { 
    title: "Annual Giving Programs", 
    sections: [
      { h: "What Annual Giving Means", c: "Annual giving is the systematic effort to secure gifts from donors each year. It's the foundation of individual fundraising and creates the base of your donor pyramid.\n\nAnnual giving typically includes direct mail appeals, online campaigns, phonathons, and giving days. The goal is renewable, predictable revenue." },
      { h: "Building Your Program", c: "Effective annual giving requires segmentation. Not everyone should receive the same message. New donors need different cultivation than lapsed donors or loyal repeaters.\n\nTiming matters too. Year-end giving (October through December) accounts for roughly 30% of annual charitable giving. But relying only on year-end leaves money on the table." },
      { h: "Channels and Approaches", c: "Direct mail still works, especially for older donors. Email is essential but crowded. Social media builds awareness but rarely drives major gifts.\n\nThe best programs use multiple channels working together. A direct mail piece followed by email follow-up and a phone call converts better than any single channel alone." }
    ],
    exercise: "Review your organization's annual giving calendar. Are there gaps? Are you over-relying on year-end?",
    interactive: { type: "matching", title: "Match Channel to Best Use", pairs: [{ left: "Direct Mail", right: "Older donors" }, { left: "Email", right: "Quick updates" }, { left: "Phone", right: "Personal touch" }, { left: "Social Media", right: "Awareness" }] },
    keyTakeaways: ["Annual giving creates predictable revenue", "Segmentation improves results", "Year-end is critical but not everything", "Multiple channels work better than one"]
  },
  7: { 
    title: "Foundation Grants Reality", 
    sections: [
      { h: "The Foundation Landscape", c: "There are over 100,000 grantmaking foundations in the United States. That sounds like a lot of opportunity, but most are small family foundations with limited staff and specific geographic or issue focus.\n\nThe largest foundations (Gates, Ford, etc.) receive thousands of applications and fund a tiny percentage. Competition is fierce." },
      { h: "Success Rates", c: "Typical foundation grant success rates are 15-30% for organizations with good fit. That means even well-matched proposals fail more often than they succeed.\n\nThis reality means you need a pipeline. If you need three grants to fund a program, you should submit ten applications. Don't bet everything on one proposal." },
      { h: "Building Relationships", c: "The best foundation relationships develop over time. Many foundations won't fund first-time applicants for major grants. They want to see you succeed with a smaller grant first.\n\nResearch matters. Understanding a foundation's priorities, past grantees, and decision-making process helps you target effectively and avoid wasting time on poor fits." }
    ],
    exercise: "Research three foundations that might fund your work. What are their stated priorities? What have they funded recently?",
    interactive: { type: "slider", title: "What is a typical foundation grant success rate?", answer: 20, tolerance: 10 },
    keyTakeaways: ["Over 100,000 foundations exist but most are small", "Success rates are typically 15-30%", "Build a pipeline, not single applications", "Relationships develop over time"]
  },
  8: { 
    title: "Corporate Partnerships", 
    sections: [
      { h: "Why Companies Give", c: "Companies give for business reasons, not charity. They're looking for brand alignment, employee engagement, market access, and community goodwill. Understanding their motivation helps you position your ask effectively.\n\nA company considering a partnership is asking 'what's in it for us?' The more clearly you can articulate the business value you offer, the more likely they are to say yes." },
      { h: "Sponsorship vs Philanthropy", c: "Corporate foundations make philanthropic grants based on community benefit. Corporate marketing departments buy sponsorships because they want marketing value in return.\n\nKnow which door you're knocking on. A philanthropy pitch to a marketing team falls flat, and a sponsorship pitch to a foundation seems transactional." },
      { h: "Employee Connections", c: "Many corporate relationships start with employee connections. If someone at the company already supports your organization personally, they can open doors to corporate giving.\n\nMatching gift programs, volunteer grants, and employee giving campaigns all leverage individual relationships into corporate support." }
    ],
    exercise: "Identify three companies where you have employee connections. What corporate giving programs do they offer?",
    interactive: { type: "matching", title: "Match Corporate Motivation to Source", pairs: [{ left: "Marketing Budget", right: "Sponsorship" }, { left: "Foundation", right: "Philanthropy" }, { left: "HR Budget", right: "Employee Engagement" }, { left: "Community Relations", right: "Local Goodwill" }] },
    keyTakeaways: ["Corporate giving serves business purposes", "Sponsorship comes from marketing budgets", "Know which door you're knocking on", "Employee connections open doors"]
  },
  9: { 
    title: "Earned Revenue Strategies", 
    sections: [
      { h: "What Earned Revenue Means", c: "Earned revenue comes from selling goods or services rather than asking for donations. It includes fee-for-service programs, product sales, consulting, training, and ticket sales.\n\nEarned revenue is attractive because it's unrestricted. There are no grant restrictions, no donor preferences, no reporting requirements." },
      { h: "Benefits and Challenges", c: "Benefits include unrestricted income, reduced dependence on fundraising, and potential for scale. Some organizations generate significant earned revenue. Museums sell tickets. Hospitals bill for services. Universities charge tuition.\n\nChallenges include different skills required (selling vs fundraising), startup investment needed, and mission drift risk if you chase revenue that doesn't advance mission." }
    ],
    exercise: "Brainstorm three potential earned revenue opportunities for your organization. What would it take to launch each?",
    interactive: { type: "sorting", title: "Rank Revenue Types by Restriction (Most to Least)", items: ["Government Grant", "Foundation Grant", "Corporate Sponsorship", "Earned Revenue"] },
    keyTakeaways: ["Earned revenue provides unrestricted income", "Different skills required than fundraising", "Watch for mission drift risk", "Do market research first"]
  },
  10: { 
    title: "Quiz: Days 6-9", 
    type: "quiz",
    questions: [
      { q: "Year-end giving accounts for approximately what percentage of annual charitable giving?", a: "B", opts: ["A. 15%", "B. 30%", "C. 50%", "D. 75%"] },
      { q: "What is a typical foundation grant success rate?", a: "B", opts: ["A. About 50%", "B. About 20%", "C. About 75%", "D. About 5%"] },
      { q: "Corporate sponsorship typically comes from which budget?", a: "C", opts: ["A. HR Budget", "B. Foundation Budget", "C. Marketing Budget", "D. Operations Budget"] },
      { q: "Which revenue type is typically the LEAST restricted?", a: "D", opts: ["A. Government Grants", "B. Foundation Grants", "C. Corporate Sponsorship", "D. Earned Revenue"] },
      { q: "How many grantmaking foundations exist in the US?", a: "C", opts: ["A. About 10,000", "B. About 50,000", "C. About 100,000", "D. About 500,000"] }
    ]
  },
  11: { 
    title: "Board Fundraising Responsibility", 
    sections: [
      { h: "Why Boards Must Fundraise", c: "Board members often resist fundraising because they think it's the staff's job. But board fundraising is essential. Board members bring networks, credibility, and peer relationships that staff can't replicate.\n\nWhen a board member asks a peer for a gift, it carries different weight than a staff request. They're asking as volunteers who have already committed their own resources." },
      { h: "Give and Get", c: "The standard expectation is 'give and get.' Board members should make their own meaningful gifts AND help secure gifts from others.\n\n100% board giving is the baseline. If your own board doesn't give, why should anyone else? The amount matters less than the participation rate, though stretch gifts set a powerful example." },
      { h: "Board Roles in Fundraising", c: "Not every board member does the same fundraising activities. Some are natural askers. Some are better at cultivation events. Some open doors through their networks.\n\nThe key is engaging every board member in some fundraising role, even if it's providing prospect names or hosting a house party." }
    ],
    exercise: "Assess your board's current fundraising engagement. What percentage give? What activities are they willing to do?",
    interactive: { type: "matching", title: "Match Board Role to Activity", pairs: [{ left: "Connector", right: "Opens doors" }, { left: "Ambassador", right: "Tells the story" }, { left: "Solicitor", right: "Makes asks" }, { left: "Host", right: "Holds events" }] },
    keyTakeaways: ["100% board giving is the standard", "Give and get is the expectation", "Different members play different roles", "Peer asks carry special weight"]
  },
  12: { 
    title: "Grant Research Methods", 
    sections: [
      { h: "Finding the Right Foundations", c: "Effective grant research starts with fit, not just funding amount. A foundation that funds your issue area in your geography is worth pursuing. One that doesn't is a waste of time regardless of size.\n\nStart with foundations already funding similar organizations. If they fund your peers, they might fund you." },
      { h: "Research Tools", c: "Foundation Directory Online, Candid, and GrantStation provide searchable databases of funders. Many libraries offer free access. State association of nonprofits often provide resources too.\n\n990 forms reveal foundation giving patterns. Every private foundation files annually, listing all grants made. These are public records available on Candid or ProPublica's Nonprofit Explorer." },
      { h: "Qualifying Prospects", c: "Not every foundation that might fund you is worth pursuing. Consider grant size (too small isn't worth the effort), application complexity, geographic restrictions, and timeline.\n\nCreate a qualified prospect list with deadlines, amounts, and notes on fit. This becomes your grant calendar." }
    ],
    exercise: "Research five foundations using 990s or databases. Create prospect profiles with funding priorities, typical grant size, and deadline.",
    interactive: { type: "slider", title: "How many grantmaking foundations exist in the US?", answer: 100000, tolerance: 20000 },
    keyTakeaways: ["Fit matters more than size", "990 forms are public records", "Start with foundations funding similar orgs", "Build a qualified prospect list"]
  },
  13: { 
    title: "Donor Retention Fundamentals", 
    sections: [
      { h: "The Retention Problem", c: "Industry average donor retention is only 45%. That means more than half of donors who give this year won't give next year. First-time donor retention is even worse at about 19%.\n\nThis creates a leaky bucket problem. You're constantly replacing lost donors rather than growing your base." },
      { h: "Why Donors Leave", c: "Research shows donors leave for predictable reasons. They don't feel appreciated. They don't see impact. They weren't asked again. They can't afford it. They forgot.\n\nNotice that most reasons relate to communication and stewardship, not the donor's circumstances. We lose donors through neglect, not inevitability." },
      { h: "Retention Strategies", c: "Thank quickly and personally. Report impact specifically. Ask again appropriately. Make giving easy. Remember preferences.\n\nA donor who gives twice is significantly more likely to become a long-term supporter. Getting the second gift is critical." }
    ],
    exercise: "Calculate your organization's retention rate. What percentage of last year's donors gave again this year?",
    interactive: { type: "slider", title: "What is the industry average donor retention rate?", answer: 45, tolerance: 10 },
    keyTakeaways: ["Average retention is only 45%", "First-time retention is 19%", "Most lapsed donors cite poor stewardship", "The second gift is critical"]
  },
  14: { 
    title: "Fundraising Systems and Tools", 
    sections: [
      { h: "Why Systems Matter", c: "Fundraising without systems leads to missed opportunities, duplicated effort, and dropped balls. Even small organizations need structured approaches to donor management.\n\nThe right systems help you know who gave, when they gave, what they responded to, and when to follow up." },
      { h: "CRM Basics", c: "A donor database or CRM (Customer Relationship Management system) is essential. Options range from free (spreadsheets, Little Green Light) to enterprise (Salesforce, Blackbaud).\n\nChoose based on your size and needs. A $200,000 organization doesn't need enterprise software, but it does need something more than memory." },
      { h: "Essential Tracking", c: "At minimum, track: contact information, giving history, communication history, relationships, and notes on preferences and interests.\n\nRegular maintenance matters. Bounced mail costs money and signals neglect. Update addresses annually at minimum." }
    ],
    exercise: "Audit your current donor tracking system. What information are you capturing? What are you missing?",
    interactive: { type: "matching", title: "Match CRM Level to Organization", pairs: [{ left: "Spreadsheet", right: "Under $100K budget" }, { left: "Little Green Light", right: "$100K-$500K budget" }, { left: "Bloomerang", right: "$500K-$2M budget" }, { left: "Salesforce", right: "Over $2M budget" }] },
    keyTakeaways: ["Systems prevent dropped balls", "Choose tools appropriate to size", "Track giving history, communications, relationships", "Maintain data quality regularly"]
  },
  15: { 
    title: "Quiz: Days 11-14", 
    type: "quiz",
    questions: [
      { q: "What is the standard expectation for board giving participation?", a: "D", opts: ["A. 50%", "B. 75%", "C. 90%", "D. 100%"] },
      { q: "Which resource reveals all grants a foundation made?", a: "B", opts: ["A. Annual Report", "B. 990 Form", "C. Website", "D. Press Releases"] },
      { q: "What is the first-time donor retention rate?", a: "A", opts: ["A. About 19%", "B. About 35%", "C. About 50%", "D. About 65%"] },
      { q: "The most common reason donors lapse is:", a: "B", opts: ["A. Can't afford to give", "B. Poor stewardship", "C. Moved away", "D. Found another cause"] },
      { q: "At minimum, a donor database should track:", a: "D", opts: ["A. Just donations", "B. Donations and addresses", "C. Donations, addresses, and emails", "D. All of the above plus relationships and notes"] }
    ]
  },
  16: { 
    title: "Grant Writing Basics", 
    sections: [
      { h: "Understanding Grant Structure", c: "Most grant applications follow a predictable structure: organizational overview, statement of need, project description, goals and objectives, evaluation plan, and budget.\n\nUnderstanding what each section requires helps you prepare materials you can adapt for multiple applications." },
      { h: "Statement of Need", c: "The statement of need establishes why this project matters. Use data to quantify the problem. Use stories to humanize it. Show that you understand the issue deeply.\n\nAvoid circular logic ('we need money because we don't have money'). Focus on community need, not organizational need." },
      { h: "Goals, Objectives, and Evaluation", c: "Goals are broad outcomes you hope to achieve. Objectives are specific, measurable steps toward goals. Evaluation describes how you'll know if you succeeded.\n\nMake objectives SMART: Specific, Measurable, Achievable, Relevant, Time-bound." }
    ],
    exercise: "Draft a one-paragraph statement of need for a program at your organization. Use at least one data point and one human element.",
    interactive: { type: "sorting", title: "Put Grant Sections in Order", items: ["Organizational Overview", "Statement of Need", "Project Description", "Evaluation Plan", "Budget"] },
    keyTakeaways: ["Standard sections appear in most grants", "Statement of need focuses on community, not organization", "Objectives should be SMART", "Budget must match narrative"]
  },
  17: { 
    title: "Major Donor Identification", 
    sections: [
      { h: "Who Are Major Donors?", c: "Major donors are individuals capable of giving $10,000 or more (though thresholds vary by organization). They require personal relationship management rather than mass communication.\n\nMost organizations already have major donor prospects hiding in their data. People who give consistently, attend events, and volunteer are signaling interest worth cultivating." },
      { h: "Capacity and Inclination", c: "Major gift fundraising requires identifying prospects with both capacity (ability to give) and inclination (willingness to give). Wealth alone doesn't predict giving. Connection to your mission matters more.\n\nResearch tools like WealthEngine and DonorSearch can indicate capacity. But inclination must be developed through relationship." },
      { h: "Prospect Research", c: "Basic prospect research includes real estate holdings, business ownership, previous giving to other organizations, and board affiliations.\n\nStart with your current donors. Who has capacity you haven't explored? Then expand to connections of board members and other donors." }
    ],
    exercise: "Review your top 20 donors. Research capacity indicators for three who might be major gift prospects.",
    interactive: { type: "matching", title: "Match Prospect Indicator to What It Suggests", pairs: [{ left: "Real Estate Holdings", right: "Wealth capacity" }, { left: "Previous Giving", right: "Philanthropic inclination" }, { left: "Board Service", right: "Leadership engagement" }, { left: "Event Attendance", right: "Interest in cause" }] },
    keyTakeaways: ["Major donors require personal relationships", "Both capacity AND inclination matter", "Current donors may have hidden capacity", "Research informs cultivation strategy"]
  },
  18: { 
    title: "Planned Giving Basics", 
    sections: [
      { h: "What Planned Giving Is", c: "Planned giving refers to gifts that require planning, typically involving estate planning or assets rather than cash. Bequests (gifts left in wills) are the most common form.\n\nPlanned gifts are often the largest gifts a donor will ever make. A $100 annual donor might leave a $50,000 bequest." },
      { h: "Types of Planned Gifts", c: "Bequests are the simplest: 'I leave $X to Organization Y.' Beneficiary designations name your organization on retirement accounts or life insurance.\n\nMore complex vehicles include charitable remainder trusts, charitable gift annuities, and retained life estates. These provide income or use to the donor while ultimately benefiting your organization." },
      { h: "Marketing Planned Giving", c: "Planned giving marketing should be soft and invitational. Phrases like 'remember us in your will' or 'join our legacy society' plant seeds without pressure.\n\nMost planned giving donors are longtime supporters. Your best prospects are loyal donors age 55+ who give consistently but not lavishly." }
    ],
    exercise: "Identify five donors who fit the planned giving prospect profile (55+, loyal, consistent giving). How might you introduce the conversation?",
    interactive: { type: "matching", title: "Match Planned Gift Type to Description", pairs: [{ left: "Bequest", right: "Gift in will" }, { left: "Beneficiary Designation", right: "Retirement account" }, { left: "Charitable Remainder Trust", right: "Income to donor then charity" }, { left: "Gift Annuity", right: "Fixed income for life" }] },
    keyTakeaways: ["Bequests are the most common planned gift", "Planned gifts are often the largest ever", "Best prospects are loyal donors 55+", "Marketing should be soft and invitational"]
  },
  19: { 
    title: "Corporate Sponsorship Strategy", 
    sections: [
      { h: "What Sponsors Want", c: "Sponsors want value, not charity. They're making a marketing investment and expect return. That return might be brand visibility, customer access, employee engagement, or community goodwill.\n\nThe more clearly you can articulate what sponsors get, the more successfully you can price and sell sponsorships." },
      { h: "Building Sponsor Packages", c: "Create tiered packages with clear benefits at each level. Benefits might include logo placement, event tickets, speaking opportunities, social media mentions, and employee volunteer opportunities.\n\nPrice packages based on value delivered, not arbitrary numbers. What would the company pay for equivalent marketing reach?" },
      { h: "Sponsor Stewardship", c: "Fulfillment matters enormously. Deliver everything promised and document it. Send sponsors a fulfillment report showing every benefit delivered.\n\nSponsors who feel they got good value renew. Those who feel neglected don't." }
    ],
    exercise: "Create a three-tier sponsorship package for an event or program. List specific benefits at each level.",
    interactive: { type: "sorting", title: "Rank Sponsor Benefits by Typical Value", items: ["Logo on Materials", "Speaking Opportunity", "Title Sponsorship", "Social Media Mention"] },
    keyTakeaways: ["Sponsors want marketing value", "Create tiered packages with clear benefits", "Price based on value delivered", "Fulfillment reports prove value"]
  },
  20: { 
    title: "Quiz: Days 16-19", 
    type: "quiz",
    questions: [
      { q: "What does SMART stand for in objectives?", a: "A", opts: ["A. Specific, Measurable, Achievable, Relevant, Time-bound", "B. Simple, Manageable, Actionable, Realistic, Targeted", "C. Strategic, Meaningful, Attainable, Results-focused, Timely", "D. Specific, Metric-driven, Ambitious, Resource-efficient, Trackable"] },
      { q: "Major gift fundraising requires prospects with:", a: "D", opts: ["A. Just wealth", "B. Just interest", "C. Just previous giving", "D. Both capacity and inclination"] },
      { q: "The most common form of planned giving is:", a: "A", opts: ["A. Bequests", "B. Charitable Remainder Trusts", "C. Gift Annuities", "D. Beneficiary Designations"] },
      { q: "Sponsors are making what type of investment?", a: "C", opts: ["A. Charitable", "B. Philanthropic", "C. Marketing", "D. Social"] },
      { q: "Best planned giving prospects are typically:", a: "B", opts: ["A. Wealthy young professionals", "B. Loyal donors age 55+", "C. Board members", "D. Major donors"] }
    ]
  },
  21: { 
    title: "Digital Fundraising", 
    sections: [
      { h: "Digital Landscape", c: "Digital fundraising includes email appeals, social media campaigns, crowdfunding, peer-to-peer fundraising, and online giving pages. It reaches donors where they spend time and enables immediate action.\n\nDigital complements but doesn't replace other channels. The best results come from integrated approaches." },
      { h: "Email Best Practices", c: "Email remains the workhorse of digital fundraising. Subject lines matter enormously. Personalization improves results. Clear calls to action drive clicks.\n\nSegmentation improves relevance. A message to lapsed donors should differ from one to loyal supporters." },
      { h: "Social Media Strategy", c: "Social media builds community and awareness but rarely drives major gifts directly. Its value is in storytelling, engagement, and staying top-of-mind.\n\nChoose platforms where your audience actually spends time. Quality engagement on one platform beats scattered presence everywhere." }
    ],
    exercise: "Audit your organization's digital presence. Which channels are working? Which need attention?",
    interactive: { type: "matching", title: "Match Digital Channel to Best Use", pairs: [{ left: "Email", right: "Direct appeals" }, { left: "Facebook", right: "Community building" }, { left: "LinkedIn", right: "Professional networking" }, { left: "Instagram", right: "Visual storytelling" }] },
    keyTakeaways: ["Digital complements other channels", "Email remains the workhorse", "Social builds awareness not major gifts", "Choose platforms strategically"]
  },
  22: { 
    title: "Storytelling for Fundraising", 
    sections: [
      { h: "Why Stories Work", c: "Stories create emotional connection that data alone cannot. The brain processes narrative differently than statistics. A single compelling story can move donors to action when numbers fail.\n\nStories make your mission tangible and personal. They transform abstract impact into human experience." },
      { h: "Story Structure", c: "Effective fundraising stories follow a simple arc: challenge, intervention, transformation. A person faces a problem. Your organization helps. Their life improves.\n\nThe donor becomes the hero who makes transformation possible. Position the donor as essential to the happy ending." },
      { h: "Collecting Stories", c: "Build systems for capturing stories. Train program staff to notice and document impact moments. Create consent processes that respect privacy while enabling storytelling.\n\nA library of stories ready to deploy across channels makes fundraising communication much easier." }
    ],
    exercise: "Write one fundraising story from your organization using the challenge-intervention-transformation structure.",
    interactive: { type: "sorting", title: "Put Story Elements in Order", items: ["Challenge/Problem", "Introduction of Organization", "Intervention/Help Provided", "Transformation/Results"] },
    keyTakeaways: ["Stories create emotional connection", "Challenge-intervention-transformation arc works", "Position the donor as hero", "Build a story library"]
  },
  23: { 
    title: "Capital Campaigns", 
    sections: [
      { h: "What Capital Campaigns Are", c: "Capital campaigns are intensive, time-limited fundraising efforts for major projects: buildings, endowments, or significant program expansion. They're distinct from annual fundraising.\n\nCampaigns typically target multiples of annual fundraising. If you raise $500,000 annually, a $2-3 million campaign might be realistic." },
      { h: "Campaign Phases", c: "The quiet phase (or nucleus phase) secures lead gifts before public announcement. Typically 50-70% of the goal should be committed before going public.\n\nThe public phase builds momentum and engages broader audiences. It's harder to succeed publicly if you haven't already secured major commitments." },
      { h: "Feasibility Studies", c: "Before launching a campaign, a feasibility study tests donor capacity, willingness to give, and potential objections. An outside consultant typically conducts these studies.\n\nA feasibility study might reveal that your goal is too ambitious, your case isn't compelling, or your timing isn't right. Better to learn this before launch." }
    ],
    exercise: "If your organization were to conduct a capital campaign, what would the project be? Rough goal estimate?",
    interactive: { type: "slider", title: "What percentage should be raised in quiet phase?", answer: 60, tolerance: 15 },
    keyTakeaways: ["Campaigns are time-limited and project-focused", "Quiet phase secures 50-70% before going public", "Feasibility studies test readiness", "Campaign goals are multiples of annual fundraising"]
  },
  24: { 
    title: "Monthly Giving Programs", 
    sections: [
      { h: "The Power of Monthly Giving", c: "Monthly giving creates predictable, sustainable revenue. A donor giving $25/month provides $300 annually, while the average one-time gift is often $100 or less.\n\nMonthly donors also retain at dramatically higher rates. While overall retention hovers around 45%, monthly donor retention often exceeds 80-90%." },
      { h: "Building a Monthly Program", c: "Creating a monthly giving program requires dedicated landing pages, suggested amounts, clear impact messaging, and easy signup processes.\n\nName your monthly giving society. Make members feel like insiders. Provide exclusive updates and recognition." },
      { h: "Converting Annual Donors", c: "Your best monthly giving prospects are current donors. When someone makes a one-time gift, offer the monthly option. 'Your $100 gift could become $10/month for sustainable impact.'\n\nEmphasize convenience and impact, not commitment. Monthly giving should feel easy, not like a burden." }
    ],
    exercise: "Calculate: if 100 donors converted from $100/year to $10/month, what's the revenue difference?",
    interactive: { type: "slider", title: "$25/month equals how much per year?", answer: 300, tolerance: 0 },
    keyTakeaways: ["Monthly donors give more annually", "Retention rates are dramatically higher", "Create a named monthly giving society", "Current donors are best prospects"]
  },
  25: { 
    title: "Quiz: Days 21-24", 
    type: "quiz",
    questions: [
      { q: "Which digital channel is best for direct appeals?", a: "A", opts: ["A. Email", "B. Facebook", "C. Instagram", "D. Twitter"] },
      { q: "What story structure works best for fundraising?", a: "B", opts: ["A. Problem-Solution-Call to Action", "B. Challenge-Intervention-Transformation", "C. Beginning-Middle-End", "D. Hook-Story-Offer"] },
      { q: "What percentage should be raised in a campaign's quiet phase?", a: "C", opts: ["A. 20-30%", "B. 40-50%", "C. 50-70%", "D. 80-90%"] },
      { q: "Monthly donor retention rates often exceed:", a: "D", opts: ["A. 50%", "B. 60%", "C. 70%", "D. 80%"] },
      { q: "$25/month equals how much per year?", a: "B", opts: ["A. $250", "B. $300", "C. $350", "D. $400"] }
    ]
  },
  26: { 
    title: "Board Development", 
    sections: [
      { h: "Building an Effective Board", c: "Board development is intentional work to recruit, engage, and develop board members. Strong boards don't happen by accident. They're built through deliberate attention to composition, engagement, and leadership.\n\nA working board matrix identifies what skills, connections, and demographics you need and what you have. Gaps inform recruitment priorities." },
      { h: "Recruitment Best Practices", c: "Recruit for specific needs, not just warm bodies. A board of all lawyers or all retirees misses important perspectives. Seek diversity of profession, background, and viewpoint.\n\nClearly communicate expectations before someone joins. Prospective members should understand time commitment, giving expectations, and committee responsibilities." },
      { h: "Engagement and Rotation", c: "Engaged boards need meaningful work. If meetings are boring reports, attendance drops. Create opportunities for members to use their talents and see impact.\n\nTerm limits create healthy rotation. While losing good members hurts, term limits also create natural exits for disengaged members and bring fresh perspectives." }
    ],
    exercise: "Create a board matrix showing current members and their attributes. Where are the gaps?",
    interactive: { type: "matching", title: "Match Board Function to Activity", pairs: [{ left: "Governance", right: "Policy and oversight" }, { left: "Fiduciary", right: "Financial stewardship" }, { left: "Strategic", right: "Direction setting" }, { left: "Fundraising", right: "Resource development" }] },
    keyTakeaways: ["Strong boards require intentional development", "Use a matrix to identify gaps", "Communicate expectations clearly", "Term limits create healthy rotation"]
  },
  27: { 
    title: "Prospect Research Deep Dive", 
    sections: [
      { h: "Research Sources", c: "Prospect research draws from public records, wealth screening tools, and relationship mapping. Real estate records, SEC filings, and nonprofit 990s reveal capacity. LinkedIn and news archives show career and philanthropy.\n\nWealth screening tools like WealthEngine and DonorSearch aggregate data and provide capacity ratings. These cost money but save research time." },
      { h: "Building Profiles", c: "A prospect profile includes: biographical information, capacity indicators, philanthropic history, connection to your organization, and cultivation strategy.\n\nThe goal isn't just information but actionable insight. What does this person care about? Who might introduce them? What would motivate their giving?" },
      { h: "Ethics and Boundaries", c: "Prospect research must respect privacy and use only legal, ethical sources. Don't contact people inappropriately or misuse information.\n\nResearch informs relationship-building. It's not a substitute for genuine connection. Use research to personalize approach, not to manipulate." }
    ],
    exercise: "Create a prospect profile for one potential major donor including capacity, connection, and cultivation approach.",
    interactive: { type: "matching", title: "Match Research Source to What It Reveals", pairs: [{ left: "Real Estate Records", right: "Asset ownership" }, { left: "SEC Filings", right: "Stock holdings" }, { left: "990 Forms", right: "Foundation giving" }, { left: "LinkedIn", right: "Career/connections" }] },
    keyTakeaways: ["Multiple sources build complete picture", "Profiles should be actionable", "Ethics matter in research", "Research informs, doesn't replace, relationship"]
  },
  28: { 
    title: "Fundraising Metrics", 
    sections: [
      { h: "Why Metrics Matter", c: "What gets measured gets managed. Fundraising metrics help you understand what's working, identify problems early, and make informed decisions about where to invest effort.\n\nBut metrics can also mislead. Focus on the right metrics, not just easy ones to track." },
      { h: "Key Performance Indicators", c: "Essential metrics include: total raised, number of donors, average gift size, donor retention rate, cost to raise a dollar, and lifetime value.\n\nTrack trends over time, not just single points. Is retention improving? Is average gift growing? Direction matters as much as current numbers." },
      { h: "Using Data for Decisions", c: "Metrics should inform action. If retention is dropping, investigate why. If a campaign underperforms, analyze what happened.\n\nDon't let data paralyze you. Good enough data that drives action beats perfect data that sits in reports." }
    ],
    exercise: "Identify the five most important metrics for your organization's fundraising. Are you currently tracking them?",
    interactive: { type: "slider", title: "A healthy cost to raise a dollar is typically under:", answer: 25, tolerance: 10 },
    keyTakeaways: ["What gets measured gets managed", "Track trends, not just points", "Focus on actionable metrics", "Data should drive decisions"]
  },
  29: { 
    title: "Strategic Fundraising Planning", 
    sections: [
      { h: "Beyond Tactics", c: "Strategic planning moves beyond individual tactics to integrated, long-term thinking. Where do you want to be in three years? What mix of revenue will get you there?\n\nA fundraising plan aligns with organizational strategy. If the organization is growing programs, fundraising must grow to match." },
      { h: "Planning Components", c: "A fundraising plan includes: current state assessment, goals and objectives, strategies by revenue stream, activity calendars, staffing needs, and budget.\n\nBuild plans from realistic assumptions, not wishful thinking. Growth of 10-15% annually is ambitious but achievable. Doubling overnight rarely happens." },
      { h: "Implementation and Adaptation", c: "Plans are living documents. Review progress quarterly. Adjust tactics when something isn't working. But don't abandon strategy for every bump in the road.\n\nThe best plans balance ambition with realism and flexibility with focus." }
    ],
    exercise: "Draft a one-page fundraising plan outline for next year. What are the top three priorities?",
    interactive: { type: "sorting", title: "Put Planning Steps in Order", items: ["Assess Current State", "Set Goals", "Develop Strategies", "Create Calendar", "Allocate Resources"] },
    keyTakeaways: ["Strategy integrates tactics into whole", "Plans align with organizational direction", "Build from realistic assumptions", "Review and adapt quarterly"]
  },
  30: { 
    title: "Volume 1 Capstone", 
    type: "capstone",
    sections: [
      { h: "Putting It All Together", c: "You've completed 30 days of fundraising foundations. You understand the four sources, donor psychology, lifecycle management, and key tactics across all revenue streams.\n\nNow it's time to apply this knowledge to real situations." },
      { h: "Capstone Assignment", c: "Create a 90-day fundraising action plan for a real organization (yours or one you research). Include:\n\n1. Assessment of current fundraising (sources, metrics, gaps)\n2. Three priority initiatives with specific goals\n3. Calendar of activities for 90 days\n4. Budget and resource requirements\n5. How you'll measure success" },
      { h: "Next Steps", c: "Volume 2 builds on these foundations with GMG's specific methodologies. You'll learn the Tic-Tac-Toe framework, Recipe Pitch, 360 Assessment, and more.\n\nCongratulations on completing Volume 1. You now have a solid foundation for professional fundraising." }
    ],
    keyTakeaways: ["Foundations enable everything else", "Application beats theory", "Continuous learning matters", "Volume 2 adds GMG methodologies"]
  }
};

export const V2_CONTENT = {
  1: { title: "What Makes GMG Different", sections: [{ h: "Our Approach", c: "GMG operates differently from typical consultants. We don't hand you a plan and disappear. We implement alongside you, building capacity while delivering results.\n\nOur founding team brings both grantmaker and fundraiser perspectives. Brandon reviewed 13,000+ proposals at Coca-Cola Foundation. Eric raised millions through capital campaigns. This dual perspective shapes everything we do." }], keyTakeaways: ["Implementation over just planning", "Dual perspective advantage", "Results with capacity building"] },
  2: { title: "Both Sides of the Table", sections: [{ h: "The Grantmaker View", c: "Having reviewed 13,000+ proposals totaling $195M+, Brandon knows what makes applications succeed or fail. Most proposals fail because they don't follow directions, lack compelling need statements, or propose unrealistic outcomes." }], keyTakeaways: ["Follow directions exactly", "Need statements matter", "Realistic outcomes build trust"] },
  3: { title: "Brandon's Writing Standards", sections: [{ h: "Professional Writing", c: "Clear, concise writing communicates competence. Sloppy writing signals sloppy thinking. Every document your organization produces reflects on your credibility.\n\nNo em dashes. No AI phrases like 'deeply resonated.' Complete sentences. Middle school reading level. Natural, conversational tone." }], keyTakeaways: ["Writing reflects competence", "Clear beats clever", "Follow the standards"] },
  4: { title: "The 360 Assessment", sections: [{ h: "Landscape Analysis", c: "The 360 Landscape Assessment evaluates your organization's fundraising capacity, current practices, and growth opportunities. It looks at leadership, systems, messaging, donor base, and competitive position." }], keyTakeaways: ["Comprehensive evaluation", "Identifies strengths and gaps", "Informs strategy"] },
  5: { title: "Quiz: Days 1-4", type: "quiz", questions: [{ q: "GMG's approach emphasizes:", a: "B", opts: ["A. Planning only", "B. Implementation alongside planning", "C. Hands-off consulting", "D. Purely strategic advice"] }] },
  6: { title: "Data Science Development Planning", sections: [{ h: "The DSDP Process", c: "Data Science Development Planning uses quantitative analysis to set realistic fundraising goals. We analyze your historical data, benchmark against comparables, and create projections grounded in evidence." }], keyTakeaways: ["Data drives decisions", "Benchmarking matters", "Evidence-based goals"] },
  7: { title: "Prospect Precision System", sections: [{ h: "Targeted Research", c: "Prospect Precision systematically identifies and qualifies major gift prospects. We combine wealth screening, giving history analysis, and relationship mapping to prioritize cultivation efforts." }], keyTakeaways: ["Systematic identification", "Prioritized cultivation", "Data-informed targeting"] },
  8: { title: "Grant Catalyst Method", sections: [{ h: "Accelerating Success", c: "Grant Catalyst is our methodology for improving foundation funding success rates. It combines research, relationship-building, and strategic application timing." }], keyTakeaways: ["Higher success rates", "Relationship focus", "Strategic timing"] },
  9: { title: "Implementation Engine", sections: [{ h: "Getting It Done", c: "The Implementation Engine is GMG's project management approach. We break initiatives into 30-day sprints with clear deliverables, accountability systems, and regular check-ins." }], keyTakeaways: ["30-day sprints", "Clear deliverables", "Built-in accountability"] },
  10: { title: "Quiz: Days 6-9", type: "quiz", questions: [{ q: "DSDP stands for:", a: "A", opts: ["A. Data Science Development Planning", "B. Donor Strategy Development Process", "C. Development System Data Platform", "D. Direct Support Development Program"] }] },
  11: { title: "Tic-Tac-Toe Framework Intro", sections: [{ h: "Donor Communication Balance", c: "The Tic-Tac-Toe framework ensures balanced donor communication. Every asking touch (X) is balanced by three value touches (O). The goal is getting tic-tac-toe with the O's." }], keyTakeaways: ["3:1 ratio of value to ask", "X is ask, O is value", "Never let X's overlap"] },
  12: { title: "Tic-Tac-Toe Implementation", sections: [{ h: "Putting It in Practice", c: "Implementation requires tracking every donor touch. Value touches include impact updates, program news, personal thank-yous, and event invitations. Asks include anything explicitly requesting money." }], keyTakeaways: ["Track every touch", "Multiple value touch types", "Systematic approach"] },
  13: { title: "Recipe Pitch Framework", sections: [{ h: "Eric's Signature Pitch", c: "The Recipe Pitch has five ingredients: Problem (specific, data-backed), Approach (your methodology), Evidence (past results), Engagement (deliverables and timeline), and Investment (cost and ROI)." }], keyTakeaways: ["Five ingredients", "Specific and data-backed", "Clear investment ask"] },
  14: { title: "Board Training GMG Style", sections: [{ h: "Engaging Boards", c: "GMG board training focuses on practical skills: how to identify prospects, how to open doors, how to make asks. We don't lecture about responsibility. We practice actual scenarios." }], keyTakeaways: ["Skills-based training", "Practice real scenarios", "Focus on action"] },
  15: { title: "Quiz: Days 11-14", type: "quiz", questions: [{ q: "In Tic-Tac-Toe, X represents:", a: "B", opts: ["A. Value touch", "B. Asking touch", "C. Thank you", "D. Event invitation"] }] },
  16: { title: "Foundation Pipeline Management", sections: [{ h: "Building Your Pipeline", c: "Pipeline management tracks foundation prospects through stages: research, outreach, application, pending, funded or declined. A healthy pipeline has prospects at every stage." }], keyTakeaways: ["Track stages systematically", "Always have prospects moving", "Plan ahead"] },
  17: { title: "Major Donor Strategy", sections: [{ h: "Strategic Cultivation", c: "Major donor strategy requires individual cultivation plans. Each prospect gets tailored engagement based on their interests, capacity, and connection to your mission." }], keyTakeaways: ["Individual plans", "Tailored engagement", "Long-term relationships"] },
  18: { title: "Corporate Small-Dollar Approach", sections: [{ h: "Accessible Corporate Giving", c: "Not every corporate partnership is six figures. Small-dollar corporate giving through matching gifts, volunteer grants, and employee campaigns can provide meaningful revenue with less cultivation." }], keyTakeaways: ["Multiple corporate channels", "Lower barriers", "Volume matters"] },
  19: { title: "Merchandise Programs", sections: [{ h: "Revenue and Awareness", c: "Merchandise programs generate earned revenue while building awareness. T-shirts, mugs, and branded items turn supporters into ambassadors." }], keyTakeaways: ["Dual benefit", "Brand ambassadors", "Earned revenue stream"] },
  20: { title: "Quiz: Days 16-19", type: "quiz", questions: [{ q: "A healthy foundation pipeline has prospects:", a: "C", opts: ["A. Only at research stage", "B. Only at application stage", "C. At every stage", "D. Only when funded"] }] },
  21: { title: "Monthly Giving as Default", sections: [{ h: "Why Monthly First", c: "GMG recommends positioning monthly giving as the default option, not an afterthought. Monthly donors retain better, give more over time, and provide predictable revenue." }], keyTakeaways: ["Default to monthly", "Higher lifetime value", "Predictable revenue"] },
  22: { title: "Membership Programs", sections: [{ h: "Creating Belonging", c: "Membership programs create community and recurring revenue. Benefits, exclusive access, and recognition make members feel like insiders." }], keyTakeaways: ["Community building", "Recurring revenue", "Insider recognition"] },
  23: { title: "Tax-Advantaged Giving", sections: [{ h: "Strategic Philanthropy", c: "Understanding tax-advantaged giving helps major donors give more efficiently. Stock gifts, IRA rollovers, donor-advised funds, and charitable trusts can benefit both donor and organization." }], keyTakeaways: ["Multiple vehicles", "Win-win structures", "Sophisticated philanthropy"] },
  24: { title: "Event Strategy GMG Way", sections: [{ h: "Events That Work", c: "GMG approaches events as cultivation opportunities, not just revenue generators. The real value is relationship-building, not ticket sales." }], keyTakeaways: ["Cultivation focus", "Beyond ticket revenue", "Relationship opportunities"] },
  25: { title: "Quiz: Days 21-24", type: "quiz", questions: [{ q: "GMG recommends making monthly giving:", a: "A", opts: ["A. The default option", "B. An afterthought", "C. For major donors only", "D. Optional add-on"] }] },
  26: { title: "CRM Optimization", sections: [{ h: "Using Your Tools", c: "Your CRM is only as good as how you use it. Data quality, consistent entry, and regular analysis turn your database from a filing cabinet into a strategic asset." }], keyTakeaways: ["Data quality matters", "Consistent usage", "Strategic analysis"] },
  27: { title: "AI in Fundraising", sections: [{ h: "Using AI Effectively", c: "AI can accelerate research, drafting, and analysis. But AI output requires human review. Never send AI-generated content without editing. Follow Brandon's writing standards." }], keyTakeaways: ["AI accelerates work", "Human review essential", "Follow writing standards"] },
  28: { title: "Building Your Tech Stack", sections: [{ h: "Tools That Work Together", c: "Your tech stack should integrate. CRM, email platform, wealth screening, and project management should share data and reduce duplicate entry." }], keyTakeaways: ["Integration matters", "Reduce duplicate entry", "Choose compatible tools"] },
  29: { title: "Final Assessment Prep", sections: [{ h: "Preparing for Certification", c: "Review all methodologies: 360 Assessment, DSDP, Prospect Precision, Grant Catalyst, Implementation Engine, Tic-Tac-Toe, and Recipe Pitch." }], keyTakeaways: ["Review all methodologies", "Practice application", "Prepare examples"] },
  30: { title: "Volume 2 Certification", type: "capstone", sections: [{ h: "The GMG Way", c: "You've learned GMG's distinctive methodologies. You understand how we approach fundraising differently and why it works." }], keyTakeaways: ["Methodologies mastered", "Ready for advanced work", "GMG certified"] }
};

export const V3_CONTENT = {
  1: { title: "What Is CPP", sections: [{ h: "The Model", c: "CPP (Consultant Pipeline Program) places trained consultants at nonprofit organizations. You work as an employee of the nonprofit while GMG provides support, training, and client acquisition." }], keyTakeaways: ["Employee-Based Consulting", "GMG support system", "Structured path"] },
  2: { title: "Legal Structure", sections: [{ h: "How It Works", c: "You work as a W-2 employee of the nonprofit client. GID Consulting or Brandon Inc. serves as the employer of record for payroll. Revenue splits are 50% to consultant after processing." }], keyTakeaways: ["W-2 employment", "Clear structure", "50% split"] },
  3: { title: "Money Flow", sections: [{ h: "Understanding Compensation", c: "Client pays employer of record. Payroll processing occurs. 50% goes to consultant. At 2 clients ($80K each), take-home is approximately $5,156/month." }], keyTakeaways: ["Clear money flow", "Predictable income", "Scalable model"] },
  4: { title: "Capacity Planning", sections: [{ h: "Managing Multiple Clients", c: "Most consultants can handle 2-3 clients effectively. More than that risks quality. Part-time arrangements allow stacking without burnout." }], keyTakeaways: ["2-3 clients typical", "Part-time stacking", "Quality over quantity"] },
  5: { title: "Quiz: Days 1-4", type: "quiz", questions: [{ q: "CPP revenue split is:", a: "B", opts: ["A. 40% to consultant", "B. 50% to consultant", "C. 60% to consultant", "D. 70% to consultant"] }] },
  6: { title: "Building Your Resume", sections: [{ h: "Positioning Yourself", c: "Your resume positions you as an experienced development professional. GMG affiliation demonstrates training and quality. Previous experience provides credibility." }], keyTakeaways: ["Professional positioning", "GMG credential", "Experience matters"] },
  7: { title: "Certifications", sections: [{ h: "Adding Credentials", c: "External certifications add legitimacy. AFP, CASE, and grant writing certificates demonstrate professional development. These complement GMG training." }], keyTakeaways: ["External validation", "Multiple credentials", "Ongoing learning"] },
  8: { title: "Online Presence", sections: [{ h: "Your Professional Brand", c: "LinkedIn optimization is essential. Professional headshot, clear summary, and recommendations build credibility. Your online presence is often first impression." }], keyTakeaways: ["LinkedIn matters", "Professional image", "First impressions"] },
  9: { title: "Crafting Your Pitch", sections: [{ h: "How to Describe Your Work", c: "Position as a fundraising professional, not a consultant. Emphasize experience and results. Let credentials speak without overselling." }], keyTakeaways: ["Professional framing", "Results focus", "Humble confidence"] },
  10: { title: "Quiz: Days 6-9", type: "quiz", questions: [{ q: "Best platform for professional presence:", a: "A", opts: ["A. LinkedIn", "B. Facebook", "C. Instagram", "D. Twitter"] }] },
  11: { title: "Client Interviews", sections: [{ h: "The Process", c: "Client interviews assess fit on both sides. You're evaluating them as much as they evaluate you. Culture, expectations, and communication style matter." }], keyTakeaways: ["Two-way evaluation", "Fit matters", "Ask good questions"] },
  12: { title: "Documentation Mastery", sections: [{ h: "Using Otter AI", c: "Otter AI records and transcribes meetings. This creates searchable records, action item tracking, and CYA documentation." }], keyTakeaways: ["Record everything", "Searchable records", "Documentation protection"] },
  13: { title: "Folder Structure", sections: [{ h: "Organization Systems", c: "Consistent folder structure across clients enables efficiency. Templates, proposals, reports, and communications all have designated homes." }], keyTakeaways: ["Consistency across clients", "Templates ready", "Easy retrieval"] },
  14: { title: "Client Communication", sections: [{ h: "Professional Standards", c: "Regular updates, responsive communication, and clear boundaries maintain professional relationships. Set expectations early and maintain them." }], keyTakeaways: ["Regular updates", "Clear boundaries", "Professional tone"] },
  15: { title: "CPP Final Assessment", type: "capstone", sections: [{ h: "Ready for Clients", c: "You've completed CPP training. You understand the model, legal structure, and professional requirements. You're ready to be placed with clients." }], keyTakeaways: ["Model mastered", "Ready for placement", "GMG Certified"] }
};

export const CURRICULUM_TITLES = {
  v1: ["The Four Sources of Money","Why People Actually Give","The Donor Lifecycle","The Donor Pyramid","Quiz 1-4","Annual Giving Programs","Foundation Grants Reality","Corporate Partnerships","Earned Revenue Strategies","Quiz 6-9","Board Fundraising Responsibility","Grant Research Methods","Donor Retention Fundamentals","Fundraising Systems and Tools","Quiz 11-14","Grant Writing Basics","Major Donor Identification","Planned Giving Basics","Corporate Sponsorship Strategy","Quiz 16-19","Digital Fundraising","Storytelling for Fundraising","Capital Campaigns","Monthly Giving Programs","Quiz 21-24","Board Development","Prospect Research Deep Dive","Fundraising Metrics","Strategic Fundraising Planning","Volume 1 Capstone"],
  v2: ["What Makes GMG Different","Both Sides of the Table","Brandon's Writing Standards","The 360 Assessment","Quiz 1-4","Data Science Development Planning","Prospect Precision System","Grant Catalyst Method","Implementation Engine","Quiz 6-9","Tic-Tac-Toe Framework Intro","Tic-Tac-Toe Implementation","Recipe Pitch Framework","Board Training GMG Style","Quiz 11-14","Foundation Pipeline Management","Major Donor Strategy","Corporate Small-Dollar Approach","Merchandise Programs","Quiz 16-19","Monthly Giving as Default","Membership Programs","Tax-Advantaged Giving","Event Strategy GMG Way","Quiz 21-24","CRM Optimization","AI in Fundraising","Building Your Tech Stack","Final Assessment Prep","Volume 2 Certification"],
  v3: ["What Is CPP","Legal Structure","Money Flow","Capacity Planning","Quiz 1-4","Building Your Resume","Certifications","Online Presence","Crafting Your Pitch","Quiz 6-9","Client Interviews","Documentation Mastery","Folder Structure","Client Communication","CPP Final Assessment"]
};
