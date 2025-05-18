import React, { useState } from 'react';
import { Briefcase, Users, FileText, BarChart2, Settings, Activity, DollarSign, ChevronDown } from 'lucide-react';
import RawDataTable from '../components/price-analysis/RawDataTable';
import AnalysisDashboard from '../components/price-analysis/AnalysisDashboard';
import ImportData from '../components/price-analysis/ImportData';

const ContractAdministration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPriceAnalysis, setShowPriceAnalysis] = useState(false);
  const [priceAnalysisView, setPriceAnalysisView] = useState<'dashboard' | 'raw' | 'import'>('dashboard');

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contracting Admin</h1>
        <p className="text-gray-600">Manage and monitor contract lifecycle, compliance, and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Contracts</h3>
            <Briefcase className="text-blue-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900">247</div>
          <p className="text-sm text-gray-600 mt-2">12 pending renewals</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Vendors</h3>
            <Users className="text-green-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900">89</div>
          <p className="text-sm text-gray-600 mt-2">15 new this month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Documents</h3>
            <FileText className="text-purple-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900">1,458</div>
          <p className="text-sm text-gray-600 mt-2">85% compliance rate</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Value</h3>
            <BarChart2 className="text-yellow-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-900">$12.4M</div>
          <p className="text-sm text-gray-600 mt-2">+8.3% from last month</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'overview' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'activity' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Activity
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowPriceAnalysis(!showPriceAnalysis)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    showPriceAnalysis 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <DollarSign size={16} />
                  Price Analysis
                  <ChevronDown size={16} className={`transform transition-transform ${showPriceAnalysis ? 'rotate-180' : ''}`} />
                </button>
                {showPriceAnalysis && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <button
                      onClick={() => setPriceAnalysisView('dashboard')}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                        priceAnalysisView === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      Analysis Dashboard
                    </button>
                    <button
                      onClick={() => setPriceAnalysisView('raw')}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                        priceAnalysisView === 'raw' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      Raw Data
                    </button>
                    <button
                      onClick={() => setPriceAnalysisView('import')}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                        priceAnalysisView === 'import' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      Import Data
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {showPriceAnalysis ? (
            <>
              {priceAnalysisView === 'dashboard' && <AnalysisDashboard />}
              {priceAnalysisView === 'raw' && <RawDataTable />}
              {priceAnalysisView === 'import' && <ImportData onComplete={() => setPriceAnalysisView('raw')} />}
            </>
          ) : (
            activeTab === 'overview' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {[
                        { title: 'Contract #12458 renewed', date: '2 hours ago', type: 'renewal' },
                        { title: 'New vendor onboarded: Tech Solutions Inc', date: '5 hours ago', type: 'vendor' },
                        { title: 'Compliance check completed', date: '1 day ago', type: 'compliance' },
                        { title: 'Contract amendment approved', date: '2 days ago', type: 'amendment' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Settings className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-800">{activity.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Upcoming Renewals</h3>
                    <div className="space-y-4">
                      {[
                        { title: 'IT Support Services', date: '2025-06-15', value: '$245,000' },
                        { title: 'Office Supplies Contract', date: '2025-06-28', value: '$75,000' },
                        { title: 'Software Licenses', date: '2025-07-01', value: '$180,000' },
                        { title: 'Security Services', date: '2025-07-15', value: '$320,000' }
                      ].map((renewal, index) => (
                        <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{renewal.title}</p>
                            <p className="text-xs text-gray-500 mt-1">Due: {renewal.date}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">{renewal.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Activity Log</h3>
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">User performed action</p>
                        <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractAdministration;