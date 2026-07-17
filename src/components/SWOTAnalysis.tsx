import { SWOTAnalysis as SWOTType } from "../types";
import { PlusCircle, MinusCircle, HelpCircle, AlertTriangle } from "lucide-react";

interface SWOTAnalysisProps {
  swot: SWOTType;
}

export default function SWOTAnalysis({ swot }: SWOTAnalysisProps) {
  const quadrants = [
    {
      title: "Strengths",
      subtitle: "Internal advantages",
      items: swot.strengths,
      icon: PlusCircle,
      color: "border-emerald-500/20 bg-emerald-500/[0.02] text-emerald-400",
      dot: "bg-emerald-500"
    },
    {
      title: "Weaknesses",
      subtitle: "Internal limits",
      items: swot.weaknesses,
      icon: MinusCircle,
      color: "border-rose-500/20 bg-rose-500/[0.02] text-rose-400",
      dot: "bg-rose-500"
    },
    {
      title: "Opportunities",
      subtitle: "External growth vectors",
      items: swot.opportunities,
      icon: HelpCircle,
      color: "border-cyan-500/20 bg-cyan-500/[0.02] text-cyan-400",
      dot: "bg-cyan-500"
    },
    {
      title: "Threats",
      subtitle: "External vulnerabilities",
      items: swot.threats,
      icon: AlertTriangle,
      color: "border-amber-500/20 bg-amber-500/[0.02] text-amber-400",
      dot: "bg-amber-500"
    }
  ];

  return (
    <div id="swot_analysis_quadrants" className="space-y-4">
      <div className="pb-3 border-b border-white/10">
        <h4 className="font-sans font-bold text-sm text-white">Strategic SWOT Matrix</h4>
        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Consolidated Boardroom Assessment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quadrants.map((quad, idx) => {
          const IconComponent = quad.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border backdrop-blur-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between ${quad.color}`}
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <h5 className="font-sans font-bold text-xs text-white uppercase tracking-wider">{quad.title}</h5>
                    <p className="text-[9px] text-slate-500 font-mono leading-none mt-0.5 uppercase tracking-wider">{quad.subtitle}</p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {quad.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${quad.dot}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
