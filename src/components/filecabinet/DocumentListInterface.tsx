import React, { useState } from 'react';
import { ChevronLeft, File, Plus, Trash2, Edit2, Download, Search, FileText, FileImage, FileSpreadsheet, File as FilePdf } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'spreadsheet' | 'text';
  size: string;
  lastModified: string;
  status: 'active' | 'archived';
  tags: string[];
}

interface DocumentListInterfaceProps {
  onBack: () => void;
  onDocumentSelect: (documentId: string) => void;
  typeName: string;
}

const DocumentListInterface: React.FC<DocumentListInterfaceProps> = ({ onBack, onDocumentSelect, typeName }) => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Contract Agreement.pdf',
      type: 'pdf',
      size: '2.5 MB',
      lastModified: '2025-04-20',
      status: 'active',
      tags: ['signed', 'legal', 'current']
    },
    {
      id: '2',
      name: 'Requirements Specification.xlsx',
      type: 'spreadsheet',
      size: '1.2 MB',
      lastModified: '2025-04-18',
      status: 'active',
      tags: ['technical', 'specifications']
    },
    {
      id: '3',
      name: 'Signature Page.jpg',
      type: 'image',
      size: '500 KB',
      lastModified: '2025-04-15',
      status: 'active',
      tags: ['signed', 'legal']
    },
    {
      id: '4',
      name: 'Meeting Notes.txt',
      type: 'text',
      size: '15 KB',
      lastModified: '2025-04-12',
      status: 'active',
      tags: ['notes', 'internal']
    }
  ]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameDocumentName, setRenameDocumentName] = useState('');

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FilePdf className="text-red-500" />;
      case 'image':
        return <FileImage className="text-blue-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="text-green-500" />;
      case 'text':
        return <FileText className="text-gray-500" />;
      default:
        return <File className="text-gray-500" />;
    }
  };

  const handleSelectItem = (id: string, isDoubleClick: boolean = false) => {
    if (isDoubleClick) {
      onDocumentSelect(id);
      return;
    }

    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
      <div className="bg-[#1c1f26] text-white px-4 py-3 flex items-center rounded-t-lg">
        <button
          onClick={onBack}
          className="mr-3 hover:bg-[#2a2f3a] p-1 rounded transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">File Cabinet | {typeName} | Documents</h1>
      </div>

      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1.5 text-sm"
          >
            <Plus size={16} />
            Upload
          </button>

          <button
            onClick={() => handleDelete()}
            disabled={selectedItems.length === 0}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            Delete
          </button>

          <button
            onClick={() => setShowRenameModal(true)}
            disabled={selectedItems.length !== 1}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit2 size={16} />
            Rename
          </button>

          <button
            disabled={selectedItems.length === 0}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            Download
          </button>

          <div className="ml-auto relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedItems.length === documents.length && documents.length > 0}
                  onChange={() => setSelectedItems(selectedItems.length === documents.length ? [] : documents.map(d => d.id))}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Name</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Size</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Last Modified</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Tags</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr
                key={doc.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedItems.includes(doc.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelectItem(doc.id)}
                onDoubleClick={() => handleSelectItem(doc.id, true)}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(doc.id)}
                    onChange={() => handleSelectItem(doc.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center">
                    {getDocumentIcon(doc.type)}
                    <span className="ml-2">{doc.name}</span>
                  </div>
                </td>
                <td className="p-4">{doc.size}</td>
                <td className="p-4">{doc.lastModified}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    {doc.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {doc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                className="hidden"
                id="file-upload"
              />
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
      )}

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Rename Document</h2>
            <input
              type="text"
              value={renameDocumentName}
              onChange={(e) => setRenameDocumentName(e.target.value)}
              placeholder="Enter new name"
              className="w-full p-2 border border-gray-200 rounded-lg mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRenameModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle rename logic
                  setShowRenameModal(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListInterface;