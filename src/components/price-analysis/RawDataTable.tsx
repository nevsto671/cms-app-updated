import React, { useState } from 'react';
import { Search, Filter, Download, ArrowUp, ArrowDown } from 'lucide-react';
import { PriceAnalysis } from '../../types/catalog';

const mockData: PriceAnalysis[] = [
  {
    id: '1',
    sin: 'SIN123',
    itemNumber: 'ITEM-001',
    description: 'Enterprise Software License',
    mfrName: 'Microsoft',
    mfrNumber: 'MS-365-E3',
    unitsSoldQty: 100,
    totalCommAndProposedSales: 150000,
    totalCommercialSales: 120000,
    commercialPriceList: 299.99,
    mfcPrice: 250.00,
    mfcDiscount: 16.67,
    tcPrice: 240.00,
    tcDiscount: 20.00,
    tcTotalSales: 24000,
    proposedPrice: 235.00,
    proposedDiscount: 21.67,
    proposedTotalSales: 23500,
    isProposedPriceLteMfc: 'YES',
    trackingRatio: 1.15,
    createdDate: new Date('2025-01-01'),
    updatedDate: new Date('2025-01-15'),
    uploadBatchId: 'BATCH001',
    createdBy: 'system'
  }
];

const RawDataTable: React.FC = () => {
  const [sortField, setSortField] = useState<keyof PriceAnalysis>('sin');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const formatCurrency = (value: number | null): string => {
    if (value === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number | null): string => {
    if (value === null) return '-';
    return `${value.toFixed(2)}%`;
  };

  const handleSort = (field: keyof PriceAnalysis) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 border border-gray-200 rounded-lg hover:bg-gray-50 ${
              showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : ''
            }`}
          >
            <Filter size={20} />
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Download size={16} />
            Export Data
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SIN
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mfr Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mfr Number
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Units Sold
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Comm Sales
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commercial Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                MFC Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                MFC Discount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TC Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TC Discount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TC Total Sales
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proposed Total Sales
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proposed Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proposed Discount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ≤ MFC
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tracking Ratio
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sin}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.itemNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.mfrName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.mfrNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.unitsSoldQty}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.totalCommercialSales)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.commercialPriceList)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.mfcPrice)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPercent(item.mfcDiscount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.tcPrice)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPercent(item.tcDiscount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.tcTotalSales)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.proposedTotalSales)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.proposedPrice)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPercent(item.proposedDiscount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.isProposedPriceLteMfc}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.trackingRatio.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RawDataTable;