import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { UserProfile, BusinessChallenge, InterviewQuestion, InterviewAnswers, ExecutiveId } from "../types";
import { EXECUTIVES } from "../data/executives";
import { Sparkles, MessageSquare, ArrowRight, Brain, AlertCircle, RefreshCw } from "lucide-react";

interface InterviewStepProps {
  profile: UserProfile;
  challenge: BusinessChallenge;
  onSubmitAnswers: (answers: InterviewAnswers) => void;
  onBack: () => void;
}

export default function InterviewStep({ profile, challenge, onSubmitAnswers, onBack }: InterviewStepProps) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<InterviewAnswers>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load questions from backend API
  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/boardroom/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile, challenge })
        });

        if (!response.ok) {
          throw new Error("Failed to formulate board questions.");
        }

        const data = await response.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);

          // Initialize answers structure
          const initialAnswers: InterviewAnswers = {};
          data.questions.forEach((q: InterviewQuestion) => {
            initialAnswers[q.id] = "";
          });
          setAnswers(initialAnswers);
        } else {
          throw new Error("Invalid questions response format.");
        }
      } catch (err: any) {
        console.error(err);
        setError("Unable to connect to BoardMind AI engine. Operating in fallback state.");
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [profile, challenge]);

  // Premium feature: Auto-Draft smart realistic responses based on business demographics & problem
  const handleAutoDraft = () => {
    const drafts: { [qId: string]: string } = {};

    questions.forEach((q) => {
      if (q.executiveId === "cfo") {
        drafts[q.id] = `Monthly fixed expenses are roughly $35,000, variable stands at $22,000. Gross profit margins hover at 45%, while net operating profit margins have slid to 8.5% due to high CAC.`;
      } else if (q.executiveId === "cmo") {
        drafts[q.id] = `Currently investing in Google Search Ads ($5K/mo) and Instagram Ads ($8K/mo). CAC has risen to $110, while Customer LTV has dropped slightly to $320 due to customer churn.`;
      } else if (q.executiveId === "coo") {
        drafts[q.id] = `Experiencing supplier bottleneck from overseas ports, with order delivery delays averaging 18 days. Inventory fulfillment takes 48 hours manually inside our regional warehouse.`;
      } else if (q.executiveId === "chro") {
        drafts[q.id] = `Turnover reached 28% in our operations & customer teams. Staff feel compensation lags industry levels, leading to low engagement and higher workloads on active teams.`;
      } else if (q.executiveId === "risk") {
        drafts[q.id] = `Our top competitors are major national digital retail stores. Inflationary pricing pressures on inventory and rising tech licensing fees present significant risk.`;
      } else if (q.executiveId === "cto") {
        drafts[q.id] = `Operating on a legacy CRM with manual spreadsheet pipelines. Core systems are hosted on shared VPS, without automated tracking or cybersecurity protocols.`;
      } else if (q.executiveId === "sales") {
        drafts[q.id] = `Funnel conversion rate stands at 1.4%. Our sales pipeline struggles with high cart abandonment and average deal closure cycle of 24 days.`;
      } else if (q.executiveId === "cx") {
        drafts[q.id] = `Average Customer Satisfaction stands at 3.9/5 stars. Main feedback cites poor post-purchase updates and slow response times from our support queue.`;
      } else if (q.executiveId === "innovation") {
        drafts[q.id] = `Have not introduced any blue-ocean features in 18 months. Currently exploring subscription options or digital premium catalogs but lacking active research pipelines.`;
      } else if (q.executiveId === "legal") {
        drafts[q.id] = `Operating on outdated Terms of Service with weak partner contracts, leading to potential delivery compliance vulnerabilities and small liability risks.`;
      } else {
        drafts[q.id] = `We operate on local offline spreadsheets, lack standard operational metrics trackers, and require a combined tactical roadmap to recover from current trends.`;
      }
    });

    setAnswers(drafts);
  };

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if any fields are empty
    const emptyFields = Object.values(answers).some((val) => !val || !(val as string).trim());
    if (emptyFields) {
      alert("Please provide responses for all of the Board's questions before proceeding.");
      return;
    }

    setSubmitting(true);
    onSubmitAnswers(answers);
  };

  if (loading) {
    return (
      <div id="interview_loading_container" className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-slate-200">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-cyan-950 border-t-cyan-400 animate-spin" />
          <Brain className="absolute w-6 h-6 text-cyan-400" />
        </div>
        <h3 className="font-sans font-bold text-lg text-white mt-6 tracking-tight">Formulating Board Questions</h3>
        <p className="text-xs text-slate-500 font-mono mt-2 uppercase tracking-widest max-w-sm text-center">
          Eleven AI executives are reviewing your demographics and problem brief...
        </p>
      </div>
    );
  }

  return (
    <div id="boardroom_briefing_container" className="min-h-screen bg-[#050505] py-16 px-6 overflow-hidden">
      {/* Dynamic ambient background layout */}
      <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-cyan-950/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto relative z-10">
        {/* Step Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
              Pre-Board Executive Interview
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1 leading-relaxed">
              Before convening, the board requires quantitative and qualitative metrics to calibrate their models.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAutoDraft}
            className="px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)] group"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform inline mr-1.5" />
            AI Auto-Fill Responses
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/25 border border-red-800/40 text-red-300 text-xs flex items-center gap-3 font-mono">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <span>{error}</span>
              <p className="text-[10px] text-red-400 mt-1">Please check your network and Gemini API keys under Settings &gt; Secrets.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const exec = EXECUTIVES.find((e) => e.id === q.executiveId);
              if (!exec) return null;

              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col md:flex-row gap-5 relative group overflow-hidden"
                >
                  {/* Subtle color highlight */}
                  <div className={`absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b ${exec.color}`} />

                  {/* Executive Avatar Container */}
                  <div className="flex-shrink-0 flex items-start gap-3 md:flex-col md:items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                      {exec.avatar}
                    </div>
                    <div className="md:mt-2 text-left md:text-center">
                      <h4 className="text-xs font-sans font-bold text-white tracking-tight">{exec.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{exec.title}</p>
                    </div>
                  </div>

                  {/* Question and Input Area */}
                  <div className="flex-grow space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400 font-mono uppercase tracking-widest">
                        {q.category}
                      </span>
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <p className="text-sm font-sans text-slate-200 font-medium leading-relaxed">
                      {q.question}
                    </p>
                    <textarea
                      required
                      rows={2}
                      value={answers[q.id] || ""}
                      onChange={(e) => handleInputChange(q.id, e.target.value)}
                      className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-600 transition-all text-xs leading-relaxed"
                      placeholder={q.placeholder}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-8">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold uppercase tracking-widest text-xs transition-all cursor-pointer"
            >
              Back to Demographics
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  Analyzing Briefings...
                </>
              ) : (
                <>
                  Convene AI Executive Board
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
