import React from 'react';
import { ViewState } from '../types';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
  notifications: {
    phone: boolean;
    tablet: boolean;
    folder: boolean;
  }
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, notifications }) => {
  return (
    <div className="relative w-full h-full bg-cover bg-center overflow-y-auto md:overflow-hidden flex flex-col justify-end shadow-inner"
         style={{ 
           backgroundImage: "url('https://picsum.photos/id/405/1920/1080')", // Blurry office background
         }}
    >
      {/* Dark overlay for atmosphere */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm pointer-events-none fixed"></div>

      {/* Mobile Layout: Stacked List */}
      <div className="md:hidden relative z-10 p-6 flex flex-col gap-4 h-full overflow-y-auto">
         <div className="text-white mb-4">
            <h2 className="text-2xl font-serif font-bold text-yellow-500">My Desk</h2>
            <p className="text-xs text-gray-300">Select an item to begin work</p>
         </div>

         <div onClick={() => onNavigate(ViewState.PMS)} className="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500 shadow-lg flex items-center gap-4 active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-blue-900 rounded flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white">PMS System</h3>
              <p className="text-xs text-gray-400">View Occupancy & Staffing Data</p>
            </div>
         </div>

         <div onClick={() => onNavigate(ViewState.PHONE)} className="bg-gray-800 p-4 rounded-lg border-l-4 border-red-500 shadow-lg flex items-center gap-4 active:scale-95 transition-transform relative">
            {notifications.phone && <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>}
            <div className="w-12 h-12 bg-red-900 rounded flex items-center justify-center text-white">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white">Telephone</h3>
              <p className="text-xs text-gray-400">Handle Guest Complaints</p>
            </div>
         </div>

         <div onClick={() => onNavigate(ViewState.FOLDER)} className="bg-[#3e2723] p-4 rounded-lg border-l-4 border-[#d4c4a8] shadow-lg flex items-center gap-4 active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-[#5d4037] rounded flex items-center justify-center text-white">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white">Green Folder</h3>
              <p className="text-xs text-gray-400">Sustainability Reports</p>
            </div>
         </div>

         <div onClick={() => onNavigate(ViewState.TABLET)} className="bg-gray-900 p-4 rounded-lg border-l-4 border-gray-600 shadow-lg flex items-center gap-4 active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-white">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white">Tech Tablet</h3>
              <p className="text-xs text-gray-400">Review New Technology</p>
            </div>
         </div>
      </div>

      {/* Desktop Layout: The Desk Scene */}
      <div className="hidden md:flex relative h-1/3 w-full bg-[#3e2723] border-t-8 border-[#2d1b18] shadow-2xl items-end justify-around px-10 pb-10 z-10">
        
        {/* Wood Texture Overlay */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')"}}></div>

        {/* 1. PMS Monitor */}
        <div 
          onClick={() => onNavigate(ViewState.PMS)}
          className="relative group cursor-pointer transform hover:scale-105 transition-transform duration-300"
        >
          <div className="w-64 h-48 bg-gray-800 rounded-t-lg border-4 border-gray-700 shadow-xl flex items-center justify-center relative overflow-hidden">
             {/* Screen Content */}
             <div className="w-full h-full bg-blue-900 opacity-90 p-2 overflow-hidden flex flex-col">
                <div className="h-4 bg-gray-200 mb-1 w-full"></div>
                <div className="flex gap-1">
                   <div className="w-1/3 h-20 bg-gray-400"></div>
                   <div className="w-2/3 h-20 bg-gray-300"></div>
                </div>
                <div className="mt-2 text-[10px] text-green-400 font-mono">
                  > OCCUPANCY: 98%<br/>
                  > ERROR: QUEUE LIMIT
                </div>
             </div>
             {/* Screen Glare */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10 pointer-events-none"></div>
          </div>
          <div className="w-8 h-12 bg-gray-700 mx-auto"></div>
          <div className="w-24 h-4 bg-gray-700 mx-auto rounded-full"></div>
          
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
            PMS System (Hard Data)
          </div>
        </div>

        {/* 2. Phone */}
        <div 
          onClick={() => onNavigate(ViewState.PHONE)}
          className="relative group cursor-pointer transform hover:scale-105 transition-transform duration-300"
        >
          <div className="w-32 h-24 bg-gray-800 rounded-lg shadow-xl relative flex items-center justify-center">
             <div className="w-24 h-4 bg-gray-600 rounded mb-4"></div>
             {/* Notification Light */}
             {notifications.phone && (
               <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
             )}
             {notifications.phone && (
               <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full"></div>
             )}
             <div className="absolute bottom-0 w-full h-8 bg-gray-900 rounded-b-lg flex justify-center items-center gap-1 px-2">
                {[1,2,3,4].map(i => <div key={i} className="w-4 h-4 bg-gray-700 rounded-sm"></div>)}
             </div>
          </div>
          
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
            Answer Phone (Live Scenario)
          </div>
        </div>

        {/* 3. Green Folder */}
        <div 
          onClick={() => onNavigate(ViewState.FOLDER)}
          className="relative group cursor-pointer transform hover:scale-105 transition-transform duration-300 rotate-3"
        >
          <div className="w-40 h-52 bg-[#d4c4a8] rounded-r-lg border-l-4 border-[#b0a080] shadow-xl relative flex items-center justify-center">
             <div className="absolute top-0 right-0 w-12 h-12 bg-white/20 -rotate-45 transform translate-x-4 -translate-y-4"></div>
             <div className="text-[#5d4037] font-serif font-bold tracking-widest text-center opacity-70 rotate-90">
                SUSTAINABILITY<br/>AUDIT 2024
             </div>
             {notifications.folder && (
                <div className="absolute -top-2 -right-2 bg-yellow-300 text-yellow-900 text-xs font-bold px-2 py-1 shadow-md rotate-12">
                   URGENT
                </div>
             )}
          </div>

          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
            Review Folder (Sustainability)
          </div>
        </div>

        {/* 4. Tablet */}
        <div 
          onClick={() => onNavigate(ViewState.TABLET)}
          className="relative group cursor-pointer transform hover:scale-105 transition-transform duration-300"
        >
          <div className="w-36 h-48 bg-gray-900 rounded-lg border-4 border-gray-600 shadow-xl flex items-center justify-center relative">
             <div className="text-white/20 text-4xl font-thin">Pad</div>
             {notifications.tablet && (
               <div className="absolute inset-0 border-4 border-blue-500/50 animate-pulse rounded-lg"></div>
             )}
              {notifications.tablet && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded">
                 NEW TECH
               </div>
             )}
          </div>

          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
            Tech Stack (Innovation)
          </div>
        </div>

      </div>
      
      {/* Desk nameplate (Desktop Only) */}
      <div className="absolute bottom-10 left-10 z-20 hidden md:block">
         <div className="bg-gradient-to-r from-yellow-700 to-yellow-600 px-6 py-2 rounded shadow-lg border border-yellow-500">
             <span className="text-yellow-100 font-serif font-bold tracking-[0.2em] text-sm uppercase">Reception Manager</span>
         </div>
      </div>
    </div>
  );
};