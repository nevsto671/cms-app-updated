import React, { useState, useRef } from 'react';
import { Search, Filter, Download, ArrowUp, ArrowDown, Upload, X } from 'lucide-react';
import Papa from 'papaparse';

interface PriceData {
  sin: string;
  itemNo: string;
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
    itemNo: 'IT-001',
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
    itemNo: 'IT-002',
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
    itemNo: 'IT-003',
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
    itemNo: 'IT-004',
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
    itemNo: 'IT-005',
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
  const [data, setData] = useState<PriceData[]>(mockData);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSort = (field: keyof PriceData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    const csvData = data.map(item => ({
      'SIN': item.sin,
      'Item #': item.itemNo,
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data.map((row: any) => ({
          sin: row.SIN || '',
          itemNo: row['Item #'] || '',
          model: row.Model || '',
          commercialPrice: parseFloat(row['Commercial Price']?.replace(/[^0-9.-]+/g, '') || '0'),
          mfcPrice: parseFloat(row['MFC Price']?.replace(/[^0-9.-]+/g, '') || '0'),
          mfcDiscount: parseFloat(row['MFC Discount']?.replace(/[^0-9.%-]+/g, '') || '0'),
          proposedPrice: parseFloat(row['Proposed Price']?.replace(/[^0-9.-]+/g, '') || '0'),
          proposedDiscount: parseFloat(row['Proposed Discount']?.replace(/[^0-9.%-]+/g, '') || '0'),
          trackingRatio: parseFloat(row['Tracking Ratio'] || '0')
        }));
        setData(parsedData);
        setShowUploadModal(false);
      }
    });
  };

  const downloadTemplate = () => {
    const templateData = [{
      'SIN': 'L39',
      'Item #': 'IT-001',
      'Model': 'Example Model',
      'Commercial Price': '$1000.00',
      'MFC Price': '$800.00',
      'MFC Discount': '20.00%',
      'Proposed Price': '$750.00',
      'Proposed Discount': '25.00%',
      'Tracking Ratio': '1.25'
    }];

    const csv = Papa.unparse(templateData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'price_analysis_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredData = data
    .filter(item => {
      const matchesSearch = 
        item.sin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const uniqueSINs = Array.from(new Set(data.map(item => item.sin)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by SIN, Item #, or Model..."
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

        <div className="flex gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <Upload size={16} />
            Upload Data
          </button>

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Download size={16} />
            Export Data
          </button>
        </div>
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Price Data</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-blue-800 mb-1">Need a template?</h3>
                  <p className="text-sm text-blue-600">
                    Download our CSV template file to ensure your data is formatted correctly
                  </p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Download size={16} />
                  Download Template
                </button>
              </div>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".csv"
                className="hidden"
              />
              <Upload size={32} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                Drag and drop your CSV file here, or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 hover:text-blue-600"
                >
                  browse
                </button>
              </p>
              <p className="text-sm text-gray-500">
                Supported format: CSV
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('sin')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  SIN
                  {sortField === 'sin' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('itemNo')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Item #
                  {sortField === 'itemNo' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('model')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Model
                  {sortField === 'model' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('commercialPrice')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Commercial Price
                  {sortField === 'commercialPrice' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('mfcPrice')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  MFC Price
                  {sortField === 'mfcPrice' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('mfcDiscount')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  MFC Discount
                  {sortField === 'mfcDiscount' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('proposedPrice')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Proposed Price
                  {sortField === 'proposedPrice' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('proposedDiscount')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Proposed Discount
                  {sortField === 'proposedDiscount' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('trackingRatio')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Tracking Ratio
                  {sortField === 'trackingRatio' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.sin + item.itemNo} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{item.sin}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.itemNo}</td>
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
          Showing {filteredData.length} of {data.length} items
        </div>
      </div>
    </div>
  );
};

export default RawDataTable;