import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, AlertCircle, Download } from 'lucide-react';
import Papa from 'papaparse';
import { supabase } from '../../lib/supabase';
import { calculateDiscountPercentage, calculateTotalCommercialSales, isProposedPriceLteMfc } from '../../utils/calculations';

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
  const [dragActive, setDragActive] = useState(false);
  const [cancelImport, setCancelImport] = useState(false);
  const importCancelledRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Reset cancel flag when component unmounts or when starting a new import
  useEffect(() => {
    return () => {
      importCancelledRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
    'L39',
    'IT-001',
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
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

  const validateRow = (row: any, rowIndex: number): boolean => {
    const requiredFields = [
      'sin',
      'item_number',
      'mfr_name',
      'mfr_number'
    ];

    const numericFields = [
      'units_sold_qty',
      'total_comm_and_proposed_sales',
      'total_commercial_sales',
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
        throw new Error(`Row ${rowIndex + 1}: Missing required field: ${field}`);
      }
    }

    // Initialize numeric fields with default values if missing
    numericFields.forEach(field => {
      if (!row[field]) {
        row[field] = 0;
      }
    });

    // Validate and convert numeric fields
    for (const field of numericFields) {
      if (row[field]) {
        // Remove any currency symbols, commas and whitespace
        const cleanValue = row[field].toString().replace(/[$,\s]/g, '');
        const numValue = parseFloat(cleanValue);
        
        if (isNaN(numValue)) {
          throw new Error(`Row ${rowIndex + 1}: Invalid numeric value for ${field}: ${row[field]}`);
        }
        
        // Update the row with the cleaned numeric value
        row[field] = numValue;
      }
    }

    // Calculate discounts based on commercial price list if all required values are present
    if (row.commercial_price_list) {
      if (row.mfc_price) {
        row.mfc_discount = calculateDiscountPercentage(row.commercial_price_list, row.mfc_price);
      }

      if (row.tc_price) {
        row.tc_discount = calculateDiscountPercentage(row.commercial_price_list, row.tc_price);
      }

      if (row.proposed_price) {
        row.proposed_discount = calculateDiscountPercentage(row.commercial_price_list, row.proposed_price);
      }
    }

    // Calculate total commercial sales if both values are present
    if (row.total_comm_and_proposed_sales !== undefined && row.proposed_total_sales !== undefined) {
      row.total_commercial_sales = calculateTotalCommercialSales(row.total_comm_and_proposed_sales, row.proposed_total_sales);

      // Validate the calculated value
      if (row.total_commercial_sales < 0) {
        throw new Error(`Row ${rowIndex + 1}: Total commercial sales cannot be negative (${row.total_commercial_sales})`);
      }
    }

    // Determine if proposed price is less than or equal to MFC price
    if (row.proposed_price !== undefined && row.mfc_price !== undefined) {
      row.is_proposed_price_lte_mfc = isProposedPriceLteMfc(row.proposed_price, row.mfc_price);
    } else {
      row.is_proposed_price_lte_mfc = 'NO'; // Default value if either price is missing
    }

    return true;
  };

  const processImport = async (items: any[]) => {
    // Get the current user's ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('You must be logged in to import data');
    }

    const batchId = new Date().getTime().toString();
    const status: ImportStatus = {
      total: items.length,
      processed: 0,
      successful: 0,
      failed: 0
    };

    // Reset cancel flag
    importCancelledRef.current = false;
    setCancelImport(false);
    
    // Create a new AbortController for this import
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      for (let i = 0; i < items.length; i++) {
        // Check if import has been cancelled
        if (importCancelledRef.current || signal.aborted) {
          setError('Import cancelled by user');
          break;
        }

        try {
          validateRow(items[i], i);

          const { error: insertError } = await supabase
            .from('price_analysis')
            .insert({
              ...items[i],
              upload_batch_id: batchId,
              created_by: user.id
            });

          if (insertError) throw insertError;

          status.successful++;
        } catch (err) {
          console.error('Import error:', err);
          status.failed++;
        }
        
        status.processed++;
        setStatus({ ...status });

        // Add a small delay to allow UI updates and cancellation checks
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Import cancelled by user');
      } else {
        throw err;
      }
    }

    return status;
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError(null);
    setStatus(null);
    setCancelImport(false);
    importCancelledRef.current = false;

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

          try {
            const finalStatus = await processImport(results.data);
            
            if (importCancelledRef.current) {
              // If import was cancelled, automatically refresh after a short delay
              setTimeout(() => {
                onComplete();
              }, 1500);
            } else if (finalStatus.successful > 0) {
              setTimeout(() => {
                onComplete();
              }, 1500);
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import data');
          } finally {
            setImporting(false);
            abortControllerRef.current = null;
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

  const handleCancelImport = () => {
    importCancelledRef.current = true;
    setCancelImport(true);
    setError('Import cancellation requested. Finishing current batch...');
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Automatically refresh after a short delay
    setTimeout(() => {
      onComplete();
    }, 1500);
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

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
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

          {importing && !cancelImport && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleCancelImport}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Cancel Import
              </button>
            </div>
          )}

          {cancelImport && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span>Cancelling import... Please wait while current operations complete.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportData;