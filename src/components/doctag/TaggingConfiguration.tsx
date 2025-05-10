import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Upload, X, Settings } from 'lucide-react';
import TagImport from './TagImport';
import { supabase } from '../../lib/supabase';

interface Tag {
  id: string;
  tag_id: string;
  document_title: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

const TaggingConfiguration: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('doctag_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTags(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleImportComplete = () => {
    setShowImportModal(false);
    fetchTags();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTags = tags.filter(tag => {
    const matchesSearch = searchTerm === '' || 
      tag.tag_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.document_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || tag.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tag Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <Upload size={16} />
            Import Tags
          </button>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            Add Tag
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by tag ID or document title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <Filter size={20} />
        </button>
      </div>

      {/* Tags Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Tag ID</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Document Title</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Status</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Created Date</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Last Updated</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Loading tags...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredTags.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No tags found
                  </td>
                </tr>
              ) : (
                filteredTags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {tag.tag_id}
                      </span>
                    </td>
                    <td className="p-4 text-gray-900">{tag.document_title}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tag.status)}`}>
                        {tag.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{formatDate(tag.created_at)}</td>
                    <td className="p-4 text-gray-600">{formatDate(tag.updated_at)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          className="p-1 hover:bg-gray-100 rounded text-blue-600 hover:text-blue-800"
                          title="Edit Tag"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded text-red-600 hover:text-red-800"
                          title="Delete Tag"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Import Tags</h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <TagImport onComplete={handleImportComplete} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaggingConfiguration;