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
const PolicyEngine = () => {
    const [actor, setActor] = useState('');
    const [target, setTarget] = useState('');
    const [mechanism, setMechanism] = useState('');
    const [result, setResult] = useState(null);

    const generateSolution = () => {
        if (!actor || !target) return;

        setResult({
            surgical: `${actor} should implement a targeted intervention using ${mechanism || 'localized diplomatic pressure'} specifically aimed at ${target} to address the systemic tension.`,
            risk: `A major challenge to this policy is potential political pushback or resource diversion from local stakeholders, which must be mitigated by clear transparency and NGO partnership.`
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Shield className="text-blue-500" /> Policy Engine
            </h2>
            <Card>
                <div className="grid gap-4 mb-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Actor (Who has the power?)</label>
                        <input
                            type="text"
                            className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="e.g., UN Security Council"
                            value={actor}
                            onChange={(e) => setActor(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Target (Who is impacted?)</label>
                        <input
                            type="text"
                            className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="e.g., Regional Militia leaders"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Mechanism (Optional)</label>
                        <input
                            type="text"
                            className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="e.g., Targeted Magnitsky Sanctions"
                            value={mechanism}
                            onChange={(e) => setMechanism(e.target.value)}
                        />
                    </div>
                </div>
                <Button onClick={generateSolution} className="w-full">
                    <Zap size={18} /> Generate Surgical Solution
                </Button>
            </Card>

            {result && (
                <div className="space-y-4 animate-in zoom-in-95 duration-300">
                    <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
                        <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                            <CheckCircle size={18} /> Level 2: Surgical Solution
                        </h3>
                        <p className="text-gray-200 italic">"{result.surgical}"</p>
                    </div>
                    <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-xl">
                        <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                            <AlertTriangle size={18} /> Level 3: Scholars' Risk Check
                        </h3>
                        <p className="text-gray-200 italic">"{result.risk}"</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Tab 2: Writing Studio ---
const CaseLibrary = () => {
    const [expanded, setExpanded] = useState(null);
    const [selectedTheory, setSelectedTheory] = useState('Realism');
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

            // Strategy 2: Direct Gemini API call (localhost fallback)
            if (!introText) {
                const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
                if (!apiKey) {
                    setIntroLoading(false);
                    setIntroError("AI not configured. Please add your API key to generate personalised introductions.");
                    return;
                }
                try {
                    const prompt = `Write a model introduction paragraph for an IB Global Politics Paper 2 essay using ONLY these student inputs:

KEY CONCEPT: ${data.concept}
STUDENT'S DEFINITION: ${data.definition}
CASE STUDY A: ${data.caseA}
CASE STUDY B: ${data.caseB}
STUDENT'S THESIS: ${data.thesis}

REQUIREMENTS:
1. Open with a contextual hook SPECIFIC to "${data.concept}" — reference a real-world tension or paradox related to this concept.
2. Define the concept using the student's definition, woven naturally into the paragraph.
3. Frame the central analytical tension around "${data.concept}" — identify competing perspectives relevant to THIS concept (e.g., for Sovereignty: statist vs globalist; for Development: modernization vs dependency; for Peace: negative vs positive peace). Do NOT default to "globalist vs statist" for every concept.
4. Introduce both case studies ("${data.caseA}" and "${data.caseB}") with a brief phrase explaining WHY each is relevant.
5. Integrate the thesis naturally as the essay's central claim.
6. End with a brief roadmap sentence.

OUTPUT: Write ONLY the introduction paragraph in quotation marks. No headers, no bullet points, no meta-commentary. Keep it 80-120 words. Formal academic register.`;

                    const geminiResponse = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                        }
                    );

                    if (geminiResponse.status === 429) {
                        await new Promise(r => setTimeout(r, 3000));
                        const retryResp = await fetch(
                            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                            { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
                        );
                        if (retryResp.ok) {
                            const retryData = await retryResp.json();
                            introText = retryData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                        }
                    } else if (geminiResponse.ok) {
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
                    <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-xl leading-relaxed text-gray-300">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-3 flex items-center gap-2">
                            <Zap size={10} /> AI-Generated Model Introduction
                        </span>
                        <p className="text-sm">{generatedIntro}</p>
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
            </div>
        );
    };

    const PeelLab = () => {
        const [data, setData] = useState({ point: '', evidence: '', explanation: '', link: '' });
        const updateData = (key, val) => setData({ ...data, [key]: val });
        const [showResult, setShowResult] = useState(false);

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
                        <Button variant="outline" onClick={() => setShowResult(false)}><RefreshCw size={16} /> Edit Details</Button>
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

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide whitespace-nowrap">
                {[
                    { id: 'bank', label: 'Q-Bank', icon: BookOpen },
                    { id: 'debate', label: 'Debate Lab', icon: MessageSquare },
                    { id: 'intro', label: 'Intro Builder', icon: Zap },
                    { id: 'peel', label: 'PEEL Lab', icon: PenTool },
                ].map(b => (
                    <button
                        key={b.id}
                        onClick={() => setSubTab(b.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${subTab === b.id ? "bg-emerald-600 text-white" : "bg-white/5 text-gray-500 hover:bg-white/10"}`}
                    >
                        <b.icon size={14} /> {b.label}
                    </button>
                ))}
            </div>

            <Card className="border-emerald-500/20">
                {subTab === 'bank' && <QuestionBank />}
                {subTab === 'debate' && <DebateLab />}
                {subTab === 'intro' && <IntroWizard />}
                {subTab === 'peel' && <PeelLab />}
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
                        <textarea
                            value={localAnswer}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Type your response here... (Auto-saves to browser memory)"
                            className="w-full bg-glopo-dark border border-white/20 rounded-xl p-4 text-xs text-gray-300 h-48 focus:border-cyan-500 outline-none transition-all placeholder:text-gray-600 resize-y"
                        />
                        <div className="absolute bottom-2 right-4 text-[9px] text-gray-500 font-bold uppercase tracking-tighter pointer-events-none select-none">
                            {wordCount > 0 ? `${wordCount} Words` : 'Ready to write'}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => { updateAnswer(key, localAnswer); analyzeDraft(paperKey, q, localAnswer); }}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-black rounded-lg transition-all"
                        >
                            QUICK LOCAL ANALYSIS
                        </button>
                        {localAnswer.length > 20 && (
                            <button
                                onClick={() => { updateAnswer(key, localAnswer); requestDeepAnalysis(paperKey, q, localAnswer); }}
                                className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all flex items-center gap-2 ${feedback?.isDeep ? 'bg-purple-600 text-white' : 'bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:bg-purple-600/30'}`}
                            >
                                <Zap size={10} /> {feedback?.isDeep ? 'DEEP CRITIQUE ACTIVE' : 'REQUEST DEEP CRITIQUE'}
                            </button>
                        )}
                        {localAnswer.length > 0 && (
                            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                                <Shield size={10} /> Auto-saved
                            </span>
                        )}
                    </div>

                    {feedback && (
                        <div className={`p-4 rounded-xl border transition-all ${feedback.isDeep ? 'bg-purple-500/5 border-purple-500/30' : 'bg-cyan-500/5 border-cyan-500/20'}`}>
                            <h5 className={`text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 ${feedback.isDeep ? 'text-purple-400' : (feedback.relevanceAlert ? 'text-amber-500' : 'text-cyan-400')}`}>
                                <Zap size={10} /> {feedback.isDeep ? 'Agentic Health Scan' : (feedback.relevanceAlert ? 'Relevance Check Failed' : 'Technical Draft Scan')}
                            </h5>
                            <p className="text-[9px] text-gray-500 mb-3 italic">
                                {feedback.isDeep ? 'Bespoke structural and conceptual audit. Switch to Antigravity for qualitative nuance.' : 'Note: This scanner checks for structural health and conceptual presence, not semantic argument quality.'}
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

const MockExamZone = () => {
    const [subTab, setSubTab] = useState('paper1');
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerLimit, setTimerLimit] = useState(0);
    const [selectedExam, setSelectedExam] = useState({ paper1: 0, paper2: 0, paper3: 0 });
    const [expandedSources, setExpandedSources] = useState([0]); // Default first source open

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

        const systemInstruction = `You are an IB Global Politics Senior Examiner for the 2026 syllabus. 
            Your goal is to provide constructive, pedagogically sound, and strictly unbiased feedback. 
            Maintain a neutral, academic tone. Avoid taking ideological sides; instead, evaluate the student's ability to synthesize competing perspectives (e.g., Realism vs. Liberalism). 
            Always identify how the 4 core concepts (Power, Sovereignty, Legitimacy, Interdependence) are applied.`;

        const prompt = `${systemInstruction}

Question: ${q.text}
Marks Available: ${q.marks || 15}

Student Response:
${text}

Please provide a rigorous assessment. 

REQUIRED SECTIONS:
## Glow
[Key strengths in knowledge, analysis, and evaluation.]

## Grow
[Specific actionable areas for improvement based on the 2026 IB Rubric.]

## Alternative Perspectives
[Provide 2-3 alternative ways of responding to this prompt. Suggest different theoretical lenses (e.g., "A feminist critique would focus on...") or different case studies. Keep this unbiased and constructive.]

## Synthesis Guidance
[A one-sentence 'golden tip' on how to bridge these perspectives for a higher mark band.]`;

        let analysisText = null;

        // Strategy 1: Try Netlify function (works on Netlify-hosted site and netlify dev)
        try {
            const response = await fetch("/.netlify/functions/analyze-essay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ essayText: text, questionText: q.text, marks: q.marks || 15 }),
                signal: AbortSignal.timeout(25000) // 25s — Netlify free tier allows up to 26s
            });

            if (response.ok) {
                const data = await response.json();
                if (data.analysis) analysisText = data.analysis;
            } else if (response.status === 429) {
                // Rate limit from Netlify function — retry once after 3s
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

        // Strategy 2: Direct Gemini API call (works on localhost:3000 with REACT_APP_ key)
        if (!analysisText) {
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
            console.log("🔑 Gemini API key present:", !!apiKey, "| Length:", apiKey?.length);
            if (!apiKey) {
                setAnalysis(prev => ({ ...prev, [key]: { ...prev[key], deepLoading: false, deepError: "API key not configured. Restart npm start after adding REACT_APP_GEMINI_API_KEY to .env" } }));
                return;
            }
            try {
                const geminiResponse = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }]
                        })
                    }
                );

                if (geminiResponse.status === 429) {
                    // Retry once after a brief wait
                    console.log("Direct API rate limited, retrying in 3s...");
                    await new Promise(r => setTimeout(r, 3000));
                    const retryResp = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
                    );
                    if (retryResp.status === 429) {
                        throw new Error("Temporarily rate-limited. Please wait 30 seconds and try again.");
                    }
                    if (!retryResp.ok) throw new Error(`Gemini API error: ${retryResp.status}`);
                    const retryData = await retryResp.json();
                    analysisText = retryData?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (analysisText) {
                        setAnalysis(prev => ({ ...prev, [key]: { ...prev[key], isDeep: true, deepLoading: false, liveAnalysis: analysisText } }));
                        navigator.clipboard.writeText(prompt).catch(() => { });
                        return;
                    }
                }
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
                    { id: 'paper3', label: 'Paper 3 (28 marks)', color: 'red' }
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

            <Card className={subTab === 'paper1' ? "border-blue-500/20" : subTab === 'paper2' ? "border-emerald-500/20" : "border-red-500/20"}>
                {subTab === 'paper1' && <Paper1 />}
                {subTab === 'paper2' && <Paper2 />}
                {subTab === 'paper3' && <Paper3 />}
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
export default function App() {
    const [activeTab, setActiveTab] = useState('policy');

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
                        { id: 'policy', label: 'Policy Engine', icon: Shield },
                        { id: 'writing', label: 'Writing Studio', icon: PenTool },
                        { id: 'cases', label: 'Case Library', icon: Shield },
                        { id: 'glossary', label: 'IB Concept Glossary', icon: FileText },
                        { id: 'exams', label: 'Mock Exam Zone', icon: BookOpen },
                        { id: 'drill', label: 'Drill Mode', icon: Zap },
                        { id: 'warroom', label: 'War Room', icon: AlertTriangle },
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
                    {activeTab === 'policy' && <PolicyEngine />}
                    {activeTab === 'writing' && <WritingStudio />}
                    {activeTab === 'cases' && <CaseLibrary />}
                    {activeTab === 'glossary' && <LoreLexicon />}
                    {activeTab === 'exams' && <MockExamZone />}
                    {activeTab === 'drill' && <DrillMode />}
                    {activeTab === 'warroom' && <WarRoom />}
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
