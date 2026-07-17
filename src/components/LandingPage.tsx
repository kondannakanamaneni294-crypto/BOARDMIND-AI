import { motion } from "motion/react";
import { Brain, Users, TrendingUp, ShieldAlert, Sparkles, ArrowRight, Play, CheckCircle } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
  onViewDemo: () => void;
}

export default function LandingPage({ onStart, onViewDemo }: LandingPageProps) {
  const features = [
    {
      icon: Users,
      title: "AI Executive Board",
      desc: "Simulate eleven domain-specialized AI experts discussing and debating your challenge.",
      color: "text-blue-400"
    },
    {
      icon: Brain,
      title: "Business Intelligence",
      desc: "Transform unstructured challenges into precise strategic insights across 11 key departments.",
      color: "text-cyan-400"
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      desc: "Receive rigorous mathematical forecasting of revenue, profit, demand, and inventory.",
      color: "text-emerald-400"
    },
    {
      icon: ShieldAlert,
      title: "Risk Radar Audits",
      desc: "Isolate vulnerabilities across operations, legal compliance, market trends, and HR stability.",
      color: "text-rose-400"
    }
  ];

  return (
    <div id="landing_page_container" className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Immersive Glowing Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />

      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c101a_1px,transparent_1px),linear-gradient(to_bottom,#0c101a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Brain className="w-6 h-6 text-black" />
          </div>
          <div>
            <span className="font-sans font-bold tracking-tight text-xl text-white">BOARDMIND <span className="text-cyan-400">AI</span></span>
            <span className="ml-2 text-[10px] px-2.5 py-0.5 rounded bg-white/5 text-cyan-400 border border-white/10 font-mono">v2.5</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 font-mono hidden md:inline uppercase tracking-widest">Decision Intelligence Protocol</span>
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        </div>
      </header>

      {/* Main Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex-grow flex flex-col lg:flex-row items-center gap-16">
        {/* Left Side: Copy */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-800/30 text-xs text-blue-300 font-mono mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            HACKATHON WINNING ENTRY &bull; DECISION INTELLIGENCE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-white leading-[1.1] mb-6"
          >
            One Question. <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Eleven AI Executives.</span> <br />
            One Smart Decision.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
          >
            Why consult static chatbots? BOARDMIND AI simulates a Fortune 500 board of directors. Every executive analyzes your problem independently, challenges recommendations, and debates key spend shifts before delivering a unified, CEO-vetted action roadmap.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <button
              id="start_analysis_btn"
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-500 text-black font-bold uppercase tracking-widest hover:bg-cyan-400 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Start Board Analysis
              <ArrowRight className="w-5 h-5 text-black" />
            </button>
            <button
              id="view_demo_btn"
              onClick={onViewDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-300 text-slate-300" />
              View Sample Demo
            </button>
          </motion.div>
        </div>

        {/* Right Side: Visual Mockup / Cards Showcase */}
        <div className="flex-1 w-full max-w-md lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl shadow-cyan-950/20 overflow-hidden group"
          >
            {/* Visual Glassmorphism Glow Grid */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500" />

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Virtual Executive Table</span>
            </div>

            {/* Simulated Miniature Board List */}
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-[#050505] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👔</span>
                  <div>
                    <h4 className="font-sans font-bold text-xs text-white">Alastair Vance</h4>
                    <p className="text-[10px] text-slate-500">CEO &bull; Synthesizing final roadmap</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-400 font-mono">Awaiting</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#050505] border border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📈</span>
                  <div>
                    <h4 className="font-sans font-bold text-xs text-white">Victoria Sterling</h4>
                    <p className="text-[10px] text-slate-500">CFO &bull; Recalculating profit metrics</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono">Analyzing</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#050505] border border-purple-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <h4 className="font-sans font-bold text-xs text-white">Elena Rostova</h4>
                    <p className="text-[10px] text-slate-500">CHRO &bull; Auditing staff retention</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono animate-pulse">Speaking</span>
              </div>
            </div>

            {/* Absolute bottom stats mockup overlay */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between text-[10px] text-slate-500 font-mono tracking-widest">
              <span>ACTIVE AGENTS: 11</span>
              <span className="text-cyan-400">READY FOR SIMULATION</span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Grid of Platform Capabilities */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-cyan-500/30 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className={`p-3 rounded-lg bg-black border border-white/5 w-fit mb-4 group-hover:scale-110 transition-transform ${feat.color}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-bold text-sm text-white mb-2 uppercase tracking-wider">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between border-t border-white/5 text-[10px] text-slate-600 font-mono uppercase tracking-widest bg-black/20">
        <span>&copy; 2026 BoardMind AI. Executive Protocol</span>
        <span className="flex items-center gap-2 mt-2 md:mt-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Engine Stable
        </span>
      </footer>
    </div>
  );
}
