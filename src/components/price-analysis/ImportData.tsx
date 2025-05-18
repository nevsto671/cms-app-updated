import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, Download } from 'lucide-react';
import Papa from 'papaparse';
import { supabase } from '../../lib/supabase';

interface ImportStatus {
  total: number;
  processed: number;
  successful: number;
  failed: number;
}

interface ImportDataProps {
  onComplete: () => void;
}

const ImportData: React.FC<ImportDataProps> = ({ onComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ImportStatus | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CSV_HEADERS = [
    'sin',
    'item_number',
    'description',
    'mfr_name',
    'mfr_number',
    'units_sold_qty',
    'total_comm_and_proposed_sales',
    'commercial_price_list',
    'mfc_price',
    'tc_price',
    'tc_total_sales',
    'proposed_price',
    'proposed_total_sales'
  ];

  const CSV_EXAMPLE = [
    'L39IT-001',
    'ITEM-001',
    'Sample Product Description',
    'Manufacturer Inc',
    'MFR-123',
    '100',
    '150000.00',
    '1500.00',
    '1200.00',
    '1100.00',
    '110000.00',
    '1000.00',
    '100000.00'
  ];

  const downloadTemplate = () => {
    const csvContent = [
      CSV_HEADERS.join(','),
      CSV_EXAMPLE.map(field => `"${field}"`).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'price_analysis_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validateRow = (row: any): boolean => {
    const requiredFields = [
      'sin',
      'item_number',
      'mfr_name',
      'mfr_number'
    ];

    const numericFields = [
      'units_sold_qty',
      'total_comm_and_proposed_sales',
      'commercial_price_list',
      'mfc_price',
      'tc_price',
      'tc_total_sales',
      'proposed_price',
      'proposed_total_sales'
    ];

    // Check required fields
    for (const field of requiredFields) {
      if (!row[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate numeric fields
    for (const field of numericFields) {
      if (row[field] && isNaN(parseFloat(row[field]))) {
        throw new Error(`Invalid numeric value for ${field}`);
      }
    }

    return true;
  };

  const processImport = async (data: any[]) => {
    const status: ImportStatus = {
      total: data.length,
      processed: 0,
      successful: 0,
      failed: 0
    };

    for (const row of data) {
      try {
        validateRow(row);

        const { error: insertError } = await supabase
          .from('price_analysis')
          .insert([{
            sin: row.sin,
            item_number: row.item_number,
            description: row.description,
            mfr_name: row.mfr_name,
            mfr_number: row.mfr_number,
            units_sold_qty: parseInt(row.units_sold_qty),
            total_comm_and_proposed_sales: parseFloat(row.total_comm_and_proposed_sales),
            commercial_price_list: parseFloat(row.commercial_price_list),
            mfc_price: parseFloat(row.mfc_price),
            tc_price: row.tc_price ? parseFloat(row.tc_price) : null,
            tc_total_sales: row.tc_total_sales ? parseFloat(row.tc_total_sales) : null,
            proposed_price: parseFloat(row.proposed_price),
            proposed_total_sales: row.proposed_total_sales ? parseFloat(row.proposed_total_sales) : null,
            upload_batch_id: new Date().getTime().toString()
          }]);

        if (insertError) throw insertError;
        status.successful++;
      } catch (err) {
        console.error('Import error:', err);
        status.failed++;
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
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Import Price Analysis Data</h2>
        <p className="text-sm text-gray-600">Upload a CSV file containing price analysis data</p>
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

      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile && selectedFile.type === 'text/csv') {
              setFile(selectedFile);
              setError(null);
            } else {
              setError('Please upload a CSV file');
            }
          }}
          id="file-upload"
        />
        
        {file ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-gray-700">
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
              <label
                htmlFor="file-upload"
                className="text-blue-500 hover:text-blue-600 cursor-pointer"
              >
                browse
              </label>
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
              <AlertCircle size={16} />
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

export default ImportData;