import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ViewState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert Hospitality Management Mentor. 
Your goal is to guide a student who is simulating a Front Desk Manager shift.
You will interpret the specific "Servicescape" or "Operational" context the student is looking at and provide Socratic questioning based on hospitality theory (Lean Operations, Sustainability, Social Intelligence).

Do not give the answer directly. Ask questions that force the student to apply theories like Little's Law, Triple Bottom Line, or the 4Vs of Operations.
Keep responses concise (under 100 words) and encouraging.
`;

const RUBRIC_MATRIX = `
Domain,Criterion,90-100 (Exceptional),80-89 (Outstanding),70-79 (Excellent),60-69 (Very Good),50-59 (Good),40-49 (Satisfactory),30-39 (Marginal Fail),20-29 (Fail),0-19 (Low Fail)
Knowledge & Understanding (LO1 & LO2),Ops Strategy & Theory Application (Tasks 1 & 2),"Unparalleled investigation of operational functions with exceptional application of management theory. Demonstrates superlative, critical insights into how theory addresses complex operational challenges.",Sophisticated investigation of operational functions with outstanding application of management theory. Insightfully evaluates how theory addresses operational challenges with high precision.,Excellent investigation of operational functions with rigorous application of management theory. Systematically evaluates how theory addresses operational challenges.,Comprehensive investigation of operational functions with convincing application of management theory. Evaluates how theory addresses operational challenges with sustained analysis.,Reasonable investigation of operational functions with solid application of management theory. Clearly links theory to operational challenges with solid analytical depth.,Adequate investigation of operational functions with sufficient application of management theory. Satisfactorily links theory to operational challenges.,Simplistic investigation of operational functions with limited application of management theory. Weak description of challenges with limited theoretical depth.,Inaccurate investigation of operational functions with weak or missing application of theory. Confused understanding of operational challenges.,Understanding is irrelevant or incoherent. Application of theory is absent or unsubstantiated. The work is erroneous or poor.
Subject Specific Skills (LO3),Sustainability & Service Design (Task 3),"Unparalleled assessment of sustainability in the design of goods and services. Exceptionally synthesises design principles with environmental/social impact, offering unique perspectives.",Sophisticated assessment of sustainability in design. Insightfully evaluates the relationship between service design and sustainability with outstanding depth.,Excellent assessment of sustainability in design. Rigorously evaluates service design and sustainability with accomplished critical arguments.,Comprehensive assessment of sustainability in design. Convincingly evaluates service design and sustainability with sustained critical analysis.,Reasonable assessment of sustainability in design. Clearly evaluates service design and sustainability with solid critical analysis.,Adequate assessment of sustainability in design. Satisfactorily evaluates service design and sustainability.,Simplistic assessment of sustainability. Limited evaluation of service design with basic descriptive commentary.,Inaccurate assessment of sustainability. Weak link between service design and sustainability concepts.,Service Design principles are irrelevant or incoherent. Sustainability is absent or unsubstantiated. The work is erroneous or poor.
Strategic Thinking (LO4),Technology & Innovation (Tasks 4 & 5),"Unparalleled examination of technology's role with unique, visionary recommendations. Proposes innovative strategies that perfectly align with future operational trends.",Sophisticated examination of technology's role with outstanding recommendations. Proposes innovative strategies that insightfully align with operational best practices.,Excellent examination of technology's role with rigorous recommendations. Proposes creative strategies that align well with operational goals.,Comprehensive examination of technology's role with convincing recommendations. Proposes feasible strategies that align with operational goals.,Reasonable examination of technology's role with solid recommendations. Proposes practical strategies that align with general operational principles.,Adequate examination of technology's role with satisfactory recommendations. Proposes strategies with some relevance to operations.,Simplistic examination of technology. Proposes basic recommendations with limited creativity or relevance.,inadequate examination of technology. Proposes weak recommendations with no relevance to operations.,"Strategic thinking is irrelevant or incoherent. Proposals are absent or unsubstantiated. The work is erroneous, lacking, or poor."
Graduate Attribute (LO5),Social Intelligence & Inclusivity,Demonstrates unparalleled social intelligence. Navigates complex stakeholder relationships with exceptional sensitivity to diverse backgrounds and cultures.,Demonstrates sophisticated social intelligence. Navigates stakeholder relationships with outstanding inclusivity and cultural awareness.,Demonstrates excellent social intelligence. Navigates stakeholder relationships with accomplished inclusivity and cultural awareness.,Demonstrates comprehensive social intelligence. Navigates stakeholder relationships with sustained inclusivity.,Demonstrates reasonable social intelligence. Navigates stakeholder relationships with clear inclusivity.,Demonstrates adequate social intelligence. Shows sufficient awareness of inclusivity.,Demonstrates simplistic social intelligence. Limited consideration of inclusivity or stakeholders.,Demonstrates minimal  social intelligence. Confused approach to inclusivity.,Social intelligence is irrelevant or incoherent. Inclusivity is absent or unsubstantiated. The work is erroneous or poor.
Transferable Skills,Communication & Academic Standards,Unparalleled professional presentation (Report/Video) with exceptional  structure and   referencing. Demonstrates superlative academic voice.,Extensive presentation with sophisticated structure and  referencing showing outstanding use of sources. Demonstrates insightful argument development.,Excellent presentation with advanced   structure and referencing showing rigorous use of sources. Demonstrates original argument development.,Very good presentation with sustained   structure and referencing showing comprehensive use of sources. Demonstrates convincing argument development.,Good  presentation with sound  structure and sufficient referencing. Demonstrates solid  argument development.,Suitable presentation with satisfactory structure and referencing. Demonstrates acceptable argument development.,Unclear  presentation with inconsistent structure and unsatisfactory referencing problems. Demonstrates poor presentation.,Unsatisfactory standards. Major structural problems and missing referencing.,Communication is irrelevant or incoherent. Standards are absent or unsubstantiated. The work is erroneous.
`;

/**
 * Helper function to retry API calls with exponential backoff on 429 errors.
 */
async function callWithRetry<T>(operation: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    // Check for rate limit error codes (429)
    const isRateLimit = error?.status === 429 || error?.response?.status === 429 || error?.message?.includes('429') || error?.code === 429;
    
    if (retries > 0 && isRateLimit) {
      console.warn(`Quota exceeded. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callWithRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const getMentorGuidance = async (view: ViewState, currentNotes: string): Promise<string> => {
  if (view === ViewState.DASHBOARD || view === ViewState.HANDOVER) return "";

  let prompt = "";

  switch (view) {
    case ViewState.PMS:
      prompt = `
      The student is looking at the PMS (Property Management System).
      Scenario: A guest complained that check-in took 45 minutes.
      The data shows high occupancy but low staff during check-in peaks.
      Ask the student to apply "Lesson 9: Muda (Waste) vs Mura (Unevenness)" and "Little's Law" to explain the bottleneck.
      Student's current notes: "${currentNotes}"
      `;
      break;
    case ViewState.PHONE:
      prompt = `
      The student is answering the Phone.
      Scenario: Handling a live complaint about the wait time.
      Ask the student to reflect on "Lesson 5: Social Intelligence". How should they empathize without blaming staff?
      Student's current notes: "${currentNotes}"
      `;
      break;
    case ViewState.FOLDER:
      prompt = `
      The student is looking at the Green Folder (Sustainability).
      Scenario: Energy costs are up 15%. Single-use plastics are still in use.
      Ask the student to review "Lesson 3: Circular Economy" and "Lesson 4: Servicescape" regarding lighting and customer mood.
      Student's current notes: "${currentNotes}"
      `;
      break;
    case ViewState.TABLET:
      prompt = `
      The student is looking at the Tablet (Tech Stack).
      Scenario: A new "Mobile Key & AI Concierge" integration is available for $50k.
      Ask the student to justify this based on "Lesson 2: Service Strategy" (Cost Leadership vs Differentiation) and the "4Vs of Operations" (Visibility).
      Student's current notes: "${currentNotes}"
      `;
      break;
  }

  try {
    const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    }));
    return response.text || "I'm here to help. What do you observe?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The Mentor connection is currently offline due to high traffic. Please rely on your course notes.";
  }
};

export const getTheoryReminder = async (view: ViewState): Promise<string> => {
  if (view === ViewState.DASHBOARD || view === ViewState.HANDOVER) return "";

  let theories = "";
  switch (view) {
    case ViewState.PMS: theories = "Little's Law and Muda (Waste)"; break;
    case ViewState.PHONE: theories = "Social Intelligence and Emotional Labour"; break;
    case ViewState.FOLDER: theories = "The Triple Bottom Line and Circular Economy"; break;
    case ViewState.TABLET: theories = "4Vs of Operations (Visibility) and Competitive Strategy (Cost vs Differentiation)"; break;
  }

  const prompt = `
    Explain the following two concepts: ${theories}.
    Constraint: Use a maximum of 3 sentences total.
    Audience: A hospitality student needing a quick refresher.
  `;

  try {
    const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    }));
    return response.text || "Theory definitions unavailable.";
  } catch (error) {
    console.error("Gemini Theory Error:", error);
    return "Could not retrieve theory definitions due to connection limits.";
  }
};

export const getLogEntryFeedback = async (view: ViewState, content: string): Promise<string> => {
  if (!content || content.length < 10) return "Please write a more detailed analysis before submitting for evaluation.";
  if (view === ViewState.DASHBOARD || view === ViewState.HANDOVER) return "Feedback is available for specific operational tasks.";

  let context = "";
  switch (view) {
    case ViewState.PMS: context = "Context: PMS Analysis (Efficiency, Little's Law, Bottlenecks)."; break;
    case ViewState.PHONE: context = "Context: Social Intelligence & Guest Interaction."; break;
    case ViewState.FOLDER: context = "Context: Sustainability & Circular Economy."; break;
    case ViewState.TABLET: context = "Context: Technology Strategy & 4Vs of Operations."; break;
  }

  const prompt = `
    Acting as a Senior Hospitality Lecturer, evaluate this student's log entry.
    
    ${context}
    Student Entry: "${content}"
    
    Instructions:
    1. Check if they have correctly applied the relevant theories for this context.
    2. Provide constructive feedback.
    3. CONSTRAINT: The response MUST be exactly 2 sentences long.
  `;

  try {
    const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    }));
    return response.text || "Feedback currently unavailable.";
  } catch (error) {
    console.error("Gemini Feedback Error:", error);
    return "Could not generate feedback. Please try again in a moment.";
  }
};

export interface RubricFeedback {
  LO1_2: string;
  LO3: string;
  LO4: string;
  LO5: string;
  Transferable: string;
}

export const generateFinalReportFeedback = async (
  logbook: Record<ViewState, string>
): Promise<RubricFeedback> => {
  const combinedLog = `
    PMS Analysis (LO1/LO2): ${logbook[ViewState.PMS] || "No entry."}
    Social Intelligence (LO5): ${logbook[ViewState.PHONE] || "No entry."}
    Sustainability (LO3): ${logbook[ViewState.FOLDER] || "No entry."}
    Technology (LO4): ${logbook[ViewState.TABLET] || "No entry."}
  `;

  const prompt = `
    You are an expert Hospitality Management Mentor evaluating a student's draft assignment.

    Rubric Matrix for Learning Outcomes (LOs):
    ${RUBRIC_MATRIX}

    Student's Current Draft (Work Logs):
    ${combinedLog}

    Task:
    For each of the 5 criteria, provide specific, CONSTRUCTIVE ADVICE on how the student can IMPROVE their current answer to better meet the Learning Outcomes (aiming for the 'Outstanding' or 'Exceptional' level).
    
    Do not just evaluate what they wrote. Focus on what is missing or how they can deepen their theoretical application.

    Constraints:
    1. Maximum 3 sentences per criterion.
    2. Focus on "Feed-forward" (how to improve) rather than just feedback.
    3. Return the response as a JSON object with keys: "LO1_2", "LO3", "LO4", "LO5", "Transferable".
    4. "Transferable" refers to the quality of their writing/argumentation in the logs provided.
  `;

  try {
    const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    }));
    
    const text = response.text || "{}";
    const json = JSON.parse(text);
    
    return {
      LO1_2: json.LO1_2 || "Insufficient data for feedback.",
      LO3: json.LO3 || "Insufficient data for feedback.",
      LO4: json.LO4 || "Insufficient data for feedback.",
      LO5: json.LO5 || "Insufficient data for feedback.",
      Transferable: json.Transferable || "Insufficient data for feedback.",
    };
  } catch (error) {
    console.error("Gemini Report Error:", error);
    return {
      LO1_2: "Error generating feedback. Please try again later.",
      LO3: "Error generating feedback.",
      LO4: "Error generating feedback.",
      LO5: "Error generating feedback.",
      Transferable: "Error generating feedback.",
    };
  }
};
