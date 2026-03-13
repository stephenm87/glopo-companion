import React, { useState, useEffect } from 'react';
// Version: 1.0.3 - Restored React hooks import
import { Shield, PenTool, Zap, AlertTriangle, CheckCircle, ChevronRight, RefreshCw, BookOpen, MessageSquare, FileText, Clock, Search } from 'lucide-react';
import { paper1Exams, paper2Exams, paper3Exams } from './examBank';

// --- Global Data Constants ---
const GLOSSARY_TERMS = ["Power", "Sovereignty", "Legitimacy", "Interdependence", "Human rights", "Justice", "Liberty", "Equality", "Development", "Sustainability", "Peace", "Conflict", "Violence", "Non-violence", "Globalization", "Inequality", "Borders", "Security", "Environment", "Health", "Poverty", "Identity", "Technology"];

const CONCEPT_THEMES = {
    "Power": { theme: "Power, Sovereignty & IR", color: "blue" },
    "Sovereignty": { theme: "Power, Sovereignty & IR", color: "blue" },
    "Legitimacy": { theme: "Power, Sovereignty & IR", color: "blue" },
    "Interdependence": { theme: "Power, Sovereignty & IR", color: "blue" },
    "Human rights": { theme: "Human Rights", color: "purple" },
    "Justice": { theme: "Human Rights", color: "purple" },
    "Liberty": { theme: "Human Rights", color: "purple" },
    "Equality": { theme: "Human Rights", color: "purple" },
    "Development": { theme: "Development", color: "emerald" },
    "Globalization": { theme: "Development", color: "emerald" },
    "Inequality": { theme: "Development", color: "emerald" },
    "Sustainability": { theme: "Development", color: "emerald" },
    "Peace": { theme: "Peace & Conflict", color: "red" },
    "Conflict": { theme: "Peace & Conflict", color: "red" },
    "Violence": { theme: "Peace & Conflict", color: "red" },
    "Non-violence": { theme: "Peace & Conflict", color: "red" },
    "Borders": { theme: "HL Global Challenges", color: "amber" },
    "Security": { theme: "HL Global Challenges", color: "amber" },
    "Environment": { theme: "HL Global Challenges", color: "amber" },
    "Health": { theme: "HL Global Challenges", color: "amber" },
    "Poverty": { theme: "HL Global Challenges", color: "amber" },
    "Identity": { theme: "HL Global Challenges", color: "amber" },
    "Technology": { theme: "HL Global Challenges", color: "amber" }
};

// ── Shared case pool — used by CaseLibrary inline search AND standalone CaseFinder ──
const SHARED_CASE_POOL = [
    { name: 'South China Sea Dispute', concepts: 'Power, Sovereignty, Security', themes: 'sovereignty power realism maritime security China Philippines military conflict UNCLOS', url: 'https://www.bbc.com/news/world-asia-pacific-13748349' },
    { name: 'Russia-Ukraine War', concepts: 'Sovereignty, Power, Security', themes: 'sovereignty territorial integrity NATO expansion war realism liberalism humanitarian refugees', url: 'https://www.bbc.com/news/world-europe-56720589' },
    { name: 'Syrian Civil War & R2P', concepts: 'Legitimacy, Sovereignty, Human Rights', themes: 'humanitarian intervention R2P sovereignty human rights refugees legitimacy UN veto', url: 'https://www.bbc.com/news/world-middle-east-35806229' },
    { name: 'Venezuela Collapse', concepts: 'Legitimacy, Development, Sovereignty', themes: 'economic collapse authoritarian development poverty inequality sovereignty legitimacy sanctions', url: 'https://www.bbc.com/news/world-latin-america-19652777' },
    { name: 'US-China Trade War', concepts: 'Interdependence, Power, Technology', themes: 'trade war tariffs economic interdependence globalization WTO technology decoupling great power', url: 'https://www.bbc.com/news/business-45899310' },
    { name: 'Afghan War & State-Building', concepts: 'Legitimacy, Sovereignty, Development', themes: 'statebuilding intervention sovereignty legitimacy human rights women development security Taliban', url: 'https://www.bbc.com/news/world-asia-58113421' },
    { name: 'Israel-Palestine Conflict', concepts: 'Sovereignty, Human Rights, Legitimacy', themes: 'occupation sovereignty human rights humanitarian two-state UN legitimacy power identity', url: 'https://www.bbc.com/news/world-middle-east-29701816' },
    { name: 'Paris Climate Agreement', concepts: 'Interdependence, Sustainability, Equality', themes: 'climate environment sustainability interdependence multilateralism sovereignty emissions development inequality', url: 'https://unfccc.int/process-and-meetings/the-paris-agreement' },
    { name: 'North Korea Nuclear Program', concepts: 'Security, Sovereignty, Power', themes: 'nuclear weapons security proliferation sanctions deterrence realism sovereignty Kim denuclearization', url: 'https://www.bbc.com/news/world-asia-pacific-11813699' },
    { name: 'Rwanda Genocide', concepts: 'Human Rights, Legitimacy, Sovereignty', themes: 'genocide ethnic conflict humanitarian R2P sovereignty human rights peacekeeping legitimacy failure', url: 'https://www.bbc.com/news/world-africa-26875506' },
    { name: 'Iran Nuclear Deal (JCPOA)', concepts: 'Sovereignty, Power, Interdependence', themes: 'nuclear deal diplomacy multilateral sanctions sovereignty Non-Proliferation Treaty realism liberalism', url: 'https://www.bbc.com/news/world-middle-east-33521655' },
    { name: 'Brexit & EU Sovereignty', concepts: 'Sovereignty, Interdependence, Identity', themes: 'Brexit European Union sovereignty interdependence globalization trade nationalism identity liberalism', url: 'https://www.bbc.com/news/uk-politics-32810887' },
    { name: 'Arab Spring', concepts: 'Legitimacy, Sovereignty, Identity', themes: 'democracy sovereignty legitimacy human rights protest revolution authoritarianism identity regime change', url: 'https://www.bbc.com/news/world-middle-east-12301713' },
    { name: 'COVID-19 Pandemic Response', concepts: 'Interdependence, Health, Equality', themes: 'pandemic health global governance interdependence sovereignty borders WHO development inequality technology', url: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019' },
    { name: 'Rohingya Crisis', concepts: 'Human Rights, Sovereignty, Identity', themes: 'ethnic cleansing genocide sovereignty human rights humanitarian R2P stateless identity Myanmar ASEAN', url: 'https://www.bbc.com/news/world-asia-41566561' },
    // ── 2025–2026 Current Affairs ────────────────────────────────────
    { name: 'US & Israel Strikes on Iran (2026)', concepts: 'Sovereignty, Security, Legitimacy', themes: 'US Israel Iran nuclear strikes Operation Epic Fury military sovereignty legitimacy preemptive war security unilateral intervention 2026', url: 'https://www.bbc.com/news/world-middle-east' },
    { name: 'Venezuela: Maduro Captured (2025)', concepts: 'Legitimacy, Sovereignty, Power', themes: 'Venezuela Maduro captured authoritarian regime change legitimacy sovereignty democracy sanctions ICC accountability Latin America', url: 'https://www.bbc.com/news/world-latin-america' },
    { name: 'Sudan Civil War & Humanitarian Crisis', concepts: 'Human Rights, Security, Development', themes: 'Sudan civil war RSF SAF humanitarian crisis famine displacement R2P sovereignty ethnic conflict development equality', url: 'https://www.bbc.com/news/world-africa-68116732' },
    { name: 'Gaza Ceasefire & Reconstruction', concepts: 'Legitimacy, Human Rights, Interdependence', themes: 'Gaza ceasefire Israel Palestine Hamas hostages reconstruction humanitarian law sovereignty legitimacy two-state UN intervention 2025', url: 'https://www.bbc.com/news/world-middle-east' },
    { name: 'Trump Tariff Shock & Global Trade (2025)', concepts: 'Interdependence, Power, Development', themes: 'Trump tariffs US trade war protectionism WTO globalization interdependence economic sovereignty China EU retaliation 2025', url: 'https://www.bbc.com/news/business' },
];

const GLOBAL_CASES = [
    {
        name: "South China Sea Dispute", theme: "Sovereignty + Power",
        facts: ["Overlapping territorial claims", "Nine-Dash Line", "Freedom of Navigation operations"],
        fiveWH: {
            who: "Primary: China (PRC), Philippines, Vietnam, Malaysia. Secondary: USA (Freedom of Navigation), ASEAN.",
            what: "Overlapping territorial claims and maritime rights (Exclusive Economic Zones) involving the \"Nine-Dash Line.\"",
            where: "The South China Sea, specifically the Spratly Islands, Paracel Islands, and Scarborough Shoal.",
            when: "Ongoing; critical milestone in 2016 (PCA Ruling) and continuous island reclamation/militarization.",
            why: "Strategic: Controlling major maritime choke points. Economic: Access to 12% of global fish catch and untapped oil/gas reserves.",
            how: "China utilizes Hard Power (island building/naval presence) vs. Philippines/Vietnam using International Law (UNCLOS)."
        },
        ibLinkage: { core: ["Sovereignty (Contested)", "Power (Realism)"], challenge: ["Security", "Environment"] },
        globalChallenges: {
            Security: "The SCS is a textbook case of the 'Security Dilemma.' China's island militarization is presented as defensive, yet it forces the US and regional states into a reactive arms buildup. Every new radar installation or airstrip makes the region less secure for everyone, illustrating how the pursuit of national security can paradoxically create collective insecurity.",
            Environment: "Massive dredging for artificial islands has destroyed over 160 sq km of coral reef ecosystem. The environmental cost of this sovereignty dispute is borne by the entire region's fishing communities, showing how interstate competition can generate irreversible environmental destruction as a byproduct of geopolitical ambition.",
            Borders: "The 'Nine-Dash Line' is a case study in how borders can be ambiguous and contested. Unlike land borders, maritime boundaries are defined by international law (UNCLOS), yet China's historical claim challenges the entire rules-based system of border demarcation, raising the question: who decides where a border lies when history and law disagree?",
            Technology: "Satellite surveillance, artificial island construction, and cyber operations are central to this dispute. Technology enables China to project power far from its mainland and allows smaller states like the Philippines to document and publicize violations, turning technology into both a tool of dominance and a weapon of the weak."
        },
        theoryInsights: {
            Realism: "The South China Sea is a classic textbook case of Realism. China's 'Nine-Dash Line' and island reclamation represent a rational pursuit of national interest in an anarchic system. For realists, this is not a 'dispute' but a struggle for maritime supremacy and strategic depth. The involvement of the US (FOIA operations) highlights the 'Security Dilemma'—where one state's defensive buildup is seen as offensive by another.",
            Liberalism: "Liberals point to the 2016 Permanent Court of Arbitration ruling as the relevant framework. They argue that the dispute should be resolved through UNCLOS and international law rather than 'might makes right'. For a liberal, the tragedy here is the failure of regional institutions (ASEAN) to create a binding Code of Conduct that constrains the unilateral power of great states.",
            Structuralism: "A structuralist analysis focuses on how China is now behaving like an established 'Core' power, asserting its right to control its regional 'Periphery'. The dispute isn't just about rocks; it's about who sets the rules for the global maritime commons—rules that were historically designed by Western core powers and are now being challenged by a rising Eastern core."
        }
    },
    {
        name: "G20 & Global South", theme: "Power + Development",
        facts: ["India's presidency focus", "AU permanent membership", "Debt restructuring tensions"],
        fiveWH: {
            who: "Primary: India (2023 presidency), African Union, Brazil, China. Secondary: G7 nations, IMF, World Bank.",
            what: "India's G20 presidency pushed for Global South representation, AU permanent membership, and debt restructuring for developing nations.",
            where: "New Delhi (summit), but impacts global governance structures — especially Africa, South Asia, and Latin America.",
            when: "2023 presidency; AU admitted as permanent member September 2023. Debt and SDR reform debates ongoing.",
            why: "The Global South sought greater voice in institutions designed by post-WWII Western powers. India leveraged presidency to position itself as a bridge between developing and developed worlds.",
            how: "Diplomatic coalition-building among middle powers; 'Voice of the Global South' summits; reform proposals for MDBs and IMF voting quotas."
        },
        ibLinkage: { core: ["Power (Structural)", "Legitimacy"], challenge: ["Poverty", "Equality"] },
        globalChallenges: {
            Poverty: "The G20's debt restructuring debates are fundamentally about global poverty. Many Global South nations spend more on debt repayment than on healthcare or education, trapping their populations in cycles of deprivation. India's presidency framed poverty not as a domestic failure but as a structural outcome of an unfair international financial architecture.",
            Equality: "The AU's permanent G20 membership is a direct challenge to the inequality embedded in global governance. Africa's 1.4 billion people had no permanent seat at the table that sets global economic policy. This reform asks: whose voices count in shaping the future of the global economy?",
            Identity: "India's 'Voice of the Global South' summits are an exercise in identity construction. By positioning itself as the bridge between developed and developing worlds, India is crafting a new post-colonial identity that rejects Cold War-era binaries (East/West) in favor of a 'civilizational' leadership role."
        },
        theoryInsights: {
            Structuralism: "India's push for African Union membership in the G20 is a direct attempt to challenge the Core-Periphery hierarchy. From a structuralist view, the G7 represents the 'Core' that has historically dictated terms of development. By positioning itself as a leader of the 'Global South', India is trying to restructure the global governance framework to reduce peripheral dependency.",
            Liberalism: "For liberals, the inclusion of the AU in the G20 demonstrates the evolution of international institutions toward greater inclusivity. It shows that states can reform existing multilateral frameworks from within to improve global legitimacy and manage collective problems like debt and systemic poverty.",
            Constructivism: "Constructivists would focus on the 'Voice of the Global South' narrative. India is actively constructing a new global identity—a 'civilizational state' that acts as a bridge. This narrative shift changes how states see their interests, moving from binary Cold War-era alignments to a more fluid, multipolar sense of shared identity."
        }
    },
    {
        name: "Israel-Palestine", theme: "Identity + Security",
        facts: ["Relational identity conflict", "Security vs Human Rights", "Legitimacy of non-state actors"],
        fiveWH: {
            who: "Primary: Israel (state), Palestinian Authority, Hamas. Secondary: USA, Iran, UN, ICJ, Arab League.",
            what: "Protracted conflict over territory, statehood, and self-determination rooted in competing national identities and security narratives.",
            where: "Gaza Strip, West Bank, East Jerusalem, and the broader Middle East region.",
            when: "Ongoing since 1948; major escalations in 1967, 2008, 2014, 2021, and October 2023.",
            why: "Competing claims to sovereignty and self-determination. Israel cites security; Palestinians cite occupation and human rights violations. Identity is relational — each group defines itself partly in opposition to the other.",
            how: "Israel uses military force and settlement expansion. Palestinians employ diplomacy (UN statehood bids), resistance movements, and international law (ICJ advisory opinions)."
        },
        ibLinkage: { core: ["Sovereignty (Contested)", "Human Rights", "Legitimacy"], challenge: ["Security", "Equality"] },
        globalChallenges: {
            Security: "Israel-Palestine is the defining case of the 'National Security vs. Human Security' debate. Israel's security apparatus (Iron Dome, border walls) provides national security but does so at the cost of daily human security for Palestinian civilians, demonstrating how security for one group can mean insecurity for another.",
            Borders: "The Green Line, the separation barrier, and the contested borders of a future Palestinian state are central to the conflict. This case shows how borders are not just lines on a map but instruments of control that determine who has access to resources, movement, and ultimately, self-determination.",
            Identity: "This is perhaps the world's most powerful example of relational identity—each side's national identity is defined in opposition to the other. The narratives of 'Occupier/Defender' and 'Indigenous/Settler' are not just labels; they are the fuel that sustains the conflict across generations through education and collective memory.",
            Health: "The blockade of Gaza has created a chronic public health crisis, with limited access to medicine, clean water, and hospital infrastructure. Health in this context is not just a medical issue but a political tool, as the control of humanitarian access becomes a lever of power."
        },
        theoryInsights: {
            Realism: "In Israel-Palestine, realists see a zero-sum struggle for land and security where state survival is the ultimate goal. The conflict is driven by the 'anarchy' of the regional system where no external power can enforce a two-state solution. Hard power (military force, barriers) is the primary currency, and security for one group is viewed as insecurity for the other.",
            Constructivism: "Constructivism is vital here: the conflict is sustained by deeply embedded, mutually exclusive identities. The narratives of 'Occupier' vs 'Defender' or 'Indigenous' vs 'Settler' are socially constructed and reinforced through education and media. Peace requires a fundamental 'identity shift' that moves beyond the historical narratives of trauma and exclusion.",
            Feminism: "A feminist lens highlights how the conflict is framed almost entirely in patriarchal, militarized terms. It asks: where are the women in the peace process, and how does the focus on 'border security' ignore the human security of families on both sides? Feminists argue that the masculine culture of statehood and military defense perpetuates the cycle of violence.",
            Postcolonialism: "Postcolonialism frames this as the 'unfinished business' of the 20th-century mandates. It analyzes the power imbalance between a sovereign, recognized state and an occupied population as a continuation of colonial-era hierarchies. The focus is on self-determination and the dismantling of structural inequalities that mirror historical imperial patterns."
        }
    },
    {
        name: "Belt and Road Initiative", theme: "Power + Interdependence",
        facts: ["Sovereignty vs Debt", "Soft power expansion", "Infrastructure-led development"],
        fiveWH: {
            who: "Primary: China (PRC), recipient states (Sri Lanka, Pakistan, Kenya, Laos). Secondary: USA, EU, World Bank, local communities.",
            what: "China's massive infrastructure investment program ($1 trillion+) spanning 140+ countries, building ports, railways, and digital networks.",
            where: "Asia, Africa, Latin America, and Europe — key corridors include the China-Pakistan Economic Corridor (CPEC) and the Maritime Silk Road.",
            when: "Launched 2013 by Xi Jinping. Expanded steadily; criticism grew after Hambantota Port (Sri Lanka) 99-year lease in 2017.",
            why: "China seeks to expand economic interdependence, secure trade routes and resource access, and build geopolitical influence through debt-financed infrastructure.",
            how: "Bilateral infrastructure loans (often criticized as 'debt-trap diplomacy'); state-owned enterprise construction; digital infrastructure (5G, smart cities)."
        },
        ibLinkage: { core: ["Power (Soft/Economic)", "Sovereignty", "Interdependence"], challenge: ["Poverty", "Environment"] },
        globalChallenges: {
            Poverty: "The BRI is framed as a poverty-reduction engine, bringing infrastructure to regions that lack roads, ports, and power grids. However, critics argue that the debt conditions attached to BRI loans can deepen poverty by diverting national budgets toward debt repayment rather than social services like education or healthcare.",
            Environment: "BRI-funded coal plants and highways in Southeast Asia and Africa raise serious environmental concerns. The tension between rapid infrastructure development and environmental sustainability is stark: the roads that connect communities to markets also carve through forests and wetlands.",
            Technology: "China's 'Digital Silk Road' extends BRI into the tech sphere, building 5G networks, smart city platforms, and submarine cables in partner countries. This raises critical questions about digital sovereignty—who controls the data that flows through Chinese-built infrastructure?",
            Borders: "The BRI fundamentally reshapes borders by creating economic corridors (like CPEC) that tie nations together across traditional boundary lines. The Hambantota port's 99-year lease blurs the line between economic partnership and territorial control, echoing colonial-era concessions."
        },
        theoryInsights: {
            Realism: "Realists view the BRI as 'Economic Statecraft' designed to create a Sino-centric order. By building infrastructure in 140+ countries, China is essentially creating a sphere of influence that rivals the traditional US-led system. For realists, the debt-trap narrative is a tool of geopolitical competition, where infrastructure is the new ammunition of power projection.",
            Marxism: "Marxism provides a powerful critique here: the BRI is an example of 'Spatial Fix'—where a state (China) must export excess capital and capacity to maintain profit rates. This isn't charity; it's the expansion of global capital that inevitably leads to the exploitation of labor in recipient states and the enrichment of a transnational elite.",
            Postcolonialism: "A postcolonial lens flags the 'Hambantota' case as a warning of neo-colonialism. While China doesn't use standard Western military intervention, the 99-year lease on Sri Lankan territory mirrors the 'unequal treaties' of the colonial era. It highlights how states in the Global South are often forced to choose between underdevelopment and dependent development."
        }
    },
    {
        name: "WTO & Green Subsidies", theme: "Trade + Sustainability",
        facts: ["US Inflation Reduction Act", "EU-China trade tensions", "Environment vs Free Trade"],
        fiveWH: {
            who: "Primary: USA, EU, China. Secondary: WTO, developing nations, renewable energy industries.",
            what: "Major economies are using green industrial subsidies (e.g. US Inflation Reduction Act) that may violate WTO free trade rules, sparking trade tensions.",
            where: "Global trade system — disputes centered in WTO (Geneva), but affecting supply chains in Asia, Europe, and the Americas.",
            when: "US IRA signed August 2022; EU Carbon Border Adjustment Mechanism (CBAM) phased in 2023-2026. Ongoing WTO disputes.",
            why: "States face a tension between free trade principles and the need to subsidize green industries to meet Paris Agreement targets. Developing nations argue these subsidies are protectionist.",
            how: "Domestic legislation (IRA, CBAM); tariffs on Chinese EVs and solar panels; WTO dispute resolution (largely stalled due to Appellate Body crisis)."
        },
        ibLinkage: { core: ["Interdependence", "Sovereignty"], challenge: ["Environment", "Equality"] },
        globalChallenges: {
            Environment: "This case is the frontline of the climate-economy tension. Green subsidies aim to accelerate the clean energy transition, but they also distort global markets. The core question is whether environmental protection can be achieved through state competition or only through genuine multilateral cooperation.",
            Equality: "The IRA and CBAM create a two-tier green transition. Wealthy nations can afford to subsidize their industries while developing nations—who contributed least to climate change—are penalized by tariffs they can't match. This is environmental policy that deepens global economic inequality.",
            Technology: "The dispute is fundamentally about who will control the technology of the future: Chinese EVs and solar panels vs. US and EU domestic production. Green subsidies are as much about technological supremacy as they are about saving the planet, making tech a key arena of geopolitical competition."
        },
        theoryInsights: {
            Liberalism: "A model case for Liberalism: Green subsidies represent the tension between trade liberalization and environmental collective action. The issue is whether global trade rules (the WTO framework) can evolve to support 'Green Industrial Policy' through institutional cooperation. It highlights how IGOs are essential for managing complex interdependence when domestic interests clash.",
            Realism: "Realists view the EU/US green subsidies (like the IRA) as 'Green Mercantilism'. This isn't primarily about the climate; it's about securing supply chains and dominance in the future energy transition. A realist sees this as a 'stretch' to the trade system where states use environmental justifications to protect their national industries and relative power.",
            Structuralism: "Strictly structuralist: The WTO's subsidy rules allow the wealthy 'Core' (who have the fiscal space for subsidies) to grow while penalizing the 'Periphery' who lack the capital to compete. This reinforces a global hierarchy where the Global North dictates the terms of the 'Green Transition', potentially locking the Global South into continued dependency."
        }
    },
    {
        name: "Meta/EU Big Tech", theme: "Sovereignty + Power",
        facts: ["GDPR as digital sovereignty", "Data privacy as HR", "Platform power vs State control"],
        fiveWH: {
            who: "Primary: Meta (Facebook), EU Commission, European Court of Justice. Secondary: Apple, Google, civil society groups, data protection authorities.",
            what: "The EU's regulation of Big Tech platforms through GDPR, Digital Services Act, and Digital Markets Act — asserting sovereignty over the digital space.",
            where: "EU member states, but with global implications due to the 'Brussels Effect' (EU regulations becoming de facto global standards).",
            when: "GDPR enforced May 2018; Meta fined €1.2 billion (2023); Digital Services Act took effect Feb 2024.",
            why: "Tension between corporate power (platforms controlling data/algorithms) and state sovereignty (right to regulate). Data privacy increasingly framed as a human right.",
            how: "EU uses regulatory power (fines, compliance mandates); Meta lobbies and restructures data flows; court challenges test jurisdictional limits."
        },
        ibLinkage: { core: ["Sovereignty (Digital)", "Power (Corporate vs State)", "Human Rights"], challenge: ["Security", "Equality"] },
        globalChallenges: {
            Technology: "This is the defining case for the Technology challenge. Meta's algorithms shape public discourse for billions, raising the question: should a private corporation have more influence over information flows than a democratic government? The EU's regulatory response is an attempt to reassert state authority over the digital commons.",
            Security: "Data breaches and algorithmic manipulation pose a direct threat to both individual privacy and national security. The EU's GDPR framework treats personal data as a security asset, arguing that the mass collection of citizen data by foreign corporations is a vulnerability that must be regulated as a matter of state security.",
            Borders: "The 'Brussels Effect' shows how digital regulation crosses borders without traditional diplomacy. When the EU sets data rules, companies worldwide must comply to access the European market, effectively exporting European law globally. This challenges the idea that borders can contain policy in a digital world.",
            Identity: "Social media platforms shape identity by curating the information people see. Algorithmic echo chambers reinforce political identities and can deepen societal polarization. The EU's concern is that unregulated platforms allow foreign actors to manipulate national identity and democratic processes."
        },
        theoryInsights: {
            Liberalism: "Liberals point to the 'Brussels Effect'—where regional regulations like GDPR become global standards. This demonstrates that institutional rules and legal frameworks can constrain even the most powerful transnational corporations (TNCs). It's a victory for the rule of law over unregulated market power, showing that democratic institutions still hold legitimacy in the digital age.",
            Marxism: "A Marxist analysis is blunt: Meta and the EU are two heads of the same capitalist coin. While they appear at odds, the EU's regulation is a 'protective' move for European capital against American digital dominance. The underlying exploitation of user data (capital accumulation via data extraction) remains unchallenged by either side.",
            Postcolonialism: "Applying Postcolonialism here is a stretch, but it reveals 'Digital Colonialism'. Western TNCs extract data-wealth from the Global South while the rules of the digital road are set in Brussels or Washington. The lack of indigenous representation in these 'global' tech standards mirrors older imperial structures of information control."
        }
    },
    {
        name: "Nigeria & Boko Haram", theme: "Development + Security",
        facts: ["Structural violence roots", "Underdevelopment fuels insurgency", "Military vs Social intervention"],
        fiveWH: {
            who: "Primary: Boko Haram/ISWAP, Nigerian government/military. Secondary: UNDP, AU (MNJTF), affected communities (especially women/girls), Lake Chad Basin states.",
            what: "Islamist insurgency in northeast Nigeria causing 350,000+ deaths and 2.2 million displaced, rooted in poverty, educational exclusion, and governance failures.",
            where: "Northeast Nigeria (Borno, Yobe, Adamawa states) and the broader Lake Chad Basin (Niger, Chad, Cameroon).",
            when: "Founded 2002; major escalation 2009-present. Chibok kidnapping (2014) drew global attention. Continues as of 2024.",
            why: "Structural violence: extreme poverty, educational inequality, and state neglect in the north created conditions for radicalization. The military response often worsened civilian suffering.",
            how: "Boko Haram uses asymmetric warfare (bombings, kidnappings). Nigeria deploys military force. International community focuses on counter-terrorism but critics argue development investment is the real solution."
        },
        ibLinkage: { core: ["Power (Coercive)", "Legitimacy"], challenge: ["Security", "Poverty"] },
        globalChallenges: {
            Security: "Nigeria illustrates the limits of a purely military approach to security. Despite years of military operations, Boko Haram persists because the root causes—poverty, exclusion, and lack of governance—remain unaddressed. This case argues that 'Human Security' (addressing basic needs) is a prerequisite for 'National Security.'",
            Poverty: "Boko Haram's name literally translates to 'Western education is forbidden,' reflecting a rejection born from exclusion. Northeast Nigeria's extreme poverty and educational deprivation created the conditions for radicalization, making this a case where poverty is not just a social issue but a direct driver of violent conflict.",
            Health: "The insurgency has destroyed healthcare infrastructure across Borno State, creating famine conditions and disease outbreaks among 2.2 million displaced people. Health access has been weaponized, with Boko Haram targeting aid workers and the Nigerian military restricting humanitarian corridors.",
            Identity: "Boko Haram exploits a fractured national identity—the perceived economic and political marginalization of the predominantly Muslim North by the Christian/secular South. The insurgency feeds on a sense of 'otherness' and exclusion from the Nigerian national project."
        },
        theoryInsights: {
            Realism: "The Nigerian state's response to Boko Haram is a classic struggle for internal sovereignty and territorial integrity. For realists, the insurgency is a crisis of 'Hard Power' and state capacity. The external military support (US/France) is seen as a strategic necessity to maintain regional stability in an anarchic system where the state must have a monopoly on violence.",
            Feminism: "A feminist lens on Boko Haram is essential, specifically concerning the Chibok/Dapchi kidnappings and the use of gendered violence. It argues that the conflict cannot be understood through state security alone; it must be viewed through 'Human Security' and the specific targeting of women as a tool to destabilize social orders.",
            Structuralism: "Structuralists point to the systemic marginalization of Northern Nigeria (the 'Periphery') by the Southern economic 'Core'. Boko Haram's rise is not just about ideology, but about the structural underdevelopment and lack of economic opportunities that make radicalization a rational response to systemic exclusion from the national wealth."
        }
    },
    {
        name: "COP28 & Oil Interests", theme: "Interdependence + Sustainability",
        facts: ["Transition away from fuels", "Global stocktake", "Environment vs Economy"],
        fiveWH: {
            who: "Primary: UAE (host/ADNOC president), AOSIS (Small Island States), EU, China, USA. Secondary: fossil fuel lobbies, climate NGOs, IPCC.",
            what: "COP28 in Dubai produced the first-ever agreement to 'transition away from fossil fuels,' but was criticized for hosting conflicts of interest with oil-producing presidency.",
            where: "Dubai, UAE — a petrostate hosting climate negotiations. Impacts are global, especially for vulnerable SIDS and African nations.",
            when: "November-December 2023. First Global Stocktake under the Paris Agreement. Loss and Damage Fund operationalized.",
            why: "Tension between economic dependence on fossil fuels (for producing states) and existential climate threats (for vulnerable states). The Global Stocktake showed the world is off-track for 1.5°C.",
            how: "Multilateral negotiation within the UNFCCC framework; lobbying by fossil fuel interests (record 2,456 lobbyists at COP28); coalition-building by SIDS and climate-vulnerable states."
        },
        ibLinkage: { core: ["Interdependence", "Power (Structural)"], challenge: ["Environment", "Equality"] },
        globalChallenges: {
            Environment: "COP28 is the ultimate Environment challenge case. The first-ever agreement to 'transition away from fossil fuels' is a historic normative shift, but the gap between rhetoric and action remains vast. The Global Stocktake revealed the world is far off-track for 1.5°C, making this a case study in whether multilateral institutions can solve existential environmental threats.",
            Equality: "The Loss and Damage fund operationalized at COP28 is a direct response to climate inequality—the nations least responsible for emissions suffer the most from rising seas and extreme weather. The fund's initial pledges ($700M) were criticized as a fraction of the trillions needed, highlighting how global inequality shapes even cooperative outcomes.",
            Poverty: "For oil-dependent economies, transitioning away from fossil fuels threatens the livelihoods of millions. For climate-vulnerable nations, inaction threatens food security and displacement. COP28 exposes the cruel intersection of poverty and climate change: the poorest people face the highest costs of both action and inaction."
        },
        theoryInsights: {
            Structuralism: "COP28 is a battlefield of structural power. The 'Core' (fossil fuel producers) managed to retain significant influence over the 'Global Stocktake' text. From a structuralist view, the 'Loss and Damage' fund is a minor concession to the Periphery that doesn't actually challenge the global economic hierarchy that caused the climate crisis in the first place.",
            Liberalism: "For liberals, COP28 represents the best hope for collective action. Despite the oil presidency, the agreement to 'transition away' from fossil fuels is a landmark normative success of multilateralism. It proves that even the most difficult global problems can be managed through shared institutional frameworks and dialogue.",
            Realism: "Realism offers a cynical but necessary view: The UAE's presidency was a rational move to ensure that the energy transition doesn't happen at the expense of their national interest. A realist sees climate negotiations as 'Geopolitics by other means,' where states compete for energy security and economic advantage under the guise of global cooperation."
        }
    },
    {
        name: "NATO's 'Arctic Sentry'", theme: "Security + Environment",
        facts: ["Melting ice strategic shifts", "Russian High North expansion", "Climate-militarization"],
        fiveWH: {
            who: "Primary: Russia, NATO (especially Norway, Canada, USA), Finland, Sweden. Secondary: China ('Near-Arctic State' claim), Indigenous Arctic peoples.",
            what: "Climate change is melting Arctic ice, opening new shipping routes and resource access, triggering a geopolitical competition and military buildup.",
            where: "The Arctic region — Northern Sea Route, Northwest Passage, Svalbard, and Russia's Northern Fleet bases.",
            when: "Intensifying since 2007 (Russia's flag-planting at North Pole). Finland and Sweden joined NATO (2023-24), transforming Arctic security.",
            why: "Arctic holds an estimated 13% of undiscovered oil and 30% of undiscovered natural gas. The Northern Sea Route cuts shipping times between Europe and Asia by 40%.",
            how: "Russia militarizes Arctic bases and claims continental shelf. NATO conducts 'Arctic Sentry' exercises. Climate change acts as a threat multiplier — environmental degradation creates security competition."
        },
        ibLinkage: { core: ["Sovereignty", "Power (Hard)"], challenge: ["Security", "Environment"] },
        globalChallenges: {
            Security: "The Arctic is a new front in great power competition. Russia's Northern Fleet expansion and NATO's 'Arctic Sentry' exercises represent a classic security dilemma where climate change acts as a 'threat multiplier'—melting ice doesn't create peace; it opens new arenas for military competition.",
            Environment: "The Arctic is ground zero for climate change. Melting permafrost releases methane, accelerating warming in a feedback loop. Yet the same melting ice that signals environmental catastrophe also unlocks oil, gas, and shipping routes, creating a perverse incentive where environmental destruction is economically rewarded.",
            Borders: "Arctic borders are literally shifting as ice recedes. Continental shelf claims under UNCLOS are contested between Russia, Canada, Denmark, and Norway. The question of where sovereign territory ends and international commons begin is being redrawn by geology and climate science.",
            Technology: "Satellite monitoring, icebreaker fleets, and deep-sea drilling technology are the tools of Arctic competition. Russia's nuclear-powered icebreakers give it a technological edge in navigating the Northern Sea Route, demonstrating how technological capability directly translates to geopolitical advantage in extreme environments."
        },
        theoryInsights: {
            Realism: "The Arctic is a zero-sum frontier for Realism. NATO's 'Arctic Sentry' exercises and Russia's Northern Fleet expansion are rational responses to a new 'High North' security dilemma. Climate change isn't a shared challenge here; it's a competitive opener that allows states to project hard power into previously inaccessible territory.",
            Liberalism: "Liberals focus on the 'Arctic Council' as a fragile but necessary institutional buffer. They argue that Arctic governance should be defined by international law and cooperation on environmental research. For a liberal, the tragedy of the current militarization is that it undermines the 'Arctic Exceptionalism'—the idea that the region was once a zone of low tension.",
            Constructivism: "Constructivists analyze the 'Arctic Identity' of states like China, who call themselves 'Near-Arctic States' to claim legitimacy in the region. This is about 'Constructing Interests'—the Arctic is not just a place, but a socially defined strategic arena where being an 'Arctic Stakeholder' is a status that must be recognized and performed."
        }
    },
    {
        name: "Myanmar's Elections", theme: "Legitimacy + Coercive Power",
        facts: ["Fraudulent junta polls", "Rule by force vs rule by law", "Civilian resistance movements"],
        fiveWH: {
            who: "Primary: Tatmadaw (military junta/SAC), NUG (National Unity Government), ethnic armed organizations (EAOs). Secondary: ASEAN, China, civilian population.",
            what: "The military coup of Feb 2021 overthrew the elected NLD government. The junta plans elections widely seen as illegitimate while facing armed civilian and ethnic resistance.",
            where: "Myanmar — fighting spans Sagaing, Chin, Kayah, Karen, and Shan states. Refugee flows into Thailand, India, and Bangladesh.",
            when: "Coup: February 1, 2021. Planned 'elections' repeatedly delayed. Resistance has gained territorial control since late 2023.",
            why: "The Tatmadaw refused to accept the 2020 election results (NLD landslide). Deeper causes: military's decades-long grip on political and economic power, ethnic marginalization.",
            how: "Junta uses coercive power (airstrikes, mass detention, internet shutdowns). Resistance uses guerilla warfare (People's Defence Forces) and parallel governance (NUG). ASEAN's 'Five-Point Consensus' has failed."
        },
        ibLinkage: { core: ["Legitimacy", "Power (Coercive)", "Sovereignty"], challenge: ["Security", "Equality"] },
        globalChallenges: {
            Security: "Myanmar demonstrates the failure of collective security mechanisms. Despite ASEAN's 'Five-Point Consensus' and international condemnation, the junta continues to use airstrikes against civilians. The case exposes the gap between 'Human Security' ideals and the reality of sovereign impunity.",
            Equality: "The Tatmadaw's rule systematically excludes ethnic minorities (Rohingya, Karen, Chin) from political participation. Myanmar is a case where political inequality is enforced through violence, demonstrating that equality cannot exist without legitimate governance.",
            Technology: "The junta's internet shutdowns provide a stark example of how technology is used as a tool of repression. Conversely, resistance groups use encrypted messaging and social media to coordinate opposition and document atrocities, making technology both a weapon of the state and a shield for civil society.",
            Identity: "Myanmar's civil war is driven by a fragmented national identity—over 135 recognized ethnic groups with distinct languages and cultures. The Tatmadaw's Bamar-centric nationalism has alienated ethnic minorities for decades, and the NUG's promise of a federal, multi-ethnic democracy represents an attempt to construct a new, inclusive national identity."
        },
        theoryInsights: {
            Realism: "In Myanmar, the military junta (Tatmadaw) views power through a lens of 'Internal Realism'—where the state's survival is synonymous with military control. Any election is merely a tool of 'Coercive Legitimacy' to maintain order in an internal anarchy. Outside actors (ASEAN/China) often prioritize stability over democracy, reflecting a realist acceptance of power-based rule.",
            Liberalism: "Liberalism in Myanmar is currently a project of resistance. The NUG (National Unity Government) uses the language of 'Universal Human Rights' and 'Rule of Law' to seek international recognition. For liberals, the failure of international institutions to intervene represents a crisis for the 'Responsibility to Protect' (R2P) norm.",
            Structuralism: "A structuralist reading highlights how Myanmar's internal conflict is exacerbated by its role as a resource-rich 'Periphery' for regional 'Core' powers like China. The military junta survives by selling raw materials (gas, timber, jade), ensuring that global economic flows continue even while the local population suffers from structural violence and political exclusion."
        }
    },
    {
        name: "Türkiye's Autonomy", theme: "Identity + Security",
        facts: ["Strategic balancing (West vs BRICS)", "Middle power diplomacy", "NATO-Russia relations"],
        fiveWH: {
            who: "Primary: Türkiye (Erdoğan), NATO, Russia, EU. Secondary: USA, BRICS, Kurdish populations, Syria.",
            what: "Türkiye pursues 'strategic autonomy' — balancing NATO membership with Russian engagement, EU accession hesitation, and regional power projection.",
            where: "Crossroads of Europe, Middle East, and Central Asia. Key chokepoints: Bosporus Strait, Syrian border, Eastern Mediterranean.",
            when: "Ongoing; key moments include S-400 purchase (2019), Ukraine war mediation (2022), Sweden NATO ratification delay (2023-24).",
            why: "Türkiye seeks middle-power status by refusing to align fully with any bloc. Identity tensions: secular Kemalist legacy vs. Erdoğan's neo-Ottoman vision; EU rejection fuels pivot eastward.",
            how: "Leverages geographic position as bargaining chip (refugee deal with EU, grain corridor with Russia/Ukraine); arms purchases from both NATO and Russia; blocks NATO expansion for concessions."
        },
        ibLinkage: { core: ["Power (Middle Power)", "Sovereignty", "Identity"], challenge: ["Security", "Equality"] },
        globalChallenges: {
            Security: "Türkiye's purchase of Russian S-400 missiles while being a NATO member is a direct challenge to alliance security norms. It demonstrates how middle powers can exploit their strategic position to play major powers against each other, complicating collective security arrangements.",
            Identity: "Türkiye's 'strategic autonomy' is fundamentally an identity project. Erdoğan's neo-Ottoman narrative rejects the binary of 'East vs West,' constructing a unique civilizational identity that allows Türkiye to mediate between NATO and Russia, the EU and the Middle East, acting as a bridge rather than a follower.",
            Borders: "Türkiye controls the Bosphorus Strait—one of the world's most critical chokepoints. Its geographic position at the crossroads of Europe, Asia, and the Middle East makes its borders uniquely strategic, allowing it to leverage refugee flows (the EU deal) and trade routes as tools of foreign policy."
        },
        theoryInsights: {
            Realism: "Türkiye is the quintessential 'Realist Middle Power'. By blocking or delaying NATO accession for Finland/Sweden, Erdoğan leveraged his 'Regional Hegemon' status to extract national security concessions. This is about maximizing relative power within a major alliance, proving that even partners act in their own self-interest first.",
            Liberalism: "Liberals find Türkiye's behavior challenging to the idea of 'shared democratic norms' within NATO. It highlights the friction in 'Institutional Liberalism' when one member uses its veto power to pursue narrow domestic goals. However, the eventual compromise shows that the alliance's institutional frameworks are still capable of resolving internal disputes.",
            Constructivism: "Constructivism explains Türkiye's 'Autonomy' through its unique identity as a bridge between the West, Russia, and the Middle East. This 'Strategic Autonomy' is a constructed identity that allows Türkiye to act as a mediator. Türkiye doesn't see itself as just another NATO member, but as a distinct civilizational actor with interests that aren't tied to any single bloc."
        }
    }
];

const GLOBAL_QUESTIONS = [
    // --- POWER ---
    { theme: "Power", text: "Effective enforcement of Human Rights undermines state sovereignty. To what extent do you agree?" },
    { theme: "Power", text: "Transnational corporations have more power than most states in the 21st century. Discuss." },
    { theme: "Power", text: "Examine the claim that increased interactions and interconnectedness have fundamentally changed the nature of sovereignty." },
    { theme: "Power", text: "Evaluate the claim that sovereign states become less powerful when they join IGOs." },
    { theme: "Power", text: "To what extent is the 'rise of the rest' fundamentally challenging the liberal international order?" },
    { theme: "Power", text: "Analyze the view that labels such as 'unipolar' and 'multipolar' are no longer useful for describing global power dynamics." },
    { theme: "Power", text: "Evaluate the claim that middle powers have become more influential than great powers in contemporary global governance." },
    { theme: "Power", text: "To what extent has the concept of 'soft power' been rendered obsolete by the return of traditional hard power competition?" },
    { theme: "Power", text: "Discuss the view that the legitimacy of a state is derived more from its external recognition than its internal governance." },
    { theme: "Power", text: "Examine the claim that global civil society is the only effective check on state power in the 21st century." },

    // --- HUMAN RIGHTS ---
    { theme: "Human Rights", text: "Discuss the extent to which cultural relativism can be used to justify different concepts of human rights." },
    { theme: "Human Rights", text: "Evaluate the claim that the digital divide is the most significant barrier to the realization of human rights today." },
    { theme: "Human Rights", text: "To what extent do universal human rights standards represent a form of Western ideological hegemony?" },
    { theme: "Human Rights", text: "Examine the claim that economic and social rights are more important than civil and political rights for sustainable development." },
    { theme: "Human Rights", text: "Evaluate the effectiveness of the 'Responsibility to Protect' (R2P) doctrine in safeguarding human rights in sovereign states." },
    { theme: "Human Rights", text: "To what extent does the rise of surveillance technology threaten the fundamental right to privacy in democratic states?" },
    { theme: "Human Rights", text: "Discuss the view that international judicial bodies, like the ICC, are biased against the Global South." },
    { theme: "Human Rights", text: "Evaluate the claim that non-state actors are more effective than states in protecting the rights of marginalized populations." },
    { theme: "Human Rights", text: "Examine the relationship between environmental protection and the realization of fundamental human rights." },
    { theme: "Human Rights", text: "Discuss the extent to which the rights of indigenous peoples are compatible with the sovereign interests of the state." },

    // --- DEVELOPMENT ---
    { theme: "Development", text: "Evaluate the claim that economic growth is the most important factor in achieving sustainable development." },
    { theme: "Development", text: "Examine the claim that development is best achieved through a top-down approach." },
    { theme: "Development", text: "Discuss the claim that development is as much about people as it is about economies." },
    { theme: "Development", text: "Discuss the view that environmental sustainability is often sacrificed for the sake of economic development." },
    { theme: "Development", text: "Evaluate the claim that the United Nations Sustainable Development Goals (SDGs) are more aspirational than achievable." },
    { theme: "Development", text: "To what extent does foreign aid perpetuate dependency rather than promoting genuine development in recipient states?" },
    { theme: "Development", text: "Examine the role of international financial institutions (World Bank, IMF) in promoting equitable economic development." },
    { theme: "Development", text: "Evaluate the claim that gender equality is the most significant indicator of a country's development progress." },
    { theme: "Development", text: "Discuss the extent to which corruption acts as the primary barrier to development in the Global South." },
    { theme: "Development", text: "Examine the view that globalization has increased the gap between developed and developing nations." },

    // --- PEACE ---
    { theme: "Peace", text: "Discuss the view that peace can only be achieved through a balance of power between states." },
    { theme: "Peace", text: "Discuss why non-violent protest is sometimes able to achieve success against even the most powerful opponents." },
    { theme: "Peace", text: "Structural violence is increasingly important to achieving lasting peace. To what extent do you agree?" },
    { theme: "Peace", text: "Examine the claim that internal conflicts are more difficult to resolve than interstate conflicts in the 21st century." },
    { theme: "Peace", text: "Evaluate the effectiveness of UN peacekeeping operations in preventing the recurrence of conflict in post-conflict states." },
    { theme: "Peace", text: "To what extent has the rise of cyber warfare necessitated a fundamental change in the concept of security?" },
    { theme: "Peace", text: "Examine the claim that nuclear weapons are a stabilizing force in international relations due to deterrence." },
    { theme: "Peace", text: "Discuss the view that peace is more than the absence of war, requiring the presence of justice and equality." },
    { theme: "Peace", text: "To what extent do regional organizations (e.g., NATO, AU, ASEAN) strengthen state security in a multipolar world?" },
    { theme: "Peace", text: "Evaluate the claim that the arms trade is the single greatest obstacle to achieving lasting peace." }
];

// --- IR Theories Logic ---
const IR_THEORIES = {
    Realism: {
        color: '#ff4d4d',
        description: 'Focuses on power, national interest, and the anarchic nature of the international system.',
        getInterpretation: (c) => {
            if (c.theoryInsights?.Realism) return c.theoryInsights.Realism;
            const primaryTheme = c.theme.split('+')[0].trim();
            const stretch = c.theme.includes('Sovereignty') || c.theme.includes('Power') || c.theme.includes('Security')
                ? `Evaluating "${c.name}" through a realist lens is highly appropriate given its focus on ${primaryTheme}. `
                : `While "${c.name}" is primarily about ${primaryTheme}, a realist analysis exposes a deeper power struggle. `;
            return `${stretch}In this framework, ${c.fiveWH?.who.split('.')[0]} act as rational agents navigating a zero-sum environment. The "how" (${c.fiveWH?.how.substring(0, 80)}...) demonstrates that even in non-conflict cases, power remains the ultimate currency for ensuring state interests in an anarchic system.`;
        }
    },
    Liberalism: {
        color: '#3399ff',
        description: 'Emphasizes international cooperation, institutions, and the importance of democracy and human rights.',
        getInterpretation: (c) => {
            if (c.theoryInsights?.Liberalism) return c.theoryInsights.Liberalism;
            const players = c.fiveWH?.who.split(',')[0].split('.')[0];
            return `A liberal analysis of "${c.name}" identifies the importance of norms over raw power. Instead of zero-sum competition, ${players} engage in ${c.fiveWH?.how.toLowerCase().substring(0, 90)}. This suggests that institutional frameworks and the rule of law are actively constraining unilateral behavior, creating a predictable environment for mutual gains despite the competitive theme of ${c.theme}.`;
        }
    },
    Structuralism: {
        color: '#9966ff',
        description: 'Examines how the global Core-Periphery hierarchy constrains state behavior and development.',
        getInterpretation: (c) => {
            if (c.theoryInsights?.Structuralism) return c.theoryInsights.Structuralism;
            const stretch = c.theme.includes('Development') || c.theme.includes('Equality')
                ? `Structuralism is the primary lens for "${c.name}," as it centers on global hierarchy. `
                : `Applying Structuralism to this case exposes the underlying Core-Periphery hierarchy that often stays hidden behind ${c.theme.toLowerCase()} debates. `;
            return `${stretch}"${c.name}" serves as a microcosm for the global economic structure. The "how" (${c.fiveWH?.how.substring(0, 70)}...) shows how the Core nations set the parameters of interaction, ensuring that ${c.fiveWH?.who.split('Secondary')[0].substring(0, 50)} remain structurally aligned with established power interests.`;
        }
    },
    Marxism: {
        color: '#cc0000',
        description: 'Analyzes events through class struggle, exploitation, and the contradictions of global capitalism.',
        getInterpretation: (c) => {
            if (c.theoryInsights?.Marxism) return c.theoryInsights.Marxism;
            const stretch = c.theme.includes('Economy') || c.theme.includes('Development')
                ? `Evaluating the material interests in "${c.name}" through a Marxist lens is essential to understanding the underlying economic drivers. `
                : `While "${c.name}" appears political or social, a Marxist critique reveals how the interests of capital still dictate the boundaries of ${c.theme.toLowerCase()}. `;
            return `${stretch}Marxist theory argues that ${c.fiveWH?.who.split(',')[0]} are essentially serving the quest for capital accumulation. This case highlights how "how" (${c.fiveWH?.how.substring(0, 60)}...) is fundamentally about property, profit, or resources, rather than the stated ideological or humanitarian goals.`;
        }
    },
    Constructivism: {
        color: '#00cc99',
        description: 'Argues that global politics is shaped by socially constructed ideas, identities, and norms.',
        getInterpretation: (c) => {
            if (c.theoryInsights?.Constructivism) return c.theoryInsights.Constructivism;
            return `For a constructivist, "${c.name}" is not just an event, but a performance of identity. By framing the issue through ${c.fiveWH?.how.toLowerCase().substring(0, 70)}, the actors are actively constructing what is considered 'legitimate' or 'necessary' in global politics. Interests aren't fixed; they are shaped by the specific narrative ${c.fiveWH?.who.split('.')[0]} chooses to project in this case.`;
        }
    },
    Feminism: {
        color: '#ff66cc',
        description: 'Examines how gender hierarchies shape global power dynamics and whose voices are excluded.',
        getInterpretation: (c) => {
            if (c.theoryInsights?.Feminism) return c.theoryInsights.Feminism;
            const hasWomen = c.fiveWH?.who.toLowerCase().includes('women') || c.fiveWH?.what.toLowerCase().includes('women');
            const stretch = hasWomen
                ? `A feminist lens is critical here to understand the gendered impact of ${c.theme.toLowerCase()}. `
                : `Feminist theory might seem distant from "${c.name}," but its application reveals the exclusionary nature of the process. `;
            return `${stretch}It asks: where is the 'human security' for marginalized groups in ${c.fiveWH?.where}? By prioritizing the "hard" security/economic needs of ${c.fiveWH?.who.substring(0, 40)}, the system inherently silences those whose lives are most impacted by the "how" (${c.fiveWH?.how.substring(0, 50)}...).`;
        }
    },
    Postcolonialism: {
        color: '#ff9933',
        description: 'Critically analyzes colonial legacies and how Western-centric power dynamics persist today.',
        getInterpretation: (c) => {
            if (c.theoryInsights?.Postcolonialism) return c.theoryInsights.Postcolonialism;
            const isWest = c.fiveWH?.who.toLowerCase().includes('west') || c.fiveWH?.who.toLowerCase().includes('usa') || c.fiveWH?.who.toLowerCase().includes('eu');
            const stretch = isWest
                ? `This case highlights the persistence of Western-centric gaze even in modern ${c.theme.toLowerCase()} contexts. `
                : `While not explicitly about colonizer-colonized relations, evaluating "${c.name}" through this lens reveals enduring hierarchies. `;
            return `${stretch}The "where" (${c.fiveWH?.where}) is often treated as a resource to be managed or a problem to be solved by Global North actors. This reinforces a power imbalance where ${c.fiveWH?.who.split('Secondary')[0].substring(0, 50)} are framed through a Eurocentric perspective that ignores local agency and indigenous knowledge.`;
        }
    }
};

// --- Components ---

const Card = ({ children, className = "" }) => (
    <div className={`glass rounded-xl p-6 mb-6 ${className}`}>
        {children}
    </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", disabled = false }) => {
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-glopo-border hover:bg-gray-700 text-gray-200",
        success: "bg-emerald-600 hover:bg-emerald-700 text-white",
        outline: "border border-glopo-border hover:bg-glopo-border text-gray-300"
    };
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

// --- Tab 1: Policy Engine ---

// --- Gemini Retry Helper (client-side) ---
// Retries on 429 / 503 with exponential backoff (1.5s → 3s → 6s)
const geminiRetryFetch = async (url, fetchOptions, maxRetries = 3) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const res = await fetch(url, fetchOptions);
        if (res.ok || ![429, 503].includes(res.status)) return res;
        if (attempt < maxRetries) {
            const delay = 1500 * Math.pow(2, attempt);
            console.log(`[gemini-retry] ${res.status} — retrying in ${delay}ms (${attempt + 1}/${maxRetries})`);
            await new Promise(r => setTimeout(r, delay));
        } else {
            return res; // exhausted retries
        }
    }
};

// ── Solution Research Bot ────────────────────────────────────
const SolutionResearch = () => {
    const [step, setStep] = useState(1);
    const [inputs, setInputs] = useState({ problem: '', actors: '', mechanism: '', rationale: '', risk: '', mitigation: '' });
    const [riskCategory, setRiskCategory] = useState('');
    const [feedback, setFeedback] = useState({});
    const [loading, setLoading] = useState({});
    const [researchResults, setResearchResults] = useState(null);
    const [researchLoading, setResearchLoading] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [draftResult, setDraftResult] = useState(null);
    const [draftLoading, setDraftLoading] = useState(false);
    const [showActorBank, setShowActorBank] = useState(false);

    const update = (field, val) => setInputs(prev => ({ ...prev, [field]: val }));
    const FIELDS = ['problem', 'actors', 'mechanism', 'rationale', 'risk', 'mitigation'];
    const STEP_META = [
        { icon: '🔍', label: 'Problem', q: "What's broken?", hint: 'Describe the core problem in one sentence. Tip: A problem backed by a statistic, date, or named impact is far more powerful.' },
        { icon: '🏛', label: 'Actors', q: 'Who has the power to fix it?', hint: 'Name 2–3 specific actors (with sub-bodies) who have the authority, resources, or jurisdiction.' },
        { icon: '⚙️', label: 'Mechanism', q: "What's the move?", hint: 'Describe ONE concrete, verifiable policy action using a mechanism template (amend/certify/condition/establish).' },
        { icon: '💡', label: 'Rationale', q: 'Why would it actually work?', hint: 'Provide 2–3 pieces of evidence: a precedent, an existing system, or data that supports urgency.' },
        { icon: '⚠️', label: 'Risk', q: 'What could go wrong?', hint: 'Name the single most credible obstacle to your policy.' },
        { icon: '🛡', label: 'Mitigation', q: 'How do you mitigate it?', hint: 'Propose a countermeasure naming a secondary actor or alternative mechanism.' }
    ];

    const ACTOR_BANK = [
        { gpc: 'Security', actor: 'UN Security Council (Ch. VII)', tool: 'Binding resolutions, peacekeeping mandates, sanctions' },
        { gpc: 'Security', actor: 'AU Peace & Security Council', tool: 'Continental early warning, African Standby Force' },
        { gpc: 'Security', actor: 'ICC Office of the Prosecutor', tool: 'Investigations, arrest warrants, UNSC referrals' },
        { gpc: 'Environment', actor: 'UNFCCC COP Presidency', tool: 'Binding emissions targets, climate finance' },
        { gpc: 'Environment', actor: 'World Bank Climate Investment Funds', tool: 'Concessional loans, Clean Technology Fund' },
        { gpc: 'Poverty', actor: 'World Bank IDA', tool: 'Zero-interest loans, debt relief' },
        { gpc: 'Poverty', actor: 'WTO Dispute Settlement Body', tool: 'Trade dispute rulings, tariff adjustment' },
        { gpc: 'Health', actor: 'WHO Director-General (IHR)', tool: 'PHEIC declarations, IHR enforcement' },
        { gpc: 'Health', actor: 'Gavi, the Vaccine Alliance', tool: 'AMCs, COVAX-style pooled procurement' },
        { gpc: 'Technology', actor: 'EU Commission DG CONNECT', tool: 'Digital Services Act, AI Act' },
        { gpc: 'Equality', actor: 'UN Human Rights Council (UPR)', tool: 'Country reviews, Special Rapporteur mandates' },
        { gpc: 'Equality', actor: 'ICJ', tool: 'Advisory opinions, binding judgments' }
    ];

    const MECH_TEMPLATES = [
        { label: 'Amend', text: '[Actor] should amend [existing treaty/regulation] to require [specific new obligation] verified by [enforcement body].' },
        { label: 'Certify', text: '[Actor] should require all [companies/states] to obtain a [certificate/audit] before accessing [market/funding].' },
        { label: 'Condition', text: '[Actor] should condition [trade access/funding] on demonstrated compliance with [standard/protocol].' },
        { label: 'Establish', text: '[Actor] should create a [board/commission] comprising [stakeholders], with authority to [review/approve actions].' }
    ];

    const RISK_CATEGORIES = [
        { id: 'sovereignty', label: 'Sovereignty Resistance', desc: 'State may frame this as external interference.' },
        { id: 'economic', label: 'Economic Disruption', desc: 'Risks disrupting supply chains or raising prices.' },
        { id: 'enforcement', label: 'Enforcement Gap', desc: 'Target may block auditors or refuse compliance.' },
        { id: 'timeline', label: 'Timeline Conflict', desc: 'Consultation processes may delay urgent action.' }
    ];

    // AI call — dual strategy (Netlify function → direct Gemini fallback)
    const callAI = async (mode, stepNum, extraInputs) => {
        const payload = { mode, step: stepNum, inputs: extraInputs || { text: inputs[FIELDS[stepNum - 1]] } };
        const isLocalDev = window.location.hostname === 'localhost';
        // Strategy 1: Netlify function
        if (!isLocalDev) {
            try {
                const res = await fetch('/.netlify/functions/solution-research', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload), signal: AbortSignal.timeout(25000)
                });
                if (res.ok) return await res.json();
            } catch {}
        }
        // Strategy 2: Direct Gemini
        let apiKey = process.env.REACT_APP_GEMINI_API_KEY;
        if (!apiKey) {
            try {
                const tkRes = await fetch('/.netlify/functions/get-token', { signal: AbortSignal.timeout(5000) });
                if (tkRes.ok) { const d = await tkRes.json(); apiKey = d.key; }
            } catch {}
        }
        if (!apiKey) throw new Error('AI not configured');

        const EVAL_PROMPTS = {
            1: `You are an IB Global Politics exam coach evaluating a problem statement for Paper 3 Q2.\n\nStudent: "${extraInputs?.text || inputs.problem}"\n\nEvaluate for specificity, statistical evidence, clarity of harm.\nReturn JSON: {"score":1-3,"feedback":"paragraph","suggestions":["s1","s2"],"improved":"stronger version if score<3"}`,
            2: `You are an IB Global Politics exam coach evaluating actors.\n\nStudent: "${extraInputs?.text || inputs.actors}"\n\nEvaluate: specific sub-bodies? Named tools? Appropriate?\nReturn JSON: {"score":1-3,"feedback":"paragraph","suggestions":["s1","s2"],"improved":"enhanced version"}`,
            3: `You are an IB Global Politics exam coach evaluating a mechanism.\n\nStudent: "${extraInputs?.text || inputs.mechanism}"\n\nEvaluate: concrete? Verifiable? Follows template?\nReturn JSON: {"score":1-3,"feedback":"paragraph","suggestions":["s1","s2"],"improved":"stronger version"}`,
            4: `You are an IB Global Politics exam coach evaluating rationale.\n\nStudent: "${extraInputs?.text || inputs.rationale}"\n\nEvaluate: precedent? Existing system? Data?\nReturn JSON: {"score":1-3,"feedback":"paragraph","suggestions":["s1","s2"],"improved":"enhanced version"}`,
            5: `You are an IB Global Politics exam coach evaluating a risk.\n\nStudent: "${extraInputs?.text || inputs.risk}"\n\nEvaluate: credible? Specific actor/dynamic? Categorizable?\nReturn JSON: {"score":1-3,"feedback":"paragraph","suggestions":["s1","s2"],"improved":"stronger version"}`,
            6: `You are an IB Global Politics exam coach evaluating mitigation.\n\nStudent: "${extraInputs?.text || inputs.mitigation}"\n\nEvaluate: secondary actor? Specific? Addresses risk?\nReturn JSON: {"score":1-3,"feedback":"paragraph","suggestions":["s1","s2"],"improved":"stronger version"}`
        };

        let prompt;
        if (mode === 'evaluate') prompt = EVAL_PROMPTS[stepNum];
        else if (mode === 'research') prompt = `You are a research assistant for IB Global Politics P3 Q2.\n\nProblem: "${inputs.problem}"\nActors: "${inputs.actors}"\n\nReturn JSON: {"caseContext":"paragraph","searchTerms":["5 terms"],"keyOrganizations":["3-4"],"usefulData":["3-4"],"policyPrecedents":["2-3"]}`;
        else if (mode === 'draft') prompt = `You are an IB Global Politics senior examiner. Generate three tiered policy recommendation paragraphs.\n\nProblem: ${inputs.problem}\nActors: ${inputs.actors}\nMechanism: ${inputs.mechanism}\nRationale: ${inputs.rationale || 'N/A'}\nRisk: ${inputs.risk || 'N/A'}\nMitigation: ${inputs.mitigation || 'N/A'}\n\nReturn JSON: {"band34":{"label":"Band 3–4","description":"desc","text":"80-100 words"},"elevation1":["3-4 moves"],"band56":{"label":"Band 5–6","description":"desc","text":"120-150 words"},"elevation2":["3-4 moves"],"band7":{"label":"Band 7","description":"desc","text":"160-200 words"}}`;

        const resp = await geminiRetryFetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { response_mime_type: 'application/json' } }) }
        );
        if (!resp.ok) throw new Error(`Gemini error ${resp.status}`);
        const gData = await resp.json();
        return JSON.parse(gData?.candidates?.[0]?.content?.parts?.[0]?.text || '{}');
    };

    const evaluateStep = async (stepNum) => {
        const field = FIELDS[stepNum - 1];
        if (!inputs[field]?.trim()) return;
        setLoading(prev => ({ ...prev, [field]: true }));
        try {
            const result = await callAI('evaluate', stepNum);
            setFeedback(prev => ({ ...prev, [field]: result }));
        } catch (e) {
            setFeedback(prev => ({ ...prev, [field]: { error: e.message } }));
        }
        setLoading(prev => ({ ...prev, [field]: false }));
    };

    const runResearch = async () => {
        if (!inputs.problem.trim()) return;
        setResearchLoading(true); setResearchResults(null);
        try { setResearchResults(await callAI('research', 0, inputs)); }
        catch (e) { setResearchResults({ error: e.message }); }
        setResearchLoading(false);
    };

    const generateDraft = async () => {
        setDraftLoading(true); setDraftResult(null);
        try { setDraftResult(await callAI('draft', 0, inputs)); }
        catch (e) { setDraftResult({ error: e.message }); }
        setDraftLoading(false);
    };

    const scoreColors = { 1: '#c0283e', 2: '#b07d10', 3: '#1a8a5a' };
    const scoreLabels = { 1: 'Needs Work', 2: 'Getting There', 3: 'Strong' };
    const field = FIELDS[step - 1];
    const meta = STEP_META[step - 1];
    const fb = feedback[field];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2"><Search size={18} /> Solution Research Bot</h3>
            <p className="text-[11px] text-gray-500">Build precise AMR² solution components for your case studies through a guided 6-step research sequence.</p>

            {/* AMR² Reference Bar */}
            <div className="flex items-center gap-2 flex-wrap p-3 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mr-1">AMR²:</span>
                {[
                    { label: 'Actor', color: 'blue' }, { label: 'Mechanism', color: 'emerald' },
                    { label: 'Rationale', color: 'amber' }, { label: 'Risk', color: 'red' }
                ].map((item, i) => (
                    <React.Fragment key={item.label}>
                        {i > 0 && <span className="text-gray-700 font-bold">+</span>}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-${item.color}-500/10 text-${item.color}-400`}>{item.label}</span>
                    </React.Fragment>
                ))}
            </div>

            {/* Step Navigation */}
            <div className="flex gap-1.5 flex-wrap">
                {STEP_META.map((s, i) => (
                    <button key={i} onClick={() => setStep(i + 1)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${step === i + 1 ? 'bg-blue-600 text-white' : inputs[FIELDS[i]]?.trim() ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-gray-600 border border-white/10 hover:bg-white/10'}`}>
                        {s.icon} {s.label}
                    </button>
                ))}
            </div>

            {/* Current Step */}
            <div className="p-5 bg-white/5 border border-blue-500/20 rounded-xl space-y-3">
                <p className="text-sm font-black text-blue-400">{meta.icon} Step {step}: {meta.q}</p>
                <p className="text-[11px] text-gray-500">{meta.hint}</p>
                <textarea rows={3} value={inputs[field]} onChange={e => update(field, e.target.value)}
                    className="w-full bg-glopo-dark border border-white/20 rounded-xl p-3 text-sm text-gray-300 outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
                    placeholder={`Type your ${meta.label.toLowerCase()} here...`} />

                {/* Step-specific helpers */}
                {step === 2 && (
                    <div className="space-y-2">
                        <button onClick={() => setShowActorBank(!showActorBank)} className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors">
                            📘 {showActorBank ? 'Hide' : 'Show'} Actor Bank Reference
                        </button>
                        {showActorBank && (
                            <div className="grid gap-1.5 max-h-48 overflow-y-auto p-2 bg-white/[0.02] rounded-lg border border-white/5">
                                {ACTOR_BANK.map((a, i) => (
                                    <div key={i} className="flex items-start gap-2 p-2 bg-white/5 rounded text-[10px]">
                                        <span className="font-bold text-blue-400 whitespace-nowrap">{a.gpc}</span>
                                        <span className="text-gray-300 font-bold">{a.actor}</span>
                                        <span className="text-gray-500">— {a.tool}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {step === 3 && (
                    <div className="space-y-1.5">
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">⚙️ Templates (click to insert)</p>
                        {MECH_TEMPLATES.map((t, i) => (
                            <div key={i} onClick={() => update('mechanism', t.text)}
                                className="p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-[11px] text-gray-400 cursor-pointer hover:border-emerald-500/30 transition-all">
                                <span className="text-emerald-400 font-bold mr-1">{t.label}:</span> {t.text}
                            </div>
                        ))}
                    </div>
                )}
                {step === 5 && (
                    <div className="grid grid-cols-2 gap-2">
                        {RISK_CATEGORIES.map(r => (
                            <div key={r.id} onClick={() => setRiskCategory(r.id)}
                                className={`p-2.5 rounded-lg border cursor-pointer transition-all text-[11px] ${riskCategory === r.id ? 'border-red-500/40 bg-red-500/10' : 'border-white/10 bg-white/[0.02] hover:border-red-500/20'}`}>
                                <p className="font-bold text-red-400 text-[10px]">{r.label}</p>
                                <p className="text-gray-500">{r.desc}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* AI Feedback Display */}
                {loading[field] && <p className="text-[11px] text-blue-400 animate-pulse">🤖 Analyzing...</p>}
                {fb && !loading[field] && !fb.error && (
                    <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-2">
                        <p className="text-[10px] font-black text-blue-400">
                            🤖 Feedback <span style={{ color: scoreColors[fb.score] }} className="ml-1">{scoreLabels[fb.score]} ({fb.score}/3)</span>
                        </p>
                        <p className="text-[11px] text-gray-300">{fb.feedback}</p>
                        {fb.suggestions?.length > 0 && (
                            <ul className="space-y-1">{fb.suggestions.map((s, i) => (
                                <li key={i} className="text-[10px] text-gray-500 flex items-start gap-1"><span className="text-blue-400 shrink-0">→</span>{s}</li>
                            ))}</ul>
                        )}
                        {fb.improved && fb.score < 3 && (
                            <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded-lg">
                                <p className="text-[9px] font-bold text-emerald-400 mb-1">✨ Suggested Improvement:</p>
                                <p className="text-[11px] text-gray-300 italic">{fb.improved}</p>
                                <button onClick={() => update(field, fb.improved)} className="mt-1.5 text-[9px] font-bold text-emerald-400 hover:text-emerald-300">Use This ↓</button>
                            </div>
                        )}
                    </div>
                )}
                {fb?.error && <p className="text-[10px] text-red-400">⚠️ {fb.error}</p>}

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap pt-1">
                    {step > 1 && <button onClick={() => setStep(step - 1)} className="px-3 py-1.5 bg-white/5 text-gray-500 text-[10px] font-bold rounded-lg hover:bg-white/10 transition-all">← Back</button>}
                    <button onClick={() => evaluateStep(step)} disabled={!inputs[field]?.trim() || loading[field]}
                        className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-all">🤖 Evaluate</button>
                    {step === 2 && <button onClick={runResearch} disabled={!inputs.problem?.trim() || researchLoading}
                        className="px-3 py-1.5 bg-violet-600 text-white text-[10px] font-bold rounded-lg hover:bg-violet-700 disabled:opacity-40 transition-all">🔎 Research This Case</button>}
                    {step < 6 && <button onClick={() => setStep(step + 1)} className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-700 transition-all">Next →</button>}
                    {step === 6 && <button onClick={() => setShowCard(true)} disabled={!inputs.problem?.trim() || !inputs.actors?.trim() || !inputs.mechanism?.trim()}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-40 transition-all">📋 Generate Solution Card</button>}
                </div>
            </div>

            {/* Research Results */}
            {researchLoading && <p className="text-[11px] text-violet-400 animate-pulse">🔎 Researching your case...</p>}
            {researchResults && !researchResults.error && (
                <div className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl space-y-3">
                    <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest">🔎 Research Results</p>
                    {researchResults.caseContext && <p className="text-[11px] text-gray-300">{researchResults.caseContext}</p>}
                    {[
                        { key: 'searchTerms', title: '🔍 Search Terms', color: 'text-blue-400' },
                        { key: 'keyOrganizations', title: '🏛 Key Organizations', color: 'text-emerald-400' },
                        { key: 'usefulData', title: '📊 Data Points', color: 'text-amber-400' },
                        { key: 'policyPrecedents', title: '📜 Precedents', color: 'text-violet-400' }
                    ].map(s => researchResults[s.key]?.length > 0 && (
                        <div key={s.key}>
                            <p className={`text-[9px] font-bold ${s.color} uppercase tracking-widest mb-1`}>{s.title}</p>
                            <ul className="space-y-0.5">{researchResults[s.key].map((item, i) => (
                                <li key={i} className="text-[10px] text-gray-400 flex items-start gap-1"><span className={s.color + ' shrink-0'}>→</span>{item}</li>
                            ))}</ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Solution Card */}
            {showCard && (
                <div className="p-5 border-2 border-blue-500/30 bg-blue-500/5 rounded-xl space-y-2">
                    <p className="text-sm font-black text-blue-400">📋 Solution Card</p>
                    {[
                        { f: 'problem', label: '🔍 PROBLEM', color: 'text-gray-400' },
                        { f: 'actors', label: '🏛 ACTOR', color: 'text-blue-400' },
                        { f: 'mechanism', label: '⚙️ MECHANISM', color: 'text-emerald-400' },
                        { f: 'rationale', label: '💡 RATIONALE', color: 'text-amber-400' },
                        { f: 'risk', label: '⚠️ RISK', color: 'text-red-400' },
                        { f: 'mitigation', label: '🛡 MITIGATION', color: 'text-violet-400' }
                    ].filter(s => inputs[s.f]?.trim()).map(s => (
                        <div key={s.f} className="flex items-start gap-2">
                            <span className={`text-[9px] font-black ${s.color} uppercase whitespace-nowrap`}>{s.label}</span>
                            <span className="text-[11px] text-gray-300">{inputs[s.f]}</span>
                        </div>
                    ))}
                    <button onClick={generateDraft} disabled={draftLoading}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-all">
                        ✍️ Generate AMR² Draft Paragraphs
                    </button>
                </div>
            )}

            {/* Tiered Draft Output */}
            {draftLoading && <p className="text-[11px] text-blue-400 animate-pulse">✍️ Generating tiered drafts...</p>}
            {draftResult && !draftResult.error && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                    <p className="text-sm font-black text-blue-400">✍️ AMR² Draft Paragraphs</p>
                    {draftResult.band34 && (
                        <div className="border border-gray-500/20 bg-gray-500/5 rounded-xl p-3">
                            <span className="text-[9px] font-bold bg-gray-700 text-gray-300 px-2 py-0.5 rounded mr-2">{draftResult.band34.label}</span>
                            <span className="text-[9px] text-gray-500 italic">{draftResult.band34.description}</span>
                            <p className="text-[11px] text-gray-400 mt-2 italic leading-relaxed">"{draftResult.band34.text}"</p>
                        </div>
                    )}
                    {draftResult.elevation1?.length > 0 && (
                        <div className="border border-amber-500/20 bg-amber-950/20 rounded-xl px-4 py-3">
                            <p className="text-amber-400 text-[10px] font-bold mb-2">🔼 MOVES THAT ELEVATE TO BAND 5–6</p>
                            <ul className="space-y-1">{draftResult.elevation1.map((m, i) => <li key={i} className="text-[10px] text-amber-200/80 flex items-start gap-1"><span className="text-amber-500 shrink-0">→</span>{m}</li>)}</ul>
                        </div>
                    )}
                    {draftResult.band56 && (
                        <div className="border border-blue-500/20 bg-blue-900/10 rounded-xl p-3">
                            <span className="text-[9px] font-bold bg-blue-800 text-blue-200 px-2 py-0.5 rounded mr-2">{draftResult.band56.label}</span>
                            <span className="text-[9px] text-blue-400 italic">{draftResult.band56.description}</span>
                            <p className="text-[11px] text-gray-300 mt-2 italic leading-relaxed">"{draftResult.band56.text}"</p>
                        </div>
                    )}
                    {draftResult.elevation2?.length > 0 && (
                        <div className="border border-amber-500/20 bg-amber-950/20 rounded-xl px-4 py-3">
                            <p className="text-amber-400 text-[10px] font-bold mb-2">🔼 MOVES THAT ELEVATE TO BAND 7</p>
                            <ul className="space-y-1">{draftResult.elevation2.map((m, i) => <li key={i} className="text-[10px] text-amber-200/80 flex items-start gap-1"><span className="text-amber-500 shrink-0">→</span>{m}</li>)}</ul>
                        </div>
                    )}
                    {draftResult.band7 && (
                        <div className="border border-emerald-500/20 bg-emerald-900/10 rounded-xl p-3">
                            <span className="text-[9px] font-bold bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded mr-2">{draftResult.band7.label}</span>
                            <span className="text-[9px] text-emerald-400 italic">{draftResult.band7.description}</span>
                            <p className="text-[11px] text-gray-300 mt-2 italic leading-relaxed">"{draftResult.band7.text}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
const PolicyEngine = () => {
    const [policyMode, setPolicyMode] = useState('engine');
    const [actor, setActor] = useState('');
    const [target, setTarget] = useState('');
    const [mechanism, setMechanism] = useState('');
    const [issue, setIssue] = useState('');
    const [result, setResult] = useState(null);

    const THEORIES = [
        {
            name: 'Realism',
            lens: 'state self-interest and power maximisation',
            institution: 'coercive bilateral pressure',
            limit: 'states will defect from agreements when national interest diverges',
            concept: 'sovereignty and the balance of power'
        },
        {
            name: 'Liberalism',
            lens: 'institutional cooperation and collective-gains logic',
            institution: 'multilateral coordination through international institutions',
            limit: 'coordination is vulnerable to domestic political resistance and free-riding',
            concept: 'interdependence and global governance'
        },
        {
            name: 'Constructivism',
            lens: 'norm diffusion, identity formation, and socialisation',
            institution: 'diplomatic socialisation and norm-setting frameworks',
            limit: 'norm internalisation is a slow and non-linear process that cannot be coerced',
            concept: 'human rights norms and the evolving international order'
        },
    ];

    const generateSolution = () => {
        if (!actor || !target) return;
        const tIdx = (actor.length + target.length) % 3;
        const t = THEORIES[tIdx];
        const mech = mechanism || 'targeted diplomatic pressure';
        const iss = issue || 'the underlying geopolitical tension';

        setResult({
            basic: {
                tier: 'Band 3–4',
                label: 'States the policy — but no theory, no causal logic, no evaluation.',
                text: `${actor} should use ${mech} on ${target} to deal with ${iss}. This would put pressure on them and help fix the situation. If they do not comply, ${actor} can increase the pressure until ${target} changes its behaviour.`,
            },
            elevate1: [
                `Name the IR theory lens (e.g. ${t.name}) — why does this actor behave this way, and through what logic does this mechanism produce change?`,
                `Explain the causal mechanism: how does ${mech} specifically alter ${target}'s incentives or calculations?`,
                `Replace vague phrases ("fix the situation", "put pressure on them") with precise political science vocabulary`,
                `Acknowledge at least one structural constraint on ${actor}'s ability to act effectively`,
            ],
            proficient: {
                tier: 'Band 5–6',
                label: 'Theory-linked, causally explained, one constraint evaluated.',
                text: `From a ${t.name.toLowerCase()} perspective — which emphasises ${t.lens} — ${actor} is well-positioned to deploy ${mech} in response to ${iss}. This mechanism functions by altering the cost-benefit calculus facing ${target}: by raising the costs of non-compliance through ${t.institution}, ${actor} can incentivise behavioural adjustment without direct escalation. However, a significant constraint is that ${t.limit}, meaning that sustained, credible commitment from ${actor} is essential for the policy to produce durable outcomes.`,
            },
            elevate2: [
                `Introduce a competing stakeholder or third-party dynamic — how do other international actors shape or constrain this policy?`,
                `Embed a historical precedent or analogous case that substantiates (or complicates) the mechanism's track record`,
                `Evaluate the trade-off or unintended consequence of deploying ${mech} — what does it risk producing?`,
                `Use hedged, evaluative language ("while X may… Y remains contingent on…") to signal scholarly sophistication`,
                `Connect to a broader IB concept such as ${t.concept} to demonstrate analytical range`,
            ],
            band7: {
                tier: 'Band 7',
                label: 'Multi-perspective, historically grounded, trade-offs evaluated, hedged throughout.',
                text: `While ${actor}'s deployment of ${mech} represents a structurally plausible response to ${iss}, its effectiveness is contingent on several compounding variables that a ${t.name.toLowerCase()} framework only partially captures. The ${t.name.toLowerCase()} lens — centred on ${t.lens} — illuminates how ${mech} reshapes the incentive structure surrounding ${target}; however, as demonstrated by comparable cases of coercive international engagement, such tools frequently generate diminishing returns when target actors possess alternative alliances or ideological resistance to external pressure. Furthermore, ${actor}'s legitimacy in deploying this mechanism depends on whether action is pursued through ${t.institution}, since unilateral intervention risks norm-backlash and counter-mobilisation that could entrench rather than resolve ${iss}. A more analytically complete response must therefore account for the question of ${t.concept}: durable resolution requires not only sustained deployment of ${mech}, but a complementary strategy that addresses the structural incentives underpinning ${target}'s behaviour — recognising, as ${t.name.toLowerCase()} theory cautions, that ${t.limit}.`,
            },
        });
    };

    const TierCard = ({ tier, label, text, color }) => {
        const styles = {
            slate: { border: 'border-slate-500/30', bg: 'bg-slate-900/30', badge: 'bg-slate-700 text-slate-200', heading: 'text-slate-300' },
            blue: { border: 'border-blue-500/30', bg: 'bg-blue-900/20', badge: 'bg-blue-800 text-blue-200', heading: 'text-blue-400' },
            emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-900/20', badge: 'bg-emerald-800 text-emerald-200', heading: 'text-emerald-400' },
        };
        const c = styles[color];
        return (
            <div className={`border ${c.border} ${c.bg} rounded-xl p-5`}>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${c.badge}`}>{tier}</span>
                    <span className={`text-xs ${c.heading} italic`}>{label}</span>
                </div>
                <p className="text-gray-200 leading-relaxed text-sm">&ldquo;{text}&rdquo;</p>
            </div>
        );
    };

    const ElevationMoves = ({ moves, toTier }) => (
        <div className="border border-amber-500/20 bg-amber-950/20 rounded-xl px-5 py-4">
            <p className="text-amber-400 text-xs font-bold mb-3 flex items-center gap-2">
                🔼 MOVES THAT ELEVATE TO {toTier.toUpperCase()}
            </p>
            <ul className="space-y-2">
                {moves.map((move, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-amber-200/80">
                        <span className="text-amber-500 mt-0.5 shrink-0">→</span>
                        <span>{move}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                <Shield className="text-blue-500" /> Policy Engine
            </h2>
            <p className="text-gray-400 text-sm mb-4">Build and evaluate policy recommendations using the AMR² formula.</p>
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
                <button onClick={() => setPolicyMode('engine')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${policyMode === 'engine' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10 border border-white/10'}`}>
                    <Shield size={13} /> Policy Scaffold
                </button>
                <button onClick={() => setPolicyMode('solutions')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${policyMode === 'solutions' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10 border border-white/10'}`}>
                    <Search size={13} /> Policy Solutions
                </button>
            </div>
            {policyMode === 'solutions' ? <SolutionResearch /> : (<>
            <Card>
                <div className="grid gap-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Actor <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                placeholder="e.g. UN Security Council"
                                value={actor}
                                onChange={(e) => setActor(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Target <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                placeholder="e.g. Myanmar Military Junta"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Issue / Context</label>
                        <input
                            type="text"
                            className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                            placeholder="e.g. ongoing human rights violations and democratic backsliding"
                            value={issue}
                            onChange={(e) => setIssue(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Mechanism <span className="text-gray-600">(optional)</span></label>
                        <input
                            type="text"
                            className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                            placeholder="e.g. Magnitsky-style targeted sanctions"
                            value={mechanism}
                            onChange={(e) => setMechanism(e.target.value)}
                        />
                    </div>
                </div>
                <Button onClick={generateSolution} className="w-full" disabled={!actor || !target}>
                    <Zap size={18} /> Generate Tiered Policy Responses
                </Button>
            </Card>

            {result && (
                <div className="mt-6 space-y-3 animate-in zoom-in-95 duration-300">
                    <TierCard tier={result.basic.tier} label={result.basic.label} text={result.basic.text} color="slate" />
                    <ElevationMoves moves={result.elevate1} toTier="Band 5–6" />
                    <TierCard tier={result.proficient.tier} label={result.proficient.label} text={result.proficient.text} color="blue" />
                    <ElevationMoves moves={result.elevate2} toTier="Band 7" />
                    <TierCard tier={result.band7.tier} label={result.band7.label} text={result.band7.text} color="emerald" />
                </div>
            )}
            </>)}
        </div>
    );
};

// --- Tab 2: Writing Studio ---
const CaseLibrary = () => {
    const [expanded, setExpanded] = useState(null);
    const [selectedTheory, setSelectedTheory] = useState('Realism');
    const [caseQuery, setCaseQuery] = useState('');
    const [caseResults, setCaseResults] = useState(null);
    const [caseLoading, setCaseLoading] = useState(false);
    const [expandedSearch, setExpandedSearch] = useState(null);
    const [selectedSearchTheory, setSelectedSearchTheory] = useState('Realism');

    // ── Case Finder logic — chain: semantic-search → find-cases → keyword fallback ──
    const findMatchingCases = async () => {
        if (!caseQuery.trim()) return;
        setCaseLoading(true); setCaseResults(null);
        const kwScore = (c, q) => { const ws = q.toLowerCase().split(/\W+/).filter(w => w.length > 3); return ws.reduce((s, w) => s + (c.themes.toLowerCase().includes(w) ? 1 : 0), 0); };
        const angleFor = n => /war|nuclear|military|conflict|territory|south china|korea/i.test(n) ? 'Realism' : /climate|trade|pandemic|brexit|eu|covid/i.test(n) ? 'Liberalism' : 'Constructivism';
        const enrich = (results) => results.map(r => { const m = SHARED_CASE_POOL.find(c => c.name === r.name); return { ...r, concepts: m?.concepts || '', url: m?.url || '' }; });
        // 1. Semantic search (Gemini embeddings)
        try {
            const semRes = await fetch('/.netlify/functions/semantic-search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: caseQuery, topK: 5 }) });
            if (semRes.ok) { const d = await semRes.json(); if (!d.error && d.results?.length) { setCaseResults(enrich(d.results.map((r, i) => ({ rank: i + 1, name: r.name, relevance: `Semantic match (score: ${r.score.toFixed(2)})`, angle: angleFor(r.name) })))); setCaseLoading(false); return; } }
        } catch { }
        // 2. AI case finder (Gemini)
        try {
            const fnRes = await fetch('/.netlify/functions/find-cases', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: caseQuery }) });
            if (fnRes.ok) { const d = await fnRes.json(); if (!d.error) { setCaseResults(enrich(d.results)); setCaseLoading(false); return; } }
        } catch { }
        // 3. Keyword fallback
        const scored = SHARED_CASE_POOL.map(c => ({ ...c, score: kwScore(c, caseQuery) })).sort((a, b) => b.score - a.score);
        const topN = scored.some(c => c.score > 0) ? scored.filter(c => c.score > 0).slice(0, 5) : scored.slice(0, 5);
        const local = topN.map((c, i) => ({ rank: i + 1, name: c.name, concepts: c.concepts, relevance: 'Keyword match. Review for thematic alignment.', angle: angleFor(c.name), url: c.url }));
        setCaseResults(local);
        setCaseLoading(false);
    };

    const cases = GLOBAL_CASES;
    const fiveWHLabels = [
        { key: 'who', label: 'Who', icon: '👤' },
        { key: 'what', label: 'What', icon: '📋' },
        { key: 'where', label: 'Where', icon: '📍' },
        { key: 'when', label: 'When', icon: '🕐' },
        { key: 'why', label: 'Why', icon: '❓' },
        { key: 'how', label: 'How', icon: '⚙️' }
    ];
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-emerald-400">Case Library: The Intersection Series</h3>

            {/* ── Case Finder Search ───────────────────────────────────────── */}
            <div className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl space-y-3">
                <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest">🔍 Find Cases for Your Argument</p>
                <div className="flex gap-2">
                    <input value={caseQuery} onChange={e => setCaseQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && findMatchingCases()}
                        placeholder="Type your thesis or argument..."
                        className="flex-1 bg-glopo-dark border border-white/20 rounded-xl p-2.5 text-sm text-gray-300 outline-none focus:border-violet-500 transition-colors placeholder:text-gray-600" />
                    <button onClick={findMatchingCases} disabled={caseLoading || !caseQuery.trim()}
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white text-xs font-black rounded-xl transition-all shrink-0">
                        {caseLoading ? '...' : 'FIND CASES'}
                    </button>
                </div>
                {caseResults && (
                    <div className="space-y-2 mt-1">
                        <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">{caseResults.length} cases matched — click to expand full evaluation</p>
                        {caseResults.map(r => {
                            const full = GLOBAL_CASES.find(gc => gc.name === r.name);
                            const isOpen = expandedSearch === r.rank;
                            return (
                                <div key={r.rank}
                                    className={`border rounded-xl transition-all cursor-pointer ${isOpen ? 'border-violet-500/50 bg-violet-500/5' : 'border-violet-500/15 bg-white/[0.02] hover:border-violet-500/30'}`}
                                    onClick={() => setExpandedSearch(isOpen ? null : r.rank)}>
                                    {/* Header row */}
                                    <div className="flex items-center gap-3 p-3">
                                        <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-[9px] font-black flex items-center justify-center shrink-0">#{r.rank}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-violet-200 leading-tight">{r.name}</p>
                                            <p className="text-[10px] text-gray-500 mt-0.5">
                                                <span className="text-violet-400 font-bold">Angle: </span>{r.angle}
                                                {r.concepts && <><span className="mx-1 text-gray-700">·</span><span className="text-violet-400 font-bold">Concepts: </span>{r.concepts}</>}
                                            </p>
                                        </div>
                                        <span className="text-gray-600 text-xs shrink-0">{isOpen ? '▲' : '▼'}</span>
                                    </div>

                                    {/* Expanded full evaluation */}
                                    {isOpen && (
                                        <div className="px-4 pb-4 space-y-4" onClick={e => e.stopPropagation()}>
                                            {/* IR Theory Analysis */}
                                            <div className="p-4 bg-glopo-dark/50 border border-white/5 rounded-xl">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h5 className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                                        <Zap size={10} className="text-blue-500" /> Theoretical Analysis (IR Lenses)
                                                    </h5>
                                                    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                                                        {Object.keys(IR_THEORIES).map(t => (
                                                            <button key={t} onClick={() => setSelectedSearchTheory(t)}
                                                                className={`px-2 py-1 rounded text-[9px] font-bold transition-all border whitespace-nowrap ${selectedSearchTheory === t ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-transparent text-gray-600 hover:text-gray-400'}`}
                                                                style={{ borderLeftColor: selectedSearchTheory === t ? IR_THEORIES[t].color : 'transparent', borderLeftWidth: selectedSearchTheory === t ? '3px' : '1px' }}>
                                                                {t}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                {full ? (
                                                    <div>
                                                        <p className="text-[11px] leading-relaxed text-gray-300">
                                                            <span className="font-black mr-2 uppercase tracking-tighter" style={{ color: IR_THEORIES[selectedSearchTheory].color }}>{selectedSearchTheory}:</span>
                                                            {IR_THEORIES[selectedSearchTheory].getInterpretation(full)}
                                                        </p>
                                                        <p className="text-[9px] text-gray-500 mt-2 italic">{IR_THEORIES[selectedSearchTheory].description}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-[11px] text-gray-500 italic">Full theory analysis available when this case is added to the static library. <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-violet-400">Read source →</a></p>
                                                )}
                                            </div>

                                            {/* 5WH + IB Linkage */}
                                            {full?.fiveWH && (
                                                <div className="flex flex-col md:flex-row gap-4">
                                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {fiveWHLabels.map(({ key, label, icon }) => (
                                                            <div key={key} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                                                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">{icon} {label}</p>
                                                                <p className="text-xs text-gray-300 leading-relaxed">{full.fiveWH[key]}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {full?.ibLinkage && (
                                                        <div className="md:w-48 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg shrink-0">
                                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">IB Concept Linkage</p>
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Core Concepts</p>
                                                                    <div className="flex flex-wrap gap-1">{full.ibLinkage.core.map((t, j) => <span key={j} className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">{t}</span>)}</div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Challenges</p>
                                                                    <div className="flex flex-wrap gap-1">{full.ibLinkage.challenge.map((t, j) => <span key={j} className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">{t}</span>)}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* HL Global Challenges */}
                                            {full?.globalChallenges && (
                                                <div className="p-4 bg-amber-900/10 border border-amber-500/20 rounded-xl">
                                                    <h5 className="text-[9px] font-black uppercase tracking-widest text-amber-500/70 mb-3 flex items-center gap-2">
                                                        <AlertTriangle size={10} className="text-amber-500" /> HL Global Challenges Analysis
                                                    </h5>
                                                    <div className="grid gap-3 md:grid-cols-2">
                                                        {Object.entries(full.globalChallenges).map(([ch, an]) => (
                                                            <div key={ch} className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                                                                <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1.5">{ch}</p>
                                                                <p className="text-[11px] text-gray-400 leading-relaxed">{an}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Quick facts fallback + source link */}
                                            {!full?.fiveWH && (
                                                <p className="text-[11px] text-gray-500 italic p-3 bg-white/5 rounded-lg">
                                                    Detailed 5W+H analysis not yet available for this case.
                                                    {r.url && <> <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-violet-400">🔗 Read Source</a></>}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {cases.map((c, i) => (
                    <div key={i} className={`p-4 bg-white/5 border rounded-lg transition-all cursor-pointer ${expanded === i ? 'border-emerald-500/50 md:col-span-2 bg-white/[0.07]' : 'border-white/10 hover:border-emerald-500/30'}`} onClick={() => setExpanded(expanded === i ? null : i)}>
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white leading-tight">{c.name}</h4>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase tracking-tighter">{c.theme}</span>
                                <span className="text-gray-500 text-xs">{expanded === i ? '▲' : '▼'}</span>
                            </div>
                        </div>
                        {expanded !== i && (
                            <ul className="text-xs text-gray-400 list-disc list-inside space-y-1">
                                {c.facts.map((f, j) => <li key={j}>{f}</li>)}
                            </ul>
                        )}
                        {expanded === i && c.fiveWH && (
                            <div className="mt-4 space-y-4 overflow-hidden" onClick={e => e.stopPropagation()}>
                                {/* Theoretical Analysis Overlay */}
                                <div className="p-4 bg-glopo-dark/50 border border-white/5 rounded-xl overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <h5 className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                            <Zap size={10} className="text-blue-500" /> Theoretical Analysis (IR Lenses)
                                        </h5>
                                        <div className="flex gap-1 overflow-x-auto scrollbar-hide" style={{ maskImage: 'linear-gradient(to right, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent)' }}>
                                            {Object.keys(IR_THEORIES).map(theory => (
                                                <button
                                                    key={theory}
                                                    onClick={() => setSelectedTheory(theory)}
                                                    className={`px-2 py-1 rounded text-[9px] font-bold transition-all border whitespace-nowrap ${selectedTheory === theory ? 'bg-white/10 border-white/20 text-white shadow-xl' : 'bg-transparent border-transparent text-gray-600 hover:text-gray-400'}`}
                                                    style={{ borderLeftColor: selectedTheory === theory ? IR_THEORIES[theory].color : 'transparent', borderLeftWidth: selectedTheory === theory ? '3px' : '1px' }}
                                                >
                                                    {theory}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                                        <p className="text-[11px] leading-relaxed text-gray-300 break-words">
                                            <span className="font-black mr-2 uppercase tracking-tighter" style={{ color: IR_THEORIES[selectedTheory].color }}>{selectedTheory}:</span>
                                            {IR_THEORIES[selectedTheory].getInterpretation(c)}
                                        </p>
                                        <p className="text-[9px] text-gray-500 mt-2 italic font-medium">{IR_THEORIES[selectedTheory].description}</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {fiveWHLabels.map(({ key, label, icon }) => (
                                            <div key={key} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">{icon} {label}</p>
                                                <p className="text-xs text-gray-300 leading-relaxed">{c.fiveWH[key]}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="md:w-48 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg shrink-0">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">IB Concept Linkage</p>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Core Concepts</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {c.ibLinkage.core.map((t, j) => <span key={j} className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">{t}</span>)}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Challenges</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {c.ibLinkage.challenge.map((t, j) => <span key={j} className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">{t}</span>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* HL Global Challenges Analysis */}
                                {c.globalChallenges && (
                                    <div className="mt-4 p-4 bg-amber-900/10 border border-amber-500/20 rounded-xl">
                                        <h5 className="text-[9px] font-black uppercase tracking-widest text-amber-500/70 mb-3 flex items-center gap-2">
                                            <AlertTriangle size={10} className="text-amber-500" /> HL Global Challenges Analysis
                                        </h5>
                                        <div className="grid gap-3 md:grid-cols-2 min-w-0">
                                            {Object.entries(c.globalChallenges).map(([challenge, analysis]) => (
                                                <div key={challenge} className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg hover:border-amber-500/30 transition-colors min-w-0">
                                                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1.5">{challenge}</p>
                                                    <p className="text-[11px] text-gray-400 leading-relaxed break-words">{analysis}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {expanded === i && !c.fiveWH && (
                            <div className="mt-4 p-4 bg-white/5 border border-dashed border-white/20 rounded-lg text-center" onClick={e => e.stopPropagation()}>
                                <p className="text-xs text-gray-500 italic">5Ws + H Analysis coming soon for this case study.</p>
                                <ul className="text-xs text-gray-400 list-disc list-inside space-y-1 mt-3 text-left">
                                    {c.facts.map((f, j) => <li key={j}>{f}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
const WritingStudio = () => {
    const [subTab, setSubTab] = useState('bank');

    // --- Sub-Tab components ---

    const QuestionBank = () => {
        const [filter, setFilter] = useState('All');
        const questions = GLOBAL_QUESTIONS;

        const filtered = filter === 'All' ? questions : questions.filter(q => q.theme === filter);

        return (
            <div className="space-y-4">
                <div className="mb-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[10px] text-emerald-300 italic">
                    Note: Original mock simulation by Project Lead (IB Global Politics).
                </div>
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <h3 className="text-lg font-bold text-emerald-400">Paper 2 Question Bank</h3>
                    <div className="flex gap-2 text-[10px]">
                        {['All', 'Power', 'Human Rights', 'Development', 'Peace'].map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-2 py-1 rounded border transition-all ${filter === f ? "bg-emerald-500 border-emerald-500 text-white" : "border-white/10 text-gray-400 hover:border-white/30"}`}>{f}</button>
                        ))}
                    </div>
                </div>
                <div className="grid gap-3">
                    {filtered.map((q, i) => (
                        <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-emerald-500/50 transition-colors group">
                            <div className="flex justify-end items-start mb-1">
                                <span className="text-[10px] bg-white/10 text-gray-400 px-1.5 py-0.5 rounded uppercase">{q.theme}</span>
                            </div>
                            <p className="text-gray-200 group-hover:text-white text-sm">"{q.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const DebateLab = () => {
        const [selectedQ, setSelectedQ] = useState(null);
        const [thesis, setThesis] = useState('');
        const [showDebate, setShowDebate] = useState(false);

        const debates = [
            {
                id: 1,
                question: "To what extent can international law be enforced effectively in an anarchic global system?",
                paths: [
                    { label: "Realist", text: "International law is secondary to national interest; it is only followed when it serves the power of the state." },
                    { label: "Institutionalist", text: "Law provides the framework for soft power; and acts as a leveling tool for smaller states against giants." },
                    { label: "Constructivist", text: "Effectiveness is based on changing norms; what counts as 'permissible' is constantly being socially reconstructed." }
                ]
            },
            {
                id: 2,
                question: "Effective enforcement of Human Rights undermines state sovereignty. Discuss.",
                paths: [
                    { label: "Statist", text: "State sovereignty is the ultimate shield; R2P is often a trojan horse for western interventionism." },
                    { label: "Cosmopolitan", text: "Individual rights transcend borders; sovereignty is conditional upon the protection of the populace." },
                    { label: "Relativist", text: "HR frameworks are culturally specific; universal enforcement ignores legitimate local identity and law." }
                ]
            },
            {
                id: 3,
                question: "To what extent is economic globalization a threat to state sovereignty?",
                paths: [
                    { label: "Hyperglobalist", text: "The state is becoming a hollow shell as global markets and TNCs dictate domestic policy and economic choice." },
                    { label: "Skeptic", text: "States remain the primary architects of globalization; they choose to open markets to enhance their own national power." },
                    { label: "Transformationalist", text: "Sovereignty isn't disappearing, but shifting; states are now 'competition states' adapting to a networked world." }
                ]
            },
            {
                id: 4,
                question: "Should the international community intervene militarily in sovereign states to prevent human rights atrocities?",
                paths: [
                    { label: "Realist", text: "Intervention is often a cloak for hegemony; states only intervene when it serves their strategic geopolitical interests." },
                    { label: "Liberal", text: "The doctrine of 'Responsibility to Protect' (R2P) creates a moral and legal duty to safeguard human dignity beyond borders." },
                    { label: "Constructivist", text: "The definition of 'humanitarian' is socially constructed and evolves; today's intervention is yesterday's colonialism." }
                ]
            },
            {
                id: 5,
                question: "Is international cooperation the most effective way to combat climate change?",
                paths: [
                    { label: "Institutionalist", text: "Global regimes like the Paris Agreement create the necessary transparency and peer pressure for collective action." },
                    { label: "Realist", text: "Climate change is a tragedy of the commons; states will prioritize their own industrial growth over global carbon targets." },
                    { label: "Critical", text: "Current cooperation models favor the Global North; true solutions require dismantling the extractive capitalist system." }
                ]
            },
            {
                id: 6,
                question: "Does the rise of China fundamentally challenge the US-led liberal international order?",
                paths: [
                    { label: "Power Transition", text: "A rising challenger naturally creates instability; the 'Thucydides Trap' makes conflict or radical shift likely." },
                    { label: "Integrationist", text: "China is too deeply embedded in global institutions and trade to destroy the system that facilitated its own rise." },
                    { label: "Civilizational", text: "China offers a 'Beijing Consensus'—authoritarian development as an alternative to the Western democratic model." }
                ]
            },
            {
                id: 7,
                question: "Evaluate the claim that non-state actors (NGOs, TNCs) are becoming as powerful as states.",
                paths: [
                    { label: "Pluralist", text: "Power is diffused; TNCs control wealth and NGOs shape norms, often bypassing state authority entirely." },
                    { label: "Statist", text: "States still hold the monopoly on legitimate violence and law-making; non-state actors only operate within state-granted space." },
                    { label: "Network", text: "Power is now 'relational'; it's not who is stronger, but who is best connected in the global technological web." }
                ]
            },
            {
                id: 8,
                question: "To what extent can peace be achieved solely through the balance of power?",
                paths: [
                    { label: "Realist", text: "Deterrence is the only check on aggression; a balance of power ensures that no state finds war profitable." },
                    { label: "Liberal", text: "A balance of power is a 'cold peace'; lasting peace requires democratic values, trade, and shared institutions." },
                    { label: "Critical", text: "Balance of power ignores structural violence; it maintains an unjust status quo for those at the top." }
                ]
            },
            {
                id: 9,
                question: "Is development better achieved through top-down or bottom-up approaches?",
                paths: [
                    { label: "Neoliberal", text: "Top-down institutional reform and FDI are essential to create the infrastructure and stability for growth." },
                    { label: "Human-Centric", text: "Development must be bottom-up; empowering local communities ensures sustainability and respects human rights." },
                    { label: "Dependency", text: "Neither works if the core-periphery structure remains; development requires a total break from global exploitation." }
                ]
            },
            {
                id: 10,
                question: "Does the rise of cyber warfare necessitate a fundamental change in the concept of security?",
                paths: [
                    { label: "Traditionalist", text: "Cyber is just a new tool for the same old power politics; states still prioritize physical territory and military might." },
                    { label: "Cyber-Revolutionist", text: "The 'borderless' nature of cyber-attacks makes traditional geographic defense and Westphalian sovereignty obsolete." },
                    { label: "Constructivist", text: "Security is what we define it as; 'securitizing' the internet allows states to expand surveillance and control." }
                ]
            },
            {
                id: 11,
                question: "Are universal human rights a form of Western cultural imperialism?",
                paths: [
                    { label: "Universalist", text: "Human dignity is inherent to all people; rights are not 'Western' but a shared shield against all forms of tyranny." },
                    { label: "Cultural Relativist", text: "Rights are historically and culturally situated; imposing one model ignores valid local traditions and social values." },
                    { label: "Post-Colonial", text: "The 'Universal' label masks the continued dominance of Western norms over the lived experiences of the Global South." }
                ]
            },
            {
                id: 12,
                question: "Is the nation-state still the most important actor in global politics?",
                paths: [
                    { label: "Realist", text: "Absolutely; only states have the legitimacy and military force to protect citizens and maintain global order." },
                    { label: "Globalist", text: "No; global issues like climate and finance require global solutions that states are increasingly unable to provide." },
                    { label: "Constructivist", text: "The state is a powerful 'imagined community', but its importance depends on whether people continue to believe in it." }
                ]
            },
            {
                id: 13,
                question: "Does increased interconnectedness reduce the likelihood of armed conflict between states?",
                paths: [
                    { label: "Liberal", text: "Economic interdependence makes war 'mutually assured destruction' for economies; trade promotes peace." },
                    { label: "Realist", text: "Dependence creates vulnerability; states may go to war to secure critical resources they no longer control at home." },
                    { label: "Constructivist", text: "Interconnectedness can breed 'clash of identities' or 'shared global identity'; it's the quality of interaction that matters." }
                ]
            },
            {
                id: 14,
                question: "Should democratic transition be a goal of international development aid?",
                paths: [
                    { label: "Liberal", text: "Democracy is the ultimate engine of development; it provides the accountability and law needed for long-term growth." },
                    { label: "Realist", text: "Stability is more important than democracy; forcing transitions often leads to failed states and regional chaos." },
                    { label: "Critical", text: "Development aid is often used as a tool for 'liberal interventionism' to ensure countries follow Western economic models." }
                ]
            },
            {
                id: 15,
                question: "Is the United Nations still relevant in a multi-polar world?",
                paths: [
                    { label: "Institutionalist", text: "The UN remains the only platform for universal legitimacy and the coordination of responses to global crises." },
                    { label: "Realist", text: "The UN is crippled by the P5 veto; it only functions when great powers agree, making it ineffective in true crises." },
                    { label: "Constructivist", text: "The UN's power is normative; it defines what is 'legal' and 'legitimate' even if it cannot always enforce its will." }
                ]
            }
        ];

        return (
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-emerald-400">Debate Lab: Multi-Perspective Analysis</h3>
                {!showDebate ? (
                    <div className="space-y-4">
                        <p className="text-xs text-gray-400">Select a prompt and input your claim to see opposing analytical paths.</p>
                        <select
                            onChange={(e) => setSelectedQ(debates.find(d => d.id === parseInt(e.target.value)))}
                            className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 text-sm"
                        >
                            <option value="">-- Choose a Debate Prompt --</option>
                            {debates.map(d => <option key={d.id} value={d.id}>{d.question}</option>)}
                        </select>
                        {selectedQ && (
                            <textarea
                                className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 h-24 text-sm"
                                placeholder="Input your thesis or main claim here..."
                                onChange={(e) => setThesis(e.target.value)}
                            />
                        )}
                        <Button disabled={!selectedQ || !thesis} onClick={() => setShowDebate(true)}>Reveal Counter-Perspectives</Button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        <div className="p-4 bg-white/5 border-l-4 border-emerald-500 rounded-r-lg">
                            <span className="text-[10px] font-bold text-emerald-500 uppercase block mb-1">Your Claim</span>
                            <p className="text-sm italic text-gray-300">"{thesis}"</p>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-6 mb-2">Myriad Perspectives to Consider:</h4>
                        <div className="grid gap-3">
                            {selectedQ.paths.map((p, i) => (
                                <div key={i} className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl">
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">{p.label} Perspective</span>
                                    <p className="text-xs text-gray-400 leading-relaxed">{p.text}</p>
                                </div>
                            ))}
                        </div>

                        {/* Band tier: how to USE perspectives in writing */}
                        <div className="border-t border-white/10 pt-4 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">🎯 How to use these perspectives in your writing</p>
                            <div className="border border-slate-500/30 bg-slate-900/30 rounded-xl p-4">
                                <span className="text-xs font-bold bg-slate-700 text-slate-200 px-2 py-0.5 rounded mr-2">Band 3–4</span>
                                <span className="text-xs text-slate-400 italic">Names a perspective — no causal logic.</span>
                                <p className="text-gray-300 text-xs leading-relaxed mt-2">&ldquo;Realists would say states act in self-interest. This explains why this issue is hard to solve.&rdquo;</p>
                            </div>
                            <div className="border border-amber-500/20 bg-amber-950/20 rounded-xl px-4 py-3">
                                <p className="text-amber-400 text-xs font-bold mb-2">🔼 MOVES THAT ELEVATE TO BAND 5–6</p>
                                <ul className="space-y-1">
                                    {['Apply the theory — explain what it predicts, not just what it is', 'Use the theoretical lens to analyse your specific case', 'Add "therefore" or "this demonstrates" to connect theory to your argument'].map((m, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-amber-200/80"><span className="text-amber-500 shrink-0">→</span><span>{m}</span></li>
                                    ))}
                                </ul>
                            </div>
                            <div className="border border-blue-500/30 bg-blue-900/20 rounded-xl p-4">
                                <span className="text-xs font-bold bg-blue-800 text-blue-200 px-2 py-0.5 rounded mr-2">Band 5–6</span>
                                <span className="text-xs text-blue-400 italic">Applied theory with analytical connective.</span>
                                <p className="text-gray-300 text-xs leading-relaxed mt-2">&ldquo;From a Realist perspective, states prioritise survival over cooperation; therefore, the failure to resolve this issue demonstrates that power maximisation consistently overrides normative obligations in the international system.&rdquo;</p>
                            </div>
                            <div className="border border-amber-500/20 bg-amber-950/20 rounded-xl px-4 py-3">
                                <p className="text-amber-400 text-xs font-bold mb-2">🔼 MOVES THAT ELEVATE TO BAND 7</p>
                                <ul className="space-y-1">
                                    {['Counter the first perspective with a second theoretical lens', 'Evaluate which perspective is more persuasive and why', 'Hedge: "while X… Y is contingent on…" to show scholarly nuance'].map((m, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-amber-200/80"><span className="text-amber-500 shrink-0">→</span><span>{m}</span></li>
                                    ))}
                                </ul>
                            </div>
                            <div className="border border-emerald-500/30 bg-emerald-900/20 rounded-xl p-4">
                                <span className="text-xs font-bold bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded mr-2">Band 7</span>
                                <span className="text-xs text-emerald-400 italic">Multi-theory evaluation with hedged judgement.</span>
                                <p className="text-gray-300 text-xs leading-relaxed mt-2">&ldquo;While the Realist framework persuasively accounts for the persistence of this tension through its emphasis on power maximisation and survival, a Constructivist rejoinder holds that state behaviour is equally shaped by evolving norms and identity — suggesting that, ultimately, the resolution of this issue depends not solely on material interests, but on whether a shared normative framework can be institutionalised.&rdquo;</p>
                            </div>
                        </div>

                        <Button variant="outline" onClick={() => { setShowDebate(false); setThesis(''); }}>Try different Prompt</Button>
                    </div>
                )}
            </div>
        );
    };

    const IntroWizard = () => {
        const [step, setStep] = useState(1);
        const [data, setData] = useState({ concept: '', definition: '', caseA: '', caseB: '', thesis: '' });
        const [generatedIntro, setGeneratedIntro] = useState('');
        const [introLoading, setIntroLoading] = useState(false);
        const [introError, setIntroError] = useState('');
        const [introReview, setIntroReview] = useState(null);
        const [introReviewLoading, setIntroReviewLoading] = useState(false);
        const [studentIntro, setStudentIntro] = useState('');
        const [introReviewError, setIntroReviewError] = useState('');
        const updateData = (key, val) => setData({ ...data, [key]: val });

        const generateIntro = async () => {
            setStep(3);
            setIntroLoading(true);
            setIntroError('');
            setGeneratedIntro('');

            let introText = '';

            // Strategy 1: Netlify serverless function
            try {
                const response = await fetch("/.netlify/functions/generate-intro", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                    signal: AbortSignal.timeout(25000)
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result.intro) introText = result.intro;
                } else if (response.status === 429) {
                    await new Promise(r => setTimeout(r, 3000));
                    const retry = await fetch("/.netlify/functions/generate-intro", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                        signal: AbortSignal.timeout(25000)
                    });
                    if (retry.ok) {
                        const result = await retry.json();
                        if (result.intro) introText = result.intro;
                    }
                }
            } catch (e) {
                console.log("Netlify function unavailable, trying direct API...");
            }

            // Strategy 2: Direct Gemini API call (localhost or production fallback via get-token)
            if (!introText) {
                let apiKey = process.env.REACT_APP_GEMINI_API_KEY;
                if (!apiKey) {
                    try {
                        const tkRes = await fetch('/.netlify/functions/get-token', { signal: AbortSignal.timeout(5000) });
                        if (tkRes.ok) { const tkData = await tkRes.json(); apiKey = tkData.key; }
                    } catch { }
                }
                if (!apiKey) {
                    setIntroLoading(false);
                    setIntroError("AI not configured. Please contact your teacher.");
                    return;
                }
                try {
                    const IB_AO_CONTEXT = `IB GLOBAL POLITICS 2026 SYLLABUS CONTEXT:
- AO1 (Knowledge & Understanding): Student must demonstrate accurate knowledge of named case studies and IB key concepts. Score improves with specific dates, treaty names, statistics, and named actors.
- AO2 (Application & Analysis): Student must apply a named IR theory (Realism, Liberalism, Constructivism, Feminism, Marxism, Postcolonialism) with analytical connectives ("therefore", "this demonstrates").
- AO3 (Synthesis & Evaluation): Student must present a counter-argument, synthesise competing perspectives, and reach a substantiated evaluative judgement.
- AO4 (Use of Key Concepts): Student must use and define IB concepts — 4 Core (Power, Sovereignty, Legitimacy, Interdependence) and Global Challenges (Security, Development, Environment, Equality, Health). Concepts must be used precisely, not decoratively.
- PAPERS: Paper 2 requires one extended essay (1,200–2,000 words) using two case studies to explore an IB concept. The introduction must anchor the thesis in a specific IB concept and signal the case study scope.`;

                    const prompt = `You are a senior IB Global Politics examiner writing a model introduction for a Band 7 Paper 2 essay.

${IB_AO_CONTEXT}

Student Inputs:
KEY CONCEPT: ${data.concept}
STUDENT'S DEFINITION: ${data.definition}
CASE STUDY A: ${data.caseA}
CASE STUDY B: ${data.caseB}
STUDENT'S THESIS: ${data.thesis}

REQUIREMENTS (all must be met for a Band 7 introduction):
1. Open with a real-world hook SPECIFIC to "${data.concept}" — name a concrete current tension, paradox, or event that reveals why this concept matters now.
2. Weave in the student's definition naturally — it should read as analysis, not a dictionary entry.
3. Identify the central analytical tension specific to "${data.concept}" (e.g., for Sovereignty: state authority vs. global governance; for Development: GDP growth vs. human development; for Peace: negative peace vs. positive peace / structural violence). Do NOT default to a generic "globalist vs. statist" framing.
4. Introduce BOTH case studies with a brief clause explaining why each illuminates "${data.concept}" differently.
5. Build to the thesis as the essay's governing claim — it should feel earned, not dropped in.
6. Close with a one-sentence roadmap signalling structure.

OUTPUT: Write ONLY the introduction paragraph (80–120 words, formal academic register). No headers, no bullet points, no meta-commentary.`;

                    const geminiResponse = await geminiRetryFetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                        }
                    );

                    if (geminiResponse.ok) {
                        const geminiData = await geminiResponse.json();
                        introText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    }
                } catch (error) {
                    console.error("Direct Gemini API Error:", error);
                }
            }

            setIntroLoading(false);
            if (introText) {
                setGeneratedIntro(introText.trim());
            } else {
                setIntroError("Could not generate introduction. Please try again in a moment.");
            }
        };

        const reviewMyIntro = async () => {
            if (!studentIntro.trim() || studentIntro.trim().length < 30) return;
            setIntroReviewLoading(true); setIntroReview(null); setIntroReviewError('');
            try {
                const introPrompt = `You are an IB Global Politics examiner (2026 syllabus). Review this student introduction paragraph and return ONLY valid JSON with this exact structure:
{"score":"Band 1-7","bandJump":"Band X \u2192 Band Y","strengths":["specific strength 1","strength 2"],"improved":"your improved version of the intro (80-120 words, preserve student voice)","changes":[{"ao":"AO1","label":"Hook Specificity","original":"exact phrase being changed","fix":"what was improved and why this raises the band"}]}

IB CRITERIA for changes: hook specificity (AO1), concept definition quality (AO1), analytical tension setup (AO2), case study integration (AO2), thesis strength (AO3), roadmap clarity (AO3). Label each change with the relevant AO.

Student introduction:
${studentIntro}

Return ONLY the JSON. No markdown, no backticks, no commentary.`;

                const isLocalDev = window.location.hostname === 'localhost';
                let clientKey = process.env.REACT_APP_GEMINI_API_KEY;
                if (!clientKey && !isLocalDev) {
                    try {
                        const tkRes = await fetch('/.netlify/functions/get-token', { signal: AbortSignal.timeout(5000) });
                        if (tkRes.ok) { const tkData = await tkRes.json(); clientKey = tkData.key; }
                    } catch { }
                }
                let d = null;

                if (!isLocalDev) {
                    // Production: try Netlify function first
                    const res = await fetch('/.netlify/functions/peel-review', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ paragraph: studentIntro, customPrompt: introPrompt, mode: 'intro' }),
                        signal: AbortSignal.timeout(25000)
                    });
                    if (res.ok) d = await res.json();
                }

                if (!d && clientKey) {
                    // Local dev OR Netlify function failed: call Gemini directly
                    const resp = await geminiRetryFetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${clientKey}`,
                        {
                            method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: [{ parts: [{ text: introPrompt }] }],
                                generationConfig: { response_mime_type: 'application/json' }
                            })
                        }
                    );
                    if (resp.ok) {
                        const gData = await resp.json();
                        const raw = gData?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
                        d = JSON.parse(raw);
                    } else throw new Error(`Gemini error ${resp.status}`);
                } else if (!d) {
                    throw new Error('No API key available locally');
                }

                if (d?.rewritten || d?.score) {
                    setIntroReview(d);
                } else if (d?.improved) {
                    setIntroReview({ improved: d.improved, changes: d.changes || [], bandJump: d.bandJump || '' });
                }
            } catch (e) {
                setIntroReviewError('Could not review. Try again in a moment.');
            }
            setIntroReviewLoading(false);
        };

        const resetWizard = () => {
            setStep(1);
            setData({ concept: '', definition: '', caseA: '', caseB: '', thesis: '' });
            setGeneratedIntro('');
            setIntroError('');
        };

        if (step === 3) return (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
                {introLoading ? (
                    <div className="bg-emerald-900/20 border border-emerald-500/30 p-8 rounded-xl text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            <div className="text-sm text-emerald-300 font-bold animate-pulse">Crafting your personalised introduction...</div>
                            <p className="text-[10px] text-gray-500 max-w-sm">Gemini is analysing your concept, definition, case studies, and thesis to build a unique Golden Thread introduction.</p>
                        </div>
                    </div>
                ) : introError ? (
                    <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-xl">
                        <p className="text-sm text-red-300 flex items-center gap-2"><AlertTriangle size={16} /> {introError}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-xl leading-relaxed text-gray-300">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-3 flex items-center gap-2">
                                <span className="text-xs font-bold bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded mr-1">Band 7</span> AI-Generated Model Introduction
                            </span>
                            <p className="text-sm">{generatedIntro}</p>
                        </div>
                        <div className="border border-amber-500/20 bg-amber-950/20 rounded-xl px-4 py-3">
                            <p className="text-amber-400 text-xs font-bold mb-2">🔼 WHAT MAKES THIS BAND 7</p>
                            <ul className="space-y-1">
                                {[
                                    'Opens with a real-world hook specific to the concept — not a generic statement',
                                    'Weaves the student definition into analysis, not as a standalone sentence',
                                    'Identifies the central conceptual tension (not just "for" vs. "against")',
                                    'Introduces BOTH case studies with a brief analytical clause explaining their relevance',
                                    'Thesis is earned — it feels like a conclusion from the preceding analysis',
                                    'Closes with a one-sentence roadmap signalling structure and evaluative scope',
                                ].map((m, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-amber-200/80"><span className="text-amber-500 shrink-0">→</span><span>{m}</span></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {!introLoading && (
                    <>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={resetWizard}><RefreshCw size={16} /> Start Over</Button>
                            {generatedIntro && <Button variant="outline" onClick={generateIntro}><Zap size={16} /> Regenerate</Button>}
                        </div>

                        {/* Components of a Strong Thesis */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 space-y-3">
                            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle size={14} /> Components of a Strong Thesis
                            </h4>
                            <p className="text-[11px] text-gray-500 italic">A high-scoring thesis in IB Global Politics should include all of the following:</p>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {[
                                    { icon: '🎯', title: 'Arguable Claim', desc: 'Takes a clear position that can be debated — not a statement of fact.' },
                                    { icon: '🧠', title: 'Reasoning / "Because"', desc: 'Explains WHY the claim is true — signals the analytical direction.' },
                                    { icon: '🌍', title: 'Case Study Scope', desc: 'Grounds the argument in specific examples that will be analysed in the essay.' },
                                    { icon: '🔗', title: 'Conceptual Anchoring', desc: 'Links the claim to IB key concepts (e.g., Power, Sovereignty, Legitimacy).' },
                                    { icon: '⚖️', title: 'Tension / Nuance', desc: 'Acknowledges competing perspectives or a counter-argument to address.' },
                                    { icon: '🧭', title: 'Essay Roadmap', desc: 'Implicitly or explicitly signals the structure and direction of the essay.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3 p-3 bg-white/[0.03] rounded-lg border border-white/5 hover:border-emerald-500/20 transition-colors">
                                        <span className="text-lg shrink-0">{item.icon}</span>
                                        <div>
                                            <p className="text-xs font-bold text-white">{item.title}</p>
                                            <p className="text-[10px] text-gray-400 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        );

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-6 gap-4">
                    <h3 className="text-lg font-bold text-emerald-400">Golden Thread Intro Builder</h3>
                    <span className="text-xs text-gray-500">Step {step} of 2</span>
                </div>
                {step === 1 ? (
                    <div className="space-y-4">
                        <input className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3" placeholder="Key Concept (e.g., Legitimacy)" onChange={(e) => updateData('concept', e.target.value)} value={data.concept} />
                        <textarea className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 h-24" placeholder="Your definition of this concept..." onChange={(e) => updateData('definition', e.target.value)} value={data.definition} />
                        <Button onClick={() => setStep(2)} disabled={!data.concept.trim() || !data.definition.trim()}>Next <ChevronRight size={18} /></Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <input className="flex-1 bg-glopo-dark border border-glopo-border rounded-lg p-3" placeholder="Case Study A (e.g., South China Sea)" onChange={(e) => updateData('caseA', e.target.value)} value={data.caseA} />
                            <input className="flex-1 bg-glopo-dark border border-glopo-border rounded-lg p-3" placeholder="Case Study B (e.g., EU Governance)" onChange={(e) => updateData('caseB', e.target.value)} value={data.caseB} />
                        </div>
                        <textarea className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 h-24" placeholder="Your thesis — the central claim your essay will argue..." onChange={(e) => updateData('thesis', e.target.value)} value={data.thesis} />
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                            <Button onClick={generateIntro} disabled={!data.caseA.trim() || !data.caseB.trim() || !data.thesis.trim()}>
                                <Zap size={16} /> Generate Intro
                            </Button>
                        </div>
                    </div>
                )}

                {/* ── Review My Own Intro ─────────────────────────── */}
                <div className="mt-6 border-t border-white/10 pt-5 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">✏️ Review My Own Introduction</p>
                    <p className="text-[10px] text-gray-500">Paste your intro paragraph and get IB examiner feedback + a Band 7 rewrite.</p>
                    <textarea
                        className="w-full bg-glopo-dark border border-white/20 rounded-xl p-4 text-xs text-gray-300 h-36 focus:border-purple-500 outline-none transition-all placeholder:text-gray-600 resize-y"
                        placeholder="Paste your introduction paragraph here..."
                        value={studentIntro}
                        onChange={e => { setStudentIntro(e.target.value); setIntroReview(null); setIntroReviewError(''); }}
                    />
                    <Button onClick={reviewMyIntro} disabled={introReviewLoading || studentIntro.trim().length < 30} className="bg-purple-700 hover:bg-purple-600 text-white">
                        {introReviewLoading ? '⟳ Coaching...' : '✏️ Coach My Writing'}
                    </Button>
                    {introReviewError && <p className="text-red-400 text-xs mt-1">{introReviewError}</p>}
                    {introReview && (
                        <div className="space-y-4 mt-3 animate-in fade-in duration-300">
                            {/* Score + Band Jump */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {introReview.score && <span className="text-[9px] font-black bg-purple-800/50 text-purple-200 px-2 py-0.5 rounded">{introReview.score}</span>}
                                {introReview.bandJump && <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">{introReview.bandJump}</span>}
                            </div>
                            {/* Strengths */}
                            {introReview.strengths?.length > 0 && (
                                <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-1.5">✅ Strengths</p>
                                    {introReview.strengths.map((s, i) => <p key={i} className="text-xs text-gray-300 mb-0.5">• {s}</p>)}
                                </div>
                            )}
                            {/* Original paragraph */}
                            <div className="p-4 bg-white/3 border border-white/10 rounded-xl">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2">📄 Your Original</p>
                                <p className="text-sm text-gray-400 leading-relaxed italic">{studentIntro}</p>
                            </div>
                            {/* Improved version */}
                            {(introReview.improved || introReview.rewritten) && (
                                <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-2">✨ Improved Version</p>
                                    <p className="text-sm text-gray-200 leading-relaxed">{introReview.improved || introReview.rewritten}</p>
                                </div>
                            )}
                            {/* Changes Made — AO-labelled (new schema) */}
                            {introReview.changes?.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">📝 Changes Made</p>
                                    {introReview.changes.map((c, i) => {
                                        const aoColor = c.ao === 'AO1' ? '#3399ff' : c.ao === 'AO2' ? '#00cc77' : c.ao === 'AO3' ? '#ff9900' : '#cc44ff';
                                        const aoBg = c.ao === 'AO1' ? '#3399ff22' : c.ao === 'AO2' ? '#00cc7722' : c.ao === 'AO3' ? '#ff990022' : '#cc44ff22';
                                        return (
                                            <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[9px] font-black px-2 py-0.5 rounded" style={{ background: aoBg, color: aoColor }}>{c.ao}</span>
                                                    <span className="text-xs font-bold text-gray-300">{c.label}</span>
                                                </div>
                                                {c.original && <p className="text-[10px] text-gray-600 italic mb-1 line-through">❝ {c.original}</p>}
                                                <p className="text-[11px] text-gray-300 leading-relaxed">→ {c.fix}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            {/* Improvements — backward compat with old schema */}
                            {!introReview.changes?.length && introReview.improvements?.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">⬆️ Improvements</p>
                                    {introReview.improvements.map((imp, i) => (
                                        <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-lg border-l-2 border-l-amber-500/40">
                                            <p className="text-xs text-amber-200 font-semibold">{imp.issue}</p>
                                            <p className="text-[10px] text-gray-400">{imp.fix}</p>
                                            {imp.example && <p className="text-[10px] text-emerald-300 italic mt-0.5">e.g. "{imp.example}"</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };


    const PeelLab = () => {
        const [data, setData] = useState({ point: '', evidence: '', explanation: '', link: '' });
        const updateData = (key, val) => setData({ ...data, [key]: val });
        const [showResult, setShowResult] = useState(false);
        const [reviewPara, setReviewPara] = useState('');
        const [reviewResult, setReviewResult] = useState(null);
        const [reviewLoading, setReviewLoading] = useState(false);
        const [reviewError, setReviewError] = useState(null);
        const [grammarIssues, setGrammarIssues] = useState(null);
        const [grammarLoading, setGrammarLoading] = useState(false);
        const [isSpeaking, setIsSpeaking] = useState(false);

        const getPeelFeedback = async () => {
            if (!reviewPara.trim()) return;
            setReviewLoading(true); setReviewResult(null); setReviewError(null);

            // Strategy 1: Netlify function — skipped on localhost
            const isLocalDev = window.location.hostname === 'localhost';
            if (!isLocalDev) try {
                const res = await fetch('/.netlify/functions/peel-review', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paragraph: reviewPara }),
                    signal: AbortSignal.timeout(25000)
                });
                if (res.ok) {
                    const d = await res.json();
                    if (!d.error) { setReviewResult(d); setReviewLoading(false); return; }
                }
            } catch (e) {
                console.log('Netlify peel-review unavailable, trying direct API...');
            }

            // Strategy 2: Direct Gemini API call (local or production fallback via get-token)
            let apiKey = process.env.REACT_APP_GEMINI_API_KEY;
            if (!apiKey) {
                try {
                    const tkRes = await fetch('/.netlify/functions/get-token', { signal: AbortSignal.timeout(5000) });
                    if (tkRes.ok) { const tkData = await tkRes.json(); apiKey = tkData.key; }
                } catch { }
            }
            if (!apiKey) {
                setReviewError('AI feedback not available. Please contact your teacher.');
                setReviewLoading(false); return;
            }
            try {
                const prompt = `You are an IB Global Politics examiner. Review this PEEL paragraph and return ONLY valid JSON with this exact structure:
{"original":"<the paragraph as written>","improved":"<your improved version>","bandJump":"Band X → Band Y","changes":[{"ao":"AO1|AO2|AO3|AO4","label":"short label","original":"phrase replaced","fix":"explanation of change"}]}

PEEL paragraph to review:
${reviewPara}

Return ONLY the JSON with no markdown, no backticks, no commentary.`;

                const resp = await geminiRetryFetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
                    {
                        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: { response_mime_type: 'application/json' }
                        })
                    }
                );
                if (resp.ok) {
                    const gData = await resp.json();
                    const raw = gData?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
                    setReviewResult(JSON.parse(raw)); // JSON mode guarantees valid JSON
                } else { throw new Error(`Gemini error ${resp.status}`); }
            } catch (e) {
                setReviewError(`AI feedback requires running via Netlify Dev (npx netlify dev) — direct API calls are geo-restricted on this network. ${e.message}`);
            }
            setReviewLoading(false);
        };

        const runGrammarCheck = async () => {
            if (!reviewPara.trim() || reviewPara.trim().length < 20) return;
            setGrammarLoading(true); setGrammarIssues(null);
            try {
                const res = await fetch('/.netlify/functions/grammar-check', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: reviewPara })
                });
                if (!res.ok) throw new Error(`Grammar check error ${res.status}`);
                const d = await res.json();
                setGrammarIssues(d.issues || []);
            } catch {
                setGrammarIssues([]); // Show empty panel rather than leaving spinner
            }
            setGrammarLoading(false);
        };

        // Cancel TTS if component unmounts while speaking
        React.useEffect(() => {
            return () => { window.speechSynthesis?.cancel(); };
        }, []);

        const speakText = (text) => {
            if (!('speechSynthesis' in window)) return;
            window.speechSynthesis.cancel();
            const plain = text.replace(/#{1,6}\s/g, '').replace(/[*_`]/g, '');
            const utt = new SpeechSynthesisUtterance(plain);
            utt.lang = 'en-GB'; utt.rate = 0.92;
            utt.onend = () => setIsSpeaking(false);
            utt.onerror = () => setIsSpeaking(false);
            setIsSpeaking(true);
            window.speechSynthesis.speak(utt);
        };

        const stopSpeaking = () => { window.speechSynthesis.cancel(); setIsSpeaking(false); };


        // Inline Argument Strength dims (embedded — no separate tab needed)
        const argDims = [
            {
                id: 'claim', label: 'Claim Clarity', color: '#3399ff',
                score: t => /^(the|this|it can be argued|states|by|in|a|while)/i.test(t.trim()) ? 3 : t.trim().length > 20 ? 2 : 1,
                note: t => /^(the|this|it can be argued|states|by|in|a|while)/i.test(t.trim())
                    ? 'AO2 ✓ — Strong opening claim with clear analytical direction.'
                    : 'Sharpen your point sentence — start with a claim, not background.'
            },
            {
                id: 'evidence', label: 'Evidence Specificity', color: '#00cc77',
                score: t => /\d{4}|\b(un\b|nato|eu\b|wto|icj|bri|cop|g20|imf|icc|asean)/i.test(t) ? 3 : /said|according|reported|stated/i.test(t) ? 2 : 1,
                note: t => /\d{4}|\b(un\b|nato|eu\b|wto|icj|bri|cop|g20|imf|icc|asean)/i.test(t)
                    ? 'AO1 ✓ — Specific institution/date cited.'
                    : 'Add a year, institution, or named actor to reach AO1 Band 3.'
            },
            {
                id: 'theory', label: 'Theory Link', color: '#cc44ff',
                score: t => /realis[mt]|liberalis[mt]|constructivis[mt]|marxis[mt]|feminis[mt]|postcolonial|structuralis[mt]|critical theory/i.test(t) ? 3 : 1,
                note: t => /realis[mt]|liberalis[mt]|constructivis[mt]|marxis[mt]|feminis[mt]|postcolonial|structuralis[mt]|critical theory/i.test(t)
                    ? 'AO2 ✓ — IR theory applied.'
                    : 'Name a theory (Realism, Liberalism, Constructivism, Feminism…) to reach AO2 Band 3.'
            },
            {
                id: 'evaluation', label: 'Evaluative Link', color: '#ff9900',
                score: t => /therefore|consequently|this (demonstrates|reveals|suggests|illustrates)|thus|as a result|which means|this explains/i.test(t) ? 3
                    : /because|since|as/i.test(t) ? 2 : 1,
                note: t => /therefore|consequently|this (demonstrates|reveals|suggests|illustrates)|thus|as a result|which means/i.test(t)
                    ? 'AO3 ✓ — Evaluative connective links evidence to argument.'
                    : 'Add a connective: "This demonstrates that…" or "Consequently…" to meet AO3.'
            },
        ];

        const combined = `${data.point} ${data.evidence} ${data.explanation} Consequently, this ${data.link}.`;
        const argScores = showResult ? argDims.map(d => ({ ...d, s: d.score(combined), n: d.note(combined) })) : null;

        return (
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-emerald-400">PEEL Paragraph Lab</h3>
                {!showResult ? (
                    <div className="grid gap-3">
                        <input className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3" placeholder="P (Point): Your claim" onChange={(e) => updateData('point', e.target.value)} />
                        <textarea className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 h-20" placeholder="E (Evidence): Case study facts" onChange={(e) => updateData('evidence', e.target.value)} />
                        <textarea className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 h-24" placeholder="E (Explanation): How evidence proves the point" onChange={(e) => updateData('explanation', e.target.value)} />
                        <input className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3" placeholder="L (Link): Connection back to thesis" onChange={(e) => updateData('link', e.target.value)} />
                        <Button onClick={() => setShowResult(true)}>Build Paragraph</Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-xl text-gray-300 leading-relaxed">
                            <span className="font-bold text-white uppercase text-xs mb-2 block tracking-widest text-emerald-500">Structured Analysis</span>
                            <p>{data.point} {data.evidence} {data.explanation} Consequently, this {data.link}.</p>
                        </div>
                        {/* Embedded Argument Strength */}
                        <div className="bg-white/3 border border-white/10 rounded-xl p-4">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">📊 Argument Strength — IB Criteria Check</p>
                            <div className="grid gap-2">
                                {argScores && argScores.map(r => (
                                    <div key={r.id} className="p-3 bg-white/5 border rounded-lg" style={{ borderColor: r.color + '33' }}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold" style={{ color: r.color }}>{r.label}</span>
                                            <span className="font-black text-xs" style={{ color: r.color }}>{r.s}/3</span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-1 mb-2">
                                            <div className="h-1 rounded-full transition-all" style={{ width: `${(r.s / 3) * 100}%`, background: r.color }} />
                                        </div>
                                        <p className="text-xs text-gray-400">{r.n}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PEEL tier examples */}
                        <div className="border border-white/10 rounded-xl p-4 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">📐 What a tiered PEEL paragraph looks like</p>
                            <div className="border border-slate-500/30 bg-slate-900/30 rounded-xl p-3">
                                <span className="text-xs font-bold bg-slate-700 text-slate-200 px-2 py-0.5 rounded mr-2">Band 3–4</span>
                                <span className="text-xs text-slate-400 italic">Claim + basic evidence. No theory or evaluative link.</span>
                                <p className="text-gray-400 text-xs leading-relaxed mt-2 italic">&ldquo;The South China Sea dispute shows that states sometimes break international rules. China built artificial islands there. This shows that powerful states can do what they want.&rdquo;</p>
                            </div>
                            <div className="border border-amber-500/20 bg-amber-950/20 rounded-xl px-4 py-3">
                                <p className="text-amber-400 text-xs font-bold mb-2">🔼 MOVES THAT ELEVATE TO BAND 5–6</p>
                                <ul className="space-y-1">{['Name a specific year, UN resolution, or treaty as evidence', 'Apply a named IR theory and explain HOW it illuminates the case', 'Use "therefore" / "this demonstrates" to connect E→E→L analytically'].map((m, i) => <li key={i} className="flex items-start gap-2 text-xs text-amber-200/80"><span className="text-amber-500 shrink-0">→</span><span>{m}</span></li>)}</ul>
                            </div>
                            <div className="border border-blue-500/30 bg-blue-900/20 rounded-xl p-3">
                                <span className="text-xs font-bold bg-blue-800 text-blue-200 px-2 py-0.5 rounded mr-2">Band 5–6</span>
                                <span className="text-xs text-blue-400 italic">Theory applied, evaluative connective used.</span>
                                <p className="text-gray-300 text-xs leading-relaxed mt-2 italic">&ldquo;China's militarisation of contested features in the South China Sea — despite the 2016 UNCLOS arbitral ruling — demonstrates a structurally Realist pattern of behaviour: when national interest diverges from international law, powerful states prioritise capability over compliance. This therefore challenges the liberal assumption that international institutions can consistently constrain great powers.&rdquo;</p>
                            </div>
                            <div className="border border-amber-500/20 bg-amber-950/20 rounded-xl px-4 py-3">
                                <p className="text-amber-400 text-xs font-bold mb-2">🔼 MOVES THAT ELEVATE TO BAND 7</p>
                                <ul className="space-y-1">{['Add a counter-argument: "However, a Constructivist would argue..."', 'Reach an evaluative judgement: "Overall, the more persuasive view is..."', 'Link back to the thesis concept using precise IB vocabulary'].map((m, i) => <li key={i} className="flex items-start gap-2 text-xs text-amber-200/80"><span className="text-amber-500 shrink-0">→</span><span>{m}</span></li>)}</ul>
                            </div>
                            <div className="border border-emerald-500/30 bg-emerald-900/20 rounded-xl p-3">
                                <span className="text-xs font-bold bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded mr-2">Band 7</span>
                                <span className="text-xs text-emerald-400 italic">Multi-perspective, evaluated, linked to thesis.</span>
                                <p className="text-gray-300 text-xs leading-relaxed mt-2 italic">&ldquo;China's construction of artificial islands in the South China Sea — in defiance of the 2016 PCA ruling — exemplifies the Realist logic that sovereignty claims are ultimately enforced through material power rather than legal obligation. However, a Constructivist counterpoint holds that Beijing's framing of its claims as historically legitimate reveals how identity and narrative, not just capability, shape state behaviour. Ultimately, this case study demonstrates that while coercive sovereignty assertions can succeed in the short term, their long-term legitimacy — and thus durability — depends on whether they are accepted as normatively valid within the international community.&rdquo;</p>
                            </div>
                        </div>

                        <Button variant="outline" onClick={() => setShowResult(false)}><RefreshCw size={16} /> Edit Details</Button>
                    </div>
                )}

                {/* ── Paragraph Review Section ──────────────────────────────────── */}
                <div className="border-t border-white/10 pt-5 space-y-3">
                    <div>
                        <p className="text-sm font-black text-emerald-400 mb-0.5">✍️ Review a Completed Paragraph</p>
                        <p className="text-[11px] text-gray-500">Paste any PEEL paragraph — the feedback engine will show your original, an improved version, and explain each change by AO criterion.</p>
                    </div>
                    <textarea
                        value={reviewPara}
                        onChange={e => setReviewPara(e.target.value)}
                        className="w-full bg-glopo-dark border border-glopo-border rounded-xl p-3 h-28 text-sm text-gray-300 outline-none focus:border-emerald-500 transition-colors resize-none"
                        placeholder="Paste your completed paragraph here..."
                    />
                    <div className="flex gap-2 flex-wrap">
                        <Button onClick={getPeelFeedback} disabled={reviewLoading || reviewPara.trim().length < 30}>
                            {reviewLoading ? 'Analysing...' : '✨ Coach My Writing'}
                        </Button>
                        <button
                            onClick={runGrammarCheck}
                            disabled={grammarLoading || reviewPara.trim().length < 20}
                            className="px-4 py-2 text-[10px] font-black rounded-lg border border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-all disabled:opacity-40"
                        >
                            {grammarLoading ? 'Checking...' : '📝 Check Grammar'}
                        </button>
                    </div>

                    {grammarIssues !== null && (
                        <div className="p-3 bg-white/3 border border-white/10 rounded-xl space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">📝 Grammar & Style — {grammarIssues.length} issue{grammarIssues.length !== 1 ? 's' : ''} found</p>
                            {grammarIssues.length === 0 ? (
                                <p className="text-[11px] text-emerald-400">No issues detected. Well structured.</p>
                            ) : grammarIssues.map((issue, i) => (
                                <div key={i} className="p-2 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                                    <p className="text-[10px] font-bold text-amber-400">{issue.category} — {issue.shortMessage}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{issue.message}</p>
                                    {issue.suggestions?.length > 0 && (
                                        <p className="text-[10px] text-emerald-400 mt-0.5">Suggestion: {issue.suggestions.join(' / ')}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {reviewError && (
                        <div className="p-3 bg-amber-900/20 border border-amber-500/30 rounded-xl text-[11px] text-amber-300">{reviewError}</div>
                    )}

                    {reviewResult && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            {/* Original */}
                            <div className="p-4 bg-white/3 border border-white/10 rounded-xl">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2">📄 Your Original</p>
                                <p className="text-sm text-gray-400 leading-relaxed italic">{reviewResult.original}</p>
                            </div>
                            {/* Improved */}
                            <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">✨ Improved Version</p>
                                    <div className="flex items-center gap-2">
                                        {reviewResult.bandJump && <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">{reviewResult.bandJump}</span>}
                                        <button
                                            onClick={isSpeaking ? stopSpeaking : () => speakText(reviewResult.improved)}
                                            title={isSpeaking ? 'Stop reading' : 'Read aloud'}
                                            className={`text-xs px-2 py-0.5 rounded font-bold transition-all ${isSpeaking ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-400 hover:text-white'}`}
                                        >
                                            {isSpeaking ? '⏹ Stop' : '🔊'}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-200 leading-relaxed">{reviewResult.improved}</p>
                            </div>
                            {/* Changes */}
                            {reviewResult.changes?.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">📝 Changes Made</p>
                                    {reviewResult.changes.map((c, i) => {
                                        const aoColor = c.ao === 'AO1' ? '#3399ff' : c.ao === 'AO2' ? '#00cc77' : c.ao === 'AO3' ? '#ff9900' : '#cc44ff';
                                        const aoBg = c.ao === 'AO1' ? '#3399ff22' : c.ao === 'AO2' ? '#00cc7722' : c.ao === 'AO3' ? '#ff990022' : '#cc44ff22';
                                        return (
                                            <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[9px] font-black px-2 py-0.5 rounded" style={{ background: aoBg, color: aoColor }}>{c.ao}</span>
                                                    <span className="text-xs font-bold text-gray-300">{c.label}</span>
                                                </div>
                                                {c.original && <p className="text-[10px] text-gray-600 italic mb-1 line-through">❝ {c.original}</p>}
                                                <p className="text-[11px] text-gray-300 leading-relaxed">→ {c.fix}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <Button variant="outline" onClick={() => { setReviewResult(null); setReviewPara(''); }}>
                                <RefreshCw size={14} /> Review Another Paragraph
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    };


    // ── F1: IB Rubric-Aligned Feedback ───────────────────────────────────────
    const IBRubricFeedback = () => {
        const [essay, setEssay] = useState('');
        const [feedback, setFeedback] = useState(null);
        const AO = [
            { id: 'AO1', label: 'AO1 — Knowledge & Understanding', color: '#3399ff' },
            { id: 'AO2', label: 'AO2 — Application & Analysis', color: '#00cc77' },
            { id: 'AO3', label: 'AO3 — Synthesis & Evaluation', color: '#ff9900' },
            { id: 'AO4', label: 'AO4 — Use of Key Concepts', color: '#cc44ff' },
        ];
        const score = (text, ao) => {
            const charLen = text.trim().length;
            const wc = text.trim().split(/\s+/).filter(w => w.length > 0).length;
            // Accept input if either 30+ chars OR 5+ words (handles non-spaced paste)
            if (charLen < 30 && wc < 5) return { s: 1, note: 'Too short to evaluate — paste a full paragraph.' };
            if (ao === 'AO1') {
                // AO1 (IB 2026): Knowledge & Understanding — named cases, IB concepts, accurate data
                const hasCase = /south china sea|ukraine|israel|bri|cop28|myanmar|nato|meta|wto|g20|duterte|rohingya|russia|venezuela|sahel|taiwan|arctic|kashmir|nile|darien/i.test(text);
                const hasConcept = /sovereignty|power|legitimacy|interdependence|human rights?|development|peace|security|identity|equality/i.test(text);
                const hasDetail = /\d{4}|article|resolution|treaty|protocol|summit|declaration|sanction|convention/i.test(text);
                return hasCase && hasConcept && hasDetail
                    ? { s: 3, note: 'Band 3 — Named case + IB concept + specific detail. Solid AO1 ✓' }
                    : hasCase && hasConcept
                        ? { s: 2, note: 'Band 2 — Add specific detail (dates, treaties, statistics) to reach Band 3.' }
                        : { s: 1, note: 'Band 1 — Add a named case study AND a core IB concept (Power, Sovereignty, etc.).' };
            }
            if (ao === 'AO2') {
                // AO2 (IB 2026): Application & Analysis — IR theory applied WITH analytical connectives
                const hasTheory = /realis[mt]|liberalis[mt]|constructivis[mt]|marxis[mt]|feminis[mt]|postcolonial|structuralis[mt]|critical theory/i.test(text);
                const hasAnalysis = /therefore|consequently|this (demonstrates|reveals|shows|suggests|illustrates)|because|thus|as a result|this explains|which means/i.test(text);
                const hasLink = /through a .+ lens|from a .+ perspective|viewed through|analysed via/i.test(text);
                return hasTheory && hasAnalysis
                    ? { s: 3, note: 'Band 3 — IR theory applied with analytical connectives ✓ (AO2 target met)' }
                    : hasTheory
                        ? { s: 2, note: 'Band 2 — Theory named but not applied. Add: "This demonstrates that..." or "Through a Realist lens..."' }
                        : { s: 1, note: 'Band 1 — Apply a named IR theory (Realism, Liberalism, Constructivism, Feminism, etc.).' };
            }
            if (ao === 'AO3') {
                // AO3 (IB 2026): Synthesis & Evaluation — counter-argument + sustained evaluative judgement
                const hasCounter = /however|on the other hand|yet|critics argue|critics of|counter|alternatively|in contrast|nevertheless|this is contested|a competing view/i.test(text);
                const hasJudgement = /overall|ultimately|to a (large|greater|limited) extent|more significant(ly)?|outweigh|more persuasive|it can be concluded|the evidence suggests/i.test(text);
                const hasSynthesis = /both .+ and|while .+ nonetheless|despite .+ however/i.test(text);
                return hasCounter && hasJudgement
                    ? { s: 3, note: 'Band 3 — Counter-argument + evaluative judgement. This is Band 7 territory ✓' }
                    : hasCounter || hasJudgement
                        ? { s: 2, note: `Band 2 — ${hasCounter ? 'Counter-argument present; add an explicit evaluative conclusion.' : 'Judgement present; add a counter-argument first.'}` }
                        : { s: 1, note: 'Band 1 — Add a counter-argument ("However, critics argue...") and a final evaluative judgement.' };
            }
            if (ao === 'AO4') {
                // AO4 (IB 2026): Use of Key Concepts — 4 core + global challenges + precise definition
                const coreC = ['power', 'sovereignty', 'legitimacy', 'interdependence'];
                const globalC = ['human rights', 'development', 'peace', 'security', 'equality', 'environment', 'identity', 'technology', 'health', 'poverty'];
                const usedCore = coreC.filter(c => text.toLowerCase().includes(c));
                const usedGlobal = globalC.filter(c => text.toLowerCase().includes(c));
                const total = usedCore.length + usedGlobal.length;
                const hasDef = /defined as|refers to|can be understood as|meaning that/i.test(text);
                return total >= 3 && hasDef
                    ? { s: 3, note: `Band 3 — ${total} IB concepts used with definitional grounding ✓ (${[...usedCore, ...usedGlobal].slice(0, 3).join(', ')})` }
                    : total >= 2
                        ? { s: 2, note: `Band 2 — ${total} concepts found. Add a one-sentence definition of your key concept.` }
                        : { s: 1, note: 'Band 1 — Name at least 3 IB key concepts: 4 Core (Power, Sovereignty, Legitimacy, Interdependence) + Global Challenges.' };
            }
            return { s: 2, note: 'Checked.' };
        };
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-blue-400">🎯 IB Rubric-Aligned Feedback</h3>
                <p className="text-xs text-gray-400">Paste a paragraph or essay for heuristic AO1–AO4 feedback.</p>
                <textarea className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 h-36 text-sm" placeholder="Paste your essay or paragraph..." value={essay} onChange={e => setEssay(e.target.value)} />
                <Button onClick={() => setFeedback(AO.map(ao => ({ ...ao, res: score(essay, ao.id) })))} disabled={essay.trim().length < 30}>Analyse Against IB Criteria</Button>
                {feedback && <div className="space-y-3 animate-in fade-in duration-300">{feedback.map(ao => (<div key={ao.id} className="p-4 bg-white/5 border rounded-lg" style={{ borderColor: ao.color + '44' }}><div className="flex justify-between items-center mb-1"><span className="text-xs font-bold" style={{ color: ao.color }}>{ao.label}</span><span className="text-xs font-black" style={{ color: ao.color }}>{ao.res.s}/3</span></div><div className="w-full bg-white/10 rounded-full h-1 mb-2"><div className="h-1 rounded-full" style={{ width: `${(ao.res.s / 3) * 100}%`, background: ao.color }} /></div><p className="text-xs text-gray-400">{ao.res.note}</p></div>))}<p className="text-[10px] text-gray-600 italic">Heuristic only — not a substitute for teacher feedback.</p></div>}
            </div>
        );
    };


    // ── F5: Comparative Analysis Builder ─────────────────────────────────────
    const CompareBuilder = () => {
        const [idxA, setIdxA] = useState('');
        const [idxB, setIdxB] = useState('');
        const [angle, setAngle] = useState('Power');
        const [result, setResult] = useState(null);

        const CONCEPT_GROUPS = [
            { label: 'Core Concepts', color: '#3399ff', items: ['Power', 'Sovereignty', 'Legitimacy', 'Interdependence'] },
            { label: 'Global Challenges', color: '#00cc77', items: ['Security', 'Development', 'Environment', 'Equality'] },
            { label: 'Key Concepts', color: '#ff9900', items: ['Human Rights', 'Peace', 'Identity', 'Justice', 'Technology', 'Globalization', 'Conflict', 'Cooperation'] },
        ];

        const getRelevantInsight = (caseData, a) => {
            if (caseData.globalChallenges) {
                for (const [key, val] of Object.entries(caseData.globalChallenges)) {
                    if (key.toLowerCase().includes(a.split(' ')[0].toLowerCase())) return { text: val.substring(0, 200), source: 'direct' };
                }
            }
            return { text: caseData.fiveWH?.why?.substring(0, 200) || caseData.facts?.[0] || '', source: 'indirect' };
        };

        const isConceptRelevant = (caseData, conceptAngle) => {
            const a = conceptAngle.toLowerCase();
            const all = [...(caseData.ibLinkage?.core || []), ...(caseData.ibLinkage?.challenge || []), ...Object.keys(caseData.globalChallenges || {})].map(c => c.toLowerCase());
            return all.some(c => c.includes(a.split(' ')[0]) || a.split(' ')[0].includes(c.split(' ')[0].split('(')[0].trim()));
        };

        const getBestTheory = (caseData, a) => {
            const theoryMap = { power: 'Realism', sovereignty: 'Realism', security: 'Realism', conflict: 'Realism', development: 'Structuralism', equality: 'Structuralism', environment: 'Liberalism', cooperation: 'Liberalism', interdependence: 'Liberalism', globalization: 'Liberalism', identity: 'Constructivism', legitimacy: 'Constructivism', justice: 'Constructivism', 'human rights': 'Feminism', peace: 'Feminism', technology: 'Liberalism' };
            const theory = Object.entries(theoryMap).find(([k]) => a.toLowerCase().includes(k))?.[1] || 'Realism';
            return { theory, text: caseData.theoryInsights?.[theory]?.substring(0, 160) || null };
        };

        const buildScaffold = (currentAngle) => {
            const ca = GLOBAL_CASES.find(c => c.name === idxA);
            const cb = GLOBAL_CASES.find(c => c.name === idxB);
            if (!ca || !cb) return;
            const insightA = getRelevantInsight(ca, currentAngle);
            const insightB = getRelevantInsight(cb, currentAngle);
            const theoryA = getBestTheory(ca, currentAngle);
            const relevanceNote = (!isConceptRelevant(ca, currentAngle) || !isConceptRelevant(cb, currentAngle))
                ? `⚠️ Note: ${!isConceptRelevant(ca, currentAngle) ? ca.name : cb.name} does not directly centre ${currentAngle} — use it as a secondary illustration or choose a more relevant case pair.` : null;
            setResult({
                angle: currentAngle, relevanceNote,
                sentences: [
                    { label: 'Opening', color: '#00cc77', text: `Both "${ca.name}" and "${cb.name}" reveal the contested nature of ${currentAngle} — the former through the lens of ${ca.theme}, the latter through ${cb.theme}.` },
                    { label: `Case A — ${ca.name}`, color: '#3399ff', text: `${insightA.text}...${insightA.source === 'indirect' ? ` [Note: make the ${currentAngle} connection explicit.]` : ''}` },
                    { label: `Case B — ${cb.name}`, color: '#ff9900', text: `${insightB.text}...${insightB.source === 'indirect' ? ` [Note: make the ${currentAngle} connection explicit.]` : ''}` },
                    { label: `Lens (${theoryA.theory})`, color: '#cc44ff', text: theoryA.text ? `Through a ${theoryA.theory} lens: ${theoryA.text}...` : `Apply a ${theoryA.theory} lens: how does ${currentAngle} interact with ${theoryA.theory.toLowerCase()} assumptions about state behaviour?` },
                    { label: 'Synthesis', color: '#ff66aa', text: `Ultimately, "${ca.name}" and "${cb.name}" demonstrate that ${currentAngle} is not fixed but a contested arena shaped by power asymmetries, institutional mechanisms, and normative frameworks. A comparative reading therefore [YOUR EVALUATIVE JUDGEMENT].` },
                ]
            });
        };

        const handleAngle = (a) => { setAngle(a); if (idxA && idxB && idxA !== idxB) buildScaffold(a); else setResult(null); };

        return (
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-cyan-400">⚖️ Comparative Analysis Builder</h3>
                <p className="text-xs text-gray-400">Choose two cases + an IB concept. Click any concept to update the scaffold instantly.</p>
                <div className="grid gap-3">
                    <select className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-2 text-sm" value={idxA} onChange={e => { setIdxA(e.target.value); setResult(null); }}>
                        <option value="">— Case A —</option>{GLOBAL_CASES.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                    </select>
                    <select className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-2 text-sm" value={idxB} onChange={e => { setIdxB(e.target.value); setResult(null); }}>
                        <option value="">— Case B —</option>{GLOBAL_CASES.filter(c => c.name !== idxA).map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                    </select>
                    <div className="space-y-2">
                        {CONCEPT_GROUPS.map(group => (
                            <div key={group.label}>
                                <p className="text-[9px] font-bold uppercase mb-1" style={{ color: group.color }}>{group.label}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {group.items.map(a => (
                                        <button key={a} onClick={() => handleAngle(a)}
                                            className="text-xs px-2.5 py-1 rounded-lg border transition-all"
                                            style={angle === a ? { background: group.color, borderColor: group.color, color: '#000', fontWeight: 700 } : { borderColor: group.color + '44', color: group.color + 'bb' }}>
                                            {a}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Button onClick={() => buildScaffold(angle)} disabled={!idxA || !idxB || idxA === idxB}>Build Scaffold</Button>
                {result && (
                    <div className="space-y-3 animate-in fade-in duration-300">
                        <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Comparative Scaffold — {result.angle}</p>
                        {result.relevanceNote && <div className="p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg"><p className="text-xs text-amber-400">{result.relevanceNote}</p></div>}
                        {result.sentences.map((s, i) => (
                            <div key={i} className="p-3 rounded-r-lg border-l-2 text-xs text-gray-300 leading-relaxed" style={{ borderColor: s.color + '80', background: s.color + '08' }}>
                                <span className="text-[9px] font-black uppercase tracking-widest block mb-1" style={{ color: s.color }}>{s.label}</span>
                                {s.text}
                            </div>
                        ))}
                        <p className="text-[10px] text-gray-600 italic">Sections marked [YOUR ...] are where your own analysis goes.</p>
                    </div>
                )}
            </div>
        );
    };

    // ── F9: Thesis Variations ─────────────────────────────────────────────────
    const ThesisVariations = () => {
        const [concept, setConcept] = useState('');
        const [core, setCore] = useState('');
        const [variations, setVariations] = useState(null);

        const generate = () => {
            if (!concept || !core) return;
            setVariations([
                {
                    tier: 'Band 3–4', color: 'slate',
                    label: 'States the argument — no conceptual tension, no theory, no nuance.',
                    text: `${concept} is relevant to global politics because ${core}.`
                },
                {
                    tier: 'Band 5–6', color: 'blue',
                    label: 'Introduces tension and signals theoretical framing.',
                    text: `While ${concept} remains central to global governance, ${core}, suggesting that states must balance competing self-interest with collective normative obligations — a tension that a Realist lens illuminates as structurally irresolvable in the absence of a central authority.`
                },
                {
                    tier: 'Band 7', color: 'emerald',
                    label: 'Contested concept, multi-actor, evaluative scope signal, hedged.',
                    text: `The concept of ${concept} is not a fixed condition but a contested, dynamic arena: ${core}. This claim must be qualified by examining structural constraints and the diverging postures of major powers, emerging economies, and non-state actors — each of whom constructs ${concept} through their own normative and material frameworks — making a universally applicable conclusion conditional rather than definitive.`
                },
            ]);
        };

        const TIER_STYLES = {
            slate: { border: 'border-slate-500/30', bg: 'bg-slate-900/30', badge: 'bg-slate-700 text-slate-200', label: 'text-slate-300' },
            blue: { border: 'border-blue-500/30', bg: 'bg-blue-900/20', badge: 'bg-blue-800 text-blue-200', label: 'text-blue-400' },
            emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-900/20', badge: 'bg-emerald-800 text-emerald-200', label: 'text-emerald-400' },
        };

        const elevate1 = [
            `Replace the generic "is relevant because" opener with a conceptual tension or paradox`,
            `Signal the theoretical lens you will use to analyse ${concept || 'the concept'}`,
            `Indicate the scope: which case studies will anchor your argument?`,
            `Move from assertion to analysis — your thesis should make a claim that can be debated`,
        ];
        const elevate2 = [
            `Make the concept itself contested, not just the argument — ${concept || 'your concept'} should be problematised`,
            `Acknowledge the multi-actor dynamic: major powers, emerging economies, and non-state actors may construct the concept differently`,
            `Use hedging language ("conditional", "contingent on", "structurally irresolvable") to signal scholarly sophistication`,
            `Close with an implicit essay roadmap — signal evaluative scope without listing paragraph topics`,
        ];

        return (
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-pink-400">✨ Thesis Variations</h3>
                <p className="text-xs text-gray-400">Enter your IB concept and core argument — see how the same idea reads at Band 3–4, Band 5–6, and Band 7, with the specific moves that elevate each.</p>
                <input className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 text-sm" placeholder="IB Concept (e.g., Sovereignty, Power, Peace)" value={concept} onChange={e => setConcept(e.target.value)} />
                <textarea className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 h-20 text-sm" placeholder="Core argument (e.g., great powers undermine sovereignty through economic coercion)" value={core} onChange={e => setCore(e.target.value)} />
                <Button onClick={generate} disabled={!concept || !core}>Generate Thesis Variations</Button>

                {variations && (
                    <div className="space-y-3 animate-in fade-in duration-300">
                        {variations.map((v, i) => {
                            const s = TIER_STYLES[v.color];
                            return (
                                <>
                                    <div key={i} className={`border ${s.border} ${s.bg} rounded-xl p-4`}>
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${s.badge}`}>{v.tier}</span>
                                            <span className={`text-xs italic ${s.label}`}>{v.label}</span>
                                        </div>
                                        <p className="text-sm text-gray-200 leading-relaxed italic">&ldquo;{v.text}&rdquo;</p>
                                    </div>
                                    {i === 0 && (
                                        <div className="border border-amber-500/20 bg-amber-950/20 rounded-xl px-4 py-3">
                                            <p className="text-amber-400 text-xs font-bold mb-2">🔼 MOVES THAT ELEVATE TO BAND 5–6</p>
                                            <ul className="space-y-1">{elevate1.map((m, j) => <li key={j} className="flex items-start gap-2 text-xs text-amber-200/80"><span className="text-amber-500 shrink-0">→</span><span>{m}</span></li>)}</ul>
                                        </div>
                                    )}
                                    {i === 1 && (
                                        <div className="border border-amber-500/20 bg-amber-950/20 rounded-xl px-4 py-3">
                                            <p className="text-amber-400 text-xs font-bold mb-2">🔼 MOVES THAT ELEVATE TO BAND 7</p>
                                            <ul className="space-y-1">{elevate2.map((m, j) => <li key={j} className="flex items-start gap-2 text-xs text-amber-200/80"><span className="text-amber-500 shrink-0">→</span><span>{m}</span></li>)}</ul>
                                        </div>
                                    )}
                                </>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    // ── Case Finder: AI semantic search over IB case studies ─────────────────
    const CaseFinder = () => {
        const [query, setQuery] = useState('');
        const [results, setResults] = useState(null);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        // Uses module-level SHARED_CASE_POOL — add new cases there, not here
        const CASE_POOL = SHARED_CASE_POOL;

        const findCases = async () => {
            if (!query.trim()) return;
            setLoading(true); setError(null); setResults(null);

            // ── Local keyword-scoring fallback (no API needed) ───────────────
            const keywordScore = (caseItem, q) => {
                const qWords = q.toLowerCase().split(/\W+/).filter(w => w.length > 3);
                const haystack = caseItem.themes.toLowerCase();
                return qWords.reduce((score, word) => score + (haystack.includes(word) ? 1 : 0), 0);
            };
            const angleFor = (name) => {
                if (/war|nuclear|military|conflict|territory|south china|korea/i.test(name)) return 'Realism';
                if (/climate|trade|pandemic|brexit|eu|covid/i.test(name)) return 'Liberalism';
                if (/r2p|rwand|rohingya|human rights|arab|identity/i.test(name)) return 'Constructivism';
                return 'Realism';
            };
            const localFallback = () => {
                const scored = CASE_POOL
                    .map(c => ({ ...c, score: keywordScore(c, query) }))
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map((c, i) => ({
                        rank: i + 1, name: c.name, concepts: c.concepts,
                        relevance: `Keyword match on your argument — review for direct thematic alignment.`,
                        angle: angleFor(c.name), url: c.url, isLocal: true
                    }));
                return scored;
            };

            try {
                // 1. Semantic search (Gemini embeddings — most accurate)
                const semRes = await fetch('/.netlify/functions/semantic-search', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, topK: 3 })
                });
                if (semRes.ok) {
                    const semData = await semRes.json();
                    if (!semData.error && semData.results?.length) {
                        const enriched = semData.results.map((r, i) => {
                            const match = CASE_POOL.find(c => c.name === r.name);
                            return {
                                rank: i + 1, name: r.name, concepts: match?.concepts || '', url: match?.url || '',
                                relevance: `Semantic match (score: ${r.score.toFixed(2)}) — high confidence thematic alignment.`,
                                angle: angleFor(r.name)
                            };
                        });
                        setResults(enriched);
                        setLoading(false);
                        return;
                    }
                }
            } catch { /* fall through */ }

            try {
                // 2. AI case finder (Gemini — works when deployed)
                const fnRes = await fetch('/.netlify/functions/find-cases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });
                if (fnRes.ok) {
                    const data = await fnRes.json();
                    if (data.error) throw new Error(data.error);
                    const enriched = (data.results || []).map(r => {
                        const match = CASE_POOL.find(c => c.name === r.name);
                        return { ...r, concepts: match?.concepts || '', url: match?.url || '' };
                    });
                    setResults(enriched);
                    setLoading(false);
                    return;
                }
            } catch { /* fall through to local */ }

            // 3. Local keyword fallback (instant, works anywhere)
            const local = localFallback();
            setResults(local);
            setError('Semantic and AI search unavailable locally. Showing keyword matches. Results improve when deployed.');
            setLoading(false);

        };

        return (
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-violet-400 mb-1">🔍 Case Finder</h3>
                    <p className="text-xs text-gray-400">Type your thesis or argument. AI surfaces the 3 most relevant IB case studies with an analytical angle.</p>
                </div>
                <div className="flex gap-2">
                    <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && findCases()}
                        placeholder="e.g. 'Great powers undermine sovereignty through economic coercion'"
                        className="flex-1 bg-glopo-dark border border-white/20 rounded-xl p-3 text-sm text-gray-300 outline-none focus:border-violet-500 transition-colors placeholder:text-gray-600" />
                    <button onClick={findCases} disabled={loading || !query.trim()}
                        className="px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white text-xs font-black rounded-xl transition-all shrink-0">
                        {loading ? '...' : 'FIND CASES'}
                    </button>
                </div>
                {loading && (
                    <div className="flex items-center gap-3 p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl">
                        <RefreshCw className="animate-spin text-violet-400" size={16} />
                        <span className="text-xs text-violet-300 font-bold animate-pulse">Matching across 20 IB case studies...</span>
                    </div>
                )}
                {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl"><p className="text-xs text-red-400">{error}</p></div>}
                {results && (
                    <div className="space-y-3 animate-in fade-in duration-400">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Top Matches for Your Argument</p>
                        {results.map(r => (
                            <div key={r.rank} className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">#{r.rank}</span>
                                        <span className="text-sm font-black text-violet-200">{r.name}</span>
                                    </div>
                                    {r.concepts && <span className="text-[9px] font-black text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full shrink-0">{r.concepts}</span>}
                                </div>
                                <p className="text-xs text-gray-300 leading-relaxed"><span className="font-bold text-violet-400">Why it fits: </span>{r.relevance}</p>
                                <p className="text-xs text-gray-400 leading-relaxed"><span className="font-bold text-gray-300">Angle: </span>{r.angle}</p>
                                {r.url && (
                                    <a href={r.url} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] font-black text-violet-400 hover:text-violet-300 transition-colors pt-1">
                                        🔗 Read Source <ChevronRight size={10} />
                                    </a>
                                )}
                            </div>
                        ))}
                        <p className="text-[9px] text-gray-600 italic">Ranked by Gemini AI based on thematic alignment with your argument.</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <PenTool className="text-emerald-500" /> Writing Studio
            </h2>

            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    { id: 'bank', label: 'Q-Bank', icon: BookOpen },
                    { id: 'debate', label: 'Debate Lab', icon: MessageSquare },
                    { id: 'intro', label: 'Intro Builder', icon: Zap },
                    { id: 'peel', label: 'PEEL Lab', icon: PenTool },
                    { id: 'thesis', label: 'Thesis Var.', icon: PenTool },
                    { id: 'policy', label: 'Policy Engine', icon: Shield },

                ].map(b => (
                    <button
                        key={b.id}
                        onClick={() => setSubTab(b.id)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${subTab === b.id ? "bg-emerald-600 text-white" : "bg-white/5 text-gray-500 hover:bg-white/10"}`}
                    >
                        <b.icon size={13} /> {b.label}
                    </button>
                ))}
            </div>

            <Card className="border-emerald-500/20">
                {subTab === 'bank' && <QuestionBank />}
                {subTab === 'debate' && <DebateLab />}
                {subTab === 'intro' && <IntroWizard />}
                {subTab === 'peel' && <PeelLab />}
                {subTab === 'thesis' && <ThesisVariations />}
                {subTab === 'policy' && <PolicyEngine />}

            </Card>
        </div>
    );
};

// --- Tab 3: Drill Mode ---
const DrillMode = () => {
    const drills = [
        {
            prompt: "Sovereignty is absolute in the Westphalian system.",
            supports: ["National Interest", "Security", "Legitimacy"],
            challenges: ["Human Rights", "Interdependence", "Globalization", "Climate Change"]
        },
        {
            prompt: "The UN is the primary actor in global governance.",
            supports: ["Legitimacy", "International Law", "Diplomacy"],
            challenges: ["Sovereignty", "Realism", "Regional Blocs", "Power Dynamics"]
        },
        {
            prompt: "Development is measured purely by economic growth (GDP).",
            supports: ["Industrialization", "Modernization", "Trade"],
            challenges: ["Sustainability", "Human Rights", "Equality", "Cultural Identity"]
        },
        {
            prompt: "Peace is defined simply as the absence of armed conflict.",
            supports: ["Ceasefire", "Stability", "Deterrence"],
            challenges: ["Structural Violence", "Inequality", "Justice", "Positive Peace"]
        },
        {
            prompt: "Human Rights are universal and transcend cultural boundaries.",
            supports: ["Justice", "Liberty", "Human Dignity"],
            challenges: ["Sovereignty", "Relativism", "Legitimacy", "Religious Tradition"]
        }
    ];

    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selections, setSelections] = useState({ supports: [], challenges: [] });
    const [finished, setFinished] = useState(false);

    const currentDrill = drills[currentIdx];
    const allOptions = [...currentDrill.supports, ...currentDrill.challenges].sort();

    const toggleOption = (opt, type) => {
        const otherType = type === 'supports' ? 'challenges' : 'supports';
        setSelections({
            [type]: selections[type].includes(opt) ? selections[type].filter(o => o !== opt) : [...selections[type], opt],
            [otherType]: selections[otherType].filter(o => o !== opt)
        });
    };

    const checkAnswer = () => {
        let currentPoints = 0;
        selections.supports.forEach(o => { if (currentDrill.supports.includes(o)) currentPoints++; else currentPoints--; });
        selections.challenges.forEach(o => { if (currentDrill.challenges.includes(o)) currentPoints++; else currentPoints--; });

        setScore(score + currentPoints);

        if (currentIdx < drills.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setSelections({ supports: [], challenges: [] });
        } else {
            setFinished(true);
        }
    };

    if (finished) {
        return (
            <Card className="text-center animate-in zoom-in-95">
                <h3 className="text-2xl font-bold mb-2 text-white">Drill Complete!</h3>
                <p className="text-gray-400 mb-6">Your Scholarship Score: <span className="text-blue-400 font-bold">{score}</span></p>
                <Button onClick={() => { setCurrentIdx(0); setScore(0); setFinished(false); }} className="mx-auto">
                    Try Again
                </Button>
            </Card>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Zap className="text-warning" /> Bifurcation Drill
            </h2>
            <Card>
                <p className="text-lg text-gray-400 mb-2 font-medium">Bifurcate this statement:</p>
                <div className="bg-white/5 p-4 rounded-lg mb-6 border border-white/10">
                    <p className="text-xl font-bold text-white italic">"{currentDrill.prompt}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                        <h3 className="text-sm font-bold text-emerald-400 mb-3 uppercase tracking-widest">Support / Reinforce</h3>
                        <div className="flex flex-wrap gap-2">
                            {allOptions.map(opt => (
                                <button
                                    key={`sup-${opt}`}
                                    onClick={() => toggleOption(opt, 'supports')}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${selections.supports.includes(opt)
                                        ? "bg-emerald-600 border-emerald-500 text-white"
                                        : "border-emerald-500/20 text-emerald-500/50 hover:border-emerald-500/50"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                        <h3 className="text-sm font-bold text-red-400 mb-3 uppercase tracking-widest">Against / Challenge</h3>
                        <div className="flex flex-wrap gap-2">
                            {allOptions.map(opt => (
                                <button
                                    key={`chal-${opt}`}
                                    onClick={() => toggleOption(opt, 'challenges')}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${selections.challenges.includes(opt)
                                        ? "bg-red-600 border-red-500 text-white"
                                        : "border-red-500/20 text-red-500/50 hover:border-red-500/50"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <Button onClick={checkAnswer} className="w-full" disabled={selections.supports.length === 0 && selections.challenges.length === 0}>
                    Submit Analysis <ChevronRight size={18} />
                </Button>
            </Card>
        </div>
    );
};

// --- Tab 4: War Room Simulator ---
const WarRoom = () => {
    const scenarios = [
        {
            title: "South China Sea Dispute",
            text: "A border dispute in the South China Sea is escalating between local fishermen and regional coast guards."
        },
        {
            title: "Sahel Climate Crisis",
            text: "Climate refugees are crossing borders in the Sahel, leading to resource conflict and ethnic spanning tensions."
        },
        {
            title: "Estonian Cyber Siege",
            text: "A massive cyber-attack has crippled Estonia's power grid, suspected to be backed by a neighboring superpower."
        },
        {
            title: "Horn of Africa Famine",
            text: "Total crop failure in the Horn of Africa is causing mass migration and the collapse of local markets."
        },
        {
            title: "BRI Debt Trap",
            text: "A Belt and Road partner is facing a massive debt default, threatening its control over strategic port infrastructure."
        },
        {
            title: "The Nile Water War",
            text: "Ethiopia and Egypt are at a standstill over water flow rights from the Grand Ethiopian Renaissance Dam."
        },
        {
            title: "AI Weaponization",
            text: "Autonomous weapon systems have been detected in a proxy conflict, operated by non-state actors."
        },
        {
            title: "Sinking Island Sovereignty",
            text: "A Small Island Developing State is losing land to sea-level rise, threatening its legal claim to exclusive economic zones."
        },
        {
            title: "The Darien Gap Surge",
            text: "Unauthorized migration flows through the Darien Gap are overwhelming regional security and human rights agencies."
        },
        {
            title: "Sanctions Evasion",
            text: "A sanctioned regime is using cryptocurrency and shadow tankers to fund a massive conventional military buildup."
        }
    ];

    const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
    const [proposal, setProposal] = useState('');
    const [grade, setGrade] = useState(null);

    const scenario = scenarios[currentScenarioIdx];

    const nextScenario = () => {
        setCurrentScenarioIdx((currentScenarioIdx + 1) % scenarios.length);
        setProposal('');
        setGrade(null);
    };

    const runGrading = () => {
        const input = proposal.toLowerCase();

        // Level 1 logic
        const genericKeywords = ['help', 'try', 'fix', 'do something', 'support', 'send money'];
        const isGeneric = proposal.split(' ').length < 10 || genericKeywords.some(kw => input.includes(kw) && proposal.split(' ').length < 15);

        // Level 2 logic (Actor + Mechanism + Rationale)
        const hasActor = ['ministry', 'un', 'government', 'sc', 'agency', 'ngo', 'security council'].some(actor => input.includes(actor));
        const hasMechanism = ['sanction', 'fund', 'subsidy', 'treaty', 'protocol', 'deployment', 'peacekeeping'].some(mech => input.includes(mech));
        const hasRationale = input.includes('to ') || input.includes('in order to') || input.includes('because');

        const isSurgical = hasActor && hasMechanism && hasRationale;

        // Level 3 logic (Risk/Implication mitigation)
        const riskKeywords = ['however', 'risk', 'challenge', 'but', 'mitigate', 'although', 'despite'].some(kw => input.includes(kw));

        if (riskKeywords && isSurgical) {
            setGrade({
                level: 3,
                feedback: "Scholar Level (Level 3). You have secured the 7.",
                explanation: "Strategic Excellence. You identified a specific actor, used a precise mechanism, and accounted for systemic risks."
            });
        } else if (isSurgical) {
            setGrade({
                level: 2,
                feedback: "High Marks (Level 2). The policy is effective.",
                explanation: "Good surgical approach. To hit Level 7, add an 'Implications Check'—how do you mitigate the risks of this policy?"
            });
        } else {
            setGrade({
                level: 1,
                feedback: "Foundation Level (Level 1). Policy too vague.",
                explanation: "Remember the High-Mark Formula: Actor + Mechanism + Target + Rationale."
            });
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="text-danger" /> Policy War Room
            </h2>
            <Card>
                <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-lg mb-6">
                    <p className="text-sm text-red-400 font-bold mb-1 uppercase tracking-wider">Active Scenario: {scenario.title}</p>
                    <p className="text-lg text-white font-medium italic">"{scenario.text}"</p>
                </div>

                <p className="text-sm text-gray-400 mb-2">Draft your policy proposal below:</p>
                <textarea
                    className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-4 h-32 focus:outline-none focus:border-red-500 transition-colors mb-4 leading-relaxed"
                    placeholder="e.g., The UN Security Council should deploy forces to..."
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                />

                <Button onClick={runGrading} className="w-full bg-red-600 hover:bg-red-700" disabled={!proposal.trim()}>
                    Submit to Command Center
                </Button>

                <Button onClick={nextScenario} variant="outline" className="w-full mt-2 border-red-500/30 text-red-400 hover:bg-red-900/10">
                    Switch Scenario
                </Button>
            </Card>

            {grade && (
                <div className={`mt-8 p-6 rounded-xl border animate-in zoom-in-95 duration-300 ${grade.level === 3 ? "bg-emerald-900/20 border-emerald-500/30 text-emerald-100" :
                    grade.level === 2 ? "bg-blue-900/20 border-blue-500/30 text-blue-100" :
                        "bg-amber-900/20 border-amber-500/30 text-amber-100"
                    }`}>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        {grade.level === 3 ? <CheckCircle /> : grade.level === 2 ? <Shield /> : <AlertTriangle />}
                        {grade.feedback}
                    </h3>
                    <p className="opacity-90 leading-relaxed italic">"{grade.explanation}"</p>
                </div>
            )}
        </div>
    );
};

// --- Helper for hover concepts & tables ---
const SourceText = ({ text }) => {
    if (!text) return null;

    // Auto-wrap glossary terms
    const glossaryTerms = ["Power", "Sovereignty", "Legitimacy", "Interdependence", "Human rights", "Justice", "Liberty", "Equality", "Development", "Sustainability", "Peace", "Conflict", "Violence", "Non-violence", "Globalization", "Inequality"];

    const wrapTerms = (content) => {
        let result = content;
        glossaryTerms.forEach(term => {
            const regex = new RegExp(`\\b(${term})\\b`, 'gi');
            result = result.replace(regex, `<span class="glossary-term font-bold text-cyan-400 cursor-help border-b border-cyan-500/30">$1</span>`);
        });
        return result;
    };

    // Table renderer logic
    if (text.includes('|') && text.includes('---')) {
        const lines = text.trim().split('\n');
        const tableLines = lines.filter(l => l.trim().startsWith('|'));
        if (tableLines.length > 2) {
            const header = tableLines[0].split('|').filter(c => c.trim() !== '').map(c => c.trim());
            const rows = tableLines.slice(2).map(row =>
                row.split('|').filter(c => c.trim() !== '').map(c => c.trim())
            );

            return (
                <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-glopo-blue/20 text-blue-300 font-bold">
                                {header.map((h, i) => (
                                    <th key={i} className="p-3 border-b border-white/10" dangerouslySetInnerHTML={{ __html: wrapTerms(h) }} />
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    {row.map((cell, j) => (
                                        <td key={j} className="p-3 text-gray-300" dangerouslySetInnerHTML={{ __html: wrapTerms(cell) }} />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
    }

    return <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: wrapTerms(text) }} />;
};

// --- Mock Exam Zone Components (Extracted for Stability) ---
const TimerBar = ({ seconds, running, limit, start, toggle, reset, color, formatTime }) => (
    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl mb-6">
        <div className={`text-2xl font-black font-mono tabular-nums ${color}`}>
            {seconds > 0 ? formatTime(seconds) : '--:--'}
        </div>
        <div className="flex-1 text-xs text-gray-500">Practice Timer</div>
        <div className="flex gap-2">
            {seconds === 0 ? (
                <button onClick={() => start(90)} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">Start</button>
            ) : (
                <>
                    <button onClick={toggle} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${running ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                        {running ? 'Pause' : 'Resume'}
                    </button>
                    <button onClick={reset} className="px-3 py-1.5 bg-white/10 text-gray-400 text-xs font-bold rounded-lg hover:bg-white/20 transition-colors">Reset</button>
                </>
            )}
        </div>
    </div>
);

const PracticeLab = ({ paperKey, q, selectedExamIndex, userAnswers, updateAnswer, analysis, analyzeDraft, requestDeepAnalysis, activeLab, setActiveLab }) => {
    const key = `${paperKey}-${selectedExamIndex}-${q.num}`;
    // Use LOCAL state for the textarea so typing doesn't trigger parent re-renders (which steal focus)
    const [localAnswer, setLocalAnswer] = React.useState(userAnswers[key] || '');
    const feedback = analysis[key];
    const isActive = activeLab?.paper === paperKey && activeLab?.qNum === q.num;

    // Image upload state
    const [imagePreview, setImagePreview] = React.useState(null);
    const [imageLoading, setImageLoading] = React.useState(false);
    const [imageResult, setImageResult] = React.useState(null);
    const [imageError, setImageError] = React.useState(null);
    const imageInputRef = React.useRef(null);

    // Sync parent → local when the lab first opens (e.g. restoring from localStorage)
    React.useEffect(() => {
        setLocalAnswer(userAnswers[key] || '');
    }, [key, isActive]); // intentionally limited deps

    const handleChange = (e) => {
        setLocalAnswer(e.target.value);
    };

    // Sync local → parent on blur so auto-save still works
    const handleBlur = () => {
        updateAnswer(key, localAnswer);
    };

    const wordCount = localAnswer.trim().length > 0
        ? localAnswer.trim().split(/\s+/).filter(x => x.length > 0).length
        : 0;

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];
        if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
            setImageError('Please upload an image (JPG, PNG, WEBP, HEIC) or PDF file.');
            return;
        }
        setImageError(null);
        setImageResult(null);

        // Large files (>1MB) bypass the Netlify function (26s limit) and go direct to Gemini
        const isLargeFile = file.size > 1 * 1024 * 1024;


        // Show preview
        const reader = new FileReader();
        reader.onload = async (evt) => {
            const dataUrl = evt.target.result;
            setImagePreview(dataUrl);

            // Compress images before sending — large phone photos cause Vision timeouts
            // PDFs pass through unchanged
            let base64, mimeType;
            if (file.type !== 'application/pdf') {
                try {
                    const compressed = await new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => {
                            const MAX = 1600;
                            let { width, height } = img;
                            if (width > MAX || height > MAX) {
                                if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
                                else { width = Math.round(width * MAX / height); height = MAX; }
                            }
                            const canvas = document.createElement('canvas');
                            canvas.width = width; canvas.height = height;
                            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                            resolve(canvas.toDataURL('image/jpeg', 0.85));
                        };
                        img.src = dataUrl;
                    });
                    base64 = compressed.split(',')[1];
                    mimeType = 'image/jpeg';
                } catch {
                    base64 = dataUrl.split(',')[1];
                    mimeType = file.type;
                }
            } else {
                base64 = dataUrl.split(',')[1];
                mimeType = file.type;
            }

            setImageLoading(true);
            try {
                const isLocalDev = window.location.hostname === 'localhost';
                const localKey = process.env.REACT_APP_GEMINI_API_KEY;

                // Helper: get key for direct Gemini call
                // - localhost: use .env key directly
                // - production: fetch from /get-token (uses server-side GEMINI_API_KEY, no REACT_APP_ needed)
                const getApiKey = async () => {
                    if (isLocalDev && localKey) return localKey;
                    const res = await fetch('/.netlify/functions/get-token', { signal: AbortSignal.timeout(5000) });
                    if (!res.ok) throw new Error('Could not retrieve API token.');
                    const data = await res.json();
                    return data.key;
                };

                const runDirectApi = async (key) => {
                    const body = {
                        contents: [{
                            parts: [
                                { text: `You are an IB Global Politics examiner. Analyse this handwritten/printed student essay.\n\nQuestion: ${q.text}\nMarks: ${q.marks || 15}\n\nProvide: transcription, Glow, Grow, Alternative Approaches, Golden Tip, AO band estimates.` },
                                { inline_data: { mime_type: mimeType, data: base64 } }
                            ]
                        }]
                    };
                    const gemRes = await geminiRetryFetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${key}`,
                        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(60000) }
                    );
                    const gemData = await gemRes.json();
                    if (!gemRes.ok) throw new Error(gemData.error?.message || `Gemini API error ${gemRes.status}`);
                    return gemData.candidates?.[0]?.content?.parts?.[0]?.text || 'No feedback returned.';
                };

                if (isLargeFile || isLocalDev) {
                    // Large file OR local dev: go direct to Gemini — no 26s Netlify ceiling
                    const key = await getApiKey();
                    const result = await runDirectApi(key);
                    setImageResult(result);
                } else {
                    // Small file on production: use Netlify function (Flash, fast)
                    const response = await fetch('/.netlify/functions/analyze-image-essay', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ imageBase64: base64, mimeType, questionText: q.text, marks: q.marks || 15 }),
                        signal: AbortSignal.timeout(30000)
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setImageResult(data.analysis || 'No feedback returned.');
                    } else {
                        // Netlify function failed — try direct API
                        const key = await getApiKey();
                        const result = await runDirectApi(key);
                        setImageResult(result);
                    }
                }

            } catch (err) {
                const msg = err.message || '';
                if (msg.includes('429') || msg.includes('quota') || msg.includes('Resource exhausted')) {
                    setImageError('The AI is currently busy (rate limit). Please wait 30 seconds and try again.');
                } else if (msg.startsWith('Failed to analyse') || msg.startsWith('Analysis timed out')) {
                    setImageError(msg); // already a clean message from the function
                } else {
                    setImageError('Failed to analyse image: ' + msg);
                }

            } finally {
                setImageLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    // Voice input state
    const [isRecording, setIsRecording] = React.useState(false);
    const [voiceSupported] = React.useState(() => !!(window.SpeechRecognition || window.webkitSpeechRecognition));
    const recognitionRef = React.useRef(null);

    const toggleVoiceInput = () => {
        if (!voiceSupported) return;
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
            return;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        let finalTranscript = localAnswer;

        recognition.onresult = (event) => {
            let interim = '';
            let addedFinal = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const t = event.results[i][0].transcript;
                if (event.results[i].isFinal) { addedFinal += t + ' '; }
                else { interim = t; }
            }
            if (addedFinal) {
                finalTranscript = finalTranscript.replace(/\[.*?\]$/, '') + addedFinal;
            }
            setLocalAnswer(finalTranscript + (interim ? `[${interim}]` : ''));
        };
        recognition.onend = () => {
            // Strip any remaining interim bracket
            setLocalAnswer(prev => prev.replace(/\[.*?\]$/, '').trimEnd() + ' ');
            setIsRecording(false);
        };
        recognition.onerror = () => setIsRecording(false);

        recognition.start();
        recognitionRef.current = recognition;
        setIsRecording(true);
    };

    return (
        <div className="mt-4 border-t border-white/10 pt-4">
            <button
                onClick={() => setActiveLab(isActive ? null : { paper: paperKey, qNum: q.num })}
                className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg border transition-all ${isActive ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'}`}
            >
                <PenTool size={12} /> {isActive ? 'Close Practice Lab' : 'Open Practice Lab'}
            </button>

            {isActive && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="relative">
                        {/* Mic / Stop row — above textarea, clear of pointer-event conflicts */}
                        {voiceSupported && (
                            <div className="flex items-center gap-2 mb-1.5">
                                <button
                                    onClick={toggleVoiceInput}
                                    title={isRecording ? 'Stop recording' : 'Dictate your response'}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all select-none ${isRecording
                                        ? 'bg-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse'
                                        : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                                        }`}
                                >
                                    {isRecording ? (
                                        <><span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />{' '}⏹ STOP RECORDING</>
                                    ) : (
                                        <>🎤 DICTATE</>
                                    )}
                                </button>
                                {isRecording && (
                                    <span className="text-[9px] text-red-400 font-black uppercase tracking-widest animate-pulse">Recording…</span>
                                )}
                            </div>
                        )}
                        <textarea
                            value={localAnswer}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Type your response here... (Auto-saves to browser memory)"
                            className={`w-full bg-glopo-dark border rounded-xl p-4 text-xs text-gray-300 h-48 focus:border-cyan-500 outline-none transition-all placeholder:text-gray-600 resize-y ${isRecording ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]' : 'border-white/20'}`}
                        />
                        <div className="absolute bottom-2 right-4 text-[9px] text-gray-500 font-bold uppercase tracking-tighter pointer-events-none select-none">
                            {wordCount > 0 ? `${wordCount} Words` : 'Ready to write'}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => { updateAnswer(key, localAnswer); analyzeDraft(paperKey, q, localAnswer); }}
                            className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-black rounded-lg transition-all text-center"
                        >
                            QUICK LOCAL ANALYSIS
                        </button>
                        <button
                            onClick={() => { updateAnswer(key, localAnswer); requestDeepAnalysis(paperKey, q, localAnswer); }}
                            disabled={localAnswer.length < 20}
                            className={`px-3 py-2 text-[10px] font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${localAnswer.length < 20
                                ? 'opacity-40 cursor-not-allowed bg-purple-600/10 border border-purple-500/20 text-purple-500'
                                : feedback?.isDeep
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:bg-purple-600/30'
                                }`}
                        >
                            <Zap size={10} /> {feedback?.isDeep ? 'DEEP CRITIQUE ACTIVE' : 'REQUEST DEEP CRITIQUE'}
                        </button>
                        {/* 📷 Image Upload Button */}
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*,application/pdf"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                        <button
                            onClick={() => imageInputRef.current?.click()}
                            className="px-3 py-2 text-[10px] font-black rounded-lg transition-all flex items-center justify-center gap-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30"
                            title="Upload a photo of your handwritten or printed essay for AI grading"
                        >
                            📎 SCAN ESSAY / PDF
                        </button>
                    </div>
                    {localAnswer.length > 0 && (
                        <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                            <Shield size={10} /> Auto-saved
                        </span>
                    )}

                    {/* Image Upload Result Panel */}
                    {(imagePreview || imageLoading || imageResult || imageError) && (
                        <div className="mt-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-2">
                                    📷 Essay Vision Analysis
                                </h5>
                                <button
                                    onClick={() => { setImagePreview(null); setImageResult(null); setImageError(null); setImageLoading(false); }}
                                    className="text-[9px] text-gray-500 hover:text-gray-300 transition-colors"
                                >✕ Clear</button>
                            </div>

                            {/* Thumbnail Preview */}
                            {imagePreview && (
                                <div className="flex items-start gap-3">
                                    <img
                                        src={imagePreview}
                                        alt="Uploaded essay"
                                        className="w-24 h-24 object-cover rounded-lg border border-amber-500/20 shrink-0"
                                    />
                                    <p className="text-[9px] text-gray-500 leading-relaxed pt-1">
                                        Gemini is reading your handwriting and applying IB 2026 exam criteria. This may take 10–20 seconds.
                                    </p>
                                </div>
                            )}

                            {/* Loading */}
                            {imageLoading && (
                                <div className="flex flex-col items-center justify-center py-6 space-y-2">
                                    <RefreshCw className="animate-spin text-amber-400" size={20} />
                                    <div className="text-[10px] text-amber-300 font-black uppercase tracking-widest animate-pulse">Reading essay...</div>
                                    <p className="text-[9px] text-gray-500">Gemini Vision is transcribing + grading your work</p>
                                </div>
                            )}

                            {/* Error */}
                            {imageError && !imageLoading && (
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                                    <p className="text-[10px] font-black text-red-400 uppercase mb-1">⚠ Vision Error</p>
                                    <p className="text-[11px] text-red-300">{imageError}</p>
                                </div>
                            )}

                            {/* Result */}
                            {imageResult && !imageLoading && (
                                <div className="space-y-2 animate-in fade-in duration-500">
                                    <div className="flex items-center gap-2">
                                        <div className="h-px flex-1 bg-amber-500/20" />
                                        <div className="text-[9px] font-black text-amber-400 uppercase tracking-tighter">Examiner Vision Feedback</div>
                                        <div className="h-px flex-1 bg-amber-500/20" />
                                    </div>
                                    <div className="text-[11px] text-gray-300 leading-relaxed whitespace-pre-wrap bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 shadow-inner overflow-auto max-h-[500px]">
                                        {imageResult}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {feedback && (
                        <div className={`p-4 rounded-xl border transition-all ${feedback.isDeep ? 'bg-purple-500/5 border-purple-500/30' : 'bg-cyan-500/5 border-cyan-500/20'}`}>
                            <h5 className={`text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 ${feedback.isDeep ? 'text-purple-400' : (feedback.relevanceAlert ? 'text-amber-500' : 'text-cyan-400')}`}>
                                <Zap size={10} /> {feedback.isDeep ? 'Agentic Health Scan' : (feedback.relevanceAlert ? 'Relevance Check Failed' : 'Technical Draft Scan')}
                            </h5>
                            <p className="text-[9px] text-gray-500 mb-3 italic">
                                {feedback.isDeep ? 'Bespoke structural and conceptual audit. Switch to Antigravity for qualitative nuance.' : 'Note: This is a keyword and structure check. It does not read or evaluate your argument. Use Deep Critique for full examiner-level feedback.'}
                            </p>

                            <div className="space-y-4">
                                <ul className="space-y-2">
                                    {feedback.tips.map((tip, i) => (
                                        <li key={i} className="text-[11px] text-gray-400 flex gap-2">
                                            <span className={`${feedback.isDeep ? 'text-purple-500' : (tip.includes('⚠️') ? 'text-amber-500' : 'text-cyan-500')} shrink-0`}>•</span> {tip}
                                        </li>
                                    ))}
                                </ul>

                                {feedback.isDeep && (
                                    <div className="mt-4 pt-4 border-t border-purple-500/20">
                                        {feedback.deepLoading ? (
                                            <div className="flex flex-col items-center justify-center py-8 space-y-3">
                                                <RefreshCw className="animate-spin text-purple-400" size={24} />
                                                <div className="text-[10px] text-purple-300 font-black uppercase tracking-widest animate-pulse">Consulting Gemini 2.5 Flash...</div>
                                                <p className="text-[9px] text-gray-500 italic max-w-xs text-center">Analyzing 1M context tokens for syllabus alignment. This usually takes 5-10 seconds.</p>
                                            </div>
                                        ) : feedback.deepError ? (
                                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">⚠ AI Critique Error</p>
                                                <p className="text-[11px] text-red-300">{feedback.deepError}</p>
                                            </div>
                                        ) : feedback.liveAnalysis ? (
                                            <div className="space-y-4 animate-in fade-in duration-500">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="h-px flex-1 bg-purple-500/20" />
                                                    <div className="text-[9px] font-black text-purple-400 uppercase tracking-tighter">AI Examiner Feedback</div>
                                                    <div className="h-px flex-1 bg-purple-500/20" />
                                                </div>
                                                <div className="text-[11px] text-gray-300 leading-relaxed whitespace-pre-wrap bg-purple-500/5 p-4 rounded-xl border border-purple-500/10 shadow-inner overflow-hidden">
                                                    {feedback.liveAnalysis}
                                                </div>
                                            </div>
                                        ) : feedback.critique && (
                                            <div className="grid gap-3 md:grid-cols-2 animate-in slide-in-from-bottom-2 duration-300">
                                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                                    <h6 className="text-[9px] font-bold text-purple-300 uppercase mb-1">Prompt Alignment</h6>
                                                    <p className="text-[10px] text-gray-400 leading-relaxed">{feedback.critique.relevance}</p>
                                                </div>
                                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                                    <h6 className="text-[9px] font-bold text-purple-300 uppercase mb-1">Conceptual Health</h6>
                                                    <p className="text-[10px] text-gray-400 leading-relaxed">{feedback.critique.concepts}</p>
                                                </div>
                                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                                    <h6 className="text-[9px] font-bold text-purple-300 uppercase mb-1">Evidence Quality</h6>
                                                    <p className="text-[10px] text-gray-400 leading-relaxed">{feedback.critique.evidence}</p>
                                                </div>
                                                <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                                    <h6 className="text-[9px] font-bold text-purple-400 uppercase mb-1">Technical Rigor</h6>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] text-gray-400">Structural Health:</span>
                                                        <span className="text-xs font-black text-purple-400">{feedback.critique.health}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ExamSelector = ({ exams, paperKey, selectedIndex, onChange, color }) => (
    <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 border border-white/10 rounded-xl">
        <FileText size={16} className={`text-${color}-400`} />
        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Practice Mock Exam:</span>
        <select
            value={selectedIndex}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500/50 transition-colors"
        >
            {exams.map((exam, i) => (
                <option key={exam.id} value={i} style={{ background: '#1a1a2e', color: '#fff' }}>
                    {i + 1}. {exam.title}
                </option>
            ))}
        </select>
    </div>
);

// --- Custom Question Panel (module-level to prevent focus-stealing re-renders) ---
const CustomQuestionPanel = ({
    customQuestion, setCustomQuestion,
    customMarks, setCustomMarks,
    customQuestionActive, setCustomQuestionActive,
    timerSeconds, timerRunning, timerLimit, startTimer, toggleTimer, resetTimer, timerColor, formatTime,
    labProps
}) => {
    if (!customQuestionActive || customQuestion.trim().length < 20) {
        return (
            <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                    <h3 className="text-xl font-bold text-purple-400">My Class Essay</h3>
                    <p className="text-xs text-gray-500 mt-1">Paste your teacher-assigned prompt below — then get Quick Analysis, Deep Critique, or upload your handwritten PDF.</p>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 block mb-2">Essay Question / Prompt</label>
                        <textarea
                            className="w-full min-h-[120px] p-4 bg-white/5 border border-purple-500/30 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/60 resize-y"
                            placeholder={`e.g. "To what extent does the rise of emerging powers challenge the existing liberal international order? Refer to at least two case studies." (Paper 2 — 15 marks)`}
                            value={customQuestion}
                            onChange={e => setCustomQuestion(e.target.value)}
                        />
                        <p className="text-[10px] text-gray-600 mt-1">{customQuestion.trim().length} chars — minimum 20 required</p>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Marks Available</label>
                        {[8, 12, 15, 20, 25, 28, 30].map(m => (
                            <button
                                key={m}
                                onClick={() => setCustomMarks(m)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${customMarks === m
                                    ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                                    : 'bg-white/5 border-white/10 text-gray-500 hover:border-purple-500/40'
                                    }`}
                            >{m}</button>
                        ))}
                    </div>
                    <button
                        onClick={() => setCustomQuestionActive(true)}
                        disabled={customQuestion.trim().length < 20}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all"
                    >
                        🚀 Start Practice
                    </button>
                </div>
            </div>
        );
    }

    const q = { num: 1, text: customQuestion, marks: customMarks };
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-purple-400">My Class Essay</span>
                        <span className="text-[9px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-bold">{customMarks} MARKS</span>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed">{customQuestion}</p>
                </div>
                <button
                    onClick={() => setCustomQuestionActive(false)}
                    className="text-[10px] text-gray-500 hover:text-purple-400 border border-white/10 hover:border-purple-500/30 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                >
                    ← Change Question
                </button>
            </div>
            <TimerBar seconds={timerSeconds} running={timerRunning} limit={timerLimit} start={startTimer} toggle={toggleTimer} reset={resetTimer} color={timerColor} formatTime={formatTime} />
            <div className="p-4 bg-white/5 border border-purple-500/20 rounded-xl">
                <PracticeLab q={q} {...labProps} />
            </div>
        </div>
    );
};

const MockExamZone = () => {
    const [subTab, setSubTab] = useState('paper1');
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerLimit, setTimerLimit] = useState(0);
    const [selectedExam, setSelectedExam] = useState({ paper1: 0, paper2: 0, paper3: 0, custom: 0 });
    const [expandedSources, setExpandedSources] = useState([0]);

    // Custom question state
    const [customQuestion, setCustomQuestion] = useState('');
    const [customMarks, setCustomMarks] = useState(15);
    const [customQuestionActive, setCustomQuestionActive] = useState(false);

    // Practice Lab State
    const [userAnswers, setUserAnswers] = useState({});
    const [activeLab, setActiveLab] = useState(null); // { paper, qNum }
    const [analysis, setAnalysis] = useState({}); // { paper-qNum: feedback }

    // Persistence Logic
    useEffect(() => {
        const saved = localStorage.getItem('glopo-practice-lab');
        if (saved) setUserAnswers(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (Object.keys(userAnswers).length > 0) {
            localStorage.setItem('glopo-practice-lab', JSON.stringify(userAnswers));
        }
    }, [userAnswers]);

    const updateAnswer = (key, val) => {
        setUserAnswers(prev => ({ ...prev, [key]: val }));
    };

    // Toggle Source Visibility (Multi-Expand capable)
    const toggleSource = (index) => {
        setExpandedSources(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const requestDeepAnalysis = async (paperKey, q, text) => {
        const key = `${paperKey}-${selectedExam[paperKey]}-${q.num}`;

        // 1. Trigger local scan first for immediate feedback
        analyzeDraft(paperKey, q, text, true);

        // 2. Set loading state for deep analysis
        setAnalysis(prev => ({
            ...prev,
            [key]: { ...prev[key], isDeep: true, deepLoading: true }
        }));

        const IB_SYLLABUS_RUBRIC = `IB GLOBAL POLITICS 2026 — OFFICIAL ASSESSMENT CRITERIA (use these as your scoring framework):

AO1 — KNOWLEDGE & UNDERSTANDING (Band 3 = clear, accurate, relevant knowledge of cases and concepts with supporting detail such as dates, statistics, treaties, and named actors):
  Band 1: Generic or inaccurate — no named cases or concepts
  Band 2: Named cases/concepts but lacking specificity or accuracy
  Band 3: Accurate, detailed knowledge with specific supporting evidence

AO2 — APPLICATION & ANALYSIS (Band 3 = consistent application of a named IR theory with sustained analytical connectives that link evidence to argument):
  Band 1: Descriptive — no theory applied
  Band 2: Theory named but not systematically applied to evidence
  Band 3: Theory applied throughout; connectives ("therefore", "this demonstrates") used consistently
  Valid theories: Realism, Liberalism, Constructivism, Marxism/Structuralism, Feminism, Postcolonialism, Critical Theory

AO3 — SYNTHESIS & EVALUATION (Band 3 = multiple perspectives synthesised, counter-argument addressed, substantiated evaluative judgement reached):
  Band 1: No counter-argument; no evaluation
  Band 2: Counter-argument present OR evaluation present, but not both
  Band 3: Competing perspectives synthesised + explicit evaluative judgement ("To a large extent...", "The evidence suggests...")

AO4 — USE OF KEY CONCEPTS (Band 3 = IB key concepts used precisely, defined contextually, integrated into the argument rather than mentioned decoratively):
  4 Core Concepts: Power, Sovereignty, Legitimacy, Interdependence
  Global Challenges (HL): Security, Development, Environment, Equality, Health, Identity, Technology, Poverty
  Band 1: Concepts absent or used as buzzwords
  Band 2: Concepts used but not defined or analysed
  Band 3: Concepts defined in context AND used as analytical lenses throughout

PAPER CONTEXTS:
  Paper 1 (Source-Based): OPVL analysis of 2–3 sources + structured response; 30 marks; SL & HL
  Paper 2 (Extended Essay): Two case studies explore one IB concept; 1,200–2,000 words; 40 marks; SL & HL
  Paper 3 (HL only): Stimulus-based global challenge response; 2,500 words; 40 marks`;

        const systemInstruction = `You are an IB Global Politics Senior Examiner for the 2026 syllabus.
Your feedback must be:
- Directly tied to IB 2026 AO1–AO4 mark bands (always cite the band the student is at)
- Strictly unbiased and politically neutral — evaluate analytical skill, not political position
- Specific: quote the student's words when praising or critiquing
- Actionable: every growth point must include an example of what better looks like

${IB_SYLLABUS_RUBRIC}`;

        const prompt = `${systemInstruction}

---
QUESTION: ${q.text}
PAPER / MARKS: ${q.marks || 15} marks

STUDENT RESPONSE:
${text}
---

Provide detailed, syllabus-aligned examiner feedback using the sections below.

## 🟢 GLOW — What the Student Did Well
For each strength, cite the AO it meets and the mark band achieved. Quote specific phrases from the response.
(Format: "[AO2 — Band 3] The student writes '...' — this demonstrates consistent application of [theory] because...")

## 🔴 GROW — Specific Areas for Improvement
For each gap, state the AO being missed, the current band, and what is required to reach the next band.
Give a concrete example of what the improved version would look like.
(Format: "[AO3 — currently Band 1 → target Band 3]: No counter-argument is present. To reach Band 3, add: 'However, a Constructivist perspective would argue...'")

## 🔵 ALTERNATIVE PERSPECTIVES
Suggest 2–3 alternative theoretical lenses or case studies the student could use to approach this question differently. For each, explain the specific analytical angle it would open up.
(Format: "Through a Feminist lens: instead of focusing on state power, examine how gender hierarchies shape [specific aspect of the question]...")

## ⭐ IB EXAMINER'S GOLDEN TIP
One precise, actionable tip that would most significantly raise this response's mark band. Make it specific to this student's work, not generic advice.`;

        let analysisText = null;

        // Strategy 1: Try Netlify function — skipped on localhost (not available via npm start)
        const isLocalDev = window.location.hostname === 'localhost';
        if (!isLocalDev) try {
            const response = await fetch("/.netlify/functions/analyze-essay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ essayText: text, questionText: q.text, marks: q.marks || 15 }),
                signal: AbortSignal.timeout(25000)
            });

            if (response.ok) {
                const data = await response.json();
                if (data.analysis) analysisText = data.analysis;
            } else if (response.status === 429) {
                console.log("Rate limited on first attempt, retrying in 3s...");
                await new Promise(r => setTimeout(r, 3000));
                const retry = await fetch("/.netlify/functions/analyze-essay", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ essayText: text, questionText: q.text, marks: q.marks || 15 }),
                    signal: AbortSignal.timeout(25000)
                });
                if (retry.ok) {
                    const data = await retry.json();
                    if (data.analysis) analysisText = data.analysis;
                } else {
                    setAnalysis(prev => ({ ...prev, [key]: { ...prev[key], deepLoading: false, deepError: "Temporarily rate-limited. Please wait 30 seconds and try again." } }));
                    return;
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error("Netlify function error:", response.status, errorData.error);
                if (errorData.error?.includes("configured")) {
                    setAnalysis(prev => ({ ...prev, [key]: { ...prev[key], deepLoading: false, deepError: "Gemini API Key not configured in Netlify Site Settings." } }));
                    return;
                }
            }
        } catch (e) {
            console.log("Netlify function unavailable or timed out, checking local fallback.");
        }

        // Strategy 2: Direct Gemini API call (local key or production get-token proxy)
        if (!analysisText) {
            let apiKey = process.env.REACT_APP_GEMINI_API_KEY;
            if (!apiKey) {
                try {
                    const tkRes = await fetch('/.netlify/functions/get-token', { signal: AbortSignal.timeout(5000) });
                    if (tkRes.ok) { const tkData = await tkRes.json(); apiKey = tkData.key; }
                } catch { }
            }
            console.log("🔑 Gemini API key present:", !!apiKey);
            if (!apiKey) {
                setAnalysis(prev => ({ ...prev, [key]: { ...prev[key], deepLoading: false, deepError: "AI not available. Please contact your teacher." } }));
                return;
            }
            try {
                const geminiResponse = await geminiRetryFetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }]
                        })
                    }
                );

                if (!geminiResponse.ok) {
                    throw new Error(`Gemini API error: ${geminiResponse.status} ${geminiResponse.statusText}`);
                }

                const geminiData = await geminiResponse.json();
                console.log("🤖 Gemini raw response:", JSON.stringify(geminiData).slice(0, 500));
                analysisText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!analysisText) {
                    const reason = geminiData?.promptFeedback?.blockReason || geminiData?.candidates?.[0]?.finishReason || "Unknown";
                    throw new Error(`Gemini returned no text. Reason: ${reason}. Check console for full response.`);
                }
            } catch (error) {
                console.error("Direct Gemini API Error:", error);
                setAnalysis(prev => ({ ...prev, [key]: { ...prev[key], deepLoading: false, deepError: error.message } }));
                return;
            }
        }

        setAnalysis(prev => ({
            ...prev,
            [key]: { ...prev[key], isDeep: true, deepLoading: false, liveAnalysis: analysisText }
        }));

        // Also copy prompt to clipboard as a fallback reference
        navigator.clipboard.writeText(prompt).catch(() => { });
    };

    // Feedback Logic - Local Rubric Engine (Now: Technical Draft Scan)
    const analyzeDraft = (paperKey, q, text, isDeep = false) => {
        const key = `${paperKey}-${selectedExam[paperKey]}-${q.num}`;
        let feedback = { score: 'Drafting...', tips: [], isDeep: isDeep };

        if (!text || text.length < 20) {
            feedback.tips.push("Response is too short. Try to elaborate further.");
            setAnalysis(prev => ({ ...prev, [key]: feedback }));
            return;
        }

        const lowerText = text.toLowerCase();

        // 1. Relevance Guard
        if (q.coreConcepts) {
            const overlap = q.coreConcepts.filter(c => lowerText.includes(c.toLowerCase()));
            const relevanceScore = (overlap.length / q.coreConcepts.length) * 100;

            if (relevanceScore < 20) {
                feedback.tips.push("⚠️ RELEVANCE WARNING: Your draft does not seem to address the specific core concepts of the question. Check your focus.");
                feedback.relevanceAlert = true;
            } else if (relevanceScore > 60) {
                feedback.tips.push("✅ Strong alignment with prompt-specific terminology.");
            }
        }

        // 2. Concept Scanner
        const conceptsFound = GLOSSARY_TERMS.filter(t => lowerText.includes(t.toLowerCase()));
        if (conceptsFound.length > 0) {
            feedback.tips.push(`✅ Solid concept usage: ${conceptsFound.slice(0, 3).join(', ')}.`);
        } else {
            feedback.tips.push("❌ Link to core IB concepts (Power, Sovereignty, etc.).");
        }

        // 3. Case Linker
        const casesFound = GLOBAL_CASES.filter(c => lowerText.includes(c.name.toLowerCase()));
        if (casesFound.length > 0) {
            feedback.tips.push(`✅ Referenced case study: ${casesFound[0].name}.`);
        } else if (paperKey === 'paper2' || (paperKey === 'paper1' && q.marks >= 8)) {
            feedback.tips.push("⚠️ Missing specific real-world case studies for supporting evidence.");
        }

        // 4. Structural Rubric (PEEL / Intro)
        if (lowerText.length > 100) {
            if (paperKey === 'paper2' && q.num === 1) {
                const hasThesis = lowerText.includes("argue") || lowerText.includes("claim") || lowerText.includes("demonstrate") || lowerText.includes("thesis");
                const hasRoadmap = lowerText.includes("firstly") || lowerText.includes("initially") || lowerText.includes("secondly") || lowerText.includes("finally") || lowerText.includes("explore");
                if (hasThesis && hasRoadmap) feedback.tips.push("✅ Introduction structure looks strong (Thesis + Roadmap detected).");
                else if (!hasThesis) feedback.tips.push("⚠️ Introduction: Ensure you have a clear thesis statement (your main claim).");
                else if (!hasRoadmap) feedback.tips.push("⚠️ Introduction: Add a brief roadmap of the arguments you will explore.");
            }
            const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 5);
            if (sentences.length >= 4) {
                const hasEvidence = lowerText.includes("for example") || lowerText.includes("case study") || lowerText.includes("specifically") || lowerText.includes("instance");
                const hasLink = lowerText.includes("consequently") || lowerText.includes("therefore") || lowerText.includes("link") || lowerText.includes("thus") || lowerText.includes("proving");
                if (hasEvidence && hasLink) feedback.tips.push("✅ Strong PEEL paragraph structure (Evidence and Link detected).");
                else if (!hasEvidence) feedback.tips.push("⚠️ PEEL: Your paragraphs need specific evidence/examples to support points.");
                else if (!hasLink) feedback.tips.push("⚠️ PEEL: Remember to explicitly link your analysis back to the question/thesis.");
            }
        }

        // 5. Technical Health Score (Simulation)
        if (isDeep) {
            feedback.critique = {
                relevance: feedback.relevanceAlert ? "Potential Irrelevance: Draft lacks question-specific terminology." : "Strong Focus: Response aligns well with the prompt's core concepts.",
                concepts: conceptsFound.length > 2 ? "High conceptual density. You are successfully synthesizing abstract themes." : "Basic conceptual application. Try connecting concepts to show interdependency.",
                evidence: casesFound.length > 0 ? `Good use of ${casesFound[0].name}. Ensure you analyze its impact on different levels (local/global).` : "Evidence is currently generic. Refer to specific actors, dates, or outcomes.",
                structure: lowerText.length > 500 ? "Sophisticated development of ideas across paragraphs." : "Structure is functional but needs more 'Evaluation' (looking at alternative views).",
                health: Math.min(100, (lowerText.length / 700) * 100 + (conceptsFound.length * 5)).toFixed(0) + "% Structural Health"
            };
        }

        setAnalysis(prev => ({ ...prev, [key]: feedback }));
    };

    useEffect(() => {
        let interval;
        if (timerRunning && timerSeconds > 0) {
            interval = setInterval(() => setTimerSeconds(s => s - 1), 1000);
        } else if (timerSeconds === 0 && timerRunning) {
            setTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [timerRunning, timerSeconds]);

    const startTimer = (minutes) => {
        setTimerLimit(minutes * 60);
        setTimerSeconds(minutes * 60);
        setTimerRunning(true);
    };
    const toggleTimer = () => setTimerRunning(!timerRunning);
    const resetTimer = () => { setTimerRunning(false); setTimerSeconds(timerLimit); };

    const formatTime = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    const timerColor = timerSeconds < 300 && timerRunning ? 'text-red-400' : timerSeconds < 900 && timerRunning ? 'text-amber-400' : 'text-white';

    const LabProps = (paperKey) => ({
        paperKey,
        selectedExamIndex: selectedExam[paperKey],
        userAnswers,
        updateAnswer,
        analysis,
        analyzeDraft,
        requestDeepAnalysis,
        activeLab,
        setActiveLab
    });

    const Paper1 = () => {
        const exam = paper1Exams[selectedExam.paper1];
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-blue-400">Paper 1: Source Analysis</h3>
                        <p className="text-xs text-gray-500 mt-1">Foundational unit: {exam.unit}</p>
                    </div>
                    <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-tighter">
                        1h 15m | 25 Marks
                    </div>
                </div>
                <TimerBar seconds={timerSeconds} running={timerRunning} limit={timerLimit} start={startTimer} toggle={toggleTimer} reset={resetTimer} color={timerColor} formatTime={formatTime} />
                <ExamSelector exams={paper1Exams} paperKey="paper1" selectedIndex={selectedExam.paper1} onChange={(v) => setSelectedExam(prev => ({ ...prev, paper1: v }))} color="blue" />
                <div className="mb-4 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[10px] text-blue-300 italic">
                    Note: Original mock simulation.
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-3">
                        <div className="text-[9px] text-gray-500 font-bold uppercase mb-2">Stimulus Materials (Multiple can be open)</div>
                        {exam.sources.map((src, i) => (
                            <div key={i} className={`p-4 border rounded-xl cursor-pointer transition-all ${expandedSources.includes(i) ? 'bg-blue-900/20 border-blue-500/40' : 'bg-white/5 border-white/10 hover:border-blue-500/30'}`} onClick={() => toggleSource(i)}>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{src.label}</p>
                                    <ChevronRight size={14} className={`transition-transform ${expandedSources.includes(i) ? 'rotate-90' : ''}`} />
                                </div>
                                <p className="text-[10px] text-gray-500 italic mb-2 line-clamp-1">{src.citation}</p>
                                {expandedSources.includes(i) && (
                                    <div className="mt-4 pt-4 border-t border-white/10" onClick={e => e.stopPropagation()}>
                                        <SourceText text={src.text} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        {exam.questions.map((q, i) => (
                            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl relative">
                                <span className="absolute top-0 right-0 bg-blue-500/10 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded-bl-lg">{q.marks} MARKS</span>
                                <h4 className="text-xs font-bold text-blue-300 mb-2">Question {q.num}</h4>
                                <p className="text-xs text-gray-300 leading-relaxed">{q.text}</p>
                                <PracticeLab q={q} {...LabProps('paper1')} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const Paper2 = () => {
        const exam = paper2Exams[selectedExam.paper2];
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <h3 className="text-xl font-bold text-emerald-400">Paper 2: Extended Response</h3>
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-tighter">
                        1h 45m | 30 Marks
                    </div>
                </div>
                <TimerBar seconds={timerSeconds} running={timerRunning} limit={timerLimit} start={startTimer} toggle={toggleTimer} reset={resetTimer} color={timerColor} formatTime={formatTime} />
                <ExamSelector exams={paper2Exams} paperKey="paper2" selectedIndex={selectedExam.paper2} onChange={(v) => setSelectedExam(prev => ({ ...prev, paper2: v }))} color="emerald" />
                <div className="mb-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[10px] text-emerald-300 italic">
                    Note: Original mock simulation.
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {[exam.sectionA, exam.sectionB].map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h4 className="text-sm font-bold text-emerald-400 border-b border-white/10 pb-2">{section.label}</h4>
                            {section.questions.map((q, i) => (
                                <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                    <p className="text-xs text-gray-300 leading-relaxed"><span className="font-bold text-emerald-500 mr-2">{q.num}.</span>{q.text}</p>
                                    <PracticeLab q={q} {...LabProps('paper2')} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const Paper3 = () => {
        const exam = paper3Exams[selectedExam.paper3];
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-red-500">Paper 3: Global Challenges</h3>
                        <p className="text-xs text-gray-500 mt-1">Challenge: {exam.challenge}</p>
                    </div>
                    <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-bold uppercase tracking-tighter">
                        1h 30m | 28 Marks
                    </div>
                </div>
                <TimerBar seconds={timerSeconds} running={timerRunning} limit={timerLimit} start={startTimer} toggle={toggleTimer} reset={resetTimer} color={timerColor} formatTime={formatTime} />
                <ExamSelector exams={paper3Exams} paperKey="paper3" selectedIndex={selectedExam.paper3} onChange={(v) => setSelectedExam(prev => ({ ...prev, paper3: v }))} color="red" />
                <div className="mb-4 p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-[10px] text-red-300 italic">
                    Note: Original mock simulation.
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h4 className="text-sm font-bold text-red-400 mb-4">Stimulus Material</h4>
                        <SourceText text={exam.stimulus} />
                    </div>
                    <div className="space-y-4">
                        {exam.questions.map((q, i) => (
                            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl relative">
                                <span className="absolute top-0 right-0 bg-red-500/10 text-red-400 text-[10px] font-black px-2 py-0.5 rounded-bl-lg">{q.marks} MARKS</span>
                                <h4 className="text-xs font-bold text-red-400 mb-2">Question {q.num}</h4>
                                <p className="text-xs text-gray-300 leading-relaxed">{q.text}</p>
                                <PracticeLab q={q} {...LabProps('paper3')} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="text-blue-500" /> Mock Exam Zone
            </h2>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: 'paper1', label: 'Paper 1 (25 marks)', color: 'blue' },
                    { id: 'paper2', label: 'Paper 2 (30 marks)', color: 'emerald' },
                    { id: 'paper3', label: 'Paper 3 (28 marks)', color: 'red' },
                    { id: 'custom', label: '✏️ My Class Essay', color: 'purple' }
                ].map(b => (
                    <button
                        key={b.id}
                        onClick={() => { setSubTab(b.id); resetTimer(); setExpandedSources([0]); }}
                        className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border-2 ${subTab === b.id
                            ? `bg-${b.color}-600/10 border-${b.color}-500 text-white shadow-lg shadow-${b.color}-500/10`
                            : "bg-white/5 border-transparent text-gray-500 hover:bg-white/10"
                            }`}
                    >
                        {b.label}
                    </button>
                ))}
            </div>

            <Card className={subTab === 'paper1' ? "border-blue-500/20" : subTab === 'paper2' ? "border-emerald-500/20" : subTab === 'paper3' ? "border-red-500/20" : "border-purple-500/20"}>
                {subTab === 'paper1' && <Paper1 />}
                {subTab === 'paper2' && <Paper2 />}
                {subTab === 'paper3' && <Paper3 />}
                {subTab === 'custom' && <CustomQuestionPanel
                    customQuestion={customQuestion} setCustomQuestion={setCustomQuestion}
                    customMarks={customMarks} setCustomMarks={setCustomMarks}
                    customQuestionActive={customQuestionActive} setCustomQuestionActive={setCustomQuestionActive}
                    timerSeconds={timerSeconds} timerRunning={timerRunning} timerLimit={timerLimit}
                    startTimer={startTimer} toggleTimer={toggleTimer} resetTimer={resetTimer}
                    timerColor={timerColor} formatTime={formatTime}
                    labProps={LabProps('custom')}
                />}
            </Card>
        </div>
    );
};



// --- Lore & Lexicon Component ---
const LoreLexicon = () => {
    const [glossary, setGlossary] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTheme, setActiveTheme] = useState('All');

    useEffect(() => {
        fetch('/glossary.json')
            .then(r => r.json())
            .then(data => setGlossary(data))
            .catch(() => { });
    }, []);

    const themes = ['All', ...new Set(Object.values(CONCEPT_THEMES).map(t => t.theme))];

    const filteredKeys = Object.keys(glossary).filter(key => {
        const matchesSearch = key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            glossary[key].toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTheme = activeTheme === 'All' ||
            CONCEPT_THEMES[key]?.theme === activeTheme ||
            (activeTheme === 'HL Global Challenges' && key === 'Equality');
        return matchesSearch && matchesTheme;
    }).sort();

    const getThemeStyles = (concept) => {
        const color = CONCEPT_THEMES[concept]?.color || 'cyan';
        const colorMap = {
            blue: 'text-blue-400 border-blue-500/20 bg-blue-500/5 hover:border-blue-500/50 shadow-blue-500/5 hover:shadow-blue-500/10',
            purple: 'text-purple-400 border-purple-500/20 bg-purple-500/5 hover:border-purple-500/50 shadow-purple-500/5 hover:shadow-purple-500/10',
            emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/50 shadow-emerald-500/5 hover:shadow-emerald-500/10',
            red: 'text-red-400 border-red-500/20 bg-red-500/5 hover:border-red-500/50 shadow-red-500/5 hover:shadow-red-500/10',
            amber: 'text-amber-400 border-amber-500/20 bg-amber-500/5 hover:border-amber-500/50 shadow-amber-500/5 hover:shadow-amber-500/10'
        };
        return colorMap[color] || colorMap.blue;
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black flex items-center gap-3">
                            <FileText className="text-cyan-400" size={32} />
                            IB Concept <span className="text-cyan-400">Glossary</span>
                        </h2>
                        <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">16 Authoritative IB Core Concepts</p>
                    </div>
                    <div className="relative group min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search concepts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {themes.map(t => (
                        <button
                            key={t}
                            onClick={() => setActiveTheme(t)}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${activeTheme === t
                                ? "bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10"
                                : "bg-transparent border-white/10 text-gray-500 hover:border-white/20"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {filteredKeys.map(concept => {
                    const styles = getThemeStyles(concept);
                    const themeObj = CONCEPT_THEMES[concept] || { theme: "General", color: "cyan" };
                    return (
                        <div key={concept} className={`border p-6 rounded-2xl transition-all hover:shadow-lg group ${styles}`}>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:opacity-80 transition-opacity flex items-center justify-between">
                                {concept}
                                <span className={`text-[10px] uppercase tracking-tighter border px-2 py-0.5 rounded-full font-black ${styles.split(' ')[1]} ${styles.split(' ')[0]}`}>
                                    {themeObj.theme}
                                </span>
                            </h3>
                            <div className="text-sm text-gray-400 leading-relaxed font-medium">
                                {glossary[concept] && glossary[concept].includes('\n') ? (
                                    <ul className="space-y-2 list-none">
                                        {glossary[concept].split('\n').map((line, idx) => (
                                            <li key={idx} className="flex gap-2">
                                                <span className="text-cyan-500/50 mt-1">•</span>
                                                <span>{line.replace(/^- \*\*[^*]+\*\*: /, '').replace(/^- /, '')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>{glossary[concept]}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
                {filteredKeys.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-gray-500 font-bold uppercase tracking-widest">No matching concepts found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Glossary Provider ---
const GlossaryProvider = () => {
    useEffect(() => {
        fetch('/glossary.json')
            .then(r => r.json())
            .then(data => {
                // Normalize keys to lowercase for robust matching
                const glossary = {};
                Object.keys(data).forEach(key => {
                    glossary[key.toLowerCase()] = data[key];
                });

                const attachTooltips = () => {
                    if (typeof window.tippy === 'undefined') {
                        setTimeout(attachTooltips, 500);
                        return;
                    }
                    document.querySelectorAll('.glossary-term').forEach(el => {
                        if (el._tippy) return;
                        const termRaw = el.textContent.trim();
                        const termKey = termRaw.toLowerCase();
                        const def = glossary[termKey];
                        if (def) {
                            // Find matching concept for theme color
                            const conceptMatch = GLOSSARY_TERMS.find(t => t.toLowerCase() === termKey);
                            const themeData = conceptMatch ? CONCEPT_THEMES[conceptMatch] : null;
                            const color = themeData ? themeData.color : 'blue';
                            const colors = {
                                blue: 'border-blue-500/50 bg-blue-600/20 text-blue-400',
                                purple: 'border-purple-500/50 bg-purple-600/20 text-purple-400',
                                emerald: 'border-emerald-500/50 bg-emerald-600/20 text-emerald-400',
                                red: 'border-red-500/50 bg-red-600/20 text-red-400',
                                amber: 'border-amber-500/50 bg-amber-600/20 text-amber-400'
                            };
                            const colorStyle = colors[color] || colors.blue;

                            const formattedDef = def.includes('\n')
                                ? `<ul class="space-y-1 list-none mt-1">
                                    ${def.split('\n').map(l => `<li class="text-[11px] leading-tight"><span class="opacity-40 mr-1">•</span>${l.replace(/^- /, '')}</li>`).join('')}
                                   </ul>`
                                : `<div class="text-white text-sm font-medium leading-relaxed">${def}</div>`;

                            window.tippy(el, {
                                content: `<div class="p-2 border rounded-lg ${colorStyle} backdrop-blur-md max-w-xs shadow-2xl">
                                    <div class="flex items-center justify-between gap-4 mb-1 border-b border-white/10 pb-1">
                                        <span class="text-[9px] font-black uppercase tracking-widest opacity-70">IB Concept</span>
                                        <span class="text-[8px] font-black uppercase tracking-tighter opacity-50">${themeData?.theme || 'General'}</span>
                                    </div>
                                    ${formattedDef}
                                </div>`,
                                allowHTML: true,
                                animation: 'shift-away',
                                theme: 'glopo',
                                placement: 'top',
                                interactive: true,
                                appendTo: document.body
                            });
                        }
                    });
                };
                const observer = new MutationObserver(attachTooltips);
                observer.observe(document.body, { childList: true, subtree: true });
                attachTooltips();
            })
            .catch(() => { });
    }, []);
    return null;
};

// --- Main App ---
// --- Ops Room (station data & sub-components at module level) ---

const FLASHCARD_DEFS = {
    "Power": "The ability of an actor to influence or control the behaviour of other actors. Can be hard (coercive) or soft (persuasive).",
    "Sovereignty": "The supreme authority of a state to govern itself within its territory without external interference — the basis of the Westphalian order.",
    "Legitimacy": "The quality of being accepted and recognised as rightful. A government may have power without legitimacy, such as after a coup.",
    "Interdependence": "A relationship where states are mutually reliant; disruption for one affects others. Can be symmetrical or asymmetrical.",
    "Human rights": "Rights inherent to all humans regardless of nationality, sex, ethnicity, or religion — often debated as universal vs. culturally relative.",
    "Justice": "The fair and equitable treatment of individuals and groups. In GP, justice includes distributive, restorative, and procedural dimensions.",
    "Liberty": "Freedom from oppression or coercion by government or other actors. Negative liberty = freedom from interference; positive = capacity to act.",
    "Equality": "The state of being equal in rights, status, or opportunity. Global inequality is a structural outcome of the Core-Periphery system.",
    "Development": "The process of improving living standards and freedoms. Measured variously by GDP, HDI, SDGs. Contested: top-down vs. bottom-up.",
    "Sustainability": "Meeting the needs of the present without compromising the ability of future generations to meet their own needs (Brundtland, 1987).",
    "Peace": "More than the absence of war — positive peace includes justice, equality, and the elimination of structural violence (Galtung).",
    "Conflict": "A clash of interests between actors. Can be violent or non-violent, interstate or intrastate, overt or structural.",
    "Violence": "The use of force to harm. Includes direct violence (physical), structural violence (systemic injustice), and cultural violence (norms).",
    "Non-violence": "Political action that rejects physical force. Includes civil disobedience, sanctions, and diplomacy as tools of change.",
    "Globalization": "The intensification of global flows of goods, capital, people, and ideas. Creates interdependence but also inequality and cultural tension.",
    "Inequality": "Unequal distribution of resources, opportunities, or power between individuals, states, or regions — a key driver of global instability.",
    "Borders": "Lines defining the territorial limits of sovereign states. Can be physical, legal, digital. Increasingly contested in a globalised world.",
    "Security": "Freedom from threats to survival or wellbeing. Encompasses national, human, environmental, and cyber security dimensions.",
    "Environment": "The natural world, increasingly threatened by industrial activity. Environmental degradation is a threat multiplier for conflict and poverty.",
    "Health": "A state of complete physical, mental, and social wellbeing. Framed as a human right and a global public good requiring collective action.",
    "Poverty": "Deprivation of basic needs and capabilities. Absolute poverty (survival) vs. relative poverty (social participation). Structural in origin.",
    "Identity": "The sense of self — individual, national, or civilisational. Constructed through shared norms, history, and narratives (Constructivism).",
    "Technology": "Tools and innovations shaping how states, actors, and individuals interact. A contested arena of power, surveillance, and emancipation."
};

const THEORY_QUOTES = [
    { quote: "China's island-building in the South China Sea is a rational response to the anarchic international system — states must maximize power to survive.", answer: "Realism", explanation: "Power maximization in anarchy = core Realist logic. Every state acts to secure its survival." },
    { quote: "The AU's permanent inclusion in the G20 shows that multilateral institutions can evolve to better reflect the principle of equal participation.", answer: "Liberalism", explanation: "Institutional reform toward greater inclusivity is a hallmark of Liberal thinking about cooperative global governance." },
    { quote: "Boko Haram's rise reflects the structural underdevelopment of Northern Nigeria — violence is the rational response of a marginalized periphery.", answer: "Structuralism", explanation: "Core-Periphery hierarchy producing structural violence = Structuralist / World Systems analysis." },
    { quote: "Meta's extraction of user data for profit mirrors 19th-century enclosures — the digital commons is being privatized by transnational capital.", answer: "Marxism", explanation: "Capital accumulation through data extraction, digital enclosures — classic Marxist critique of capitalist expansion." },
    { quote: "Turkiye's 'strategic autonomy' is not just a policy — it is a performance of a distinct civilizational identity that refuses Western or Eastern labels.", answer: "Constructivism", explanation: "Identity is socially constructed and shapes state interests — this is the core Constructivist argument." },
    { quote: "The peace negotiations in the Sahel excluded women at every level, perpetuating a masculine security framework that ignored human security entirely.", answer: "Feminism", explanation: "Feminist IR critiques the exclusion of women from decision-making and challenges militarized security frameworks." },
    { quote: "The BRI's 99-year port lease in Sri Lanka is a 21st-century version of the unequal treaties — debt replacing gunboats as the tool of control.", answer: "Postcolonialism", explanation: "Neo-colonial dependency relationships, unequal treaties, and Global South sovereignty — core Postcolonial concerns." },
    { quote: "The US IRA subsidies are not really about climate — they are a geopolitical tool to secure American dominance in the next century's energy order.", answer: "Realism", explanation: "Green Mercantilism — using environmental policy as cover for national interest and power competition." },
    { quote: "Myanmar shows the failure of R2P: without binding institutional enforcement, human rights norms dissolve whenever they conflict with sovereignty.", answer: "Liberalism", explanation: "Liberal institutionalism argues norms and institutions are essential; their failure here is a Liberals' tragedy." },
    { quote: "COP28's fossil fuel lobby presence demonstrates that climate governance serves the interests of capital, not the planet or the Global South.", answer: "Marxism", explanation: "Class interests and capital accumulation driving 'green' policy inaction — Marxist political economy of climate." },
    { quote: "The Arctic is not just melting ice — it is a socially constructed strategic arena where states must 'perform' their Arctic identity to gain legitimacy.", answer: "Constructivism", explanation: "China calling itself a 'near-Arctic state' is pure identity construction — interests are created through discourse." },
    { quote: "The Chibok kidnappings reveal how gender-based violence is weaponized as a deliberate tool to undermine the social fabric of resistant communities.", answer: "Feminism", explanation: "Feminist IR centres gendered violence as a structural feature of armed conflict, not a side effect." },
    { quote: "Western-designed human rights norms impose a European liberal framework on societies with radically different histories of justice and community.", answer: "Postcolonialism", explanation: "The 'universal' in universal human rights masks Western epistemic hegemony — Postcolonial critique at its core." },
    { quote: "The G20's debt rules allow wealthy Core nations to subsidize their revival while the Periphery drowns in loan conditions that deepen dependency.", answer: "Structuralism", explanation: "Core-Periphery analysis of international financial architecture — structural inequality reproduced through institutions." },
];

const SOURCE_LAB_ITEMS = [
    {
        id: 'sl1',
        title: '"The Responsibility to Protect: A New Era of Humanitarian Intervention"',
        attribution: 'UN Secretary-General Kofi Annan, Address to the General Assembly, September 1999',
        excerpt: 'If humanitarian intervention is, indeed, an unacceptable assault on sovereignty, how should we respond to a Rwanda, to a Srebrenica -- to gross and systematic violations of human rights that offend every precept of our common humanity? The tragedy of Kosovo has prompted a renewed debate on the question. The debate has laid bare deep divisions within the international community. Some have challenged the legal basis for NATO action. Many more have questioned the motives behind it. The legitimacy of humanitarian intervention is more than a legal question. It goes to the heart of our understanding of statehood, of the meaning of sovereignty, and of the obligations that states owe not only to each other but to humanity as a whole. In an era of interdependence, when the suffering of one is the responsibility of all, we must develop a new doctrine that does not allow sovereignty to become a shield for mass murder. We must ask ourselves whether the United Nations Charter -- and the international order it underpins -- was designed to protect the individual or the state. These are not comfortable questions. But they are questions we can no longer avoid.',
        modelOPVL: {
            origin: 'UN Secretary-General Kofi Annan in a formal address to the General Assembly in September 1999, in the aftermath of NATO\'s Kosovo intervention and the Rwandan genocide. Annan was a Ghanaian diplomat who served as UN Secretary-General from 1997 to 2006.',
            purpose: 'To challenge the international community to reconsider the absolute nature of state sovereignty in the face of mass atrocities, and to lay groundwork for what would become the Responsibility to Protect doctrine formalised in 2005.',
            value: 'Highly significant as a primary source from the world\'s highest diplomatic office -- it directly shaped the intellectual trajectory of R2P and reveals the normative tension between sovereignty and human rights at the highest institutional level.',
            limitation: 'As a speech aimed at political persuasion, it uses emotionally charged examples (Rwanda, Srebrenica) selectively and does not engage with the arguments of China, Russia, and Global South states who feared "humanitarian" pretexts for great power interference.'
        }
    },
    {
        id: 'sl2',
        title: '"China Will Not Tolerate Foreign Interference in Its Internal Affairs"',
        attribution: 'Official statement by the Chinese Ministry of Foreign Affairs following UN Security Council debate on Xinjiang, July 2022',
        excerpt: 'China firmly opposes the politicisation of human rights issues and the use of human rights as a pretext for interference in other countries\' internal affairs. Xinjiang-related issues are entirely China\'s internal affairs. The Chinese government has the right and responsibility to protect its citizens from terrorism, extremism, and separatism, as recognised by international law. The so-called concerns raised by certain Western governments are based on lies and disinformation fabricated by hostile forces seeking to destabilise China. We urge those countries to respect the basic norms governing international relations, stop interfering in China\'s domestic affairs, and reflect on their own human rights records. More than 80 countries have expressed understanding and support for China\'s position. We welcome all those willing to visit Xinjiang to see the truth for themselves. China is committed to multilateralism and international cooperation -- but cooperation cannot mean accepting the diktat of a handful of Western nations who speak loudly of human rights while committing violations of their own.',
        modelOPVL: {
            origin: 'An official position statement published by the Chinese Ministry of Foreign Affairs in July 2022, following intensified international focus on alleged human rights abuses against Uyghur Muslims in Xinjiang.',
            purpose: 'To deflect international criticism by framing Chinese policy as a legitimate counter-terrorism measure and reframing the debate as an attack on sovereignty by Western powers with their own human rights failings.',
            value: 'Valuable as a primary source revealing how China officially frames the Xinjiang situation -- it illustrates the Realist-Westphalian counter-narrative to R2P that many Global South states find compelling.',
            limitation: 'Highly partisan government propaganda -- it presents no acknowledgement of the substantial evidence from former detainees, leaked documents, and satellite imagery. The claim that "80+ countries support China" conflates diplomatic silence with genuine endorsement.'
        }
    },
    {
        id: 'sl3',
        title: '"Youth-Led Climate Action and the Language of Rights"',
        attribution: 'Greta Thunberg, speech at the United Nations Climate Action Summit, New York, September 2019',
        excerpt: 'My message is that we will be watching you. This is all wrong. I should not be up here. I should be back in school on the other side of the ocean. Yet you all come to us young people for hope. How dare you! You have stolen my dreams and my childhood with your empty words. And yet I am one of the lucky ones. People are suffering. People are dying. Entire ecosystems are collapsing. We are in the beginning of a mass extinction, and all you can talk about is money and fairy tales of eternal economic growth. How dare you! For more than 30 years, the science has been crystal clear. How dare you continue to look away and come here saying that you are doing enough, when the politics and solutions needed are still nowhere in sight. You say you love your children above all else, and yet you are stealing their future in front of their very eyes. Until you start focusing on what needs to be done rather than what is politically possible, there is no hope. We will not let you get away with this.',
        modelOPVL: {
            origin: 'Swedish climate activist Greta Thunberg, speaking before world leaders at the UN Climate Action Summit in New York, September 2019, aged 16. Thunberg began her school strikes for climate in August 2018.',
            purpose: 'To directly challenge heads of state on climate inaction, using moral and emotional pressure to demand immediate emissions reductions rather than incremental political compromise.',
            value: 'Significant as a primary source revealing the rhetorical strategies of youth climate activism -- the deliberate use of anger, grief, and intergenerational justice framing to shift political discourse.',
            limitation: 'As an advocacy speech, it does not distinguish between the responsibilities of high-emitting states versus developing economies, making it stronger as mobilising rhetoric than as policy analysis.'
        }
    },
    {
        id: 'sl4',
        title: '"The Limits of Multilateralism: The UN in an Age of Great Power Competition"',
        attribution: 'Editorial, The Economist, March 2022, published following Russia\'s invasion of Ukraine',
        excerpt: 'The United Nations was built on a flaw: it gave veto power over collective security to the five states most likely to threaten it. Russia\'s invasion of Ukraine has put that flaw on full display. In the 77 years since San Francisco, the Security Council has been paralysed at every moment of genuine danger involving a permanent member or its close allies. Korea, Suez, Vietnam, Afghanistan, Iraq -- the list of crises in which P5 self-interest has trumped collective security is longer than its defenders care to admit. The Charter\'s authors knew this. They gambled that great power unity would outlast the rivalry that produced the Cold War. They lost. Russia\'s invasion is not merely a legal violation of Article 2(4): it is an ideological challenge to the entire post-1945 order. It raises the question not just of how to punish Putin, but of whether the architecture designed at San Francisco is capable of responding to 21st-century threats at all. The answer, uncomfortably, may be that it is not. What replaces it remains, as yet, unimagined.',
        modelOPVL: {
            origin: 'An editorial published by The Economist -- a prestigious British centre-right liberal publication with a global readership -- in March 2022, immediately following Russia\'s invasion of Ukraine.',
            purpose: 'To situate Russia\'s invasion within a broader critique of the UN\'s structural inability to enforce collective security when a permanent member is the aggressor, and to raise the question of institutional reform.',
            value: 'Useful as a secondary source from a credible publication reflecting mainstream Western liberal internationalist opinion. Its historical survey of P5 vetoes adds analytical depth, and it is valuable for assessing Liberal institutionalist critiques of global governance.',
            limitation: 'As a Western liberal publication, The Economist frames Western-led alternatives to the UN as more legitimate without equivalent scrutiny of US unilateralism -- for example, the US-led Iraq invasion of 2003, also a comparable Charter violation.'
        }
    },
    {
        id: 'sl5',
        title: '"AI Governance and the New Scramble for Digital Power"',
        attribution: 'Marietje Schaake, former MEP and International Policy Director, Stanford University, Geneva Digital Governance Forum, 2023',
        excerpt: 'We are witnessing a new scramble for power -- not for territory, but for the infrastructure, data, and standards that will define global relations for the next century. Artificial intelligence is not neutral technology. It encodes values, amplifies existing power imbalances, and, when deployed without democratic oversight, becomes a tool of surveillance and control. The question is not whether AI will transform global politics -- it already has. The question is who will write the rules. Currently, that contest is being fought between the United States, which has largely allowed market actors to dominate, and China, which has integrated AI into its model of authoritarian governance. Europe has attempted a third way -- the AI Act -- based on fundamental rights and democratic accountability. But the Global South has largely been excluded from these negotiations. If the rules that govern AI are written in Washington, Beijing, or Brussels, then the majority of humanity will live under a digital order they had no hand in shaping. That is not governance -- it is a new form of colonialism.',
        modelOPVL: {
            origin: 'Marietje Schaake, a former Dutch MEP and International Policy Director at Stanford University\'s Cyber Policy Center, speaking at the Geneva Digital Governance Forum in 2023.',
            purpose: 'To argue that AI governance is a geopolitical contest, to critique the exclusion of the Global South from norm-setting, and to advocate for democratic, rights-based AI regulation.',
            value: 'Valuable as a primary source from a domain expert in both policymaking and academia. The framing of AI governance as a "new colonialism" connects digital governance to the Postcolonial critique of norm-setting power imbalances.',
            limitation: 'Schaake\'s European background may produce an overly positive assessment of the EU AI Act. The "third way" framing oversimplifies the diversity of approaches within the US and China, and the Global South itself is far from homogeneous.'
        }
    },
    {
        id: 'sl6',
        title: '"Development Aid as Dependency: The Case Against the Washington Consensus"',
        attribution: 'Dambisa Moyo, Dead Aid: Why Aid is Not Working and How There Is a Better Way for Africa, Chapter 2, 2009',
        excerpt: 'Since 1970, more than $1 trillion in development-related aid has been transferred to Africa. It is arguable that less than 10 percent of that money has had any meaningful developmental impact whatsoever. Africa is no richer as a result of the hundreds of billions of dollars poured into the continent over the past five decades. Meanwhile, those few African countries that have resisted the aid model -- Botswana most famously, and more recently Rwanda and Ethiopia -- have recorded sustained economic growth. The case against aid is not ideological. It is empirical. Aid undermines domestic industry by flooding markets with cheap goods. It distorts incentive structures by allowing governments to bypass their own populations as a tax base -- reducing accountability and democratic pressure. And it creates a culture of dependency that stunts the development of domestic capital markets. The solution is not charity but trade, bond markets, direct investment, and remittances of the African diaspora -- sources of finance that come with accountability built in. Africa does not need to be saved. Africa needs to be taken seriously as a full partner in the global economy.',
        modelOPVL: {
            origin: 'Dambisa Moyo, a Zambian-born economist educated at Oxford and Harvard, in her 2009 book "Dead Aid." Moyo previously worked at Goldman Sachs and the World Bank, giving her insider credibility when critiquing the aid establishment.',
            purpose: 'To make an empirical and political economy argument against the aid model of African development, advocating instead for market-based alternatives: bonds, FDI, trade, and diaspora remittances.',
            value: 'Valuable as a primary source challenging Western-centric development assumptions from an African intellectual with elite credentials. The argument is useful for analysing the tension between Structuralist and Liberal accounts of development and whether aid perpetuates Core-Periphery dependency.',
            limitation: 'Moyo\'s argument is contested -- critics note that the Botswana example is complicated by its diamond revenues, and Rwanda\'s growth occurred under authoritarian conditions. She also conflates structural development aid with humanitarian emergency aid, which operate under very different logics.'
        }
    },
    {
        id: 'sl7',
        title: '"Sovereignty at Sea: The South China Sea Arbitration and Its Aftermath"',
        attribution: 'Permanent Court of Arbitration Award, South China Sea Case (Philippines v. China), July 2016 -- press summary',
        excerpt: 'The Tribunal found that China\'s claims to historic rights within the nine-dash line were incompatible with the United Nations Convention on the Law of the Sea, and that to the extent China had historic rights to resources in the South China Sea, such rights were extinguished by the entry into force of UNCLOS. The Tribunal found that certain sea areas are within the exclusive economic zone of the Philippines, because they are not overlapped by any possible entitlement of China. Having found that the Philippines has an entitlement to an exclusive economic zone, the Tribunal found that China had violated the Philippines\' sovereign rights in its exclusive economic zone by interfering with Philippine fishing and petroleum exploration. China has consistently stated that it does not accept or recognise the Award, and has continued to maintain its presence and operations within the area covered by the nine-dash line without modification.',
        modelOPVL: {
            origin: 'An official press summary of the Permanent Court of Arbitration award in the Philippines v. China case, issued in July 2016. The PCA is an intergovernmental organisation in The Hague providing arbitration services under international law.',
            purpose: 'To officially communicate the ruling of the arbitral tribunal -- that China\'s nine-dash line claims lack legal basis under UNCLOS -- to the international community following proceedings initiated by the Philippines in 2013.',
            value: 'Valuable as a primary legal document representing the definitive international legal ruling on the South China Sea dispute. Essential for understanding the gap between legal rulings and enforcement when great powers refuse compliance.',
            limitation: 'As a legal summary, it deliberately avoids political and strategic context, and does not address enforcement -- which the PCA has no mechanism for. The document also cannot capture the complexity of overlapping claims by Vietnam, Malaysia, Brunei, and Taiwan.'
        }
    },
    {
        id: 'sl8',
        title: '"The Feminist Critique of the Liberal Peace"',
        attribution: 'Cynthia Enloe, The Curious Feminist: Searching for Women in a New Age of Empire, Chapter 4, 2004',
        excerpt: 'The standard peace agreement does not ask: where are the women? It negotiates borders, disarmament schedules, and power-sharing arrangements between armed men. Women -- who have survived rape as a weapon of war, who have kept families alive, who have organised community resistance -- are typically absent from the table. When gender is mentioned at all, it appears in a clause committing governments to "mainstream" women\'s issues at some unspecified future point. This is not oversight. It is structure. International relations was built by men, for states, in the image of a world in which violence is the prerogative of institutions and women are its acceptable casualties. A feminist analysis of peace does not merely add women and stir. It asks why particular forms of conflict are deemed political -- and therefore worthy of negotiation -- while the violence that women experience daily is deemed private, domestic, below the threshold of diplomacy. A peace that does not dismantle gendered hierarchies is not peace.',
        modelOPVL: {
            origin: 'Cynthia Enloe, a pioneering American feminist International Relations scholar and professor at Clark University, in her 2004 book "The Curious Feminist." Enloe is widely credited with establishing feminist IR as an academic discipline.',
            purpose: 'To develop a feminist critique of conventional peace processes, arguing that their exclusion of women and gendered violence renders them structurally incomplete -- and that genuine feminist peace requires dismantling gendered hierarchies.',
            value: 'Highly valuable as a foundational secondary source for understanding Feminist IR theory and its critique of the Liberal peace. Particularly useful for analysing why post-conflict societies often reproduce gender-based violence despite formal peace agreements.',
            limitation: 'As a theoretical text, it occasionally overgeneralises about "peace agreements" as a monolithic structure. Critics from within feminist IR have also questioned whether Enloe\'s framework adequately accounts for the role of race and class in structuring gendered violence.'
        }
    },
    {
        id: 'sl9',
        title: '"The Global South Has Lost Faith in the International Order"',
        attribution: 'Celso Amorim, former Brazilian Foreign Minister, interview with Le Monde Diplomatique, October 2023',
        excerpt: 'The West is surprised that the Global South has not rallied behind Ukraine. They should not be. We remember Kosovo. We remember Iraq. We remember Libya. We have seen what a "rules-based order" means in practice -- it means the rules apply when they confirm Western interests, and are suspended when they do not. This is not cynicism. It is historical experience. When Brazil abstained on the Ukraine vote at the Security Council, we were not defending Russia. We were asserting that peace requires negotiation, and that a world in which one bloc dictates the terms of international legitimacy is not a world in which durable peace is possible. The BRICS expansion reflects this reality. More states are seeking alternatives to a dollar-denominated financial system and a security architecture that was designed without their input. The globalisation project told us we were equals who played by the same rules. Ukraine has confirmed what many of us suspected: that particular promise was always conditional.',
        modelOPVL: {
            origin: 'Celso Amorim, Brazil\'s most experienced diplomat and former Foreign Minister under Presidents Lula and Dilma Rousseff, in an interview with the left-leaning French publication Le Monde Diplomatique in October 2023.',
            purpose: 'To articulate a Global South perspective on the Ukraine war and explain Brazilian strategic non-alignment as principled rather than pro-Russian, situating it within a broader pattern of selective rule-application by Western powers.',
            value: 'Valuable as a primary source revealing the strategic reasoning of an influential Global South power. Useful for analysing fractures within the Western-led international order post-2022 and the rise of strategic autonomy as a diplomatic doctrine.',
            limitation: 'Amorim\'s argument is politically motivated -- it serves Brazil\'s diplomatic positioning. The comparison of Ukraine to Iraq and Libya elides key distinctions: Ukraine involves direct territorial annexation of a sovereign state by a neighbouring great power, not a multilateral intervention.'
        }
    },
    {
        id: 'sl10',
        title: '"Water Wars: Resource Scarcity and Interstate Conflict in the Nile Basin"',
        attribution: 'International Crisis Group, Report: Egypt-Ethiopia: Preventing a Nile Waters Conflict, January 2023',
        excerpt: 'The dispute over the Grand Ethiopian Renaissance Dam (GERD) has brought Egypt and Ethiopia closer to open confrontation than at any point in their modern diplomatic history. Egypt, which depends on the Nile for 97 percent of its freshwater needs, views any significant reduction in its annual flow as an existential threat. Ethiopia, one of the poorest countries in the world, sees the GERD as its sovereign right -- the foundation of industrialisation and electrification for a population of 120 million. The African Union-led negotiations have repeatedly stalled on two critical questions: the filling timeline and the rules governing drought management. Egypt demands legally binding guarantees that Ethiopia will release sufficient water during drought years. Ethiopia argues that such guarantees would undermine its sovereign control over its own territory and resources. Without a binding agreement, the risk of unilateral action -- including through military means -- cannot be excluded. The GERD case demonstrates that climate change, by intensifying rainfall variability, will make resource-based conflicts between states structurally more likely in the coming decades.',
        modelOPVL: {
            origin: 'A conflict analysis report published by the International Crisis Group in January 2023. The ICG is an independent NGO that monitors and analyses conflict globally, widely respected by governments and the UN for its impartiality.',
            purpose: 'To assess the risk of military escalation between Egypt and Ethiopia over the GERD, identify the core sticking points in negotiations, and recommend diplomatic steps to reduce conflict risk.',
            value: 'Highly credible secondary source from an organisation recognised for rigorous, impartial conflict analysis. It provides detailed structural analysis of both parties\' positions and connects the dispute to climate change as a systemic threat multiplier.',
            limitation: 'The ICG must maintain relationships with both governments and the African Union, which may encourage cautious framing. The report also does not engage substantively with historical colonial-era treaties that allocated Nile waters almost entirely to Egypt without Ethiopian consent.'
        }
    },
    {
        id: 'sl11',
        title: '"The Return of Industrial Policy: A New Era of Economic Nationalism"',
        attribution: 'Joseph Stiglitz, Nobel Laureate in Economics, Project Syndicate, June 2023',
        excerpt: 'For 40 years, the Washington Consensus told developing countries that industrial policy was an economic sin -- government picking winners, distorting markets, crowding out private investment. Then the United States passed the Inflation Reduction Act, the CHIPS and Science Act, and the Infrastructure Investment and Jobs Act: two trillion dollars of industrial policy in three years. The European Union responded with its Green Deal Industrial Plan and loosened state aid rules. China has been doing all of this for decades. What has changed? The answer is geopolitics. The pandemic exposed the fragility of globally distributed supply chains. The Ukraine war demonstrated the weaponisation of energy dependency. And the US-China technology decoupling has revealed that the market does not automatically produce the strategic industries a nation needs. The death of the Washington Consensus creates space -- particularly for the Global South -- to pursue developmentalist strategies that were long suppressed by conditionality. But it also creates a risk: that economic nationalism slides into protectionism and subsidy wars that undermine the multilateral trading system on which small economies depend.',
        modelOPVL: {
            origin: 'Joseph Stiglitz, a Nobel Prize-winning economist and former Chief Economist at the World Bank, writing in Project Syndicate -- a widely-read global opinion platform -- in June 2023.',
            purpose: 'To analyse the ideological shift from the Washington Consensus toward state-led industrial policy, explain its geopolitical drivers, and identify both opportunities for the Global South and risks of economic nationalism.',
            value: 'Valuable as a secondary analytical source from a leading heterodox economist who has long critiqued the Washington Consensus. The argument connects economic policy to geopolitical trends directly relevant to GP themes of power, interdependence, and development.',
            limitation: 'Stiglitz may overestimate the capacity of Global South states to translate industrial policy space into effective outcomes -- many lack the institutional infrastructure to implement such strategies. The piece also focuses heavily on the US and EU, with less attention to least-developed countries most dependent on the current trading system.'
        }
    },
    {
        id: 'sl12',
        title: '"Postcolonial Sovereignty and the Legacies of Empire"',
        attribution: 'Frantz Fanon, The Wretched of the Earth, Preface, 1961 (trans. Constance Farrington)',
        excerpt: 'The colonial world is a Manichean world. The settler paints the native as a sort of quintessence of evil. Native society is not simply described as a society lacking in values. It is not enough for the colonist to affirm that those values have disappeared from, or still better never existed in, the colonial world. The native is declared insensible to ethics; he represents not only the absence of values, but also the negation of values. He is the corrosive element, destroying all that comes near him. Colonial domination did not disrupt merely political structures and economic practices -- it dismantled the psychological infrastructure of the colonised. The liberation movement must therefore go beyond a transfer of power; it must be a total transformation -- of land, of institutions, and of the colonial self. National consciousness is not nationalism, but it is the only thing that will give us an international dimension. The intellectuals who accept decolonisation only as a rearrangement of political power without a corresponding social revolution have already betrayed the people who liberated them.',
        modelOPVL: {
            origin: 'Frantz Fanon, a Martinique-born Algerian psychiatrist and revolutionary intellectual, writing in 1961 during the Algerian War of Independence. The Wretched of the Earth was published the year Fanon died, aged 36, and became a foundational anticolonial text.',
            purpose: 'To provide a psychological and political analysis of the colonial relationship and to argue that genuine decolonisation requires a complete rupture with colonial structures -- social, institutional, and psychological -- not merely a political transfer of power.',
            value: 'Invaluable as a foundational primary source for Postcolonial IR theory. Fanon\'s analysis of the Manichean colonial worldview underpins contemporary postcolonial critiques of Western humanitarian intervention, development discourse, and liberal internationalism.',
            limitation: 'Written in the specific context of French colonial Algeria in 1961, its direct applicability to 21st-century postcolonial contexts requires careful contextualisation. The text is also a normative argument rather than an empirical analysis, which limits its use for descriptive claims about contemporary international relations.'
        }
    },
    {
        id: 'sl13',
        title: '"Human Trafficking and the Limits of International Law"',
        attribution: 'UN Office on Drugs and Crime (UNODC), Global Report on Trafficking in Persons, 2022 -- Executive Summary',
        excerpt: 'The COVID-19 pandemic severely disrupted anti-trafficking operations globally, while simultaneously increasing vulnerability to trafficking. Lockdowns, border closures, and economic downturns pushed more people -- particularly women and girls -- into conditions of exploitation. Despite 181 countries having criminalised human trafficking under the Palermo Protocol, the number of victims detected remains far below actual trafficking flows. In 2020, fewer victims were detected globally than in 2018, largely due to disruptions to law enforcement and victim identification services. Sexual exploitation remains the most detected form, accounting for 46 percent of detected victims globally. However, labour exploitation is increasingly detected, particularly in agriculture, domestic work, and manufacturing supply chains. The disconnect between ratification of international instruments and effective domestic implementation reflects a persistent enforcement gap: states lack the resources, political will, and in some cases the institutional capacity to prosecute traffickers, protect victims, and address the structural drivers -- poverty, inequality, conflict, and climate displacement -- that make millions vulnerable to exploitation.',
        modelOPVL: {
            origin: 'The UN Office on Drugs and Crime (UNODC) in its biennial Global Report on Trafficking in Persons, published in 2022. The UNODC is mandated by the UN General Assembly to monitor global crime trends and support member states in implementing anti-crime conventions.',
            purpose: 'To provide evidence-based data on global trafficking trends, identify how COVID-19 affected responses, and highlight the gap between legal commitments and enforcement -- targeting policymakers, donors, and civil society.',
            value: 'Credible and comprehensive statistical report from the sole UN agency with a global monitoring mandate on trafficking. Frank acknowledgement of the enforcement gap between formal legal commitments and implementation is analytically valuable.',
            limitation: 'UNODC data is inevitably constrained by what states choose to report, systematically undercounting trafficking in contexts with weak detection capacity or political incentives to minimise figures. The report does not distinguish between consensual adult sex work and coercive trafficking in a way all researchers accept.'
        }
    },
    {
        id: 'sl14',
        title: '"The Humanitarian-Military Nexus in the Age of R2P"',
        attribution: 'Alex de Waal, Director, World Peace Foundation, Boston Review symposium on R2P, 2014',
        excerpt: 'The Libyan intervention of 2011 was authorised by the UN Security Council under Resolution 1973 as a limited mission to protect civilians. It became regime change. NATO forces actively targeted Gaddafi\'s military apparatus, coordinated with rebel ground forces, and continued operations well beyond the geographic and operational scope originally described to the Security Council. The result was the death of Gaddafi, the dissolution of the Libyan state, and a decade of civil war, weapons proliferation, and jihadist expansion across the Sahel. Russia and China drew the correct lesson from Libya: abstention on Council votes was no longer safe. Since 2011, both have vetoed every resolution that might authorise military intervention, including multiple attempts to address the Syrian catastrophe. The humanitarian community must reckon with the fact that the Libyan precedent may have made the next Rwanda more likely, not less -- because it closed the diplomatic space within which humanitarian intervention can be authorised.',
        modelOPVL: {
            origin: 'Alex de Waal, Director of the World Peace Foundation at Tufts University and a long-standing scholar of African conflicts, writing in a Boston Review symposium on R2P in 2014, three years after the Libyan intervention.',
            purpose: 'To provide a critical retrospective analysis of the Libyan R2P intervention, arguing that NATO\'s mission creep fundamentally damaged the doctrine\'s credibility and long-term effectiveness.',
            value: 'Highly valuable as a secondary source from a respected independent scholar with expertise in the Sahel and humanitarian intervention. Directly connects the misuse of R2P in Libya to subsequent Russian and Chinese obstruction of Security Council action on Syria.',
            limitation: 'De Waal writes from a position broadly sympathetic to R2P while critical of its implementation -- he may understate arguments from critics who believe the doctrine is fundamentally flawed rather than poorly applied. His claim that the Libyan precedent "made the next Rwanda more likely" is an empirically difficult counterfactual to assess.'
        }
    },
    {
        id: 'sl15',
        title: '"Sanctions as Diplomacy: The Iran Case"',
        attribution: 'Richard Nephew, former US State Department Sanctions Coordinator, The Art of Sanctions: A View from the Field, 2018',
        excerpt: 'Sanctions work when they impose pain on the target in proportion to the policy change demanded -- and when the sanctioning party is willing to offer genuine relief that makes compliance worth the political cost. The Iran case illustrates both sides of this equation. The sanctions regime constructed between 2010 and 2012 -- targeting Iran\'s oil exports, central bank, and access to the SWIFT financial messaging system -- cut Iran\'s oil revenues by approximately 50 percent, collapsed the rial, and produced double-digit inflation. This pain, combined with genuine diplomatic engagement, was sufficient to bring Iran to the table and produce the 2015 JCPOA. But the Trump administration\'s reimposition of sanctions after 2018 without a corresponding diplomatic off-ramp demonstrated the other side: sanctions are not self-executing. Without credible relief on offer, they produce defiance rather than compliance, and may actually harden the target government\'s domestic political position by providing a convenient external enemy.',
        modelOPVL: {
            origin: 'Richard Nephew, the State Department\'s lead sanctions coordinator during the Obama administration\'s Iran negotiations, in his 2018 book. Nephew was a principal architect of the sanctions regime that helped produce the JCPOA.',
            purpose: 'To explain the conditions under which sanctions produce their intended policy outcomes using Iran as a case study, and to argue that the Trump administration\'s reimposition of sanctions without diplomatic engagement was strategically self-defeating.',
            value: 'Uniquely valuable as a practitioner primary source -- Nephew is not an outside analyst but one of the actual architects of the Iran sanctions regime. His insider account provides access to strategic reasoning and design choices that shaped the policy.',
            limitation: 'Nephew\'s deep personal investment in the JCPOA may produce a systematically favourable assessment of sanctions effectiveness. He does not engage seriously with humanitarian critics who argue that broad economic sanctions disproportionately harm civilian populations rather than political elites.'
        }
    },
    {
        id: 'sl16',
        title: '"Digital Authoritarianism and the Geopolitics of Internet Governance"',
        attribution: 'Freedom House, Freedom on the Net 2023: The Repressive Power of Artificial Intelligence, Executive Summary',
        excerpt: 'Internet freedom declined globally for the thirteenth consecutive year in 2023. Artificial intelligence is rapidly becoming a tool for authoritarian governments to tighten control over their populations, enabling faster, cheaper, and more sophisticated surveillance, censorship, and propaganda operations. At least 47 governments have deployed AI-enabled facial recognition technology in public spaces. At least 16 governments have used AI to monitor social media platforms. China continues to export its surveillance technology model through the Digital Silk Road, with Chinese companies supplying AI surveillance systems to governments in Africa, Asia, and Latin America that have used them to target political opponents and civil society. The so-called splinternet -- the fragmentation of the global internet along geopolitical lines -- is accelerating. Russia has made legal provision for operating a sovereign internet disconnected from the global network. These developments represent a fundamental challenge to the vision of the internet as a global commons governed by shared rules.',
        modelOPVL: {
            origin: 'Freedom House, a US-government-funded NGO based in Washington D.C. that monitors political rights and civil liberties globally, in its annual Freedom on the Net 2023 report.',
            purpose: 'To document the global decline of internet freedom, highlight the role of AI in enabling digital authoritarianism, and raise concern about China\'s export of surveillance technology and accelerating internet fragmentation.',
            value: 'Useful as a data-rich secondary source that documents patterns across many countries and years, providing comparative benchmarks for assessing digital rights trends. Specific examples of AI-enabled surveillance are useful for analysing technology as a tool of authoritarian governance.',
            limitation: 'Freedom House is primarily funded by the US government, generating legitimate questions about whether its assessments systematically reflect US foreign policy priorities. The report does not engage critically with surveillance practices of Western liberal democracies, which use similar technologies under different legal frameworks.'
        }
    },
    {
        id: 'sl17',
        title: '"A World Between Orders: The Crisis of Liberal Internationalism"',
        attribution: 'John Ikenberry, Liberal Leviathan, Princeton University Press, 2011 -- Epilogue',
        excerpt: 'The liberal international order that the United States built after 1945 was not simply a mechanism for American domination. It was a distinctive type of order -- one built around rules, institutions, and multilateral cooperation rather than imperial hierarchy. Rising powers were given a stake in this order; their participation lent it legitimacy that purely hegemonic orders lack. The question the 21st century poses is whether this order can survive the relative decline of the power that created it. China is not a revolutionary state seeking to overturn all existing institutions -- it is a revisionist state seeking to modify them in its favour. Russia is more genuinely destabilising. But the deeper threat may come not from challengers outside the liberal order but from within it -- from the United States itself, which under certain administrations has questioned the very multilateralism it invented. An order that loses the commitment of its founder while facing revisionist external pressure is in structural danger. What emerges from that danger will determine the shape of global politics for decades to come.',
        modelOPVL: {
            origin: 'John Ikenberry, a leading American International Relations scholar at Princeton University, in the Epilogue to "Liberal Leviathan" (2011) -- a major theoretical work on the post-1945 US-led liberal international order.',
            purpose: 'To assess structural challenges facing the liberal international order -- from rising powers and from internal erosion of American commitment to multilateralism -- and to argue that the order\'s future depends on its capacity to adapt to a more multipolar distribution of power.',
            value: 'Highly valuable as a comprehensive secondary source from a leading theorist of the liberal order. Ikenberry\'s distinction between revolutionary and revisionist challengers is analytically useful for categorising state behaviour in current geopolitical contests.',
            limitation: 'As an American scholar writing within the liberal internationalist tradition, Ikenberry tends to treat the post-1945 order as more legitimate than postcolonial critics would accept. The 2011 publication date also predates many of the most significant tests of his framework: Trump, Ukraine, COVID-19.'
        }
    },
    {
        id: 'sl18',
        title: '"The Rohingya Crisis and the Failure of ASEAN\'s Non-Interference Principle"',
        attribution: 'Phil Robertson, Deputy Director, Human Rights Watch Asia, Foreign Policy commentary, September 2017',
        excerpt: 'ASEAN has failed the Rohingya catastrophically -- and the failure is structural, not accidental. The Association\'s founding principle of non-interference was designed to protect Southeast Asian governments from external pressure on their domestic policies, including their human rights records. In the case of Myanmar, it has functioned as a diplomatic shield for ethnic cleansing. When 700,000 people flee across a border in a month, that is not an "internal matter." It is a regional crisis with regional consequences for Bangladesh, Thailand, Malaysia, and Indonesia -- all ASEAN members. The bloc\'s consensus-based decision-making structure means that any single member state can prevent collective action. The ASEAN Five-Point Consensus, agreed in April 2021 following the military coup, has been consistently ignored by the junta with no meaningful ASEAN response. ASEAN has no enforcement mechanism and no suspension procedure. This is not regional multilateralism. It is a mutual protection arrangement for authoritarian governments that prioritises diplomatic comfort over human lives.',
        modelOPVL: {
            origin: 'Phil Robertson, Deputy Director of the Asia Division at Human Rights Watch -- one of the world\'s largest international human rights NGOs -- writing a commentary for Foreign Policy magazine in September 2017, at the height of the Rohingya military crackdown.',
            purpose: 'To expose ASEAN\'s deliberate structural failure to respond to the Rohingya crisis and to call for a fundamentally different approach to regional multilateralism that prioritises accountability over non-interference.',
            value: 'Valuable as a primary advocacy source from a major international human rights organisation with direct field access in the region. Robertson\'s critique of ASEAN\'s structural limitations is analytically precise and useful for comparing regional governance models.',
            limitation: 'Human Rights Watch\'s mandate produces inherently partisan analysis in favour of intervention. Robertson does not seriously engage with the practical risks of abandoning non-interference or with the geopolitical constraints smaller ASEAN members face in confronting Myanmar.'
        }
    },
    {
        id: 'sl19',
        title: '"The Reparations Debate: Justice, History, and Sovereignty"',
        attribution: 'Caribbean Community (CARICOM), Ten-Point Plan for Reparatory Justice, 2014',
        excerpt: 'The CARICOM Reparations Commission calls upon European governments, whose nations were enriched by their enslavement of African people and indigenous genocide in the Caribbean, to establish a reparations framework to address the persistent harm done to Caribbean communities. Science has demonstrated that the persistent ill-health of our peoples, the poverty, the illiteracy, the crime and violence that disproportionately affect us, are rooted in the Atlantic slavery experience. Caribbean nations today are net losers in the globalisation process as a direct result of slavery and colonial policies that structured modern inequalities. Structural poverty is the primary legacy of slavery. The debt was created by European governments which imposed slavery and genocide upon our ancestors and extracted from their unpaid labour such vast wealth that it financed European industrialisation. Europe must acknowledge this historic wrong and act decisively. Reparations are not charity. They are compensation for crimes against humanity and the foundation upon which sustainable Caribbean development can be constructed.',
        modelOPVL: {
            origin: 'The Caribbean Community (CARICOM) Reparations Commission, representing 15 Caribbean nation-states and dependencies, in its Ten-Point Plan for Reparatory Justice, formally released in 2014. CARICOM is the principal intergovernmental organisation of Caribbean states.',
            purpose: 'To formally articulate a collective Caribbean demand for reparations from European governments for slavery and indigenous genocide, framing reparations as legal compensation for historical crimes against humanity rather than charity.',
            value: 'Significant as a collective primary source representing the official position of multiple sovereign states on reparations -- elevating what was a civil society demand to the level of intergovernmental diplomacy. Valuable for analysing the politics of historical justice and the Postcolonial critique of the liberal international order.',
            limitation: 'As an advocacy document, the Ten-Point Plan simplifies complex historical causation and does not engage with contested questions in reparations theory: who qualifies, how to calculate damages, or how to structure compensation without creating new injustices.'
        }
    },
    {
        id: 'sl20',
        title: '"The Arctic\'s Melting Logic: Climate, Resources, and Geopolitical Competition"',
        attribution: 'Arctic Council, Arctic Climate Change Update 2021: Key Trends and Impacts -- Summary for Policy-Makers',
        excerpt: 'The Arctic is warming at more than twice the rate of the global average. By 2050, the Arctic Ocean is projected to be virtually ice-free in summer for the first time in recorded human history. This transformation is simultaneously an ecological catastrophe and a geopolitical opportunity. As sea ice recedes, previously inaccessible shipping routes -- the Northern Sea Route along Russia\'s coast and the Northwest Passage through Canada\'s Arctic Archipelago -- are becoming commercially viable for longer portions of the year. Shipping through the Northern Sea Route can reduce the distance between Europe and Asia by up to 40 percent compared to the Suez Canal route. The region also holds an estimated 30 percent of the world\'s undiscovered natural gas reserves and 13 percent of its oil. Russia, with the world\'s longest Arctic coastline, is best positioned to benefit. China, despite having no Arctic territory, has declared itself a "near-Arctic state" and invested heavily in Arctic research and infrastructure partnerships.',
        modelOPVL: {
            origin: 'The Arctic Council, an intergovernmental forum of the eight Arctic states plus six indigenous peoples\' organisations as Permanent Participants, in its 2021 Arctic Climate Change Update summary document.',
            purpose: 'To communicate scientific consensus on Arctic warming to policymakers, identify key ecological and physical impacts, and flag the geopolitical dimensions of Arctic transformation for policy attention.',
            value: 'Highly credible as the official collective scientific assessment of all eight Arctic states -- it represents genuine scientific consensus rather than a single state\'s position. Valuable for connecting climate change to sovereignty, resources, and great power competition simultaneously.',
            limitation: 'The Arctic Council operates by consensus, which may produce diplomatic language that softens assessments of Russian and Chinese behaviour. Russia\'s suspension from the Council following the 2022 invasion of Ukraine occurred after this report\'s publication, significantly altering Arctic governance dynamics.'
        }
    },
];


const FlashcardDrillStation = ({ onKnownChange }) => {
    const terms = Object.keys(FLASHCARD_DEFS);
    const [idx, setIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [ratings, setRatings] = useState({});

    const term = terms[idx];
    const rated = Object.keys(ratings);
    const knownCount = Object.values(ratings).filter(r => r === 'know').length;
    const unsureCount = Object.values(ratings).filter(r => r === 'unsure').length;
    const reviewCount = Object.values(ratings).filter(r => r === 'review').length;
    const weakTerms = terms.filter(t => ratings[t] === 'review');

    const rate = (r) => {
        const newRatings = { ...ratings, [term]: r };
        setRatings(newRatings);
        onKnownChange(Object.keys(newRatings).filter(t => newRatings[t] === 'know').length);
        setFlipped(false);
        setIdx(prev => (prev < terms.length - 1 ? prev + 1 : prev));
    };

    const reset = () => { setIdx(0); setFlipped(false); setRatings({}); onKnownChange(0); };
    const progress = Math.round((rated.length / terms.length) * 100);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
                <div className="flex gap-3 text-xs font-bold">
                    <span className="text-emerald-400">&#10003; Know: {knownCount}</span>
                    <span className="text-amber-400">~ Unsure: {unsureCount}</span>
                    <span className="text-red-400">&#10007; Review: {reviewCount}</span>
                </div>
                <button onClick={reset} className="text-[10px] text-gray-500 hover:text-white border border-white/10 px-3 py-1 rounded-lg transition-colors">Reset</button>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 mb-4">
                <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            {idx < terms.length ? (
                <>
                    <div
                        onClick={() => setFlipped(!flipped)}
                        className="relative cursor-pointer min-h-[200px] rounded-2xl border-2 border-white/10 hover:border-blue-500/40 transition-all select-none overflow-hidden"
                    >
                        <div className={`w-full h-full transition-all duration-500 p-8 flex flex-col items-center justify-center text-center ${flipped ? 'bg-blue-900/20 border-blue-500/30' : 'bg-white/5'}`}>
                            {!flipped ? (
                                <>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4">IB Concept &mdash; Click to reveal</p>
                                    <h2 className="text-4xl font-black text-white">{term}</h2>
                                    <p className="text-xs text-gray-600 mt-4">Card {idx + 1} of {terms.length}</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-4">{term}</p>
                                    <p className="text-gray-200 text-sm leading-relaxed max-w-md">{FLASHCARD_DEFS[term]}</p>
                                </>
                            )}
                        </div>
                    </div>

                    {flipped && (
                        <div className="flex gap-3 animate-in fade-in duration-300">
                            <button onClick={() => rate('know')} className="flex-1 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-all">&#10003; Know It</button>
                            <button onClick={() => rate('unsure')} className="flex-1 py-3 rounded-xl font-bold text-sm bg-amber-600 hover:bg-amber-500 text-white transition-all">~ Unsure</button>
                            <button onClick={() => rate('review')} className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-700 hover:bg-red-600 text-white transition-all">&#10007; Review</button>
                        </div>
                    )}
                    {!flipped && <p className="text-center text-xs text-gray-600 italic">Click the card to flip it, then rate your confidence</p>}
                </>
            ) : (
                <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-2xl font-black mb-2">Deck Complete!</p>
                    <p className="text-gray-400 mb-6 text-sm">You know <span className="text-emerald-400 font-bold">{knownCount}</span> of {terms.length} terms.</p>
                    {weakTerms.length > 0 && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-xl text-left">
                            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Terms to Review</p>
                            <div className="flex flex-wrap gap-2">{weakTerms.map(t => <span key={t} className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">{t}</span>)}</div>
                        </div>
                    )}
                    <button onClick={reset} className="px-6 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white text-sm transition-all">Restart Deck</button>
                </div>
            )}
        </div>
    );
};

const TheoryLensMatcherStation = ({ onScoreChange }) => {
    const [idx, setIdx] = useState(0);
    const [selected, setSelected] = useState(null);
    const [revealed, setRevealed] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });

    const q = THEORY_QUOTES[idx];
    const theories = Object.keys(IR_THEORIES);

    const handle = (theory) => {
        if (revealed) return;
        setSelected(theory);
        setRevealed(true);
        const isCorrect = theory === q.answer;
        const newScore = { correct: score.correct + (isCorrect ? 1 : 0), total: score.total + 1 };
        setScore(newScore);
        onScoreChange(newScore);
    };

    const next = () => {
        if (idx < THEORY_QUOTES.length - 1) { setIdx(idx + 1); }
        else { setIdx(0); }
        setSelected(null);
        setRevealed(false);
    };

    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <p className="text-xs text-gray-500">Quote {idx + 1} of {THEORY_QUOTES.length}</p>
                <p className="text-xs font-bold text-blue-400">Accuracy: <span className="text-white">{accuracy}%</span> ({score.correct}/{score.total})</p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4">Match this argument to the correct IR theory</p>
                <p className="text-lg font-medium text-gray-100 leading-relaxed italic">"{q.quote}"</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {theories.map(t => {
                    const isSelected = selected === t;
                    const isCorrect = t === q.answer;
                    let cls = 'p-3 rounded-xl border-2 font-bold text-sm text-center cursor-pointer transition-all ';
                    if (!revealed) cls += 'border-white/10 text-gray-400 hover:border-blue-500/50 hover:text-white hover:bg-white/5';
                    else if (isCorrect) cls += 'border-emerald-500 bg-emerald-500/20 text-emerald-300 scale-105';
                    else if (isSelected) cls += 'border-red-500 bg-red-500/10 text-red-400';
                    else cls += 'border-white/5 text-gray-600 opacity-40';
                    return (
                        <button key={t} onClick={() => handle(t)} className={cls}
                            style={{ borderLeftColor: revealed && isCorrect ? IR_THEORIES[t].color : undefined }}>
                            {t}
                        </button>
                    );
                })}
            </div>

            {revealed && (
                <div className={`p-4 rounded-xl border animate-in zoom-in-95 duration-300 ${selected === q.answer ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                    <p className="font-black mb-1 text-sm" style={{ color: selected === q.answer ? '#34d399' : '#f87171' }}>
                        {selected === q.answer ? '&#10003; Correct!' : `\u2717 The answer is ${q.answer}`}
                    </p>
                    <p className="text-gray-300 text-xs leading-relaxed">{q.explanation}</p>
                    <button onClick={next} className="mt-3 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all">
                        {idx < THEORY_QUOTES.length - 1 ? 'Next Quote \u2192' : 'Restart \u2192'}
                    </button>
                </div>
            )}
        </div>
    );
};

const CaseSpeedRoundStation = ({ onHighScore }) => {
    const SPEED_CASES = [
        // ── From Glopo Companion GLOBAL_CASES ────────────────────────────
        {
            answer: "South China Sea Dispute", facts: [
                "China constructed artificial islands on top of submerged reefs and installed military installations, including missile batteries and runways.",
                "The Permanent Court of Arbitration ruled in 2016 that China's nine-dash line claim had no basis under UNCLOS — China rejected the ruling entirely.",
                "Vietnam, the Philippines, Malaysia, Brunei, and Taiwan all have overlapping sovereignty claims in these waters.",
                "Freedom of Navigation Operations conducted by the US Navy have regularly challenged China's territorial claims since 2015.",
            ]
        },
        {
            answer: "Belt and Road Initiative", facts: [
                "Launched by Xi Jinping in 2013, this infrastructure programme has invested over $1 trillion across 150+ countries.",
                "Sri Lanka leased its Hambantota Port to China on a 99-year arrangement after failing to service its debt obligations.",
                "Critics call this 'debt-trap diplomacy' — creditors argue the loan terms were accepted voluntarily and transparently.",
                "The BRI includes both a land-based Silk Road Economic Belt and a 21st Century Maritime Silk Road.",
            ]
        },
        {
            answer: "Nigeria & Boko Haram", facts: [
                "Boko Haram's name translates roughly as 'Western education is forbidden' — the group opposes secular governance and formal schooling.",
                "In April 2014, the group kidnapped 276 girls from a school in Chibok, triggering the global #BringBackOurGirls campaign.",
                "The group declared a caliphate in northern Nigeria in 2014 and later pledged allegiance to ISIS, rebranding as ISWAP.",
                "Lake Chad basin states — Nigeria, Niger, Chad, and Cameroon — formed a Multinational Joint Task Force to combat the insurgency.",
            ]
        },
        {
            answer: "Myanmar Rohingya Crisis", facts: [
                "Myanmar's military launched a clearance operation in Rakhine State in August 2017, which the UN labelled 'textbook genocide'.",
                "Over 700,000 Rohingya fled to Cox's Bazar in Bangladesh, creating one of the world's largest refugee settlements.",
                "Myanmar's constitution reserved 25% of parliamentary seats for the military, giving the Tatmadaw veto power over constitutional changes.",
                "The International Court of Justice ordered provisional measures in 2020 to protect the Rohingya from further genocidal acts.",
            ]
        },
        {
            answer: "Syrian Civil War & Refugee Crisis", facts: [
                "The Arab Spring protests began in Deraa in March 2011, escalating into a full civil war involving Assad's forces, rebels, ISIS, and Kurdish groups.",
                "Over 6.6 million Syrians were registered as refugees by 2023, the largest refugee population from a single country in the world.",
                "Russia used its UN Security Council veto repeatedly to block resolutions condemning Assad's government.",
                "Chemical weapons attacks in Ghouta (2013) and Douma (2018) triggered international condemnation and limited US military strikes.",
            ]
        },
        {
            answer: "Ukrainian War & NATO Expansion", facts: [
                "Russia annexed Crimea and triggered conflict in the Donbas in 2014 following Ukraine's Euromaidan revolution.",
                "Russia launched a full-scale invasion of Ukraine on 24 February 2022, calling it a 'Special Military Operation'.",
                "Finland and Sweden applied for NATO membership in 2022, a historic shift after decades of neutrality.",
                "The UN General Assembly passed multiple resolutions demanding Russian withdrawal, but Russia vetoed Security Council action.",
            ]
        },
        {
            answer: "Iran Nuclear Deal (JCPOA)", facts: [
                "The 2015 Joint Comprehensive Plan of Action limited Iran's uranium enrichment to 3.67% in exchange for sanctions relief.",
                "The US withdrew from the JCPOA in 2018 under President Trump, reimposing 'maximum pressure' sanctions.",
                "Iran responded by gradually exceeding its enrichment limits, reaching 60% and then 84% purity — near weapons-grade.",
                "The IAEA lost continuous monitoring access at key Iranian nuclear facilities after US withdrawal.",
            ]
        },
        {
            answer: "Israel-Gaza Conflict", facts: [
                "Hamas, designated a terrorist organisation by the US and EU, won Palestinian legislative elections in 2006 and has governed Gaza since 2007.",
                "Hamas launched the October 7, 2023 attack on Israel, killing approximately 1,200 people — the deadliest day for Jews since the Holocaust.",
                "Israel declared a formal state of war, launching an extensive military campaign that displaced over 1.7 million Gazans.",
                "The ICJ ordered provisional measures in January 2024 after South Africa filed a genocide case against Israel.",
            ]
        },
        {
            answer: "Sahel Climate & Security Crisis", facts: [
                "The Sahel region has experienced a 1.5x faster temperature rise than the global average, accelerating desertification and water scarcity.",
                "Military coups in Mali (2021), Burkina Faso (2022), and Niger (2023) ousted elected governments and expelled French forces.",
                "The Alliance of Sahel States — Mali, Burkina Faso, Niger — withdrew from ECOWAS and formed a confederation in 2023.",
                "The Lake Chad basin has shrunk by 90% since the 1960s, displacing millions and intensifying resource conflict.",
            ]
        },
        {
            answer: "Climate Change & Pacific Islands", facts: [
                "Tuvalu offered all citizens New Zealand citizenship in 2023 as their islands face total inundation from sea-level rise.",
                "The Maldives held an underwater cabinet meeting in 2009 to highlight the threat of climate change to their sovereignty.",
                "Under UNCLOS, a state's EEZ extends 200 nautical miles from its baseline — rising seas could eliminate habitable land and thus statehood.",
                "Pacific Island nations formed the Pacific Islands Forum to collectively lobby for stronger global emissions commitments.",
            ]
        },
        {
            answer: "Sudan Civil War", facts: [
                "War broke out in April 2023 between Sudan's national army (SAF) and the paramilitary Rapid Support Forces (RSF) over integration negotiations.",
                "The RSF evolved from the Janjaweed militias responsible for the Darfur genocide in the 2000s.",
                "Over 10 million people were internally displaced by 2024, the largest internal displacement crisis in the world.",
                "Sudan's conflict has destabilised neighbouring Chad, Central African Republic, and Ethiopia, creating a regional humanitarian emergency.",
            ]
        },
        {
            answer: "Taiwan Strait Tensions", facts: [
                "Taiwan has operated as a self-governing democracy since 1949, but the PRC claims it as a breakaway province.",
                "China conducted its largest military exercises around Taiwan in August 2022 following Nancy Pelosi's visit to Taipei.",
                "The US maintains a policy of 'strategic ambiguity' — selling arms to Taiwan but not committing to military defence.",
                "Taiwan produces over 90% of the world's most advanced semiconductors through TSMC, giving it extraordinary global economic leverage.",
            ]
        },
    ];

    const allQuestions = SPEED_CASES.flatMap(c => c.facts.map(f => ({ fact: f, answer: c.answer })));
    const [phase, setPhase] = useState('idle');
    const [questions, setQuestions] = useState([]);
    const [qIdx, setQIdx] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [showFeedback, setShowFeedback] = useState(false);
    const [choices, setChoices] = useState([]);
    const [highScore, setHighScore] = useState(0);

    const caseNames = [...new Set(GLOBAL_CASES.map(c => c.name))];
    const getChoices = (correct) => {
        const others = caseNames.filter(n => n !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
        return [correct, ...others].sort(() => Math.random() - 0.5);
    };

    useEffect(() => {
        if (phase === 'playing' && questions.length > 0) {
            setChoices(getChoices(questions[qIdx % questions.length].answer));
        }
    }, [qIdx, phase, questions]);

    useEffect(() => {
        if (phase !== 'playing') return;
        const t = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { clearInterval(t); setPhase('done'); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [phase]);

    const start = () => {
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setPhase('playing');
        setQIdx(0);
        setScore(0);
        setTimeLeft(60);
        setSelected(null);
        setShowFeedback(false);
        if (shuffled.length > 0) setChoices(getChoices(shuffled[0].answer));
    };

    const pick = (c) => {
        if (showFeedback) return;
        setSelected(c);
        setShowFeedback(true);
        if (questions.length > 0 && c === questions[qIdx % questions.length].answer) setScore(s => s + 1);
        setTimeout(() => { setQIdx(i => i + 1); setSelected(null); setShowFeedback(false); }, 1100);
    };

    if (phase === 'idle') return (
        <div className="text-center py-12 animate-in fade-in duration-500">
            <p className="text-5xl mb-4">&#9889;</p>
            <h3 className="text-2xl font-black mb-2">Case Study Speed Round</h3>
            <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">60 seconds. Read a key fact. Name the case study. As many as you can.</p>
            {highScore > 0 && <p className="text-amber-400 font-bold text-sm mb-4">Your Best: {highScore}</p>}
            <button onClick={start} className="px-8 py-3 rounded-xl font-black bg-amber-500 hover:bg-amber-400 text-black transition-all text-lg">Start Timer</button>
        </div>
    );

    if (phase === 'done') {
        const newHigh = score > highScore;
        if (newHigh) { setHighScore(score); onHighScore(score); }
        return (
            <div className="text-center py-12 animate-in zoom-in-95 duration-300">
                <p className="text-5xl mb-4">{score >= 10 ? '\ud83c\udfc6' : score >= 5 ? '\ud83c\udfaf' : '\ud83d\udcaa'}</p>
                <h3 className="text-2xl font-black mb-2">Time's Up!</h3>
                <p className="text-gray-400 mb-2">You answered <span className="text-amber-400 font-black text-3xl">{score}</span> correctly</p>
                {newHigh && <p className="text-emerald-400 text-sm font-bold mb-6">\ud83d\udd25 New High Score!</p>}
                <button onClick={start} className="px-8 py-3 rounded-xl font-black bg-amber-500 hover:bg-amber-400 text-black transition-all">Play Again</button>
            </div>
        );
    }

    const q = questions.length > 0 ? questions[qIdx % questions.length] : null;
    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div className={`text-4xl font-black tabular-nums ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</div>
                <div className="text-right"><p className="text-xs text-gray-500">Score</p><p className="text-3xl font-black text-amber-400">{score}</p></div>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${(timeLeft / 60) * 100}%` }} />
            </div>
            {q && (
                <>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">Which case study is this?</p>
                        <p className="text-gray-100 font-medium leading-relaxed">"{q.fact}"</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {choices.map(c => {
                            let cls = 'p-4 rounded-xl border-2 font-bold text-sm text-left transition-all cursor-pointer ';
                            if (!showFeedback) cls += 'border-white/10 text-gray-300 hover:border-amber-500/50 hover:bg-amber-500/10';
                            else if (c === q.answer) cls += 'border-emerald-500 bg-emerald-500/20 text-emerald-300';
                            else if (c === selected) cls += 'border-red-500 bg-red-500/10 text-red-400';
                            else cls += 'border-white/5 text-gray-600 opacity-40';
                            return <button key={c} onClick={() => pick(c)} className={cls}>{c}</button>;
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

const SourceLabStation = () => {
    const [srcIdx, setSrcIdx] = useState(0);
    const [responses, setResponses] = useState({ origin: '', purpose: '', value: '', limitation: '' });
    const [submitted, setSubmitted] = useState(false);

    const src = SOURCE_LAB_ITEMS[srcIdx];
    const changeSource = (i) => { setSrcIdx(i); setResponses({ origin: '', purpose: '', value: '', limitation: '' }); setSubmitted(false); };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex gap-2 flex-wrap">
                {SOURCE_LAB_ITEMS.map((s, i) => (
                    <button key={s.id} onClick={() => changeSource(i)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${srcIdx === i ? 'bg-purple-600 border-purple-500 text-white' : 'border-white/10 text-gray-400 hover:border-purple-500/50'}`}>
                        Source {i + 1}
                    </button>
                ))}
            </div>
            <div className="p-5 bg-purple-900/10 border border-purple-500/20 rounded-xl">
                <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold mb-1">Source {srcIdx + 1}</p>
                <p className="font-bold text-white mb-1">{src.title}</p>
                <p className="text-[11px] text-gray-400 italic mb-4">{src.attribution}</p>
                <p className="text-sm text-gray-300 leading-relaxed">{src.excerpt}</p>
            </div>
            {!submitted ? (
                <div className="space-y-4">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Complete the OPVL Framework</p>
                    {[
                        { key: 'origin', label: 'O \u2014 Origin', hint: 'Who produced this? When and where?' },
                        { key: 'purpose', label: 'P \u2014 Purpose', hint: 'Why was it produced? For what audience?' },
                        { key: 'value', label: 'V \u2014 Value', hint: 'Why is this source useful to a historian/analyst?' },
                        { key: 'limitation', label: 'L \u2014 Limitation', hint: 'What does it omit, exaggerate, or distort?' }
                    ].map(({ key, label, hint }) => (
                        <div key={key}>
                            <label className="block text-xs font-bold text-purple-400 mb-1">{label}</label>
                            <p className="text-[10px] text-gray-600 italic mb-1">{hint}</p>
                            <textarea
                                className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 text-sm h-20 focus:outline-none focus:border-purple-500 transition-colors resize-none leading-relaxed"
                                placeholder="Your analysis..."
                                value={responses[key]}
                                onChange={e => setResponses({ ...responses, [key]: e.target.value })}
                            />
                        </div>
                    ))}
                    <button
                        onClick={() => setSubmitted(true)}
                        disabled={!responses.origin || !responses.purpose || !responses.value || !responses.limitation}
                        className="w-full py-3 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Submit &amp; See Model Answer
                    </button>
                </div>
            ) : (
                <div className="space-y-4 animate-in zoom-in-95 duration-300">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Model Analysis vs. Your Response</p>
                    {[
                        { key: 'origin', label: 'O \u2014 Origin' },
                        { key: 'purpose', label: 'P \u2014 Purpose' },
                        { key: 'value', label: 'V \u2014 Value' },
                        { key: 'limitation', label: 'L \u2014 Limitation' }
                    ].map(({ key, label }) => (
                        <div key={key} className="grid md:grid-cols-2 gap-3">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Your {label}</p>
                                <p className="text-sm text-gray-300 leading-relaxed">{responses[key] || <span className="italic text-gray-600">No response</span>}</p>
                            </div>
                            <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-xl">
                                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Model {label}</p>
                                <p className="text-sm text-gray-300 leading-relaxed">{src.modelOPVL[key]}</p>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => setSubmitted(false)} className="px-4 py-2 rounded-lg font-bold text-sm border border-white/10 text-gray-400 hover:text-white transition-all">&larr; Edit My Responses</button>
                </div>
            )}
        </div>
    );
};

const OpsRoom = () => {
    const [station, setStation] = useState('flashcard');
    const [flashcardKnown, setFlashcardKnown] = useState(0);
    const [theoryScore, setTheoryScore] = useState({ correct: 0, total: 0 });
    const [speedHighScore, setSpeedHighScore] = useState(0);

    const stations = [
        { id: 'flashcard', label: '\ud83c\udca3 Flashcard Drill', desc: '23 IB concepts \u2014 flip & rate' },
        { id: 'theory', label: '\ud83d\udd2c Theory Matcher', desc: 'Match quotes to all 7 IR theories' },
        { id: 'speed', label: '\u26a1 Speed Round', desc: '60-second case study recall' },
        { id: 'source', label: '\ud83d\udcc4 Source Lab', desc: 'Paper 1 OPVL annotation' },
        { id: 'bifurcation', label: '\u2696\ufe0f Bifurcation Drill', desc: 'Support / Challenge sorting' },
        { id: 'warroom', label: '\ud83d\udea8 Policy War Room', desc: 'Graded scenario proposals' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-black mb-1 flex items-center gap-2">
                    <Shield className="text-amber-400" /> Ops Room
                </h2>
                <p className="text-gray-500 text-sm">Gamified knowledge &amp; recall stations &mdash; no scaffolding, just you and the material.</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-center">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-1">Flashcards Known</p>
                    <p className="text-3xl font-black text-emerald-400">{flashcardKnown}<span className="text-gray-600 text-base font-normal">/23</span></p>
                </div>
                <div className="text-center border-x border-white/5">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-1">Theory Accuracy</p>
                    <p className="text-3xl font-black text-blue-400">
                        {theoryScore.total > 0 ? Math.round((theoryScore.correct / theoryScore.total) * 100) : 0}<span className="text-gray-600 text-base font-normal">%</span>
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-1">Speed High Score</p>
                    <p className="text-3xl font-black text-amber-400">{speedHighScore}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
                {stations.map(s => (
                    <button key={s.id} onClick={() => setStation(s.id)}
                        className={`px-4 py-3 rounded-xl font-bold text-sm border-2 transition-all text-left ${station === s.id ? 'bg-amber-500/20 border-amber-500/60 text-amber-300' : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'}`}>
                        <span className="block">{s.label}</span>
                        <span className="block text-[10px] font-normal opacity-60 mt-0.5">{s.desc}</span>
                    </button>
                ))}
            </div>

            <div>
                {station === 'flashcard' && <FlashcardDrillStation onKnownChange={setFlashcardKnown} />}
                {station === 'theory' && <TheoryLensMatcherStation onScoreChange={setTheoryScore} />}
                {station === 'speed' && <CaseSpeedRoundStation onHighScore={setSpeedHighScore} />}
                {station === 'source' && <SourceLabStation />}
                {station === 'bifurcation' && <DrillMode />}
                {station === 'warroom' && <WarRoom />}
            </div>
        </div>
    );
};



export default function App() {
    const [activeTab, setActiveTab] = useState('writing');

    return (
        <div className="min-h-screen bg-glopo-dark text-gray-100 p-4 md:p-8">
            <GlossaryProvider />
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 rounded-2xl mb-4 border border-blue-500/20">
                        <BookOpen className="text-blue-500" size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
                        GloPo <span className="text-blue-500">Companion</span>
                    </h1>
                    <p className="text-gray-500 text-lg mb-4">IB Global Politics Master Study Suite (2026 Syllabus)</p>
                    <a
                        href="https://globalcommandcenter2026.netlify.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-black text-sm rounded-xl transition-all hover:scale-105 shadow-lg shadow-cyan-500/20 border border-cyan-400/30"
                    >
                        🌐 Launch 2026 Command Center
                        <ChevronRight size={16} />
                    </a>
                </header>

                <nav className="flex gap-2 mb-8 justify-start sm:justify-center overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap">
                    {[
                        { id: 'writing', label: 'Writing Studio', icon: PenTool },
                        { id: 'cases', label: 'Case Library', icon: Shield },
                        { id: 'glossary', label: 'IB Concept Glossary', icon: FileText },
                        { id: 'exams', label: 'Mock Exam Zone', icon: BookOpen },
                        { id: 'opsroom', label: '🎯 Ops Room', icon: Zap },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all shrink-0 text-sm sm:text-base ${activeTab === tab.id
                                ? "bg-glopo-card text-white border-blue-500 border-2 shadow-lg shadow-blue-500/10"
                                : "bg-transparent text-gray-500 border-transparent border-2 hover:bg-white/5"
                                }`}
                        >
                            <tab.icon size={18} /> {tab.label}
                        </button>
                    ))}
                </nav>

                <main className="min-h-[400px]">
                    {activeTab === 'writing' && <WritingStudio />}
                    {activeTab === 'cases' && <CaseLibrary />}
                    {activeTab === 'glossary' && <LoreLexicon />}
                    {activeTab === 'exams' && <MockExamZone />}
                    {activeTab === 'opsroom' && <OpsRoom />}
                </main>

                <footer className="mt-16 pt-12 pb-20 border-t border-cyan-500/30 text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Legal Disclaimer</p>
                    <p className="text-xs text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        This site is an independent educational resource and is not affiliated with or endorsed by the International Baccalaureate Organization.
                        All practice mock exams are original simulations designed for pedagogical purposes.
                    </p>
                    <div className="mb-8 p-4 bg-cyan-950/30 border border-cyan-500/20 rounded-xl inline-block max-w-lg">
                        <p className="text-cyan-300 text-xs font-bold tracking-widest uppercase mb-2">Non-Commercial Educational Tool</p>
                        <p className="text-white/60 text-xs leading-relaxed">
                            This project is a 100% academic tool created by **Stephen Martinez (Project Lead & IB Global Politics Teacher)**
                            to support scholars in the IB Global Politics 2026 Syllabus.
                            It is not a commercial product and provides free pedagogical resources.
                        </p>
                    </div>
                    <p className="mb-6 text-cyan-400 text-sm font-black tracking-widest uppercase animate-pulse">
                        &copy; 2026 IB Global Politics Study Suite. Designed for Level 7 Scholars.
                    </p>
                    <div className="flex flex-col items-center gap-6">
                        <a
                            href="/CODE_OF_CONDUCT.md"
                            className="text-white px-6 py-2 rounded-full font-black text-xs tracking-tighter hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,0,255,0.6)] border-2 border-magenta-400"
                            style={{ backgroundColor: '#ff00ff' }}
                        >
                            VIEW PROJECT CODE OF CONDUCT
                        </a>

                        <div className="flex flex-col items-center gap-2 mt-4">
                            <span className="text-white/80 text-[10px] font-black tracking-[0.2em] uppercase">This site is powered by Netlify</span>
                            <a
                                href="https://www.netlify.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    background: '#fff',
                                    padding: '12px 24px',
                                    borderRadius: '4px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    transition: 'all 0.3s ease',
                                    border: '4px solid #00f2ff',
                                    boxShadow: '0 0 30px #00f2ff, inset 0 0 10px #00f2ff'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.1) rotate(-1deg)';
                                    e.currentTarget.style.boxShadow = '0 0 50px #00f2ff';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                                    e.currentTarget.style.boxShadow = '0 0 30px #00f2ff';
                                }}
                            >
                                <img
                                    src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg"
                                    alt="Deploys by Netlify"
                                    style={{ height: '32px', width: 'auto' }}
                                />
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
