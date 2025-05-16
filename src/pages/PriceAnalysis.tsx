import React, { useState } from 'react';
import { DollarSign, TrendingUp, BarChart2, Search, Filter, Download, RefreshCw } from 'lucide-react';

const PriceAnalysis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [dateRange, setDateRange] = useState('last30');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Price Analysis</h1>
        <p className="text-gray-600">Analyze and compare pricing trends across contracts and vendors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Average Price</h3>
            <DollarSign className="text-green-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900">$1,245.00</div>
          <p className="text-sm text-green-600 mt-2">+5.2% from last period</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Price Variance</h3>
            <TrendingUp className="text-blue-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900">12.8%</div>
          <p className="text-sm text-blue-600 mt-2">Across all vendors</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Price Trends</h3>
            <BarChart2 className="text-purple-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900">Stable</div>
          <p className="text-sm text-purple-600 mt-2">Last 30 days analysis</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-200 rounded-lg p-2"
              >
                <option value="last7">Last 7 Days</option>
                <option value="last30">Last 30 Days</option>
                <option value="last90">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 border border-gray-200 rounded-lg hover:bg-gray-50 ${
                  showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : ''
                }`}
              >
                <Filter size={20} />
              </button>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download size={16} />
                Export
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                <RefreshCw size={16} />
                Update Analysis
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2"
                >
                  <option>All Categories</option>
                  <option>IT Equipment</option>
                  <option>Office Supplies</option>
                  <option>Professional Services</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full border border-gray-200 rounded-lg p-2"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full border border-gray-200 rounded-lg p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                <select className="w-full border border-gray-200 rounded-lg p-2">
                  <option>All Vendors</option>
                  <option>Vendor A</option>
                  <option>Vendor B</option>
                  <option>Vendor C</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">Price trend visualization will be displayed here</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Price Comparison by Vendor</h2>
          <div className="space-y-4">
            {[
              { name: 'Vendor A', avgPrice: '$1,245', variance: '+2.3%' },
              { name: 'Vendor B', avgPrice: '$1,189', variance: '-4.1%' },
              { name: 'Vendor C', avgPrice: '$1,312', variance: '+8.2%' },
              { name: 'Vendor D', avgPrice: '$1,156', variance: '-6.8%' }
            ].map((vendor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{vendor.name}</p>
                  <p className="text-sm text-gray-500">Avg. Price: {vendor.avgPrice}</p>
                </div>
                <span className={`text-sm font-medium ${
                  vendor.variance.startsWith('+') ? 'text-red-600' : 'text-green-600'
                }`}>
                  {vendor.variance}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Price Alerts</h2>
          <div className="space-y-4">
            {[
              { title: 'Significant price increase detected', item: 'IT Equipment', change: '+15%' },
              { title: 'Price below market average', item: 'Office Supplies', change: '-12%' },
              { title: 'New competitive price available', item: 'Software Licenses', change: '-8%' },
              { title: 'Price variance exceeds threshold', item: 'Professional Services', change: '+10%' }
            ].map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{alert.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.item}</p>
                  <p className={`text-xs font-medium mt-1 ${
                    alert.change.startsWith('+') ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {alert.change} change
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAnalysis;