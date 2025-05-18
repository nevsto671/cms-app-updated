import React, { useState, useRef } from 'react';
import { Search, Filter, Download, ArrowUp, ArrowDown, Upload, X } from 'lucide-react';
import Papa from 'papaparse';

interface PriceData {
  sin: string;
  itemNo: string;
  description: string;
  mfrName: string;
  mfrItemNo: string;
  soldUnits: number;
  totalCommSales: number;
  proposedSales: number;
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
    description: 'High-performance laptop with Intel Core i7, 16GB RAM, 512GB SSD',
    mfrName: 'Dell Technologies',
    mfrItemNo: 'LAT-5420-i7-16-512',
    soldUnits: 150,
    totalCommSales: 1008300,
    proposedSales: 615000,
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
    description: 'Professional workstation with dual monitors and docking station',
    mfrName: 'HP Inc.',
    mfrItemNo: 'WS-8560-DUAL',
    soldUnits: 75,
    totalCommSales: 534075,
    proposedSales: 424275,
    commercialPrice: 7121.00,
    mfcPrice: 5911.00,
    mfcDiscount: 16.99,
    proposedPrice: 5657.00,
    proposedDiscount: 20.56,
    trackingRatio: 3.15
  }
];

const RawDataTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof PriceData>('description');
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

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
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
          ...row,
          soldUnits: parseInt(row.soldUnits || '0'),
          totalCommSales: parseFloat(row.totalCommSales || '0'),
          proposedSales: parseFloat(row.proposedSales || '0'),
          commercialPrice: parseFloat(row.commercialPrice || '0'),
          mfcPrice: parseFloat(row.mfcPrice || '0'),
          mfcDiscount: parseFloat(row.mfcDiscount || '0'),
          proposedPrice: parseFloat(row.proposedPrice || '0'),
          proposedDiscount: parseFloat(row.proposedDiscount || '0'),
          trackingRatio: parseFloat(row.trackingRatio || '0')
        }));
        setData(parsedData);
        setShowUploadModal(false);
      }
    });
  };

  const downloadTemplate = () => {
    const templateData = [{
      description: 'Example Product',
      mfrName: 'Example Manufacturer',
      mfrItemNo: 'MFR-123',
      soldUnits: '100',
      totalCommSales: '50000',
      proposedSales: '45000',
      commercialPrice: '500.00',
      mfcPrice: '400.00',
      mfcDiscount: '20.00',
      proposedPrice: '450.00',
      proposedDiscount: '10.00',
      trackingRatio: '1.25'
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
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mfrName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mfrItemNo.toLowerCase().includes(searchTerm.toLowerCase());
      
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by description, manufacturer..."
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
            onClick={downloadTemplate}
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
              {Array.from(new Set(data.map(item => item.sin))).map(sin => (
                <option key={sin}>{sin}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
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
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('description')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Description
                  {sortField === 'description' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('mfrName')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Mfr. Name
                  {sortField === 'mfrName' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('mfrItemNo')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Mfr. Item #
                  {sortField === 'mfrItemNo' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('soldUnits')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Sold Units
                  {sortField === 'soldUnits' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('totalCommSales')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Total Comm. Sales
                  {sortField === 'totalCommSales' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('proposedSales')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Proposed Sales
                  {sortField === 'proposedSales' && (
                    sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </div>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.itemNo} className="hover:bg-gray-50">
                <td className="px-3 py-4">
                  <div className="text-sm text-gray-900">{item.description}</div>
                </td>
                <td className="px-3 py-4">
                  <div className="text-sm text-gray-900">{item.mfrName}</div>
                </td>
                <td className="px-3 py-4">
                  <div className="text-sm font-mono text-gray-900">{item.mfrItemNo}</div>
                </td>
                <td className="px-3 py-4">
                  <div className="text-sm text-gray-900">{item.soldUnits.toLocaleString()}</div>
                </td>
                <td className="px-3 py-4">
                  <div className="text-sm text-gray-900">{formatCurrency(item.totalCommSales)}</div>
                </td>
                <td className="px-3 py-4">
                  <div className="text-sm text-gray-900">{formatCurrency(item.proposedSales)}</div>
                </td>
                <td className="px-3 py-4">
                  <div className="flex gap-2">
                    <button className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100">
                      Compare
                    </button>
                    <button className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded border border-gray-200 hover:bg-gray-100">
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </div>
  );
};

export default RawDataTable;