import React, { useState } from 'react';
import { Search, Edit2, Eye, Settings, Bell, X } from 'lucide-react';
import ActionButtons from '../components/shared/ActionButtons';
import { importCodes, exportCodes, syncFromAPI } from '../lib/api';

interface PSCCode {
  code: string;
  title: string;
  portfolioGroup: string;
  type: 'Service' | 'Product' | 'R&D';
}

const mockData: PSCCode[] = [
  {
    code: 'D301',
    title: 'IT & Telecom - Facility Operation & Maintenance',
    portfolioGroup: 'Information Technology',
    type: 'Service'
  },
  {
    code: 'D302',
    title: 'IT & Telecom - Systems Development',
    portfolioGroup: 'Information Technology',
    type: 'Service'
  },
  {
    code: '7010',
    title: 'IT Equipment - Computer Systems',
    portfolioGroup: 'Information Technology',
    type: 'Product'
  },
  {
    code: 'R425',
    title: 'Engineering & Technical Services',
    portfolioGroup: 'Professional Services',
    type: 'Service'
  },
  {
    code: 'AE20',
    title: 'R&D - Defense Systems Electronics',
    portfolioGroup: 'Electronics & Communications',
    type: 'R&D'
  }
];

const categories = {
  products: [
    {
      title: 'IT & Telecommunications',
      description: 'Computer equipment, software, and telecommunications hardware',
      count: 124
    },
    {
      title: 'Medical Equipment & Supplies',
      description: 'Medical, dental, and veterinary equipment and supplies',
      count: 89
    },
    {
      title: 'Office Equipment & Supplies',
      description: 'Office machines, supplies, and equipment',
      count: 76
    },
    {
      title: 'Transportation & Logistics',
      description: 'Vehicles, transportation equipment, and supporting supplies',
      count: 103
    }
  ],
  services: [
    {
      title: 'Professional Services',
      description: 'Management, administrative, and professional support services',
      count: 142
    },
    {
      title: 'IT & Telecommunications',
      description: 'IT services, telecommunications, and data services',
      count: 87
    },
    {
      title: 'Facilities & Construction',
      description: 'Facility maintenance, repair, and construction services',
      count: 98
    },
    {
      title: 'Medical Services',
      description: 'Healthcare, medical, and social services',
      count: 65
    }
  ],
  research: [
    {
      title: 'Defense Systems',
      description: 'R&D for defense-related programs and technologies',
      count: 78
    },
    {
      title: 'Information Technology',
      description: 'R&D for IT, software, and computer systems',
      count: 51
    },
    {
      title: 'Medical & Life Sciences',
      description: 'R&D for healthcare, medical, and life sciences',
      count: 68
    },
    {
      title: 'Transportation & Equipment',
      description: 'R&D for vehicles, transportation, and related equipment',
      count: 47
    }
  ]
};

const PSCCodes: React.FC = () => {
  const [showNotification, setShowNotification] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryType, setCategoryType] = useState('All Types');
  const [portfolioGroup, setPortfolioGroup] = useState('All Portfolio Groups');
  const [spendCategory, setSpendCategory] = useState('All Spend Categories');
  const [itemsPerPage, setItemsPerPage] = useState('5');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    const result = await importCodes('PSC', { source: 'file', format: 'json', overwrite: false });
    alert(result.message);
    setLoading(false);
  };

  const handleExport = async () => {
    setLoading(true);
    const result = await exportCodes('PSC', { format: 'json', includeMetadata: true });
    setLoading(false);
  };

  const handleSync = async () => {
    setLoading(true);
    const result = await syncFromAPI('PSC');
    alert(result.message);
    setLoading(false);
  };

  const handleAdd = () => {
    // Add new code logic
  };

  return (
    <div className="p-4 max-w-[1400px] mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PSC Codes Management</h1>
          <p className="text-sm text-gray-600">Product and Service Codes - Last Updated: 2023</p>
        </div>
        <ActionButtons
          onImport={handleImport}
          onExport={handleExport}
          onSync={handleSync}
          onAdd={handleAdd}
        />
      </div>

      {/* Notification Banner */}
      {showNotification && (
        <div className="bg-gray-100 text-gray-800 px-3 py-2 flex items-center justify-between rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Bell size={16} className="text-gray-600" />
            <span className="text-sm">System maintenance scheduled for May 10, 2025 at 2:00 AM UTC. <a href="#" className="text-blue-600 hover:text-blue-800 underline">Learn more</a></span>
          </div>
          <button onClick={() => setShowNotification(false)} className="text-gray-600 hover:text-gray-800">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Search PSC Codes</h2>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search by code, title, or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <button className="absolute right-2 top-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Type</label>
            <select
              className="w-full border border-gray-200 rounded-lg p-2"
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
            >
              <option>All Types</option>
              <option>Products</option>
              <option>Services</option>
              <option>Research & Development</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Group</label>
            <select
              className="w-full border border-gray-200 rounded-lg p-2"
              value={portfolioGroup}
              onChange={(e) => setPortfolioGroup(e.target.value)}
            >
              <option>All Portfolio Groups</option>
              <option>Information Technology</option>
              <option>Professional Services</option>
              <option>Electronics & Communications</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Spend Category</label>
            <select
              className="w-full border border-gray-200 rounded-lg p-2"
              value={spendCategory}
              onChange={(e) => setSpendCategory(e.target.value)}
            >
              <option>All Spend Categories</option>
              <option>IT Services</option>
              <option>Professional Services</option>
              <option>Equipment</option>
            </select>
          </div>
        </div>
      </div>

      {/* PSC Code Structure */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">PSC Code Structure</h2>
        <p className="text-gray-600">Product and Service Codes (PSC) are four-character codes used by the federal government to identify and classify products, services, and research & development purchased under contracts.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Character 1: Type Category</h3>
            <p className="text-sm text-gray-600">Indicates the primary category - Product, Service, or Research & Development</p>
            <div className="mt-2 bg-blue-100 px-3 py-1 rounded text-blue-800 inline-block font-mono">D XXX</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Character 2: Group</h3>
            <p className="text-sm text-gray-600">Narrows down to a specific group or subcategory</p>
            <div className="mt-2 bg-green-100 px-3 py-1 rounded text-green-800 inline-block font-mono">D3 XX</div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Character 3: Class</h3>
            <p className="text-sm text-gray-600">Further refines the classification to a specific class</p>
            <div className="mt-2 bg-yellow-100 px-3 py-1 rounded text-yellow-800 inline-block font-mono">D30 X</div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Character 4: Detail</h3>
            <p className="text-sm text-gray-600">Provides the most detailed level of classification</p>
            <div className="mt-2 bg-red-100 px-3 py-1 rounded text-red-800 inline-block font-mono">D301</div>
          </div>
        </div>

        {/* Example Breakdown */}
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h3 className="font-medium mb-4">Example Breakdown: PSC Code D301 - IT & Telecom - Facility Operation & Maintenance</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="text-lg font-mono font-bold text-blue-600">D</div>
              <div className="text-sm text-gray-600">IT and Telecommunications (Service Category)</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="text-lg font-mono font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">IT and Telecommunications (Group)</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="text-lg font-mono font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">IT and Telecommunications Services (Class)</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="text-lg font-mono font-bold text-blue-600">1</div>
              <div className="text-sm text-gray-600">Facility Operation & Maintenance Services (Detail)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing 5 of 3,278 codes
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  className="border border-gray-200 rounded p-1 text-sm"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(e.target.value)}
                >
                  <option>5</option>
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span className="text-sm text-gray-600">codes per page</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Export
              </button>
              <button className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                Bulk Edit
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-sm font-medium text-gray-600 p-4">PSC Code</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Title</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Portfolio Group</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Type</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockData.map((code) => (
                <tr key={code.code} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-600 font-mono font-medium">{code.code.split('').join(' ')}</span>
                    </div>
                  </td>
                  <td className="p-4">{code.title}</td>
                  <td className="p-4">{code.portfolioGroup}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${code.type === 'Service' ? 'bg-blue-100 text-blue-800' : 
                        code.type === 'Product' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'}`}>
                      {code.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Settings size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-center gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              1
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">
              4
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">
              5
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-8">
        {/* Products Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-medium">
              P
            </div>
            <h2 className="text-lg font-semibold">Products</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {categories.products.map((category) => (
              <div key={category.title} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-medium mb-2">{category.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{category.count} codes</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">View all →</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-medium">
              S
            </div>
            <h2 className="text-lg font-semibold">Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {categories.services.map((category) => (
              <div key={category.title} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-medium mb-2">{category.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{category.count} codes</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">View all →</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research & Development Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center font-medium">
              R
            </div>
            <h2 className="text-lg font-semibold">Research & Development</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {categories.research.map((category) => (
              <div key={category.title} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-medium mb-2">{category.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{category.count} codes</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">View all →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PSCCodes;