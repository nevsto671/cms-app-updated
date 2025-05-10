import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Tag, SlidersHorizontal, Download, ChevronDown, ChevronUp, Bot, RefreshCw, Sparkles, Upload, X, Trash2, ArrowUp } from 'lucide-react';
import { CatalogItem } from '../../types/catalog';
import { useCatalog } from '../../hooks/useCatalog';
import CatalogImport from './CatalogImport';
import DatabaseManagement from './DatabaseManagement';
import { supabase } from '../../lib/supabase';
import Papa from 'papaparse';

interface CatalogSearchProps {
  onImport?: () => void;
  onExport?: () => void;
}

const CatalogSearch: React.FC<CatalogSearchProps> = ({ onImport, onExport }) => {
  const { items, loading, error, refetch, searchItems } = useCatalog();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedCodeType, setSelectedCodeType] = useState('All Codes');
  const [sortField, setSortField] = useState<keyof CatalogItem>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [showImport, setShowImport] = useState(false);
  const [showDatabaseManagement, setShowDatabaseManagement] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const filteredItems = useMemo(() => {
    const searchResults = searchItems(searchTerm);
    return searchResults.filter(item => {
      const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
      const matchesPrice = (!priceRange.min || item.govt_price >= Number(priceRange.min)) &&
        (!priceRange.max || item.govt_price <= Number(priceRange.max));
      return matchesCategory && matchesPrice;
    });
  }, [searchTerm, selectedCategory, priceRange.min, priceRange.max, items]);

  const handleSort = (field: keyof CatalogItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value == null) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const handleExport = () => {
    const exportData = items.map(item => ({
      NAICS: '',
      'PSC/SIC': '',
      SIN: item.sin || '',
      Description: item.description || '',
      'Item No.': item.item_no || '',
      'Manufacturer Name': item.mfr_name || '',
      'Manufacturer Item No.': item.mfr_item_no || '',
      UOM: item.uom || '',
      'Government Price': item.govt_price ? `$${item.govt_price.toFixed(2)}` : '',
      'Contract Name': item.contract_name || '',
      'Contract No.': item.contract_no || ''
    }));

    const csv = Papa.unparse(exportData, {
      quotes: true,
      header: true,
      delimiter: ',',
      newline: '\n'
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `catalog_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error loading catalog items: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex gap-4 border-b border-gray-200 mb-6">
          <button
            className="pb-4 px-2 text-sm font-medium border-b-2 border-blue-500 text-blue-600"
          >
            Search & Filter
          </button>
          <button
            className="pb-4 px-2 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            <Bot size={16} />
            AI Enhancement
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Product and Service Catalog</h2>
          <div className="flex gap-2">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              onClick={() => setShowImport(true)}
            >
              <Upload size={16} />
              Import Data
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={handleExport}
              disabled={items.length === 0}
            >
              <Download size={16} />
              Export Results
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={() => setShowDatabaseManagement(true)}
            >
              <Trash2 size={16} />
              Manage Database
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, description, contract number..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              className="flex-1 border border-gray-200 rounded-lg p-2"
              value={selectedCodeType}
              onChange={(e) => setSelectedCodeType(e.target.value)}
            >
              <option>All Codes</option>
              <option>NAICS</option>
              <option>PSC</option>
              <option>SIN</option>
            </select>
            <button
              className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <SlidersHorizontal size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {showAdvancedFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full border border-gray-200 rounded-lg p-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>All Categories</option>
                <option>Information Technology</option>
                <option>Professional Services</option>
                <option>Healthcare</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <select
                className="w-full border border-gray-200 rounded-lg p-2"
                multiple
                value={selectedVendors}
                onChange={(e) => setSelectedVendors(Array.from(e.target.selectedOptions, option => option.value))}
              >
                <option>Vendor 1</option>
                <option>Vendor 2</option>
                <option>Vendor 3</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="divide-x divide-gray-200">
                <th className="sticky top-0 bg-gray-50 text-left text-sm font-medium text-gray-600 p-4 cursor-pointer hover:bg-gray-100 min-w-[120px] border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    NAICS
                  </div>
                </th>
                <th className="sticky top-0 bg-gray-50 text-left text-sm font-medium text-gray-600 p-4 cursor-pointer hover:bg-gray-100 min-w-[120px] border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    PSC/SIC
                  </div>
                </th>
                <th className="sticky top-0 bg-gray-50 text-left text-sm font-medium text-gray-600 p-4 cursor-pointer hover:bg-gray-100 min-w-[120px] border-b border-gray-200" onClick={() => handleSort('sin')}>
                  <div className="flex items-center justify-between">
                    SIN {sortField === 'sin' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </th>
                <th className="sticky top-0 bg-gray-50 text-left text-sm font-medium text-gray-600 p-4 cursor-pointer hover:bg-gray-100 min-w-[300px] border-b border-gray-200" onClick={() => handleSort('description')}>
                  <div className="flex items-center justify-between">
                    Description {sortField === 'description' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </th>
                <th className="sticky top-0 bg-gray-50 text-left text-sm font-medium text-gray-600 p-4 min-w-[120px] border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    Item No.
                  </div>
                </th>
                <th className="sticky top-0 bg-gray-50 text-left text-sm font-medium text-gray-600 p-4 min-w-[150px] border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    Mfr. Name
                  </div>
                </th>
                <th className="sticky top-0 bg-gray-50 text-left text-sm font-medium text-gray-600 p-4 min-w-[150px] border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    Mfr. Item No.
                  </div>
                </th>
                <th className="sticky top-0 bg-gray-50 text-left text-sm font-medium text-gray-600 p-4 min-w-[100px] border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    UOM
                  </div>
                </th>
                <th className="sticky top-0 bg-gray-50 text-left text-sm font-medium text-gray-600 p-4 cursor-pointer hover:bg-gray-100 min-w-[120px] border-b border-gray-200" onClick={() => handleSort('govt_price')}>
                  <div className="flex items-center justify-between">
                    Gov't Price {sortField === 'govt_price' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </th>
                <th className="sticky top-0 bg-gray-50 text-left text-sm font-medium text-gray-600 p-4 min-w-[200px] border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    Contract Name
                  </div>
                </th>
                <th className="sticky top-0 bg-gray-50 text-left text-sm font-medium text-gray-600 p-4 min-w-[150px] border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    Contract No.
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={11} className="p-4 text-center">
                    <div className="flex justify-center items-center">
                      <RefreshCw className="animate-spin h-5 w-5 text-gray-400 mr-2" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-gray-500">
                    No items found matching your search criteria
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4 font-mono text-gray-600 text-sm">-</td>
                    <td className="p-4 font-mono text-gray-600 text-sm">-</td>
                    <td className="p-4 font-mono text-gray-600 text-sm">{item.sin}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-mono text-gray-900 text-sm">{item.title}</div>
                        {item.description && (
                          <div className="font-mono text-gray-500 text-sm">{item.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-gray-600 text-sm">{item.item_no}</td>
                    <td className="p-4 font-mono text-gray-900 text-sm">{item.mfr_name}</td>
                    <td className="p-4 font-mono text-gray-600 text-sm">{item.mfr_item_no}</td>
                    <td className="p-4 font-mono text-gray-600 text-sm">{item.uom}</td>
                    <td className="p-4 font-mono text-gray-900 text-sm">{formatCurrency(item.govt_price)}</td>
                    <td className="p-4 font-mono text-gray-900 text-sm">{item.contract_name}</td>
                    <td className="p-4 font-mono text-gray-600 text-sm">{item.contract_no}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredItems.length} of {items.length} items
            </div>
          </div>
        </div>
      </div>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 z-50"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Import Catalog Data</h2>
              <button
                onClick={() => setShowImport(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <CatalogImport
              onComplete={() => {
                setShowImport(false);
                refetch();
              }}
            />
          </div>
        </div>
      )}

      {showDatabaseManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <DatabaseManagement onClose={() => setShowDatabaseManagement(false)} />
        </div>
      )}
    </div>
  );
};

export default CatalogSearch;