import React, { useState, useEffect } from 'react';
import { Shield, PenTool, Zap, AlertTriangle, CheckCircle, ChevronRight, RefreshCw, BookOpen } from 'lucide-react';

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
const WritingStudio = () => {
    const [subTab, setSubTab] = useState('bank');

    // --- Sub-Tab components ---

    const QuestionBank = () => {
        const questions = [
            { year: "2024", text: "Effective enforcement of Human Rights undermines state sovereignty. To what extent do you agree?" },
            { year: "2023", text: "Discuss the extent to which cultural relativism can be used to justify different concepts of human rights." },
            { year: "2022", text: "Examine the claim that increased interactions and interconnectedness have fundamentally changed the nature of sovereignty." },
            { year: "2021", text: "Evaluate the claim that sovereign states become less powerful when they join IGOs." },
            { year: "2020", text: "Discuss why non-violent protest is sometimes able to achieve success against even the most powerful opponents." },
            { year: "2019", text: "Structural violence is increasingly important to achieving lasting peace. To what extent do you agree?" }
        ];
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-emerald-400">Paper 2 Question Bank (2014-2024)</h3>
                <div className="grid gap-3">
                    {questions.map((q, i) => (
                        <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-emerald-500/50 transition-colors cursor-pointer group">
                            <span className="text-xs font-bold text-emerald-500/70 uppercase mb-1 block">May {q.year}</span>
                            <p className="text-gray-200 group-hover:text-white">"{q.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const IntroWizard = () => {
        const [step, setStep] = useState(1);
        const [data, setData] = useState({ concept: '', definition: '', caseA: '', caseB: '', thesis: '' });
        const updateData = (key, val) => setData({ ...data, [key]: val });

        if (step === 3) return (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
                <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-xl leading-relaxed text-gray-300">
                    <p>
                        "The central tension in this enquiry lies in the evolution of <strong className="text-white">{data.concept || '[Concept]'}</strong>, fundamentally defined as <span className="italic">{data.definition || '[Definition]'}</span>.
                        While globalist perspectives suggest that <strong className="text-white">{data.concept}</strong> is being eroded by transnational challenges, statists argue it remains the bedrock of world order.
                        This essay will bridge these perspectives by synthesising the case studies of <strong className="text-white">{data.caseA || '[Case A]'}</strong> and <strong className="text-white">{data.caseB || '[Case B]'}</strong> to demonstrate
                        that {data.thesis || '[Thesis Statement]'}. Underpinning this analysis is the recognition of a 'power gap' that necessitates a shift in how we conceptualise authority in the 21st century."
                    </p>
                </div>
                <Button variant="outline" onClick={() => setStep(1)}><RefreshCw size={16} /> Start Over</Button>
            </div>
        );

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-emerald-400">Golden Thread Intro Builder</h3>
                    <span className="text-xs text-gray-500">Step {step} of 2</span>
                </div>
                {step === 1 ? (
                    <div className="space-y-4">
                        <input className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3" placeholder="Key Concept (e.g., Legitimacy)" onChange={(e) => updateData('concept', e.target.value)} />
                        <textarea className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 h-24" placeholder="Basic Definition..." onChange={(e) => updateData('definition', e.target.value)} />
                        <Button onClick={() => setStep(2)}>Next <ChevronRight size={18} /></Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <input className="flex-1 bg-glopo-dark border border-glopo-border rounded-lg p-3" placeholder="Case Study A" onChange={(e) => updateData('caseA', e.target.value)} />
                            <input className="flex-1 bg-glopo-dark border border-glopo-border rounded-lg p-3" placeholder="Case Study B" onChange={(e) => updateData('caseB', e.target.value)} />
                        </div>
                        <textarea className="w-full bg-glopo-dark border border-glopo-border rounded-lg p-3 h-24" placeholder="Thesis Statement (Main Claim)" onChange={(e) => updateData('thesis', e.target.value)} />
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                            <Button onClick={() => setStep(3)}>Generate Intro</Button>
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

    const CaseLibrary = () => {
        const cases = [
            { name: "The Rohingya (Myanmar)", theme: "Human Rights / Identity", facts: ["800k+ displaced", "Denial of citizenship (1982 Act)", "Structural violence examples."] },
            { name: "Syrian Civil War", theme: "Sovereignty / Conflict", facts: ["Proxy war dynamics", "Erosion of state authority", "Intervention vs Sovereignty tension."] },
            { name: "Ukraine (2022-Present)", theme: "Security / Interdependence", facts: ["Westphalian sovereignty breach", "Economic interdependence as a weapon", "NATO vs Realism."] }
        ];
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-emerald-400">Case Study Rapid Reference</h3>
                <div className="grid gap-4">
                    {cases.map((c, i) => (
                        <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-white">{c.name}</h4>
                                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md">{c.theme}</span>
                            </div>
                            <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                                {c.facts.map((f, j) => <li key={j}>{f}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <PenTool className="text-emerald-500" /> Writing Studio
            </h2>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: 'bank', label: 'Q-Bank', icon: BookOpen },
                    { id: 'intro', label: 'Intro Builder', icon: Zap },
                    { id: 'peel', label: 'PEEL Lab', icon: PenTool },
                    { id: 'cases', label: 'Case Library', icon: Shield }
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
                {subTab === 'intro' && <IntroWizard />}
                {subTab === 'peel' && <PeelLab />}
                {subTab === 'cases' && <CaseLibrary />}
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
            prompt: "Peace is defined simply as the absence of armed conflict (Negative Peace).",
            supports: ["Ceasefire", "Stability", "Deterrence"],
            challenges: ["Structural Violence", "Inequality", "Justice", "Positive Peace"]
        },
        {
            prompt: "Human Rights are universal and transcend cultural boundaries.",
            supports: ["Justice", "Liberty", "Human Dignity"],
            challenges: ["Sovereignty", "Relativism", "Legitimacy", "Religious Tradition"]
        },
        {
            prompt: "Globalization creates a level playing field for all nations.",
            supports: ["Interdependence", "Communication", "Free Trade"],
            challenges: ["Inequality", "Digital Divide", "Protectionism", "Power Asymmetry"]
        },
        {
            prompt: "Violence only occurs through direct physical force.",
            supports: ["Conflict", "War", "State Force"],
            challenges: ["Structural Violence", "Cultural Violence", "Inequality", "Poverty"]
        },
        {
            prompt: "Sustainability requires halting all economic expansion.",
            supports: ["Conservation", "Resource Management", "Ecology"],
            challenges: ["Development", "Innovation", "Green Growth", "Technology"]
        },
        {
            prompt: "Legitimacy is derived solely from democratic elections.",
            supports: ["Consent", "Rule of Law", "Liberty"],
            challenges: ["Tradition", "Charisma", "Performance", "Basic Needs"]
        },
        {
            prompt: "Interdependence makes war obsolete between trading partners.",
            supports: ["Liberalism", "Complex Interdependence", "Cooperation"],
            challenges: ["Realism", "Power", "Security Dilemma", "Nationalism"]
        }
    ];

    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState([]);
    const [finished, setFinished] = useState(false);

    const currentDrill = drills[currentIdx];
    const allOptions = [...currentDrill.supports, ...currentDrill.challenges].sort();

    const toggleOption = (opt) => {
        if (selected.includes(opt)) {
            setSelected(selected.filter(o => o !== opt));
        } else {
            setSelected([...selected, opt]);
        }
    };

    const checkAnswer = () => {
        const correctSupports = selected.filter(o => currentDrill.supports.includes(o)).length;
        const incorrectChoices = selected.filter(o => currentDrill.challenges.includes(o)).length;

        setScore(score + (correctSupports - incorrectChoices));

        if (currentIdx < drills.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setSelected([]);
        } else {
            setFinished(true);
        }
    };

    if (finished) {
        return (
            <Card className="text-center animate-in zoom-in-95">
                <h3 className="text-2xl font-bold mb-2">Drill Complete!</h3>
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

                <p className="text-sm text-gray-500 mb-4">Select all concepts that <span className="text-emerald-400">SUPPORT</span> this claim. Avoid those that challenge it.</p>

                <div className="flex flex-wrap gap-2 mb-8">
                    {allOptions.map(opt => (
                        <button
                            key={opt}
                            onClick={() => toggleOption(opt)}
                            className={`px-4 py-2 rounded-full border transition-all ${selected.includes(opt)
                                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                                : "border-glopo-border hover:border-gray-500 text-gray-400"
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                <Button onClick={checkAnswer} className="w-full" disabled={selected.length === 0}>
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

// --- Main App ---
export default function App() {
    const [activeTab, setActiveTab] = useState('policy');

    return (
        <div className="min-h-screen bg-glopo-dark text-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 rounded-2xl mb-4 border border-blue-500/20">
                        <BookOpen className="text-blue-500" size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
                        GloPo <span className="text-blue-500">Companion</span>
                    </h1>
                    <p className="text-gray-500 text-lg">IB Global Politics Master Study Suite (2026 Syllabus)</p>
                </header>

                <nav className="flex flex-wrap gap-2 mb-8 justify-center">
                    {[
                        { id: 'policy', label: 'Policy Engine', icon: Shield },
                        { id: 'writing', label: 'Writing Studio', icon: PenTool },
                        { id: 'drill', label: 'Drill Mode', icon: Zap },
                        { id: 'warroom', label: 'War Room', icon: AlertTriangle },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id
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
                    {activeTab === 'drill' && <DrillMode />}
                    {activeTab === 'warroom' && <WarRoom />}
                </main>

                <footer className="mt-16 pt-8 border-t border-glopo-border text-center text-gray-600 text-sm">
                    <p>&copy; 2026 IB Global Politics Study Suite. Designed for Level 7 Scholars.</p>
                </footer>
            </div>
        </div>
    );
}
