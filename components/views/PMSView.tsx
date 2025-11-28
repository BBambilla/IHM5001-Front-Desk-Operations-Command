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
          borderColor: 'rgb(136, 132, 216)',
          backgroundColor: 'rgba(136, 132, 216, 0.5)',
          borderWidth: 3,
          data: [5, 12, 45, 30, 10],
          fill: false,
        },
        {
          label: 'Staff On Duty',
          borderColor: 'rgb(130, 202, 157)',
          backgroundColor: 'rgba(130, 202, 157, 0.5)',
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
          backgroundColor: 'rgb(59, 130, 246)',
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
    <div className="p-4 md:p-8 h-full bg-gray-100 text-gray-800 overflow-y-auto">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900">Property Management System</h2>
          <p className="text-gray-600">Module: Operational Analytics</p>
        </div>
        <div className="text-left md:text-right bg-white p-3 rounded shadow-sm border border-red-100 w-full md:w-auto">
          <div className="text-3xl md:text-4xl font-bold text-red-600">45 min</div>
          <div className="text-xs md:text-sm text-gray-500 uppercase">Avg Check-in Wait (Today)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
        {/* Chart 1: The Bottleneck */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-700">Process Flow Analysis</h3>
          <div className="w-full bg-gray-50 rounded flex items-center justify-center overflow-hidden">
             <img 
               src={`https://quickchart.io/chart?c=${bottleneckChartUrl}`} 
               alt="Line chart showing guest arrivals peaking at 14:00 while staff levels drop"
               className="w-full h-auto max-h-[300px] object-contain"
             />
          </div>
          <div className="mt-4 p-3 bg-red-50 text-red-800 text-sm rounded border border-red-200">
            <strong>Alert:</strong> Severe mismatch detected at 14:00. Processing capacity exceeded arrival demand significantly.
          </div>
        </div>

        {/* Chart 2: Hard Data */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-700">Revenue Management</h3>
          <div className="w-full bg-gray-50 rounded flex items-center justify-center overflow-hidden">
            <img 
               src={`https://quickchart.io/chart?c=${occupancyChartUrl}`} 
               alt="Bar chart showing increasing occupancy throughout the week"
               className="w-full h-auto max-h-[300px] object-contain"
             />
          </div>
        </div>
      </div>
    </div>
  );
};