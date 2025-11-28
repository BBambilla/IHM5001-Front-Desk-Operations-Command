import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { getTheoryReminder, getLogEntryFeedback } from '../services/geminiService';

interface LogbookProps {
  currentView: ViewState;
  content: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  toggleOpen: () => void;
}

export const Logbook: React.FC<LogbookProps> = ({ currentView, content, onChange, isOpen, toggleOpen }) => {
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

  const showActions = currentView !== ViewState.DASHBOARD && currentView !== ViewState.HANDOVER;

  return (
    <div 
      className={`fixed right-0 top-0 h-full bg-[#fdfbf7] text-gray-800 shadow-2xl transition-transform duration-300 z-50 flex flex-col w-full md:w-96 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div 
        onClick={toggleOpen}
        className="absolute left-[-40px] top-1/2 -translate-y-1/2 bg-[#fdfbf7] p-4 rounded-l-lg shadow-lg cursor-pointer transform -rotate-90 origin-center w-32 flex justify-center border-l-4 border-yellow-600 hidden md:flex"
      >
        <span className="font-bold text-yellow-800 tracking-widest uppercase text-sm">Logbook</span>
      </div>

      {/* Mobile Toggle Button (Visible only when closed, handled by parent usually, but here we need a close button inside) */}
      <button 
        onClick={toggleOpen}
        className="md:hidden absolute top-4 right-4 bg-gray-200 rounded-full p-2"
      >
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="p-6 flex-1 flex flex-col font-serif overflow-y-auto">
        <h2 className="text-2xl font-bold mb-1 text-yellow-900 border-b-2 border-yellow-600 pb-2 mt-8 md:mt-0">
          Duty Log
        </h2>
        <p className="text-xs text-gray-500 mb-4 uppercase tracking-wide">Autosaving...</p>
        
        <label className="text-sm font-semibold text-gray-600 mb-2 block">
          {getHeader()}
        </label>
        
        {showActions && (
          <div className="mb-4">
            {!theoryHint && !loadingHint && (
               <button 
                 onClick={handleGetHint}
                 className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full border border-yellow-300 transition-colors flex items-center gap-1 mb-2"
               >
                 <span>💡</span> Theory Refresher
               </button>
            )}
            
            {loadingHint && (
               <div className="text-xs text-gray-400 italic animate-pulse">Retrieving theory definitions...</div>
            )}

            {theoryHint && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 shadow-sm relative animate-fade-in-down">
                <button 
                  onClick={() => setTheoryHint(null)}
                  className="absolute top-1 right-2 text-yellow-800/50 hover:text-yellow-800"
                >
                  ×
                </button>
                <div className="text-xs font-bold text-yellow-800 mb-1 uppercase tracking-wide">Quick Theory Guide</div>
                <p className="text-sm text-gray-700 leading-snug italic">
                  "{theoryHint}"
                </p>
              </div>
            )}
          </div>
        )}

        <textarea
          className="flex-1 w-full bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] bg-white border border-gray-300 p-4 leading-8 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none rounded-md mb-4"
          value={content}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Enter your analysis here applying course theories..."
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
                  : 'bg-green-700 hover:bg-green-800 text-white'
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
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 relative animate-fade-in-up">
                 <div className="absolute -top-3 left-4 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded border border-green-200 uppercase">
                    Mentor Feedback
                 </div>
                 <p className="text-gray-800 text-sm italic leading-relaxed pt-2">
                   "{feedback}"
                 </p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-auto text-xs text-gray-400 text-center pb-8 md:pb-0">
          Front Desk Operations &bull; Student ID: ST-2024
        </div>
      </div>
    </div>
  );
};