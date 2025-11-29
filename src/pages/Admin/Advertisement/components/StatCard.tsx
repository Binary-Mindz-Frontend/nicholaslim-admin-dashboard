import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
}) => (
  <div className="bg-white rounded-xl shadow-md p-4 flex-1 min-w-[200px] transition-shadow hover:shadow-lg border-2 ">
    <div className="flex justify-between items-start">
      <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
      <div className={`p-2 border border-gray-300 rounded-lg text-lg ${color}`}>
        {icon}
      </div>
    </div>
    <div className="text-xl font-bold text-gray-900 mb-1">{value}</div>
    <p className="text-base font-medium text-green-500">{change}</p>
  </div>
);
