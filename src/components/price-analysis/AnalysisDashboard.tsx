import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalysisDashboard: React.FC = () => {
  // Mock data - replace with real data from your API/database
  const overviewData = {
    totalCommAndProposedSales: 18234920,
    commercialTotalSales: 13959200,
    proposedTotalSales: 4275820,
    totalItems: 661,
    itemsWithCommercialSales: 548,
    itemsWithZeroCommercialSales: 113,
    mfcDiscountRange: { min: 16.0, max: 65.8 },
    tcDiscountRange: { min: 42.3, max: 89.7 },
    proposedDiscountRange: { min: 25.8, max: 82.4 },
    proposedTcRatio: { min: 0.61, max: 10.38 },
    proposedPriceLteMfc: { true: 435, false: 226 },
    totalManufacturers: 12
  };

  const manufacturersData = [
    { name: 'MedSupply Inc', items: 24, totalSales: 35845 },
    { name: 'NovaCare', items: 18, totalSales: 42780 },
    { name: 'MediPlus', items: 12, totalSales: 28450 },
    { name: 'SafetyFirst', items: 8, totalSales: 38750 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div>
      {/* Overview Card */}
      <div className="bg-white">
        <h2 className="text-xl font-semibold text-gray-900 p-4 border-b border-gray-200">Proposed Offer Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <div>
            <div className="mb-4">
              <div className="text-sm text-gray-600">Total Comm. & Proposed Sales</div>
              <div className="text-lg font-semibold">{formatCurrency(overviewData.totalCommAndProposedSales)}</div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600">Commercial Total Sales</div>
              <div className="text-lg font-semibold">{formatCurrency(overviewData.commercialTotalSales)}</div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600">Proposed Total Sales</div>
              <div className="text-lg font-semibold">{formatCurrency(overviewData.proposedTotalSales)}</div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <div className="text-sm text-gray-600">Total Items</div>
              <div className="text-lg font-semibold">
                {overviewData.totalItems} ({overviewData.itemsWithZeroCommercialSales} {((overviewData.itemsWithZeroCommercialSales / overviewData.totalItems) * 100).toFixed(1)}%)
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600">Items with Commercial Sales</div>
              <div className="text-lg font-semibold">
                {overviewData.itemsWithCommercialSales} ({((overviewData.itemsWithCommercialSales / overviewData.totalItems) * 100).toFixed(1)}%)
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600">Items with Zero Commercial Sales</div>
              <div className="text-lg font-semibold">
                {overviewData.itemsWithZeroCommercialSales} ({((overviewData.itemsWithZeroCommercialSales / overviewData.totalItems) * 100).toFixed(1)}%)
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <div className="text-sm text-gray-600">MFC % Discount</div>
              <div className="text-lg font-semibold">
                {overviewData.mfcDiscountRange.min}% - {overviewData.mfcDiscountRange.max}%
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600">TC % Discount</div>
              <div className="text-lg font-semibold">
                {overviewData.tcDiscountRange.min}% - {overviewData.tcDiscountRange.max}%
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600">Proposed % Discount</div>
              <div className="text-lg font-semibold">
                {overviewData.proposedDiscountRange.min}% - {overviewData.proposedDiscountRange.max}%
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <div className="text-sm text-gray-600">Proposed TC Ratio</div>
              <div className="text-lg font-semibold">
                {overviewData.proposedTcRatio.min} - {overviewData.proposedTcRatio.max}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600">Proposed Price ≤ MFC Price</div>
              <div className="text-lg font-semibold">
                {overviewData.proposedPriceLteMfc.true} ({((overviewData.proposedPriceLteMfc.true / overviewData.totalItems) * 100).toFixed(1)}%) True,{' '}
                {overviewData.proposedPriceLteMfc.false} ({((overviewData.proposedPriceLteMfc.false / overviewData.totalItems) * 100).toFixed(1)}%) False
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600">Total Manufacturers</div>
              <div className="text-lg font-semibold">{overviewData.totalManufacturers}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Manufacturers Summary */}
      <div className="bg-white mt-4">
        <h2 className="text-xl font-semibold text-gray-900 p-4 border-b border-gray-200">Manufacturers Summary</h2>
        
        <div className="h-[400px] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={manufacturersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [value, 'Items']}
                labelStyle={{ color: '#111827' }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem'
                }}
              />
              <Bar dataKey="items" fill="#818CF8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manufacturer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Sales
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {manufacturersData.map((manufacturer) => (
                <tr key={manufacturer.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {manufacturer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {manufacturer.items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(manufacturer.totalSales)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;