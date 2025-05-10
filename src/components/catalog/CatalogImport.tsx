import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CatalogItem } from '../../types/catalog';
import Papa from 'papaparse';

interface ImportStatus {
  total: number;
  processed: number;
  successful: number;
  failed: number;
}

// CSV template headers and example row
const CSV_HEADERS = [
  'naics_code',
  'psc_code',
  'sin',
  'title',
  'description',
  'category',
  'item_no',
  'mfr_name',
  'mfr_item_no',
  'uom',
  'govt_price',
  'contract_name',
  'contract_no'
];

const CSV_EXAMPLE = [
  '541512',
  'D302',
  '54151S',
  'IT System Development Services',
  'Custom software development and system integration services',
  'Information Technology',
  'IT-DEV-001',
  'TechCorp Solutions',
  'TCS-DEV-2025',
  'HR',
  '150.00',
  'IT Professional Services',
  'GS-35F-0234X'
];

const CatalogImport: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
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
    a.download = 'catalog-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validateItem = (item: any): item is CatalogItem => {
    const requiredFields = [
      'sin',
      'title',
      'category',
      'mfr_name',
      'mfr_item_no',
      'govt_price'
    ];

    return requiredFields.every(field => {
      if (!(field in item)) {
        throw new Error(`Missing required field: ${field}`);
      }
      if (field === 'govt_price') {
        const price = parseFloat(item[field]);
        if (isNaN(price)) {
          throw new Error('govt_price must be a valid number');
        }
        item[field] = price; // Convert string to number
      }
      return true;
    });
  };

  const processImport = async (items: any[]) => {
    const status: ImportStatus = {
      total: items.length,
      processed: 0,
      successful: 0,
      failed: 0
    };

    for (const item of items) {
      try {
        // Validate item structure
        if (!validateItem(item)) {
          throw new Error('Invalid item structure');
        }

        const { error } = await supabase
          .from('catalog_items')
          .insert([{
            sin: item.sin,
            title: item.title,
            description: item.description,
            category: item.category,
            item_no: item.item_no,
            mfr_name: item.mfr_name,
            mfr_item_no: item.mfr_item_no,
            govt_price: item.govt_price,
            contract_name: item.contract_name,
            contract_no: item.contract_no,
            uom: item.uom
          }]);

        if (error) throw error;

        // If successful, create catalog codes
        if (item.naics_code) {
          await supabase
            .from('catalog_codes')
            .insert([{
              catalog_item_id: item.id,
              code_type: 'NAICS',
              code: item.naics_code
            }]);
        }

        if (item.psc_code) {
          await supabase
            .from('catalog_codes')
            .insert([{
              catalog_item_id: item.id,
              code_type: 'PSC',
              code: item.psc_code
            }]);
        }

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
      // Parse CSV file
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
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Import Catalog Data</h2>
        <p className="text-sm text-gray-600">Upload a CSV file containing catalog items</p>
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

export default CatalogImport;