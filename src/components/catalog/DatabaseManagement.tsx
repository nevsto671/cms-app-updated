import React, { useState } from 'react';
import { AlertTriangle, Trash2, Archive, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DatabaseManagementProps {
  onClose: () => void;
}

const DatabaseManagement: React.FC<DatabaseManagementProps> = ({ onClose }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  const createBackup = async () => {
    setBackupInProgress(true);
    setError(null);

    try {
      // Verify user has super_admin role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .single();

      if (!roleData || roleData.role !== 'super_admin') {
        throw new Error('Only super administrators can perform this action');
      }

      // Fetch all catalog and classification data
      const [
        { data: catalogItems },
        { data: catalogCodes },
        { data: catalogTags },
        { data: catalogEmbeddings },
        { data: catalogAiContent },
        { data: naicsCodes },
        { data: pscCodes },
        { data: codeRelationships }
      ] = await Promise.all([
        supabase.from('catalog_items').select('*'),
        supabase.from('catalog_codes').select('*'),
        supabase.from('catalog_tags').select('*'),
        supabase.from('catalog_embeddings').select('*'),
        supabase.from('catalog_ai_content').select('*'),
        supabase.from('naics_codes').select('*'),
        supabase.from('psc_codes').select('*'),
        supabase.from('code_relationships').select('*')
      ]);

      const backup = {
        timestamp: new Date().toISOString(),
        data: {
          catalog_items: catalogItems || [],
          catalog_codes: catalogCodes || [],
          catalog_tags: catalogTags || [],
          catalog_embeddings: catalogEmbeddings || [],
          catalog_ai_content: catalogAiContent || [],
          naics_codes: naicsCodes || [],
          psc_codes: pscCodes || [],
          code_relationships: codeRelationships || []
        }
      };

      localStorage.setItem('catalog_backup', JSON.stringify(backup));
      setLastBackup(backup.timestamp);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create backup');
    } finally {
      setBackupInProgress(false);
    }
  };

  const restoreFromBackup = async () => {
    setLoading(true);
    setError(null);

    try {
      const backupStr = localStorage.getItem('catalog_backup');
      if (!backupStr) {
        throw new Error('No backup found');
      }

      const backup = JSON.parse(backupStr);

      // Verify user has super_admin role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .single();

      if (!roleData || roleData.role !== 'super_admin') {
        throw new Error('Only super administrators can perform this action');
      }

      // Delete existing data in correct order (respecting foreign key constraints)
      await Promise.all([
        supabase.from('catalog_codes').delete().gt('id', ''),
        supabase.from('catalog_tags').delete().gt('id', ''),
        supabase.from('catalog_embeddings').delete().gt('id', ''),
        supabase.from('catalog_ai_content').delete().gt('id', ''),
        supabase.from('code_relationships').delete().gt('id', '')
      ]);

      await Promise.all([
        supabase.from('catalog_items').delete().gt('id', ''),
        supabase.from('naics_codes').delete().gt('id', ''),
        supabase.from('psc_codes').delete().gt('id', '')
      ]);

      // Restore data in correct order
      if (backup.data.naics_codes?.length) {
        await supabase.from('naics_codes').insert(backup.data.naics_codes);
      }
      if (backup.data.psc_codes?.length) {
        await supabase.from('psc_codes').insert(backup.data.psc_codes);
      }
      if (backup.data.catalog_items?.length) {
        await supabase.from('catalog_items').insert(backup.data.catalog_items);
      }
      if (backup.data.catalog_codes?.length) {
        await supabase.from('catalog_codes').insert(backup.data.catalog_codes);
      }
      if (backup.data.catalog_tags?.length) {
        await supabase.from('catalog_tags').insert(backup.data.catalog_tags);
      }
      if (backup.data.catalog_embeddings?.length) {
        await supabase.from('catalog_embeddings').insert(backup.data.catalog_embeddings);
      }
      if (backup.data.catalog_ai_content?.length) {
        await supabase.from('catalog_ai_content').insert(backup.data.catalog_ai_content);
      }
      if (backup.data.code_relationships?.length) {
        await supabase.from('code_relationships').insert(backup.data.code_relationships);
      }

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore from backup');
    } finally {
      setLoading(false);
    }
  };

  const handleFlushDatabase = async () => {
    if (confirmText !== 'FLUSH DATABASE') {
      setError('Please type the confirmation text exactly as shown');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Verify user has super_admin role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .single();

      if (!roleData || roleData.role !== 'super_admin') {
        throw new Error('Only super administrators can perform this action');
      }

      // Create backup before flushing
      await createBackup();

      // Delete data in correct order (respecting foreign key constraints)
      await Promise.all([
        supabase.from('catalog_codes').delete().gt('id', ''),
        supabase.from('catalog_tags').delete().gt('id', ''),
        supabase.from('catalog_embeddings').delete().gt('id', ''),
        supabase.from('catalog_ai_content').delete().gt('id', ''),
        supabase.from('code_relationships').delete().gt('id', '')
      ]);

      await Promise.all([
        supabase.from('catalog_items').delete().gt('id', ''),
        supabase.from('naics_codes').delete().gt('id', ''),
        supabase.from('psc_codes').delete().gt('id', '')
      ]);

      onClose();
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to flush database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto">
      <div className="flex items-center gap-3 mb-4 text-red-600">
        <AlertTriangle className="h-6 w-6" />
        <h2 className="text-lg font-semibold">Database Management</h2>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h3 className="text-red-800 font-medium mb-2">⚠️ Warning: Destructive Action</h3>
        <p className="text-red-700 text-sm">
          This action will permanently delete ALL catalog data from the database. Make sure to create a backup first.
        </p>
      </div>

      {/* Backup Section */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-blue-800 font-medium">Database Backup</h3>
          {lastBackup && (
            <span className="text-xs text-blue-600">
              Last backup: {new Date(lastBackup).toLocaleString()}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <button
            onClick={createBackup}
            disabled={backupInProgress}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
          >
            <Archive className="h-4 w-4" />
            {backupInProgress ? 'Creating Backup...' : 'Create Backup'}
          </button>
          <button
            onClick={restoreFromBackup}
            disabled={loading || !lastBackup}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Restore from Backup
          </button>
        </div>
      </div>

      {!isConfirming ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to flush the database? This will remove all:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Catalog items</li>
            <li>Classification codes</li>
            <li>Tags</li>
            <li>AI-generated content</li>
            <li>Embeddings</li>
          </ul>
          <button
            onClick={() => setIsConfirming(true)}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Flush Database
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600">
            To confirm, please type <span className="font-mono font-bold">FLUSH DATABASE</span> below:
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Type confirmation text..."
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            onClick={handleFlushDatabase}
            disabled={loading || confirmText !== 'FLUSH DATABASE'}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {loading ? 'Flushing Database...' : 'Confirm Flush'}
          </button>
          <button
            onClick={() => setIsConfirming(false)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default DatabaseManagement;