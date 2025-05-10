import { supabase } from './supabase';

interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: number;
  mimeType?: string;
  modifiedAt: Date;
}

interface FileOperationResult {
  success: boolean;
  error?: string;
  data?: any;
}

export class FileSystem {
  private rootPath: string;
  private userId: string | null;

  constructor() {
    this.rootPath = '/files';
    this.userId = null;
  }

  async initialize() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error('Failed to initialize filesystem: ' + error.message);
    }
    this.userId = session?.user?.id || null;
  }

  async createFolder(path: string, name: string): Promise<FileOperationResult> {
    try {
      if (!this.userId) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('file_nodes')
        .insert({
          user_id: this.userId,
          name,
          path: `${path}/${name}`.replace(/\/+/g, '/'),
          type: 'folder',
          modified_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to create folder'
      };
    }
  }

  async writeFile(path: string, content: string | Blob): Promise<FileOperationResult> {
    try {
      if (!this.userId) {
        throw new Error('User not authenticated');
      }

      // First create file record in database
      const { data: fileNode, error: dbError } = await supabase
        .from('file_nodes')
        .insert({
          user_id: this.userId,
          name: path.split('/').pop(),
          path,
          type: 'file',
          size: content instanceof Blob ? content.size : new Blob([content]).size,
          mime_type: content instanceof Blob ? content.type : 'text/plain',
          modified_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Then upload file content to storage
      const { error: storageError } = await supabase.storage
        .from('files')
        .upload(
          `${this.userId}/${path}`,
          content,
          {
            upsert: true,
            contentType: content instanceof Blob ? content.type : 'text/plain'
          }
        );

      if (storageError) throw storageError;

      return {
        success: true,
        data: fileNode
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to write file'
      };
    }
  }

  async readFile(path: string): Promise<FileOperationResult> {
    try {
      if (!this.userId) {
        throw new Error('User not authenticated');
      }

      // Get file metadata
      const { data: fileNode, error: dbError } = await supabase
        .from('file_nodes')
        .select()
        .eq('user_id', this.userId)
        .eq('path', path)
        .single();

      if (dbError) throw dbError;

      // Get file content
      const { data, error: storageError } = await supabase.storage
        .from('files')
        .download(`${this.userId}/${path}`);

      if (storageError) throw storageError;

      return {
        success: true,
        data: {
          metadata: fileNode,
          content: data
        }
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to read file'
      };
    }
  }

  async delete(path: string): Promise<FileOperationResult> {
    try {
      if (!this.userId) {
        throw new Error('User not authenticated');
      }

      // Delete file/folder record from database
      const { error: dbError } = await supabase
        .from('file_nodes')
        .delete()
        .eq('user_id', this.userId)
        .eq('path', path);

      if (dbError) throw dbError;

      // If it's a file, also delete from storage
      const { error: storageError } = await supabase.storage
        .from('files')
        .remove([`${this.userId}/${path}`]);

      if (storageError) throw storageError;

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to delete'
      };
    }
  }

  async move(oldPath: string, newPath: string): Promise<FileOperationResult> {
    try {
      if (!this.userId) {
        throw new Error('User not authenticated');
      }

      // Update path in database
      const { error: dbError } = await supabase
        .from('file_nodes')
        .update({ path: newPath })
        .eq('user_id', this.userId)
        .eq('path', oldPath);

      if (dbError) throw dbError;

      // Move file in storage if it's a file
      const { error: storageError } = await supabase.storage
        .from('files')
        .move(
          `${this.userId}/${oldPath}`,
          `${this.userId}/${newPath}`
        );

      if (storageError) throw storageError;

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to move'
      };
    }
  }

  async list(path: string): Promise<FileOperationResult> {
    try {
      if (!this.userId) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('file_nodes')
        .select()
        .eq('user_id', this.userId)
        .like('path', `${path}/%`);

      if (error) throw error;

      return {
        success: true,
        data: data.map(node => ({
          id: node.id,
          name: node.name,
          path: node.path,
          type: node.type,
          size: node.size,
          mimeType: node.mime_type,
          modifiedAt: new Date(node.modified_at)
        }))
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to list directory'
      };
    }
  }
}

export const filesystem = new FileSystem();