import React, { useState } from 'react';
import { ChevronLeft, Download, Printer, Share2, Star, History, MessageSquare, Tag, Edit2 } from 'lucide-react';

interface DocumentPreviewInterfaceProps {
  onBack: () => void;
  documentId: string;
}

const DocumentPreviewInterface: React.FC<DocumentPreviewInterfaceProps> = ({ onBack, documentId }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'details' | 'history'>('preview');
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Mock document data
  const document = {
    id: documentId,
    name: 'Contract Agreement.pdf',
    type: 'pdf',
    size: '2.5 MB',
    created: '2025-03-15',
    modified: '2025-04-20',
    author: 'John Smith',
    status: 'active',
    tags: ['signed', 'legal', 'current'],
    version: '1.2',
    comments: [
      {
        id: '1',
        author: 'Jane Doe',
        text: 'Please review section 3.2',
        date: '2025-04-18'
      },
      {
        id: '2',
        author: 'John Smith',
        text: 'Updated terms as requested',
        date: '2025-04-19'
      }
    ],
    history: [
      {
        id: '1',
        action: 'Modified',
        user: 'John Smith',
        date: '2025-04-20',
        details: 'Updated contract terms'
      },
      {
        id: '2',
        action: 'Commented',
        user: 'Jane Doe',
        date: '2025-04-18',
        details: 'Added review comment'
      },
      {
        id: '3',
        action: 'Created',
        user: 'John Smith',
        date: '2025-03-15',
        details: 'Initial document creation'
      }
    ]
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      // Add tag logic here
      setNewTag('');
      setShowTagModal(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
      <div className="bg-[#1c1f26] text-white px-4 py-3 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-3 hover:bg-[#2a2f3a] p-1 rounded transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">{document.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-[#2a2f3a] rounded">
            <Download size={18} />
          </button>
          <button className="p-2 hover:bg-[#2a2f3a] rounded">
            <Printer size={18} />
          </button>
          <button className="p-2 hover:bg-[#2a2f3a] rounded">
            <Share2 size={18} />
          </button>
          <button className="p-2 hover:bg-[#2a2f3a] rounded">
            <Star size={18} />
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'preview'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'details'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'history'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'preview' && (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <div className="text-gray-500">Document Preview</div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Document Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <p className="font-medium">{document.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Type</label>
                    <p className="font-medium">{document.type.toUpperCase()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Size</label>
                    <p className="font-medium">{document.size}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Version</label>
                    <p className="font-medium">{document.version}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <p className="font-medium capitalize">{document.status}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {document.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button className="hover:text-gray-900">×</button>
                    </span>
                  ))}
                  <button
                    onClick={() => setShowTagModal(true)}
                    className="px-3 py-1 border border-gray-200 text-gray-600 rounded-full text-sm hover:bg-gray-50 flex items-center gap-1"
                  >
                    <Tag size={14} />
                    Add Tag
                  </button>
                </div>

                <h3 className="text-lg font-semibold mb-4">Comments</h3>
                <div className="space-y-4">
                  {document.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-sm text-gray-500 ml-2">{comment.date}</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit2 size={14} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">{comment.text}</p>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 p-2 border border-gray-200 rounded-lg"
                    />
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Document History</h3>
            <div className="space-y-4">
              {document.history.map((event) => (
                <div key={event.id} className="flex items-start gap-4">
                  <div className="mt-1">
                    <History size={16} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <span className="font-medium">{event.action}</span>
                        <span className="text-gray-500"> by </span>
                        <span className="font-medium">{event.user}</span>
                      </div>
                      <span className="text-sm text-gray-500">{event.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Tag</h2>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter tag name"
              className="w-full p-2 border border-gray-200 rounded-lg mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTagModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentPreviewInterface;