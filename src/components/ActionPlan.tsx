import { RoadmapItem } from "../types";
import { CheckSquare, Calendar, Milestone, ArrowUpRight } from "lucide-react";

interface ActionPlanProps {
  roadmap: RoadmapItem[];
}

export default function ActionPlan({ roadmap }: ActionPlanProps) {
  // Simple order sorting to guarantee Chronology
  const timeframeOrder: { [key: string]: number } = {
    "Immediate": 0,
    "30-Day": 1,
    "60-Day": 2,
    "90-Day": 3
  };

  const sortedRoadmap = [...roadmap].sort((a, b) => {
    return (timeframeOrder[a.timeframe] ?? 99) - (timeframeOrder[b.timeframe] ?? 99);
  });

  return (
    <div id="roadmap_timeline_module" className="space-y-4">
      <div className="pb-3 border-b border-white/10">
        <h4 className="font-sans font-bold text-sm text-white">Boardroom Strategy Execution Roadmap</h4>
        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Consensus Implementation Plan & Milestones</p>
      </div>

      <div className="relative border-l border-white/10 ml-4 pl-8 space-y-8 py-2">
        {sortedRoadmap.map((item, idx) => {
          return (
            <div key={idx} className="relative group">
              {/* Timeline dot marker */}
              <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-[#050505] border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform">
                <Milestone className="w-3 h-3 text-cyan-400" />
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-cyan-500/30 transition-all">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <h5 className="font-sans font-bold text-sm text-white">{item.timeframe} Focus</h5>
                  </div>
                  <span className="text-[9px] px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 uppercase tracking-widest font-mono font-bold">
                    Owner: {item.responsibleExecutive}
                  </span>
                </div>

                {/* Actions Checklist */}
                <ul className="space-y-2.5 my-4">
                  {item.actions.map((act, idx2) => (
                    <li key={idx2} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckSquare className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>

                {/* Projected Impacts */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-white/10">
                    <span className="text-slate-500 text-[10px]">Expected ROI</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                      {item.expectedROI}
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-white/10">
                    <span className="text-slate-500 text-[10px]">Rev Growth</span>
                    <span className="text-cyan-400 font-bold flex items-center gap-0.5">
                      {item.expectedRevenueGrowth}
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
