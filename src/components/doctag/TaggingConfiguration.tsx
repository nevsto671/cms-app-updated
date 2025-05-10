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

interface TagType {
  code: string;
  name: string;
  description: string;
}

const defaultTagTypes: TagType[] = [
  { code: 'S', name: 'Solicitation', description: 'Documents related to requesting bids/proposals' },
  { code: 'P', name: 'Procurement', description: 'Documents related to purchasing and acquisition' },
  { code: 'C', name: 'Contract', description: 'Documents related to formal agreements' }
];

const TaggingConfiguration: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showAddTagTypeModal, setShowAddTagTypeModal] = useState(false);
  const [newTagType, setNewTagType] = useState<Partial<TagType>>({});
  const [tagTypes, setTagTypes] = useState<TagType[]>(defaultTagTypes);
  const [selectedTagType, setSelectedTagType] = useState('');
  const [newDocumentTitle, setNewDocumentTitle] = useState('');
  const [nextTagNumber, setNextTagNumber] = useState<number | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (selectedTagType) {
      getNextTagNumber(selectedTagType);
    }
  }, [selectedTagType]);

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

  const getNextTagNumber = async (tagType: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_next_tag_number', { p_tag_type: tagType });

      if (error) throw error;
      setNextTagNumber(data);
    } catch (err) {
      console.error('Error getting next tag number:', err);
      setError('Failed to get next tag number');
    }
  };

  const handleCreateTag = async () => {
    if (!selectedTagType || !newDocumentTitle.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('doctag_documents')
        .insert({
          tag_type: selectedTagType,
          document_title: newDocumentTitle.trim(),
          created_by: user.id
        });

      if (error) throw error;

      await fetchTags();
      setShowAddModal(false);
      setSelectedTagType('');
      setNewDocumentTitle('');
      setNextTagNumber(null);
    } catch (err) {
      console.error('Error creating tag:', err);
      setError('Failed to create tag');
    }
  };

  const handleCreateTagType = async () => {
    if (!newTagType.code || !newTagType.name) {
      setError('Please fill in all required fields');
      return;
    }

    setTagTypes([...tagTypes, newTagType as TagType]);
    setShowAddTagTypeModal(false);
    setNewTagType({});
  };

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setEditTitle(tag.document_title);
    setShowEditModal(true);
  };

  const handleDelete = (tag: Tag) => {
    setSelectedTag(tag);
    setShowDeleteConfirm(true);
  };

  const confirmEdit = async () => {
    if (!selectedTag || !editTitle.trim()) return;

    try {
      const { error } = await supabase
        .from('doctag_documents')
        .update({ document_title: editTitle.trim() })
        .eq('id', selectedTag.id);

      if (error) throw error;

      await fetchTags();
      setShowEditModal(false);
      setSelectedTag(null);
      setEditTitle('');
    } catch (err) {
      console.error('Error updating tag:', err);
      setError('Failed to update tag');
    }
  };

  const confirmDelete = async () => {
    if (!selectedTag) return;

    try {
      const { error } = await supabase
        .from('doctag_documents')
        .delete()
        .eq('id', selectedTag.id);

      if (error) throw error;

      await fetchTags();
      setShowDeleteConfirm(false);
      setSelectedTag(null);
    } catch (err) {
      console.error('Error deleting tag:', err);
      setError('Failed to delete tag');
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

  const renderAddTagModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Create New Tag</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tag Type
            </label>
            <select
              value={selectedTagType}
              onChange={(e) => setSelectedTagType(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg"
            >
              <option value="">Select Tag Type</option>
              {tagTypes.map(type => (
                <option key={type.code} value={type.code}>
                  {type.code} - {type.name}
                </option>
              ))}
            </select>
          </div>

          {selectedTagType && nextTagNumber && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag Number (Auto-generated)
              </label>
              <input
                type="text"
                value={`${selectedTagType}${nextTagNumber}`}
                disabled
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded-lg"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Title
            </label>
            <input
              type="text"
              value={newDocumentTitle}
              onChange={(e) => setNewDocumentTitle(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setShowAddTagTypeModal(true)}
            className="px-4 py-2 text-blue-600 hover:text-blue-800"
          >
            + Add Custom Tag Type
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTag}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Tag
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddTagTypeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add Custom Tag Type</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type Code (Single Character)
            </label>
            <input
              type="text"
              maxLength={1}
              value={newTagType.code || ''}
              onChange={(e) => setNewTagType({ ...newTagType, code: e.target.value.toUpperCase() })}
              className="w-full p-2 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type Name
            </label>
            <input
              type="text"
              value={newTagType.name || ''}
              onChange={(e) => setNewTagType({ ...newTagType, name: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newTagType.description || ''}
              onChange={(e) => setNewTagType({ ...newTagType, description: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setShowAddTagTypeModal(false)}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateTagType}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Tag Type
          </button>
        </div>
      </div>
    </div>
  );

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
                          onClick={() => handleEdit(tag)}
                          className="p-1 hover:bg-gray-100 rounded text-blue-600 hover:text-blue-800"
                          title="Edit Tag"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(tag)}
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Tag</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag ID
              </label>
              <input
                type="text"
                value={selectedTag?.tag_id}
                disabled
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded-lg"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Delete Tag</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete tag {selectedTag?.tag_id}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tag Modal */}
      {showAddModal && renderAddTagModal()}
      
      {/* Add Tag Type Modal */}
      {showAddTagTypeModal && renderAddTagTypeModal()}
    </div>
  );
};

export default TaggingConfiguration;