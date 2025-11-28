import React from 'react';

export const TabletView: React.FC = () => {
  return (
    <div className="h-full bg-gray-800 flex items-center justify-center p-0 md:p-8">
      <div className="w-full max-w-4xl bg-black md:rounded-[30px] border-0 md:border-[14px] border-gray-700 shadow-2xl overflow-hidden relative h-full md:h-[90%] flex flex-col">
        {/* Tablet Status Bar */}
        <div className="h-8 bg-black text-white flex justify-between px-6 items-center text-xs shrink-0">
          <span>10:42 AM</span>
          <div className="flex gap-2">
            <span>Wi-Fi</span>
            <span>100%</span>
          </div>
        </div>

        {/* Tablet Content */}
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="bg-blue-600 p-8 text-white">
            <h2 className="text-3xl font-light">TechIntegration<span className="font-bold">Hub</span></h2>
            <p className="opacity-80">Available Upgrades & Capital Expenditure</p>
          </div>

          <div className="p-4 md:p-8">
            <div className="border rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="bg-indigo-50 p-6 border-b border-indigo-100 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                   <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">New Arrival</span>
                   <h3 className="text-2xl font-bold text-gray-800 mt-2">Mobile Key & AI Concierge</h3>
                </div>
                <div className="text-left md:text-right">
                    <p className="text-3xl font-bold text-gray-900">$50,000</p>
                    <p className="text-sm text-gray-500">Implementation Cost</p>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <h4 className="font-bold text-gray-700 mb-2">Features</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Keyless entry via Smartphone
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            24/7 AI Chatbot for guest requests
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Reduces Check-in time by 60%
                        </li>
                    </ul>
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-700 mb-2">Operational Impact</h4>
                     <p className="text-sm text-gray-600 leading-relaxed">
                         This technology shifts the service model from <span className="font-semibold text-indigo-600">High Touch</span> to <span className="font-semibold text-indigo-600">Low Touch</span>. 
                         Consider the impact on "Visibility" (4Vs). Will this alienate older demographics? Does it align with our luxury brand strategy?
                     </p>
                 </div>
              </div>
              <div className="bg-gray-50 p-4 text-center border-t border-gray-100 pb-20 md:pb-4">
                  <button className="text-blue-600 font-semibold hover:underline text-sm">Download Full Technical Specs (PDF)</button>
              </div>
            </div>
          </div>
        </div>

        {/* Home Bar indicator (Desktop only) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full hidden md:block"></div>
      </div>
    </div>
  );
};