import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Proposal, Office } from '../../types/workflow';

interface WorkflowChartsProps {
  proposals: Proposal[];
  offices: Office[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

const WorkflowCharts: React.FC<WorkflowChartsProps> = ({ proposals, offices }) => {
  // Prepare data for office allocation chart
  const officeAllocationData = offices.map(office => ({
    name: office.name.split(' ').slice(1).join(' '), // Remove "Office of" prefix
    count: proposals.filter(p => p.assignedOffice === office.id).length
  })).filter(d => d.count > 0);

  // Prepare data for priority distribution
  const priorityData = [
    { name: 'High', value: proposals.filter(p => p.priority === 'high').length },
    { name: 'Medium', value: proposals.filter(p => p.priority === 'medium').length },
    { name: 'Low', value: proposals.filter(p => p.priority === 'low').length }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Office Allocation Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Proposal Distribution by Office</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={officeAllocationData} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Distribution Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Proposal Distribution by Priority</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WorkflowCharts;