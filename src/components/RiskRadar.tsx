import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { RiskRadarMetric } from "../types";
import { ShieldCheck, ShieldAlert } from "lucide-react";

interface RiskRadarProps {
  data: RiskRadarMetric[];
}

export default function RiskRadar({ data }: RiskRadarProps) {
  // Calculate average risk score
  const avgRisk = data.reduce((acc, curr) => acc + curr.score, 0) / data.length;

  return (
    <div id="risk_radar_module" className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center gap-6">
      {/* Visual Recharts Radar Chart */}
      <div className="w-full md:w-1/2 aspect-square max-w-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b" }} />
            <Radar
              name="Risk Level"
              dataKey="score"
              stroke="#f43f5e"
              fill="#f43f5e"
              fillOpacity={0.25}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Metrics Breakdown List */}
      <div className="flex-1 w-full space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h4 className="font-sans font-bold text-sm text-white">Risk Intelligence Profile</h4>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">6-Dimensional Exposure Audit</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-slate-500">Average Risk</span>
            <h5 className={`font-mono text-base font-bold ${avgRisk > 60 ? "text-rose-400" : "text-emerald-400"}`}>
              {avgRisk.toFixed(1)}%
            </h5>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {data.map((m, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#0c0c0c] border border-white/10 flex flex-col justify-between">
              <span className="font-sans text-[10.5px] text-slate-400">{m.subject}</span>
              <div className="flex items-center justify-between mt-1.5">
                <span className={`font-mono text-xs font-bold ${m.score > 70 ? "text-rose-400" : m.score > 40 ? "text-amber-400" : "text-emerald-400"}`}>
                  {m.score}/100
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" style={{ opacity: m.score > 70 ? 1 : 0 }} />
              </div>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-slate-400">
          {avgRisk > 50 ? (
            <>
              <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>High Vulnerability Detected</strong>: Your organizational exposure stands above benchmark thresholds. Refer to the CEO Priority Actions inside the roadmap.
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Acceptable Exposure Threshold</strong>: Your current operational and technology risk vectors are stabilized. Standard risk mitigation plans are sufficient.
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
