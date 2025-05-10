import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Papa from 'papaparse';

interface ImportStatus {
  total: number;
  processed: number;
  successful: number;
  failed: number;
}

// CSV template headers and example row
const CSV_HEADERS = [
  'tag_no',
  'description'
];

const CSV_EXAMPLE = [
  'S1',
  'Solicitation Documents'
];

const TagImport: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ImportStatus | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a CSV file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please upload a CSV file');
    }
  };

  const downloadTemplate = () => {
    // Create CSV content with headers and example row
    const csvContent = [
      CSV_HEADERS.join(','),
      CSV_EXAMPLE.map(field => `"${field}"`).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tag-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validateRow = (row: any): boolean => {
    const requiredFields = ['tag_no', 'description'];
    return requiredFields.every(field => {
      if (!(field in row)) {
        throw new Error(`Missing required field: ${field}`);
      }
      return true;
    });
  };

  const processImport = async (rows: any[]) => {
    const status: ImportStatus = {
      total: rows.length,
      processed: 0,
      successful: 0,
      failed: 0
    };

    for (const row of rows) {
      try {
        // Validate row structure
        if (!validateRow(row)) {
          throw new Error('Invalid row structure');
        }

        // Parse tag number into type and number
        const tagMatch = row.tag_no.match(/^([A-Za-z])(\d+)$/);
        if (!tagMatch) {
          throw new Error(`Invalid tag number format: ${row.tag_no}`);
        }

        const [, tagType, tagNumber] = tagMatch;

        const { error } = await supabase
          .from('tag_types')
          .insert({
            code: tagType.toUpperCase(),
            document_type: tagType.toUpperCase(),
            description: row.description
          });

        if (error) throw error;

        status.successful++;
      } catch (err) {
        status.failed++;
        console.error('Import error:', err);
      }
      
      status.processed++;
      setStatus({ ...status });
    }

    return status;
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError(null);
    setStatus(null);

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          if (results.errors.length > 0) {
            setError(`CSV parsing error: ${results.errors[0].message}`);
            setImporting(false);
            return;
          }

          const finalStatus = await processImport(results.data);
          
          if (finalStatus.successful > 0) {
            setTimeout(() => {
              onComplete();
            }, 2000);
          }
        },
        error: (error) => {
          setError(`Failed to parse CSV file: ${error.message}`);
          setImporting(false);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data');
      setImporting(false);
    }
  };

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Import Tag Data</h2>
        <p className="text-sm text-gray-600">Upload a CSV file containing tag data</p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-1">Need a template?</h3>
            <p className="text-sm text-blue-600">
              Download our CSV template file to ensure your data is formatted correctly
            </p>
          </div>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Download size={16} />
            Download Template
          </button>
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".csv"
          className="hidden"
        />

        {file ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <FileText size={24} />
              <span>{file.name}</span>
              <button
                onClick={() => setFile(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            
            <button
              onClick={handleImport}
              disabled={importing}
              className={`px-4 py-2 rounded-lg text-white ${
                importing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {importing ? 'Importing...' : 'Start Import'}
            </button>
          </div>
        ) : (
          <div>
            <Upload size={32} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop your CSV file here, or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-500 hover:text-blue-600"
              >
                browse
              </button>
            </p>
            <p className="text-sm text-gray-500">
              Supported format: CSV
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {status && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-800">Import Progress</h3>
            <span className="text-sm text-gray-600">
              {status.processed} of {status.total} items
            </span>
          </div>
          
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(status.processed / status.total) * 100}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle size={16} />
              <span className="text-sm">
                {status.successful} items imported successfully
              </span>
            </div>
            {status.failed > 0 && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={16} />
                <span className="text-sm">
                  {status.failed} items failed to import
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagImport;