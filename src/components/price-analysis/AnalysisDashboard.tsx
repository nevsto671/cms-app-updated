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

  const [manufacturersData, setManufacturersData] = useState<any[]>([]);
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
          setLoading(false);
          return;
        }

        // Calculate overview metrics
        const validData = data.filter(item => item !== null);
        
        // Calculate sales totals
        const totalCommAndProposedSales = validData.reduce((sum, item) => 
          sum + (Number(item.total_comm_and_proposed_sales) || 0), 0);
        
        const proposedTotalSales = validData.reduce((sum, item) => 
          sum + (Number(item.proposed_total_sales) || 0), 0);
        
        // Commercial sales should be the difference between total and proposed
        const commercialTotalSales = totalCommAndProposedSales - proposedTotalSales;

        // Count items with commercial sales
        const itemsWithCommercialSales = validData.filter(item => 
          item.total_commercial_sales && item.total_commercial_sales > 0).length;
        
        // Get valid discount values (filter out null/undefined)
        const validMfcDiscounts = validData
          .filter(item => item.mfc_discount !== null && item.mfc_discount !== undefined)
          .map(item => Number(item.mfc_discount));
        
        const validTcDiscounts = validData
          .filter(item => item.tc_discount !== null && item.tc_discount !== undefined)
          .map(item => Number(item.tc_discount));
        
        const validProposedDiscounts = validData
          .filter(item => item.proposed_discount !== null && item.proposed_discount !== undefined)
          .map(item => Number(item.proposed_discount));
        
        const validTrackingRatios = validData
          .filter(item => item.tracking_ratio !== null && item.tracking_ratio !== undefined)
          .map(item => Number(item.tracking_ratio));

        // Count favorable vs unfavorable pricing
        const favorablePricing = validData.filter(item => item.is_proposed_price_lte_mfc === 'YES').length;
        const unfavorablePricing = validData.filter(item => item.is_proposed_price_lte_mfc === 'NO').length;

        // Get unique manufacturers
        const uniqueManufacturers = new Set(validData.map(item => item.mfr_name));

        const overview = {
          totalCommAndProposedSales,
          commercialTotalSales,
          proposedTotalSales,
          totalItems: validData.length,
          itemsWithCommercialSales,
          itemsWithZeroCommercialSales: validData.length - itemsWithCommercialSales,
          mfcDiscountRange: {
            min: validMfcDiscounts.length ? Math.min(...validMfcDiscounts) : 0,
            max: validMfcDiscounts.length ? Math.max(...validMfcDiscounts) : 0
          },
          tcDiscountRange: {
            min: validTcDiscounts.length ? Math.min(...validTcDiscounts) : 0,
            max: validTcDiscounts.length ? Math.max(...validTcDiscounts) : 0
          },
          proposedDiscountRange: {
            min: validProposedDiscounts.length ? Math.min(...validProposedDiscounts) : 0,
            max: validProposedDiscounts.length ? Math.max(...validProposedDiscounts) : 0
          },
          proposedTcRatio: {
            min: validTrackingRatios.length ? Math.min(...validTrackingRatios) : 0,
            max: validTrackingRatios.length ? Math.max(...validTrackingRatios) : 0
          },
          proposedPriceLteMfc: {
            true: favorablePricing,
            false: unfavorablePricing
          },
          totalManufacturers: uniqueManufacturers.size
        };

        // Calculate manufacturer statistics - get all manufacturers
        const manufacturerMap = new Map();
        
        validData.forEach(item => {
          if (!item.mfr_name) return;
          
          const mfrName = item.mfr_name;
          if (!manufacturerMap.has(mfrName)) {
            manufacturerMap.set(mfrName, {
              name: mfrName,
              items: 0,
              totalSales: 0,
              zeroSales: 0
            });
          }
          
          const mfrData = manufacturerMap.get(mfrName);
          mfrData.items++;
          mfrData.totalSales += Number(item.total_comm_and_proposed_sales) || 0;
          
          if (!item.total_commercial_sales || item.total_commercial_sales === 0) {
            mfrData.zeroSales++;
          }
        });
        
        // Convert map to array and sort by total sales
        const manufacturerStats = Array.from(manufacturerMap.values())
          .sort((a, b) => b.totalSales - a.totalSales);

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zero Sales Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zero Sales %
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
                        {formatCurrency(manufacturer.totalSales)}
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