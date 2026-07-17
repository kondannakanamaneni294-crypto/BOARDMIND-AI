import { useState } from "react";
import { motion } from "motion/react";
import { CompleteBoardroomReport, ExecutiveId, ExecutiveAnalysis } from "../types";
import { EXECUTIVES } from "../data/executives";
import RiskRadar from "./RiskRadar";
import SWOTAnalysis from "./SWOTAnalysis";
import ActionPlan from "./ActionPlan";
import PredictiveAnalytics from "./PredictiveAnalytics";
import WhatIfSimulator from "./WhatIfSimulator";
import ExecutiveReportExporter from "./ExecutiveReportExporter";
import {
  Sparkles,
  Search,
  CheckCircle,
  AlertTriangle,
  User,
  Activity,
  Award,
  BookOpen,
  Calendar,
  Layers,
  Heart,
  TrendingUp,
  Brain,
  FileText,
  Lock,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

interface DecisionDashboardProps {
  report: CompleteBoardroomReport;
  onReset: () => void;
}

export default function DecisionDashboard({ report, onReset }: DecisionDashboardProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "swot" | "radar" | "roadmap" | "forecast" | "whatif">("summary");
  const [selectedExecutiveId, setSelectedExecutiveId] = useState<ExecutiveId>("ceo");
  const [execQuery, setExecQuery] = useState("");

  const ceo = report.ceoDecision;

  // Filter executives list
  const filteredExecutives = EXECUTIVES.filter((e) => {
    return (
      e.name.toLowerCase().includes(execQuery.toLowerCase()) ||
      e.title.toLowerCase().includes(execQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(execQuery.toLowerCase())
    );
  });

  const selectedExec = EXECUTIVES.find((e) => e.id === selectedExecutiveId)!;
  const selectedAnalysis: ExecutiveAnalysis | undefined = report.executiveAnalyses[selectedExecutiveId];

  return (
    <div id="boardmind_executive_dashboard" className="min-h-screen bg-[#050505] text-slate-100 font-sans pb-24">
      {/* HUD Score Header */}
      <header className="bg-[#050505]/85 border-b border-white/10 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Company Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Brain className="w-5.5 h-5.5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold tracking-tight text-lg text-white">BOARDMIND AI</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono uppercase tracking-widest font-bold">Dashboard</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Session: {report.profile.companyName} &bull; {report.profile.industry}
              </p>
            </div>
          </div>

          {/* Quick HUD Score Cards */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Health */}
            <div className="px-4 py-2 rounded-xl bg-[#0c0c0c] border border-white/10 flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="text-[9px] text-slate-500 font-mono uppercase block">Health</span>
                <span className="font-mono text-xs font-bold text-emerald-400">{ceo.businessHealthScore}%</span>
              </div>
            </div>

            {/* Growth */}
            <div className="px-4 py-2 rounded-xl bg-[#0c0c0c] border border-white/10 flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <div>
                <span className="text-[9px] text-slate-500 font-mono uppercase block">Growth</span>
                <span className="font-mono text-xs font-bold text-cyan-400">{ceo.growthScore}%</span>
              </div>
            </div>

            {/* Risk */}
            <div className="px-4 py-2 rounded-xl bg-[#0c0c0c] border border-white/10 flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <div>
                <span className="text-[9px] text-slate-500 font-mono uppercase block">Risk</span>
                <span className="font-mono text-xs font-bold text-rose-400">{ceo.riskScore}%</span>
              </div>
            </div>

            {/* Confidence */}
            <div className="px-4 py-2 rounded-xl bg-[#0c0c0c] border border-white/10 flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <div>
                <span className="text-[9px] text-slate-500 font-mono uppercase block font-medium">AI Board Confidence</span>
                <span className="font-mono text-xs font-bold text-purple-400">{ceo.confidenceScore}%</span>
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-widest text-slate-300 transition-all cursor-pointer"
            >
              New Analysis
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: CEO final decision, Tab switching workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Dashboard Module Selector Sub-Tabs */}
          <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/10 overflow-x-auto scrollbar-none gap-1">
            {[
              { id: "summary", label: "CEO Decision", icon: BookOpen },
              { id: "swot", label: "SWOT Matrix", icon: Layers },
              { id: "radar", label: "Risk Radar", icon: ShieldCheck },
              { id: "roadmap", label: "Execution Roadmap", icon: Calendar },
              { id: "forecast", label: "Financial Projections", icon: TrendingUp },
              { id: "whatif", label: "What-If Simulator", icon: Activity }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-lg font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ACTIVE TAB WORKSPACE CONTENT */}
          <div className="transition-all duration-300">
            {activeTab === "summary" && (
              <div id="ceo_summary_pane" className="space-y-6">
                {/* Executive Strategy block */}
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <h4 className="font-sans font-bold text-sm text-white uppercase tracking-wider">CEO Strategic Mandate</h4>
                  </div>
                  <h3 className="font-sans font-bold text-lg text-white mb-3 tracking-tight">
                    Primary Corporate Strategy: <br />
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {ceo.businessStrategy}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed text-justify mb-5 font-sans">
                    {ceo.executiveSummary}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    {/* Root causes */}
                    <div>
                      <h5 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-2.5">Key Identified Bottlenecks</h5>
                      <ul className="space-y-2">
                        {ceo.rootCauses.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Expected outcomes */}
                    <div>
                      <h5 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-2.5">Expected Operational Outcome</h5>
                      <p className="text-xs text-emerald-400 leading-relaxed font-sans font-medium">
                        {ceo.expectedOutcome}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Exporter Block */}
                <ExecutiveReportExporter report={report} />
              </div>
            )}

            {activeTab === "swot" && <SWOTAnalysis swot={report.swot} />}

            {activeTab === "radar" && <RiskRadar data={report.riskRadar} />}

            {activeTab === "roadmap" && <ActionPlan roadmap={report.roadmap} />}

            {activeTab === "forecast" && <PredictiveAnalytics predictions={report.predictions} />}

            {activeTab === "whatif" && <WhatIfSimulator report={report} />}
          </div>
        </div>

        {/* Right column: 11 AI Independent Executive Audits (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <h4 className="font-sans font-bold text-sm text-white">Executive Audits</h4>
                <p className="text-[10px] text-slate-500 font-mono">11 Specialized Agent Findings</p>
              </div>
              <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded border border-cyan-500/30 uppercase tracking-widest font-mono font-bold">
                Active: 11/11
              </span>
            </div>

            {/* Search filter for agents */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
              <input
                type="text"
                value={execQuery}
                onChange={(e) => setExecQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-black border border-white/10 focus:border-cyan-500 text-xs text-white placeholder-slate-600 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="Search board executives..."
              />
            </div>

            {/* List of executives */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1.5 custom-scrollbar">
              {filteredExecutives.map((exec) => {
                const isActive = exec.id === selectedExecutiveId;
                const status = report.executiveAnalyses[exec.id];

                return (
                  <button
                    key={exec.id}
                    onClick={() => setSelectedExecutiveId(exec.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? "bg-cyan-500/10 border-cyan-500/40 shadow-inner"
                        : "bg-black/40 border-white/10 hover:border-cyan-500/20"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl flex-shrink-0">{exec.avatar}</span>
                      <div className="min-w-0">
                        <h5 className="font-sans font-bold text-xs text-white truncate">{exec.name}</h5>
                        <p className="text-[9px] text-slate-500 truncate font-mono uppercase tracking-wider">{exec.title}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 text-slate-600 ${isActive ? "text-cyan-400 translate-x-0.5" : ""}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expanded Selected Executive Audit Card */}
          {selectedAnalysis ? (
            <motion.div
              key={selectedExecutiveId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl relative overflow-hidden"
            >
              {/* Highlight accent line */}
              <div className={`absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b ${selectedExec.color}`} />

              <div className="flex items-center gap-3 mb-4.5 pb-3.5 border-b border-white/10">
                <span className="text-3xl">{selectedExec.avatar}</span>
                <div>
                  <h4 className="font-sans font-bold text-sm text-white">{selectedExec.name}</h4>
                  <p className="text-[10px] text-cyan-400 font-mono">{selectedExec.title}</p>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400 font-mono uppercase tracking-widest block mt-1 w-fit">
                    Dept: {selectedAnalysis.departmentName || selectedExec.department}
                  </span>
                </div>
              </div>

              {/* Expanded Executive details */}
              <div className="space-y-4 text-xs leading-relaxed">
                {/* Findings summary */}
                <div>
                  <h5 className="font-mono text-[9px] text-slate-500 uppercase tracking-wider mb-1">Department Findings</h5>
                  <p className="text-slate-300 font-sans">{selectedAnalysis.problemUnderstanding}</p>
                </div>

                {/* Key Findings Checklist */}
                {selectedAnalysis.keyFindings && selectedAnalysis.keyFindings.length > 0 && (
                  <div>
                    <h5 className="font-mono text-[9px] text-slate-500 uppercase tracking-wider mb-1">Audit Checkpoints</h5>
                    <ul className="space-y-1">
                      {selectedAnalysis.keyFindings.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-slate-400 text-[11px]">
                          <span className="text-cyan-500 font-mono">&bull;</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quantitative Data Analysis */}
                <div>
                  <h5 className="font-mono text-[9px] text-slate-500 uppercase tracking-wider mb-1">Quantitative Critique</h5>
                  <p className="text-slate-300 font-mono text-[11px] bg-black p-2.5 rounded border border-white/10">
                    {selectedAnalysis.dataAnalysis}
                  </p>
                </div>

                {/* Root Cause */}
                <div>
                  <h5 className="font-mono text-[9px] text-slate-500 uppercase tracking-wider mb-1">Root Cause Hypothesis</h5>
                  <p className="text-slate-300 font-sans">{selectedAnalysis.rootCause}</p>
                </div>

                {/* Key recommendations list */}
                <div>
                  <h5 className="font-mono text-[9px] text-slate-500 uppercase tracking-wider mb-1.5">Actionable Recommendations</h5>
                  <ul className="space-y-1.5">
                    {selectedAnalysis.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-400 text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Meta details footer */}
                <div className="grid grid-cols-2 gap-3.5 pt-3 border-t border-white/10 font-mono text-[10px]">
                  <div className="flex justify-between p-1.5 rounded bg-neutral-900">
                    <span className="text-slate-500">Priority:</span>
                    <span className={`font-bold ${selectedAnalysis.priority === "High" ? "text-rose-400" : "text-slate-400"}`}>
                      {selectedAnalysis.priority}
                    </span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded bg-neutral-900">
                    <span className="text-slate-500">Risk Level:</span>
                    <span className={`font-bold ${["Critical", "High"].includes(selectedAnalysis.riskLevel) ? "text-rose-400" : "text-slate-400"}`}>
                      {selectedAnalysis.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded bg-neutral-900 col-span-2">
                    <span className="text-slate-500">Model Confidence:</span>
                    <span className="font-bold text-cyan-400">
                      {selectedAnalysis.confidenceScore || 90}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 text-center text-xs text-slate-500">
              Audit data unavailable for this seat.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
