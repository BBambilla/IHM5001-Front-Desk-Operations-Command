import React from 'react';

export const PMSView: React.FC = () => {
  // We use QuickChart.io to generate static images of the charts based on the scenario data.
  // This satisfies the requirement to "make the graphs images".
  
  const bottleneckChartUrl = encodeURI(JSON.stringify({
    type: 'line',
    data: {
      labels: ['12:00', '13:00', '14:00', '15:00', '16:00'],
      datasets: [
        {
          label: 'Guest Arrivals',
          borderColor: 'rgb(0, 32, 70)', // Arden Navy
          backgroundColor: 'rgba(0, 32, 70, 0.5)',
          borderWidth: 3,
          data: [5, 12, 45, 30, 10],
          fill: false,
        },
        {
          label: 'Staff On Duty',
          borderColor: 'rgb(0, 178, 169)', // Arden Teal
          backgroundColor: 'rgba(0, 178, 169, 0.5)',
          borderWidth: 3,
          data: [3, 3, 2, 3, 4],
          steppedLine: true,
          fill: false,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'Efficiency Analysis: Arrivals vs Staffing',
      },
      scales: {
        yAxes: [
          {
            id: 'y',
            type: 'linear',
            position: 'left',
            ticks: { beginAtZero: true }
          },
          {
            id: 'y1',
            type: 'linear',
            position: 'right',
            ticks: { beginAtZero: true, max: 10 }
          }
        ]
      }
    },
  }));

  const occupancyChartUrl = encodeURI(JSON.stringify({
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [
        {
          label: 'Occupancy %',
          backgroundColor: 'rgb(0, 32, 70)', // Arden Navy
          data: [65, 70, 85, 92, 98],
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'Weekly Occupancy Trends',
      },
      scales: {
        yAxes: [{ ticks: { beginAtZero: true, max: 100 } }]
      }
    },
  }));

  return (
    <div className="p-4 md:p-8 h-full bg-[#E6EBF4] text-[#002046] overflow-y-scroll pb-32">
      {/* Header Grid: Title Left, Stat Center, Spacer Right */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-3 items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-[#002046]">Property Management System</h2>
          <p className="text-[#333F48]">Module: Operational Analytics</p>
        </div>
        
        <div className="flex justify-center">
            <div className="bg-white p-6 px-10 rounded-2xl shadow-2xl border border-red-100 flex flex-col items-center relative transform transition-transform hover:scale-105">
                {/* Live Warning Badge */}
                <div className="absolute -top-4 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-2 z-10">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    Live Warning
                </div>
                
                <div className="text-5xl md:text-6xl font-black text-red-600 tracking-tight mt-2">45 min</div>
                <div className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Avg Check-in Wait</div>
            </div>
        </div>

        <div className="hidden md:block"></div> {/* Spacer for grid balance */}
      </div>

      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        {/* Chart 1: The Bottleneck */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full">
          <h3 className="text-lg font-bold mb-4 text-[#002046]">Process Flow Analysis</h3>
          <div className="w-full bg-gray-50 rounded flex items-center justify-center overflow-hidden">
             <img 
               src={`https://quickchart.io/chart?c=${bottleneckChartUrl}`} 
               alt="Line chart showing guest arrivals peaking at 14:00 while staff levels drop"
               className="w-full h-auto max-h-[400px] object-contain"
             />
          </div>
          <div className="mt-4 p-3 bg-red-50 text-red-800 text-sm rounded border border-red-200 flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <strong>Alert:</strong> Severe mismatch detected at 14:00. Processing capacity exceeded arrival demand significantly.
          </div>
        </div>

        {/* Chart 2: Hard Data */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full">
          <h3 className="text-lg font-bold mb-4 text-[#002046]">Revenue Management</h3>
          <div className="w-full bg-gray-50 rounded flex items-center justify-center overflow-hidden">
            <img 
               src={`https://quickchart.io/chart?c=${occupancyChartUrl}`} 
               alt="Bar chart showing increasing occupancy throughout the week"
               className="w-full h-auto max-h-[400px] object-contain"
             />
          </div>
        </div>
      </div>
    </div>
  );
};