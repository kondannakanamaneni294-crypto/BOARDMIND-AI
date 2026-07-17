import React, { useState } from "react";
import { motion } from "motion/react";
import { UserProfile, BusinessChallenge } from "../types";
import { Briefcase, ArrowRight, ArrowLeft, Mail, Globe, Users, TrendingUp, Calendar, Landmark, FileText, CheckCircle } from "lucide-react";

interface OnboardingFormProps {
  onNext: (profile: UserProfile, challenge: BusinessChallenge) => void;
  onBack: () => void;
}

const INDUSTRIES = [
  "Restaurant",
  "Retail",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Technology",
  "Agriculture",
  "Construction",
  "Startup",
  "Logistics",
  "Other"
];

const PRESETS = [
  {
    title: "🔻 Sales Dropped",
    text: "Our core product sales have dropped by 30% over the last two quarters. We suspect high competitor activity and outdated digital marketing techniques are key culprits, but need a complete organizational and technical overhaul of our conversion funnel."
  },
  {
    title: "📈 High Turnover",
    text: "Employee attrition has risen to 32% this year, particularly in critical customer support and developer roles. Work-from-home fatigue, lack of training paths, and uncompetitive benefit packages seem to be hurting work morale and retention."
  },
  {
    title: "📦 Inventory Loss",
    text: "Supply chain disruptions have caused massive inventory delays. We are struggling with high carrying costs, frequent stockouts of top-selling items, and a lack of real-time pipeline visibility, causing us to bleed customers."
  },
  {
    title: "💬 Poor Reviews",
    text: "Our average customer review rating has dropped from 4.8 to 3.9 stars in the last 6 months. Customers are complaining about long delivery times, unresponsive support staff, and deteriorating product packaging quality."
  }
];

export default function OnboardingForm({ onNext, onBack }: OnboardingFormProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Jeevan Abhi",
    email: "jeevanabhi.r@gmail.com",
    companyName: "Zenith Retail Corp",
    industry: "Retail",
    country: "India",
    businessSize: "Mid-Market",
    employees: 45,
    annualRevenue: 1200000,
    yearsInBusiness: 4
  });

  const [challenge, setChallenge] = useState<BusinessChallenge>({
    description: ""
  });

  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep1 = () => {
    const errs: { [key: string]: string } = {};
    if (!profile.name.trim()) errs.name = "Full Name is required";
    if (!profile.email.trim()) errs.email = "Email is required";
    if (!profile.companyName.trim()) errs.companyName = "Company Name is required";
    if (!profile.country.trim()) errs.country = "Country is required";
    if (profile.employees <= 0) errs.employees = "Employee count must be positive";
    if (profile.annualRevenue <= 0) errs.annualRevenue = "Revenue must be positive";
    if (profile.yearsInBusiness < 0) errs.yearsInBusiness = "Years must be positive or zero";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setFormStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge.description.trim()) {
      setErrors({ description: "Please detail your business challenge." });
      return;
    }
    onNext(profile, challenge);
  };

  return (
    <div id="onboarding_form_step" className="relative min-h-screen flex items-center justify-center bg-[#050505] py-16 px-6 overflow-hidden">
      {/* Decorative ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-950/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-950/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-black/40 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10 relative z-10"
      >
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-tight">
              {formStep === 1 ? "Company Profile Setup" : "Boardroom Briefing"}
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-1">
              {formStep === 1 ? "Demographics and business metrics lookup" : "State the primary challenge requiring executive debate"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] px-3 py-1 rounded font-mono uppercase tracking-widest ${formStep === 1 ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-slate-500 border border-white/5"}`}>
              1. Profile
            </span>
            <span className={`text-[10px] px-3 py-1 rounded font-mono uppercase tracking-widest ${formStep === 2 ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-slate-500 border border-white/5"}`}>
              2. Briefing
            </span>
          </div>
        </div>

        {formStep === 1 ? (
          <form onSubmit={handleNextStep1} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-600 transition-all text-sm"
                    placeholder="E.g. Elena Rostova"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 font-mono">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-600 transition-all text-sm"
                    placeholder="E.g. manager@zenith.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 font-mono">{errors.email}</p>}
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Company Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Briefcase className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={profile.companyName}
                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-600 transition-all text-sm"
                    placeholder="E.g. Zenith Retail Corp"
                  />
                </div>
                {errors.companyName && <p className="text-xs text-red-500 font-mono">{errors.companyName}</p>}
              </div>

              {/* Industry Dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Business Industry</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Landmark className="w-4 h-4" />
                  </span>
                  <select
                    value={profile.industry}
                    onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white transition-all text-sm appearance-none cursor-pointer"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind} className="bg-neutral-900 text-white">
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Country of Operations</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Globe className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={profile.country}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-600 transition-all text-sm"
                    placeholder="E.g. United States"
                  />
                </div>
                {errors.country && <p className="text-xs text-red-500 font-mono">{errors.country}</p>}
              </div>

              {/* Business Size Dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Business Scale</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Users className="w-4 h-4" />
                  </span>
                  <select
                    value={profile.businessSize}
                    onChange={(e) => setProfile({ ...profile, businessSize: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="Startup / Pre-revenue" className="bg-neutral-900 text-white">Startup / Pre-revenue</option>
                    <option value="Small Business" className="bg-neutral-900 text-white">Small Business</option>
                    <option value="Mid-Market" className="bg-neutral-900 text-white">Mid-Market Company</option>
                    <option value="Enterprise" className="bg-neutral-900 text-white">Large Enterprise</option>
                  </select>
                </div>
              </div>

              {/* Employees */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Total Employees</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Users className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={profile.employees}
                    onChange={(e) => setProfile({ ...profile, employees: parseInt(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-600 transition-all text-sm"
                  />
                </div>
                {errors.employees && <p className="text-xs text-red-500 font-mono">{errors.employees}</p>}
              </div>

              {/* Annual Revenue */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Annual Revenue (USD)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={profile.annualRevenue}
                    onChange={(e) => setProfile({ ...profile, annualRevenue: parseInt(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-600 transition-all text-sm"
                  />
                </div>
                {errors.annualRevenue && <p className="text-xs text-red-500 font-mono">{errors.annualRevenue}</p>}
              </div>

              {/* Years in Business */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Years in Business</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    value={profile.yearsInBusiness}
                    onChange={(e) => setProfile({ ...profile, yearsInBusiness: parseInt(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-600 transition-all text-sm"
                  />
                </div>
                {errors.yearsInBusiness && <p className="text-xs text-red-500 font-mono">{errors.yearsInBusiness}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-8">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
              >
                Continue to Briefing
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* Presets Grid */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                  Quick Presets (Test Scenarios)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setChallenge({ description: p.text })}
                      className="p-3 text-left rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-white/10 transition-all group cursor-pointer"
                    >
                      <h4 className="text-xs font-sans font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-normal">
                        {p.text}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea Description */}
              <div className="space-y-3">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Describe your business challenge
                </label>
                <div className="relative">
                  <span className="absolute top-4 left-3.5 text-slate-500">
                    <FileText className="w-5 h-5" />
                  </span>
                  <textarea
                    required
                    rows={6}
                    value={challenge.description}
                    onChange={(e) => setChallenge({ description: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-black border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-600 transition-all text-sm leading-relaxed"
                    placeholder="Describe your current bottleneck, target metrics, operations delays, cash flow limitations, competitor pressures, or hiring struggles in full detail..."
                  />
                </div>
                {errors.description && <p className="text-xs text-red-500 font-mono">{errors.description}</p>}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Include precise values (margins, budgets, employees) if possible for more accurate AI modeling.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-8">
              <button
                type="button"
                onClick={() => setFormStep(1)}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Step
              </button>
              <button
                type="submit"
                className="px-7 py-3 rounded-xl bg-cyan-500 text-black font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
              >
                Initiate Boardroom Briefing
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
