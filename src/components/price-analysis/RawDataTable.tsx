import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { PriceAnalysis } from '../../types/catalog';
import { supabase } from '../../lib/supabase';
import Papa from 'papaparse';

const RawDataTable: React.FC = () => {
  const [data, setData] = useState<PriceAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState<keyof PriceAnalysis>('sin');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: priceData, error: fetchError } = await supabase
        .from('price_analysis')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setData(priceData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '-';
    return `${value.toFixed(2)}%`;
  };

  const handleSort = (field: keyof PriceAnalysis) => {
    if (selectedField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSelectedField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    const exportData = data.map(item => ({
      'SIN': item.sin,
      'Item Number': item.item_number,
      'Description': item.description,
      'Manufacturer Name': item.mfr_name,
      'Manufacturer Number': item.mfr_number,
      'Units Sold': item.units_sold_qty,
      'Total Comm. & Proposed Sales': formatCurrency(item.total_comm_and_proposed_sales),
      'Total Commercial Sales': formatCurrency(item.total_commercial_sales),
      'Commercial Price List': formatCurrency(item.commercial_price_list),
      'MFC Price': formatCurrency(item.mfc_price),
      'MFC Discount': formatPercent(item.mfc_discount),
      'TC Price': formatCurrency(item.tc_price),
      'TC Discount': formatPercent(item.tc_discount),
      'TC Total Sales': formatCurrency(item.tc_total_sales),
      'Proposed Price': formatCurrency(item.proposed_price),
      'Proposed Discount': formatPercent(item.proposed_discount),
      'Proposed Total Sales': formatCurrency(item.proposed_total_sales),
      '≤ MFC': item.is_proposed_price_lte_mfc,
      'Tracking Ratio': item.tracking_ratio?.toFixed(2) || '-'
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `price_analysis_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 -m-4"> {/* Added negative margin to remove padding */}
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
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
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Download size={16} />
            Export Data
          </button>
          <button
            onClick={fetchData}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <RefreshCw className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mfr Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mfr Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Comm. & Proposed Sales</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Commercial Sales</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commercial Price List</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MFC Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MFC Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TC Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TC Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TC Total Sales</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposed Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposed Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposed Total Sales</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">≤ MFC</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking Ratio</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={19} className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <RefreshCw className="animate-spin h-5 w-5 text-blue-500 mr-2" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={19} className="px-6 py-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.item_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.mfr_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.mfr_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.units_sold_qty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.total_comm_and_proposed_sales)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.total_commercial_sales)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.commercial_price_list)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.mfc_price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPercent(item.mfc_discount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.tc_price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPercent(item.tc_discount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.tc_total_sales)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.proposed_price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPercent(item.proposed_discount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.proposed_total_sales)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.is_proposed_price_lte_mfc}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tracking_ratio?.toFixed(2) || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RawDataTable;