import React, { useState, useRef } from 'react';
import { Search, Filter, Download, ArrowUp, ArrowDown, Upload, X } from 'lucide-react';
import Papa from 'papaparse';

interface PriceData {
  sin: string;
  itemNumber: string; 
  description: string;
  mfrName: string;
  mfrNumber: string;
  unitsSoldQty: number;
  totalCommAndProposedSales: number;
  totalCommercialSales: number;
  commercialPriceList: number;
  mfcPrice: number;
  mfcDiscount: number;
  tcPrice: number | null;
  tcDiscount: number | null;
  tcTotalSales: number | null;
  proposedPrice: number;
  proposedDiscount: number;
  isProposedPriceLteMfc: 'YES' | 'NO' | null;
  proposedTotalSales: number;
  trackingRatio: number;
}

const mockData: PriceData[] = [
  {
    sin: 'L39',
    itemNumber: 'IT-001',
    description: 'Dell Latitude 5420 Laptop, Intel Core i7-1185G7, 16GB RAM, 512GB SSD',
    mfrName: 'Dell Technologies',
    mfrNumber: 'LAT-5420-i7-16-512',
    unitsSoldQty: 150,
    totalCommAndProposedSales: 1008300,
    totalCommercialSales: 393300,
    commercialPriceList: 6722.00,
    mfcPrice: 4100.00,
    mfcDiscount: 39.01,
    tcPrice: 4500.00,
    tcDiscount: 33.05,
    tcTotalSales: 675000,
    proposedPrice: 4100.00,
    proposedDiscount: 39.01,
    isProposedPriceLteMfc: 'YES',
    proposedTotalSales: 615000,
    trackingRatio: 1.64
  },
  {
    sin: 'L40',
    itemNumber: 'IT-002',
    description: 'HP Z4 G4 Workstation, Intel Xeon W-2245, 64GB RAM, 2TB SSD',
    mfrName: 'HP Inc.',
    mfrNumber: 'WS-8560-DUAL',
    unitsSoldQty: 75,
    totalCommAndProposedSales: 534075,
    totalCommercialSales: 109800,
    commercialPriceList: 7121.00,
    mfcPrice: 5911.00,
    mfcDiscount: 16.99,
    tcPrice: null,
    tcDiscount: null,
    tcTotalSales: null,
    proposedPrice: 5657.00,
    proposedDiscount: 20.56,
    isProposedPriceLteMfc: 'NO',
    proposedTotalSales: 424275,
    trackingRatio: 1.26
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
          unitsSoldQty: parseInt(row.unitsSoldQty || '0'),
          totalCommAndProposedSales: parseFloat(row.totalCommAndProposedSales || '0'),
          totalCommercialSales: parseFloat(row.totalCommercialSales || '0'),
          commercialPriceList: parseFloat(row.commercialPriceList || '0'),
          mfcPrice: parseFloat(row.mfcPrice || '0'),
          mfcDiscount: parseFloat(row.mfcDiscount || '0'),
          tcPrice: row.tcPrice ? parseFloat(row.tcPrice) : null,
          tcDiscount: row.tcDiscount ? parseFloat(row.tcDiscount) : null,
          tcTotalSales: row.tcTotalSales ? parseFloat(row.tcTotalSales) : null,
          proposedPrice: parseFloat(row.proposedPrice || '0'),
          proposedDiscount: parseFloat(row.proposedDiscount || '0'),
          proposedTotalSales: parseFloat(row.proposedTotalSales || '0'),
          trackingRatio: parseFloat(row.trackingRatio || '0')
        }));
        setData(parsedData);
        setShowUploadModal(false);
      }
    });
  };

  const downloadTemplate = () => {
    const templateData = [{
      sin: 'L39',
      itemNumber: 'IT-XXX',
      description: 'Example Product',
      mfrName: 'Example Manufacturer',
      mfrNumber: 'MFR-123',
      unitsSoldQty: '100',
      totalCommAndProposedSales: '50000',
      totalCommercialSales: '25000',
      commercialPriceList: '500.00',
      mfcPrice: '400.00',
      mfcDiscount: '20.00',
      tcPrice: '450.00',
      tcDiscount: '10.00',
      tcTotalSales: '45000',
      proposedPrice: '425.00',
      proposedDiscount: '15.00',
      isProposedPriceLteMfc: 'YES',
      proposedTotalSales: '42500',
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
        item.mfrNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSIN = selectedSIN === 'All' || item.sin === selectedSIN;
      
      const matchesPriceRange = 
        (!priceRange.min || item.commercialPriceList >= Number(priceRange.min)) &&
        (!priceRange.max || item.commercialPriceList <= Number(priceRange.max));

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
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                SIN
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Item #
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Description
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Mfr. Name
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Mfr. Item #
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Sold Units
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Total Comm. & Proposed Sales
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Total Commercial Sales
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Commercial Price List
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                MFC Price
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                MFC Discount
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                TC Price
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                TC Discount
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                TC Total Sales
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Proposed Price
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Proposed Discount
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Proposed Total Sales
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Tracking Ratio
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.itemNumber} className="hover:bg-gray-50">
                <td className="px-3 py-4 text-sm text-gray-900">{item.sin}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{item.itemNumber}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{item.description}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{item.mfrName}</td>
                <td className="px-3 py-4 text-sm font-mono text-gray-900">{item.mfrNumber}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{item.unitsSoldQty.toLocaleString()}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{formatCurrency(item.totalCommAndProposedSales)}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{formatCurrency(item.totalCommercialSales)}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{formatCurrency(item.commercialPriceList)}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{formatCurrency(item.mfcPrice)}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{item.mfcDiscount.toFixed(2)}%</td>
                <td className="px-3 py-4 text-sm text-gray-900">{item.tcPrice ? formatCurrency(item.tcPrice) : '-'}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{item.tcDiscount ? `${item.tcDiscount.toFixed(2)}%` : '-'}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{item.tcTotalSales ? formatCurrency(item.tcTotalSales) : '-'}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{formatCurrency(item.proposedPrice)}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{item.proposedDiscount.toFixed(2)}%</td>
                <td className="px-3 py-4 text-sm text-gray-900">{formatCurrency(item.proposedTotalSales)}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{item.trackingRatio.toFixed(2)}</td>
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