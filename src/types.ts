/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  name: string;
  email: string;
  companyName: string;
  industry: string;
  country: string;
  businessSize: string;
  employees: number;
  annualRevenue: number;
  yearsInBusiness: number;
}

export interface BusinessChallenge {
  description: string;
}

export type ExecutiveId =
  | "ceo"
  | "cfo"
  | "coo"
  | "chro"
  | "cmo"
  | "cto"
  | "legal"
  | "sales"
  | "cx"
  | "risk"
  | "innovation";

export interface Executive {
  id: ExecutiveId;
  name: string;
  title: string;
  department: string;
  avatar: string;
  color: string;
  focus: string[];
}

export interface InterviewQuestion {
  id: string;
  executiveId: ExecutiveId;
  question: string;
  placeholder: string;
  category: string;
}

export interface InterviewAnswers {
  [questionId: string]: string;
}

export interface ExecutiveAnalysis {
  departmentName: string;
  executiveId: ExecutiveId;
  problemUnderstanding: string;
  keyFindings: string[];
  dataAnalysis: string;
  rootCause: string;
  recommendations: string[];
  priority: "High" | "Medium" | "Low";
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  expectedImpact: string;
  confidenceScore: number;
}

export interface DebateMessage {
  id: string;
  executiveId: ExecutiveId;
  name: string;
  title: string;
  message: string;
  type: "opening" | "challenge" | "rebuttal" | "support" | "synthesis";
  referencesId?: ExecutiveId;
}

export interface CEOFinalDecision {
  executiveSummary: string;
  businessHealthScore: number; // 0-100
  riskScore: number; // 0-100
  growthScore: number; // 0-100
  confidenceScore: number; // 0-100
  mainProblems: string[];
  rootCauses: string[];
  priorityActions: string[];
  businessStrategy: string;
  expectedOutcome: string;
}

export interface PredictiveAnalytics {
  forecast30Days: ForecastData;
  forecast90Days: ForecastData;
  forecast6Months: ForecastData;
  forecast1Year: ForecastData;
}

export interface ForecastData {
  revenue: number;
  profit: number;
  expenses: number;
  demand: number; // 0-100
  inventoryEfficiency: number; // 0-100
  employeeProductivity: number; // 0-100
  customerGrowth: number; // percentage
}

export interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
}

export interface WhatIfResult {
  revenueImpact: number; // percent change
  profitImpact: number; // percent change
  growthImpact: number; // percent change
  riskImpact: number; // percent change
  satisfactionImpact: number; // percent change
  cashFlowImpact: number; // percent change
  explanation: string;
}

export interface RiskRadarMetric {
  subject: string;
  score: number; // 0-100
  fullMark: number;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface RoadmapItem {
  timeframe: "Immediate" | "30-Day" | "60-Day" | "90-Day";
  actions: string[];
  responsibleExecutive: string;
  expectedROI: string;
  expectedRevenueGrowth: string;
}

export interface CompleteBoardroomReport {
  id?: string;
  createdAt: string;
  profile: UserProfile;
  challenge: BusinessChallenge;
  interviewAnswers: InterviewAnswers;
  executiveAnalyses: { [id in ExecutiveId]?: ExecutiveAnalysis };
  debateHistory: DebateMessage[];
  ceoDecision: CEOFinalDecision;
  riskRadar: RiskRadarMetric[];
  swot: SWOTAnalysis;
  roadmap: RoadmapItem[];
  predictions: PredictiveAnalytics;
}
