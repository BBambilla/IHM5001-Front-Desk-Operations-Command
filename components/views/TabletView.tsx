import React, { useState } from 'react';

export const TabletView: React.FC = () => {
  const [showSpecs, setShowSpecs] = useState(false);

  return (
    <div className="h-full bg-[#002046] flex items-center justify-center p-0 md:p-8">
      <div className="w-full max-w-4xl bg-black md:rounded-[30px] border-0 md:border-[14px] border-gray-800 shadow-2xl overflow-hidden relative h-full md:h-[90%] flex flex-col">
        {/* Tablet Status Bar */}
        <div className="h-8 bg-black text-white flex justify-between px-6 items-center text-xs shrink-0">
          <span>10:42 AM</span>
          <div className="flex gap-2">
            <span>Wi-Fi</span>
            <span>100%</span>
          </div>
        </div>

        {/* Tablet Content */}
        <div className="flex-1 bg-white overflow-y-auto scroll-smooth">
          <div className="bg-[#00B2A9] p-8 text-white">
            <h2 className="text-3xl font-light">TechIntegration<span className="font-bold">Hub</span></h2>
            <p className="opacity-90">Available Upgrades & Capital Expenditure</p>
          </div>

          <div className="p-4 md:p-8">
            <div className="border rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="bg-[#E6EBF4] p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                   <span className="bg-[#002046] text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">New Arrival</span>
                   <h3 className="text-2xl font-bold text-[#002046] mt-2">Mobile Key & AI Concierge</h3>
                </div>
                <div className="text-left md:text-right">
                    <p className="text-3xl font-bold text-[#333F48]">$50,000</p>
                    <p className="text-sm text-gray-500">Implementation Cost</p>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <h4 className="font-bold text-[#333F48] mb-2">Features</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#00B2A9]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Keyless entry via Smartphone
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#00B2A9]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            24/7 AI Chatbot for guest requests
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#00B2A9]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Reduces Check-in time by 60%
                        </li>
                    </ul>
                 </div>
                 <div>
                    <h4 className="font-bold text-[#333F48] mb-2">Operational Impact</h4>
                     <p className="text-sm text-gray-600 leading-relaxed">
                         This technology shifts the service model from <span className="font-semibold text-[#002046]">High Touch</span> to <span className="font-semibold text-[#002046]">Low Touch</span>. 
                         Consider the impact on "Visibility" (4Vs). Will this alienate older demographics? Does it align with our luxury brand strategy?
                     </p>
                 </div>
              </div>

              {/* Toggle Button */}
              <div className="bg-[#E6EBF4] p-4 text-center border-t border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => setShowSpecs(!showSpecs)}>
                  <button className="text-[#002046] font-semibold hover:underline text-sm flex items-center justify-center gap-2 w-full outline-none">
                    {showSpecs ? 'Hide Technical Specs' : 'See Full Technical Specs'}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-transform ${showSpecs ? 'rotate-180' : ''}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
              </div>

              {/* Full Specs Section */}
              {showSpecs && (
                <div className="bg-slate-50 p-6 md:p-8 border-t border-gray-200 animate-fade-in-up">
                    <div className="mb-6 flex items-center justify-between border-b border-gray-300 pb-2">
                        <h3 className="font-bold text-lg text-[#002046]">Technical Specifications: Model MK-AI-2024</h3>
                        <span className="text-xs font-mono text-gray-500">REV: 2.1</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-sm">
                        <div>
                            <h5 className="font-bold text-[#333F48] uppercase tracking-wide text-xs mb-2">System Compatibility</h5>
                            <ul className="space-y-1 text-gray-600">
                                <li>• Opera PMS V5.0+ (Oracle Hospitality)</li>
                                <li>• Amadeus Property Management</li>
                                <li>• Salesforce CRM Connector included</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h5 className="font-bold text-[#333F48] uppercase tracking-wide text-xs mb-2">Security & Compliance</h5>
                            <ul className="space-y-1 text-gray-600">
                                <li>• AES-256 Bit Encryption (Military Grade)</li>
                                <li>• GDPR & CCPA Compliant Data Handling</li>
                                <li>• ISO 27001 Certified Data Centers</li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-bold text-[#333F48] uppercase tracking-wide text-xs mb-2">Hardware Requirements</h5>
                            <ul className="space-y-1 text-gray-600">
                                <li>• Bluetooth Low Energy (BLE) 5.0 Door Locks</li>
                                <li>• NFC Reader (Optional for Backup Keycards)</li>
                                <li>• Cloud-Based Server (No On-Premise required)</li>
                            </ul>
                        </div>

                         <div>
                            <h5 className="font-bold text-[#333F48] uppercase tracking-wide text-xs mb-2">Service Level Agreement</h5>
                            <ul className="space-y-1 text-gray-600">
                                <li>• 99.99% Uptime Guarantee</li>
                                <li>• 24/7 Global Technical Support</li>
                                <li>• Quarterly Over-the-Air (OTA) Updates</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-[#FDB913]/10 border border-[#FDB913] rounded text-xs text-[#002046]">
                        <strong>Note:</strong> Full integration requires a 2-week downtime for the legacy keycard system during the transition period. Please factor this into the Operational Strategy analysis.
                    </div>
                </div>
              )}
            </div>
          </div>
          
           {/* Bottom padding for mobile scrolling */}
           <div className="h-20 md:h-0"></div>
        </div>

        {/* Home Bar indicator (Desktop only) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full hidden md:block"></div>
      </div>
    </div>
  );
};