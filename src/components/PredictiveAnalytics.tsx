import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, CartesianGrid, Area } from "recharts";
import { PredictiveAnalytics as PredictType } from "../types";
import { Coins, TrendingUp, Users, Factory, Sparkles } from "lucide-react";

interface PredictiveAnalyticsProps {
  predictions: PredictType;
}

export default function PredictiveAnalytics({ predictions }: PredictiveAnalyticsProps) {
  // Format predictions into chart data
  const chartData = [
    {
      name: "30 Days",
      Revenue: predictions.forecast30Days.revenue,
      Profit: predictions.forecast30Days.profit,
      Expenses: predictions.forecast30Days.expenses,
      Demand: predictions.forecast30Days.demand,
      Productivity: predictions.forecast30Days.employeeProductivity
    },
    {
      name: "90 Days",
      Revenue: predictions.forecast90Days.revenue,
      Profit: predictions.forecast90Days.profit,
      Expenses: predictions.forecast90Days.expenses,
      Demand: predictions.forecast90Days.demand,
      Productivity: predictions.forecast90Days.employeeProductivity
    },
    {
      name: "6 Months",
      Revenue: predictions.forecast6Months.revenue,
      Profit: predictions.forecast6Months.profit,
      Expenses: predictions.forecast6Months.expenses,
      Demand: predictions.forecast6Months.demand,
      Productivity: predictions.forecast6Months.employeeProductivity
    },
    {
      name: "1 Year",
      Revenue: predictions.forecast1Year.revenue,
      Profit: predictions.forecast1Year.profit,
      Expenses: predictions.forecast1Year.expenses,
      Demand: predictions.forecast1Year.demand,
      Productivity: predictions.forecast1Year.employeeProductivity
    }
  ];

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div id="predictions_dashboard" className="space-y-6">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <h4 className="font-sans font-bold text-sm text-white">Advanced Predictive Analytics Engine</h4>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">12-Month Financial & Operational Forecast Modeling</p>
        </div>
        <span className="text-[9px] px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono uppercase tracking-widest font-bold flex items-center gap-1 w-fit">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          Mathematical Projection Settled
        </span>
      </div>

      {/* Primary Recharts Area Chart */}
      <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
        <h5 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-4">Financial Growth Trajectory</h5>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 10, fontFamily: "monospace" }} />
              <YAxis
                stroke="#475569"
                tick={{ fontSize: 10, fontFamily: "monospace" }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#080808", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px" }}
                labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                formatter={(value: any) => [formatCurrency(value), undefined]}
              />
              <Area type="monotone" dataKey="Revenue" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="Profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProf)" />
              <Area type="monotone" dataKey="Expenses" stroke="#f43f5e" strokeWidth={1} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorExp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Metrics Modeling Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Customer Growth */}
        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-white/10 flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase">Avg Customer Growth</span>
            <h5 className="font-mono text-sm font-bold text-white mt-0.5">
              +{predictions.forecast1Year.customerGrowth}% / Yr
            </h5>
          </div>
        </div>

        {/* Metric 2: Market Demand */}
        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-white/10 flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase">Terminal Demand Score</span>
            <h5 className="font-mono text-sm font-bold text-white mt-0.5">
              {predictions.forecast1Year.demand}/100
            </h5>
          </div>
        </div>

        {/* Metric 3: Operations Efficiency */}
        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-white/10 flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase">Inventory Efficiency</span>
            <h5 className="font-mono text-sm font-bold text-white mt-0.5">
              {predictions.forecast1Year.inventoryEfficiency}/100
            </h5>
          </div>
        </div>

        {/* Metric 4: Human Capital */}
        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-white/10 flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase">Staff Productivity</span>
            <h5 className="font-mono text-sm font-bold text-white mt-0.5">
              {predictions.forecast1Year.employeeProductivity}/100
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}
