import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { getTheoryReminder, getLogEntryFeedback } from '../services/geminiService';
import { jsPDF } from 'jspdf';

interface LogbookProps {
  currentView: ViewState;
  content: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  toggleOpen: () => void;
  studentId: string;
}

export const Logbook: React.FC<LogbookProps> = ({ currentView, content, onChange, isOpen, toggleOpen, studentId }) => {
  const [theoryHint, setTheoryHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  useEffect(() => {
    // Reset hints and feedback when view changes
    setTheoryHint(null);
    setFeedback(null);
  }, [currentView]);

  const handleGetHint = async () => {
    if (theoryHint) return;
    setLoadingHint(true);
    const hint = await getTheoryReminder(currentView);
    setTheoryHint(hint);
    setLoadingHint(false);
  };

  const handleSaveAndEvaluate = async () => {
    setLoadingFeedback(true);
    const result = await getLogEntryFeedback(currentView, content);
    setFeedback(result);
    setLoadingFeedback(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxLineWidth = pageWidth - margin * 2;
    let yPos = 20;

    // Header
    doc.setFontSize(18);
    doc.setTextColor(0, 32, 70); // Arden Navy
    doc.text(getHeader(), margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Student ID: ${studentId || 'N/A'}`, margin, yPos);
    yPos += 5;
    doc.text(`Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, margin, yPos);
    yPos += 15;

    // Student Entry
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Log Entry:", margin, yPos);
    yPos += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitContent = doc.splitTextToSize(content, maxLineWidth);
    doc.text(splitContent, margin, yPos);
    yPos += splitContent.length * 5 + 10;

    // Coach Feedback
    if (feedback) {
      // Draw a line
      doc.setDrawColor(0, 178, 169); // Arden Teal
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 178, 169); 
      doc.setFont("helvetica", "bold");
      doc.text("Operations Coach Feedback:", margin, yPos);
      yPos += 7;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(51, 63, 72); // Arden Grey
      const splitFeedback = doc.splitTextToSize(feedback, maxLineWidth);
      doc.text(splitFeedback, margin, yPos);
    }

    // Save
    const filename = `${currentView}_Feedback_${studentId}.pdf`;
    doc.save(filename);
  };

  const handleTextChange = (val: string) => {
    onChange(val);
    if (feedback) setFeedback(null);
  };

  const getHeader = () => {
    switch (currentView) {
      case ViewState.PMS: return "PMS Analysis: Efficiency & Flow";
      case ViewState.PHONE: return "Incident Log: Guest Interaction";
      case ViewState.FOLDER: return "Sustainability Report: Circular Economy";
      case ViewState.TABLET: return "Technology Assessment: Investment";
      case ViewState.HANDOVER: return "Shift Handover Log";
      default: return "General Shift Notes";
    }
  };

  const getPlaceholder = () => {
    switch (currentView) {
      case ViewState.PMS:
        return "Analyze the bottleneck here. Use Little's Law or identify Muda/Mura (Waste/Unevenness) to explain the delay and propose an operational improvement.";
      case ViewState.PHONE:
        return "Reflect on the call. How did you apply Social Intelligence? Answer the scenario questions or use theory to justify your response strategy.";
      case ViewState.FOLDER:
        return "Evaluate the audit data. Use the Triple Bottom Line or Circular Economy principles to propose specific sustainable improvements.";
      case ViewState.TABLET:
        return "Justify the investment. Answer the prompt using the 4Vs of Operations (Visibility) or Cost vs. Differentiation strategies.";
      default:
        return "Write your daily log here. You can answer the specific scenario questions or use theories (like Little's Law, Social Intelligence, etc.) to propose improvements.";
    }
  };

  const showActions = currentView !== ViewState.DASHBOARD && currentView !== ViewState.HANDOVER;

  return (
    <div 
      className={`fixed right-0 top-0 h-full bg-white text-gray-800 shadow-2xl transition-transform duration-300 z-50 flex flex-col w-full md:w-[600px] border-l-2 border-[#E6EBF4] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div 
        onClick={toggleOpen}
        className="absolute left-[-40px] top-1/2 -translate-y-1/2 bg-[#FDB913] p-4 rounded-l-lg shadow-lg cursor-pointer transform -rotate-90 origin-center w-32 flex justify-center border-l-4 border-[#002046] hidden md:flex"
      >
        <span className="font-bold text-[#002046] tracking-widest uppercase text-sm">Logbook</span>
      </div>

      {/* Mobile Toggle Button */}
      <button 
        onClick={toggleOpen}
        className="md:hidden absolute top-4 right-4 bg-[#E6EBF4] rounded-full p-2"
      >
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#002046]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="p-6 flex-1 flex flex-col font-serif overflow-y-auto">
        <h2 className="text-2xl font-bold mb-1 text-[#002046] border-b-2 border-[#FDB913] pb-2 mt-8 md:mt-0">
          Duty Log
        </h2>
        <p className="text-xs text-gray-500 mb-4 uppercase tracking-wide">Autosaving...</p>
        
        <label className="text-sm font-semibold text-[#333F48] mb-2 block">
          {getHeader()}
        </label>
        
        {showActions && (
          <div className="mb-4">
            {!theoryHint && !loadingHint && (
               <div className="mb-2">
                 <button 
                   onClick={handleGetHint}
                   className="text-xs bg-[#FDB913] hover:bg-[#e5a812] text-[#002046] px-3 py-1 rounded-full border border-[#d69e2e] transition-colors flex items-center gap-1 font-bold shadow-sm"
                 >
                   <span>💡</span> Theory Refresher
                 </button>
                 <p className="text-xs text-gray-400 mt-1 ml-1 italic">Click above to refresh your memory..</p>
               </div>
            )}
            
            {loadingHint && (
               <div className="text-xs text-[#00B2A9] italic animate-pulse">Retrieving theory definitions...</div>
            )}

            {theoryHint && (
              <div className="bg-[#E6EBF4] p-3 rounded-lg border border-[#00B2A9] shadow-sm relative animate-fade-in-down">
                <button 
                  onClick={() => setTheoryHint(null)}
                  className="absolute top-1 right-2 text-[#002046]/50 hover:text-[#002046]"
                >
                  ×
                </button>
                <div className="text-xs font-bold text-[#002046] mb-1 uppercase tracking-wide">Quick Theory Guide</div>
                <p className="text-sm text-[#333F48] leading-snug italic">
                  "{theoryHint}"
                </p>
              </div>
            )}
          </div>
        )}

        <textarea
          className="flex-1 w-full bg-[#f9fafb] bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] border border-gray-300 p-4 leading-8 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-[#00B2A9] resize-none rounded-md mb-4 text-[#333F48]"
          value={content}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={getPlaceholder()}
          style={{ lineHeight: '2rem' }}
        />

        {showActions && (
          <div className="mb-6">
            <button
              onClick={handleSaveAndEvaluate}
              disabled={loadingFeedback || !content}
              className={`w-full py-3 rounded font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                loadingFeedback || !content
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#00B2A9] hover:bg-[#009b93] text-white'
              }`}
            >
              {loadingFeedback ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Evaluating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Save & Evaluate
                </>
              )}
            </button>

            {feedback && (
              <div className="mt-4 bg-[#E6EBF4] border border-[#00B2A9] rounded-lg p-4 relative animate-fade-in-up">
                 <div className="flex justify-between items-start mb-2">
                   <div className="bg-[#00B2A9] text-white text-xs font-bold px-2 py-1 rounded uppercase">
                      Operations Coach Feedback
                   </div>
                   <button 
                    onClick={handleDownloadPDF}
                    className="text-xs bg-white hover:bg-gray-100 text-[#002046] border border-gray-300 px-2 py-1 rounded flex items-center gap-1 shadow-sm transition-colors"
                    title="Download Answer & Feedback as PDF"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                     PDF
                   </button>
                 </div>
                 <p className="text-[#333F48] text-sm italic leading-relaxed pt-1">
                   "{feedback}"
                 </p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-auto text-xs text-gray-400 text-center pb-8 md:pb-0">
          Front Desk Operations &bull; Student ID: {studentId || "Guest"}
        </div>
      </div>
    </div>
  );
};