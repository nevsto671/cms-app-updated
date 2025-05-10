import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DepartmentData {
  name: string;
  amount: number;
  percentage: number;
}

const mockData: DepartmentData[] = [
  { name: 'Department of Defense', amount: 1200000000, percentage: 35 },
  { name: 'Department of Health', amount: 750000000, percentage: 22 },
  { name: 'General Services Admin', amount: 620000000, percentage: 18 },
  { name: 'Homeland Security', amount: 520000000, percentage: 15 },
  { name: 'Veterans Affairs', amount: 340000000, percentage: 10 }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const RoutingAnalytics: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState('NAICS Codes');
  const [selectedCode, setSelectedCode] = useState('541512 - Computer Systems Design Services');
  const [selectedYear, setSelectedYear] = useState('FY 2024');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Classification Routing Analytics</h2>
        <p className="text-gray-600">Analyze how different classification codes route to government agencies and contractors</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className="border border-gray-200 rounded-lg p-2"
          value={selectedSystem}
          onChange={(e) => setSelectedSystem(e.target.value)}
        >
          <option>NAICS Codes</option>
          <option>PSC Codes</option>
          <option>SIC Codes</option>
        </select>

        <select
          className="border border-gray-200 rounded-lg p-2"
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
        >
          <option>541512 - Computer Systems Design Services</option>
          <option>541513 - Computer Facilities Management</option>
          <option>541519 - Other Computer Related Services</option>
        </select>

        <select
          className="border border-gray-200 rounded-lg p-2"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option>FY 2024</option>
          <option>FY 2023</option>
          <option>FY 2022</option>
        </select>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1000000000) return `$${value / 1000000000}B`;
                  if (value >= 1000000) return `$${value / 1000000}M`;
                  return `$${value}`;
                }}
              />
              <Tooltip
                formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, 'Spending Amount']}
              />
              <Bar dataKey="amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockData}
                dataKey="percentage"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {mockData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Summary */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Data Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-3 font-medium">NAME</th>
                <th className="pb-3 font-medium">AMOUNT</th>
                <th className="pb-3 font-medium">PERCENTAGE</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((item) => (
                <tr key={item.name} className="border-t border-gray-100">
                  <td className="py-3 text-gray-900">{item.name}</td>
                  <td className="py-3 text-gray-900">${(item.amount / 1000000).toFixed(2)}M</td>
                  <td className="py-3 text-gray-900">{item.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoutingAnalytics;