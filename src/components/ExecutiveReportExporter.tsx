import { CompleteBoardroomReport } from "../types";
import { EXECUTIVES } from "../data/executives";
import { FileText, Printer, Clipboard, CheckCircle, Brain } from "lucide-react";
import { useState } from "react";

interface ExecutiveReportExporterProps {
  report: CompleteBoardroomReport;
}

export default function ExecutiveReportExporter({ report }: ExecutiveReportExporterProps) {
  const [copied, setCopied] = useState(false);

  // Copy full analytical summary to clipboard
  const handleCopy = () => {
    const summaryText = `
BOARDMIND AI - EXECUTIVE REPORT
===============================
Company: ${report.profile.companyName}
Industry: ${report.profile.industry}
Challenge: ${report.challenge.description}

BUSINESS HEALTH SCORE: ${report.ceoDecision.businessHealthScore}/100
GROWTH INDEX: ${report.ceoDecision.growthScore}/100
OPERATING RISK SCORE: ${report.ceoDecision.riskScore}/100
BOARD CONFIDENCE: ${report.ceoDecision.confidenceScore}/100

CEO FINAL DECISION & EXECUTIVE SUMMARY:
--------------------------------------
${report.ceoDecision.executiveSummary}

PRIMARY CORPORATE STRATEGY:
---------------------------
${report.ceoDecision.businessStrategy}

ROOT CAUSES IDENTIFIED:
${report.ceoDecision.rootCauses.map((r) => `- ${r}`).join("\n")}

PRIORITY ACTION ROADMAP:
${report.roadmap
  .map(
    (item) =>
      `\n[${item.timeframe}] (Owner: ${item.responsibleExecutive})
Actions: ${item.actions.join(", ")}
Expected ROI: ${item.expectedROI} | Rev Growth: ${item.expectedRevenueGrowth}`
  )
  .join("\n")}

Generated via BoardMind AI - The AI Executive Boardroom
    `.trim();

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Trigger browser-native print layout mapped to PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="executive_report_exporter" className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Exporter Info */}
      <div className="flex items-center gap-4">
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-sans font-bold text-sm text-white">Consolidated Boardroom Memorandum</h4>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5 leading-relaxed uppercase tracking-wider">
            Download your comprehensive SWOT matrix, predictive charts, and strategic CEO roadmap as a certified PDF report.
          </p>
        </div>
      </div>

      {/* Exporter Action Buttons */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <button
          onClick={handleCopy}
          className="flex-1 md:flex-none px-4.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Copied Summary
            </>
          ) : (
            <>
              <Clipboard className="w-4 h-4" />
              Copy Strategy Memo
            </>
          )}
        </button>

        <button
          id="export_pdf_btn"
          onClick={handlePrint}
          className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4 text-black" />
          Export Certified PDF
        </button>
      </div>

      {/* CSS-Only Print Styles Template injected into DOM to format window.print() as a beautiful white corporate memo PDF */}
      <div className="hidden">
        <style>{`
          @media print {
            body {
              background: #fff !important;
              color: #111827 !important;
              font-family: 'Inter', sans-serif !important;
              padding: 2.5cm !important;
            }
            #root > div {
              display: none !important;
            }
            #print_layout_template {
              display: block !important;
              background: #fff !important;
              color: #111827 !important;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #111827 !important;
              page-break-after: avoid;
            }
            hr {
              border-color: #e5e7eb !important;
            }
            .print-section {
              page-break-inside: avoid;
              margin-bottom: 24px;
            }
          }
        `}</style>
      </div>

      {/* Hidden layout elements that only populate during window.print() */}
      <div id="print_layout_template" className="hidden text-left text-gray-950 bg-white p-12 max-w-4xl mx-auto border border-gray-200 rounded">
        {/* Print Header */}
        <div className="flex items-center justify-between border-b-2 border-gray-900 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-800" />
            <div>
              <h1 className="font-sans font-bold text-xl tracking-tight">BOARDMIND AI REPORT</h1>
              <p className="text-[10px] text-gray-500 font-mono">Verified Corporate Decision Intelligence</p>
            </div>
          </div>
          <div className="text-right font-mono text-[10px] text-gray-500">
            <span>Date: {new Date(report.createdAt).toLocaleDateString()}</span> <br />
            <span>ID: {report.id}</span>
          </div>
        </div>

        {/* Business Profile Metadata */}
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded mb-6 text-xs">
          <div>
            <strong>Company:</strong> {report.profile.companyName} <br />
            <strong>Industry:</strong> {report.profile.industry} <br />
            <strong>Country:</strong> {report.profile.country}
          </div>
          <div>
            <strong>Employees:</strong> {report.profile.employees} <br />
            <strong>Annual Revenue:</strong> ${report.profile.annualRevenue.toLocaleString()} <br />
            <strong>Years in Business:</strong> {report.profile.yearsInBusiness}
          </div>
        </div>

        {/* Briefing Problem */}
        <div className="mb-6 text-xs">
          <h3 className="font-bold text-sm border-b pb-1 mb-2">I. Business Briefing & Challenge</h3>
          <p className="italic text-gray-600">"{report.challenge.description}"</p>
        </div>

        {/* CEO Decision Summary */}
        <div className="mb-6 text-xs print-section">
          <h3 className="font-bold text-sm border-b pb-1 mb-2">II. Executive Decision Memorandum (CEO Vance)</h3>
          <p className="mb-2"><strong>Strategy Synthesis:</strong> {report.ceoDecision.businessStrategy}</p>
          <p className="mb-4"><strong>Executive Summary:</strong> {report.ceoDecision.executiveSummary}</p>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-gray-100 p-2.5 rounded">
              <span className="text-[10px] text-gray-500 uppercase">Health</span>
              <div className="font-bold text-base">{report.ceoDecision.businessHealthScore}%</div>
            </div>
            <div className="bg-gray-100 p-2.5 rounded">
              <span className="text-[10px] text-gray-500 uppercase">Risk</span>
              <div className="font-bold text-base">{report.ceoDecision.riskScore}%</div>
            </div>
            <div className="bg-gray-100 p-2.5 rounded">
              <span className="text-[10px] text-gray-500 uppercase">Growth</span>
              <div className="font-bold text-base">{report.ceoDecision.growthScore}%</div>
            </div>
            <div className="bg-gray-100 p-2.5 rounded">
              <span className="text-[10px] text-gray-500 uppercase">Confidence</span>
              <div className="font-bold text-base">{report.ceoDecision.confidenceScore}%</div>
            </div>
          </div>
        </div>

        {/* SWOT Grid */}
        <div className="mb-6 text-xs print-section">
          <h3 className="font-bold text-sm border-b pb-1 mb-2">III. SWOT Matrix</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border p-3 rounded">
              <h4 className="font-bold text-emerald-800 text-xs mb-1">Strengths</h4>
              <ul className="list-disc pl-4 space-y-1">
                {report.swot.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="border p-3 rounded">
              <h4 className="font-bold text-red-800 text-xs mb-1">Weaknesses</h4>
              <ul className="list-disc pl-4 space-y-1">
                {report.swot.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
            <div className="border p-3 rounded">
              <h4 className="font-bold text-blue-800 text-xs mb-1">Opportunities</h4>
              <ul className="list-disc pl-4 space-y-1">
                {report.swot.opportunities.map((o, i) => <li key={i}>{o}</li>)}
              </ul>
            </div>
            <div className="border p-3 rounded">
              <h4 className="font-bold text-yellow-800 text-xs mb-1">Threats</h4>
              <ul className="list-disc pl-4 space-y-1">
                {report.swot.threats.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Plan Timeline */}
        <div className="mb-6 text-xs print-section">
          <h3 className="font-bold text-sm border-b pb-1 mb-2">IV. Execution & Implementation Timeline</h3>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-3 py-1.5 text-left">Phase</th>
                <th className="border border-gray-200 px-3 py-1.5 text-left">Actions Required</th>
                <th className="border border-gray-200 px-3 py-1.5 text-left">Owner</th>
                <th className="border border-gray-200 px-3 py-1.5 text-left">Expected ROI</th>
              </tr>
            </thead>
            <tbody>
              {report.roadmap.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-200 px-3 py-1.5 font-bold">{item.timeframe}</td>
                  <td className="border border-gray-200 px-3 py-1.5">{item.actions.join(", ")}</td>
                  <td className="border border-gray-200 px-3 py-1.5">{item.responsibleExecutive}</td>
                  <td className="border border-gray-200 px-3 py-1.5 text-emerald-800 font-bold">{item.expectedROI}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Executive Audits */}
        <div className="mb-6 text-xs print-section">
          <h3 className="font-bold text-sm border-b pb-1 mb-2">V. Independent Executive Audits</h3>
          {EXECUTIVES.map((exec) => {
            const audit = report.executiveAnalyses[exec.id];
            if (!audit) return null;
            return (
              <div key={exec.id} className="mb-3.5 pb-2.5 border-b border-gray-100">
                <h4 className="font-bold text-gray-800">{exec.name} ({exec.title})</h4>
                <p className="text-gray-600 mt-1"><strong>Audit Findings:</strong> {audit.problemUnderstanding}</p>
                <p className="text-gray-600 mt-0.5"><strong>Key Recommendation:</strong> {audit.recommendations.join("; ")}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
