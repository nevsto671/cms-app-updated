import React, { useState } from 'react';
import { FileText, Upload, Download, Trash2, Edit2, Search, Filter, Plus, X, AlertCircle } from 'lucide-react';

interface Document {
  id: string;
  tag_symbol: string;
  tag_type: string;
  tag_number: number;
  title: string;
  description: string;
  file_size: string;
  mime_type: string;
  modified: string;
  status: 'active' | 'archived' | 'pending';
}

const DocumentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('explorer');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const mockDocuments: Document[] = [
    { 
      id: '1', 
      tag_symbol: '⭐', 
      tag_type: 'S',
      tag_number: 1,
      title: 'RFP Documentation', 
      description: 'Request for Proposal documentation for Project X',
      file_size: '2.5 MB', 
      mime_type: 'application/pdf',
      modified: '2025-05-10', 
      status: 'active' 
    },
    { 
      id: '2', 
      tag_symbol: '📦', 
      tag_type: 'P',
      tag_number: 1,
      title: 'Purchase Order #123', 
      description: 'Purchase order for office supplies',
      file_size: '1.2 MB', 
      mime_type: 'application/docx',
      modified: '2025-05-09', 
      status: 'pending' 
    },
    { 
      id: '3', 
      tag_symbol: '📝', 
      tag_type: 'C',
      tag_number: 1,
      title: 'Service Agreement', 
      description: 'Annual maintenance contract',
      file_size: '3.1 MB', 
      mime_type: 'application/pdf',
      modified: '2025-05-08', 
      status: 'active' 
    }
  ];

  const handleSelectDocument = (id: string) => {
    setSelectedDocuments(prev => 
      prev.includes(id) ? prev.filter(docId => docId !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTagDisplay = (doc: Document) => {
    return `${doc.tag_symbol}${doc.tag_type}-${doc.tag_number}`;
  };

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getTagDisplay(doc).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesType = filterType === 'all' || doc.tag_type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          {[
            { id: 'explorer', label: 'Document Explorer' },
            { id: 'batch', label: 'Batch Operations' },
            { id: 'import', label: 'Import/Export' },
            { id: 'validation', label: 'Validation Tools' },
            { id: 'storage', label: 'Storage Management' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Upload size={16} />
            Upload
          </button>
          <button
            disabled={selectedDocuments.length === 0}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={16} />
            Download
          </button>
          <button
            disabled={selectedDocuments.length === 0}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            disabled={selectedDocuments.length === 0}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 border border-gray-200 rounded-lg hover:bg-gray-50 ${
              showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : ''
            }`}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2"
            >
              <option value="all">All Types</option>
              <option value="S">Solicitation (⭐S)</option>
              <option value="P">Procurement (📦P)</option>
              <option value="C">Contract (📝C)</option>
            </select>
          </div>
        </div>
      )}

      {/* Document List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 p-4">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.length === filteredDocuments.length}
                    onChange={() => {
                      if (selectedDocuments.length === filteredDocuments.length) {
                        setSelectedDocuments([]);
                      } else {
                        setSelectedDocuments(filteredDocuments.map(d => d.id));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Tag</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Title</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Type</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Size</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Modified</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Status</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={() => handleSelectDocument(doc.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4 font-mono">{getTagDisplay(doc)}</td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">{doc.title}</div>
                      <div className="text-sm text-gray-500">{doc.description}</div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{doc.mime_type}</td>
                  <td className="p-4 text-sm text-gray-600">{doc.file_size}</td>
                  <td className="p-4 text-sm text-gray-600">{doc.modified}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Download size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Trash2 size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Document</h3>
              <button onClick={() => setShowUploadModal(false)}>
                <X size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select className="w-full border border-gray-200 rounded-lg p-2">
                  <option value="S">Solicitation (⭐S)</option>
                  <option value="P">Procurement (📦P)</option>
                  <option value="C">Contract (📝C)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  placeholder="Enter document title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg p-2"
                  rows={3}
                  placeholder="Enter document description"
                />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input type="file" className="hidden" id="file-upload" />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-500 hover:text-blue-600"
                >
                  Click to upload
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  or drag and drop files here
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManagement;