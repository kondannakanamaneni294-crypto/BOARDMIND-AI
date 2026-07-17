import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK safely
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Using local mock responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// In-memory session database to guarantee immediate full persistence without database errors
const boardroomSessions: any[] = [];

// ==========================================
// API ROUTE 1: GENERATE INTERVIEW QUESTIONS
// ==========================================
app.post("/api/boardroom/generate-questions", async (req, res) => {
  const { profile, challenge } = req.body;

  if (!profile || !challenge) {
    return res.status(400).json({ error: "Missing company profile or business challenge description." });
  }

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Return high-fidelity fallback mock questions if API Key is not set yet
    return res.json({
      questions: [
        {
          id: "q_cfo",
          executiveId: "cfo",
          question: `What are your current exact monthly fixed versus variable operating expenses, and what are your current gross/net profit margins?`,
          placeholder: "e.g. Monthly fixed $15K, variable $10K. Net margin is 12%.",
          category: "Financial Metrics"
        },
        {
          id: "q_cmo",
          executiveId: "cmo",
          question: `Which marketing channels are you currently investing in, and what is your approximate Customer Acquisition Cost (CAC) and customer lifetime value (LTV)?`,
          placeholder: "e.g. Meta ads and SEO. CAC is $45. LTV is roughly $300.",
          category: "Marketing & Brand"
        },
        {
          id: "q_coo",
          executiveId: "coo",
          question: `What bottlenecks or inventory challenges are currently impacting your daily business operations?`,
          placeholder: "e.g. Supply chain shipment delays from suppliers, high manual fulfillment labor.",
          category: "Operational Capacity"
        },
        {
          id: "q_chro",
          executiveId: "chro",
          question: `What has been your staff turnover rate over the last year, and how would you describe employee motivation and alignment?`,
          placeholder: "e.g. About 25% turnover, team feels overworked and under-supported.",
          category: "Human Capital"
        },
        {
          id: "q_risk",
          executiveId: "risk",
          question: `Who are your top 3 immediate local or digital competitors, and what macro risks (regulatory, technology, pricing) worry you most?`,
          placeholder: "e.g. Local big-box stores and cheap online startups. Worried about supply inflation.",
          category: "Risk Exposure"
        }
      ]
    });
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are the BoardMind AI executive board. Generate exactly 5 highly customized, analytical interview questions tailored specifically to help the executive board understand this business's current state.`;

    const userPrompt = `
      Company Profile:
      - Name: ${profile.companyName}
      - Industry: ${profile.industry}
      - Employees: ${profile.employees}
      - Annual Revenue: $${profile.annualRevenue}
      - Years in Business: ${profile.yearsInBusiness}
      - Country: ${profile.country}

      Core Business Challenge:
      "${challenge.description}"

      Your goal is to select exactly 5 different AI Executives from the following list (CFO, CMO, COO, CHRO, CTO, Legal, Sales, CX, Risk, Innovation) and have them ask one highly targeted, metric-seeking question each. Each question must require quantitative or qualitative data that will help diagnose the core problem. Keep questions direct, professional, and clear.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["questions"],
          properties: {
            questions: {
              type: Type.ARRAY,
              description: "Array of exactly 5 tailored interview questions",
              items: {
                type: Type.OBJECT,
                required: ["id", "executiveId", "question", "placeholder", "category"],
                properties: {
                  id: { type: Type.STRING },
                  executiveId: {
                    type: Type.STRING,
                    description: "Must be one of: ceo, cfo, coo, chro, cmo, cto, legal, sales, cx, risk, innovation"
                  },
                  question: { type: Type.STRING, description: "Highly tailored metric-seeking question" },
                  placeholder: { type: Type.STRING, description: "A realistic placeholder matching the question's focus" },
                  category: { type: Type.STRING, description: "Shorter category title, e.g. 'Operating Leverage', 'Marketing ROI'" }
                }
              }
            }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Failed to generate dynamic interview questions.", details: error.message });
  }
});

// =======================================================
// API ROUTE 2: BOARDROOM SIMULATION, DEBATE, AND REPORT
// =======================================================
app.post("/api/boardroom/analyze-and-debate", async (req, res) => {
  const { profile, challenge, interviewAnswers, answers } = req.body;
  const resolvedAnswers = interviewAnswers || answers;

  if (!profile || !challenge || !resolvedAnswers) {
    return res.status(400).json({ error: "Missing company profile, challenge description, or interview answers." });
  }

  try {
    const ai = getGeminiClient();

    // Context formatting
    const contextStr = `
      COMPANY PROFILE:
      - Name: ${profile.companyName}
      - Industry: ${profile.industry}
      - Employees: ${profile.employees}
      - Annual Revenue: $${profile.annualRevenue}
      - Years in Business: ${profile.yearsInBusiness}
      - Location: ${profile.country}

      BUSINESS CHALLENGE:
      "${challenge.description}"

      INTERVIEW ANSWERS SUBMITTED BY CEO:
      ${Object.entries(resolvedAnswers)
        .map(([qId, answer]) => `- Executive/Question [${qId}]: "${answer}"`)
        .join("\n")}
    `;

    const systemInstruction = `
      You are the Boardmind AI Executive Board. You will run a multi-agent corporate simulation analyzing the user's business challenge.
      Analyze the business context, financial metrics, operational constraints, and marketing challenges, then output a complete boardroom report in JSON.
      Your output MUST be highly professional, deeply analytical, and realistic (no placeholders or generic responses).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `
        Analyze the following business and generate a complete Executive Boardroom Report.

        CONTEXT:
        ${contextStr}

        You must provide:
        1. A comprehensive analysis for EACH of the 11 AI Executives (ceo, cfo, coo, chro, cmo, cto, legal, sales, cx, risk, innovation).
        2. A boardroom debate transcripts (5 to 8 messages) showcasing executives clashing, challenging each other, defending their domains, and reaching a smart compromise under the CEO's leadership.
        3. A SWOT Analysis.
        4. A 3D Risk Radar profile (Financial, Operational, Market, Technology, Legal, HR risks) out of 100.
        5. CEO Final Decision & Strategy synthesis.
        6. A 4-phase implementation Roadmap (Immediate, 30-Day, 60-Day, 90-Day).
        7. Predictive 1-year performance forecasting (Revenue, Profit, Expenses, Demand, Inventory, Employee Productivity, and Customer Growth).

        Ensure all metrics (e.g., risk scores, financial projections, health scores) are internally consistent. For example, if marketing spend rises, customer growth and revenues should show proportional growth in later quarters.
      `,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["executiveAnalyses", "debateHistory", "ceoDecision", "swot", "riskRadar", "roadmap", "predictions"],
          properties: {
            executiveAnalyses: {
              type: Type.OBJECT,
              description: "Object containing analyses keyed by executive ID",
              properties: {
                ceo: { $ref: "#/definitions/executiveAnalysis" },
                cfo: { $ref: "#/definitions/executiveAnalysis" },
                coo: { $ref: "#/definitions/executiveAnalysis" },
                chro: { $ref: "#/definitions/executiveAnalysis" },
                cmo: { $ref: "#/definitions/executiveAnalysis" },
                cto: { $ref: "#/definitions/executiveAnalysis" },
                legal: { $ref: "#/definitions/executiveAnalysis" },
                sales: { $ref: "#/definitions/executiveAnalysis" },
                cx: { $ref: "#/definitions/executiveAnalysis" },
                risk: { $ref: "#/definitions/executiveAnalysis" },
                innovation: { $ref: "#/definitions/executiveAnalysis" }
              }
            },
            debateHistory: {
              type: Type.ARRAY,
              description: "A chronological series of 5 to 8 highly engaging corporate board debate messages",
              items: {
                type: Type.OBJECT,
                required: ["id", "executiveId", "name", "title", "message", "type"],
                properties: {
                  id: { type: Type.STRING },
                  executiveId: { type: Type.STRING },
                  name: { type: Type.STRING },
                  title: { type: Type.STRING },
                  message: { type: Type.STRING, description: "Highly realistic, professional, domain-focused argument, pushback, or support" },
                  type: { type: Type.STRING, description: "Must be: opening, challenge, rebuttal, support, or synthesis" },
                  referencesId: { type: Type.STRING, description: "Optional. ID of the executive whose recommendation is being critiqued or agreed with" }
                }
              }
            },
            ceoDecision: {
              type: Type.OBJECT,
              required: [
                "executiveSummary",
                "businessHealthScore",
                "riskScore",
                "growthScore",
                "confidenceScore",
                "mainProblems",
                "rootCauses",
                "priorityActions",
                "businessStrategy",
                "expectedOutcome"
              ],
              properties: {
                executiveSummary: { type: Type.STRING, description: "High-level summary of the findings and final direction" },
                businessHealthScore: { type: Type.INTEGER, description: "Score from 0 to 100" },
                riskScore: { type: Type.INTEGER, description: "Score from 0 to 100" },
                growthScore: { type: Type.INTEGER, description: "Score from 0 to 100" },
                confidenceScore: { type: Type.INTEGER, description: "Score from 0 to 100" },
                mainProblems: { type: Type.ARRAY, items: { type: Type.STRING } },
                rootCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
                priorityActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                businessStrategy: { type: Type.STRING, description: "Synthesized primary strategy of Boardmind AI" },
                expectedOutcome: { type: Type.STRING, description: "Expected high-level outcome after implementation" }
              }
            },
            riskRadar: {
              type: Type.ARRAY,
              description: "Array of exactly 6 risk metrics for the radar chart",
              items: {
                type: Type.OBJECT,
                required: ["subject", "score", "fullMark"],
                properties: {
                  subject: { type: Type.STRING, description: "Must be one of: Financial Risk, Operational Risk, Market Risk, Technology Risk, Legal Risk, HR Risk" },
                  score: { type: Type.INTEGER, description: "0 to 100 scale" },
                  fullMark: { type: Type.INTEGER, description: "Must be 100" }
                }
              }
            },
            swot: {
              type: Type.OBJECT,
              required: ["strengths", "weaknesses", "opportunities", "threats"],
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            roadmap: {
              type: Type.ARRAY,
              description: "Array of exactly 4 Roadmap items matching key timelines",
              items: {
                type: Type.OBJECT,
                required: ["timeframe", "actions", "responsibleExecutive", "expectedROI", "expectedRevenueGrowth"],
                properties: {
                  timeframe: { type: Type.STRING, description: "Must be one of: Immediate, 30-Day, 60-Day, 90-Day" },
                  actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  responsibleExecutive: { type: Type.STRING, description: "The executive owner, e.g., 'CFO Sterling', 'CMO Kincaid'" },
                  expectedROI: { type: Type.STRING },
                  expectedRevenueGrowth: { type: Type.STRING }
                }
              }
            },
            predictions: {
              type: Type.OBJECT,
              required: ["forecast30Days", "forecast90Days", "forecast6Months", "forecast1Year"],
              properties: {
                forecast30Days: { $ref: "#/definitions/forecastData" },
                forecast90Days: { $ref: "#/definitions/forecastData" },
                forecast6Months: { $ref: "#/definitions/forecastData" },
                forecast1Year: { $ref: "#/definitions/forecastData" }
              }
            }
          },
          definitions: {
            executiveAnalysis: {
              type: Type.OBJECT,
              required: [
                "departmentName",
                "problemUnderstanding",
                "keyFindings",
                "dataAnalysis",
                "rootCause",
                "recommendations",
                "priority",
                "riskLevel",
                "expectedImpact",
                "confidenceScore"
              ],
              properties: {
                departmentName: { type: Type.STRING },
                problemUnderstanding: { type: Type.STRING, description: "Analysis from the perspective of this department" },
                keyFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
                dataAnalysis: { type: Type.STRING, description: "Short quantitative metrics calculation and critique" },
                rootCause: { type: Type.STRING },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                priority: { type: Type.STRING, description: "Must be: High, Medium, or Low" },
                riskLevel: { type: Type.STRING, description: "Must be: Critical, High, Medium, or Low" },
                expectedImpact: { type: Type.STRING },
                confidenceScore: { type: Type.INTEGER, description: "0 to 100" }
              }
            },
            forecastData: {
              type: Type.OBJECT,
              required: ["revenue", "profit", "expenses", "demand", "inventoryEfficiency", "employeeProductivity", "customerGrowth"],
              properties: {
                revenue: { type: Type.INTEGER, description: "Projected monthly revenue in USD" },
                profit: { type: Type.INTEGER, description: "Projected monthly profit in USD" },
                expenses: { type: Type.INTEGER, description: "Projected monthly expenses in USD" },
                demand: { type: Type.INTEGER, description: "Demand score out of 100" },
                inventoryEfficiency: { type: Type.INTEGER, description: "Efficiency score out of 100" },
                employeeProductivity: { type: Type.INTEGER, description: "Productivity score out of 100" },
                customerGrowth: { type: Type.INTEGER, description: "Percentage customer growth rate, e.g. 15 for 15%" }
              }
            }
          }
        }
      }
    });

    const parsedReport = JSON.parse(response.text || "{}");
    const fullReport = {
      id: "session_" + Date.now(),
      createdAt: new Date().toISOString(),
      profile,
      challenge,
      interviewAnswers: resolvedAnswers,
      ...parsedReport,
    };

    boardroomSessions.unshift(fullReport);
    res.json(fullReport);
  } catch (error: any) {
    console.error("Error analyzing boardroom simulation:", error);
    res.status(500).json({ error: "Failed to run executive board simulation.", details: error.message });
  }
});

// ==========================================
// API ROUTE 3: WHAT-IF SIMULATOR
// ==========================================
app.post("/api/boardroom/simulate-scenario", async (req, res) => {
  const { profile, challenge, scenario, currentReport } = req.body;

  if (!profile || !challenge || !scenario) {
    return res.status(400).json({ error: "Missing simulation inputs." });
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are the Boardmind AI business forecaster. Predict the percentage impacts of the user's scenario on key business KPIs.`;

    const userPrompt = `
      Company Profile: ${profile.companyName} (${profile.industry})
      Annual Revenue: $${profile.annualRevenue}
      Challenge: "${challenge.description}"

      The user wants to simulate this specific strategic scenario:
      "${scenario}"

      Based on economic principles, marketing dynamics, and corporate strategy, predict the exact percentage shift (can be positive or negative) for:
      - Revenue Impact (%)
      - Profit Impact (%)
      - Growth Impact (%)
      - Risk Impact (%)
      - Customer Satisfaction Impact (%)
      - Cash Flow Impact (%)

      Also provide a clear, dense, professional 2-3 sentence executive reasoning explaining these numbers.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "revenueImpact",
            "profitImpact",
            "growthImpact",
            "riskImpact",
            "satisfactionImpact",
            "cashFlowImpact",
            "explanation"
          ],
          properties: {
            revenueImpact: { type: Type.INTEGER, description: "E.g., 15 for +15%, or -10 for -10%" },
            profitImpact: { type: Type.INTEGER },
            growthImpact: { type: Type.INTEGER },
            riskImpact: { type: Type.INTEGER, description: "E.g., -5 if risk decreased, or 20 if risk increased" },
            satisfactionImpact: { type: Type.INTEGER },
            cashFlowImpact: { type: Type.INTEGER },
            explanation: { type: Type.STRING, description: "Brief executive summary of why this outcome is predicted" }
          }
        }
      }
    });

    const parsedResult = JSON.parse(response.text || "{}");
    res.json(parsedResult);
  } catch (error: any) {
    console.error("Error simulating what-if scenario:", error);
    res.status(500).json({ error: "Failed to simulate what-if scenario.", details: error.message });
  }
});

// ==========================================
// API ROUTE: CSFO PREMIUM SMB ADVISOR
// ==========================================
app.post("/api/csfo/analyze", async (req, res) => {
  const { scale, dailyCustomers, floatingArea, averageTurnover, targetLanguage, coreProblem } = req.body;

  if (!scale || !dailyCustomers || !floatingArea || !averageTurnover || !targetLanguage || !coreProblem) {
    return res.status(400).json({ error: "Missing required business metrics or problem statement." });
  }

  // Fallback high-fidelity content if no apiKey is configured
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    let mockContent = "";
    const langLower = targetLanguage.toLowerCase();
    
    if (langLower.includes("telugu")) {
      mockContent = `# Business Strategy & Automation Audit Report
**Executive Summary:** బొటిక్ స్టోర్ యజమాని సమయాన్ని వృధా చేసే కస్టమర్ ఫోన్ కాల్స్ మరియు మాన్యువల్ పేపర్ లెడ్జర్ లీకేజీలను ఆటోమేట్ చేయడం ద్వారా నెలకు ${averageTurnover} టర్నోవర్ గల ఈ వ్యాపారాన్ని తక్కువ ఖర్చుతో సురక్షితమైన లాభాల బాట పట్టించడమే మా తక్షణ లక్ష్యం.

### 1. Granular Workflow & Leak Analysis
* **Identified Operational Leak 1:** ప్రతీరోజూ స్టాక్ వివరాల కోసం మరియు అపాయింట్‌మెంట్ల కోసం వచ్చే ఫోన్ కాల్స్‌కు యజమాని మాన్యువల్‌గా సమాధానం చెప్పడం.
  * *Current Waste Impact:* వారానికి దాదాపు 20 గంటల విలువైన సమయం వృధా అవుతోంది (దీని విలువ సుమారు రూ. 15,000/వారం).
  * *Root Cause:* ఆటోమేటెడ్ వాట్సాప్ బిజినెస్ బాట్ లేదా ఆన్‌లైన్ అపాయింట్‌మెంట్ బుకింగ్ లింక్ లేకపోవడం.

* **Identified Operational Leak 2:** సప్లయర్ వివరాలు మరియు స్టాక్ రిజిస్టర్‌ను మాన్యువల్‌గా పేపర్ బుక్‌లో నమోదు చేయడం.
  * *Current Waste Impact:* స్టాక్ అప్‌డేట్స్ లేకపోవడం వల్ల కొత్త ఫ్యాషన్ డిజైన్స్ మిస్ అయి కస్టమర్లు తగ్గిపోతున్నారు.
  * *Root Cause:* డిజిటల్ లెడ్జర్ లేకపోవడం వల్ల సకాలంలో నిర్ణయాలు తీసుకోలేకపోవడం.

### 2. The Safe-Return & Automation Strategy (Step-by-Step)
* **Phase 1: Immediate Workflow Automation:** ఉచిత వాట్సాప్ బిజినెస్ (WhatsApp Business) అకౌంట్ ఏర్పాటు చేసి, ఆటోమేటిక్ రిప్లైలు మరియు ఎఫ్.ఎ.క్యూ (FAQ) సెట్ చేయండి. అపాయింట్‌మెంట్ల కోసం ఉచిత క్యాలెండ్లీ (Calendly) వాడండి.
* **Phase 2: Low-Risk Cost Optimization:** పేపర్ బుక్‌ను నిలిపివేసి, ఉచిత గూగుల్ షీట్స్ (Google Sheets) లేదా తక్కువ ధర గల POS (ఉదాహరణకు Square లేదా Vyapar App) వాడడం ప్రారంభించండి.
* **Phase 3: Stabilization & Growth:** మిగిలిన సమయాన్ని కస్టమర్ రిలేషన్స్ పెంపొందించడానికి మరియు సరికొత్త డిజైన్ల మార్కెటింగ్ కోసం కేటాయించండి.

### 3. Financial & Efficiency ROI Breakdown
* **Estimated Implementation Cost:** 0 నుండి రూ. 2,000/నెలకు (వాట్సాప్ మరియు గూగుల్ షీట్స్ ఉచితం).
* **Projected Operational Recovery:** వారానికి 20 గంటల సమయం ఆదా అవుతుంది మరియు స్టాక్ అవుట్ సమస్యలు 85% తగ్గుతాయి.
* **Net Profit / Value Potential:** ఆదా అయిన సమయాన్ని వ్యాపార వృద్ధికి ఉపయోగించడం ద్వారా నెలకు రూ. 50,000 వరకు అదనపు నికర లాభం సాధించవచ్చు.

### 4. Final Strategic Verdict
ఈ చిన్న మరియు అత్యంత సురక్షితమైన ఆటోమేషన్ పద్ధతుల ద్వారా మీ వ్యాపారం అతి త్వరలోనే పూర్తి స్థిరత్వాన్ని మరియు నిరంతర వృద్ధిని సాధిస్తుంది.`;
    } else if (langLower.includes("hindi")) {
      mockContent = `# Business Strategy & Automation Audit Report
**Executive Summary:** बुटीक स्टोर मालिक का कीमती समय बर्बाद करने वाले फोन कॉल्स और मैन्युअल पेपर बहीखाता (लेजर) की लीकेज को ऑटोमेट करके ${averageTurnover} प्रति माह के टर्नओवर वाले इस व्यवसाय को न्यूनतम लागत में सुरक्षित मुनाफे की राह पर लाना हमारा त्वरित उद्देश्य है।

### 1. Granular Workflow & Leak Analysis
* **Identified Operational Leak 1:** ग्राहक फोन कॉल का मैन्युअल रूप से जवाब देने में मालिक का प्रतिदिन 3-4 घंटे खर्च होना।
  * *Current Waste Impact:* प्रति सप्ताह लगभग 20-24 घंटे का नुकसान (मूल्य लगभग ₹12,000 प्रति सप्ताह)।
  * *Root Cause:* ऑटोमेटेड व्हाट्सएप बिजनेस बॉट या ऑनलाइन अपॉइंटमेंट बुकिंग लिंक की अनुपस्थिति।

* **Identified Operational Leak 2:** पेपर-आधारित मैन्युअल सप्लायर लेजर और स्टॉक रजिस्टर प्रबंधन।
  * *Current Waste Impact:* समय पर स्टॉक अपडेट न होने से नए फैशन आगमन का लाभ न ले पाना और ग्राहकों का खोना।
  * *Root Cause:* डिजिटल क्लाउड-आधारित सूची प्रबंधन प्रणाली की कमी।

### 2. The Safe-Return & Automation Strategy (Step-by-Step)
* **Phase 1: Immediate Workflow Automation:** तुरंत व्हाट्सएप बिजनेस पर ऑटोमेटेड ग्रीटिंग और अक्सर पूछे जाने वाले प्रश्नों (FAQs) को सक्रिय करें और अपॉइंटमेंट के लिए मुफ्त Calendly टूल का उपयोग करें।
* **Phase 2: Low-Risk Cost Optimization:** कागज की बही को हटाकर एक बुनियादी मुफ्त क्लाउड स्प्रेडशीट (Google Sheets) या कम लागत वाले POS टूल (जैसे Square या Vyapar) का उपयोग शुरू करें।
* **Phase 3: Stabilization & Growth:** बचे हुए 20 घंटे प्रति सप्ताह का उपयोग स्थानीय ग्राहकों से सीधे संपर्क बढ़ाने और प्रीमियम फेशियल या पर्सनलाइज्ड स्टाइलिंग सत्र शुरू करने में करें।

### 3. Financial & Efficiency ROI Breakdown
* **Estimated Implementation Cost:** ₹0 से ₹1,500 प्रति माह (व्हाट्सएप और गूगल शीट्स पूरी तरह से मुफ्त हैं)।
* **Projected Operational Recovery:** प्रति सप्ताह 20+ घंटे की सीधी बचत और स्टॉकआउट की समस्याओं में 90% की कमी।
* **Net Profit / Value Potential:** नए ग्राहक संबंधों और समय पर स्टॉक उपलब्धता के कारण शुद्ध लाभ में मासिक ₹35,000 की वृद्धि।

### 4. Final Strategic Verdict
इन व्यावहारिक और बिना किसी जोखिम वाले ऑटोमेशन उपायों को अपनाकर आप बिना किसी भारी निवेश के सुरक्षित वित्तीय रिटर्न और परिचालन सुदृढ़ता प्राप्त करेंगे।`;
    } else {
      mockContent = `# Business Strategy & Automation Audit Report
**Executive Summary:** To address operational inefficiencies for this ${scale} business making ${averageTurnover} with ${dailyCustomers} daily customers, we must target high-friction manual communication and paper workflows to recover owner hours, prevent inventory leaks, and establish low-risk financial returns.

### 1. Granular Workflow & Leak Analysis
* **Identified Operational Leak 1:** Owner spending excessive hours manually answering customer inquiries and handling appointment bookings on the phone.
  * *Current Waste Impact:* An estimated 20-25 hours lost per week, representing roughly $1,200/week in squandered executive strategic value.
  * *Root Cause:* Lack of an automated WhatsApp Business auto-responder, interactive FAQ menu, or online scheduling pipeline.

* **Identified Operational Leak 2:** Manual paper-based supplier ledger tracking and delayed stock auditing.
  * *Current Waste Impact:* High stockouts of fast-moving inventory items, causing an estimated $3,000/month in lost high-margin conversions.
  * *Root Cause:* Relying on manual ledger entries instead of a centralized, cloud-based dynamic digital tracking solution.

### 2. The Safe-Return & Automation Strategy (Step-by-Step)
* **Phase 1: Immediate Workflow Automation:** Activate a free WhatsApp Business profile configured with automated welcome greetings, standard stock FAQ answers, and a direct Calendly booking widget link for streamlined customer reservations.
* **Phase 2: Low-Risk Cost Optimization:** Transition the manual ledger to a structured, cloud-synchronized Google Sheet or an affordable mobile POS system (such as Square or Shopify Starter) to enable instant inventory status lookups.
* **Phase 3: Stabilization & Growth:** Reallocate the 20 recovered hours per week from repetitive voice communication into proactive supplier relations and customer-focused styling services to drive recurring sales.

### 3. Financial & Efficiency ROI Breakdown
* **Estimated Implementation Cost:** $0 to $29/month (WhatsApp Business and Calendly free tier; cloud spreadsheets are free).
* **Projected Operational Recovery:** Saves 20 hours of manual administration per week, eliminating up to 85% of inventory lookup delays.
* **Net Profit / Value Potential:** Converts recovered owner hours into an estimated $2,200/month in net new revenue via localized client retention and consistent stocking.

### 4. Final Strategic Verdict
By automating these manual, repetitive touchpoints, you instantly reclaim critical operational hours and establish an incredibly stable, zero-risk pathway to robust business growth.`;
    }
    return res.json({ reportMarkdown: mockContent });
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are the Chief Strategy, Operations, and Financial Officer (CSFO) AI for an advanced Small and Medium Business (SMB) automation and advisory platform. Your goal is to analyze business metrics and audit every minor operational bottleneck provided by the user (including text or transcribed voice messages). You must provide highly accurate, actionable, low-risk solutions that emphasize business automation, time recovery, and "safe returns" to protect financial stability.

EXECUTION RULES:
1. Minor Detail Auditing: You must parse the user's input for hidden workflow inefficiencies. For example: If they mention spending too much time answering repetitive phone queries, you must explicitly target that and suggest a lightweight automated voice/chat agent. If they handle manual billing or inventory tracking on paper, target it with an immediate software alternative.
2. Low-Risk Automation First: Prioritize zero-cost or highly affordable, easily integrated SaaS/DIY tools (e.g., WhatsApp Business Automation, Twilio, Calendly, Zapier, basic CRM/POS software) that match their business scale. Do not suggest complex, enterprise-level ERP setups for small retail storefronts.
3. Financial & Time Quantification: For every minor operational detail you fix, estimate how much time/money it currently wastes and quantify how much implementation costs versus the safe financial return or profit potential.
4. Localization: You must fluently generate the entire output in the exact Target Output Language requested (e.g., English, Telugu, Hindi, Spanish, etc.). Maintain a professional, highly encouraging, and reassuring corporate tone.

OUTPUT FORMAT (Strict Markdown)
Structure your response exactly as follows:

# Business Strategy & Automation Audit Report
**Executive Summary:** [1-2 sentences summarizing the overall problem, key operational leaks, and the target recovery goal]

### 1. Granular Workflow & Leak Analysis
* **Identified Operational Leak 1:** [Detail the specific minor bottleneck, e.g., 'Owner spending excessive hours managing telephone bookings manually']
  * *Current Waste Impact:* [Estimated time or money lost per week due to this manual process]
  * *Root Cause:* [Why this step is currently bottlenecked]

* **Identified Operational Leak 2:** [Detail a second minor bottleneck, e.g., 'Manual paper-based inventory auditing causing stock expiration tracking errors']
  * *Current Waste Impact:* [Estimated time or money lost per week]
  * *Root Cause:* [Why this step is currently bottlenecked]

### 2. The Safe-Return & Automation Strategy (Step-by-Step)
* **Phase 1: Immediate Workflow Automation:** [Direct action step to automate the biggest time leaks using specific tool recommendations, e.g., 'Deploy an automated WhatsApp Business/Twilio bot to handle FAQ and bookings']
* **Phase 2: Low-Risk Cost Optimization:** [Action step to handle supply or physical site inefficiencies with minimal capital]
* **Phase 3: Stabilization & Growth:** [Long-term plan to turn newly recovered operational time into a profit center]

### 3. Financial & Efficiency ROI Breakdown
* **Estimated Implementation Cost:** [Total costs to deploy the suggested automated tools and fixes]
* **Projected Operational Recovery:** [Quantifiable metrics showing hours saved per week and financial loss reduction]
* **Net Profit / Value Potential:** [How the saved hours can be converted into new revenue or safe profit expansion]

### 4. Final Strategic Verdict
[A 1-2 sentence reassuring closing statement mapping out their quick roadmap to stable, automated operations.]`;

    const userPrompt = `BUSINESS METRICS:
- Scale: ${scale}
- Daily Customers: ${dailyCustomers}
- Floating Area: ${floatingArea}
- Average Turnover: ${averageTurnover}
- Target Output Language: ${targetLanguage}

CORE PROBLEM & ROUTINE DETAILS:
"${coreProblem}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    const reportMarkdown = response.text || "Failed to generate audit report.";
    res.json({ reportMarkdown });
  } catch (error: any) {
    console.error("Error generating CSFO report:", error);
    res.status(500).json({ error: "Failed to generate CSFO Advisory Report.", details: error.message });
  }
});

// ==========================================
// API ROUTE 4: RETRIEVE PREVIOUS SESSIONS
// ==========================================
app.get("/api/boardroom/sessions", (req, res) => {
  res.json(boardroomSessions);
});

// ==========================================
// SERVE STATIC FILES / VITE MIDDLEWARE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Boardmind AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
