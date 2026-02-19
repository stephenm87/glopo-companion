// ============================================================
// EXAM BANK — 5 Sample Exams × 3 Papers
// IB Global Politics 2026 Syllabus
// ============================================================

// ------ PAPER 1: Stimulus-Based (1h 15m, 25 Marks) ------
// Q1 = 3m, Q2 = 4m, Q3 = 8m, Q4 = 10m

export const paper1Exams = [
    // ── Exam 1: NGOs in Global Politics ──
    {
        id: 'p1-1',
        title: 'Non-Governmental Organizations (NGOs)',
        unit: 'Power, sovereignty and international relations',
        sources: [
            {
                label: 'Source A',
                citation: 'Adapted from "Singapore rapped over protest ban", BBC News, 2006.',
                text: `The World Bank president has criticized Singapore for banning accredited activists from its annual general meeting in the country. Singapore authorities have blocked the 19 civil society representatives from attending the event amid claims that they pose a security risk.

The president told BBC World he hoped Singapore would reconsider its stance. On the agenda for next week's World Bank annual general meeting are plans to tackle corruption and reform of the bank's voting structure. The president said Singapore had made a "bad" decision when it blocked activists that had been invited to the event. "I hope Singapore's authorities will change their minds and allow the people in that we have accredited as originally agreed," he added.

He added that it was important for the organization to hold a "strong dialogue" with such groups. "We may not always agree with what they have to say, but it is very important to have that discussion."

The comments followed Singapore's refusal to lift a ban on public protests. Following the ban, pressure groups and non-governmental organizations decided they would demonstrate on Batam Island instead – an Indonesian island located close to Singapore by boat. But now Indonesian police have decided to ban international NGOs from protesting there as well, saying the demonstrations could become violent and act as a deterrent to tourists.`
            },
            {
                label: 'Source B',
                citation: 'Adapted from Global Politics by Andrew Heywood, Palgrave Macmillan, 2011.',
                text: `Although lacking the economic influence that transnational corporations (TNCs) can exert, advocacy NGOs have proved highly skilled at mobilizing "soft" power and popular pressure. In this respect they have a number of advantages. Leading NGOs have developed high public profiles, often linked to public protests and demonstrations that attract eager media attention. Their typically altruistic and humanitarian objectives enable them to mobilize public support and apply moral pressure in a way that conventional politicians and political parties struggle to rival. On a wide range of issues the views of NGOs are taken to be both authoritative and impartial, based on the use of specialists and academics.`
            },
            {
                label: 'Source C',
                citation: 'A table of information about six well-known NGOs.',
                text: `| Organization | Focus | Reach | Approx. 2011 Expenditure (US$) |
|---|---|---|---|
| Greenpeace | Environmental issues | Over 2.5 million members | $163,721,000 |
| CARE International | Poverty | Projects in 84 countries in 2011 | $706,325,000 |
| Amnesty International | Human rights | Over 3 million members | $61,882,458 |
| Médecins Sans Frontières | Emergency medical assistance | Projects in over 60 countries in 2011 | $400,000,000 |
| Red Cross/Red Crescent | Disaster relief | Approximately 97 million volunteers, members and staff worldwide | $821,892,318 |
| Habitat for Humanity | Housing/shelter | Built more than 500,000 houses since 1976 | $224,700,000 |`
            },
            {
                label: 'Source D',
                citation: 'Extract from "Strengthening Civil Society" from the Aga Khan Development Network website.',
                text: `It has become clear to many governments that successful states require more than the introduction of democratic elections and political parties. Civil society, particularly indigenous NGOs, must play a central role in promoting good governance and accountability. But to be effective, NGOs must be well-run and well-governed themselves. They must operate under a code of ethics and governance that stresses accountability so that resources are not wasted. They must also have a quantifiable impact on development challenges, as measured against well-recognized indicators, such as infant and maternal mortality, literacy and the reduction in the incidence of disease. Increasing community participation is also vital to progress.`
            }
        ],
        questions: [
            { num: 1, marks: 3, text: 'According to Source B, what three advantages do NGOs have over other actors in global politics?', coreConcepts: ['advantages', 'NGOs', 'soft power', 'popular pressure', 'altruistic'] },
            { num: 2, marks: 4, text: 'With reference to Source C, suggest common features of large NGOs that can be deduced from the information in the table.', coreConcepts: ['Source C', 'NGOs', 'reach', 'expenditure', 'membership'] },
            { num: 3, marks: 8, text: 'Contrast the views of Source A and Source D regarding the relationship between NGOs and states.', coreConcepts: ['contrast', 'Source A', 'Source D', 'relationship', 'NGOs', 'states'] },
            { num: 4, marks: 10, text: 'Using the sources and your own knowledge, evaluate the claim that NGOs are insignificant actors in global politics.', coreConcepts: ['evaluate', 'NGOs', 'insignificant', 'actors', 'power'] }
        ]
    },

    // ── Exam 2: Failed States & Foreign Intervention ──
    {
        id: 'p1-2',
        title: 'Failed States and Foreign Intervention',
        unit: 'Power, sovereignty and international relations',
        sources: [
            {
                label: 'Source A',
                citation: 'Extract from Paul Kennedy, The Parliament of Man (p. 246-247). London, UK: Penguin Books, 2006.',
                text: `Finally, and perhaps most important, the world community faces the challenges of how to deal with failed states; staunch their internal genocides, famines, and other calamities; and steadily restore such nations to their rightful sovereignty. As events in Bosnia, West Africa, Somalia, Afghanistan, and many other parts of the globe have shown, this is no easy task; it is one that in most cases will be a labour of many years and will see many setbacks. But dealing with failed states is unavoidable, since it is precisely here that one witnesses unacceptable levels of violence, abuse of women and children's rights, environmental degradation, and, very often, a nesting ground for terrorists.`
            },
            {
                label: 'Source B',
                citation: 'Extract adapted from article "Somalia can be reborn as a country of progress and prosperity" by Mohamed Sharif Mohamud, a Somalian diplomat, in the Guardian, Feb 22, 2012.',
                text: `Yet Somalia is not a failed state. It was defeated by the weight of the resources at its enemies' disposal, but never succumbed. And it is still fighting for liberation and sovereignty.

Yes, there is warlordism, terrorism, piracy, and a history of natural disaster. Yes, displacement, refugees and a lack of state authority are problematic. But these issues result directly from sustained foreign intervention and the deliberate fragmentation of the country into tribal territories.

That the conflict in Somalia has a local dimension – rooted in oppression, exclusion, injustice, lack of economic opportunity and civil disobedience – is impossible to ignore. But without foreign interference, local issues would be less critical; they could be managed and controlled. The reality is that the big powers have relied on Ethiopia, their major ally in Africa, to decide their strategies in the Horn of Africa.`
            },
            {
                label: 'Source C',
                citation: 'Extract from the country profile of Somalia on the BBC website, updated October 8, 2012.',
                text: `Foreign intervention in Somalia

• 1992 - UN troops arrive to monitor ceasefire after fighting which followed fall of Siad Barre. US-led task force delivers aid
• 1993 - UN mission is dealt a fatal blow when US rangers are killed in an incident made famous by Hollywood film Black Hawk Down
• 1995 - UN troops withdraw, leaving warlords to fight on. UN casualties number 150
• 2006 - Ethiopia sends troops to defend interim government
• 2007 - African peacekeeping force AMISOM deploys
• 2011 - Kenya enters Somalia in pursuit of al-Shabab militia`
            },
            {
                label: 'Source D',
                citation: 'Extract from OECD (2011), 2011 Report on International Engagement in Fragile States: Somali Republic, OECD Publishing.',
                text: `Somalia is in a situation of prolonged conflict and fragility, with a high dependency on remittances and humanitarian assistance. Indeed, Somalia, over the last twenty years has been stereotyped as the country with the poor starving child, the pirate, the terrorist and the warlord. However this portrait does not reflect the resilience of the Somali people or the successes that have been achieved in the face of many challenges, including stable and developing areas in the north of Somalia, a flourishing private sector, a steady increase in primary education enrolment rates and newly emerging state structures.`
            }
        ],
        questions: [
            { num: 1, marks: 3, text: 'According to Source A, what global challenges do failed states present to the international community?', coreConcepts: ['challenges', 'failed states', 'genocides', 'violence', 'terrorism'] },
            { num: 2, marks: 4, text: 'Explain the term \'sovereignty\', using both the information in the sources and examples you have studied.', coreConcepts: ['sovereignty', 'liberation', 'authority', 'intervention'] },
            { num: 3, marks: 8, text: 'Compare and contrast the views of Source B and Source D on Somalia as a failed state.', coreConcepts: ['compare', 'contrast', 'Source B', 'Source D', 'Somalia', 'failed state'] },
            { num: 4, marks: 10, text: 'Using the sources and your own knowledge, to what extent is foreign intervention in a country\'s internal affairs beneficial for development?', coreConcepts: ['foreign intervention', 'beneficial', 'development', 'sovereignty'] }
        ]
    },

    // ── Exam 3: Climate Change Governance ──
    {
        id: 'p1-3',
        title: 'Climate Change and Global Governance',
        unit: 'Development and sustainability',
        sources: [
            {
                label: 'Source A',
                citation: 'Adapted from "The Paris Agreement: A New Framework for Global Climate Action", UN Climate Change, 2016.',
                text: `The Paris Agreement, adopted in December 2015, marked a historic turning point in international climate governance. For the first time, 196 parties agreed to a legally binding treaty committing to limit global warming to well below 2°C above pre-industrial levels, with efforts to limit the increase to 1.5°C. Unlike the Kyoto Protocol, which imposed binding targets only on developed nations, the Paris Agreement required all signatories — including major developing economies like China and India — to submit nationally determined contributions (NDCs). Critics argued that the agreement's reliance on voluntary pledges, without binding enforcement mechanisms, would prove insufficient to address the scale of the climate crisis.`
            },
            {
                label: 'Source B',
                citation: 'Adapted from "Climate Justice and the Global South" by Dr. Sunita Narain, Centre for Science and Environment, New Delhi, 2020.',
                text: `The fundamental injustice of climate change lies in the fact that those who have contributed least to the problem suffer its worst consequences. Sub-Saharan Africa accounts for less than 4% of global carbon emissions, yet faces the most severe droughts, flooding, and food insecurity. When developed nations push for uniform emission reduction targets, they ignore the historical responsibility of industrialized nations and the developmental needs of the Global South. Climate justice demands differentiated responsibilities — the polluter must pay, and developing nations must be given both the financial resources and the technology to transition to sustainable economies without sacrificing economic growth.`
            },
            {
                label: 'Source C',
                citation: 'Global CO₂ Emissions by Region, 2023. Data from the International Energy Agency (IEA).',
                text: `| Region | CO₂ Emissions (Gt) | % of Global Total | Per Capita (tonnes) |
|---|---|---|---|
| China | 11.9 | 31.1% | 8.4 |
| United States | 4.6 | 12.0% | 13.8 |
| European Union | 2.7 | 7.1% | 6.0 |
| India | 2.9 | 7.6% | 2.1 |
| Sub-Saharan Africa | 0.9 | 2.4% | 0.8 |
| Rest of World | 15.2 | 39.8% | 4.2 |
| **TOTAL** | **38.2** | **100%** | **4.7** |`
            },
            {
                label: 'Source D',
                citation: 'Editorial from The Economist, "The Case for Carbon Markets", November 2023.',
                text: `Market-based solutions offer the most efficient path to decarbonization. The European Union's Emissions Trading System (EU ETS), now in its fourth phase, has demonstrated that cap-and-trade mechanisms can drive significant reductions in industrial emissions while maintaining economic competitiveness. Carbon pricing forces firms to internalize the cost of pollution, incentivizing innovation in clean technology. However, critics point to the risk of "carbon leakage" — where industries relocate to countries with weaker regulations — and question whether market mechanisms alone can deliver the transformative change needed within the timeframe demanded by climate science.`
            }
        ],
        questions: [
            { num: 1, marks: 3, text: 'According to Source A, identify three key features of the Paris Agreement that distinguish it from previous climate agreements.', coreConcepts: ['Paris Agreement', 'features', 'warming', 'NDCs', 'Kyoto'] },
            { num: 2, marks: 4, text: 'Using Source C, explain two significant patterns in global CO₂ emissions and their implications for climate governance.', coreConcepts: ['Source C', 'emissions', 'pattern', 'governance', 'CO2'] },
            { num: 3, marks: 8, text: 'Compare and contrast the approaches to addressing climate change presented in Source B and Source D.', coreConcepts: ['compare', 'contrast', 'Source B', 'Source D', 'climate justice', 'market-based'] },
            { num: 4, marks: 10, text: 'Using the sources and your own knowledge, evaluate the claim that international climate agreements have failed to adequately address the needs of the Global South.', coreConcepts: ['evaluate', 'Global South', 'climate agreements', 'justice', 'responsibility'] }
        ]
    },

    // ── Exam 4: Digital Sovereignty & Cyber Power ──
    {
        id: 'p1-4',
        title: 'Digital Sovereignty and Cyber Power',
        unit: 'Human rights',
        sources: [
            {
                label: 'Source A',
                citation: 'Adapted from "The Splinternet: How Geopolitics and Commerce are Fragmenting the World Wide Web" by Scott Malcomson, OR Books, 2016.',
                text: `The internet was once celebrated as a borderless space that would transcend national sovereignty and promote the free flow of information. That vision is rapidly fragmenting. China's "Great Firewall" blocks access to Western platforms like Google, Facebook, and Twitter, replacing them with domestic alternatives. Russia has developed its "sovereign internet" law, enabling authorities to disconnect the country from the global internet during perceived emergencies. The European Union has pursued a distinct regulatory path through the General Data Protection Regulation (GDPR) and the Digital Services Act, asserting digital sovereignty through consumer protection rather than censorship.`
            },
            {
                label: 'Source B',
                citation: 'Adapted from testimony by Senator Mark Warner to the US Senate Intelligence Committee on TikTok, March 2023.',
                text: `TikTok, owned by Beijing-based ByteDance, presents a unique national security challenge. The platform collects vast amounts of data on 150 million American users — their locations, browsing habits, biometric identifiers, and social connections. Under China's 2017 National Intelligence Law, Chinese companies are obligated to cooperate with state intelligence agencies upon request. While TikTok has proposed "Project Texas" to store US data on American servers, critics argue this does not address the fundamental risk that the Chinese government could compel ByteDance to weaponize the platform's algorithm for propaganda or surveillance purposes.`
            },
            {
                label: 'Source C',
                citation: 'Global Internet Freedom Scores, Freedom House, Freedom on the Net Report, 2023.',
                text: `| Country | Internet Freedom Score (0-100) | Status | Key Restrictions |
|---|---|---|---|
| Iceland | 95 | Free | Minimal restrictions |
| United States | 76 | Free | Surveillance concerns |
| Brazil | 64 | Partly Free | Content moderation debates |
| India | 50 | Partly Free | Internet shutdowns |
| Russia | 21 | Not Free | Censorship, VPN bans |
| China | 9 | Not Free | Great Firewall, social credit |
| Iran | 11 | Not Free | Near-total shutdowns during protests |`
            },
            {
                label: 'Source D',
                citation: 'Adapted from "Why We Need Digital Sovereignty" by Marietje Schaake, Stanford Cyber Policy Center, 2022.',
                text: `Digital sovereignty should not be confused with digital authoritarianism. When democratic states assert sovereignty over their digital ecosystems, they protect citizens from exploitation by both foreign governments and private corporations. The EU's GDPR has become a global standard precisely because it empowers individuals with rights over their own data. The challenge is to build governance frameworks that protect security and privacy without becoming tools of censorship. Democratic digital sovereignty requires transparency, judicial oversight, and the preservation of an open internet as a public good.`
            }
        ],
        questions: [
            { num: 1, marks: 3, text: 'According to Source A, identify three different approaches states have taken to assert control over the internet.', coreConcepts: ['approaches', 'control', 'internet', 'sovereignty', 'Firewall'] },
            { num: 2, marks: 4, text: 'Using Source C and your own knowledge, explain the relationship between internet freedom and regime type.', coreConcepts: ['Source C', 'regime type', 'internet freedom', 'restrictions'] },
            { num: 3, marks: 8, text: 'Compare and contrast the views of Source B and Source D on how states should approach digital sovereignty.', coreConcepts: ['compare', 'contrast', 'Source B', 'Source D', 'digital sovereignty', 'security'] },
            { num: 4, marks: 10, text: 'Using the sources and your own knowledge, evaluate the claim that state sovereignty over the internet is necessary for national security.', coreConcepts: ['evaluate', 'sovereignty', 'internet', 'national security'] }
        ]
    },

    // ── Exam 5: Migration & Border Security ──
    {
        id: 'p1-5',
        title: 'Migration, Refugees and Border Security',
        unit: 'Peace and conflict',
        sources: [
            {
                label: 'Source A',
                citation: 'Adapted from UNHCR Global Trends: Forced Displacement in 2023, United Nations High Commissioner for Refugees.',
                text: `By the end of 2023, the number of forcibly displaced people worldwide reached a record 117.3 million. This figure includes 36.4 million refugees, 62.5 million internally displaced persons (IDPs), and 6.1 million asylum seekers. The main countries of origin were Syria (6.5 million), Afghanistan (6.4 million), and Ukraine (6.3 million). Developing regions host 75% of the world's refugees, with the least developed countries hosting 20%. Turkey remains the largest refugee-hosting country (3.6 million), followed by Iran (3.4 million) and Colombia (2.9 million). The UNHCR's budget shortfall reached 52%, leaving critical protection and assistance gaps.`
            },
            {
                label: 'Source B',
                citation: 'Adapted from "Fortress Europe: The Failure of Solidarity" by Médecins Sans Frontières, 2023.',
                text: `Europe's approach to migration has prioritized deterrence over protection. The EU-Turkey deal of 2016, the Libya coastguard agreements, and the externalization of border controls to North African states have created a system designed to prevent arrivals rather than ensure safe passage. Between 2014 and 2023, over 28,000 people are known to have died or gone missing attempting to cross the Mediterranean — the world's deadliest migration route. The pushback policies documented at the Greek-Turkish border and the Croatian-Bosnian border violate the 1951 Refugee Convention's principle of non-refoulement, which prohibits returning individuals to territories where they face serious threats.`
            },
            {
                label: 'Source C',
                citation: 'Global Compact on Refugees, adopted by the UN General Assembly, December 2018.',
                text: `The Global Compact on Refugees recognizes that no country can manage a large-scale refugee situation alone. It establishes four key objectives: (1) ease pressures on host countries; (2) enhance refugee self-reliance; (3) expand access to third-country solutions; and (4) support conditions in countries of origin for return in safety and dignity. The Compact emphasizes a "whole-of-society" approach involving governments, international organizations, civil society, the private sector, and refugees themselves. While it is not legally binding, the framework represents a political commitment to more predictable and equitable responsibility-sharing among states.`
            },
            {
                label: 'Source D',
                citation: 'Adapted from speech by Hungarian Prime Minister Viktor Orbán at the European Parliament, 2018.',
                text: `Migration is not a fundamental right. Every country has the sovereign right to decide who it allows onto its territory. Hungary built a fence on its southern border because we needed to protect our citizens and our way of life. The European Union's attempts to impose mandatory relocation quotas represent an assault on national sovereignty. We reject the premise that mass migration is inevitable or desirable. Our duty is to our own people first — their safety, their culture, their future. A nation that cannot control its borders is not truly sovereign.`
            }
        ],
        questions: [
            { num: 1, marks: 3, text: 'According to Source A, identify three significant trends in global forced displacement by the end of 2023.', coreConcepts: ['trends', 'displacement', 'refugees', 'IDPs', 'host'] },
            { num: 2, marks: 4, text: 'Using Source C, explain how the Global Compact on Refugees attempts to address the challenges of responsibility-sharing among states.', coreConcepts: ['Source C', 'Refugees', 'responsibility-sharing', 'Compact'] },
            { num: 3, marks: 8, text: 'Compare and contrast the perspectives on state responsibility toward refugees presented in Source B and Source D.', coreConcepts: ['compare', 'contrast', 'Source B', 'Source D', 'responsibility', 'refugees'] },
            { num: 4, marks: 10, text: 'Using the sources and your own knowledge, evaluate the claim that state sovereignty should take priority over the protection of refugee rights in global politics.', coreConcepts: ['evaluate', 'sovereignty', 'refugee rights', 'protection'] }
        ]
    }
];

// ------ PAPER 2: Extended Response Essays (1h 45m, 30 Marks = 2 × 15) ------
// Students choose 1 from Section A + 1 from Section B

export const paper2Exams = [
    // ── Exam 1: Rights & Justice Focus ──
    {
        id: 'p2-1',
        title: 'Exam 1 — Rights, Justice & Sovereignty',
        sectionA: {
            label: 'Section A: Thematic Studies',
            instruction: 'Answer ONE question from this section. (15 marks)',
            questions: [
                { num: 1, text: 'Evaluate the claim that international judicial bodies, like the ICC, reflect a "selective justice" that prioritizes Global North interests over Global South autonomy.', coreConcepts: ['ICC', 'selective justice', 'Global North', 'Global South', 'autonomy'] },
                { num: 2, text: '"Universal human rights are increasingly contested as a form of ideological hegemony." To what extent do you agree with this statement?', coreConcepts: ['human rights', 'ideological hegemony', 'contested', 'universal'] },
                { num: 3, text: 'Compare the effectiveness of diplomatic sanctions versus economic boycotts in compelling states to adhere to international human rights norms.', coreConcepts: ['sanctions', 'boycotts', 'norms', 'human rights', 'effectiveness'] },
                { num: 4, text: 'Examine the view that social movements are more legitimate than state institutions in defining the contemporary human rights agenda.', coreConcepts: ['social movements', 'legitimate', 'state institutions', 'human rights agenda'] }
            ]
        },
        sectionB: {
            label: 'Section B: Integrating Questions',
            instruction: 'Answer ONE question from this section. (15 marks)',
            questions: [
                { num: 5, text: 'To what extent has the rise of "digital sovereignty" complicated the enforcement of universal human rights standards across borders?', coreConcepts: ['digital sovereignty', 'human rights', 'borders', 'enforcement'] },
                { num: 6, text: '"The legitimacy of a state is fundamentally linked to its ability to protect minority rights." Discuss this claim with reference to two case studies.', coreConcepts: ['legitimacy', 'minority rights', 'state', 'protection'] },
                { num: 7, text: 'Evaluate the view that humanitarian intervention often serves to mask traditional power-political objectives in the name of global justice.', coreConcepts: ['humanitarian intervention', 'power-political', 'justice', 'mask'] },
                { num: 8, text: 'Discuss the extent to which global economic interdependence has forced states to compromise on their domestic human rights obligations.', coreConcepts: ['economic interdependence', 'compromise', 'human rights obligations', 'forced'] }
            ]
        }
    },

    // ── Exam 2: Development & Sustainability Focus ──
    {
        id: 'p2-2',
        title: 'Exam 2 — Development, Sustainability & Power',
        sectionA: {
            label: 'Section A: Thematic Studies',
            instruction: 'Answer ONE question from this section. (15 marks)',
            questions: [
                { num: 1, text: 'Evaluate the claim that the United Nations Sustainable Development Goals (SDGs) are more aspirational than achievable in the current global political landscape.', coreConcepts: ['SDGs', 'aspirational', 'achievable', 'global politics', 'goals'] },
                { num: 2, text: '"Foreign aid perpetuates dependency rather than promoting genuine development." Discuss this claim with reference to specific examples.', coreConcepts: ['foreign aid', 'dependency', 'development', 'dependency theory'] },
                { num: 3, text: 'To what extent do transnational corporations (TNCs) contribute to or undermine sustainable development in the Global South?', coreConcepts: ['TNCs', 'sustainable development', 'Global South', 'corporations'] },
                { num: 4, text: 'Evaluate the effectiveness of international financial institutions (World Bank, IMF) in promoting equitable economic development.', coreConcepts: ['World Bank', 'IMF', 'equitable', 'economic development', 'institutions'] }
            ]
        },
        sectionB: {
            label: 'Section B: Integrating Questions',
            instruction: 'Answer ONE question from this section. (15 marks)',
            questions: [
                { num: 5, text: '"Economic power, not political power, is the most significant factor shaping global development outcomes." Evaluate this claim.', coreConcepts: ['economic power', 'political power', 'development', 'outcomes'] },
                { num: 6, text: 'To what extent does the concept of sovereignty limit the ability of the international community to address global inequality?', coreConcepts: ['sovereignty', 'inequality', 'international community', 'limit'] },
                { num: 7, text: 'Discuss the extent to which environmental sustainability requires states to sacrifice elements of their economic sovereignty.', coreConcepts: ['environmental sustainability', 'economic sovereignty', 'sacrifice', 'states'] },
                { num: 8, text: '"Legitimacy in development is determined by who benefits, not by who governs." Evaluate this statement with reference to relevant examples.', coreConcepts: ['legitimacy', 'development', 'benefits', 'governs'] }
            ]
        }
    },

    // ── Exam 3: Peace & Conflict Focus ──
    {
        id: 'p2-3',
        title: 'Exam 3 — Peace, Conflict & International Relations',
        sectionA: {
            label: 'Section A: Thematic Studies',
            instruction: 'Answer ONE question from this section. (15 marks)',
            questions: [
                { num: 1, text: 'Evaluate the effectiveness of United Nations peacekeeping operations in preventing the recurrence of conflict in post-conflict states.', coreConcepts: ['peacekeeping', 'UN', 'conflict', 'recurrence', 'post-conflict'] },
                { num: 2, text: '"Nuclear weapons are a stabilizing force in international relations." Discuss this claim with reference to the theory of deterrence and contemporary examples.', coreConcepts: ['nuclear weapons', 'stabilizing', 'deterrence', 'contemporary'] },
                { num: 3, text: 'To what extent has the concept of "Responsibility to Protect" (R2P) changed the way the international community responds to mass atrocities?', coreConcepts: ['R2P', 'Responsibility to Protect', 'mass atrocities', 'international community'] },
                { num: 4, text: 'Evaluate the claim that hybrid warfare and cyberattacks represent a greater threat to global security than traditional armed conflict.', coreConcepts: ['hybrid warfare', 'cyberattacks', 'global security', 'armed conflict'] }
            ]
        },
        sectionB: {
            label: 'Section B: Integrating Questions',
            instruction: 'Answer ONE question from this section. (15 marks)',
            questions: [
                { num: 5, text: '"Peace cannot be achieved without addressing the underlying power imbalances between states." Evaluate this claim with reference to at least two contemporary conflicts.', coreConcepts: ['peace', 'power imbalances', 'states', 'conflicts'] },
                { num: 6, text: 'To what extent do regional organizations (e.g., NATO, AU, ASEAN) strengthen or undermine state sovereignty in their pursuit of peace and security?', coreConcepts: ['regional organizations', 'NATO', 'AU', 'ASEAN', 'sovereignty', 'peace', 'security'] },
                { num: 7, text: 'Discuss the claim that the arms trade is the single greatest obstacle to achieving lasting peace in the modern world.', coreConcepts: ['arms trade', 'obstacle', 'lasting peace', 'modern world'] },
                { num: 8, text: '"Sovereignty must sometimes be compromised to protect human security." Evaluate this statement with reference to specific examples of intervention.', coreConcepts: ['sovereignty', 'human security', 'intervention', 'compromised'] }
            ]
        }
    },

    // ── Exam 4: Cross-Theme Power Focus ──
    {
        id: 'p2-4',
        title: 'Exam 4 — Power, Legitimacy & Global Order',
        sectionA: {
            label: 'Section A: Thematic Studies',
            instruction: 'Answer ONE question from this section. (15 marks)',
            questions: [
                { num: 1, text: '"Soft power is more effective than hard power in achieving long-term foreign policy objectives." Evaluate this claim with reference to specific states and their strategies.', coreConcepts: ['soft power', 'hard power', 'foreign policy', 'strategies'] },
                { num: 2, text: 'To what extent have social movements been successful in challenging the power of states and international institutions?', coreConcepts: ['social movements', 'success', 'power', 'states', 'institutions'] },
                { num: 3, text: 'Evaluate the claim that the rise of populist leaders in democratic states threatens the legitimacy of liberal democracy as a model of governance.', coreConcepts: ['populist owners', 'democratic states', 'legitimacy', 'liberal democracy', 'governance'] },
                { num: 4, text: '"International organizations serve the interests of powerful states rather than promoting global justice." Discuss this claim.', coreConcepts: ['international organizations', 'powerful states', 'global justice', 'interests'] }
            ]
        },
        sectionB: {
            label: 'Section B: Integrating Questions',
            instruction: 'Answer ONE question from this section. (15 marks)',
            questions: [
                { num: 5, text: 'To what extent has the shift from a unipolar to a multipolar world order reshaped power dynamics in global politics?', coreConcepts: ['unipolar', 'multipolar', 'world order', 'power dynamics'] },
                { num: 6, text: '"Legitimacy in global politics depends more on power than on principles." Evaluate this claim with reference to relevant examples.', coreConcepts: ['legitimacy', 'power', 'principles', 'global politics'] },
                { num: 7, text: 'Discuss the extent to which economic interdependence between states promotes peace or creates new forms of conflict.', coreConcepts: ['economic interdependence', 'peace', 'conflict', 'states'] },
                { num: 8, text: 'To what extent can global governance institutions balance state sovereignty with the need for collective action on transnational challenges?', coreConcepts: ['global governance', 'state sovereignty', 'collective action', 'transnational challenges'] }
            ]
        }
    },

    // ── Exam 5: Cross-Theme Sovereignty Focus ──
    {
        id: 'p2-5',
        title: 'Exam 5 — Sovereignty, Globalization & Identity',
        sectionA: {
            label: 'Section A: Thematic Studies',
            instruction: 'Answer ONE question from this section. (15 marks)',
            questions: [
                { num: 1, text: '"Globalization has made the concept of state sovereignty obsolete." Evaluate this claim with reference to the political, economic, and cultural dimensions of globalization.', coreConcepts: ['globalization', 'state sovereignty', 'obsolete', 'dimensions'] },
                { num: 2, text: 'To what extent do secessionist and independence movements reflect legitimate expressions of self-determination versus threats to state sovereignty?', coreConcepts: ['secessionist', 'independence', 'legitimate', 'self-determination', 'sovereignty'] },
                { num: 3, text: 'Evaluate the claim that digital technology has fundamentally shifted the balance of power between states and their citizens.', coreConcepts: ['digital technology', 'balance of power', 'states', 'citizens'] },
                { num: 4, text: '"The principle of non-intervention in international law protects authoritarian regimes more than it protects vulnerable populations." Discuss.', coreConcepts: ['non-intervention', 'international law', 'authoritarian regimes', 'vulnerable populations'] }
            ]
        },
        sectionB: {
            label: 'Section B: Integrating Questions',
            instruction: 'Answer ONE question from this section. (15 marks)',
            questions: [
                { num: 5, text: 'To what extent do military alliances strengthen or undermine the sovereignty of member states?', coreConcepts: ['military alliances', 'sovereignty', 'member states'] },
                { num: 6, text: '"State sovereignty creates stable foundations for the realization of justice for individuals and communities." Evaluate this claim.', coreConcepts: ['state sovereignty', 'stable', 'justice', 'individuals', 'communities'] },
                { num: 7, text: 'Discuss the extent to which regional trade agreements and economic blocs (e.g., EU, ASEAN, AU) challenge traditional notions of state sovereignty.', coreConcepts: ['regional trade agreements', 'economic blocs', 'EU', 'ASEAN', 'AU', 'sovereignty'] },
                { num: 8, text: 'To what extent is state sovereignty still relevant in an era of transnational threats such as climate change, pandemics, and cyber warfare?', coreConcepts: ['state sovereignty', 'relevant', 'transnational threats', 'climate change', 'pandemics', 'cyber warfare'] }
            ]
        }
    }
];

// ------ PAPER 3: HL Extension — Global Challenges (1h 30m, 28 Marks) ------
// Q1 = 3m, Q2a = 4m, Q2b = 6m, Q3 = 15m
// Single stimulus, case-study-referenced questions

export const paper3Exams = [
    // ── Exam 1: Resource Sovereignty and the Green Transition [NEW SIMULATION] ──
    {
        id: 'p3-1',
        title: 'Resource Sovereignty and the Green Transition',
        challenge: 'Sustainability & Power',
        stimulus: `The global transition to renewable energy has triggered a new era of 'Resource Sovereignty' where state-centric control over critical minerals — such as lithium, cobalt, and rare earth elements — is reshaping power dynamics. While the Global North leads in technological patents and consumption, the Global South possesses the majority of the raw materials necessary for this transition. This interdependence creates a complex tension between economic development and environmental protection. For many resource-rich nations, the 'green rush' is seen as an opportunity to break from historical dependency cycles through 'value-addition' policies, such as banning raw ore exports to force domestic processing.

However, this shift often overlooks the local human security implications. Indigenous communities in regions like the 'Lithium Triangle' (Argentina, Bolivia, Chile) argue that large-scale extraction threatens their water rights and traditional ways of life, even if justified as a global environmental good. The legitimacy of international climate frameworks is increasingly questioned when they fail to account for the 'environmental externalities' of the green transition in the periphery. This necessitates a move toward 'inclusive governance' that balances the macro-necessity of decarbonization with the micro-rights of affected stakeholders.`,
        questions: [
            { num: 1, marks: 3, text: 'Using two examples from the stimulus, explain how the \"green rush\" creates new interdependencies between the Global North and the Global South.', coreConcepts: ['green rush', 'interdependencies', 'Global North', 'Global South'] },
            { num: '2a', marks: 4, text: 'With reference to a specific political issue from one of your case studies, explain how the pursuit of \"resource sovereignty\" has impacted the rights of a marginalized community.', coreConcepts: ['resource sovereignty', 'marginalized community', 'rights', 'impacted'] },
            { num: '2b', marks: 6, text: 'Based on the political issue identified in 2(a), recommend how a non-state actor could advocate for more equitable resource management in that context.', coreConcepts: ['non-state actor', 'advocate', 'equitable', 'resource management'] },
            { num: 3, marks: 15, text: 'With reference to one of the HL topic areas, discuss the view that the transition to sustainable development is fundamentally a challenge of power distribution rather than just a technological shift.', coreConcepts: ['sustainable development', 'power distribution', 'technological shift', 'challenge'] }
        ]
    },

    // ── Exam 2: Poverty and Inequality ──
    {
        id: 'p3-2',
        title: 'Poverty, Inequality and Global Development',
        challenge: 'Poverty',
        stimulus: `Despite decades of international development efforts, extreme poverty remains a defining challenge of global politics. The World Bank reported that by 2024, approximately 700 million people — nearly 9% of the global population — were living on less than $2.15 per day. While significant progress was made between 2000 and 2019, the COVID-19 pandemic reversed years of gains, pushing an estimated 75-95 million additional people into extreme poverty.

The geography of poverty has also shifted dramatically. Sub-Saharan Africa now accounts for approximately 60% of the world's extreme poor, compared to 15% in 1990. Meanwhile, rapid economic growth in East and South Asia lifted hundreds of millions out of poverty but created new forms of inequality within those regions. The Gini coefficient — a measure of income inequality — has risen in 71% of countries over the past three decades, suggesting that growth alone does not reduce inequality.

Critics of mainstream development approaches argue that the focus on GDP growth and market liberalization has failed to address the structural causes of poverty, including colonial legacies, unfair trade agreements, and debt burdens. Alternative frameworks, such as Amartya Sen's capabilities approach, emphasize that development should be measured not merely by income but by people's ability to lead lives they have reason to value — including access to education, healthcare, political participation, and freedom from discrimination.`,
        questions: [
            { num: 1, marks: 3, text: 'Identify three key trends in global poverty described in the stimulus.', coreConcepts: ['trends', 'global poverty', 'poverty'] },
            { num: '2a', marks: 4, text: 'With reference to a specific political issue from one of your case studies, explain how poverty has impacted the political participation or representation of a particular community or group.', coreConcepts: ['poverty', 'political participation', 'representation', 'community'] },
            { num: '2b', marks: 6, text: 'Based on the political issue identified in 2(a), recommend how international organizations could more effectively address the structural causes of poverty in that context.', coreConcepts: ['international organizations', 'structural causes', 'poverty', 'address'] },
            { num: 3, marks: 15, text: 'With reference to one of the HL topic areas, evaluate the claim that mainstream approaches to global development have prioritized economic growth over genuine poverty reduction.', coreConcepts: ['mainstream approaches', 'economic growth', 'poverty reduction', 'prioritized'] }
        ]
    },

    // ── Exam 3: Environment and Climate Change ──
    {
        id: 'p3-3',
        title: 'Environmental Challenges and Climate Governance',
        challenge: 'Environment',
        stimulus: `The Intergovernmental Panel on Climate Change (IPCC) Sixth Assessment Report, published in 2023, confirmed that human activities have unequivocally caused global warming of approximately 1.1°C above pre-industrial levels. The report warned that without immediate and drastic reductions in greenhouse gas emissions, the world is on track to exceed the 1.5°C threshold by the early 2030s, leading to irreversible tipping points including the collapse of major ice sheets, widespread coral reef die-off, and accelerated sea-level rise.

The political response to climate change reveals deep fault lines in global governance. While the Paris Agreement established a framework for collective action, implementation remains uneven. Developed nations have failed to meet their commitment of providing $100 billion annually in climate finance to developing countries. Meanwhile, major emitters like China and India argue that their developmental needs must be balanced against emission reduction targets.

Small Island Developing States (SIDS) face an existential threat. Countries like Tuvalu, the Maldives, and the Marshall Islands may become uninhabitable within decades due to rising sea levels. These nations have emerged as powerful moral voices in climate negotiations, invoking the concept of "loss and damage" to demand compensation from historically high-emitting nations. The establishment of a Loss and Damage Fund at COP28 in 2023 was hailed as a breakthrough, though its funding mechanisms remain contested.`,
        questions: [
            { num: 1, marks: 3, text: 'Based on the stimulus, identify three specific consequences of climate change highlighted by the IPCC report.', coreConcepts: ['consequences', 'climate change', 'IPCC', 'warming'] },
            { num: '2a', marks: 4, text: 'With reference to a specific political issue from one of your case studies, explain how environmental challenges have disproportionately affected a particular community or region.', coreConcepts: ['environmental challenges', 'disproportionately', 'community', 'region'] },
            { num: '2b', marks: 6, text: 'Based on the political issue identified in 2(a), recommend how the international community could more equitably distribute the costs and responsibilities of addressing climate change.', coreConcepts: ['international community', 'equitably', 'costs', 'responsibilities', 'addressing'] },
            { num: 3, marks: 15, text: 'With reference to one of the HL topic areas, discuss the view that the current international framework for addressing climate change prioritizes the interests of powerful states over the needs of the most vulnerable populations.', coreConcepts: ['international framework', 'powerful states', 'vulnerable populations', 'interests'] }
        ]
    },

    // ── Exam 4: Health and Global Governance ──
    {
        id: 'p3-4',
        title: 'Global Health Challenges and Governance',
        challenge: 'Health',
        stimulus: `The COVID-19 pandemic exposed critical weaknesses in the global health governance architecture. The World Health Organization (WHO), tasked with coordinating international health responses, faced criticism for its delayed declaration of a public health emergency and its perceived deference to China during the early stages of the outbreak. The pandemic also revealed the deep inequities in global health systems: while wealthy nations secured advance purchase agreements for vaccines, many developing countries had to wait months or years for access.

The COVAX initiative, designed to ensure equitable global vaccine distribution, fell dramatically short of its targets. By mid-2022, while over 70% of the population in high-income countries had received at least one vaccine dose, the figure in low-income countries was below 15%. Pharmaceutical companies like Pfizer and Moderna generated hundreds of billions in revenue from vaccines developed with substantial public funding, yet resisted calls to waive intellectual property protections under the TRIPS agreement.

The pandemic also accelerated existing trends: the erosion of trust in scientific institutions, the weaponization of health misinformation on social media, and the use of pandemic restrictions by authoritarian governments to suppress dissent. Post-pandemic, debates continue over how to reform global health governance to prevent future crises, balance national sovereignty with collective health security, and ensure that the benefits of medical innovation are shared equitably across the world.`,
        questions: [
            { num: 1, marks: 3, text: 'Based on the stimulus, identify three ways in which the COVID-19 pandemic revealed weaknesses in global health governance.', coreConcepts: ['revealed', 'weaknesses', 'global health governance', 'COVID-19'] },
            { num: '2a', marks: 4, text: 'With reference to a specific political issue from one of your case studies, explain how health-related challenges have created or intensified political tensions between different actors.', coreConcepts: ['health-related', 'tensions', 'actors', 'intensified'] },
            { num: '2b', marks: 6, text: 'Based on the political issue identified in 2(a), recommend how global governance structures could be reformed to ensure more equitable access to healthcare and medical resources.', coreConcepts: ['global governance', 'reformed', 'equitable', 'healthcare', 'resources'] },
            { num: 3, marks: 15, text: 'With reference to one of the HL topic areas, evaluate the claim that state sovereignty is the primary obstacle to effective global health governance.', coreConcepts: ['state sovereignty', 'obstacle', 'global health governance', 'effective'] }
        ]
    },

    // ── Exam 5: Security and Technology ──
    {
        id: 'p3-5',
        title: 'Security, Technology and Autonomous Weapons',
        challenge: 'Security & Technology',
        stimulus: `The rapid development of artificial intelligence (AI) and autonomous weapons systems is transforming the nature of warfare and security in global politics. Lethal autonomous weapons systems (LAWS) — sometimes called "killer robots" — are weapons that can select and engage targets without meaningful human control. As of 2024, at least 30 countries, including the United States, China, Russia, Israel, and the United Kingdom, are developing or deploying weapons with increasing levels of autonomy.

Advocates argue that autonomous weapons could be more precise than human soldiers, reducing civilian casualties and removing soldiers from harm's way. However, critics — including a coalition of over 250 NGOs in the "Campaign to Stop Killer Robots" — argue that delegating life-and-death decisions to machines raises fundamental ethical questions about accountability, discrimination, and human dignity. If an autonomous weapon kills a civilian, who is responsible: the programmer, the military commander, the manufacturer, or the machine itself?

The existing international legal framework, including International Humanitarian Law (IHL) and the Convention on Certain Conventional Weapons (CCW), was not designed to address autonomous weapons. Despite years of negotiations, efforts to establish a binding international treaty banning or regulating LAWS have been blocked by major military powers. The absence of governance creates a dangerous arms race in AI-enabled weapons, with significant implications for global security, deterrence theory, and the laws of war.`,
        questions: [
            { num: 1, marks: 3, text: 'Based on the stimulus, identify three concerns raised about the use of lethal autonomous weapons systems (LAWS).', coreConcepts: ['concerns', 'LAWS', 'lethal autonomous weapons', 'accountability'] },
            { num: '2a', marks: 4, text: 'With reference to a specific political issue from one of your case studies, explain how technological developments have altered the balance of power between different actors in a security context.', coreConcepts: ['technological developments', 'balance of power', 'security context', 'actors'] },
            { num: '2b', marks: 6, text: 'Based on the political issue identified in 2(a), recommend how the international community could establish governance frameworks to regulate the use of emerging military technologies.', coreConcepts: ['international community', 'governance frameworks', 'regulate', 'military technologies'] },
            { num: 3, marks: 15, text: 'With reference to one of the HL topic areas, discuss the view that the development of autonomous weapons represents a greater threat to global security than a pathway to more humane warfare.', coreConcepts: ['autonomous weapons', 'threat', 'global security', 'humane warfare'] }
        ]
    }
];
