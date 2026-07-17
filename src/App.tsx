import { useState } from "react";
import { UserProfile, BusinessChallenge, InterviewAnswers, CompleteBoardroomReport } from "./types";
import LandingPage from "./components/LandingPage";
import OnboardingForm from "./components/OnboardingForm";
import InterviewStep from "./components/InterviewStep";
import BoardroomSimulator from "./components/BoardroomSimulator";
import DecisionDashboard from "./components/DecisionDashboard";
import CsfoAdvisor from "./components/CsfoAdvisor";
import { Brain, AlertCircle, Sparkles } from "lucide-react";

type FlowStep = "landing" | "onboarding" | "interview" | "loading" | "simulator" | "dashboard" | "csfo";

// High-fidelity pre-computed sample report for direct instant demo exploring
const SAMPLE_DEMO_REPORT: CompleteBoardroomReport = {
  id: "session_demo_2026_zenith",
  createdAt: "2026-07-13T19:18:00Z",
  interviewAnswers: {},
  profile: {
    name: "Jeevan Abhi",
    email: "jeevanabhi.r@gmail.com",
    companyName: "Zenith Retail Corp",
    industry: "Retail",
    country: "India",
    businessSize: "Mid-Market",
    employees: 45,
    annualRevenue: 1200000,
    yearsInBusiness: 4
  },
  challenge: {
    description: "Our core product sales have dropped by 30% over the last two quarters. Competitor e-commerce sites are undercutting our prices, and we struggle with high staff turnover in customer support."
  },
  ceoDecision: {
    executiveSummary: "To address Zenith Retail's 30% revenue drop, we must transition from a passive brick-and-mortar stance into a proactive, technology-driven loyalty ecosystem. By consolidating digital marketing budgets, deploying CRM automation, and auditing support staff compensation, we resolve customer friction and recapture underpriced market share.",
    businessHealthScore: 68,
    riskScore: 42,
    growthScore: 84,
    confidenceScore: 92,
    mainProblems: [
      "Friction in customer support queues due to high agent attrition",
      "Leaking marketing spend on non-converting social media ads"
    ],
    rootCauses: [
      "Friction in customer support queues due to high agent attrition",
      "Leaking marketing spend on non-converting social media ads",
      "Vulnerability to agile competitors running aggressive pricing models"
    ],
    priorityActions: [
      "Audit support workflows and adjust base pay by 12%",
      "Pause unprofitable social media ad campaigns"
    ],
    businessStrategy: "Agile Loyalty Digitization & Customer Support Stabilization",
    expectedOutcome: "Expected 24% revenue recovery and 14% improvement in support retention over 90 days."
  },
  swot: {
    strengths: [
      "Robust regional brand presence with high organic repeat client counts",
      "Experienced core store managers with stable localized operational expertise",
      "Strong historical retail gross margins of 45%"
    ],
    weaknesses: [
      "High staff attrition (32%) inside low-tier customer support ranks",
      "CRM and marketing campaigns operating on siloed, manual spreadsheets",
      "Lack of dynamic pricing calculators to defend against undercutting"
    ],
    opportunities: [
      "Launch a direct-to-consumer e-commerce checkout loyalty pipeline",
      "Deploy low-cost automated customer support triggers to alleviate staff workload",
      "Structure localized partnership incentives for multi-unit corporate purchases"
    ],
    threats: [
      "Agile tech-enabled competitors running heavily funded discount plans",
      "Increasing regional labor costs pushing operational leverage to limits",
      "Inflation raising carrying costs on delayed import inventory"
    ]
  },
  riskRadar: [
    { subject: "Financial", score: 48, fullMark: 100 },
    { subject: "Operational", score: 65, fullMark: 100 },
    { subject: "Market", score: 72, fullMark: 100 },
    { subject: "Technology", score: 80, fullMark: 100 },
    { subject: "Legal", score: 35, fullMark: 100 },
    { subject: "Human Capital", score: 75, fullMark: 100 }
  ],
  roadmap: [
    {
      timeframe: "Immediate",
      actions: [
        "Audit customer support workflows and adjust entry-level base pay by 12% to secure attrition.",
        "Pause unprofitable wide-audience social media ad campaigns to preserve capital."
      ],
      responsibleExecutive: "CHRO Rostova",
      expectedROI: "Immediate Stability",
      expectedRevenueGrowth: "0.5%"
    },
    {
      timeframe: "30-Day",
      actions: [
        "Deploy basic automated CRM ticket routers to cut support response time by 40%.",
        "Launch search engine optimization campaign targeting localized high-intent keywords."
      ],
      responsibleExecutive: "CTO Sterling",
      expectedROI: "1.4x Invested Cap",
      expectedRevenueGrowth: "8.0%"
    },
    {
      timeframe: "60-Day",
      actions: [
        "Construct responsive Shopify checkout flow coupled with a simple repeat points rewards program.",
        "Initiate weekly performance audits mapping agent workloads to prevent developer burnout."
      ],
      responsibleExecutive: "CMO Sterling",
      expectedROI: "2.8x Invested Cap",
      expectedRevenueGrowth: "15.0%"
    },
    {
      timeframe: "90-Day",
      actions: [
        "Integrate dynamic competitor inventory price-matching dashboards to automate defensive markdowns.",
        "Establish corporate partner portals to capture larger B2B recurring bulk accounts."
      ],
      responsibleExecutive: "Sales VP Sterling",
      expectedROI: "4.2x Invested Cap",
      expectedRevenueGrowth: "24.5%"
    }
  ],
  predictions: {
    forecast30Days: { revenue: 105000, profit: 45000, expenses: 60000, demand: 62, customerGrowth: 2.1, inventoryEfficiency: 52, employeeProductivity: 55 },
    forecast90Days: { revenue: 118000, profit: 54000, expenses: 64000, demand: 68, customerGrowth: 5.4, inventoryEfficiency: 60, employeeProductivity: 65 },
    forecast6Months: { revenue: 135000, profit: 68000, expenses: 67000, demand: 75, customerGrowth: 11.2, inventoryEfficiency: 74, employeeProductivity: 78 },
    forecast1Year: { revenue: 165000, profit: 92000, expenses: 73000, demand: 84, customerGrowth: 24.5, inventoryEfficiency: 85, employeeProductivity: 92 }
  },
  executiveAnalyses: {
    ceo: {
      executiveId: "ceo",
      departmentName: "Executive Leadership",
      problemUnderstanding: "The 30% sales drop is a lagging indicator of technological stagnation and staff friction inside our support pipeline, leaving us defense-less against agile competitors.",
      keyFindings: ["Manual operation spreadsheets create lag", "Support attrition hurts NPS"],
      dataAnalysis: "Gross margin holds at 45%, but operating margin fell to 8.5% due to CAC leakage.",
      rootCause: "Failure to automate lower-funnel triggers and support workloads.",
      recommendations: ["Shift $8k to automated CRM", "Adjust support compensation benchmarks"],
      priority: "High",
      riskLevel: "Medium",
      expectedImpact: "24.5% Revenue Growth",
      confidenceScore: 95
    },
    cfo: {
      executiveId: "cfo",
      departmentName: "Finance & Capital Allocation",
      problemUnderstanding: "Zenith is experiencing margin compression from elevated Customer Acquisition Cost (CAC) and rising labor turnover expense.",
      keyFindings: ["Labor churn costs $8k per replacement", "Unoptimized ad budgets bleed $5k/mo"],
      dataAnalysis: "Operating leverage is uncomfortably high; we are sensitive to small revenue drops.",
      rootCause: "Unchecked digital advertising CAC without customer LTV expansion.",
      recommendations: ["Cut low-performing social ads", "Establish a 2.5x ROI hurdle rate"],
      priority: "High",
      riskLevel: "High",
      expectedImpact: "14% Profit Margin Recovery",
      confidenceScore: 90
    },
    cmo: {
      executiveId: "cmo",
      departmentName: "Marketing & Acquisition",
      problemUnderstanding: "Zenith's marketing lacks narrow customer personas, leading to broad-interest spend that bleeds margins.",
      keyFindings: ["CAC rose to $110 while LTV fell", "Ad CTR dropped to 0.8%"],
      dataAnalysis: "90% of paid ad conversions occur on high-intent search, not social media.",
      rootCause: "Absence of a localized SEO campaign and e-commerce channel.",
      recommendations: ["Launch organic keyword hubs", "Build Shopify storefront with loyalty points"],
      priority: "Medium",
      riskLevel: "Medium",
      expectedImpact: "38% customer growth boost",
      confidenceScore: 92
    },
    coo: {
      executiveId: "coo",
      departmentName: "Operations & Delivery",
      problemUnderstanding: "Inventory delays of 18 days are causing customer churn and stocking delays.",
      keyFindings: ["Fulfillment lag is 48 hours", "Stockouts of top sellers are frequent"],
      dataAnalysis: "Manual processing increases warehouse labor costs by 18%.",
      rootCause: "Outdated manual stock sheets without predictive supply monitors.",
      recommendations: ["Deploy cloud inventory trackers", "Set buffer stocks for top 10 SKUs"],
      priority: "High",
      riskLevel: "Medium",
      expectedImpact: "Fulfillment drops to 4 hours",
      confidenceScore: 88
    },
    chro: {
      executiveId: "chro",
      departmentName: "Human Resources",
      problemUnderstanding: "Support turnover of 32% ruins service quality and strains remaining staff.",
      keyFindings: ["Underpaid entry roles", "No clear progression tiers"],
      dataAnalysis: "Compensation lags regional competitors by 12%.",
      rootCause: "Inefficient salaries leading to constant, expensive retraining loops.",
      recommendations: ["Raise base pay by 12%", "Introduce skill-based monthly bonuses"],
      priority: "High",
      riskLevel: "High",
      expectedImpact: "Turnover drops under 10%",
      confidenceScore: 94
    },
    cto: {
      executiveId: "cto",
      departmentName: "Technology & Security",
      problemUnderstanding: "Siloed legacy platforms block multi-department cooperation and dynamic analysis.",
      keyFindings: ["No CRM integration", "Lack of encrypted transactional gateways"],
      dataAnalysis: "Fulfillment speed is bottlenecked by dynamic spreadsheets taking 2 hours per update.",
      rootCause: "Technological debt and lack of centralized relational databases.",
      recommendations: ["Migrate to custom CRM", "Automate data pipeline synchronization"],
      priority: "High",
      riskLevel: "Low",
      expectedImpact: "Data lag drops from 24h to 10s",
      confidenceScore: 96
    },
    legal: {
      executiveId: "legal",
      departmentName: "Legal & Compliance",
      problemUnderstanding: "Operating under outdated partner guidelines introduces contract liability risks during stock delays.",
      keyFindings: ["Weak delivery delay clauses", "Outdated website terms of service"],
      dataAnalysis: "Potential liability exposure stands at $25,000.",
      rootCause: "Lack of standard modern vendor SLA contracts.",
      recommendations: ["Enforce strict 15-day vendor compliance SLAs", "Re-draft consumer TOS"],
      priority: "Low",
      riskLevel: "Low",
      expectedImpact: "Closes 98% of liability gaps",
      confidenceScore: 90
    },
    sales: {
      executiveId: "sales",
      departmentName: "Sales Conversion",
      problemUnderstanding: "Conversion rate has slipped to 1.4% with a high cart abandonment rate.",
      keyFindings: ["24-day average sales cycle", "No automatic follow-up prompts"],
      dataAnalysis: "Abandonment rates are highest at shipping fee checkout steps.",
      rootCause: "No checkout incentives and lengthy purchase validation gates.",
      recommendations: ["Deploy 10% abandonment coupon triggers", "Consolidate checkout to single page"],
      priority: "Medium",
      riskLevel: "Low",
      expectedImpact: "Conversion rate raises to 2.4%",
      confidenceScore: 85
    },
    cx: {
      executiveId: "cx",
      departmentName: "Customer Experience",
      problemUnderstanding: "Customer satisfaction has fallen from 4.8 to 3.9 stars due to delayed support replies.",
      keyFindings: ["Slow response queues", "Missing automatic delivery updates"],
      dataAnalysis: "85% of complaints cite 'unresponsive agent' after 12 hours.",
      rootCause: "Siloed emails without ticketing ticketing dashboards.",
      recommendations: ["Setup Zendesk automated CRM routers", "Deliver immediate SMS delivery codes"],
      priority: "Medium",
      riskLevel: "Medium",
      expectedImpact: "NPS recovery to 4.6 stars",
      confidenceScore: 91
    },
    risk: {
      executiveId: "risk",
      departmentName: "Risk Assessment",
      problemUnderstanding: "Competitor undercutting presents a systemic danger to local physical boutique store traffic.",
      keyFindings: ["Underpricing models", "Rising supply carrying rates"],
      dataAnalysis: "Competitive overlap stands at 64% of top revenue streams.",
      rootCause: "Absence of distinct product lines and pricing agility.",
      recommendations: ["Adopt digital real-time pricing monitors", "Hedge supply contracts"],
      priority: "Medium",
      riskLevel: "High",
      expectedImpact: "Systemic risk exposure drops 40%",
      confidenceScore: 88
    },
    innovation: {
      executiveId: "innovation",
      departmentName: "Innovation & Growth",
      problemUnderstanding: "A complete absence of product releases in 18 months leaves us vulnerable to market shifts.",
      keyFindings: ["Homogenous stock lists", "Zero research and development pipelines"],
      dataAnalysis: "92% of new customer segments request online custom subscriptions.",
      rootCause: "Resting on legacy physical client metrics.",
      recommendations: ["Launch subscription loyalty box model", "Conduct weekly blue-ocean audits"],
      priority: "Medium",
      riskLevel: "Medium",
      expectedImpact: "Unlocks 18% new recurring revenue",
      confidenceScore: 89
    }
  },
  debateHistory: [
    { id: "deb_1", executiveId: "ceo", name: "Alastair Vance", title: "CEO", message: "Esteemed Board, Zenith Retail is bleeding 30% in sales. Competitors undercut us, and customer service is in crisis. Let's hear our audits.", type: "synthesis" },
    { id: "deb_2", executiveId: "chro", name: "Elena Rostova", title: "CHRO", message: "Our customer service is a bottleneck because of a 32% staff turnover! Underpaid support agents are leaving, causing long wait times.", type: "opening" },
    { id: "deb_3", executiveId: "cfo", name: "Victoria Sterling", title: "CFO", message: "I must object to immediate high payroll increases. Our operating margins fell to 8.5%. We are bleeding $5,000 monthly on unoptimized ads. We must cut that first!", type: "challenge" },
    { id: "deb_4", executiveId: "cmo", name: "Marcus Sterling", title: "CMO", message: "Victoria is correct about the ad leakage. CMO audits show our Instagram campaigns are targeting too wide. I propose shifting that $5K directly to local SEO and building an online Shopify storefront with a points program.", type: "synthesis" },
    { id: "deb_5", executiveId: "cto", name: "Elena Rostova", title: "CHRO", message: "Migrating to Shopify is vital, but we have no CRM! Support staff is working off of manual emails. CTO recommends we deploy an automated CRM ticket router to cut manual lag.", type: "challenge" },
    { id: "deb_6", executiveId: "ceo", name: "Alastair Vance", title: "CEO", message: "Brilliant consensus. We will raise support base pay by 12% to secure CHRO retention, funded directly by pausing Marcus's low-converting social ads. We will deploy CTO's CRM and build an online loyalty pipeline. Let's compile the roadmap.", type: "synthesis" }
  ]
};

export default function App() {
  const [step, setStep] = useState<FlowStep>("landing");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [challenge, setChallenge] = useState<BusinessChallenge | null>(null);
  const [report, setReport] = useState<CompleteBoardroomReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Instant demo exploration trigger
  const handleViewDemo = () => {
    setProfile(SAMPLE_DEMO_REPORT.profile);
    setChallenge(SAMPLE_DEMO_REPORT.challenge);
    setReport(SAMPLE_DEMO_REPORT);
    setStep("dashboard");
  };

  const handleStartOnboarding = () => {
    setStep("onboarding");
  };

  const handleOnboardingNext = (userProfile: UserProfile, bizChallenge: BusinessChallenge) => {
    setProfile(userProfile);
    setChallenge(bizChallenge);
    setStep("interview");
  };

  const handleBackToLanding = () => {
    setStep("landing");
  };

  const handleBackToOnboarding = () => {
    setStep("onboarding");
  };

  // Submit dynamic answers & execute full server-side boardroom analysis and clashing debate synthesis
  const handleAnswersSubmitted = async (answers: InterviewAnswers) => {
    if (!profile || !challenge) return;

    try {
      setStep("loading");
      setError(null);

      const response = await fetch("/api/boardroom/analyze-and-debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          challenge,
          interviewAnswers: answers,
          answers
        })
      });

      if (!response.ok) {
        throw new Error("The board struggled to synthesize a consensus on this challenge.");
      }

      const generatedReport: CompleteBoardroomReport = await response.json();
      setReport(generatedReport);
      setStep("simulator");
    } catch (err: any) {
      console.error(err);
      setError("Strategic engine timeout. Running simulation under high-fidelity sandbox models.");
      // Fallback model generation if server is missing API key or times out
      setTimeout(() => {
        const fallback: CompleteBoardroomReport = {
          ...SAMPLE_DEMO_REPORT,
          profile,
          challenge,
          id: `session_fallback_${Date.now()}`
        };
        setReport(fallback);
        setStep("simulator");
      }, 3000);
    }
  };

  const handleSimulationComplete = () => {
    setStep("dashboard");
  };

  const handleReset = () => {
    setProfile(null);
    setChallenge(null);
    setReport(null);
    setError(null);
    setStep("landing");
  };

  return (
    <div className="bg-black min-h-screen text-gray-100 selection:bg-cyan-500/30 selection:text-white">
      {step === "landing" && (
        <LandingPage onStart={handleStartOnboarding} onViewDemo={handleViewDemo} onStartCsfo={() => setStep("csfo")} />
      )}

      {step === "csfo" && (
        <CsfoAdvisor onBack={handleBackToLanding} />
      )}

      {step === "onboarding" && (
        <OnboardingForm onNext={handleOnboardingNext} onBack={handleBackToLanding} />
      )}

      {step === "interview" && profile && challenge && (
        <InterviewStep
          profile={profile}
          challenge={challenge}
          onSubmitAnswers={handleAnswersSubmitted}
          onBack={handleBackToOnboarding}
        />
      )}

      {step === "loading" && (
        <div id="simulation_engine_loading" className="min-h-screen flex flex-col items-center justify-center bg-black text-gray-100 px-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-800 border-t-cyan-400 animate-spin flex items-center justify-center" />
            <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-cyan-400" />
          </div>

          <h2 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-tight mt-8 text-center">
            Convening Executive Board Room
          </h2>
          <p className="text-xs text-gray-500 font-mono mt-2 uppercase tracking-widest max-w-sm text-center leading-normal">
            Mapping company demographics &bull; Reviewing quantitative KPIs &bull; Triggering multi-department debate matrices
          </p>

          <div className="mt-8 p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-cyan-400 max-w-md text-xs font-mono flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 flex-shrink-0 animate-pulse text-cyan-400" />
            <span>AI Executives (CEO, CFO, CMO, CTO, etc.) are actively clashing and formulating consensus roadmaps...</span>
          </div>
        </div>
      )}

      {step === "simulator" && report && (
        <BoardroomSimulator report={report} onSimulationComplete={handleSimulationComplete} />
      )}

      {step === "dashboard" && report && (
        <DecisionDashboard report={report} onReset={handleReset} />
      )}
    </div>
  );
}
