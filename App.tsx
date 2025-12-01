import React, { useState } from 'react';
import { ViewState, INITIAL_LOGBOOK_STATE, AppState, SurveyResponse } from './types';
import { Dashboard } from './components/Dashboard';
import { Logbook } from './components/Logbook';
import { MentorPanel } from './components/MentorPanel';
import { Survey } from './components/Survey';
import { PMSView } from './components/views/PMSView';
import { PhoneView } from './components/views/PhoneView';
import { TabletView } from './components/views/TabletView';
import { FolderView } from './components/views/FolderView';
import { generateFinalReportFeedback, RubricFeedback } from './services/geminiService';

const STORAGE_BASE_KEY = 'front-desk-ops-state-';

export default function App() {
  // We keep studentId separate from main state initially to control the login flow
  const [studentIdInput, setStudentIdInput] = useState("");
  
  const [state, setState] = useState<AppState>({
    studentId: "",
    view: ViewState.DASHBOARD,
    logbook: INITIAL_LOGBOOK_STATE,
    shiftStarted: false,
    notifications: {
      phone: true,
      tablet: true,
      folder: true,
    },
    surveyData: null
  });

  const [isLogbookOpen, setIsLogbookOpen] = useState(false);
  const [reportFeedback, setReportFeedback] = useState<RubricFeedback | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // Load from LocalStorage only when Shift Starts (based on ID)
  const loadState = (id: string) => {
    const key = `${STORAGE_BASE_KEY}${id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          studentId: id,
          logbook: parsed.logbook || INITIAL_LOGBOOK_STATE,
          shiftStarted: true,
          surveyData: parsed.surveyData || null,
          view: ViewState.DASHBOARD // Always start at dashboard
        }));
      } catch (e) {
        console.error("Failed to load save state");
        // Fallback to fresh start if corrupted
        setState(prev => ({ ...prev, studentId: id, shiftStarted: true }));
      }
    } else {
      // New user/session
      setState(prev => ({ ...prev, studentId: id, shiftStarted: true }));
    }
  };

  // Handover (Save) logic
  const handleHandover = () => {
    const key = `${STORAGE_BASE_KEY}${state.studentId}`;
    localStorage.setItem(key, JSON.stringify(state));
    setState(prev => ({ ...prev, view: ViewState.HANDOVER }));
    setReportFeedback(null); // Reset report if they go back and forth
  };

  const handleStartShift = () => {
    if (!studentIdInput.trim()) {
      alert("Please enter your Student ID.");
      return;
    }
    loadState(studentIdInput.trim());
  };

  const handleNavigate = (view: ViewState) => {
    setState(prev => ({ ...prev, view }));
    // Open logbook automatically when entering a task view for better UX
    if (view !== ViewState.DASHBOARD) {
      setIsLogbookOpen(true);
    }
  };

  const updateLogbook = (content: string) => {
    setState(prev => ({
      ...prev,
      logbook: {
        ...prev.logbook,
        [prev.view]: content
      }
    }));
  };

  const handleSurveySubmit = (data: SurveyResponse) => {
    setState(prev => {
      const newState = { ...prev, surveyData: data };
      // Save immediately so we don't lose it
      const key = `${STORAGE_BASE_KEY}${prev.studentId}`;
      localStorage.setItem(key, JSON.stringify(newState));
      return newState;
    });
  };

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    const feedback = await generateFinalReportFeedback(state.logbook);
    setReportFeedback(feedback);
    setLoadingReport(false);
  };

  const handleDownloadWordDoc = () => {
    if (!reportFeedback) return;

    const surveySection = state.surveyData ? `
      <hr/>
      <h2 style="color: #002046;">Part 3: Student Reflection Survey</h2>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; border-color: #ddd;">
        <tr><td style="background:#eee;">1. Strategic Thinking (Map Check)</td><td>${state.surveyData.strategicThinking}/5</td></tr>
        <tr><td style="background:#eee;">2. Epistemic Vigilance (Depth Check)</td><td>${state.surveyData.epistemicVigilance}/5</td></tr>
        <tr><td style="background:#eee;">3. Intellectual Autonomy (Pilot Check)</td><td>${state.surveyData.intellectualAutonomy}/5</td></tr>
        <tr><td style="background:#eee;">4. Perceived Usefulness (Value Check)</td><td>${state.surveyData.perceivedUsefulness}/5</td></tr>
        <tr><td style="background:#eee;">5. Perceived Ease of Use (Friction Check)</td><td>${state.surveyData.perceivedEaseOfUse}/5</td></tr>
      </table>
      
      <h4 style="color: #00B2A9;">6. Reflection on Constraints</h4>
      <p style="white-space: pre-wrap; background: #E6EBF4; padding: 10px;">${state.surveyData.reflectionConstraint}</p>
      
      <h4 style="color: #00B2A9;">7. Student Experience</h4>
      <p style="white-space: pre-wrap; background: #E6EBF4; padding: 10px;">${state.surveyData.studentExperience}</p>
    ` : '';

    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Assessment Report</title></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="color: #002046;">Front Desk Operations: Assessment Report</h1>
        <p><strong>Student ID:</strong> ${state.studentId}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <hr/>
        
        <h2 style="color: #002046;">Part 1: Scenario Analysis Logs</h2>
        
        <h3 style="color: #00B2A9;">PMS Analysis (Lean Operations)</h3>
        <p style="white-space: pre-wrap; background: #E6EBF4; padding: 10px;">${state.logbook[ViewState.PMS] || "No entry recorded."}</p>
        
        <h3 style="color: #00B2A9;">Social Intelligence (Guest Incident)</h3>
        <p style="white-space: pre-wrap; background: #E6EBF4; padding: 10px;">${state.logbook[ViewState.PHONE] || "No entry recorded."}</p>
        
        <h3 style="color: #00B2A9;">Sustainability Audit (Circular Economy)</h3>
        <p style="white-space: pre-wrap; background: #E6EBF4; padding: 10px;">${state.logbook[ViewState.FOLDER] || "No entry recorded."}</p>
        
        <h3 style="color: #00B2A9;">Technology Integration (Strategy)</h3>
        <p style="white-space: pre-wrap; background: #E6EBF4; padding: 10px;">${state.logbook[ViewState.TABLET] || "No entry recorded."}</p>
        
        <hr/>
        <h2 style="color: #002046;">Part 2: Learning Outcome Feedback</h2>
        <p><em>Based on assignment rubric. This is qualitative feedback only.</em></p>

        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; border-color: #333F48;">
          <tr>
            <td style="background: #E6EBF4; font-weight: bold; width: 30%; color: #002046;">LO1 & LO2: Knowledge & Understanding</td>
            <td>${reportFeedback.LO1_2}</td>
          </tr>
          <tr>
            <td style="background: #E6EBF4; font-weight: bold; color: #002046;">LO3: Subject Specific Skills (Sustainability)</td>
            <td>${reportFeedback.LO3}</td>
          </tr>
          <tr>
            <td style="background: #E6EBF4; font-weight: bold; color: #002046;">LO4: Strategic Thinking (Tech)</td>
            <td>${reportFeedback.LO4}</td>
          </tr>
          <tr>
            <td style="background: #E6EBF4; font-weight: bold; color: #002046;">LO5: Social Intelligence (Graduate Attribute)</td>
            <td>${reportFeedback.LO5}</td>
          </tr>
          <tr>
             <td style="background: #E6EBF4; font-weight: bold; color: #002046;">Transferable Skills (Communication)</td>
            <td>${reportFeedback.Transferable}</td>
          </tr>
        </table>

        ${surveySection}
      </body>
      </html>
    `;

    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Assessment_Report_${state.studentId}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadClassData = () => {
    const keys = Object.keys(localStorage);
    const rows = [['Student ID', 'Q1: Strategy', 'Q2: Vigilance', 'Q3: Autonomy', 'Q4: Usefulness', 'Q5: EaseOfUse', 'Q6: Reflection', 'Q7: Experience']];
    
    keys.forEach(key => {
      if (key.startsWith(STORAGE_BASE_KEY)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}');
          if (item.surveyData) {
            const s = item.surveyData;
            rows.push([
              item.studentId, 
              s.strategicThinking, 
              s.epistemicVigilance, 
              s.intellectualAutonomy, 
              s.perceivedUsefulness, 
              s.perceivedEaseOfUse, 
              `"${s.reflectionConstraint.replace(/"/g, '""')}"`, // Escape quotes for CSV
              `"${s.studentExperience.replace(/"/g, '""')}"`
            ]);
          }
        } catch (e) { console.error("Skip corrupted", key); }
      }
    });

    const csvContent = "data:text/csv;charset=utf-8," 
        + rows.map(e => e.join(",")).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Class_Survey_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render current view content
  const renderContent = () => {
    switch (state.view) {
      case ViewState.PMS: return <PMSView />;
      case ViewState.PHONE: return <PhoneView />;
      case ViewState.TABLET: return <TabletView />;
      case ViewState.FOLDER: return <FolderView />;
      case ViewState.HANDOVER: 
        return (
          <div className="h-full flex flex-col items-center justify-start bg-[#002046] text-white p-8 overflow-y-auto">
            <div className="max-w-4xl w-full text-center space-y-6">
              <h1 className="text-4xl font-bold text-[#00B2A9]">Shift Handover & Assessment</h1>
              
              {!state.surveyData ? (
                <Survey onSubmit={handleSurveySubmit} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left animate-fade-in-up">
                  <div className="bg-[#002d56] p-6 rounded-lg max-h-96 overflow-y-auto border border-[#00B2A9]/30">
                    <h3 className="text-[#E6EBF4] text-sm uppercase mb-4 sticky top-0 bg-[#002d56] pb-2 border-b border-[#00B2A9]/30">Your Entries</h3>
                    {Object.entries(state.logbook).map(([key, val]) => (
                      (key !== ViewState.DASHBOARD && key !== ViewState.HANDOVER) && (
                        <div key={key} className="mb-4 pb-4 border-b border-[#00B2A9]/20 last:border-0">
                          <span className="text-[#FDB913] font-bold text-xs uppercase block mb-1">{key}</span>
                          <p className="text-[#E6EBF4] text-sm">{val || <span className="text-gray-400 italic">No entry provided.</span>}</p>
                        </div>
                      )
                    ))}
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="bg-[#002d56] p-6 rounded-lg border border-[#00B2A9]/30 flex-1">
                       <h3 className="text-[#E6EBF4] text-sm uppercase mb-4">Assessment Center</h3>
                       {!reportFeedback ? (
                         <div className="text-center py-8">
                           <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-2 rounded mb-6 text-sm">
                             ✅ Survey Completed. You may now generate your report.
                           </div>
                           <p className="mb-6 text-[#E6EBF4]">Ready to evaluate your performance against the Learning Outcomes?</p>
                           <button 
                             onClick={handleGenerateReport}
                             disabled={loadingReport}
                             className="bg-[#00B2A9] hover:bg-[#009b93] text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all w-full flex items-center justify-center gap-2"
                           >
                             {loadingReport ? (
                               <>
                                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                 </svg>
                                 Analyzing Performance...
                               </>
                             ) : (
                               "Generate Feedback Report"
                             )}
                           </button>
                         </div>
                       ) : (
                         <div className="space-y-4 animate-fade-in-up">
                           <div className="bg-[#00B2A9]/20 p-4 rounded border border-[#00B2A9]">
                             <h4 className="font-bold text-[#00B2A9] mb-2">Feedback Ready</h4>
                             <p className="text-sm text-[#E6EBF4] mb-4">Your report has been generated based on the assignment rubric and includes your survey results.</p>
                             <button 
                                onClick={handleDownloadWordDoc}
                                className="bg-[#FDB913] hover:bg-[#e5a812] text-[#002046] px-4 py-2 rounded font-bold w-full flex items-center justify-center gap-2"
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                Download Report (.doc)
                             </button>
                           </div>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8">
                 <button 
                  onClick={() => handleNavigate(ViewState.DASHBOARD)}
                  className="text-[#E6EBF4] hover:text-[#00B2A9] underline text-sm"
                >
                  Return to Desk (Keep Working)
                </button>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  // Login Screen
  if (!state.shiftStarted) {
    return (
      <div className="h-screen w-full bg-[#002046] flex items-center justify-center relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#002046] via-[#002046]/80 to-transparent"></div>

        <div className="bg-[#002d56]/90 backdrop-blur-md border border-[#00B2A9]/30 p-10 rounded-2xl shadow-2xl max-w-md w-full text-center relative z-10">
          <h1 className="text-4xl font-serif font-bold text-white mb-2 tracking-wider">FRONT DESK</h1>
          <p className="text-[#00B2A9] mb-8 uppercase tracking-[0.3em] text-xs">Operations Command Simulation</p>
          
          <div className="space-y-6">
            <div className="text-left bg-[#00152e] p-4 rounded-lg border-l-4 border-[#FDB913]">
               <p className="text-[#FDB913] text-xs font-bold uppercase mb-1">Instruction</p>
               <p className="text-[#E6EBF4] text-sm leading-relaxed">
                 Complete all scenarios. Once finished, you will complete a mandatory survey to unlock your <strong>Feedback Report</strong>.
               </p>
            </div>

            <div>
              <label className="block text-left text-xs font-bold text-white uppercase mb-2 ml-1">Student Identification</label>
              <input 
                type="text"
                placeholder="Enter Student ID (e.g. ST-2024)"
                value={studentIdInput}
                onChange={(e) => setStudentIdInput(e.target.value)}
                className="w-full bg-white/90 border-0 rounded p-4 text-[#002046] placeholder-gray-500 font-bold focus:ring-2 focus:ring-[#00B2A9] outline-none"
              />
              <p className="text-left text-xs text-[#E6EBF4] mt-2 ml-1 opacity-70">
                *Entering your ID retrieves your previous session.
              </p>
            </div>

            <button 
              onClick={handleStartShift}
              className="w-full bg-[#00B2A9] hover:bg-[#009b93] text-white py-4 rounded font-bold shadow-lg transition-transform transform active:scale-95 tracking-wide"
            >
              START SHIFT
            </button>
            
            <button 
              onClick={handleDownloadClassData}
              className="w-full mt-4 text-[#E6EBF4] text-xs underline opacity-50 hover:opacity-100 uppercase tracking-widest"
            >
              Admin: Download Class Data (CSV)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#002046] flex flex-col">
      {/* Top Bar */}
      <div className="h-12 bg-[#002046] text-white flex justify-between items-center px-6 z-50 shadow-md border-b border-[#00B2A9]/30">
        <div className="font-serif font-bold tracking-wider flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00B2A9] animate-pulse"></div>
          FRONT DESK OPS
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#E6EBF4] uppercase tracking-widest hidden md:block">ID: {state.studentId}</span>
          {state.view !== ViewState.DASHBOARD && (
            <button 
              onClick={() => handleNavigate(ViewState.DASHBOARD)}
              className="text-xs uppercase hover:text-[#FDB913] transition-colors"
            >
              ← Back to Desk
            </button>
          )}
          <button 
            onClick={handleHandover}
            className="bg-[#FDB913] hover:bg-[#e5a812] text-[#002046] px-3 py-1 rounded text-xs font-bold uppercase transition-colors"
          >
            End Shift
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden bg-[#E6EBF4]">
        {state.view === ViewState.DASHBOARD ? (
          <Dashboard 
            onNavigate={handleNavigate} 
            notifications={state.notifications} 
            logbook={state.logbook} // Pass logbook for progress tracking
          />
        ) : (
          <div className="w-full h-full relative">
             {/* The specific view content */}
             {renderContent()}
             
             {/* Overlay Controls (Hidden in Handover view) */}
             {state.view !== ViewState.HANDOVER && (
               <div className="absolute top-4 left-4 z-40">
                  <button 
                    onClick={() => handleNavigate(ViewState.DASHBOARD)}
                    className="bg-[#002046]/90 text-white px-4 py-2 rounded-full backdrop-blur hover:bg-black transition-colors flex items-center gap-2 text-sm shadow-lg border border-[#00B2A9]/50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                    Return to Command Center
                  </button>
               </div>
             )}
          </div>
        )}

        {/* The Logbook (Always rendered, slides in/out) */}
        <Logbook 
          currentView={state.view} 
          content={state.logbook[state.view] || ""}
          onChange={updateLogbook}
          isOpen={isLogbookOpen}
          toggleOpen={() => setIsLogbookOpen(!isLogbookOpen)}
          studentId={state.studentId}
        />

        {/* The AI Mentor Panel */}
        <MentorPanel 
          currentView={state.view}
          logContent={state.logbook[state.view] || ""}
        />
      </div>
    </div>
  );
}