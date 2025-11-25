// src/components/admin/Dashboard/SalesChart.jsx
import React from 'react';

const SalesChart = () => (
  <div className="h-64 bg-gray-50 rounded p-4">
    {/* Placeholder cho chart */}
    <p className="text-center text-gray-500">Sales Chart (Integrate Recharts or Chart.js)</p>
    <div className="mt-4 space-y-1">
      <div className="flex justify-between text-sm">
        <span>Jan</span><span className="text-indigo-600 font-medium">$10k</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Feb</span><span className="text-indigo-600 font-medium">$15k</span>
      </div>
      {/* ... more bars */}
    </div>
  </div>
);

export default SalesChart;