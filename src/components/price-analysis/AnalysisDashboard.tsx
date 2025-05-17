import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, BarChart2 } from 'lucide-react';

const mockData = {
  priceDistribution: [
    { name: '0-1000', value: 15 },
    { name: '1001-5000', value: 45 },
    { name: '5001-10000', value: 25 },
    { name: '10000+', value: 15 }
  ],
  discountTrends: [
    { name: 'Jan', commercial: 20, proposed: 25 },
    { name: 'Feb', commercial: 22, proposed: 28 },
    { name: 'Mar', commercial: 25, proposed: 30 },
    { name: 'Apr', commercial: 21, proposed: 27 },
    { name: 'May', commercial: 24, proposed: 29 }
  ],
  metrics: {
    averageDiscount: 28.5,
    medianPrice: 5750,
    priceVariance: 12.8
  }
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const AnalysisDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Average Discount</h3>
            <DollarSign className="text-green-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900">{mockData.metrics.averageDiscount}%</div>
          <p className="text-sm text-green-600 mt-2">+2.3% from last period</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Median Price</h3>
            <TrendingUp className="text-blue-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(mockData.metrics.medianPrice)}
          </div>
          <p className="text-sm text-blue-600 mt-2">Across all products</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Price Variance</h3>
            <BarChart2 className="text-purple-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900">{mockData.metrics.priceVariance}%</div>
          <p className="text-sm text-purple-600 mt-2">Standard deviation</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Price Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.priceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockData.priceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Discount Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.discountTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="commercial" name="Commercial Discount" fill="#3B82F6" />
                <Bar dataKey="proposed" name="Proposed Discount" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600">Sample Size</h4>
            <p className="text-2xl font-bold text-gray-900 mt-1">156</p>
            <p className="text-xs text-gray-500 mt-1">Total products analyzed</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600">Price Range</h4>
            <p className="text-2xl font-bold text-gray-900 mt-1">$2.7K - $19K</p>
            <p className="text-xs text-gray-500 mt-1">Min-Max spread</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600">Discount Range</h4>
            <p className="text-2xl font-bold text-gray-900 mt-1">15% - 79%</p>
            <p className="text-xs text-gray-500 mt-1">Discount spread</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600">Confidence Level</h4>
            <p className="text-2xl font-bold text-gray-900 mt-1">95%</p>
            <p className="text-xs text-gray-500 mt-1">Statistical confidence</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;