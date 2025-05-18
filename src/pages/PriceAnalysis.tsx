import React, { useState } from 'react';
import RawDataTable from '../components/price-analysis/RawDataTable';
import AnalysisDashboard from '../components/price-analysis/AnalysisDashboard';
import ImportData from '../components/price-analysis/ImportData';
import { Database, Trash2, Download, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PriceAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'raw' | 'import' | 'manage'>('analysis');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImportComplete = () => {
    setActiveTab('raw');
  };

  const handleClearData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: clearError } = await supabase
        .from('price_analysis')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

      if (clearError) throw clearError;

      setShowConfirmClear(false);
      window.location.reload(); // Refresh to show empty state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('price_analysis')
        .select('*');

      if (fetchError) throw fetchError;

      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `price_analysis_dump_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Price Analysis</h1>
        <p className="text-gray-600">Analyze and compare pricing trends across contracts and vendors</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-4 px-1 inline-flex items-center space-x-2 border-b-2 font-medium text-sm ${
              activeTab === 'analysis'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Analysis Dashboard
          </button>

          <button
            onClick={() => setActiveTab('raw')}
            className={`py-4 px-1 inline-flex items-center space-x-2 border-b-2 font-medium text-sm ${
              activeTab === 'raw'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Raw Data
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`py-4 px-1 inline-flex items-center space-x-2 border-b-2 font-medium text-sm ${
              activeTab === 'import'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Import Data
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`py-4 px-1 inline-flex items-center space-x-2 border-b-2 font-medium text-sm ${
              activeTab === 'manage'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Database size={16} className="mr-1" />
            Data Management
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4">
          {activeTab === 'analysis' ? (
            <AnalysisDashboard />
          ) : activeTab === 'raw' ? (
            <RawDataTable />
          ) : activeTab === 'import' ? (
            <ImportData onComplete={handleImportComplete} />
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Data Management</h2>
                <p className="text-gray-600">Manage your price analysis data</p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <p className="ml-3 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Trash2 className="h-5 w-5 text-red-500 mr-2" />
                    Clear Data
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Remove all price analysis data from the database. This action cannot be undone.
                  </p>
                  {!showConfirmClear ? (
                    <button
                      onClick={() => setShowConfirmClear(true)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                      disabled={loading}
                    >
                      Clear All Data
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-red-600 font-medium">Are you sure? This cannot be undone!</p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleClearData}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                          disabled={loading}
                        >
                          {loading ? 'Clearing...' : 'Yes, Clear Data'}
                        </button>
                        <button
                          onClick={() => setShowConfirmClear(false)}
                          className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Download className="h-5 w-5 text-blue-500 mr-2" />
                    Export Database Dump
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Download a complete JSON dump of all price analysis data.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Exporting...' : 'Export Data'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceAnalysis;