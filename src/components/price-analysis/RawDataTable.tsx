import React, { useState } from 'react';
import { Search, Filter, Download, ArrowUp, ArrowDown } from 'lucide-react';
import Papa from 'papaparse';

interface PriceData {
  sin: string;
  model: string;
  commercialPrice: number;
  mfcPrice: number;
  mfcDiscount: number;
  proposedPrice: number;
  proposedDiscount: number;
  trackingRatio: number;
}

const mockData: PriceData[] = [
  {
    sin: 'L39',
    model: 'Bandages Model 10',
    commercialPrice: 6722.00,
    mfcPrice: 4100.00,
    mfcDiscount: 39.01,
    proposedPrice: 4100.00,
    proposedDiscount: 39.01,
    trackingRatio: 4.35
  },
  {
    sin: 'L40',
    model: 'Bandages Model 11',
    commercialPrice: 7121.00,
    mfcPrice: 5911.00,
    mfcDiscount: 16.99,
    proposedPrice: 5657.00,
    proposedDiscount: 20.56,
    trackingRatio: 3.15
  },
  {
    sin: 'F23',
    model: 'Bandages Model 12',
    commercialPrice: 7271.00,
    mfcPrice: 5065.00,
    mfcDiscount: 30.34,
    proposedPrice: 3193.00,
    proposedDiscount: 56.09,
    trackingRatio: 5.58
  },
  {
    sin: 'F23',
    model: 'Bandages Model 13',
    commercialPrice: 13303.00,
    mfcPrice: 12000.00,
    mfcDiscount: 9.79,
    proposedPrice: 2832.00,
    proposedDiscount: 78.71,
    trackingRatio: 6.29
  },
  {
    sin: 'F23',
    model: 'Bandages Model 14',
    commercialPrice: 7573.00,
    mfcPrice: 19000.00,
    mfcDiscount: -150.89,
    proposedPrice: 2740.00,
    proposedDiscount: 63.82,
    trackingRatio: 6.50
  }
];

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

const RawDataTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof PriceData>('sin');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSIN, setSelectedSIN] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const handleSort = (field: keyof PriceData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    const csvData = mockData.map(item => ({
      'SIN': item.sin,
      'Model': item.model,
      'Commercial Price': formatCurrency(item.commercialPrice),
      'MFC Price': formatCurrency(item.mfcPrice),
      'MFC Discount': formatPercentage(item.mfcDiscount),
      'Proposed Price': formatCurrency(item.proposedPrice),
      'Proposed Discount': formatPercentage(item.proposedDiscount),
      'Tracking Ratio': item.trackingRatio.toFixed(2)
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `price_analysis_raw_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredData = mockData
    .filter(item => {
      const matchesSearch = 
        item.sin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSIN = selectedSIN === 'All' || item.sin === selectedSIN;
      
      const matchesPriceRange = 
        (!priceRange.min || item.commercialPrice >= Number(priceRange.min)) &&
        (!priceRange.max || item.commercialPrice <= Number(priceRange.max));

      return matchesSearch && matchesSIN && matchesPriceRange;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

  const uniqueSINs = Array.from(new Set(mockData.map(item => item.sin)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by SIN or Model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 border border-gray-200 rounded-lg hover:bg-gray-50 ${
              showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : ''
            }`}
          >
            <Filter size={20} />
          </button>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Download size={16} />
          Export Raw Data
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SIN</label>
            <select
              value={selectedSIN}
              onChange={(e) => setSelectedSIN(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2"
            >
              <option>All</option>
              {uniqueSINs.map(sin => (
                <option key={sin}>{sin}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commercial Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2"
              />
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(mockData[0]).map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key as keyof PriceData)}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                    {sortField === key && (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{item.sin}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.model}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.commercialPrice)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.mfcPrice)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatPercentage(item.mfcDiscount)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.proposedPrice)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatPercentage(item.proposedDiscount)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.trackingRatio.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
        <div>
          Showing {filteredData.length} of {mockData.length} items
        </div>
      </div>
    </div>
  );
};

export default RawDataTable;