import React, { useEffect, useState } from 'react';
import { ViewState } from '../types';
import { getMentorGuidance } from '../services/geminiService';

interface MentorPanelProps {
  currentView: ViewState;
  logContent: string;
}

export const MentorPanel: React.FC<MentorPanelProps> = ({ currentView, logContent }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Debounce the API call slightly to avoid thrashing if user switches views fast
    const fetchAdvice = async () => {
      if (currentView === ViewState.DASHBOARD || currentView === ViewState.HANDOVER) {
        setAdvice(null);
        return;
      }

      setLoading(true);
      // Automatically expand when new advice is loading/arrives so the user sees it
      setIsMinimized(false); 
      
      try {
        const text = await getMentorGuidance(currentView, logContent);
        if (isMounted) setAdvice(text);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAdvice();

    return () => { isMounted = false; };
  }, [currentView]); 

  if (!advice && !loading) return null;

  return (
    <div 
      className={`fixed left-0 w-full md:left-8 md:w-80 md:rounded-lg bg-black/90 backdrop-blur-md border-t md:border border-cyan-500/30 text-cyan-100 shadow-lg z-40 transition-all duration-300 animate-fade-in-up ${
        isMinimized 
          ? 'bottom-0 h-12 overflow-hidden cursor-pointer hover:bg-black' 
          : 'bottom-0 md:bottom-8 p-4'
      }`}
      onClick={() => isMinimized && setIsMinimized(false)}
    >
      <div className={`flex items-center justify-between ${isMinimized ? 'h-full px-4' : 'mb-2 border-b border-cyan-500/30 pb-2'}`}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-cyan-400'}`}></div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">AI Operations Mentor</span>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(!isMinimized);
          }}
          className="text-cyan-500 hover:text-white transition-colors p-1"
          aria-label={isMinimized ? "Expand" : "Minimize"}
        >
          {isMinimized ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {!isMinimized && (
        <div className="text-sm leading-relaxed min-h-[40px] max-h-[150px] overflow-y-auto">
          {loading ? (
            <span className="flex items-center gap-2 text-cyan-500">
              Analyzing operational context...
            </span>
          ) : (
            advice
          )}
        </div>
      )}
    </div>
  );
};