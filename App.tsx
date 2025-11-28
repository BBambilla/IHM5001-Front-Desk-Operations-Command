import React, { useState } from 'react';
import { ViewState, INITIAL_LOGBOOK_STATE, AppState } from './types';
import { Dashboard } from './components/Dashboard';
import { Logbook } from './components/Logbook';
import { MentorPanel } from './components/MentorPanel';
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
    }
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

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    const feedback = await generateFinalReportFeedback(state.logbook);
    setReportFeedback(feedback);
    setLoadingReport(false);
  };

  const handleDownloadWordDoc = () => {
    if (!reportFeedback) return;

    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Assessment Report</title></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="color: #2c3e50;">Front Desk Operations: Assessment Report</h1>
        <p><strong>Student ID:</strong> ${state.studentId}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <hr/>
        
        <h2 style="color: #2c3e50;">Part 1: Scenario Analysis Logs</h2>
        
        <h3>PMS Analysis (Lean Operations)</h3>
        <p style="white-space: pre-wrap; background: #f8f9fa; padding: 10px;">${state.logbook[ViewState.PMS] || "No entry recorded."}</p>
        
        <h3>Social Intelligence (Guest Incident)</h3>
        <p style="white-space: pre-wrap; background: #f8f9fa; padding: 10px;">${state.logbook[ViewState.PHONE] || "No entry recorded."}</p>
        
        <h3>Sustainability Audit (Circular Economy)</h3>
        <p style="white-space: pre-wrap; background: #f8f9fa; padding: 10px;">${state.logbook[ViewState.FOLDER] || "No entry recorded."}</p>
        
        <h3>Technology Integration (Strategy)</h3>
        <p style="white-space: pre-wrap; background: #f8f9fa; padding: 10px;">${state.logbook[ViewState.TABLET] || "No entry recorded."}</p>
        
        <hr/>
        <h2 style="color: #2c3e50;">Part 2: Learning Outcome Feedback</h2>
        <p><em>Based on assignment rubric. This is qualitative feedback only.</em></p>

        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="background: #e2e8f0; font-weight: bold; width: 30%;">LO1 & LO2: Knowledge & Understanding</td>
            <td>${reportFeedback.LO1_2}</td>
          </tr>
          <tr>
            <td style="background: #e2e8f0; font-weight: bold;">LO3: Subject Specific Skills (Sustainability)</td>
            <td>${reportFeedback.LO3}</td>
          </tr>
          <tr>
            <td style="background: #e2e8f0; font-weight: bold;">LO4: Strategic Thinking (Tech)</td>
            <td>${reportFeedback.LO4}</td>
          </tr>
          <tr>
            <td style="background: #e2e8f0; font-weight: bold;">LO5: Social Intelligence (Graduate Attribute)</td>
            <td>${reportFeedback.LO5}</td>
          </tr>
          <tr>
             <td style="background: #e2e8f0; font-weight: bold;">Transferable Skills (Communication)</td>
            <td>${reportFeedback.Transferable}</td>
          </tr>
        </table>
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

  // Render current view content
  const renderContent = () => {
    switch (state.view) {
      case ViewState.PMS: return <PMSView />;
      case ViewState.PHONE: return <PhoneView />;
      case ViewState.TABLET: return <TabletView />;
      case ViewState.FOLDER: return <FolderView />;
      case ViewState.HANDOVER: 
        return (
          <div className="h-full flex flex-col items-center justify-start bg-gray-900 text-white p-8 overflow-y-auto">
            <div className="max-w-4xl w-full text-center space-y-6">
              <h1 className="text-4xl font-bold text-green-400">Shift Handover & Assessment</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="bg-gray-800 p-6 rounded-lg max-h-96 overflow-y-auto border border-gray-700">
                  <h3 className="text-gray-400 text-sm uppercase mb-4 sticky top-0 bg-gray-800 pb-2 border-b border-gray-700">Your Entries</h3>
                  {Object.entries(state.logbook).map(([key, val]) => (
                    (key !== ViewState.DASHBOARD && key !== ViewState.HANDOVER) && (
                      <div key={key} className="mb-4 pb-4 border-b border-gray-700/50 last:border-0">
                        <span className="text-yellow-500 font-bold text-xs uppercase block mb-1">{key}</span>
                        <p className="text-gray-300 text-sm">{val || <span className="text-gray-600 italic">No entry provided.</span>}</p>
                      </div>
                    )
                  ))}
                </div>

                <div className="flex flex-col gap-4">
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex-1">
                     <h3 className="text-gray-400 text-sm uppercase mb-4">Assessment Center</h3>
                     {!reportFeedback ? (
                       <div className="text-center py-8">
                         <p className="mb-6 text-gray-300">Ready to evaluate your performance against the Learning Outcomes?</p>
                         <button 
                           onClick={handleGenerateReport}
                           disabled={loadingReport}
                           className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all w-full flex items-center justify-center gap-2"
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
                         <div className="bg-green-900/30 p-4 rounded border border-green-800">
                           <h4 className="font-bold text-green-400 mb-2">Feedback Ready</h4>
                           <p className="text-sm text-gray-300 mb-4">Your report has been generated based on the assignment rubric.</p>
                           <button 
                              onClick={handleDownloadWordDoc}
                              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold w-full flex items-center justify-center gap-2"
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

              <div className="mt-8">
                 <button 
                  onClick={() => handleNavigate(ViewState.DASHBOARD)}
                  className="text-gray-400 hover:text-white underline text-sm"
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
      <div className="h-screen w-full bg-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-2xl shadow-2xl max-w-md w-full text-center relative z-10">
          <h1 className="text-4xl font-serif font-bold text-white mb-2 tracking-wider">FRONT DESK</h1>
          <p className="text-blue-200 mb-8 uppercase tracking-[0.3em] text-xs">Operations Command Simulation</p>
          
          <div className="space-y-6">
            <div className="text-left bg-black/40 p-4 rounded-lg border-l-4 border-yellow-500">
               <p className="text-yellow-100 text-xs font-bold uppercase mb-1">Instruction</p>
               <p className="text-gray-300 text-sm leading-relaxed">
                 Complete all scenarios (PMS, Phone, Sustainability, Tablet). 
                 Once finished, you can <strong>generate a Feedback Report</strong> assessing your work against the official Learning Outcomes.
               </p>
            </div>

            <div>
              <label className="block text-left text-xs font-bold text-white uppercase mb-2 ml-1">Student Identification</label>
              <input 
                type="text"
                placeholder="Enter Student ID (e.g. ST-2024)"
                value={studentIdInput}
                onChange={(e) => setStudentIdInput(e.target.value)}
                className="w-full bg-white/90 border-0 rounded p-4 text-gray-900 placeholder-gray-500 font-bold focus:ring-2 focus:ring-yellow-500 outline-none"
              />
              <p className="text-left text-xs text-gray-400 mt-2 ml-1">
                *Entering your ID retrieves your previous session.
              </p>
            </div>

            <button 
              onClick={handleStartShift}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-4 rounded font-bold shadow-lg transition-transform transform active:scale-95"
            >
              START SHIFT
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="h-12 bg-gray-900 text-white flex justify-between items-center px-6 z-50 shadow-md border-b border-gray-800">
        <div className="font-serif font-bold tracking-wider flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          FRONT DESK OPS
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 uppercase tracking-widest hidden md:block">ID: {state.studentId}</span>
          {state.view !== ViewState.DASHBOARD && (
            <button 
              onClick={() => handleNavigate(ViewState.DASHBOARD)}
              className="text-xs uppercase hover:text-yellow-400 transition-colors"
            >
              ← Back to Desk
            </button>
          )}
          <button 
            onClick={handleHandover}
            className="bg-red-900/50 hover:bg-red-800 border border-red-800 text-red-100 px-3 py-1 rounded text-xs font-bold uppercase transition-colors"
          >
            End Shift
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {state.view === ViewState.DASHBOARD ? (
          <Dashboard onNavigate={handleNavigate} notifications={state.notifications} />
        ) : (
          <div className="w-full h-full relative">
             {/* The specific view content */}
             {renderContent()}
             
             {/* Overlay Controls (Hidden in Handover view) */}
             {state.view !== ViewState.HANDOVER && (
               <div className="absolute top-4 left-4 z-40">
                  <button 
                    onClick={() => handleNavigate(ViewState.DASHBOARD)}
                    className="bg-gray-900/80 text-white px-4 py-2 rounded-full backdrop-blur hover:bg-black transition-colors flex items-center gap-2 text-sm shadow-lg border border-gray-700"
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