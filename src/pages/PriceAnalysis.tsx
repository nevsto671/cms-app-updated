import React, { useState } from 'react';
import RawDataTable from '../components/price-analysis/RawDataTable';
import AnalysisDashboard from '../components/price-analysis/AnalysisDashboard';
import ImportData from '../components/price-analysis/ImportData';

const PriceAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'raw' | 'analysis' | 'import'>('raw');

  const handleImportComplete = () => {
    setActiveTab('raw');
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
            onClick={() => setActiveTab('import')}
            className={`py-4 px-1 inline-flex items-center space-x-2 border-b-2 font-medium text-sm ${
              activeTab === 'import'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Import Data
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4">
          {activeTab === 'raw' ? (
            <RawDataTable />
          ) : activeTab === 'analysis' ? (
            <AnalysisDashboard />
          ) : (
            <ImportData onComplete={handleImportComplete} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceAnalysis;