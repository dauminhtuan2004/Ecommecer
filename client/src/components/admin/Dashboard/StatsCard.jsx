// src/components/admin/Dashboard/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">{icon}</div>
    </div>
    <p className="text-sm text-green-600 mt-2">{trend}</p>
  </div>
);

export default StatsCard;