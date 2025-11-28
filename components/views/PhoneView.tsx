import React from 'react';

export const PhoneView: React.FC = () => {
  return (
    <div className="p-8 h-full bg-gray-900 text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black opacity-50"></div>
      
      <div className="w-full max-w-lg z-10">
        <div className="bg-black border border-gray-700 rounded-3xl p-8 shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl"></div>
          
          <div className="text-center mb-8 mt-4">
            <div className="w-20 h-20 bg-red-500 rounded-full mx-auto flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.6)]">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mt-4">Incoming Call: Room 402</h2>
            <p className="text-red-400 font-mono">00:24</p>
          </div>

          <div className="space-y-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700 mb-6">
            <p className="text-gray-300 italic">"I've been a loyalty member for 5 years. Standing in that lobby for 45 minutes while your staff chatted was unacceptable. I missed my dinner reservation!"</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
               Apologize & Compensate
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
               Explain Staff Shortage
            </button>
          </div>
          
          <div className="mt-6 text-xs text-center text-gray-500">
            *Interaction requires Social Intelligence evaluation in Logbook
          </div>
        </div>
      </div>
    </div>
  );
};
