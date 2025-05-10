import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
  folder_count: number;
  action_count: number;
  next_due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Action {
  id: string;
  folder_id: string;
  action_type: string;
  action_id: string;
  order_id: string;
  mod_id: string;
  state: string;
  status: string;
  receipt: boolean;
  goals: string | null;
}

export interface DocumentType {
  id: string;
  folder_id: string;
  name: string;
  description: string | null;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

export const useFileCabinet = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);

  const fetchFolders = async (parentId: string | null = null) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('file_cabinet_folders')
        .select('*')
        .is('parent_id', parentId)
        .order('name');

      if (error) throw error;
      setFolders(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching folders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  };

  const fetchActions = async (folderId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('file_cabinet_actions')
        .select('*')
        .eq('folder_id', folderId)
        .order('created_at');

      if (error) throw error;
      setActions(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching actions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch actions');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentTypes = async (folderId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('file_cabinet_document_types')
        .select('*')
        .eq('folder_id', folderId)
        .order('name');

      if (error) throw error;
      setDocumentTypes(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching document types:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch document types');
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (name: string, parentId: string | null = null) => {
    try {
      const { data, error } = await supabase
        .from('file_cabinet_folders')
        .insert([
          { name, parent_id: parentId }
        ])
        .select()
        .single();

      if (error) throw error;
      setFolders([...folders, data]);
      return data;
    } catch (err) {
      console.error('Error creating folder:', err);
      throw err;
    }
  };

  const updateFolder = async (id: string, updates: Partial<Folder>) => {
    try {
      const { data, error } = await supabase
        .from('file_cabinet_folders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setFolders(folders.map(f => f.id === id ? data : f));
      return data;
    } catch (err) {
      console.error('Error updating folder:', err);
      throw err;
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('file_cabinet_folders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFolders(folders.filter(f => f.id !== id));
    } catch (err) {
      console.error('Error deleting folder:', err);
      throw err;
    }
  };

  const createDocumentType = async (folderId: string, name: string, description?: string) => {
    try {
      const { data, error } = await supabase
        .from('file_cabinet_document_types')
        .insert([
          { folder_id: folderId, name, description }
        ])
        .select()
        .single();

      if (error) throw error;
      setDocumentTypes([...documentTypes, data]);
      return data;
    } catch (err) {
      console.error('Error creating document type:', err);
      throw err;
    }
  };

  const updateDocumentType = async (id: string, updates: Partial<DocumentType>) => {
    try {
      const { data, error } = await supabase
        .from('file_cabinet_document_types')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setDocumentTypes(documentTypes.map(dt => dt.id === id ? data : dt));
      return data;
    } catch (err) {
      console.error('Error updating document type:', err);
      throw err;
    }
  };

  const deleteDocumentType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('file_cabinet_document_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDocumentTypes(documentTypes.filter(dt => dt.id !== id));
    } catch (err) {
      console.error('Error deleting document type:', err);
      throw err;
    }
  };

  return {
    folders,
    actions,
    documentTypes,
    loading,
    error,
    fetchFolders,
    fetchActions,
    fetchDocumentTypes,
    createFolder,
    updateFolder,
    deleteFolder,
    createDocumentType,
    updateDocumentType,
    deleteDocumentType
  };
};