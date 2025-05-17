import Papa from 'papaparse';

interface PriceData {
  sin: string;
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

const PriceExport: React.FC = () => {
  const handleExport = () => {
    const csvData = mockData.map(item => ({
      'SIN': item.sin,
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
    link.setAttribute('download', `price_analysis_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIN</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commercial Price</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MFC Price</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MFC Discount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposed Price</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposed Discount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking Ratio</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mockData.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900">{item.sin}</td>
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
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          Export to CSV
        </button>
      </div>
    </div>
  );
};

export default PriceExport;