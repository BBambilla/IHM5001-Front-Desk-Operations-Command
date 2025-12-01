import React, { useEffect, useState } from 'react';
import { ViewState } from '../types';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
  notifications: {
    phone: boolean;
    tablet: boolean;
    folder: boolean;
  };
  logbook: Record<string, string>;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, notifications, logbook }) => {
  const [currentInstruction, setCurrentInstruction] = useState(0);
  
  // New specific instructions for the GM role
  const instructions = [
    "You are the General Manager of IHM5001 Hotel.",
    "You have 4 critical tasks to complete before your shift ends.",
    "Hover over items to see your mission. Click to begin."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInstruction(prev => (prev + 1) % instructions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getProgress = (view: ViewState) => {
    const content = logbook[view] || "";
    if (content.length > 50) return 100; // Completed
    if (content.length > 5) return 30; // In Progress
    return 0; // Not Started
  };

  const tasks = [ViewState.PMS, ViewState.PHONE, ViewState.TABLET, ViewState.FOLDER];
  const completedTasks = tasks.filter(t => getProgress(t) === 100).length;
  const totalTasks = tasks.length;
  const isAllComplete = completedTasks === totalTasks;

  const renderProgressBar = (view: ViewState, isMobile = false) => {
    const progress = getProgress(view);
    let color = "bg-gray-400";
    if (progress === 100) color = "bg-[#00B2A9]"; // Teal
    else if (progress === 30) color = "bg-[#FDB913]"; // Yellow

    return (
      <div className={`flex flex-col items-center gap-1 ${isMobile ? 'w-full mt-2' : 'mt-2'}`}>
         {!isMobile && <span className="text-[10px] font-bold text-[#E6EBF4] uppercase tracking-wider">{progress}% Complete</span>}
         <div className={`h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600 shadow-inner ${isMobile ? 'w-full' : 'w-32'}`}>
            <div 
              className={`h-full ${color} transition-all duration-1000 ease-out`} 
              style={{ width: `${progress}%` }}
            ></div>
         </div>
         {isMobile && <span className="text-[10px] font-bold text-gray-400 text-right w-full">{progress}%</span>}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full bg-[#E6EBF4] overflow-hidden flex flex-col items-center shadow-inner font-sans">
      
      {/* --- INSTRUCTION BAR --- */}
      <div className="w-full bg-[#002046] text-[#FDB913] py-3 px-6 flex items-center justify-between z-50 shadow-md border-b-4 border-[#FDB913] relative">
         <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-[#FDB913] flex items-center justify-center border-2 border-white shadow-lg shrink-0">
               <span className="text-2xl">👔</span>
            </div>
            <div>
               <h2 className="text-[#E6EBF4] font-bold text-lg leading-tight">General Manager Duty</h2>
               <p className="font-mono text-sm tracking-wide text-[#FDB913] animate-fade-in-up key={currentInstruction}">
                  {instructions[currentInstruction]}
               </p>
            </div>
         </div>
         
         {/* Completion Trigger */}
         {isAllComplete ? (
            <div className="flex-1 flex justify-center">
               <button 
                 onClick={() => onNavigate(ViewState.HANDOVER)}
                 className="bg-[#00B2A9] hover:bg-[#009b93] text-white px-6 py-2 rounded-full text-sm font-bold uppercase shadow-[0_0_15px_rgba(0,178,169,0.8)] animate-pulse border-2 border-white flex items-center gap-2 transform hover:scale-105 transition-transform"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                 Shift Complete: Download Report
               </button>
            </div>
         ) : (
            <div className="flex-1 flex justify-end md:justify-center items-center gap-3">
               <span className="text-xs text-white uppercase tracking-wider hidden md:inline font-bold">Shift Progress:</span>
               <div className="w-48 h-4 bg-gray-700 rounded-full border border-gray-500 shadow-inner">
                  <div className="h-full bg-gradient-to-r from-[#FDB913] to-[#e5a812]" style={{ width: `${(completedTasks / totalTasks) * 100}%`, transition: 'width 1s' }}></div>
               </div>
               <span className="text-sm text-[#FDB913] font-mono font-bold">{completedTasks}/{totalTasks}</span>
            </div>
         )}

         <div className="hidden md:flex items-center gap-4 text-xs text-[#E6EBF4] opacity-80 font-mono flex-1 justify-end">
            <span>SHIFT: 14:00 - 22:00</span>
            <span className="bg-green-500 text-white px-2 py-0.5 rounded animate-pulse">LIVE</span>
         </div>
      </div>

      {/* --- MOBILE LAYOUT (List View) --- */}
      <div className="md:hidden relative z-10 w-full h-full p-6 flex flex-col gap-4 overflow-y-auto bg-[#002046]">
         <div className="text-white mb-4 text-center">
            <h2 className="text-2xl font-serif font-bold text-[#FDB913] tracking-widest">COMMAND CENTER</h2>
            <p className="text-xs text-[#E6EBF4]">Select an operational unit</p>
         </div>

         <div onClick={() => onNavigate(ViewState.PMS)} className="bg-[#002d56] p-4 rounded-xl border-l-4 border-[#00B2A9] shadow-lg active:scale-95 transition-transform">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-[#00B2A9]/20 rounded-full flex items-center justify-center text-[#00B2A9]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white">PMS Monitor</h3>
                  <p className="text-xs text-[#E6EBF4] opacity-70">Lesson 6 & 9: Lean Ops & Capacity (LO1/LO2)</p>
                </div>
            </div>
            {renderProgressBar(ViewState.PMS, true)}
         </div>

         <div onClick={() => onNavigate(ViewState.PHONE)} className="bg-[#002d56] p-4 rounded-xl border-l-4 border-[#FDB913] shadow-lg active:scale-95 transition-transform relative overflow-hidden">
            {notifications.phone && <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 animate-ping rounded-full -mr-1 -mt-1"></div>}
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-[#FDB913]/20 rounded-full flex items-center justify-center text-[#FDB913]">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white">Telephone</h3>
                  <p className="text-xs text-[#E6EBF4] opacity-70">Lesson 5 & 8: Service Quality (LO5)</p>
                </div>
            </div>
            {renderProgressBar(ViewState.PHONE, true)}
         </div>

         <div onClick={() => onNavigate(ViewState.TABLET)} className="bg-[#002d56] p-4 rounded-xl border-l-4 border-indigo-400 shadow-lg active:scale-95 transition-transform">
             <div className="flex items-center gap-4 mb-2">
                 <div className="w-12 h-12 bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-300">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white">Tech Tablet</h3>
                  <p className="text-xs text-[#E6EBF4] opacity-70">Lesson 2 & 3: Innovation (LO4)</p>
                </div>
            </div>
            {renderProgressBar(ViewState.TABLET, true)}
         </div>

         <div onClick={() => onNavigate(ViewState.FOLDER)} className="bg-[#002d56] p-4 rounded-xl border-l-4 border-[#333F48] shadow-lg active:scale-95 transition-transform">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center text-gray-300">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white">Green Folder</h3>
                  <p className="text-xs text-[#E6EBF4] opacity-70">Lesson 3 & 7: Sustainability (LO3)</p>
                </div>
            </div>
            {renderProgressBar(ViewState.FOLDER, true)}
         </div>
      </div>

      {/* --- DESKTOP LAYOUT (Cartoon Desk Scene) --- */}
      <div className="hidden md:flex flex-col w-full h-full relative">
        {/* WALL DECOR */}
        {/* Wall Background - Blue Grey */}
        <div className="absolute inset-0 bg-[#E6EBF4]"></div>
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#002046 2px, transparent 2px)", backgroundSize: "30px 30px" }}></div>
        
        {/* Lighting Vignette */}
        <div className="absolute inset-0 pointer-events-none z-30" style={{ background: "radial-gradient(circle at 50% 60%, transparent 20%, rgba(0, 32, 70, 0.2) 100%)" }}></div>

        {/* Hotel Sign */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-0">
          <div className="bg-[#002046] text-[#FDB913] px-16 py-4 rounded-lg shadow-xl border-4 border-[#FDB913] transform hover:scale-105 transition-transform cursor-default relative overflow-hidden">
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-[shimmer_3s_infinite]"></div>
            <h1 className="text-5xl font-serif font-bold tracking-[0.3em] drop-shadow-md">HOTEL</h1>
          </div>
        </div>

        {/* Clocks */}
        <div className="absolute top-12 right-12 flex gap-8">
          {['London', 'New York', 'Tokyo'].map((city, i) => (
            <div key={city} className="flex flex-col items-center gap-2 group">
              <div className="w-20 h-20 bg-white rounded-full border-[6px] border-[#002046] relative shadow-lg group-hover:scale-110 transition-transform">
                  <div className="absolute top-1/2 left-1/2 w-1.5 h-7 bg-black origin-bottom -translate-x-1/2 -translate-y-full transform" style={{ transform: `translateX(-50%) translateY(-100%) rotate(${i * 45}deg)`}}></div>
                  <div className="absolute top-1/2 left-1/2 w-1.5 h-5 bg-black origin-bottom -translate-x-1/2 -translate-y-full transform" style={{ transform: `translateX(-50%) translateY(-100%) rotate(${i * 90 + 30}deg)`}}></div>
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#FDB913] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <span className="text-[#002046] font-bold text-xs uppercase bg-white/80 px-2 py-1 rounded shadow-sm tracking-wider">{city}</span>
            </div>
          ))}
        </div>

        {/* REMOVED: Plant (Right Side) */}

        {/* DESK AREA */}
        <div className="mt-auto w-full relative z-10 flex flex-col items-center">
          
          {/* Desk Items Container - INCREASED SIZES & SPACING */}
          <div className="w-full max-w-7xl px-12 pb-6 flex items-end justify-center gap-16 relative z-20">
            
            {/* 1. PMS MONITOR (Left) - SCALED UP */}
            <div onClick={() => onNavigate(ViewState.PMS)} className="group cursor-pointer flex flex-col items-center relative transform hover:-translate-y-4 transition-transform duration-300">
               <div className="relative z-10 transform scale-125 origin-bottom">
                  {/* Screen */}
                  <div className="w-64 h-44 bg-gray-800 rounded-t-lg border-[6px] border-gray-700 shadow-xl overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#002046] to-black opacity-90"></div>
                      {/* Fake UI */}
                      <div className="absolute top-4 left-4 w-3/4 h-2 bg-gray-500 rounded opacity-50"></div>
                      <div className="absolute top-8 left-4 w-1/2 h-2 bg-gray-600 rounded opacity-50"></div>
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#00B2A9]/20 rounded-tl-full"></div>
                      {/* Graph */}
                      <div className="absolute bottom-4 left-4 right-4 h-12 flex items-end justify-between gap-1">
                          <div className="w-1/5 h-1/3 bg-[#00B2A9] rounded-t-sm"></div>
                          <div className="w-1/5 h-2/3 bg-[#00B2A9] rounded-t-sm"></div>
                          <div className="w-1/5 h-full bg-[#FDB913] rounded-t-sm animate-pulse"></div>
                          <div className="w-1/5 h-1/2 bg-[#00B2A9] rounded-t-sm"></div>
                      </div>
                  </div>
                  {/* Stand */}
                  <div className="w-16 h-10 bg-gray-700 mx-auto"></div>
                  <div className="w-32 h-4 bg-gray-700 mx-auto rounded-full shadow-lg"></div>
               </div>
               
               {/* Visible Label & Progress Bar */}
               <div className="mt-4 bg-[#002046] text-[#E6EBF4] px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-wider border-2 border-[#00B2A9] shadow-md z-30 flex flex-col items-center pb-2">
                 <span>PMS Monitor</span>
                 {renderProgressBar(ViewState.PMS)}
               </div>

               {/* Details Tooltip */}
               <div className="absolute -top-32 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-[#002046] rounded-xl font-bold text-sm shadow-xl border-2 border-[#E6EBF4] transform translate-y-4 group-hover:translate-y-0 w-64 text-center pointer-events-none z-50 overflow-hidden">
                  <div className="bg-[#E6EBF4] px-3 py-1 uppercase tracking-wider text-xs text-[#002046] border-b border-gray-200 font-bold">Lesson 6 & 9</div>
                  <div className="p-3 leading-tight text-gray-700 font-normal">
                    <p className="font-bold text-[#00B2A9] mb-1">LO1 & LO2</p>
                    Capacity Mgmt & Lean Operations Analysis
                  </div>
               </div>
            </div>

            {/* 2. TABLET (Center-Left) - SCALED UP */}
            <div onClick={() => onNavigate(ViewState.TABLET)} className="group cursor-pointer flex flex-col items-center relative transform hover:-translate-y-4 transition-transform duration-300">
                <div className="relative z-10 transform scale-125 origin-bottom">
                    <div className="w-36 h-48 bg-gray-900 rounded-xl border-4 border-gray-800 shadow-2xl transform rotate-3 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#002046] to-[#00152e]"></div>
                        <div className="text-white/20 font-bold text-4xl">Ai</div>
                        {notifications.tablet && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-[#00B2A9] rounded-full animate-ping"></div>
                        )}
                    </div>
                    {/* Stand leg */}
                    <div className="absolute bottom-2 right-2 w-2 h-16 bg-black transform rotate-12 -z-10 origin-top opacity-50"></div>
                </div>

               {/* Visible Label & Progress Bar */}
               <div className="mt-4 bg-[#002046] text-[#E6EBF4] px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-wider border-2 border-[#00B2A9] shadow-md z-30 flex flex-col items-center pb-2">
                 <span>Tech Tablet</span>
                 {renderProgressBar(ViewState.TABLET)}
               </div>

                {/* Details Tooltip */}
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-[#002046] rounded-xl font-bold text-sm shadow-xl border-2 border-[#E6EBF4] transform translate-y-4 group-hover:translate-y-0 w-64 text-center pointer-events-none z-50 overflow-hidden">
                   <div className="bg-[#E6EBF4] px-3 py-1 uppercase tracking-wider text-xs text-[#002046] border-b border-gray-200 font-bold">Lesson 2 & 3</div>
                   <div className="p-3 leading-tight text-gray-700 font-normal">
                     <p className="font-bold text-[#00B2A9] mb-1">LO4: Strategy</p>
                     Service Innovation & Technology Assessment
                   </div>
               </div>
            </div>

            {/* 3. PHONE (Center-Right) - SCALED UP */}
            <div onClick={() => onNavigate(ViewState.PHONE)} className="group cursor-pointer flex flex-col items-center relative transform hover:-translate-y-4 transition-transform duration-300">
               <div className="relative z-10 transform scale-125 origin-bottom">
                   <div className="w-44 h-28 bg-gray-800 rounded-lg shadow-2xl relative flex items-end justify-center pb-2 z-10">
                      {/* Handset */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-52 h-14 bg-gray-700 rounded-full shadow-md border-b-4 border-gray-900 flex items-center justify-center">
                         <div className="w-36 h-3 bg-gray-800 rounded-full opacity-30"></div>
                      </div>
                      {/* Cord */}
                      <div className="absolute -right-8 top-0 w-12 h-24 border-r-8 border-b-8 border-gray-900 rounded-full opacity-80 -z-10"></div>
                      {/* Keypad */}
                      <div className="grid grid-cols-3 gap-2 p-2 bg-gray-900 rounded">
                          {[...Array(9)].map((_, i) => <div key={i} className="w-2 h-2 bg-gray-600 rounded-full"></div>)}
                      </div>
                      {notifications.phone && (
                         <div className="absolute -top-10 right-0 bg-[#FDB913] text-[#002046] text-xs font-bold px-2 py-1 rounded-full animate-bounce shadow-lg border border-white z-20">
                            CALLING
                         </div>
                      )}
                   </div>
               </div>

               {/* Visible Label & Progress Bar */}
               <div className="mt-4 bg-[#002046] text-[#E6EBF4] px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-wider border-2 border-[#00B2A9] shadow-md z-30 flex flex-col items-center pb-2">
                 <span>Phone</span>
                 {renderProgressBar(ViewState.PHONE)}
               </div>

                {/* Details Tooltip */}
               <div className="absolute -top-32 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-[#002046] rounded-xl font-bold text-sm shadow-xl border-2 border-[#E6EBF4] transform translate-y-4 group-hover:translate-y-0 w-64 text-center pointer-events-none z-50 overflow-hidden">
                  <div className="bg-[#E6EBF4] px-3 py-1 uppercase tracking-wider text-xs text-[#002046] border-b border-gray-200 font-bold">Lesson 5 & 8</div>
                  <div className="p-3 leading-tight text-gray-700 font-normal">
                    <p className="font-bold text-[#00B2A9] mb-1">LO5: Social Intel</p>
                    Customer Experience & Service Quality
                  </div>
               </div>
            </div>

            {/* 4. FOLDER (Right) - SCALED UP */}
            <div onClick={() => onNavigate(ViewState.FOLDER)} className="group cursor-pointer flex flex-col items-center relative transform hover:-translate-y-4 transition-transform duration-300">
                <div className="relative z-10 transform scale-125 origin-bottom">
                    <div className="relative w-44 h-28">
                       {/* Stack effect */}
                       <div className="absolute bottom-0 left-0 w-44 h-32 bg-white shadow-sm border border-gray-200 transform rotate-2 rounded-sm"></div>
                       <div className="absolute bottom-1 left-0 w-44 h-32 bg-white shadow-sm border border-gray-200 transform -rotate-1 rounded-sm"></div>
                       {/* Main Folder - Dark Grey */}
                       <div className="absolute bottom-2 left-0 w-44 h-32 bg-[#333F48] shadow-xl border-l-8 border-[#1f2937] transform rotate-0 rounded-r-lg flex items-center justify-center overflow-hidden">
                           <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 transform rotate-45 translate-x-6 -translate-y-6"></div>
                           <div className="text-white/80 font-serif font-bold tracking-wider text-sm border-2 border-white/30 p-2 rounded">
                             ECO LOG
                           </div>
                       </div>
                       {notifications.folder && (
                         <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#00B2A9] rounded-full border-2 border-white shadow-sm z-20 animate-pulse"></div>
                       )}
                    </div>
                </div>

               {/* Visible Label & Progress Bar */}
               <div className="mt-4 bg-[#002046] text-[#E6EBF4] px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-wider border-2 border-[#00B2A9] shadow-md z-30 flex flex-col items-center pb-2">
                 <span>Green Folder</span>
                 {renderProgressBar(ViewState.FOLDER)}
               </div>

                {/* Details Tooltip */}
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-[#002046] rounded-xl font-bold text-sm shadow-xl border-2 border-[#E6EBF4] transform translate-y-4 group-hover:translate-y-0 w-64 text-center pointer-events-none z-50 overflow-hidden">
                  <div className="bg-[#E6EBF4] px-3 py-1 uppercase tracking-wider text-xs text-[#002046] border-b border-gray-200 font-bold">Lesson 3 & 7</div>
                  <div className="p-3 leading-tight text-gray-700 font-normal">
                    <p className="font-bold text-[#00B2A9] mb-1">LO3: Sustainabilty</p>
                    Circular Economy & Supply Chain
                  </div>
               </div>
            </div>

            {/* REMOVED: Desk Lamp */}

          </div>

          {/* The Desk Surface - Arden Grey Wood */}
          <div className="w-full h-32 bg-[#333F48] relative rounded-t-[50px] shadow-2xl flex items-center justify-center border-t-[12px] border-[#2D3748] z-20">
             {/* Nameplate */}
             <div className="bg-gradient-to-b from-[#FDB913] to-[#d69e2e] px-10 py-3 rounded shadow-lg border-2 border-[#b7791f] transform -translate-y-4 relative z-30">
               <span className="text-[#002046] font-serif font-bold tracking-[0.3em] text-lg uppercase drop-shadow-sm">Reception</span>
             </div>
             {/* Decorative Desk Lines */}
             <div className="absolute top-0 left-20 bottom-0 w-1 bg-black/10"></div>
             <div className="absolute top-0 right-20 bottom-0 w-1 bg-black/10"></div>
          </div>
          
        </div>

      </div>
    </div>
  );
}