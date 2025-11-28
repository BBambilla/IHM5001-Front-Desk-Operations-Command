import React from 'react';

export const FolderView: React.FC = () => {
  return (
    <div className="p-8 h-full bg-[#f3e5ab] text-gray-900 overflow-y-auto font-serif">
      <div className="max-w-3xl mx-auto bg-white shadow-xl p-12 min-h-full border border-gray-300 relative">
        {/* Paper texture effect */}
        <div className="absolute top-0 right-0 p-4">
           <div className="bg-red-100 text-red-800 border border-red-300 px-3 py-1 text-sm font-bold rotate-12 shadow-sm">
             CONFIDENTIAL
           </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 border-b-4 border-green-700 pb-2">Sustainability Audit Report</h1>
        <div className="flex justify-between text-sm text-gray-500 mb-8">
          <span>Date: Oct 2023</span>
          <span>Dept: Facilities & Environment</span>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-bold text-green-800 mb-3">1. Energy Consumption Analysis</h3>
            <p className="leading-relaxed">
              Energy audits indicate a <strong className="text-red-600">15% increase</strong> in kWh usage compared to Q3 2022. 
              Primary drivers identified:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Lobby HVAC inefficiencies due to automatic door failures.</li>
              <li>Incandescent lighting still in use in 40% of guest rooms.</li>
              <li>24/7 lighting in back-of-house corridors regardless of occupancy.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-green-800 mb-3">2. Waste Stream (Circular Economy Gap)</h3>
            <div className="bg-gray-50 p-4 border-l-4 border-gray-400 italic">
              "Current single-use plastic amenity bottles account for 300kg of landfill waste monthly."
            </div>
            <p className="mt-2 leading-relaxed">
              <strong>Proposal pending:</strong> Switch to bulk dispensers (refillable). 
              Initial capital expenditure is high, but ROI estimated at 14 months.
              Supply chain concerns regarding local sourcing for organic soaps.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-green-800 mb-3">3. Servicescape Audit</h3>
            <p className="leading-relaxed">
              Current harsh fluorescent lighting in the lobby correlates with increased guest agitation during wait times. 
              <strong>Recommendation:</strong> Implement warm-spectrum LED retrofit to influence customer mood (Lesson 4).
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300 flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold border-2 border-green-800">
                C-
            </div>
            <div>
                <p className="font-bold">Current Environmental Score</p>
                <p className="text-sm text-gray-600">Action required immediately to meet 2024 targets.</p>
            </div>
        </div>
      </div>
    </div>
  );
};
