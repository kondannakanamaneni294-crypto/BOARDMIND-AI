import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CompleteBoardroomReport, DebateMessage, ExecutiveId } from "../types";
import { EXECUTIVES } from "../data/executives";
import { Play, Pause, ChevronRight, MessageSquareCode, Volume2, ShieldAlert } from "lucide-react";

interface BoardroomSimulatorProps {
  report: CompleteBoardroomReport;
  onSimulationComplete: () => void;
}

export default function BoardroomSimulator({ report, onSimulationComplete }: BoardroomSimulatorProps) {
  const [currentMessageIdx, setCurrentMessageIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [executiveStates, setExecutiveStates] = useState<{ [id in ExecutiveId]: "waiting" | "thinking" | "speaking" | "completed" }>({
    ceo: "thinking",
    cfo: "waiting",
    coo: "waiting",
    chro: "waiting",
    cmo: "waiting",
    cto: "waiting",
    legal: "waiting",
    sales: "waiting",
    cx: "waiting",
    risk: "waiting",
    innovation: "waiting"
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const debate = report.debateHistory;

  // Map speed to milliseconds
  const speedDelays = {
    slow: 6000,
    normal: 4000,
    fast: 2200
  };

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentMessageIdx < debate.length - 1) {
        // Advance to next message
        const nextIdx = currentMessageIdx + 1;
        setCurrentMessageIdx(nextIdx);

        // Update states for the table seats
        const activeMsg = debate[nextIdx];
        const nextStates = { ...executiveStates };

        // The current speaker is set to 'speaking'
        Object.keys(nextStates).forEach((key) => {
          const id = key as ExecutiveId;
          if (id === activeMsg.executiveId) {
            nextStates[id] = "speaking";
          } else {
            // Previous speakers are marked 'completed', other ones remain 'waiting' or 'thinking'
            const wasSpeaker = debate.slice(0, nextIdx).some((m) => m.executiveId === id);
            nextStates[id] = wasSpeaker ? "completed" : "waiting";
          }
        });

        // Set adjacent/referenced speakers to "thinking"
        if (activeMsg.referencesId) {
          nextStates[activeMsg.referencesId as ExecutiveId] = "thinking";
        }

        setExecutiveStates(nextStates);
      } else {
        // Simulation finished
        setIsPlaying(false);
        // Automatically open the report dashboard after a slight delay
        setTimeout(() => {
          onSimulationComplete();
        }, 1500);
      }
    }, speedDelays[speed]);

    return () => clearTimeout(timer);
  }, [currentMessageIdx, isPlaying, speed, debate, executiveStates, onSimulationComplete]);

  // Handle scrolling of debate log
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessageIdx]);

  // Set initial speaker state
  useEffect(() => {
    if (debate.length > 0) {
      const activeMsg = debate[0];
      const initialStates = { ...executiveStates };
      Object.keys(initialStates).forEach((key) => {
        const id = key as ExecutiveId;
        initialStates[id] = id === activeMsg.executiveId ? "speaking" : "waiting";
      });
      setExecutiveStates(initialStates);
    }
  }, []);

  const activeSpeakerMsg = debate[currentMessageIdx];
  const activeExec = EXECUTIVES.find((e) => e.id === activeSpeakerMsg?.executiveId);

  // Position angles around a virtual boardroom table for rendering seats
  const getSeatPosition = (index: number) => {
    const totalSeats = EXECUTIVES.length;
    const angle = (index / totalSeats) * 2 * Math.PI - Math.PI / 2; // Offset by -90 deg to start CEO at the top center
    const radiusX = 42; // percentage of half-width
    const radiusY = 32; // percentage of half-height
    const x = 50 + radiusX * Math.cos(angle);
    const y = 50 + radiusY * Math.sin(angle);
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div id="boardroom_simulation_workspace" className="min-h-screen bg-[#050505] text-slate-100 py-12 px-6 flex flex-col justify-between overflow-hidden relative">
      {/* Cinematic Glowing Elements */}
      <div className="absolute top-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-cyan-950/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-950/10 blur-[120px] pointer-events-none" />

      {/* Main Grid: Board Table on top, Live Log at bottom/sides */}
      <div className="w-full max-w-7xl mx-auto flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-4">
        {/* Left Column: Boardroom Virtual Table Map (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl relative min-h-[460px] md:min-h-[520px]">
          {/* Header Title inside table container */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="font-sans font-bold text-xs text-white uppercase tracking-wider">BOARDROOM TABLE</h3>
          </div>

          <div className="absolute top-6 right-6 text-xs text-slate-500 font-mono flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            Active Session &bull; {currentMessageIdx + 1}/{debate.length} Debates
          </div>

          {/* Table Surface Visual Graphic */}
          <div className="relative w-full aspect-[4/3] max-w-lg flex items-center justify-center">
            {/* Inner table glass surface */}
            <div className="absolute w-[68%] h-[52%] rounded-[100px] bg-black/60 border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-md">
              <div className="text-center">
                <h4 className="font-sans font-bold text-[10px] text-slate-400 uppercase tracking-widest mb-1">BoardMind AI</h4>
                <p className="text-[10px] text-cyan-400 font-mono px-3.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 uppercase tracking-widest">
                  {report.profile.companyName}
                </p>
              </div>
            </div>

            {/* Virtual Executive Seats arranged dynamically */}
            {EXECUTIVES.map((exec, idx) => {
              const state = executiveStates[exec.id];
              const isSpeaking = state === "speaking";
              const isThinking = state === "thinking";
              const isCompleted = state === "completed";

              const pos = getSeatPosition(idx);

              return (
                <div
                  key={exec.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  style={pos}
                >
                  {/* Outer glowing ring for speaking state */}
                  <div
                    className={`absolute -inset-2.5 rounded-2xl transition-all duration-300 pointer-events-none ${
                      isSpeaking
                        ? "bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 scale-105 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                        : isThinking
                        ? "bg-gradient-to-tr from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 border-dashed animate-pulse"
                        : "border border-transparent"
                    }`}
                  />

                  {/* Seat Card */}
                  <div className="relative p-2.5 rounded-xl bg-[#0c0c0c] border border-white/10 hover:border-cyan-500/30 flex items-center gap-2.5 transition-all w-[150px] shadow-lg">
                    <span className="text-xl flex-shrink-0">{exec.avatar}</span>
                    <div className="min-w-0 flex-grow">
                      <h5 className="font-sans font-bold text-[10px] text-white truncate">{exec.name}</h5>
                      <p className="text-[8px] text-slate-500 truncate font-mono uppercase tracking-wider">{exec.title}</p>
                    </div>

                    {/* Simple activity status badge */}
                    <div className="absolute -top-1 -right-1">
                      {isSpeaking && (
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                        </span>
                      )}
                      {isThinking && (
                        <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                      )}
                      {isCompleted && (
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Chat/Debate log Scroll & Active Speaker Speech Bubble (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
          {/* Active Speaking bubble */}
          <div className="flex-shrink-0 mb-6">
            <h4 className="font-mono text-xs text-slate-500 mb-3.5 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquareCode className="w-4 h-4 text-cyan-400" />
              Active Speaker
            </h4>

            <AnimatePresence mode="wait">
              {activeExec && (
                <motion.div
                  key={currentMessageIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-5 rounded-2xl bg-black border border-white/10 shadow-xl relative overflow-hidden"
                >
                  {/* Department Accent Glow */}
                  <div className={`absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b ${activeExec.color}`} />

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{activeExec.avatar}</span>
                    <div>
                      <h4 className="font-sans font-bold text-sm text-white">{activeExec.name}</h4>
                      <p className="text-[10px] text-cyan-400 font-mono">{activeExec.title}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed italic">
                    "{activeSpeakerMsg.message}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Historical Log list */}
          <div className="flex-grow flex flex-col min-h-0 bg-black/40 border border-white/10 rounded-xl p-4 overflow-hidden mb-6">
            <h4 className="font-mono text-[10px] text-slate-500 mb-2 uppercase tracking-widest">Debate Transcript</h4>
            <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
              {debate.slice(0, currentMessageIdx + 1).map((msg, idx) => {
                const exec = EXECUTIVES.find((e) => e.id === msg.executiveId);
                const isSelf = idx === currentMessageIdx;

                if (!exec) return null;

                return (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isSelf
                        ? "bg-cyan-500/10 border-cyan-500/30 shadow-inner scale-[1.01]"
                        : "bg-black/30 border-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-sans font-bold text-white flex items-center gap-1">
                        <span>{exec.avatar}</span>
                        {msg.name} ({exec.title})
                      </span>
                      <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        msg.type === "challenge"
                          ? "bg-rose-950/50 text-rose-400 border border-rose-900/30"
                          : msg.type === "synthesis"
                          ? "bg-cyan-950/50 text-cyan-400 border border-cyan-900/30"
                          : "bg-neutral-900 text-slate-500"
                      }`}>
                        {msg.type}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">{msg.message}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulation Controls */}
          <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />}
              </button>

              <div className="flex items-center bg-black rounded-lg p-0.5 border border-white/10 font-mono text-[10px]">
                {(["slow", "normal", "fast"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2.5 py-1.5 rounded ${
                      speed === s ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="skip_debate_btn"
              onClick={onSimulationComplete}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1 transition-all cursor-pointer shadow-lg"
            >
              Skip Debate
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer warning line */}
      <div className="w-full max-w-7xl mx-auto mt-6 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-2 text-amber-400 text-[10px] font-mono uppercase tracking-wider">
        <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-400" />
        Corporate Debate Arbitrator Engine Active &bull; Formulating final strategy roadmap based on clashing executive consensus.
      </div>
    </div>
  );
}
