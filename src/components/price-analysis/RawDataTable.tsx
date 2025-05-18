import React from 'react';

const RawDataTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contract No.
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item No.
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Manufacturer
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mfr Part No.
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              No data available
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RawDataTable;