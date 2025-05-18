import React, { useState, useEffect } from 'react';
import { AlertCircle, Bell, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AnalysisDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotification, setShowNotification] = useState(true);
  const [overviewData, setOverviewData] = useState({
    totalCommAndProposedSales: 0,
    commercialTotalSales: 0,
    proposedTotalSales: 0,
    totalItems: 0,
    itemsWithCommercialSales: 0,
    itemsWithZeroCommercialSales: 0,
    mfcDiscountRange: { min: 0, max: 0 },
    tcDiscountRange: { min: 0, max: 0 },
    proposedDiscountRange: { min: 0, max: 0 },
    proposedTcRatio: { min: 0, max: 0 },
    proposedPriceLteMfc: { true: 0, false: 0 },
    totalManufacturers: 0
  });

  const [manufacturersData, setManufacturersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all price analysis data
        const { data, error: fetchError } = await supabase
          .from('price_analysis')
          .select('*');

        if (fetchError) throw fetchError;

        if (!data || data.length === 0) {
          setError('No data available');
          return;
        }

        // Calculate overview metrics
        const overview = {
          totalCommAndProposedSales: data.reduce((sum, item) => sum + (item.total_comm_and_proposed_sales || 0), 0),
          commercialTotalSales: data.reduce((sum, item) => sum + (item.total_commercial_sales || 0), 0),
          proposedTotalSales: data.reduce((sum, item) => sum + (item.proposed_total_sales || 0), 0),
          totalItems: data.length,
          itemsWithCommercialSales: data.filter(item => item.total_commercial_sales > 0).length,
          itemsWithZeroCommercialSales: data.filter(item => !item.total_commercial_sales || item.total_commercial_sales === 0).length,
          mfcDiscountRange: {
            min: Math.min(...data.filter(item => item.mfc_discount !== null).map(item => item.mfc_discount || 0)),
            max: Math.max(...data.filter(item => item.mfc_discount !== null).map(item => item.mfc_discount || 0))
          },
          tcDiscountRange: {
            min: Math.min(...data.filter(item => item.tc_discount !== null).map(item => item.tc_discount || 0)),
            max: Math.max(...data.filter(item => item.tc_discount !== null).map(item => item.tc_discount || 0))
          },
          proposedDiscountRange: {
            min: Math.min(...data.filter(item => item.proposed_discount !== null).map(item => item.proposed_discount || 0)),
            max: Math.max(...data.filter(item => item.proposed_discount !== null).map(item => item.proposed_discount || 0))
          },
          proposedTcRatio: {
            min: Math.min(...data.filter(item => item.tracking_ratio !== null).map(item => item.tracking_ratio || 0)),
            max: Math.max(...data.filter(item => item.tracking_ratio !== null).map(item => item.tracking_ratio || 0))
          },
          proposedPriceLteMfc: {
            true: data.filter(item => item.is_proposed_price_lte_mfc === 'YES').length,
            false: data.filter(item => item.is_proposed_price_lte_mfc === 'NO').length
          },
          totalManufacturers: new Set(data.map(item => item.mfr_name)).size
        };

        // Calculate manufacturer statistics
        const manufacturerStats = Array.from(new Set(data.map(item => item.mfr_name)))
          .map(mfrName => {
            const mfrItems = data.filter(item => item.mfr_name === mfrName);
            return {
              name: mfrName,
              items: mfrItems.length,
              totalSales: mfrItems.reduce((sum, item) => sum + (item.total_comm_and_proposed_sales || 0), 0),
              zeroSales: mfrItems.filter(item => !item.total_commercial_sales || item.total_commercial_sales === 0).length
            };
          })
          .sort((a, b) => b.totalSales - a.totalSales)
          .slice(0, 4);

        setOverviewData(overview);
        setManufacturersData(manufacturerStats);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading data...</p>
      </div>
    );
  }

  const highZeroSalesManufacturers = manufacturersData
    .filter(m => (m.zeroSales / m.items) * 100 > 15)
    .map(m => ({
      name: m.name,
      percentage: ((m.zeroSales / m.items) * 100).toFixed(1)
    }));

  return (
    <div>
      {showNotification && highZeroSalesManufacturers.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  <span className="font-medium">Attention needed:</span>{' '}
                  {highZeroSalesManufacturers.length} manufacturer(s) have high zero commercial sales rates
                </p>
                <ul className="mt-1 text-sm text-amber-600">
                  {highZeroSalesManufacturers.map(m => (
                    <li key={m.name}>• {m.name}: {m.percentage}% items with zero sales</li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="ml-4 text-amber-400 hover:text-amber-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-4 px-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-2 text-sm font-medium border-b-2 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('zeroSales')}
            className={`py-4 px-2 text-sm font-medium border-b-2 ${
              activeTab === 'zeroSales'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Zero Commercial Sales
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="bg-white">
            <h2 className="text-xl font-semibold text-gray-900 p-4 border-b border-gray-200">Proposed Offer Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              <div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Total Comm. & Proposed Sales</div>
                  <div className="text-lg font-semibold">{formatCurrency(overviewData.totalCommAndProposedSales)}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Commercial Total Sales</div>
                  <div className="text-lg font-semibold">{formatCurrency(overviewData.commercialTotalSales)}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Proposed Total Sales</div>
                  <div className="text-lg font-semibold">{formatCurrency(overviewData.proposedTotalSales)}</div>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Total Items</div>
                  <div className="text-lg font-semibold">
                    {overviewData.totalItems}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Items with Commercial Sales</div>
                  <div className="text-lg font-semibold">
                    {overviewData.itemsWithCommercialSales} ({((overviewData.itemsWithCommercialSales / overviewData.totalItems) * 100).toFixed(1)}%)
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Items with Zero Commercial Sales</div>
                  <div className="text-lg font-semibold">
                    {overviewData.itemsWithZeroCommercialSales} ({((overviewData.itemsWithZeroCommercialSales / overviewData.totalItems) * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">MFC % Discount</div>
                  <div className="text-lg font-semibold">
                    {overviewData.mfcDiscountRange.min.toFixed(2)}% - {overviewData.mfcDiscountRange.max.toFixed(2)}%
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">TC % Discount</div>
                  <div className="text-lg font-semibold">
                    {overviewData.tcDiscountRange.min.toFixed(2)}% - {overviewData.tcDiscountRange.max.toFixed(2)}%
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Proposed % Discount</div>
                  <div className="text-lg font-semibold">
                    {overviewData.proposedDiscountRange.min.toFixed(2)}% - {overviewData.proposedDiscountRange.max.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Proposed TC Ratio</div>
                  <div className="text-lg font-semibold">
                    {overviewData.proposedTcRatio.min.toFixed(2)} - {overviewData.proposedTcRatio.max.toFixed(2)}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Proposed Price ≤ MFC Price</div>
                  <div className="text-lg font-semibold">
                    {overviewData.proposedPriceLteMfc.true} ({((overviewData.proposedPriceLteMfc.true / overviewData.totalItems) * 100).toFixed(1)}%) Favorable,{' '}
                    {overviewData.proposedPriceLteMfc.false} ({((overviewData.proposedPriceLteMfc.false / overviewData.totalItems) * 100).toFixed(1)}%) Unfavorable
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Total Manufacturers</div>
                  <div className="text-lg font-semibold">{overviewData.totalManufacturers}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white mt-4">
            <h2 className="text-xl font-semibold text-gray-900 p-4 border-b border-gray-200">Manufacturers Summary</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manufacturer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Sales
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {manufacturersData.map((manufacturer) => (
                    <tr key={manufacturer.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {manufacturer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {manufacturer.items}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(manufacturer.totalSales)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'zeroSales' && (
        <div className="bg-white">
          <h2 className="text-xl font-semibold text-gray-900 p-4 border-b border-gray-200">Zero Commercial Sales by Manufacturer</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manufacturer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items with Zero Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {manufacturersData.map((manufacturer) => (
                  <tr key={manufacturer.name} className={
                    (manufacturer.zeroSales / manufacturer.items) * 100 > 15 
                      ? 'bg-amber-50'
                      : ''
                  }>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {manufacturer.name}
                      {(manufacturer.zeroSales / manufacturer.items) * 100 > 15 && (
                        <AlertCircle className="inline-block ml-2 h-4 w-4 text-amber-500" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {manufacturer.items}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {manufacturer.zeroSales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {((manufacturer.zeroSales / manufacturer.items) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDashboard;